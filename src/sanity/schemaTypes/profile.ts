import { defineField, defineType } from "sanity";

export const profileType = defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "e.g. Data Science | Machine Learning | AI",
    }),
    defineField({
      name: "bio",
      title: "Short Bio (used in Hero section)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "about",
      title: "Full About Text (used in About section)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "avatar",
      title: "Avatar Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "e.g. Dhaka, Bangladesh",
    }),
    defineField({
      name: "resumeUrl",
      title: "Resume PDF URL",
      type: "url",
      description: "Direct link to downloadable CV/PDF file",
    }),
    defineField({
      name: "isAvailable",
      title: "Available for Opportunities",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "skills",
      title: "Skills",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "category",
              title: "Category",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "items",
              title: "Skills",
              type: "array",
              of: [{ type: "string" }],
            },
          ],
          preview: {
            select: { title: "category" },
          },
        },
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "platform",
              title: "Platform",
              type: "string",
              description: "e.g. GitHub, LinkedIn, Twitter",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "url",
              title: "URL",
              type: "url",
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
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
            {
              name: "role",
              title: "Role / Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "company",
              title: "Company",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "period",
              title: "Period",
              type: "string",
              description: "e.g. Jan 2024 – Present",
            },
            {
              name: "current",
              title: "Current Position",
              type: "boolean",
              initialValue: false,
            },
            {
              name: "responsibilities",
              title: "Responsibilities",
              type: "array",
              of: [{ type: "string" }],
            },
          ],
          preview: {
            select: { title: "role", subtitle: "company" },
          },
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
            {
              name: "degree",
              title: "Degree",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "institution",
              title: "Institution",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "period",
              title: "Period",
              type: "string",
              description: "e.g. 2019 – 2021",
            },
          ],
          preview: {
            select: { title: "degree", subtitle: "institution" },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "tagline", media: "avatar" },
  },
});
