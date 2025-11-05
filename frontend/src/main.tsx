import { createRoot } from 'react-dom/client'
import { initSentry } from '@/lib/sentry'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from '@/context/AuthContext'

// Initialize Sentry for error tracking
initSentry();

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);