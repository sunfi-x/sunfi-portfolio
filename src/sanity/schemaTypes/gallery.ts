import { defineField, defineType } from "sanity";

export const galleryType = defineType({
  name: "gallery",
  title: "Gallery Image",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title / Caption",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Describe the image for accessibility",
        }),
      ],
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: "e.g. Conference, Hackathon, Workspace",
      options: {
        list: [
          { title: "Conference", value: "Conference" },
          { title: "Hackathon", value: "Hackathon" },
          { title: "Workspace", value: "Workspace" },
          { title: "Speaking", value: "Speaking" },
          { title: "Travel", value: "Travel" },
          { title: "Other", value: "Other" },
        ],
      },
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
      subtitle: "category",
    },
  },
});
