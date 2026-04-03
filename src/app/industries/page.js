import { seoData } from "@/seo/seoData";
import IndustriesClient from "./IndustriesClient";

const { industries } = seoData;

// ✅ SEO Metadata
export const metadata = {
  title: industries.title,
  description: industries.description,
  keywords: industries.keywords,
  openGraph: industries.openGraph,
  alternates: {
    canonical: industries.canonical
  }
};

export default function IndustriesPage() {
  return (
    <>
      {/* ✅ SCHEMA (FIXED) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(industries.schema),
        }}
      />

      <IndustriesClient />
    </>
  );
}