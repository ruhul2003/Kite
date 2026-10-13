"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User } from "lucide-react";
import GoogleIcon from "../../components/GoogleIcon";
import { GUEST_USER_TEMPLATE } from "../../data/mockData";
import { triggerGoogleSignIn } from "../../utils/googleAuth";
import { apiLogin, apiGoogleAuth, apiGuestAuth, apiRegister } from "../../utils/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const user = await apiLogin({ email: email.trim(), password });
      localStorage.setItem("kite_user", JSON.stringify(user));
      setIsLoading(false);
      router.push("/");
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "Invalid credentials.");
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    triggerGoogleSignIn(
      async (googleUser) => {
        const savedUser = await apiGoogleAuth(googleUser);
        localStorage.setItem("kite_user", JSON.stringify(savedUser));
        setIsLoading(false);
        router.push("/");
      },
      (err) => {
        setIsLoading(false);
        setError(err || "Google sign-in could not be completed.");
      }
    );
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    try {
      const guestUser = await apiGuestAuth();
      const fallback = {
        ...GUEST_USER_TEMPLATE,
        id: `user-guest-${Date.now()}`,
      };
      localStorage.setItem("kite_user", JSON.stringify(guestUser || fallback));
      setIsLoading(false);
      router.push("/");
    } catch {
      localStorage.setItem("kite_user", JSON.stringify(GUEST_USER_TEMPLATE));
      router.push("/");
    }
  };

  const handleQuickDemoLogin = async (type) => {
    setIsLoading(true);
    let user;
    if (type === "ruhul") {
      user = {
        name: "Ruhul Amin",
        email: "ruhul941020@gmail.com",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      };
      const saved = await apiGoogleAuth(user);
      localStorage.setItem("kite_user", JSON.stringify(saved));
      setIsLoading(false);
      router.push("/");
      return;
    } else if (type === "alex") {
      user = {
        name: "Alex Morgan",
        email: "alex@example.com",
        password: "alex_demo_password",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        bio: "Software developer and photography enthusiast.",
      };
      const saved = await apiRegister(user);
      localStorage.setItem("kite_user", JSON.stringify(saved));
      setIsLoading(false);
      router.push("/");
      return;
    } else if (type === "sarah") {
      user = {
        name: "Sarah Chen",
        email: "sarah@example.com",
        password: "sarah_demo_password",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        bio: "UI/UX Designer and visual artist.",
      };
      const saved = await apiRegister(user);
      localStorage.setItem("kite_user", JSON.stringify(saved));
      setIsLoading(false);
      router.push("/");
      return;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-[#1877f2]/20 selection:text-[#1877f2]">
      {/* Top / Main Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 md:py-16">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
          {/* Left Column: Clean Kite Identity */}
          <div className="lg:max-w-lg text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-[#1877f2] flex items-center justify-center text-white shadow-md shadow-[#1877f2]/20">
                <svg className="w-6 h-6 transform -rotate-12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L21 9L12 22L3 9L12 2Z" fillOpacity="0.3" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M12 2L12 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M3 9L21 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="11" r="2" fill="currentColor" />
                </svg>
              </div>

              <div>
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#1877f2]">
                  kite
                </h1>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-snug mb-3">
              Kite helps you connect and share with the people in your life.
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              A clean, focused social platform designed for conversations, ideas, and real connections.
            </p>

            {/* Quick 1-Click Demo Profiles */}
            <div className="mt-6 hidden lg:block">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                Quick Demo Accounts
              </p>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin("ruhul")}
                  className="bg-white dark:bg-slate-900 p-2.5 rounded-xl shadow-xs border border-slate-200 dark:border-slate-800 hover:border-[#1877f2] transition text-left group w-32 cursor-pointer"
                >
                  <div className="relative w-10 h-10 mb-1.5">
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                      alt="Ruhul"
                      className="w-full h-full rounded-full object-cover group-hover:scale-105 transition"
                    />
                    <span className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 p-0.5 rounded-full shadow">
                      <GoogleIcon className="w-3 h-3" />
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">Ruhul Amin</p>
                  <p className="text-[10px] text-slate-400 truncate">Google Auth</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin("alex")}
                  className="bg-white dark:bg-slate-900 p-2.5 rounded-xl shadow-xs border border-slate-200 dark:border-slate-800 hover:border-[#1877f2] transition text-left group w-32 cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                    alt="Alex"
                    className="w-10 h-10 rounded-full object-cover mb-1.5 group-hover:scale-105 transition"
                  />
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">Alex Morgan</p>
                  <p className="text-[10px] text-slate-400">Developer</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin("sarah")}
                  className="bg-white dark:bg-slate-900 p-2.5 rounded-xl shadow-xs border border-slate-200 dark:border-slate-800 hover:border-[#1877f2] transition text-left group w-32 cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
                    alt="Sarah"
                    className="w-10 h-10 rounded-full object-cover mb-1.5 group-hover:scale-105 transition"
                  />
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">Sarah Chen</p>
                  <p className="text-[10px] text-slate-400">Designer</p>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Login Card */}
          <div className="w-full max-w-md">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Sign in to Kite
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Enter your account details to continue
                </p>
              </div>

              {error && (
                <div className="p-3 text-xs bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-600 dark:text-rose-400 font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-3.5">
                <div>
                  <input
                    type="email"
                    required
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1877f2] transition"
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1877f2] transition pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#1877f2] hover:bg-[#166fe5] text-white font-semibold rounded-xl shadow-xs transition active:scale-[0.99] text-sm cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? "Signing in..." : "Log In"}
                </button>
              </form>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-medium text-[10px]">
                    or
                  </span>
                </div>
              </div>

              {/* Google Auth Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-xl shadow-xs transition flex items-center justify-center gap-3 text-xs sm:text-sm cursor-pointer"
              >
                <GoogleIcon className="w-4 h-4 shrink-0" />
                <span>Continue with Google</span>
              </button>

              {/* Guest Exploration Button */}
              <button
                type="button"
                onClick={handleGuestLogin}
                className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium rounded-xl transition flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Guest Access (Try without account)</span>
              </button>

              <div className="pt-2 text-center text-xs text-slate-500">
                <span>New to Kite? </span>
                <Link
                  href="/signup"
                  className="font-semibold text-[#1877f2] hover:underline"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Minimalist Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 py-4 px-6 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-[11px]">Kite</p>
        <div className="flex items-center gap-4 text-[11px]">
          <Link href="/signup" className="hover:text-[#1877f2]">Sign Up</Link>
          <Link href="/" className="hover:text-[#1877f2]">Explore Feed</Link>
          <span className="text-slate-500">© 2026 Kite</span>
        </div>
      </footer>
    </div>
  );
}
