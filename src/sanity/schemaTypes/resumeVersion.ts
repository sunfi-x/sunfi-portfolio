import { defineField, defineType } from "sanity";

export const resumeVersionType = defineType({
  name: "resumeVersion",
  title: "Resume Version",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Version Title",
      type: "string",
      description: 'e.g. "Data Scientist CV"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "versionType",
      title: "Version Type",
      type: "string",
      options: {
        list: [
          { title: "Data Science (DS)", value: "ds" },
          { title: "Software Engineering (SWE)", value: "swe" },
          { title: "AI/ML", value: "ai" },
          { title: "Custom", value: "custom" },
        ],
      },
    }),
    defineField({
      name: "customSummary",
      title: "Custom Professional Summary",
      type: "text",
      description: "Overrides the base resume summary if provided.",
    }),
    defineField({
      name: "selectedSkills",
      title: "Selected Skills (IDs)",
      type: "array",
      of: [{ type: "string" }],
      description: "Enter skill category IDs to keep. Leave empty to keep all.",
    }),
    defineField({
      name: "selectedExperience",
      title: "Selected Experience (IDs)",
      type: "array",
      of: [{ type: "string" }],
      description: "Enter experience IDs to keep. Leave empty to keep all.",
    }),
    defineField({
      name: "selectedProjects",
      title: "Selected Projects (IDs)",
      type: "array",
      of: [{ type: "string" }],
      description: "Enter project IDs to keep. Leave empty to keep all.",
    }),
    defineField({
      name: "priorityOrder",
      title: "Priority Order",
      type: "number",
      initialValue: 0,
    }),
  ],
});
