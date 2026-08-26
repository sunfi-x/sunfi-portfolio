import { Metadata } from "next";
import { fetchContactInfo } from "@/sanity/lib/fetchers";
import { ContactPageClient } from "@/components/contact/ContactPageClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact | Sunfi",
  description: "Get in touch with me for opportunities and collaborations.",
};

export default async function ContactPage() {
  const contactInfo = await fetchContactInfo();
  
  // Debugging: Confirm data flow in the server console
  console.log("Fetched contact info from Sanity:", contactInfo ? "Success" : "No data");

  return <ContactPageClient contactInfo={contactInfo} />;
}
