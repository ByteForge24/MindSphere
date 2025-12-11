const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Find or create a user from an OAuth profile.
 * If user with same email exists (local account), link the OAuth provider.
 */
async function findOrCreateOAuthUser(provider, providerId, profile) {
  const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
  const name = profile.displayName || (profile.username ? profile.username : 'User');
  const profilePicture = profile.photos && profile.photos[0] ? profile.photos[0].value : '';

  // First try to find by provider + providerId
  let user = await User.findOne({ provider, providerId });
  if (user) return user;

  // Try to find by email — link OAuth to existing local account
  if (email) {
    user = await User.findOne({ email });
    if (user) {
      // User exists with this email — update with OAuth info if not already set
      if (user.provider === 'local') {
        user.provider = provider;
        user.providerId = providerId;
        if (!user.profilePicture && profilePicture) {
          user.profilePicture = profilePicture;
        }
        await user.save();
      }
      return user;
    }
  }

  // Create new user
  user = new User({
    name,
    email: email || `${provider}_${providerId}@oauth.placeholder`,
    provider,
    providerId,
    profilePicture,
    role: 'student',
  });
  await user.save();
  logger.info('OAuth user created', { provider, userId: user._id });
  return user;
}

function configurePassport() {
  // Serialize/deserialize (we use JWT so these are minimal)
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).select('-password');
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  // --- Google Strategy ---
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
          scope: ['profile', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const user = await findOrCreateOAuthUser('google', profile.id, profile);
            done(null, user);
          } catch (err) {
            logger.error('Google OAuth error', { error: err.message });
            done(err, null);
          }
        }
      )
    );
    logger.info('Google OAuth strategy configured');
  }

  // --- GitHub Strategy ---
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL: process.env.GITHUB_CALLBACK_URL || '/api/auth/github/callback',
          scope: ['user:email'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const user = await findOrCreateOAuthUser('github', profile.id, profile);
            done(null, user);
          } catch (err) {
            logger.error('GitHub OAuth error', { error: err.message });
            done(err, null);
          }
        }
      )
    );
    logger.info('GitHub OAuth strategy configured');
  }
}

module.exports = { configurePassport };
