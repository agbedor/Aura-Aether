"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "Accra",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const res = await register(formData);
    if (res.success) {
      router.push("/account");
    } else {
      setError(res.error || "Failed to create account");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#FCFBF9] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-[#ECE5DD] p-8 sm:p-10 shadow-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8C827A] block mb-1">
            HAUTE PERFUMERY CIRCLE
          </span>
          <h1 className="font-serif-luxury text-3xl font-medium text-[#1C1917]">
            Create an <span className="italic font-serif-luxury">Account.</span>
          </h1>
          <p className="text-xs text-[#78716C] mt-2 font-light">
            Enjoy streamlined checkouts and track your previous orders.
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
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="Amara Mensah"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#FAF7F4] border border-[#DDD6CD] rounded-xl px-4 py-3 text-sm text-[#1C1917] placeholder-[#A89F95] focus:outline-none focus:border-[#1C1917]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443F] mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="amara@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#FAF7F4] border border-[#DDD6CD] rounded-xl px-4 py-3 text-sm text-[#1C1917] placeholder-[#A89F95] focus:outline-none focus:border-[#1C1917]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443F] mb-1.5">
                Password *
              </label>
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-[#FAF7F4] border border-[#DDD6CD] rounded-xl px-4 py-3 text-sm text-[#1C1917] placeholder-[#A89F95] focus:outline-none focus:border-[#1C1917]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443F] mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+233 24 123 4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#FAF7F4] border border-[#DDD6CD] rounded-xl px-4 py-3 text-sm text-[#1C1917] placeholder-[#A89F95] focus:outline-none focus:border-[#1C1917]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443F] mb-1.5">
                City / Region
              </label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-[#FAF7F4] border border-[#DDD6CD] rounded-xl px-4 py-3 text-sm text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
              >
                <option value="Accra">Greater Accra</option>
                <option value="Kumasi">Kumasi</option>
                <option value="Takoradi">Sekondi-Takoradi</option>
                <option value="Cape Coast">Cape Coast</option>
                <option value="Tamale">Tamale</option>
                <option value="Other Ghana Location">Other Location</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443F] mb-1.5">
              Default Delivery Address
            </label>
            <input
              type="text"
              placeholder="e.g. 14 Senchi Street, Airport Residential"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-[#FAF7F4] border border-[#DDD6CD] rounded-xl px-4 py-3 text-sm text-[#1C1917] placeholder-[#A89F95] focus:outline-none focus:border-[#1C1917]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-full bg-[#1C1917] text-[#FAF8F5] text-xs font-bold uppercase tracking-widest hover:bg-[#38332E] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60 mt-4"
          >
            <span>{isLoading ? "Creating Account..." : "Register Account"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-[#78716C]">
          <p>
            Already have an account?{" "}
            <Link href="/login" className="text-[#1C1917] font-semibold underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
