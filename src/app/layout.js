/**
 * layout.jsx — Root Layout
 * Atorix IT | Next.js App Router
 */

"use client";

// ─── Next.js Core ────────────────────────────────────────────
import { Inter } from "next/font/google";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import "./globals.css"; // keep minimal
import { Inter } from "next/font/google";
// ─── Global Styles ───────────────────────────────────────────
import "./globals.css";

// ─── Providers ───────────────────────────────────────────────
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
// import { ChatProvider } from "@/context/ChatContext";
import dynamic from "next/dynamic";
const ChatProvider = dynamic(
  () => import("@/context/ChatContext").then((m) => m.ChatProvider),
  { ssr: false },
);

// ─── Shared UI Components ────────────────────────────────────
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import FloatingContactButtons from "@/components/common/FloatingContactButtons";
import PopupContactForm from "@/components/common/PopupContactForm";

// ─── Utilities / API ─────────────────────────────────────────
import { pingBackend } from "@/lib/api";
import "@/utils/api/apiInterceptor";

// ─── Font Setup ──────────────────────────────────────────────
// const inter = Inter({ subsets: ["latin"] });
// ✅ Use next/font instead of Google Fonts CSS link
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
// ─────────────────────────────────────────────────────────────
// RootLayout
// ─────────────────────────────────────────────────────────────

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith("/admin");

  useEffect(() => {
    pingBackend();
  }, []);

  return (
    <html lang="en" className="light">
      <head>
        {/* ✅ Ahrefs Verification Meta */}
        <meta
          name="ahrefs-site-verification"
          content="794fa130a0f6bb8fcbc1d5b8b7b0bd70375b849283f7ac435dc4ee3f9450b1aa"
        />

        {/* ✅ Public Scripts Only */}
        {!isAdminRoute && (
          <>
            {/* ✅ Ahrefs Analytics */}
            <Script
              src="https://analytics.ahrefs.com/analytics.js"
              data-key="Je7LdX6DWIh1uupYQu89Kg"
              strategy="afterInteractive"
            />

            {/* ✅ Tawk Script 1 */}
            <Script
              id="tawk-main"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: `
                  window.Tawk_API     = window.Tawk_API     || {};
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

            {/* ✅ Tawk Script 2 */}
            <Script
              id="tawk-control"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.Tawk_API = window.Tawk_API || {};

                  function isBusinessHours() {
                    const now = new Date();
                    const istTime = new Date(
                      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
                    );
                    const day = istTime.getDay();
                    const hour = istTime.getHours();
                    return day >= 1 && day <= 5 && hour >= 10 && hour < 19;
                  }

                  window.Tawk_API.onLoaded = function () {

                    function setWidgetStyle() {
                      if (!window.Tawk_API.customStyle) return;

                      const widgetWidth = Math.min(360, window.innerWidth - 24);
                      const widgetHeight = Math.min(520, window.innerHeight - 140);

                      window.Tawk_API.customStyle({
                        widget: {
                          width: widgetWidth,
                          height: widgetHeight,
                        },
                        visibility: {
                          desktop: {
                            position: "br",
                            xOffset: 12,
                            yOffset: 18,
                          },
                          mobile: {
                            position: "br",
                            xOffset: 12,
                            yOffset: 18,
                          },
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

              {/* Floating Buttons */}
              {!isAdminRoute && <FloatingContactButtons />}

              {/* Popup Form */}
              {!isAdminRoute && <PopupContactForm />}
            </ChatProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
