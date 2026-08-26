"use client";

import { motion } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaFacebook,
  FaInstagram,
  FaDiscord,
  FaTelegram,
  FaWhatsapp,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa6";
import { cn } from "@/lib/utils";

const CONNECT_LINKS = [
  {
    name: "GitHub",
    icon: FaGithub,
    color: "group-hover:text-white",
    url: "https://github.com/sunfi-x",
  },
  {
    name: "LinkedIn",
    icon: FaLinkedin,
    color: "group-hover:text-[#0A66C2]",
    url: "https://www.linkedin.com/in/khondoker-sazzad-sunfi-3124a4325/",
  },
  {
    name: "X",
    icon: FaXTwitter,
    color: "group-hover:text-white",
    url: "https://x.com/SUNFI15",
  },
  {
    name: "Facebook",
    icon: FaFacebook,
    color: "group-hover:text-[#1877F2]",
    url: "https://www.facebook.com/sazzadsunfi/",
  },
  {
    name: "Instagram",
    icon: FaInstagram,
    color: "group-hover:text-[#E4405F]",
    url: "https://www.instagram.com/sazzadsunfi/",
  },
  {
    name: "Discord",
    icon: FaDiscord,
    color: "group-hover:text-[#5865F2]",
    url: "https://discord.com/users/sunfi_x",
  },
  {
    name: "Telegram",
    icon: FaTelegram,
    color: "group-hover:text-[#26A5E4]",
    url: "https://t.me/sunfi_x",
  },
  {
    name: "WhatsApp",
    icon: FaWhatsapp,
    color: "group-hover:text-[#25D366]",
    url: "https://wa.me/8801309605222",
  },
  {
    name: "Email",
    icon: FaEnvelope,
    color: "group-hover:text-[#EA4335]",
    url: "mailto:sunfisazzad@gmail.com",
  },
  {
    name: "Phone Call",
    icon: FaPhone,
    color: "group-hover:text-[#34B7F1]",
    url: "tel:01309605222",
  },
];

export function ConnectIcons() {
  return (
    <div className="w-full">
      <div className="flex flex-row flex-wrap gap-3">
        {CONNECT_LINKS.map((link, index) => {
          const IconComponent = link.icon;

          return (
            <motion.a
              key={link.name}
              href={link.url}
              target={link.name !== "Email" && link.name !== "Phone Call" ? "_blank" : undefined}
              rel={link.name !== "Email" && link.name !== "Phone Call" ? "noopener noreferrer" : undefined}
              aria-label={link.name}
              title={link.name === "Discord" ? "Discord: sunfi_x" : link.name}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              whileHover={{ y: -3, scale: 1.15 }}
              className={cn(
                "group relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-full",
                "bg-[rgba(10,10,10,0.7)] backdrop-blur-lg border border-white/10",
                "hover:border-[#FF003C]/80 hover:bg-black/90 transition-all duration-300",
                "shadow-[0_4px_10px_rgba(0,0,0,0.5)] hover:shadow-[0_0_15px_rgba(255,0,60,0.6)]"
              )}
            >
              {/* Subtle inner background glow on hover */}
              <div className="absolute inset-0 rounded-xl sm:rounded-full bg-gradient-to-br from-[#FF003C]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Icon */}
              <IconComponent
                className={cn(
                  "w-5 h-5 text-gray-400 transition-colors duration-300 relative z-10",
                  link.color
                )}
              />
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
