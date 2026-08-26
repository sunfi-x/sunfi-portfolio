import { fetchProjectBySlug, fetchAllProjectSlugs } from "@/sanity/lib/fetchers";
import { urlFor } from "@/sanity/lib/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProjectCaseStudyClient } from "@/components/projects/ProjectCaseStudyClient";

export const revalidate = 0;

// ─── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = await fetchAllProjectSlugs();
  return slugs.map(({ slug }) => ({ slug: slug.trim() }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await fetchProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} | Sunfi Case Study`,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      ...(project.mainImage
        ? { images: [{ url: urlFor(project.mainImage).width(1200).url() }] }
        : {}),
    },
  };
}

// ─── Page Component ────────────────────────────────────────────────────────────

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await fetchProjectBySlug(slug);

  if (!project) notFound();

  return <ProjectCaseStudyClient project={project} />;
}
