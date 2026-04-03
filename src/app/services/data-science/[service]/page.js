import DataScienceSEOData from "@/seo/DataScienceSEOData";
import DataScienceServicePage from "./DataScienceServicePage";

// ✅ META
export async function generateMetadata({ params }) {
  const { service } = await params;

  const seo = DataScienceSEOData?.["data-science"]?.[service] || {};

  return {
    title: seo.title || "Data Science Services | Atorix IT",
    description: seo.description || "",
  };
}

// ✅ PAGE
export default function Page(props) {
  return <DataScienceServicePage {...props} />;
}