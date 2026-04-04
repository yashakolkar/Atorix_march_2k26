/**
 * layout.jsx — Root Layout (Performance Optimized)
 * Atorix IT | Next.js App Router
 *
 * ✅ KEY CHANGES:
 * 1. Converted to Server Component (removed "use client") — eliminates JS for layout
 * 2. Moved client-side logic to a separate ClientLayout wrapper
 * 3. Added proper metadata export for SEO (only works in server components)
 * 4. Preload LCP image in <head>
 * 5. Defer all third-party scripts
 */

// ─── Next.js Core ────────────────────────────────────────────
import { Inter } from "next/font/google";
import Script from "next/script";

// ─── Global Styles ───────────────────────────────────────────
import "./globals.css";

// ─── Client Layout Wrapper ──────────────────────────────────
import ClientLayout from "@/components/common/ClientLayout";

// ─── Font Setup (eliminates render-blocking Google Fonts CSS) ─
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

// ─── Metadata (SEO — only works in Server Components) ────────
export const metadata = {
  title: "Atorix IT — SAP Implementation & IT Solutions",
  description:
    "Transform your business with SAP implementation services, IT solutions, and digital transformation from Atorix IT.",
  metadataBase: new URL("https://atorix-march-2k26.vercel.app"),
};

// ─── Viewport ────────────────────────────────────────────────
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

// ─────────────────────────────────────────────────────────────
// RootLayout (Server Component — zero client JS)
// ─────────────────────────────────────────────────────────────
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        {/* ✅ Ahrefs Verification Meta */}
        <meta
          name="ahrefs-site-verification"
          content="794fa130a0f6bb8fcbc1d5b8b7b0bd70375b849283f7ac435dc4ee3f9450b1aa"
        />

        {/* ✅ Preload LCP image — eliminates 3,650ms resource load delay */}
        <link
          rel="preload"
          as="image"
          type="image/webp"
          href="/images/services/Webp/SAP-Services.webp"
          fetchPriority="high"
        />

        {/* ✅ DNS prefetch for third-party domains */}
        <link rel="dns-prefetch" href="https://embed.tawk.to" />
        <link rel="dns-prefetch" href="https://analytics.ahrefs.com" />
      </head>

      <body className={`${inter.className} bg-background text-foreground`}>
        {/* ✅ Client-side providers & layout moved to separate component */}
        <ClientLayout>{children}</ClientLayout>

        {/* ✅ Third-party scripts — ALL lazyOnload to reduce TBT */}

        {/* Ahrefs Analytics — deferred */}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="Je7LdX6DWIh1uupYQu89Kg"
          strategy="lazyOnload"
        />

        {/* Tawk.to — lazyOnload */}
        <Script
          id="tawk-main"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.Tawk_API = window.Tawk_API || {};
              window.Tawk_LoadStart = new Date();
              (function () {
                var s1 = document.createElement("script");
                var s0 = document.getElementsByTagName("script")[0];
                s1.async = true;
                s1.src = "https://embed.tawk.to/66a4ec76becc2fed692be739/1i3q3nbqb";
                s1.charset = "UTF-8";
                s1.setAttribute("crossorigin", "*");
                s0.parentNode.insertBefore(s1, s0);
              })();
            `,
          }}
        />

        {/* Tawk control — lazyOnload */}
        <Script
          id="tawk-control"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.Tawk_API = window.Tawk_API || {};

              function isBusinessHours() {
                var now = new Date();
                var istTime = new Date(
                  now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
                );
                var day = istTime.getDay();
                var hour = istTime.getHours();
                return day >= 1 && day <= 5 && hour >= 10 && hour < 19;
              }

              window.Tawk_API.onLoaded = function () {
                function setWidgetStyle() {
                  if (!window.Tawk_API.customStyle) return;
                  var widgetWidth = Math.min(360, window.innerWidth - 24);
                  var widgetHeight = Math.min(520, window.innerHeight - 140);
                  window.Tawk_API.customStyle({
                    widget: { width: widgetWidth, height: widgetHeight },
                    visibility: {
                      desktop: { position: "br", xOffset: 12, yOffset: 18 },
                      mobile: { position: "br", xOffset: 12, yOffset: 18 },
                    },
                  });
                }
                setWidgetStyle();
                if (isBusinessHours()) {
                  window.Tawk_API.showWidget();
                } else {
                  window.Tawk_API.hideWidget();
                }
              };
            `,
          }}
        />
      </body>
    </html>
  );
}
