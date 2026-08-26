"use client";

import { ContactCard } from "./ContactCard";

export function ContactCTA({ contactInfo, profile }: { contactInfo?: any; profile?: any }) {
  return (
    <section id="contact" className="py-24 bg-transparent relative overflow-hidden flex flex-col items-center justify-center px-6">
      <h2 className="text-center text-3xl md:text-5xl font-bold text-white mb-4">
        Ready to Start Your Next Project?
      </h2>
      <p className="text-center text-gray-400 text-sm md:text-base mb-12">
        Let's work together to build something meaningful, impactful, and designed to stand out.
      </p>
      <ContactCard />
    </section>
  );
}
