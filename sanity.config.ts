import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { codeInput } from "@sanity/code-input";
import { schema } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

export default defineConfig({
  basePath: "/studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "dtiuhif4", // Placeholder
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  title: "Sunfi Portfolio CMS",
  plugins: [structureTool({ structure }), codeInput()],
  schema: {
    types: schema.types,
  },
});
