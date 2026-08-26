import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, Pin, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { format } from "date-fns";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { fetchBlogBySlug, fetchAllBlogSlugs, fetchAllBlogs, fetchProfile } from "@/sanity/lib/fetchers";
import { urlFor } from "@/sanity/lib/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BlogPageClient } from "@/components/blogs/BlogPageClient";
import { PreBlock } from "@/components/blogs/PreBlock";
import { BlogShare } from "@/components/blogs/BlogShare";

export const revalidate = 60;

// ─── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = await fetchAllBlogSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} | Sunfi Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      ...(post.mainImage
        ? { images: [{ url: urlFor(post.mainImage).width(1200).url() }] }
        : {}),
    },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  if (!text) return "heading";
  
  let slug = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
    
  if (!slug || /[^\x00-\x7F]/.test(text)) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }
    const hashStr = Math.abs(hash).toString(36);
    slug = slug ? `${slug}-${hashStr}` : `u-${hashStr}`;
  }
  
  return slug;
}

function extractText(node: any): string {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object") {
    if (node.props?.children) return extractText(node.props.children);
    if (node.text) return node.text;
    if (node.props?.text) return node.props.text;
  }
  return "";
}

// ─── Portable Text Components ─────────────────────────────────────────────────

const ptComponents: PortableTextComponents = {
  types: {
    code: ({ value }) => (
      <PreBlock
        code={value.code}
        language={value.language}
        filename={value.filename}
      />
    ),
    image: ({ value }) => {
      if (!value?.asset?._ref) return null;
      return (
        <figure className="my-10 rounded-2xl overflow-hidden border border-white/[0.07] bg-white/[0.02]">
          <Image
            src={urlFor(value).width(900).url()}
            alt={value.alt || "Blog image"}
            width={900}
            height={500}
            className="w-full h-auto"
          />
          {value.caption && (
            <figcaption className="text-sm text-white/40 text-center py-3 italic px-4 bg-white/[0.02]">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }) => {
      const text = extractText(children);
      const id = slugify(text);
      return (
        <h2
          id={id}
          className="group flex items-center gap-3 text-2xl font-bold mt-14 mb-5 text-white/90 scroll-mt-28"
        >
          <span className="inline-block w-0.5 h-7 bg-white/25 rounded-full shrink-0" />
          {children}
          <a
            href={`#${id}`}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-white/60 text-base font-normal"
            aria-label="Link to section"
          >
            #
          </a>
        </h2>
      );
    },
    h3: ({ children }) => {
      const text = extractText(children);
      const id = slugify(text);
      return (
        <h3
          id={id}
          className="group flex items-center gap-2.5 text-xl font-semibold mt-10 mb-4 text-white/80 scroll-mt-28"
        >
          <span className="inline-block w-px h-5 bg-white/20 rounded-full shrink-0" />
          {children}
          <a
            href={`#${id}`}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-white/60 text-sm font-normal"
            aria-label="Link to section"
          >
            #
          </a>
        </h3>
      );
    },
    normal: ({ children }) => (
      <p className="text-white/60 leading-8 mb-6 text-[15.5px] md:text-[16px] font-light">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="relative pl-6 pr-5 py-5 my-8 rounded-r-2xl border-l-2 border-white/40 bg-white/[0.025] italic text-white/55 text-[15px] leading-relaxed">
        <span className="absolute top-2 left-4 text-5xl leading-none text-white/10 font-serif select-none">&ldquo;</span>
        <div className="relative z-10">{children}</div>
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-none pl-0 my-6 space-y-3">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-5 my-6 space-y-3 text-white/60 text-[15px] md:text-[16px]">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex items-start gap-3 text-white/60 text-[15px] md:text-[16px] font-light">
        <span className="inline-block mt-[10px] w-1.5 h-1.5 rounded-full bg-white/30 shrink-0" />
        <span>{children}</span>
      </li>
    ),
    number: ({ children }) => <li className="text-white/60 font-light pl-1">{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-white/90">{children}</strong>
    ),
    em: ({ children }) => <em className="italic text-white/75">{children}</em>,
    code: ({ children }) => (
      <code className="bg-white/[0.06] text-white/80 px-1.5 py-0.5 rounded-md font-mono text-[13.5px] border border-white/[0.08]">
        {children}
      </code>
    ),
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white/85 underline underline-offset-4 decoration-white/25 hover:decoration-white/70 hover:text-white transition-all duration-200"
      >
        {children}
      </a>
    ),
  },
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchBlogBySlug(slug);

  if (!post) notFound();

  const allBlogs = await fetchAllBlogs();
  const currentIndex = allBlogs.findIndex((b) => b.slug === slug);
  const prevPost = currentIndex !== -1 && currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allBlogs[currentIndex - 1] : null;

  const profile = await fetchProfile();

  const headings: { id: string; text: string; level: 2 | 3 }[] = [];
  if (post.body && Array.isArray(post.body)) {
    post.body.forEach((block: any) => {
      if (block._type === "block" && (block.style === "h2" || block.style === "h3")) {
        const text = block.children?.map((c: any) => c.text).join("") || "";
        if (text.trim()) {
          headings.push({
            id: slugify(text),
            text,
            level: block.style === "h2" ? 2 : 3,
          });
        }
      }
    });
  }

  const charCodeSum = post.title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const mockViews = (charCodeSum % 140) + 60;

  const isPinned = (post as any).isPinned || post.tags?.includes("pinned") || false;

  return (
    <BlogPageClient headings={headings} readTime={post.readTime}>
      {/* ── Article Header ─────────────────────────────────────────────────── */}
      <header className="mb-10 font-sans">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-white/25 mb-8 select-none">
          <Link href="/" className="hover:text-white/70 transition-colors duration-200">Home</Link>
          <span className="text-white/15">/</span>
          <Link href="/blogs" className="hover:text-white/70 transition-colors duration-200">Writing</Link>
          <span className="text-white/15">/</span>
          <span className="text-white/50 truncate max-w-[180px] md:max-w-[320px]">{post.title}</span>
        </div>

        {/* Tags Row */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white/[0.04] rounded-full text-[11px] text-white/45 font-medium border border-white/[0.06] hover:border-white/20 hover:text-white/70 transition-all duration-200 cursor-default select-none"
              >
                {tag}
              </span>
            ))}
            {isPinned && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[11px] font-semibold select-none">
                <Pin className="w-3 h-3 fill-current" />
                Pinned
              </span>
            )}
          </div>
        )}

        {/* Meta Row: Date · Read Time · Views */}
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-white/30 font-medium tracking-wider uppercase mb-7 select-none">
          {post.publishedAt && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{format(new Date(post.publishedAt), "MMM d, yyyy")}</span>
            </div>
          )}
          {post.readTime && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTime}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>{mockViews} views</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-[2.6rem] lg:text-5xl font-bold text-white leading-[1.1] tracking-tight mb-5">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-base md:text-lg text-white/45 leading-relaxed font-light mb-8 max-w-2xl">
            {post.excerpt}
          </p>
        )}

        {/* Author Row */}
        {profile && (
          <div className="flex items-center gap-3 py-5 border-y border-white/[0.06]">
            {profile.avatar && (
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-white/10 ring-2 ring-white/5">
                <Image
                  src={urlFor(profile.avatar).width(72).height(72).url()}
                  alt={profile.name}
                  width={36}
                  height={36}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-white/80">{profile.name}</span>
              <span className="text-[11px] text-white/35 font-light">Author · Data Scientist</span>
            </div>
          </div>
        )}
      </header>

      {/* ── Main Cover Image ──────────────────────────────────────────────── */}
      {post.mainImage?.asset?._ref && (
        <div className="w-full rounded-2xl overflow-hidden border border-white/[0.06] mb-12 select-none shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]">
          <Image
            src={urlFor(post.mainImage).width(900).height(450).fit("crop").url()}
            alt={post.mainImage.alt || post.title}
            width={900}
            height={450}
            className="w-full h-auto object-cover"
            priority
          />
        </div>
      )}

      {/* ── Body Content ─────────────────────────────────────────────────── */}
      <article className="prose prose-invert max-w-none">
        {post.body && post.body.length > 0 ? (
          <PortableText value={post.body} components={ptComponents} />
        ) : (
          <p className="text-white/30 text-lg text-center py-16 italic">
            Content coming soon.
          </p>
        )}
      </article>

      {/* ── Article Footer ────────────────────────────────────────────────── */}
      <footer className="mt-16 pt-10 border-t border-white/[0.06] space-y-10">

        {/* Share Section */}
        <BlogShare title={post.title} />

        {/* Tags Section */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 select-none">
            <span className="text-[11px] font-semibold text-white/25 uppercase tracking-wider mr-1">
              Tagged:
            </span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-white/[0.04] rounded-lg text-[11px] text-white/40 font-medium border border-white/[0.06] hover:border-white/15 hover:text-white/65 transition-all duration-200 cursor-default"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Author Card */}
        {profile && (
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 flex flex-col sm:flex-row items-start gap-5 select-none">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {profile.avatar && (
                <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-white/10 ring-4 ring-white/[0.04]">
                  <Image
                    src={urlFor(profile.avatar).width(112).height(112).url()}
                    alt={profile.name}
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <div className="flex flex-col gap-0.5 flex-1">
                <span className="text-[11px] font-bold text-white/30 uppercase tracking-widest">Written by</span>
                <h4 className="text-base font-bold text-white/90 leading-snug">{profile.name}</h4>
                <p className="text-[13px] text-white/45 mt-0.5 leading-snug font-light">
                  {profile.bio || "Data Scientist & AI Researcher"}
                </p>
              </div>
            </div>
            {profile.socialLinks && (
              <div className="flex gap-2.5 sm:ml-auto">
                {profile.socialLinks.map((social) => {
                  const platform = social.platform.toLowerCase();
                  return (
                    <a
                      key={social._key}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.07] text-white/40 hover:text-white hover:border-white/20 hover:bg-white/[0.08] transition-all duration-200"
                      title={social.platform}
                    >
                      {platform === "github" ? (
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                      ) : platform === "twitter" || platform === "x" ? (
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      ) : (
                        <span className="text-[10px] font-mono">{social.platform[0].toUpperCase()}</span>
                      )}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Prev / Next Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {prevPost ? (
            <Link
              href={`/blogs/${prevPost.slug}`}
              className="flex flex-col gap-2 p-5 bg-white/[0.03] border border-white/[0.07] rounded-2xl hover:border-white/[0.15] hover:bg-white/[0.05] hover:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.8)] transition-all duration-300 group text-left"
            >
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/25 group-hover:text-white/50 transition-colors uppercase tracking-widest">
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </div>
              <span className="text-white/80 group-hover:text-white font-semibold text-sm leading-snug line-clamp-2 transition-colors">
                {prevPost.title}
              </span>
              {prevPost.publishedAt && (
                <span className="text-[11px] text-white/25 font-medium">
                  {format(new Date(prevPost.publishedAt), "MMM d, yyyy")}
                </span>
              )}
            </Link>
          ) : (
            <div className="hidden md:block" />
          )}

          {nextPost ? (
            <Link
              href={`/blogs/${nextPost.slug}`}
              className="flex flex-col gap-2 p-5 bg-white/[0.03] border border-white/[0.07] rounded-2xl hover:border-white/[0.15] hover:bg-white/[0.05] hover:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.8)] transition-all duration-300 group text-right items-end"
            >
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/25 group-hover:text-white/50 transition-colors uppercase tracking-widest">
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
              <span className="text-white/80 group-hover:text-white font-semibold text-sm leading-snug line-clamp-2 transition-colors">
                {nextPost.title}
              </span>
              {nextPost.publishedAt && (
                <span className="text-[11px] text-white/25 font-medium">
                  {format(new Date(nextPost.publishedAt), "MMM d, yyyy")}
                </span>
              )}
            </Link>
          ) : (
            <div className="hidden md:block" />
          )}
        </div>

        {/* Back to Blog */}
        <div className="pt-2">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-[12px] font-semibold text-white/30 hover:text-white/70 transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Writing
          </Link>
        </div>
      </footer>
    </BlogPageClient>
  );
}
