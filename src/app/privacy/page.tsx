import { Metadata } from "next";
import { PrivacyPolicyClient } from "@/components/legal/PrivacyPolicyClient";

export const metadata: Metadata = {
  title: "Privacy Policy | Khondoker Sazzad Sunfi",
  description:
    "Privacy policy and data protection guidelines for Khondoker Sazzad Sunfi's software engineering and AI research portfolio.",
};

export default function PrivacyPage() {
  return <PrivacyPolicyClient />;
}
