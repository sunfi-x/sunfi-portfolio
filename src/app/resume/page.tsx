import React from "react";
import { getBaseResume, getResumeVersions } from "@/sanity/lib/fetchers";
import { ResumeUI } from "@/components/resume/ResumeUI";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Resume | Sunfi Portfolio",
  description: "My professional resume and curriculum vitae.",
};

export default async function ResumePage() {
  const baseResume = await getBaseResume();
  const versions = await getResumeVersions();

  if (!baseResume) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-xl text-gray-500">Base resume not found. Please set it up in Sanity Studio.</p>
      </div>
    );
  }

  return <ResumeUI resume={baseResume} versions={versions} />;
}
