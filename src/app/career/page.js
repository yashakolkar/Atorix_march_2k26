import { seoData } from "@/seo/seoData";
import CareerClient from "./CareerClient";

const { career } = seoData;

// ✅ SEO Metadata
export const metadata = {
  title: career.title,
  description: career.description,
  keywords: career.keywords,
  openGraph: career.openGraph,
  alternates: {
    canonical: career.canonical
  }
};

export default function CareerPage() {
  return (
    <>
      {/* ✅ SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(career.schema),
        }}
      />

      <CareerClient />
    </>
  );
}