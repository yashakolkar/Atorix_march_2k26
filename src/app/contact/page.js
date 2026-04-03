import { seoData } from "@/seo/seoData";
import ContactClient from "./ContactClient";

const { contact } = seoData;

// ✅ SEO Metadata
export const metadata = {
  title: contact.title,
  description: contact.description,
  keywords: contact.keywords,
  openGraph: contact.openGraph,
  alternates: {
    canonical: contact.canonical
  }
};

export default function ContactPage() {
  return (
    <>
      {/* ✅ SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contact.schema),
        }}
      />

      <ContactClient />
    </>
  );
}