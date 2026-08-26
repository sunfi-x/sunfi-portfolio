import { defineField, defineType } from "sanity";

export const paperType = defineType({
  name: "paper",
  title: "Paper",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "conference",
      title: "Conference / Journal",
      type: "string",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
    }),
    defineField({
      name: "abstract",
      title: "Abstract",
      type: "text",
    }),
    defineField({
      name: "doiLink",
      title: "DOI Link",
      type: "url",
    }),
  ],
});
