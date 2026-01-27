"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { authService } from "@/services/auth.service";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useEffect } from "react";

export default function Home() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Load saved credentials on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLogin = localStorage.getItem("rememberedLogin");
      const savedPassword = localStorage.getItem("rememberedPassword");
      if (savedLogin) {
        setLogin(savedLogin);
        if (savedPassword) {
          setPassword(savedPassword);
        }
        setRememberMe(true);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await authService.login(login, password);

      // Handle "Remember Me"
      if (typeof window !== "undefined") {
        if (rememberMe) {
          localStorage.setItem("rememberedLogin", login);
          localStorage.setItem("rememberedPassword", password);
        } else {
          localStorage.removeItem("rememberedLogin");
          localStorage.removeItem("rememberedPassword");
        }
      }

      console.log("Login successful");
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login failed:", err);
      const msg = err.response?.data?.message || "Identifiants invalides (Login ou mot de passe incorrect)";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] dark:bg-[#0f172a] font-sans px-4 transition-colors duration-500">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-[#1e293b] rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-100 dark:border-slate-800 transition-all">
          <div className="flex flex-col items-center mb-10">
            <div className="relative w-24 h-24 mb-6 bg-white rounded-2xl shadow-lg p-2 overflow-hidden">
              <Image
                src="/logo.png"
                alt="Gestion Logo"
                fill
                className="object-contain p-2"
                priority
              />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Bienvenue
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-center">
              Connectez-vous à votre espace gestion
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium animate-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="login"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1"
              >
                Identifiant
              </label>
              <input
                id="login"
                name="login"
                type="text"
                autoComplete="username"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Entrez votre identifiant..."
                required
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1"
                >
                  Mot de passe
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-green-600 focus:ring-green-500 cursor-pointer"
                />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                  Se souvenir de moi
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-2xl shadow-lg shadow-green-500/20 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center ${isLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Connexion en cours...</span>
                </div>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-slate-400 dark:text-slate-600 text-xs">
          © 2026 Shalimar Box. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
