import { defineField, defineType } from "sanity";

export const projectType = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isFeatured",
      title: "Featured Project",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      initialValue: "AI Systems",
      options: {
        list: [
          { title: "AI Systems", value: "AI Systems" },
          { title: "Web Apps", value: "Web Apps" },
          { title: "E-Commerce", value: "E-Commerce" },
          { title: "Visualization", value: "Visualization" },
          { title: "Data Engineering", value: "Data Engineering" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower number = shown first. Featured projects with lower order appear at top.",
      initialValue: 99,
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "problem",
      title: "Problem Statement",
      type: "text",
    }),
    defineField({
      name: "solution",
      title: "Solution",
      type: "text",
    }),
    defineField({
      name: "techStack",
      title: "Tech Stack",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "challenges",
      title: "Challenges",
      type: "text",
    }),
    defineField({
      name: "impact",
      title: "Impact / Results",
      type: "text",
    }),
    defineField({
      name: "githubUrl",
      title: "GitHub URL",
      type: "url",
    }),
    defineField({
      name: "liveUrl",
      title: "Live URL",
      type: "url",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "mainImage",
      subtitle: "shortDescription",
    },
  },
});
