import { type SchemaTypeDefinition } from "sanity";
import { projectType } from "./project";
import { blogType } from "./blog";
import { paperType } from "./paper";
import { galleryType } from "./gallery";
import { profileType } from "./profile";
import { contactInfoType } from "./contactInfo";
import { resumeType } from "./resume";
import { resumeVersionType } from "./resumeVersion";
import { skillType } from "./skill";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [projectType, blogType, paperType, galleryType, profileType, contactInfoType, resumeType, resumeVersionType, skillType],
};
