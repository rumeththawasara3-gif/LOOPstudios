import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, ShieldCheck, ArrowRight, Sparkles, AlertCircle, CheckCircle2, RotateCcw, ArrowLeft } from 'lucide-react';
import {
  auth,
  db,
  doc,
  setDoc,
  googleProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from '../firebase.ts';

interface ClientAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onSuccess?: () => void;
}

type AuthMode = 'signin' | 'signup' | 'reset';

export const ClientAuthModal: React.FC<ClientAuthModalProps> = ({
  isOpen,
  onClose,
  isDark,
  onSuccess,
}) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Check for redirect result on mount (for mobile and popup-blocked fallbacks)
  useEffect(() => {
    let isMounted = true;

    getRedirectResult(auth)
      .then(async (result) => {
        if (!isMounted) return;
        if (result?.user) {
          await saveUserProfile(
            result.user.uid,
            result.user.email || '',
            result.user.displayName || '',
            result.user.photoURL || ''
          );
          onSuccess?.();
          onClose();
        }
      })
      .catch((err) => {
        if (isMounted) {
          handleAuthError(err);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isOpen) return null;

  // Map Firebase Auth error codes into clean, human-friendly UI messages
  const handleAuthError = (err: unknown) => {
    console.error('Firebase Auth Exception:', err);
    const code = (err as any)?.code || '';
    const rawMessage = err instanceof Error ? err.message : String(err);

    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        setErrorMsg('Invalid email or password. Please verify your credentials or use Google Sign-In.');
        break;
      case 'auth/email-already-in-use':
        setErrorMsg('An account with this email already exists. Please sign in instead.');
        break;
      case 'auth/weak-password':
        setErrorMsg('Password should be at least 6 characters long.');
        break;
      case 'auth/invalid-email':
        setErrorMsg('Please enter a valid email address.');
        break;
      case 'auth/user-disabled':
        setErrorMsg('This account has been disabled. Please contact KULT Studios support.');
        break;
      case 'auth/too-many-requests':
        setErrorMsg('Too many unsuccessful attempts. Please wait a few moments or reset your password.');
        break;
      case 'auth/network-request-failed':
        setErrorMsg('Network error. Please check your internet connection and try again.');
        break;
      case 'auth/popup-closed-by-user':
        setErrorMsg('Google Sign-In was cancelled.');
        break;
      case 'auth/popup-blocked':
        setErrorMsg('Popup was blocked by your browser. Please allow popups or use email sign-in.');
        break;
      case 'auth/operation-not-allowed':
        setErrorMsg('This sign-in method is currently not enabled. Please contact support.');
        break;
      default:
        // Strip out "Firebase: Error (auth/...)" wrapping if present
        const cleaned = rawMessage
          .replace(/Firebase:\s*(Error\s*)?(\(auth\/[^)]+\)\.?)/i, '')
          .replace(/^Error:\s*/i, '')
          .trim();
        setErrorMsg(cleaned || 'Authentication failed. Please verify your credentials and try again.');
    }
  };

  const saveUserProfile = async (uid: string, userEmail: string, displayName?: string, photoURL?: string) => {
    try {
      await setDoc(
        doc(db, 'users', uid),
        {
          uid,
          email: userEmail || '',
          displayName: displayName || userEmail.split('@')[0],
          photoURL: photoURL || '',
          role: 'client',
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Could not cache user profile to users collection:', err);
    }
  };

  // Robust Google Sign-In with automatic fallback for popup blockers
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        await saveUserProfile(
          res.user.uid,
          res.user.email || '',
          res.user.displayName || '',
          res.user.photoURL || ''
        );
      }
      onSuccess?.();
      onClose();
    } catch (error: any) {
      if (error?.code === 'auth/popup-blocked' || error?.code === 'auth/cancelled-popup-request') {
        // Automatically switch to redirect mode so mobile browsers never show popup errors
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectErr) {
          handleAuthError(redirectErr);
        }
      } else if (error?.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Sign-in cancelled. Tap again when ready.');
      } else {
        handleAuthError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Email/Password and Password Reset Submissions
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    // 1. Password Reset Mode
    if (mode === 'reset') {
      setIsLoading(true);
      try {
        await sendPasswordResetEmail(auth, email.trim());
        setSuccessMsg(
          `Password reset link sent to ${email.trim()}! Please check your inbox (and spam folder) to reset your password.`
        );
      } catch (err) {
        handleAuthError(err);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // 2. Sign In / Sign Up Mode
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'signin') {
        const res = await signInWithEmailAndPassword(auth, email.trim(), password);
        if (res.user) {
          await saveUserProfile(res.user.uid, res.user.email || '', res.user.displayName || '');
        }
      } else {
        const res = await createUserWithEmailAndPassword(auth, email.trim(), password);
        if (res.user) {
          if (clientName.trim()) {
            try {
              await updateProfile(res.user, { displayName: clientName.trim() });
            } catch {}
          }
          await saveUserProfile(res.user.uid, res.user.email || '', clientName.trim() || res.user.displayName || '');
        }
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-md rounded-3xl p-6 sm:p-8 transition-all border shadow-2xl ${
          isDark
            ? 'bg-[#0E1015]/95 border-white/10 text-white'
            : 'bg-white/95 border-black/10 text-[#0A0A0C]'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-10 w-10 rounded-2xl bg-black/5 dark:bg-white/10 flex items-center justify-center mb-3">
            {mode === 'reset' ? (
              <RotateCcw className="w-5 h-5 text-cyan-400" />
            ) : (
              <Lock className="w-5 h-5 text-blue-500" />
            )}
          </div>
          <span className="font-mono text-[10px] tracking-widest uppercase text-blue-500 dark:text-blue-400 font-semibold mb-1">
            KULT Studios Portal
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight">
            {mode === 'signin' && 'Client Asset & Review Access'}
            {mode === 'signup' && 'Create Client Account'}
            {mode === 'reset' && 'Reset Portal Password'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
            {mode === 'reset'
              ? 'Enter your registered email and we will send you a secure link to reset your password.'
              : 'Log in to track project stages, review cuts with timecoded notes, and download master assets.'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span className="leading-snug">{successMsg}</span>
          </div>
        )}

        {/* Primary Action: Google Single Sign-On (in signin and signup modes) */}
        {mode !== 'reset' && (
          <>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-medium text-xs sm:text-sm bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/15 text-slate-800 dark:text-white transition-all shadow-sm active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative my-5 flex items-center justify-center">
              <div className="w-full border-t border-slate-200 dark:border-white/10" />
              <span className="absolute px-3 text-[10px] uppercase font-mono tracking-wider bg-[#F8F9FA] dark:bg-[#0E1015] text-slate-400">
                Or with email
              </span>
            </div>
          </>
        )}

        {/* Form Container */}
        <form onSubmit={handleEmailSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Client / Brand Name
              </label>
              <div className="relative">
                <Sparkles className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Acme Media or John Silva"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Client Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@brand.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              />
            </div>
          </div>

          {mode !== 'reset' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => switchMode('reset')}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-xs sm:text-sm bg-[#0A0A0C] text-white dark:bg-blue-600 dark:hover:bg-blue-500 hover:bg-slate-800 transition-all shadow-md active:scale-98 disabled:opacity-50 cursor-pointer mt-4"
          >
            <span>
              {mode === 'signin' && 'Sign In to Portal'}
              {mode === 'signup' && 'Create Client Profile'}
              {mode === 'reset' && (isLoading ? 'Sending Link...' : 'Send Password Reset Email')}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Mode Navigation Links */}
        <div className="mt-4 text-center">
          {mode === 'signin' && (
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
            >
              New client? Create an account
            </button>
          )}

          {mode === 'signup' && (
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
            >
              Already have an account? Sign In
            </button>
          )}

          {mode === 'reset' && (
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Sign In</span>
            </button>
          )}
        </div>

        {/* Security badge */}
        <div className="mt-5 pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Encrypted Client Vault · KULT Studios Sri Lanka</span>
        </div>
      </div>
    </div>
  );
};
