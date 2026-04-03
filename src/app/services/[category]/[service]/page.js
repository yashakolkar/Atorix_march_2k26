import servicesSEOData from "@/seo/ServicesPageSEOData";
import ServiceDetailPage from "./ServiceDetailPage";

// ✅ META
export async function generateMetadata({ params }) {
  const { category, service } = await params;

  const seo = servicesSEOData?.[category]?.[service] || {};

  return {
    title: seo.title || "Atorix IT Services",
    description: seo.description || "",
  };
}

// ✅ PAGE
export default async function Page(props) {
  const { category, service } = await props.params;

  const seo = servicesSEOData?.[category]?.[service] || {};

  return (
    <>
      {/* ✅ SCHEMA INJECTION */}
      {seo.schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(seo.schema),
          }}
        />
      )}

      <ServiceDetailPage {...props} />
    </>
  );
}