/**
 * Server-side data fetching functions using the Sanity client.
 * All functions use ISR with revalidate = 60 seconds for performance.
 * Safe to call directly in Next.js Server Components.
 */

import { client } from "./client";
import type { Blog, ContactInfo, GalleryImage, Paper, Profile, Project, Skill } from "./types";
import {
  allBlogSlugsQuery,
  allBlogsQuery,
  allGalleryQuery,
  allPapersQuery,
  allProjectSlugsQuery,
  allProjectsQuery,
  allSkillsQuery,
  blogBySlugQuery,
  contactInfoQuery,
  featuredProjectsQuery,
  profileQuery,
  projectBySlugQuery,
  recentBlogsQuery,
} from "./queries";

const ISR_OPTIONS = { next: { revalidate: 0 } };

// ─── Profile ──────────────────────────────────────────────────────────────────

export async function fetchProfile(): Promise<Profile | null> {
  return client.fetch<Profile | null>(profileQuery, {}, ISR_OPTIONS);
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function fetchAllProjects(): Promise<Project[]> {
  return client.fetch<Project[]>(allProjectsQuery, {}, ISR_OPTIONS);
}

export async function fetchFeaturedProjects(): Promise<Project[]> {
  return client.fetch<Project[]>(featuredProjectsQuery, {}, ISR_OPTIONS);
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  const cleanSlug = decodeURIComponent(slug).trim();
  const project = await client.fetch<Project | null>(
    projectBySlugQuery,
    { slug: cleanSlug },
    ISR_OPTIONS,
  );
  if (project) return project;
  
  // Fallback try with trailing space if exact match wasn't found
  return client.fetch<Project | null>(
    projectBySlugQuery,
    { slug: `${cleanSlug} ` },
    ISR_OPTIONS,
  );
}

export async function fetchAllProjectSlugs(): Promise<{ slug: string }[]> {
  return client.fetch<{ slug: string }[]>(allProjectSlugsQuery, {}, ISR_OPTIONS);
}

// ─── Blogs ────────────────────────────────────────────────────────────────────

// ─── Blogs ────────────────────────────────────────────────────────────────────

export const MOCK_BLOGS: Blog[] = [
  {
    _id: "mock-blog-1",
    title: "Building a Scalable ML Pipeline with Python",
    slug: "building-a-scalable-ml-pipeline-with-python",
    publishedAt: "2026-05-15",
    readTime: "6 min read",
    excerpt: "How I designed an end-to-end machine learning pipeline that handles 10k predictions per second using FastAPI, Redis, and Celery.",
    tags: ["python", "ml", "fastapi", "redis", "pinned"],
    body: [
      {
        _key: "b1",
        _type: "block",
        style: "normal",
        children: [
          {
            _key: "s1",
            _type: "span",
            text: "Designing high-throughput machine learning pipelines requires careful orchestration of compute-intensive tasks. In this article, I discuss the architecture of a system designed to process over 10,000 predictions per second using Python.",
            marks: []
          }
        ]
      },
      {
        _key: "b2",
        _type: "block",
        style: "h2",
        children: [
          {
            _key: "s2",
            _type: "span",
            text: "Architecture Overview",
            marks: []
          }
        ]
      },
      {
        _key: "b3",
        _type: "block",
        style: "normal",
        children: [
          {
            _key: "s3",
            _type: "span",
            text: "To achieve low-latency predictions, we decoupled the ingestion API from the model inference workers using a high-performance message broker. FastAPI acts as the lightweight web entry point, queueing tasks into Redis.",
            marks: []
          }
        ]
      },
      {
        _key: "b4",
        _type: "block",
        style: "blockquote",
        children: [
          {
            _key: "s4",
            _type: "span",
            text: "Decoupling API ingestion from CPU-bound ML inference is critical to maintaining horizontal scalability.",
            marks: []
          }
        ]
      },
      {
        _key: "b5",
        _type: "block",
        style: "h3",
        children: [
          {
            _key: "s5",
            _type: "span",
            text: "Worker Autoscaling and Performance",
            marks: []
          }
        ]
      },
      {
        _key: "b6",
        _type: "block",
        style: "normal",
        children: [
          {
            _key: "s6",
            _type: "span",
            text: "We deployed Celery workers running on optimized GPU nodes to run batch inferences. Using Redis as the message queue ensures that tasks are distributed evenly, avoiding bottlenecks and maintaining predictable latency profiles.",
            marks: []
          }
        ]
      }
    ]
  },
  {
    _id: "mock-blog-2",
    title: "Why I Switched from REST to GraphQL for My Portfolio API",
    slug: "why-i-switched-from-rest-to-graphql-for-my-portfolio-api",
    publishedAt: "2026-04-28",
    readTime: "4 min read",
    excerpt: "A practical comparison of REST vs GraphQL from a real project migration — what I gained, what I lost, and what surprised me.",
    tags: ["graphql", "api", "nextjs"],
    body: [
      {
        _key: "b1",
        _type: "block",
        style: "normal",
        children: [
          {
            _key: "s1",
            _type: "span",
            text: "As applications grow, APIs naturally evolve. For my portfolio, I realized that REST endpoints were fetching either too much or too little data. Here is why I transitioned to GraphQL.",
            marks: []
          }
        ]
      },
      {
        _key: "b2",
        _type: "block",
        style: "h2",
        children: [
          {
            _key: "s2",
            _type: "span",
            text: "Over-fetching and Under-fetching Problems",
            marks: []
          }
        ]
      },
      {
        _key: "b3",
        _type: "block",
        style: "normal",
        children: [
          {
            _key: "s3",
            _type: "span",
            text: "With a REST setup, loading the home page required hitting three separate endpoints: profile data, recent blog posts, and featured projects. This caused multiple roundtrips and returned fields that the UI didn't immediately need.",
            marks: []
          }
        ]
      },
      {
        _key: "b4",
        _type: "block",
        style: "normal",
        children: [
          {
            _key: "s4",
            _type: "span",
            text: "Switching to GraphQL enabled a single, consolidated query requesting exactly the required fields. It improved client-side rendering times and simplified client-side state management significantly.",
            marks: []
          }
        ]
      }
    ]
  },
  {
    _id: "pcos-ml-prediction",
    title: "Rethinking PCOS Prediction: How Leakage Inflates Accuracy in Clinical ML",
    slug: "rethinking-pcos-prediction-leakage-in-clinical-ml",
    publishedAt: "2026-08-14",
    readTime: "10 min read",
    excerpt: "An investigation into how pre-splitting oversampling and feature selection generate artificial clinical accuracy, and if simple rules can compete.",
    tags: ["machine-learning", "healthcare", "python", "data-science", "pinned"],
    body: [
      {
        _key: "pcos1",
        _type: "block",
        style: "normal",
        children: [
          {
            _key: "s1",
            _type: "span",
            text: "Clinical machine learning models often report near-perfect accuracies (98-99%) in literature. However, a rigorous audit reveals that data leakage (such as performing SMOTE oversampling before cross-validation splitting) frequently manufactures these metrics.",
            marks: []
          }
        ]
      },
      {
        _key: "pcos2",
        _type: "block",
        style: "h2",
        children: [
          {
            _key: "s2",
            _type: "span",
            text: "The Leakage Experiment",
            marks: []
          }
        ]
      },
      {
        _key: "pcos3",
        _type: "block",
        style: "normal",
        children: [
          {
            _key: "s3",
            _type: "span",
            text: "We tested a Stacking Ensemble under two conditions: (1) Correct validation where SMOTE lives inside each fold, and (2) Leaky validation where SMOTE occurs beforehand. The leaky setup inflated accuracy by 3.2% and F1-score by 9.0%, showing that model reporting must detail validations to be trusted.",
            marks: []
          }
        ]
      }
    ]
  },
  {
    _id: "ds-job-market-bd",
    title: "Decoding the Data Science Job Market in Bangladesh: A Scraped Reality Check",
    slug: "decoding-data-science-job-market-bangladesh-2025",
    publishedAt: "2026-08-10",
    readTime: "8 min read",
    excerpt: "Building an end-to-end data pipeline that scrapes LinkedIn postings, structures dirty descriptions, and visualizes real skill demands in Bangladesh.",
    tags: ["data-science", "web-scraping", "python", "pandas"],
    body: [
      {
        _key: "ds1",
        _type: "block",
        style: "normal",
        children: [
          {
            _key: "s1",
            _type: "span",
            text: "Searching for Data Science jobs in Bangladesh often feels like a guessing game. To find out what local companies are actually looking for, I built a scraper pipeline targeting LinkedIn job posts.",
            marks: []
          }
        ]
      },
      {
        _key: "ds2",
        _type: "block",
        style: "h2",
        children: [
          {
            _key: "s2",
            _type: "span",
            text: "Parsing the Messy Tech Text",
            marks: []
          }
        ]
      },
      {
        _key: "ds3",
        _type: "block",
        style: "normal",
        children: [
          {
            _key: "s3",
            _type: "span",
            text: "Job requirements are usually buried in paragraphs of unorganized text. Using regex-based entity extraction and Pandas formatting, we parsed key tools like Python, SQL, Tableau, and Excel to build demand frequency profiles.",
            marks: []
          }
        ]
      }
    ]
  },
  {
    _id: "uiu-lost-found-v3",
    title: "Building UIU Lost & Found V3: Automated ID Scanning & AI Verification",
    slug: "building-uiu-lost-found-v3-ai-verification",
    publishedAt: "2026-08-05",
    readTime: "7 min read",
    excerpt: "Integrating FastAPI, React, and Gemini AI to create a smart campus recovery platform that uses verification quizzes and OTP handovers.",
    tags: ["fastapi", "react", "gemini-ai", "lost-and-found"],
    body: [
      {
        _key: "uiu1",
        _type: "block",
        style: "normal",
        children: [
          {
            _key: "s1",
            _type: "span",
            text: "Traditional Lost and Found boards are passive and insecure. For UIU Lost & Found V3, we designed a proactive system leveraging AI verification to prevent false claims and automate ID card identification.",
            marks: []
          }
        ]
      },
      {
        _key: "uiu2",
        _type: "block",
        style: "h2",
        children: [
          {
            _key: "s2",
            _type: "span",
            text: "Under the Hood: FastAPI and Gemini",
            marks: []
          }
        ]
      },
      {
        _key: "uiu3",
        _type: "block",
        style: "normal",
        children: [
          {
            _key: "s3",
            _type: "span",
            text: "The back-end runs on FastAPI using SQLModel for DB interaction. When a student uploads an image of a lost item, Gemini analyzes key features to generate a secure verification quiz for claiming students, while automated OCR parses ID numbers.",
            marks: []
          }
        ]
      }
    ]
  }
];

export async function fetchAllBlogs(): Promise<Blog[]> {
  try {
    const blogs = await client.fetch<Blog[]>(allBlogsQuery, {}, ISR_OPTIONS);
    if (!blogs || blogs.length === 0) {
      return MOCK_BLOGS;
    }
    return blogs;
  } catch (error) {
    console.warn("Failed to fetch blogs from Sanity, using mock data", error);
    return MOCK_BLOGS;
  }
}

export async function fetchRecentBlogs(): Promise<Blog[]> {
  try {
    const blogs = await client.fetch<Blog[]>(recentBlogsQuery, {}, ISR_OPTIONS);
    if (!blogs || blogs.length === 0) {
      // Return a subset or all mock blogs for recent preview
      return MOCK_BLOGS.slice(0, 3);
    }
    return blogs;
  } catch (error) {
    console.warn("Failed to fetch recent blogs from Sanity, using mock data", error);
    return MOCK_BLOGS.slice(0, 3);
  }
}

export async function fetchBlogBySlug(slug: string): Promise<Blog | null> {
  try {
    const post = await client.fetch<Blog | null>(blogBySlugQuery, { slug }, ISR_OPTIONS);
    if (!post) {
      return MOCK_BLOGS.find((b) => b.slug === slug) || null;
    }
    return post;
  } catch (error) {
    console.warn(`Failed to fetch blog by slug ${slug} from Sanity, checking mock data`, error);
    return MOCK_BLOGS.find((b) => b.slug === slug) || null;
  }
}

export async function fetchAllBlogSlugs(): Promise<{ slug: string }[]> {
  try {
    const slugs = await client.fetch<{ slug: string }[]>(allBlogSlugsQuery, {}, ISR_OPTIONS);
    if (!slugs || slugs.length === 0) {
      return MOCK_BLOGS.map((b) => ({ slug: b.slug }));
    }
    return slugs;
  } catch (error) {
    console.warn("Failed to fetch blog slugs from Sanity, using mock data", error);
    return MOCK_BLOGS.map((b) => ({ slug: b.slug }));
  }
}

// ─── Papers ───────────────────────────────────────────────────────────────────

export async function fetchAllPapers(): Promise<Paper[]> {
  return client.fetch<Paper[]>(allPapersQuery, {}, ISR_OPTIONS);
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

export async function fetchAllGallery(): Promise<GalleryImage[]> {
  return client.fetch<GalleryImage[]>(allGalleryQuery, {}, ISR_OPTIONS);
}

// ─── Contact Info ─────────────────────────────────────────────────────────────

export async function fetchContactInfo(): Promise<ContactInfo | null> {
  return client.fetch<ContactInfo | null>(contactInfoQuery, {}, ISR_OPTIONS);
}

// ─── Skills (Premium Section) ────────────────────────────────────────────────

export async function fetchAllSkills(): Promise<Skill[]> {
  return client.fetch<Skill[]>(allSkillsQuery, {}, ISR_OPTIONS);
}

// ─── Resume System ────────────────────────────────────────────────────────────

import {
  baseResumeQuery,
  resumeVersionBySlugQuery,
  resumeVersionsQuery,
} from "./queries";
import type { BaseResume, ResumeVersion } from "./types";

export async function getBaseResume(): Promise<BaseResume | null> {
  return client.fetch<BaseResume | null>(baseResumeQuery, {}, ISR_OPTIONS);
}

export async function getResumeVersions(): Promise<ResumeVersion[]> {
  return client.fetch<ResumeVersion[]>(resumeVersionsQuery, {}, ISR_OPTIONS);
}

export async function getResumeVersion(slug: string): Promise<ResumeVersion | null> {
  return client.fetch<ResumeVersion | null>(
    resumeVersionBySlugQuery,
    { slug },
    ISR_OPTIONS
  );
}

/**
 * Merges the Base Resume with a Resume Version based on specific rules.
 */
export function getMergedResume(
  base: BaseResume | null,
  version: ResumeVersion | null
): BaseResume | null {
  if (!base) return null;

  // If no version provided, return base
  if (!version) return base;

  // Clone base to avoid mutating
  const merged: BaseResume = JSON.parse(JSON.stringify(base));

  // Override summary if customSummary is provided
  if (version.customSummary) {
    merged.professionalSummary = version.customSummary;
  }

  // Filter Skills
  if (version.selectedSkills && version.selectedSkills.length > 0) {
    merged.skills = merged.skills?.filter((skill) =>
      version.selectedSkills!.includes(skill.id)
    );
  }

  // Filter Experience
  if (version.selectedExperience && version.selectedExperience.length > 0) {
    merged.experience = merged.experience?.filter((exp) =>
      version.selectedExperience!.includes(exp.id)
    );
  }

  // Filter Projects
  if (version.selectedProjects && version.selectedProjects.length > 0) {
    merged.projects = merged.projects?.filter((proj) =>
      version.selectedProjects!.includes(proj.id)
    );
  }

  return merged;
}
