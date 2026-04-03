import { seoData } from "@/seo/seoData";
import BlogClient from "./BlogClient";

const { blog } = seoData;

// ✅ SEO Metadata
export const metadata = {
  title: blog.title,
  description: blog.description,
  keywords: blog.keywords,
  openGraph: blog.openGraph,
  alternates: {
    canonical: blog.canonical
  }
};

export default function BlogPage() {
  return (
    <>
      {/* ✅ SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blog.schema),
        }}
      />

      <BlogClient />
    </>
  );
}