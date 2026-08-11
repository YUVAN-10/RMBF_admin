import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, Loader2 } from "lucide-react";
import { loginAdmin } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");
  
  const { isAuthenticated, authError, setAuthError, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Automatically navigate away if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Reset submitting state if an authentication error occurs in AuthContext
  useEffect(() => {
    if (authError) {
      setIsSubmitting(false);
    }
  }, [authError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setAuthError("");

    if (!email.trim() || !password.trim()) {
      setLocalError("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      await loginAdmin(email, password);
      // Wait for AuthContext's onAuthStateChanged to verify Firestore role and update isAuthenticated
    } catch (error) {
      setLocalError(error.message);
      setIsSubmitting(false);
    }
  };

  const displayError = localError || authError;
  const isLoading = isSubmitting || authLoading;

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-card p-8 shadow-lg animate-fade-in">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center p-3 rounded-xl bg-white shadow-sm border border-border/60 mb-4 w-full">
            <img 
              src="/logo.png" 
              alt="Rotary RMBF Erode United Logo" 
              className="h-16 w-auto max-w-full object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-text">
            Welcome to RMBF Erode United
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Please log in with your admin credentials.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text">
              Email Address
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-text-secondary" aria-hidden="true" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={[
                  "block w-full rounded-lg border bg-bg py-2.5 pl-10 pr-3 text-sm text-text placeholder:text-text-secondary focus:outline-none focus:ring-1",
                  displayError 
                    ? "border-danger focus:border-danger focus:ring-danger" 
                    : "border-border focus:border-primary focus:ring-primary"
                ].join(" ")}
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setLocalError("");
                  setAuthError("");
                }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text">
              Password
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-text-secondary" aria-hidden="true" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={[
                  "block w-full rounded-lg border bg-bg py-2.5 pl-10 pr-3 text-sm text-text placeholder:text-text-secondary focus:outline-none focus:ring-1",
                  displayError 
                    ? "border-danger focus:border-danger focus:ring-danger" 
                    : "border-border focus:border-primary focus:ring-primary"
                ].join(" ")}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setLocalError("");
                  setAuthError("");
                }}
              />
            </div>
            {displayError && (
              <p className="mt-2 text-sm text-danger animate-fade-in">{displayError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !email.trim() || !password.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              "Login securely"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
