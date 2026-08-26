import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * Returns a Sanity image URL builder for the given source.
 * Usage: urlFor(image).width(800).url()
 */
export function urlFor(source: any) {
  return builder.image(source);
}
