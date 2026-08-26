import { defineField, defineType } from "sanity";

export const skillType = defineType({
  name: "skill",
  title: "Skill",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Skill Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "AI & Machine Learning", value: "ai_ml" },
          { title: "Data Science & Analytics", value: "data_science" },
          { title: "Full-Stack Development", value: "fullstack" },
          { title: "Backend & Engineering", value: "backend" },
          { title: "Cloud & MLOps", value: "devops" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "percentage",
      title: "Proficiency (%)",
      type: "number",
      description: "Skill level from 0 to 100",
      validation: (Rule) => Rule.required().min(0).max(100),
    }),
    defineField({
      name: "iconSlug",
      title: "Icon Slug (SimpleIcons)",
      type: "string",
      description:
        "The slug from simpleicons.org, e.g. 'python', 'react', 'docker'.",
    }),
    defineField({
      name: "hexColor",
      title: "Brand Hex Color",
      type: "string",
      description:
        "The primary brand hex color for the progress bar (e.g. #3776AB for Python). Override auto-detection here.",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "Category, then Order",
      name: "categoryOrder",
      by: [
        { field: "category", direction: "asc" },
        { field: "order", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "category", percentage: "percentage" },
    prepare({ title, subtitle, percentage }) {
      const labels: Record<string, string> = {
        ai_ml: "AI & ML",
        data_science: "Data Science",
        fullstack: "Full-Stack",
        backend: "Backend",
        devops: "Cloud & MLOps",
      };
      return { title, subtitle: `${labels[subtitle] ?? subtitle} — ${percentage}%` };
    },
  },
});
