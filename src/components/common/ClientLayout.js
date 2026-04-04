/**
 * ClientLayout.jsx — Client-side layout wrapper
 *
 * ✅ Extracted from layout.js so the root layout stays a Server Component.
 * Contains providers, navbar, footer, and lazy-loaded UI.
 */

"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// ─── Providers ───────────────────────────────────────────────
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AuthProvider } from "@/context/AuthContext";

// ─── Lazy-loaded heavy providers & components ────────────────
import dynamic from "next/dynamic";

const ChatProvider = dynamic(
  () => import("@/context/ChatContext").then((m) => m.ChatProvider),
  { ssr: false },
);

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

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  // Ping backend once on mount — deferred to not block main thread
  useEffect(() => {
    const id =
      typeof requestIdleCallback !== "undefined"
        ? requestIdleCallback(() => pingBackend())
        : setTimeout(() => pingBackend(), 3000);

    return () => {
      if (typeof cancelIdleCallback !== "undefined") cancelIdleCallback(id);
      else clearTimeout(id);
    };
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AuthProvider>
        <ChatProvider>
          {!isAdminRoute && <Navbar />}
          <main>{children}</main>
          {!isAdminRoute && <Footer />}
          {!isAdminRoute && <FloatingContactButtons />}
          {!isAdminRoute && <PopupContactForm />}
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
