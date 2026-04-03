import { seoData } from "@/seo/seoData";
import ServicesClient from "./ServicesClient";

const { services } = seoData;

// ✅ SEO Metadata
export const metadata = {
  title: services.title,
  description: services.description,
  keywords: services.keywords,
  openGraph: services.openGraph,
  alternates: {
    canonical: services.canonical
  }
};

export default function ServicesPage() {
  return (
    <>
      {/* ✅ ADD SCHEMA FROM seoData.js */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(services.schema),
        }}
      />

      <ServicesClient />
    </>
  );
}