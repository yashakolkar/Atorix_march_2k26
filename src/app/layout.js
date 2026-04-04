/**
 * layout.jsx — Root Layout (Performance Optimized)
 * Atorix IT | Next.js App Router
 */

"use client";

// ─── Next.js Core ────────────────────────────────────────────
import { Inter } from "next/font/google";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// ─── Global Styles ───────────────────────────────────────────
import "./globals.css";

// ─── Providers ───────────────────────────────────────────────
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AuthProvider } from "@/context/AuthContext";

// ─── Lazy-loaded heavy providers & components ────────────────
import dynamic from "next/dynamic";

const ChatProvider = dynamic(
  () => import("@/context/ChatContext").then((m) => m.ChatProvider),
  { ssr: false },
);

// Lazy load non-critical UI (not needed for initial render / LCP)
const FloatingContactButtons = dynamic(
  () => import("@/components/common/FloatingContactButtons"),
  { ssr: false },
);

const PopupContactForm = dynamic(
  () => import("@/components/common/PopupContactForm"),
  { ssr: false },
);

// ─── Shared UI (critical — keep eager) ───────────────────────
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

// ─── Utilities / API ─────────────────────────────────────────
import { pingBackend } from "@/lib/api";
import "@/utils/api/apiInterceptor";

// ─── Font Setup (eliminates render-blocking Google Fonts CSS) ─
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

// ─────────────────────────────────────────────────────────────
// RootLayout
// ─────────────────────────────────────────────────────────────

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  // Ping backend once on mount
  useEffect(() => {
    // Defer non-critical work so it doesn't block main thread
    const id = requestIdleCallback
      ? requestIdleCallback(() => pingBackend())
      : setTimeout(() => pingBackend(), 3000);

    return () => {
      if (typeof cancelIdleCallback !== "undefined") cancelIdleCallback(id);
      else clearTimeout(id);
    };
  }, []);

  return (
    <html lang="en" className="light">
      <head>
        {/* ✅ Ahrefs Verification Meta */}
        <meta
          name="ahrefs-site-verification"
          content="794fa130a0f6bb8fcbc1d5b8b7b0bd70375b849283f7ac435dc4ee3f9450b1aa"
        />

        {/* ✅ Preload LCP image to eliminate resource load delay */}
        <link
          rel="preload"
          as="image"
          type="image/webp"
          href="/images/services/Webp/SAP-Services.webp"
          fetchPriority="high"
        />
      </head>

      <body className={`${inter.className} bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <AuthProvider>
            <ChatProvider>
              {/* Navbar */}
              {!isAdminRoute && <Navbar />}

              {/* Page Content */}
              <main>{children}</main>

              {/* Footer */}
              {!isAdminRoute && <Footer />}

              {/* Non-critical UI — lazy loaded */}
              {!isAdminRoute && <FloatingContactButtons />}
              {!isAdminRoute && <PopupContactForm />}
            </ChatProvider>
          </AuthProvider>
        </ThemeProvider>

        {/* ✅ Third-party scripts — ALL lazyOnload to reduce TBT */}
        {!isAdminRoute && (
          <>
            {/* Ahrefs Analytics — deferred */}
            <Script
              src="https://analytics.ahrefs.com/analytics.js"
              data-key="Je7LdX6DWIh1uupYQu89Kg"
              strategy="lazyOnload"
            />

            {/* Tawk.to — lazyOnload (was afterInteractive, blocking main thread) */}
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
          </>
        )}
      </body>
    </html>
  );
}
