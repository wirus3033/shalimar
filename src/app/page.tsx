"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt with:", { email, password });
    // Navigate to dashboard
    router.push("/dashboard");
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
            <h1>
              Bienvenue
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-center">
              Connectez-vous à votre compte
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
              >
                Email ou Identifiant
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@exemple.com"
                required
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                >
                  Mot de passe
                </label>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-2xl shadow-[0_10px_20px_-10px_rgba(37,99,235,0.4)] transition-all transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Se connecter
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-slate-400 dark:text-slate-600 text-xs">
          © 2026 Gestion. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
