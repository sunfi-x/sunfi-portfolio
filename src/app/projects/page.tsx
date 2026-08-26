import ProjectsContainer from "@/components/projects/ProjectsContainer";
import { fetchAllProjects } from "@/sanity/lib/fetchers";
import type { Metadata } from "next";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Projects | Khondoker Sazzad Sunfi",
  description: "A premium showcase of Machine Learning systems, AI models, and data pipelines built to solve complex engineering challenges.",
};

export default async function ProjectsPage() {
  const projects = await fetchAllProjects();
  return <ProjectsContainer sanityProjects={projects} />;
}
