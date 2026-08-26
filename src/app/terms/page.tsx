import { Metadata } from "next";
import { TermsPageClient } from "@/components/legal/TermsPageClient";

export const metadata: Metadata = {
  title: "Terms & Conditions | Khondoker Sazzad Sunfi",
  description:
    "Terms and conditions for accessing and using Khondoker Sazzad Sunfi's software engineering and AI research portfolio.",
};

export default function TermsPage() {
  return <TermsPageClient />;
}
