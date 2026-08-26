import { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Singleton for Base Resume
      S.listItem()
        .title("Base Resume")
        .id("resume")
        .child(S.document().schemaType("resume").documentId("resume")),
      // Regular document types
      ...S.documentTypeListItems().filter(
        (listItem) => !["resume"].includes(listItem.getId() as string)
      ),
    ]);
