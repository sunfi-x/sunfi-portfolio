import React from "react";
import type { Metadata } from "next";
import { LearningJourney } from "@/components/home/LearningJourney";

export const metadata: Metadata = {
  title: "My Learning Journey | Khondoker Sazzad Sunfi",
  description:
    "Explore Khondoker Sazzad Sunfi's comprehensive learning roadmap, key milestones, academic timeline, and core knowledge domains in AI & Data Science.",
};

export default function JourneyPage() {
  return (
    <main className="min-h-screen pt-20 bg-[#050505]">
      <LearningJourney />
    </main>
  );
}
