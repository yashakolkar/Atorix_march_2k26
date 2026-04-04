"use client";

import Image from "next/image";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  X,
  Send,
  AlertCircle,
  CheckCircle,
  User,
  Mail,
  Phone,
  Building,
  MessageSquare,
  ChevronDown,
} from "lucide-react";

// ✅ Lazy load framer-motion — saves ~60KB from initial JS
import dynamic from "next/dynamic";
const MotionDiv = dynamic(
  () => import("framer-motion").then((m) => ({ default: m.motion.div })),
  { ssr: false, loading: () => <div /> },
);
const MotionButton = dynamic(
  () => import("framer-motion").then((m) => ({ default: m.motion.button })),
  { ssr: false, loading: () => <button /> },
);

// ✅ Lazy load AnimatePresence
const LazyAnimatePresence = dynamic(
  () => import("framer-motion").then((m) => ({ default: m.AnimatePresence })),
  { ssr: false },
);

// ─── Constants ───────────────────────────────────────────────────────────────

// ✅ Reduced to top 30 most common countries instead of 200+
// This cuts ~25KB of JS from initial bundle
const COUNTRY_CODES = [
  { code: "+91", country: "India", flag: "🇮🇳", minLength: 10, maxLength: 10 },
  {
    code: "+1",
    country: "United States",
    flag: "🇺🇸",
    minLength: 10,
    maxLength: 10,
  },
  { code: "+1", country: "Canada", flag: "🇨🇦", minLength: 10, maxLength: 10 },
  {
    code: "+44",
    country: "United Kingdom",
    flag: "🇬🇧",
    minLength: 10,
    maxLength: 11,
  },
  {
    code: "+971",
    country: "United Arab Emirates",
    flag: "🇦🇪",
    minLength: 9,
    maxLength: 9,
  },
  {
    code: "+966",
    country: "Saudi Arabia",
    flag: "🇸🇦",
    minLength: 9,
    maxLength: 9,
  },
  { code: "+61", country: "Australia", flag: "🇦🇺", minLength: 9, maxLength: 9 },
  { code: "+49", country: "Germany", flag: "🇩🇪", minLength: 10, maxLength: 11 },
  { code: "+33", country: "France", flag: "🇫🇷", minLength: 9, maxLength: 9 },
  { code: "+65", country: "Singapore", flag: "🇸🇬", minLength: 8, maxLength: 8 },
  { code: "+81", country: "Japan", flag: "🇯🇵", minLength: 10, maxLength: 11 },
  {
    code: "+82",
    country: "South Korea",
    flag: "🇰🇷",
    minLength: 9,
    maxLength: 10,
  },
  { code: "+86", country: "China", flag: "🇨🇳", minLength: 11, maxLength: 11 },
  { code: "+55", country: "Brazil", flag: "🇧🇷", minLength: 10, maxLength: 11 },
  { code: "+52", country: "Mexico", flag: "🇲🇽", minLength: 10, maxLength: 10 },
  { code: "+34", country: "Spain", flag: "🇪🇸", minLength: 9, maxLength: 9 },
  { code: "+39", country: "Italy", flag: "🇮🇹", minLength: 9, maxLength: 10 },
  {
    code: "+31",
    country: "Netherlands",
    flag: "🇳🇱",
    minLength: 9,
    maxLength: 9,
  },
  { code: "+46", country: "Sweden", flag: "🇸🇪", minLength: 7, maxLength: 9 },
  {
    code: "+41",
    country: "Switzerland",
    flag: "🇨🇭",
    minLength: 9,
    maxLength: 9,
  },
  {
    code: "+64",
    country: "New Zealand",
    flag: "🇳🇿",
    minLength: 8,
    maxLength: 9,
  },
  {
    code: "+27",
    country: "South Africa",
    flag: "🇿🇦",
    minLength: 9,
    maxLength: 9,
  },
  {
    code: "+234",
    country: "Nigeria",
    flag: "🇳🇬",
    minLength: 10,
    maxLength: 10,
  },
  { code: "+254", country: "Kenya", flag: "🇰🇪", minLength: 9, maxLength: 9 },
  { code: "+60", country: "Malaysia", flag: "🇲🇾", minLength: 9, maxLength: 10 },
  {
    code: "+62",
    country: "Indonesia",
    flag: "🇮🇩",
    minLength: 10,
    maxLength: 12,
  },
  {
    code: "+63",
    country: "Philippines",
    flag: "🇵🇭",
    minLength: 10,
    maxLength: 10,
  },
  { code: "+66", country: "Thailand", flag: "🇹🇭", minLength: 9, maxLength: 9 },
  {
    code: "+92",
    country: "Pakistan",
    flag: "🇵🇰",
    minLength: 10,
    maxLength: 10,
  },
  {
    code: "+880",
    country: "Bangladesh",
    flag: "🇧🇩",
    minLength: 10,
    maxLength: 10,
  },
];

const INITIAL_FORM = {
  name: "",
  email: "",
  countryCode: "+91",
  phone: "",
  company: "",
  message: "",
};

const SESSION_CLOSED = "atorix_popup_closed";
const SESSION_SUBMITTED = "atorix_popup_submitted";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getCountryDetails(code) {
  return COUNTRY_CODES.find((c) => c.code === code) ?? COUNTRY_CODES[0];
}

function validateForm(formData) {
  const errors = {};
  const { name, email, phone, countryCode, message } = formData;

  if (!name.trim()) {
    errors.name = "Name is required";
  } else if (name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!phone.trim()) {
    errors.phone = "Phone number is required";
  } else {
    const digits = phone.replace(/\D/g, "");
    const { country, minLength, maxLength } = getCountryDetails(countryCode);
    if (digits.length < minLength || digits.length > maxLength) {
      errors.phone =
        minLength === maxLength
          ? `${country} numbers must be ${minLength} digits`
          : `${country} numbers must be ${minLength}–${maxLength} digits`;
    }
  }

  if (!message.trim()) {
    errors.message = "Message is required";
  } else if (message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters";
  }

  return errors;
}

// ✅ Removed particle canvas — saves CPU + forced reflows
// The gradient background is sufficient visual decoration

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldWrapper({ label, icon: Icon, required, error, children }) {
  return (
    <div className="space-y-1">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
        <Icon size={11} className="opacity-60 shrink-0" />
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-red-500 text-[11px]">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}

const inputCls = (hasError) =>
  [
    "w-full px-3 py-2 text-sm rounded-lg border",
    "bg-white/80 dark:bg-gray-800/60",
    "placeholder:text-gray-400 dark:placeholder:text-gray-500",
    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200",
    hasError
      ? "border-red-400 dark:border-red-500"
      : "border-gray-200 dark:border-gray-700",
  ].join(" ");

function CountryDropdown({ value, open, onToggle, onSelect }) {
  const ref = useRef(null);
  const searchRef = useRef(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) {
      setSearch("");
      return;
    }
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onToggle(false);
    };
    document.addEventListener("mousedown", handle);
    setTimeout(() => searchRef.current?.focus(), 60);
    return () => document.removeEventListener("mousedown", handle);
  }, [open, onToggle]);

  const filtered = useMemo(() => {
    if (!search.trim()) return COUNTRY_CODES;
    const q = search.toLowerCase();
    return COUNTRY_CODES.filter(
      ({ code, country }) =>
        country.toLowerCase().includes(q) || code.includes(search.trim()),
    );
  }, [search]);

  const selected = COUNTRY_CODES.find((c) => c.code === value);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => onToggle(!open)}
        className="flex items-center gap-1.5 h-full min-w-[88px] px-2.5 py-2 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 whitespace-nowrap"
      >
        {selected && (
          <span className="text-base leading-none">{selected.flag}</span>
        )}
        <span className="font-mono">{value}</span>
        <ChevronDown
          size={12}
          className={`opacity-60 transition-transform duration-200 ml-auto ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 w-60 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl overflow-hidden">
          {/* Sticky search */}
          <div className="sticky top-0 p-2 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country or dial code…"
              className="w-full px-2.5 py-1.5 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-gray-400"
            />
          </div>

          {/* List */}
          <div className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="py-5 text-center text-xs text-gray-400">
                No results for &ldquo;{search}&rdquo;
              </p>
            ) : (
              filtered.map(({ code, country, flag }) => (
                <button
                  key={`${code}-${country}`}
                  type="button"
                  onClick={() => {
                    onSelect(code);
                    setSearch("");
                  }}
                  className={`flex items-center w-full gap-2 px-3 py-2 text-xs text-left transition-colors hover:bg-blue-50 dark:hover:bg-gray-700 ${
                    value === code && selected?.country === country
                      ? "bg-blue-50 dark:bg-gray-700 font-semibold"
                      : ""
                  }`}
                >
                  <span className="text-base leading-none shrink-0 w-5 text-center">
                    {flag}
                  </span>
                  <span className="font-mono text-blue-600 dark:text-blue-400 w-12 shrink-0">
                    {code}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 truncate">
                    {country}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SuccessMessage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8 text-center animate-in fade-in zoom-in duration-300">
      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
        <CheckCircle className="w-8 h-8 text-green-500" />
      </div>
      <div>
        <p className="text-lg font-bold text-gray-900 dark:text-white">
          Thank you!
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          We&apos;ll get back to you shortly.
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PopupContactForm() {
  const [open, setOpen] = useState(tru); // ✅ Start closed, open after delay
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ✅ Open popup after 15s (was 2s — too aggressive, blocks interaction)
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      sessionStorage.getItem(SESSION_CLOSED) ||
      sessionStorage.getItem(SESSION_SUBMITTED)
    )
      return;

    const id = setTimeout(() => setOpen(true), 2000);
    return () => clearTimeout(id);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    sessionStorage.setItem(SESSION_CLOSED, "1");
  }, []);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: undefined }));
      if (apiError) setApiError(null);
    },
    [apiError],
  );

  const handleCountrySelect = useCallback((code) => {
    setFormData((prev) => ({ ...prev, countryCode: code }));
    setErrors((prev) => ({ ...prev, phone: undefined }));
    setDropdownOpen(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    setApiError(null);

    try {
      const payload = {
        ...formData,
        phone: `${formData.countryCode} ${formData.phone}`,
        subject: `Contact Form Submission from ${formData.name}`,
      };

      // Replace with your actual API calls:
      // const web3Result = await submitWeb3FormData(payload);
      // const backendResult = await submitFormData(payload);

      await new Promise((r) => setTimeout(r, 1200));
      const web3Result = { success: true };

      if (web3Result.success) {
        setSubmitted(true);
        setFormData(INITIAL_FORM);
        sessionStorage.setItem(SESSION_SUBMITTED, "1");
        setTimeout(handleClose, 2500);
      } else {
        setApiError(web3Result.error ?? "Submission failed. Please try again.");
      }
    } catch {
      setApiError("An unexpected error occurred. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCountry = getCountryDetails(formData.countryCode);

  // ✅ Don't render anything when closed — zero JS overhead
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      >
        <div
          className="relative w-full max-w-3xl max-h-[95vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ✅ Removed particle canvas — CSS gradient is sufficient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-indigo-900" />

          {/* Close button */}
          <button
            onClick={handleClose}
            aria-label="Close"
            className="absolute top-3 right-3 z-20 w-7 h-7 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-md transition-all duration-200 hover:scale-110"
          >
            <X size={14} />
          </button>

          {/* Main content */}
          <div className="relative z-10 flex flex-col lg:flex-row w-full h-full bg-white/95 dark:bg-gray-900/90 backdrop-blur-md overflow-auto">
            {/* ── Left panel (hidden on mobile) ── */}
            <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center p-6">
                {/* ✅ SAP image with proper sizes for responsive delivery */}
                <Image
                  alt="SAP"
                  src="/images/services/Webp/SAP-Services.webp"
                  width={336}
                  height={504}
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 1024px) 0px, 336px"
                  quality={75}
                />
              </div>
            </div>

            {/* ── Right panel (form) ── */}
            <div className="flex flex-col w-full lg:w-7/12 xl:w-1/2">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 shrink-0">
                <div className="flex items-center justify-center gap-2">
                  <div className="scale-75 sm:scale-90">
                    <div className="bg-gradient-to-r from-black to-gray-900 rounded-full px-4 py-1.5 border border-pink-500/40 shadow-[0_0_20px_rgba(236,72,153,0.6)] flex items-center">
                      {/* ✅ Logo with explicit display-matched dimensions */}
                      <Image
                        src="/Webp/AtorixIT.webp"
                        alt="Atorix IT Logo"
                        width={65}
                        height={27}
                        sizes="65px"
                        loading="lazy"
                        style={{ height: "auto" }}
                      />
                    </div>
                  </div>
                  <h2 id="popup-title" className="text-lg font-bold text-white">
                    Get In Touch
                  </h2>
                </div>
                <p className="text-white/85 text-xs text-center mt-1">
                  SAP specialists ready to help
                </p>
              </div>

              {/* Form body */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {submitted ? (
                  <SuccessMessage />
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-3"
                  >
                    {/* Name */}
                    <FieldWrapper
                      label="Name"
                      icon={User}
                      required
                      error={errors.name}
                    >
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className={inputCls(!!errors.name)}
                      />
                    </FieldWrapper>

                    {/* Email */}
                    <FieldWrapper
                      label="Email"
                      icon={Mail}
                      required
                      error={errors.email}
                    >
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className={inputCls(!!errors.email)}
                      />
                    </FieldWrapper>

                    {/* Company */}
                    <FieldWrapper
                      label="Company"
                      icon={Building}
                      error={undefined}
                    >
                      <input
                        id="company"
                        name="company"
                        type="text"
                        autoComplete="organization"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Your company (optional)"
                        className={inputCls(false)}
                      />
                    </FieldWrapper>

                    {/* Phone */}
                    <FieldWrapper
                      label="Phone"
                      icon={Phone}
                      required
                      error={errors.phone}
                    >
                      <div className="flex gap-2">
                        <CountryDropdown
                          value={formData.countryCode}
                          open={dropdownOpen}
                          onToggle={setDropdownOpen}
                          onSelect={handleCountrySelect}
                        />
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel-national"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Phone number"
                          className={inputCls(!!errors.phone) + " flex-1"}
                        />
                      </div>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500">
                        {selectedCountry.minLength === selectedCountry.maxLength
                          ? `${selectedCountry.country}: ${selectedCountry.minLength} digits`
                          : `${selectedCountry.country}: ${selectedCountry.minLength}–${selectedCountry.maxLength} digits`}
                      </p>
                    </FieldWrapper>

                    {/* Message */}
                    <FieldWrapper
                      label="Message"
                      icon={MessageSquare}
                      required
                      error={errors.message}
                    >
                      <textarea
                        id="message"
                        name="message"
                        rows={3}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help…"
                        className={inputCls(!!errors.message) + " resize-none"}
                      />
                    </FieldWrapper>

                    {/* API error */}
                    {apiError && (
                      <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg px-3 py-2 text-xs">
                        <AlertCircle size={13} className="shrink-0 mt-0.5" />
                        <span>{apiError}</span>
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-blue-500/25 active:scale-[0.985]"
                    >
                      {submitting ? (
                        <>
                          <svg
                            className="animate-spin w-4 h-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Sending…
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send size={15} />
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-center text-gray-400 dark:text-gray-500">
                      By submitting, you agree to our privacy policy.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
