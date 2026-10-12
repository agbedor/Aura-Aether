"use client";

import React, { useEffect, useState } from "react";
import { Mail, Phone, MapPin, CheckCircle2, Send, Clock, Sparkles } from "lucide-react";

export default function ContactPage() {
  const [siteContent, setSiteContent] = useState({
    contactEyebrow: "WE ARE HERE TO HELP",
    contactTitle: "Contact Aura & Aether",
    contactDescription: "Questions about a fragrance or an order? We would love to hear from you.",
    contactEmail: "concierge@aura-aether.com",
    contactPhone: "+233 (0) 24 892 4110",
    contactAddress: "Suite 4B, The Meridian Galleria, Airport Residential Area, Accra, Ghana",
  });

  useEffect(() => {
    fetch("/api/site-settings").then((res) => res.ok ? res.json() : null).then((data) => {
      if (data?.settings) setSiteContent((current) => ({ ...current, ...data.settings }));
    }).catch(() => undefined);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Fragrance Consultation",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    // Simulate consultation submission
    setTimeout(() => {
      setIsSending(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "Fragrance Consultation", message: "" });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FCFBF9] py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8C827A] block mb-2">
            {siteContent.contactEyebrow}
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1C1917]">
            {siteContent.contactTitle}
          </h1>
          <p className="mt-3 text-sm text-[#6B635B] font-light leading-relaxed">
            {siteContent.contactDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Contact Info & Boutique */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-[#ECE5DD] p-8 space-y-6 shadow-2xs">
              <h3 className="font-serif-luxury text-xl font-semibold text-[#1C1917] pb-4 border-b border-[#EFE9E2]">
                Atelier &amp; Flagship Showroom
              </h3>

              <div className="space-y-5 text-xs text-[#5C554F]">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-[#FAF5EE] text-[#C59B4B] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-[#1C1917] text-sm">Flagship Boutique</h5>
                    <p className="mt-0.5 leading-relaxed text-[#78716C]">
                      {siteContent.contactAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-[#FAF5EE] text-[#C59B4B] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-[#1C1917] text-sm">Concierge Telephone</h5>
                    <p className="mt-0.5 text-[#78716C]">+233 (0) 24 892 4110</p>
                    <p className="text-[11px] text-[#A89F95]">Mon - Sat: 9:00 AM - 6:30 PM GMT</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-[#FAF5EE] text-[#C59B4B] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-[#1C1917] text-sm">Electronic Mail</h5>
                    <p className="mt-0.5 text-[#78716C]">concierge@aura-aether.com</p>
                    <p className="text-[11px] text-[#A89F95]">orders@aura-aether.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-[#FAF5EE] text-[#C59B4B] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-[#1C1917] text-sm">Private Appointments</h5>
                    <p className="mt-0.5 text-[#78716C]">
                      Private one-on-one scent profiling sessions available by reservation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#ECE5DD] p-8 sm:p-10 shadow-sm">
            <h3 className="font-serif-luxury text-2xl font-medium text-[#1C1917] mb-2">
              Send a Message
            </h3>
            <p className="text-xs text-[#78716C] mb-8 font-light">
              We respond to all connoisseur inquiries within 24 operational hours.
            </p>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#ECFDF5] text-[#10B981] flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif-luxury text-2xl font-medium text-[#1C1917]">
                  Thank you for reaching out
                </h4>
                <p className="text-xs text-[#78716C] max-w-sm mx-auto leading-relaxed">
                  Your message has been safely received by our Accra atelier team. We look forward
                  to assisting you.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 rounded-full border border-[#D5CDC4] text-xs font-semibold text-[#4A443F] hover:bg-[#FAF7F4]"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443F] mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nana Kwame"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#FAF7F4] border border-[#DDD6CD] rounded-xl px-4 py-3 text-sm text-[#1C1917] placeholder-[#A89F95] focus:outline-none focus:border-[#1C1917]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443F] mb-1.5">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="nana@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#FAF7F4] border border-[#DDD6CD] rounded-xl px-4 py-3 text-sm text-[#1C1917] placeholder-[#A89F95] focus:outline-none focus:border-[#1C1917]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443F] mb-1.5">
                    Inquiry Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#FAF7F4] border border-[#DDD6CD] rounded-xl px-4 py-3 text-sm text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
                  >
                    <option value="Fragrance Consultation">Personal Fragrance Consultation</option>
                    <option value="Order Tracking & Support">Order Tracking &amp; Delivery Support</option>
                    <option value="Gift Coffret Customization">Bespoke Gift Coffrets &amp; Events</option>
                    <option value="Wholesale Inquiry">Stockist &amp; Corporate Inquiries</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443F] mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe what scent profile or inquiry you have in mind..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#FAF7F4] border border-[#DDD6CD] rounded-xl px-4 py-3 text-sm text-[#1C1917] placeholder-[#A89F95] focus:outline-none focus:border-[#1C1917]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-4 px-6 rounded-full bg-[#1C1917] text-[#FAF8F5] text-xs font-bold uppercase tracking-widest hover:bg-[#38332E] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60 mt-4"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSending ? "Transmitting..." : "Submit Inquiry"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
