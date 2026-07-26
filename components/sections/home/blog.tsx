import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import blogData from "@/lib/data/blog-posts.json";

export function BlogSection() {
  // Sort posts by display_order ascending
  const posts = [...blogData].sort((a, b) => a.display_order - b.display_order);

  return (
    <section
      id="blog"
      className="bg-[#FFFFFF] py-2xl border-t border-[rgba(0,0,0,0.08)] w-full"
    >
      <div className="max-w-352 mx-auto px-lg">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-2xl">
          <div className="flex flex-col gap-xs max-w-4xl">
            <span className="text-[13px] font-semibold uppercase tracking-wider text-[rgba(0,0,0,0.4)]">
              Behind the Lens
            </span>
            <h2 className="text-[40px] md:text-[56px] font-semibold tracking-[-0.03em] leading-tight text-black">
              Thoughts & Insights
            </h2>
            <p className="text-[16px] md:text-[18px] text-muted-foreground leading-relaxed mt-xs">
              Stories, technical guides, and business strategies from our team
              at Zeus Capital.
            </p>
          </div>
          <div className="shrink-0 mt-xs md:mt-0">
            <Link
              href="/blog"
              className="inline-flex items-center gap-xs text-[14px] font-semibold text-black hover:underline group"
            >
              <span>View all posts</span>
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>

        {/* 3-Column Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {posts.slice(0, 3).map((post) => (
            <div
              key={post.id}
              className="flex flex-col gap-md group cursor-pointer"
            >
              {/* Video wrapper */}
              <div className="relative aspect-16/10 rounded-card-custom overflow-hidden border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.02)]">
                <video
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  src={post.video_url}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>

              {/* Text metadata and details */}
              <div className="flex flex-col gap-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[rgba(0,0,0,0.4)]">
                    {post.category}
                  </span>
                  <span className="text-[11px] text-[rgba(0,0,0,0.4)]">
                    {post.author.replace("By ", "")}
                  </span>
                </div>
                <h4 className="text-[20px] font-semibold text-black tracking-tight leading-snug group-hover:text-[rgba(0,0,0,0.7)] transition-colors mt-xs">
                  {post.title}
                </h4>
                <p className="text-[14px] leading-relaxed text-muted-foreground">
                  {post.description ||
                    "A deep dive into our operational processes and strategic insights."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
