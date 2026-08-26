/**
 * All GROQ queries for the Sunfi portfolio CMS.
 * Centralised here so queries are easy to audit, update, and test.
 */

// ─── Profile ──────────────────────────────────────────────────────────────────

export const profileQuery = /* groq */ `
  *[_type == "profile"][0] {
    _id,
    name,
    tagline,
    bio,
    about,
    avatar,
    email,
    phone,
    location,
    resumeUrl,
    isAvailable,
    skills[] {
      _key,
      category,
      items
    },
    socialLinks[] {
      _key,
      platform,
      url,
      icon
    },
    experience[] {
      _key,
      role,
      company,
      period,
      current,
      responsibilities
    },
    education[] {
      _key,
      degree,
      institution,
      period
    }
  }
`;

// ─── Projects ─────────────────────────────────────────────────────────────────

export const allProjectsQuery = /* groq */ `
  *[_type == "project"] | order(isFeatured desc, order asc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    isFeatured,
    category,
    mainImage,
    shortDescription,
    techStack,
    githubUrl,
    liveUrl,
    order
  }
`;

export const featuredProjectsQuery = /* groq */ `
  *[_type == "project" && isFeatured == true] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    category,
    mainImage,
    shortDescription,
    techStack,
    githubUrl,
    liveUrl,
    order
  }
`;

export const projectBySlugQuery = /* groq */ `
  *[_type == "project" && (slug.current == $slug || slug.current == $slug + " " || slug.current == string::split($slug, " ")[0])][0] {
    _id,
    title,
    "slug": slug.current,
    isFeatured,
    mainImage,
    shortDescription,
    problem,
    solution,
    techStack,
    challenges,
    impact,
    githubUrl,
    liveUrl
  }
`;

export const allProjectSlugsQuery = /* groq */ `
  *[_type == "project" && defined(slug.current)] {
    "slug": slug.current
  }
`;

// ─── Blogs ────────────────────────────────────────────────────────────────────

export const allBlogsQuery = /* groq */ `
  *[_type == "blog"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    mainImage,
    excerpt,
    tags,
    readTime
  }
`;

export const recentBlogsQuery = /* groq */ `
  *[_type == "blog"] | order(publishedAt desc) [0..2] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    tags
  }
`;

export const blogBySlugQuery = /* groq */ `
  *[_type == "blog" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    mainImage {
      ...,
      "alt": alt
    },
    excerpt,
    body[] {
      ...,
      _type == "image" => {
        ...,
        asset->
      }
    },
    tags,
    readTime
  }
`;

export const allBlogSlugsQuery = /* groq */ `
  *[_type == "blog" && defined(slug.current)] {
    "slug": slug.current
  }
`;

// ─── Papers ───────────────────────────────────────────────────────────────────

export const allPapersQuery = /* groq */ `
  *[_type == "paper"] | order(year desc, _createdAt desc) {
    _id,
    title,
    conference,
    year,
    abstract,
    doiLink
  }
`;

export const recentPapersQuery = /* groq */ `
  *[_type == "paper"] | order(year desc) [0..0] {
    _id,
    title,
    "slug": slug.current,
    year,
    conference,
    abstract
  }
`;

// ─── Gallery ──────────────────────────────────────────────────────────────────

export const allGalleryQuery = /* groq */ `
  *[_type == "gallery"] | order(order asc, _createdAt desc) {
    _id,
    title,
    image {
      ...,
      "alt": image.alt,
      "caption": caption,
      asset->
    },
    category,
    order,
    "width":  image.asset->metadata.dimensions.width,
    "height": image.asset->metadata.dimensions.height,
    "aspectRatio": image.asset->metadata.dimensions.aspectRatio
  }
`;

// ─── Contact Info ─────────────────────────────────────────────────────────────

export const contactInfoQuery = /* groq */ `
  *[_type == "contactInfo"][0] {
    _id,
    email,
    phone,
    location,
    availabilityMessage,
    isAvailable,
    socialLinks[] {
      _key,
      platform,
      url,
      icon
    },
    calendarLink
  }
`;

// ─── Resume System ────────────────────────────────────────────────────────────

export const baseResumeQuery = /* groq */ `
  *[_type == "resume"][0] {
    identity {
      fullName,
      title,
      "profileImageUrl": profileImage.asset->url,
      email,
      phone,
      location,
      linkedin,
      github,
      portfolioWebsite,
      passion
    },
    professionalSummary,
    skills[] {
      id,
      categoryName,
      technologies
    },
    experience[] {
      id,
      companyName,
      role,
      startDate,
      endDate,
      isCurrent,
      responsibilities,
      achievements,
      tags,
      weight
    },
    projects[] {
      id,
      title,
      description,
      techStack,
      projectLink,
      githubLink,
      tags,
      isFeatured,
      weight
    },
    education[] {
      institution,
      degree,
      fieldOfStudy,
      startYear,
      endYear
    },
    additionalInfo {
      certifications,
      languages,
      interests
    }
  }
`;

export const resumeVersionsQuery = /* groq */ `
  *[_type == "resumeVersion"] | order(priorityOrder desc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    versionType
  }
`;

export const resumeVersionBySlugQuery = /* groq */ `
  *[_type == "resumeVersion" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    versionType,
    customSummary,
    selectedSkills,
    selectedExperience,
    selectedProjects
  }
`;

// ─── Skills (Premium Section) ────────────────────────────────────────────────

export const allSkillsQuery = /* groq */ `
  *[_type == "skill"] | order(category asc, order asc, title asc) {
    _id,
    title,
    category,
    percentage,
    iconSlug,
    hexColor,
    order
  }
`;

