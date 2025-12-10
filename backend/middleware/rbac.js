/**
 * Role-Based Access Control (RBAC) Middleware
 * 
 * Usage:
 *   const { authorize } = require('../middleware/rbac');
 *   router.delete('/:id', auth, authorize('admin'), handler);
 *   router.put('/:id', auth, authorize('admin', 'moderator'), handler);
 */

const ApiResponse = require('../utils/apiResponse');

/**
 * Check if user has one of the allowed roles
 * Must be used AFTER auth middleware (requires req.user)
 * @param  {...string} roles - Allowed roles
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, 'Authentication required');
    }

    if (!req.user.role || !roles.includes(req.user.role)) {
      return ApiResponse.forbidden(res, 'Insufficient permissions');
    }

    next();
  };
}

module.exports = { authorize };
