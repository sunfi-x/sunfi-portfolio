import React from "react";
import { getBaseResume, getResumeVersions, getResumeVersion, getMergedResume } from "@/sanity/lib/fetchers";
import { ResumeUI } from "@/components/resume/ResumeUI";
import { notFound } from "next/navigation";

interface ResumeVersionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ResumeVersionPageProps) {
  const resolvedParams = await params;
  const version = await getResumeVersion(resolvedParams.slug);
  
  if (!version) {
    return { title: "Resume Not Found" };
  }

  return {
    title: `${version.title} | Sunfi Portfolio`,
    description: `Professional resume tailored for ${version.title}.`,
  };
}

export async function generateStaticParams() {
  const versions = await getResumeVersions();
  return versions.map((version) => ({
    slug: version.slug,
  }));
}

export default async function ResumeVersionPage({ params }: ResumeVersionPageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const baseResume = await getBaseResume();
  const versions = await getResumeVersions();
  const version = await getResumeVersion(slug);

  if (!baseResume) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-xl text-gray-500">Base resume not found.</p>
      </div>
    );
  }

  if (!version) {
    notFound();
  }

  const mergedResume = getMergedResume(baseResume, version);

  if (!mergedResume) {
    notFound();
  }

  return <ResumeUI resume={mergedResume} versions={versions} currentSlug={slug} />;
}
