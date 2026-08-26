/**
 * Embedded Sanity Studio at /studio
 * Accessible only by you — not indexed by search engines (noindex via metadata).
 * force-dynamic ensures it never gets statically cached.
 */
import { Studio } from "./Studio";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sunfi CMS | Sanity Studio",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  return <Studio />;
}
