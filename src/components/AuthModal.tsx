import React, { useState } from 'react';
import { X, User, Lock, Mail, Eye, EyeOff, ShieldCheck, Check, LogOut, ArrowRight, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminCreds: { email: string; pass: string };
  isAdminAuthenticated: boolean;
  onAdminLoginSuccess: () => void;
  onAdminLogout: () => void;
  onCustomerLoginSuccess?: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  adminCreds,
  isAdminAuthenticated,
  onAdminLoginSuccess,
  onAdminLogout,
  onCustomerLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [customerUser, setCustomerUser] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const trimmedEmail = email.trim().toLowerCase();
    const inputPass = password;

    // Strict in-memory credential check for admin
    if (
      trimmedEmail === adminCreds.email.toLowerCase() &&
      inputPass === adminCreds.pass
    ) {
      // Clear inputs immediately from memory
      setEmail('');
      setPassword('');
      setIsSubmitting(false);
      onAdminLoginSuccess();
      onClose();
      return;
    }

    // Customer / VIP Sign In simulation
    if (trimmedEmail.includes('@') && inputPass.length >= 4) {
      setCustomerUser(trimmedEmail);
      if (onCustomerLoginSuccess) {
        onCustomerLoginSuccess(trimmedEmail);
      }
      setEmail('');
      setPassword('');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setErrorMessage('Invalid email or password. Please verify your credentials and try again.');
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setErrorMessage(null);
    onClose();
  };

  const handleSignOutAdmin = () => {
    onAdminLogout();
    setEmail('');
    setPassword('');
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="relative bg-[#111111] border border-white/15 hover:border-gold/40 transition-colors rounded-xl max-w-md w-full text-[#E5E5E5] p-6 sm:p-8 shadow-2xl space-y-6"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-white/40 hover:text-white transition cursor-pointer p-1 rounded-full hover:bg-white/5"
          aria-label="Close Sign In Dialog"
          id="auth-modal-close-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pt-1">
          <div className="w-12 h-12 rounded-full bg-[#181611] border border-gold/40 flex items-center justify-center mx-auto text-[#C5A059]">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-fashion text-white tracking-wide font-light">
            Sign In
          </h2>
          <p className="text-xs text-white/50 font-light max-w-xs mx-auto">
            Access your curated fashion selections, saved boutique favorites, and personal orders.
          </p>
        </div>

        {/* State 1: Active Admin Session Status */}
        {isAdminAuthenticated ? (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-lg bg-[#181611] border border-gold/40 text-xs space-y-2">
              <div className="flex items-center gap-2 text-[#F1D592] font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>Admin Session Active</span>
              </div>
              <p className="text-white/60 text-[11px] leading-relaxed">
                You are currently authenticated in private temporary memory. No password or session data is stored on this device.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  onAdminLoginSuccess();
                  onClose();
                }}
                className="w-full py-3 rounded-sm bg-gold-gradient text-black font-semibold text-xs uppercase tracking-widest hover:brightness-110 transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#C5A059]/10"
                id="auth-enter-admin-panel-btn"
              >
                <span>Enter Admin Panel</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleSignOutAdmin}
                className="w-full py-2.5 rounded-sm bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
                id="auth-admin-logout-btn"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>End Admin Session & Log Out</span>
              </button>
            </div>
          </div>
        ) : customerUser ? (
          /* State 2: Customer Signed In */
          <div className="space-y-4 py-2 text-center">
            <div className="p-4 rounded-lg bg-[#141414] border border-white/10 text-xs space-y-2">
              <div className="flex items-center justify-center gap-2 text-emerald-400 font-semibold uppercase tracking-wider">
                <Check className="w-4 h-4" />
                <span>Signed In Successfully</span>
              </div>
              <p className="text-white/80 font-medium">{customerUser}</p>
              <p className="text-white/40 text-[11px]">
                Your personal preferences are active for this browsing session.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3 rounded-sm bg-gold-gradient text-black font-semibold text-xs uppercase tracking-widest hover:brightness-110 transition cursor-pointer"
                id="auth-continue-shopping-btn"
              >
                Continue Shopping
              </button>
              <button
                type="button"
                onClick={() => setCustomerUser(null)}
                className="w-full py-2 text-xs text-white/50 hover:text-white transition cursor-pointer"
                id="auth-customer-signout-btn"
              >
                Sign In with Different Account
              </button>
            </div>
          </div>
        ) : (
          /* State 3: Standard Sign In Form */
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {errorMessage && (
              <div className="p-3 bg-red-950/80 border border-red-500/40 text-red-200 text-xs rounded-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-white/70 text-[11px] uppercase tracking-wider font-medium">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  name="tredny_auth_email_field"
                  required
                  className="w-full bg-[#161616] border border-white/10 rounded-sm py-2.5 pl-9 pr-3 text-white focus:outline-none focus:border-[#C5A059] transition-colors placeholder:text-white/30"
                  id="auth-email-input"
                />
                <Mail className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-white/70 text-[11px] uppercase tracking-wider font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  name="tredny_auth_password_field"
                  required
                  className="w-full bg-[#161616] border border-white/10 rounded-sm py-2.5 pl-9 pr-10 text-white focus:outline-none focus:border-[#C5A059] transition-colors placeholder:text-white/30"
                  id="auth-password-input"
                />
                <Lock className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer p-0.5"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  id="auth-toggle-password-visibility-btn"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-sm bg-gold-gradient text-black font-semibold uppercase tracking-widest cursor-pointer hover:brightness-110 active:brightness-95 transition text-xs shadow-lg shadow-[#C5A059]/10 mt-2"
              id="auth-submit-btn"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>

            {/* Security Guarantee: Never Saved */}
            <div className="pt-4 border-t border-white/10 text-center space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-white/40 uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Zero-Storage Device Security</span>
              </div>
              <p className="text-[10px] text-white/30 font-light leading-normal max-w-xs mx-auto">
                All authentications operate strictly in transient memory. Passwords and credentials are never written to local storage, cookies, or any device cache.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
