"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  X,
  Check,
} from "lucide-react";
import {
  FaXTwitter,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa6";
import { cn } from "@/lib/utils";
import type { ContactInfo } from "@/sanity/lib/types";

// ─── Form schema ───────────────────────────────────────────────────────────────
const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export function ContactPageClient({
  contactInfo,
}: {
  contactInfo: ContactInfo | null;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "Portfolio Contact Form Submission",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setSubmitStatus("success");
        reset();
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const email = contactInfo?.email ?? "sunfisazzad@gmail.com";
  const phone = contactInfo?.phone ?? "01309605222";
  const location = contactInfo?.location ?? "Dhaka, Bangladesh";
  const socialLinks = contactInfo?.socialLinks ?? [];

  return (
    <div className="w-full min-h-[calc(100vh-160px)] bg-[#000000] text-white relative z-10 px-4 md:px-[5%] lg:px-[60px] pt-24 md:pt-52 pb-20 flex flex-col justify-start overflow-hidden font-sans">
      {/* Giant background text "Contact Me" */}
      <div
        className="absolute top-4 md:top-8 left-0 w-full px-4 md:px-[5%] lg:px-[60px] text-white/[0.10] font-black select-none pointer-events-none tracking-tighter leading-none z-0 overflow-hidden font-sans"
        style={{
          fontSize: "clamp(60px, 18vw, 280px)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 95%)",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 95%)",
        }}
      >
        Contact Me
      </div>

      {/* 2. HERO + FORM SECTION */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-[48px] max-w-[90vw] mx-auto w-full mb-16 z-10 items-center">

        {/* Left column */}
        <div className="relative z-10 space-y-8 flex flex-col justify-center">
          <div className="space-y-4">
            <h2 className="text-[36px] font-bold text-white tracking-tight flex items-center gap-2 font-sans">
              Reach out <span className="text-white/90">↗</span>
            </h2>
            <p className="text-white/50 text-[14px] leading-relaxed max-w-md font-sans">
              Looking to collaborate on a machine learning project, have questions about my research, or just want to connect? Drop a message here and I&apos;ll get back to you as soon as possible.
            </p>
          </div>

          {/* Checklist */}
          <div className="space-y-4">
            {[
              "Personalized assistance",
              "Timely response",
              "Comprehensive support",
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/[0.08] flex items-center justify-center text-white/80">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-white/40 text-[13px] font-sans">{item}</span>
              </div>
            ))}
          </div>

          {/* Social icons row */}
          <div className="flex gap-3 pt-2">
            {[
              { icon: FaXTwitter, url: socialLinks.find(s => s.platform.toLowerCase() === 'x')?.url ?? 'https://x.com/SUNFI15' },
              { icon: FaFacebook, url: socialLinks.find(s => s.platform.toLowerCase() === 'facebook')?.url ?? 'https://www.facebook.com/sazzadsunfi/' },
              { icon: FaInstagram, url: socialLinks.find(s => s.platform.toLowerCase() === 'instagram')?.url ?? 'https://www.instagram.com/sazzadsunfi/' },
            ].map((soc, idx) => {
              const Icon = soc.icon;
              return (
                <a
                  key={idx}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/[0.05] border border-white/[0.08] rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.1] hover:border-white/[0.15] transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Right column (Form) */}
        <div className="relative z-10 bg-[#0a0a0a]/80 border border-white/[0.08] rounded-2xl p-6 w-full shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" value="Portfolio Contact Form Submission" {...register("subject")} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <input
                  id="name"
                  type="text"
                  placeholder="Name"
                  {...register("name")}
                  className="w-full px-4 py-3 bg-[#121212]/60 border border-white/[0.08] text-white placeholder-white/30 rounded-[10px] focus:outline-none focus:ring-1 focus:ring-white/20 transition-all duration-300 text-sm font-sans"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 font-sans">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  {...register("email")}
                  className="w-full px-4 py-3 bg-[#121212]/60 border border-white/[0.08] text-white placeholder-white/30 rounded-[10px] focus:outline-none focus:ring-1 focus:ring-white/20 transition-all duration-300 text-sm font-sans"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 font-sans">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <textarea
                id="message"
                placeholder="Message"
                rows={5}
                {...register("message")}
                className="w-full px-4 py-3 bg-[#121212]/60 border border-white/[0.08] text-white placeholder-white/30 rounded-[10px] focus:outline-none focus:ring-1 focus:ring-white/20 transition-all duration-300 text-sm resize-none h-[120px] font-sans"
              />
              {errors.message && (
                <p className="text-red-500 text-xs mt-1 font-sans">{errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[52px] bg-white text-black font-bold rounded-full hover:bg-white/90 active:scale-[0.99] transition-all duration-200 flex items-center justify-center text-sm shadow-md font-sans"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>

            {submitStatus === "success" && (
              <p className="text-green-500 text-center text-xs mt-2 p-2 bg-green-500/10 rounded-md border border-green-500/20 font-sans">
                Your message has been sent successfully.
              </p>
            )}
            {submitStatus === "error" && (
              <p className="text-red-500 text-center text-xs mt-2 p-2 bg-red-500/10 rounded-md border border-red-500/20 font-sans">
                There was an error sending your message. Please try again.
              </p>
            )}
          </form>
        </div>
      </div>

      {/* 3. BOTTOM INFO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] max-w-[90vw] mx-auto w-full z-10">
        {/* Email Card */}
        <div className="relative bg-[#0a0a0a]/80 border border-white/[0.08] rounded-[14px] p-6 flex flex-col items-start gap-4 hover:border-white/15 transition-colors shadow-lg hover:shadow-2xl backdrop-blur-md">
          <div className="absolute top-6 right-6 w-1.5 h-1.5 rounded-full bg-white/15" />
          <div className="w-10 h-10 bg-white/[0.06] border border-white/[0.1] rounded-lg flex items-center justify-center text-white">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white text-[15px] font-medium mb-1 font-sans">Email me</h3>
            <a href={`mailto:${email}`} className="text-white/40 text-[13px] hover:text-white/60 transition-colors font-sans">
              {email}
            </a>
          </div>
        </div>

        {/* Phone Card */}
        <div className="relative bg-[#0a0a0a]/80 border border-white/[0.08] rounded-[14px] p-6 flex flex-col items-start gap-4 hover:border-white/15 transition-colors shadow-lg hover:shadow-2xl backdrop-blur-md">
          <div className="absolute top-6 right-6 w-1.5 h-1.5 rounded-full bg-white/15" />
          <div className="w-10 h-10 bg-white/[0.06] border border-white/[0.1] rounded-lg flex items-center justify-center text-white">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white text-[15px] font-medium mb-1 font-sans">Call me</h3>
            <a href={`tel:${phone}`} className="text-white/40 text-[13px] hover:text-white/60 transition-colors font-sans">
              {phone}
            </a>
          </div>
        </div>

        {/* Location Card */}
        <div className="relative bg-[#0a0a0a]/80 border border-white/[0.08] rounded-[14px] p-6 flex flex-col items-start gap-4 hover:border-white/15 transition-colors shadow-lg hover:shadow-2xl backdrop-blur-md">
          <div className="absolute top-6 right-6 w-1.5 h-1.5 rounded-full bg-white/15" />
          <div className="w-10 h-10 bg-white/[0.06] border border-white/[0.1] rounded-lg flex items-center justify-center text-white">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white text-[15px] font-medium mb-1 font-sans">My location</h3>
            <span className="text-white/40 text-[13px] font-sans">{location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
