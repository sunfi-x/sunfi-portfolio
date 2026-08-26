import { defineField, defineType } from "sanity";

export const resumeType = defineType({
  name: "resume",
  title: "Base Resume",
  type: "document",
  fields: [
    defineField({
      name: "identity",
      title: "Identity",
      type: "object",
      fields: [
        defineField({ name: "fullName", title: "Full Name", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "profileImage", title: "Profile Image", type: "image" }),
        defineField({ name: "email", title: "Email", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "phone", title: "Phone", type: "string" }),
        defineField({ name: "location", title: "Location", type: "string" }),
        defineField({ name: "linkedin", title: "LinkedIn", type: "url" }),
        defineField({ name: "github", title: "GitHub", type: "url" }),
        defineField({ name: "portfolioWebsite", title: "Portfolio Website", type: "url" }),
        defineField({ name: "passion", title: "Passion", type: "text" }),
      ],
    }),
    defineField({ name: "professionalSummary", title: "Professional Summary", type: "text" }),
    defineField({
      name: "skills",
      title: "Skills",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "id", title: "ID", type: "string", validation: (Rule) => Rule.required(), description: "Unique identifier for filtering (e.g., 'frontend')" }),
            defineField({ name: "categoryName", title: "Category", type: "string" }),
            defineField({ name: "technologies", title: "Technologies", type: "array", of: [{ type: "string" }] }),
          ],
        },
      ],
    }),
    defineField({
      name: "experience",
      title: "Experience",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "id", title: "ID", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "companyName", title: "Company Name", type: "string" }),
            defineField({ name: "role", title: "Role", type: "string" }),
            defineField({ name: "startDate", title: "Start Date", type: "date" }),
            defineField({ name: "endDate", title: "End Date", type: "date" }),
            defineField({ name: "isCurrent", title: "Current", type: "boolean" }),
            defineField({ name: "responsibilities", title: "Responsibilities", type: "array", of: [{ type: "text" }] }),
            defineField({ name: "achievements", title: "Achievements", type: "array", of: [{ type: "text" }] }),
            defineField({ name: "tags", title: "Tags", type: "array", of: [{ type: "string" }] }),
            defineField({ name: "weight", title: "Weight", type: "number" }),
          ],
          preview: { select: { title: "role", subtitle: "companyName" } }
        },
      ],
    }),
    defineField({
      name: "projects",
      title: "Projects",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "id", title: "ID", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text" }),
            defineField({ name: "techStack", title: "Tech Stack", type: "array", of: [{ type: "string" }] }),
            defineField({ name: "projectLink", title: "Project Link", type: "url" }),
            defineField({ name: "githubLink", title: "GitHub Link", type: "url" }),
            defineField({ name: "tags", title: "Tags", type: "array", of: [{ type: "string" }] }),
            defineField({ name: "isFeatured", title: "Is Featured", type: "boolean" }),
            defineField({ name: "weight", title: "Weight", type: "number" }),
          ],
        },
      ],
    }),
    defineField({
      name: "education",
      title: "Education",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "institution", title: "Institution", type: "string" }),
            defineField({ name: "degree", title: "Degree", type: "string" }),
            defineField({ name: "fieldOfStudy", title: "Field of Study", type: "string" }),
            defineField({ name: "startYear", title: "Start Year", type: "number" }),
            defineField({ name: "endYear", title: "End Year", type: "number" }),
          ],
        },
      ],
    }),
    defineField({
      name: "additionalInfo",
      title: "Additional Info",
      type: "object",
      fields: [
        defineField({ name: "certifications", title: "Certifications", type: "array", of: [{ type: "string" }] }),
        defineField({ name: "languages", title: "Languages", type: "array", of: [{ type: "string" }] }),
        defineField({ name: "interests", title: "Interests", type: "array", of: [{ type: "string" }] }),
      ],
    }),
  ],
});
