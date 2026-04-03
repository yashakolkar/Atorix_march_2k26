/**
 * page.jsx — Home Page
 * Atorix IT | Next.js App Router
 *
 * Responsibilities:
 *  - Exports `metadata` for Next.js to inject SEO tags into <head>
 *  - Injects a JSON-LD structured data schema for search engines
 *  - Renders all home page sections in order
 *
 * Route: /  (app/page.jsx)
 */

// ─── SEO Data ────────────────────────────────────────────────
// Centralised SEO config — titles, descriptions, OG tags, schema
import { seoData } from "@/seo/seoData";

// ─── Home Page Sections ──────────────────────────────────────
import HeroSection from "@/components/home/HeroSection";
import ClientsSection from "@/components/home/ClientsSection";
import ServicesSection from "@/components/home/ServicesSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import IndustriesSection from "@/components/home/IndustriesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CtaSection from "@/components/home/CtaSection";

// ─────────────────────────────────────────────────────────────
// Metadata Export
// ─────────────────────────────────────────────────────────────
/**
 * Next.js reads this export at build time and injects the values
 * into the <head> of the page automatically.
 *
 * - title       → <title> tag
 * - description → <meta name="description">
 * - keywords    → <meta name="keywords">
 * - openGraph   → Open Graph tags for social sharing (Facebook, LinkedIn, etc.)
 * - alternates  → <link rel="canonical"> to avoid duplicate-content penalties
 */
export const metadata = {
  title: seoData.home.title,
  description: seoData.home.description,
  keywords: seoData.home.keywords,
  openGraph: seoData.home.openGraph,
  alternates: {
    canonical: seoData.home.canonical,
  },
};

// ─────────────────────────────────────────────────────────────
// HomePage Component
// ─────────────────────────────────────────────────────────────
/**
 * This is a React Server Component (RSC) by default in the App Router.
 * No "use client" directive is needed here — sections that require
 * client-side interactivity declare "use client" in their own files.
 */
export default function HomePage() {
  return (
    <>
      {/*
       * ── JSON-LD Structured Data ────────────────────────────
       *
       * Embeds schema.org markup so Google and other search engines
       * can understand the page content (e.g. Organisation, WebSite,
       * BreadcrumbList, etc.).
       *
       * dangerouslySetInnerHTML is intentional and safe here because
       * the data comes from our own controlled seoData config object,
       * not from user input.
       *
       * JSON.stringify() serialises the schema object into a valid
       * JSON string for the <script> tag.
       */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(seoData.home.schema),
        }}
      />

      {/* ── Page Sections (top → bottom) ──────────────────── */}

      {/* 1. Hero — main headline, CTA buttons, visual */}
      <HeroSection />

      {/* 2. Clients — logo marquee of client/partner brands */}
      <ClientsSection />

      {/* 3. Services — cards listing core service offerings */}
      <ServicesSection />

      {/* 4. Features — key differentiators / why choose us */}
      <FeaturesSection />

      {/* 5. Industries — sectors the company serves */}
      <IndustriesSection />

      {/* 6. Testimonials — client reviews / social proof */}
      <TestimonialsSection />

      {/* 7. CTA — final call-to-action before the footer */}
      <CtaSection />
    </>
  );
}
