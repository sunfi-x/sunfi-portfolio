import { defineField, defineType } from "sanity";

export const contactInfoType = defineType({
  name: "contactInfo",
  title: "Contact Info",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "e.g. Dhaka, Bangladesh",
    }),
    defineField({
      name: "availabilityMessage",
      title: "Availability Message",
      type: "string",
      description: "e.g. Open to opportunities",
      initialValue: "Open to opportunities",
    }),
    defineField({
      name: "isAvailable",
      title: "Currently Available",
      type: "boolean",
      initialValue: true,
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
              description: "e.g. LinkedIn, GitHub, Twitter",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "url",
              title: "URL",
              type: "url",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "icon",
              title: "Icon Key",
              type: "string",
              description: "Used to pick icon: github | linkedin | twitter | instagram",
            },
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        },
      ],
    }),
    defineField({
      name: "calendarLink",
      title: "Calendar / Booking Link",
      type: "url",
      description: "Optional: link to Calendly or similar scheduling tool",
    }),
  ],
  preview: {
    select: { title: "email" },
    prepare({ title }) {
      return { title: "Contact Info", subtitle: title };
    },
  },
});
