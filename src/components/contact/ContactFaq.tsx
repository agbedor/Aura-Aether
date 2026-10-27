"use client";

import { useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";

const questions = [
  {
    question: "How do I find my signature scent?",
    answer:
      "Explore the fragrance collection and read each scent description for its notes and character. If you would like a more personal recommendation, send us a message and tell us what you usually enjoy wearing.",
  },
  {
    question: "How is delivery arranged?",
    answer:
      "After you place an order, we’ll call to confirm your delivery location and arrange an Uber delivery. The courier cost is discussed with you before dispatch and is not added to your online payment.",
  },
  {
    question: "Which payment methods can I use?",
    answer:
      "Checkout is completed securely through Paystack. Your order is confirmed once the payment has been completed.",
  },
  {
    question: "Can I check the status of my order?",
    answer:
      "Sign in and visit Order Tracking in your account to see the latest status. If you need help, contact us with your order details.",
  },
  {
    question: "Can you help me choose a fragrance as a gift?",
    answer:
      "Of course. Browse our gift sets or use the contact form to share the occasion and the kind of scents the recipient enjoys. We’ll help you find a thoughtful option.",
  },
];

export default function ContactFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-white px-5 py-16 text-[#17110F] sm:px-8 sm:py-20 lg:px-[4vw] lg:py-24">
      <div className="mx-auto">
        <header className="mb-10 flex flex-col justify-between gap-6 sm:mb-12 sm:flex-row sm:items-end">
          <p className="text-lg leading-snug text-[#5C554F] sm:text-xl">
            Got questions?
            <br />
            Say less, we’ve got answers.
          </p>
          <h2 id="faq-title" className="flex items-center gap-3 font-serif-luxury text-6xl italic leading-none tracking-[-0.06em] sm:text-7xl lg:text-8xl">
            FAQ’s <ArrowUpRight aria-hidden="true" className="h-10 w-10 stroke-[1.3] sm:h-14 sm:w-14" />
          </h2>
        </header>

        <div className="border-t border-[#B8B5B2]">
          {questions.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={item.question} className="group border-b border-[#B8B5B2]">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left sm:py-7"
                >
                  <span className="text-base font-medium uppercase tracking-[-0.035em] sm:text-xl lg:text-2xl">
                    {item.question}
                  </span>
                  <Plus
                    aria-hidden="true"
                    className={`h-6 w-6 shrink-0 stroke-[1.3] transition-transform duration-300 sm:h-7 sm:w-7 ${isOpen ? "rotate-45" : ""}`}
                  />
                </button>
                <div id={`faq-answer-${index}`} hidden={!isOpen} className="grid grid-cols-1 pb-7 md:grid-cols-2">
                  <p className="text-base leading-relaxed text-[#625E5B] md:col-start-2 lg:text-lg">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
