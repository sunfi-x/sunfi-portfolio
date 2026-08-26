import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
  stega: false,
  // SANITY_API_TOKEN is optional — only required for draft/preview access
  ...(process.env.SANITY_API_TOKEN
    ? { token: process.env.SANITY_API_TOKEN }
    : {}),
});
