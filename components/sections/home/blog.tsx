import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import blogData from "@/lib/data/blog-posts.json";
import { Card } from "@/components/ui/card";

export function BlogSection() {
  // Sort posts by display_order ascending
  const posts = [...blogData].sort((a, b) => a.display_order - b.display_order);

  return (
    <section
      id="blog"
      className="bg-background py-2xl border-t border-border w-full"
    >
      <div className="max-w-[88rem] mx-auto px-lg">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-2xl">
          <div className="flex flex-col gap-xs max-w-4xl">
            <span className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              Research & Commentary
            </span>
            <h2 className="text-[40px] sm:text-[56px] tracking-[-0.03em] font-serif italic max-w-118 leading-[1.1] text-black">
              Market Insights
            </h2>
            <p className="text-[16px] md:text-[18px] text-muted-foreground leading-relaxed mt-xs">
              Technical analysis, mining economics, and custody best practices
              from the Zeus Capital research desk.
            </p>
          </div>
          <div className="shrink-0 mt-xs md:mt-0">
            <Link
              href="/blog"
              className="inline-flex items-center gap-xs text-[14px] font-semibold text-foreground hover:underline group"
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
              <Card className="relative aspect-16/10 rounded-card-custom overflow-hidden border border-border bg-muted/20">
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  src={post.video_url}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </Card>

              {/* Text metadata and details */}
              <div className="flex flex-col gap-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                    {post.category}
                  </span>
                  <span className="text-[11px] text-muted-foreground/60">
                    {post.author.replace("By ", "")}
                  </span>
                </div>
                <h4 className="text-[20px] font-semibold text-foreground tracking-tight leading-snug group-hover:text-muted-foreground transition-colors mt-xs truncate">
                  {post.title}
                </h4>
                <p className="text-[14px] leading-relaxed line-clamp-2 text-muted-foreground">
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
