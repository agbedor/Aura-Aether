"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Lock, Mail, ArrowRight, AlertCircle, Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const res = await login(email, password);
    if (res.success) {
      if (email.includes("admin")) {
        router.push("/admin");
      } else {
        router.push("/account");
      }
    } else {
      setError(res.error || "Invalid email or password");
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[80vh] bg-[#FCFBF9] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#ECE5DD] p-8 sm:p-10 shadow-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8C827A] block mb-1">
            CLIENT PORTAL
          </span>
          <h1 className="font-serif-luxury text-3xl font-medium text-[#1C1917]">
            Sign <span className="italic font-serif-luxury">In.</span>
          </h1>
          <p className="text-xs text-[#78716C] mt-2 font-light">
            Access your order history and fragrance preferences.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443F] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A89F95] absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="amara@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF7F4] border border-[#DDD6CD] rounded-xl pl-10 pr-4 py-3 text-sm text-[#1C1917] placeholder-[#A89F95] focus:outline-none focus:border-[#1C1917]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443F] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A89F95] absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FAF7F4] border border-[#DDD6CD] rounded-xl pl-10 pr-4 py-3 text-sm text-[#1C1917] placeholder-[#A89F95] focus:outline-none focus:border-[#1C1917]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-full bg-[#1C1917] text-[#FAF8F5] text-xs font-bold uppercase tracking-widest hover:bg-[#38332E] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60 mt-4"
          >
            <span>{isLoading ? "Signing in..." : "Sign In to Boutique"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Pills for Evaluation */}
        <div className="mt-8 pt-6 border-t border-[#EFE9E2] text-center space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#8C827A]">
            Quick Test Accounts:
          </p>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("amara@example.com", "password123")}
              className="text-[11px] px-3 py-1.5 rounded-full bg-[#FAF5EE] border border-[#E7DFD5] text-[#5C554F] hover:bg-[#F2ECE4] hover:text-[#1C1917]"
            >
              Customer Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("admin@aura-aether.com", "admin123")}
              className="text-[11px] px-3 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] font-medium hover:bg-[#FDE047]"
            >
              Admin Demo
            </button>
          </div>
        </div>

        {/* Links */}
        <div className="mt-6 text-center text-xs text-[#78716C] space-y-2">
          <p>
            Do not have an account?{" "}
            <Link href="/register" className="text-[#1C1917] font-semibold underline">
              Create an account
            </Link>
          </p>
          <p>
            <Link href="/shop" className="text-[#8C827A] hover:underline">
              Continue shopping as guest →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
