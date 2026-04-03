import { seoData } from "@/seo/seoData";
import AboutClient from "./AboutClient";

const { about } = seoData;

// ✅ SEO
export const metadata = {
  title: about.title,
  description: about.description,
  keywords: about.keywords,
  openGraph: about.openGraph,
  alternates: {
    canonical: about.canonical
  }
};

export default function AboutPage() {
  return (
    <>
      {/* ✅ SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(about.schema),
        }}
      />

      <AboutClient />
    </>
  );
}