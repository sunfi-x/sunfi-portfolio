import React from "react";
import type { Metadata } from "next";
import { BackButton } from "@/components/ui/BackButton";
import { LearningJourney } from "@/components/home/LearningJourney";

export const metadata: Metadata = {
  title: "My Learning Journey | Khondoker Sazzad Sunfi",
  description:
    "Explore Khondoker Sazzad Sunfi's comprehensive learning roadmap, key milestones, academic timeline, and core knowledge domains in AI & Data Science.",
};

export default function JourneyPage() {
  return (
    <main className="min-h-screen py-2 md:py-4 bg-transparent relative z-10">
      <div className="container mx-auto px-5 sm:px-8 md:px-12 max-w-6xl mb-4">
        <BackButton label="Back" />
      </div>

      <LearningJourney />
    </main>
  );
}
