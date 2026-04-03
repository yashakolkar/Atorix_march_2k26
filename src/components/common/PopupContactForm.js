"use client";
// import NeonLogoBorder from "@/components/NeonLogoBorder";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import Image from "next/image";
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
// import { tree } from "next/dist/build/templates/app-page";

// ─── Constants ───────────────────────────────────────────────────────────────

const COUNTRY_CODES = [
  // ── Americas ──────────────────────────────────────────────────────────────
  {
    code: "+1",
    country: "United States",
    flag: "🇺🇸",
    minLength: 10,
    maxLength: 10,
  },
  { code: "+1", country: "Canada", flag: "🇨🇦", minLength: 10, maxLength: 10 },
  { code: "+52", country: "Mexico", flag: "🇲🇽", minLength: 10, maxLength: 10 },
  { code: "+55", country: "Brazil", flag: "🇧🇷", minLength: 10, maxLength: 11 },
  {
    code: "+54",
    country: "Argentina",
    flag: "🇦🇷",
    minLength: 10,
    maxLength: 11,
  },
  { code: "+56", country: "Chile", flag: "🇨🇱", minLength: 9, maxLength: 9 },
  {
    code: "+57",
    country: "Colombia",
    flag: "🇨🇴",
    minLength: 10,
    maxLength: 10,
  },
  { code: "+51", country: "Peru", flag: "🇵🇪", minLength: 9, maxLength: 9 },
  {
    code: "+58",
    country: "Venezuela",
    flag: "🇻🇪",
    minLength: 10,
    maxLength: 10,
  },
  { code: "+593", country: "Ecuador", flag: "🇪🇨", minLength: 9, maxLength: 9 },
  { code: "+591", country: "Bolivia", flag: "🇧🇴", minLength: 8, maxLength: 8 },
  { code: "+595", country: "Paraguay", flag: "🇵🇾", minLength: 9, maxLength: 9 },
  { code: "+598", country: "Uruguay", flag: "🇺🇾", minLength: 8, maxLength: 9 },
  { code: "+592", country: "Guyana", flag: "🇬🇾", minLength: 7, maxLength: 7 },
  { code: "+597", country: "Suriname", flag: "🇸🇷", minLength: 6, maxLength: 7 },
  {
    code: "+594",
    country: "French Guiana",
    flag: "🇬🇫",
    minLength: 9,
    maxLength: 9,
  },
  { code: "+53", country: "Cuba", flag: "🇨🇺", minLength: 8, maxLength: 8 },
  {
    code: "+1-809",
    country: "Dominican Republic",
    flag: "🇩🇴",
    minLength: 10,
    maxLength: 10,
  },
  {
    code: "+1-876",
    country: "Jamaica",
    flag: "🇯🇲",
    minLength: 10,
    maxLength: 10,
  },
  {
    code: "+1-868",
    country: "Trinidad and Tobago",
    flag: "🇹🇹",
    minLength: 10,
    maxLength: 10,
  },
  {
    code: "+1-246",
    country: "Barbados",
    flag: "🇧🇧",
    minLength: 10,
    maxLength: 10,
  },
  {
    code: "+1-473",
    country: "Grenada",
    flag: "🇬🇩",
    minLength: 10,
    maxLength: 10,
  },
  {
    code: "+1-758",
    country: "Saint Lucia",
    flag: "🇱🇨",
    minLength: 10,
    maxLength: 10,
  },
  {
    code: "+1-784",
    country: "Saint Vincent & Grenadines",
    flag: "🇻🇨",
    minLength: 10,
    maxLength: 10,
  },
  {
    code: "+1-767",
    country: "Dominica",
    flag: "🇩🇲",
    minLength: 10,
    maxLength: 10,
  },
  {
    code: "+1-869",
    country: "Saint Kitts and Nevis",
    flag: "🇰🇳",
    minLength: 10,
    maxLength: 10,
  },
  {
    code: "+1-268",
    country: "Antigua and Barbuda",
    flag: "🇦🇬",
    minLength: 10,
    maxLength: 10,
  },
  {
    code: "+1-264",
    country: "Anguilla",
    flag: "🇦🇮",
    minLength: 10,
    maxLength: 10,
  },
  {
    code: "+1-721",
    country: "Sint Maarten",
    flag: "🇸🇽",
    minLength: 10,
    maxLength: 10,
  },
  {
    code: "+1-649",
    country: "Turks and Caicos",
    flag: "🇹🇨",
    minLength: 10,
    maxLength: 10,
  },
  {
    code: "+1-284",
    country: "British Virgin Islands",
    flag: "🇻🇬",
    minLength: 10,
    maxLength: 10,
  },
  {
    code: "+1-340",
    country: "US Virgin Islands",
    flag: "🇻🇮",
    minLength: 10,
    maxLength: 10,
  },
  {
    code: "+1-787",
    country: "Puerto Rico",
    flag: "🇵🇷",
    minLength: 10,
    maxLength: 10,
  },
  { code: "+509", country: "Haiti", flag: "🇭🇹", minLength: 8, maxLength: 8 },
  {
    code: "+506",
    country: "Costa Rica",
    flag: "🇨🇷",
    minLength: 8,
    maxLength: 8,
  },
  { code: "+504", country: "Honduras", flag: "🇭🇳", minLength: 8, maxLength: 8 },
  {
    code: "+503",
    country: "El Salvador",
    flag: "🇸🇻",
    minLength: 8,
    maxLength: 8,
  },
  {
    code: "+502",
    country: "Guatemala",
    flag: "🇬🇹",
    minLength: 8,
    maxLength: 8,
  },
  {
    code: "+505",
    country: "Nicaragua",
    flag: "🇳🇮",
    minLength: 8,
    maxLength: 8,
  },
  { code: "+507", country: "Panama", flag: "🇵🇦", minLength: 8, maxLength: 8 },
  {
    code: "+1-242",
    country: "Bahamas",
    flag: "🇧🇸",
    minLength: 10,
    maxLength: 10,
  },
  { code: "+599", country: "Curaçao", flag: "🇨🇼", minLength: 7, maxLength: 8 },
  {
    code: "+1-441",
    country: "Bermuda",
    flag: "🇧🇲",
    minLength: 10,
    maxLength: 10,
  },

  // ── Europe ────────────────────────────────────────────────────────────────
  {
    code: "+44",
    country: "United Kingdom",
    flag: "🇬🇧",
    minLength: 10,
    maxLength: 11,
  },
  { code: "+49", country: "Germany", flag: "🇩🇪", minLength: 10, maxLength: 11 },
  { code: "+33", country: "France", flag: "🇫🇷", minLength: 9, maxLength: 9 },
  { code: "+39", country: "Italy", flag: "🇮🇹", minLength: 9, maxLength: 10 },
  { code: "+34", country: "Spain", flag: "🇪🇸", minLength: 9, maxLength: 9 },
  {
    code: "+31",
    country: "Netherlands",
    flag: "🇳🇱",
    minLength: 9,
    maxLength: 9,
  },
  { code: "+32", country: "Belgium", flag: "🇧🇪", minLength: 9, maxLength: 9 },
  {
    code: "+41",
    country: "Switzerland",
    flag: "🇨🇭",
    minLength: 9,
    maxLength: 9,
  },
  { code: "+43", country: "Austria", flag: "🇦🇹", minLength: 7, maxLength: 12 },
  { code: "+351", country: "Portugal", flag: "🇵🇹", minLength: 9, maxLength: 9 },
  { code: "+46", country: "Sweden", flag: "🇸🇪", minLength: 7, maxLength: 9 },
  { code: "+47", country: "Norway", flag: "🇳🇴", minLength: 8, maxLength: 8 },
  { code: "+45", country: "Denmark", flag: "🇩🇰", minLength: 8, maxLength: 8 },
  { code: "+358", country: "Finland", flag: "🇫🇮", minLength: 5, maxLength: 11 },
  { code: "+353", country: "Ireland", flag: "🇮🇪", minLength: 7, maxLength: 9 },
  { code: "+354", country: "Iceland", flag: "🇮🇸", minLength: 7, maxLength: 7 },
  {
    code: "+352",
    country: "Luxembourg",
    flag: "🇱🇺",
    minLength: 9,
    maxLength: 9,
  },
  { code: "+356", country: "Malta", flag: "🇲🇹", minLength: 8, maxLength: 8 },
  { code: "+357", country: "Cyprus", flag: "🇨🇾", minLength: 8, maxLength: 8 },
  { code: "+30", country: "Greece", flag: "🇬🇷", minLength: 10, maxLength: 10 },
  { code: "+48", country: "Poland", flag: "🇵🇱", minLength: 9, maxLength: 9 },
  {
    code: "+420",
    country: "Czech Republic",
    flag: "🇨🇿",
    minLength: 9,
    maxLength: 9,
  },
  { code: "+421", country: "Slovakia", flag: "🇸🇰", minLength: 9, maxLength: 9 },
  { code: "+36", country: "Hungary", flag: "🇭🇺", minLength: 8, maxLength: 9 },
  { code: "+40", country: "Romania", flag: "🇷🇴", minLength: 9, maxLength: 9 },
  { code: "+359", country: "Bulgaria", flag: "🇧🇬", minLength: 8, maxLength: 9 },
  { code: "+385", country: "Croatia", flag: "🇭🇷", minLength: 8, maxLength: 9 },
  { code: "+386", country: "Slovenia", flag: "🇸🇮", minLength: 8, maxLength: 8 },
  {
    code: "+387",
    country: "Bosnia & Herzegovina",
    flag: "🇧🇦",
    minLength: 8,
    maxLength: 8,
  },
  { code: "+381", country: "Serbia", flag: "🇷🇸", minLength: 8, maxLength: 9 },
  {
    code: "+382",
    country: "Montenegro",
    flag: "🇲🇪",
    minLength: 8,
    maxLength: 8,
  },
  {
    code: "+389",
    country: "North Macedonia",
    flag: "🇲🇰",
    minLength: 8,
    maxLength: 8,
  },
  { code: "+355", country: "Albania", flag: "🇦🇱", minLength: 9, maxLength: 9 },
  { code: "+383", country: "Kosovo", flag: "🇽🇰", minLength: 8, maxLength: 8 },
  {
    code: "+370",
    country: "Lithuania",
    flag: "🇱🇹",
    minLength: 8,
    maxLength: 8,
  },
  { code: "+371", country: "Latvia", flag: "🇱🇻", minLength: 8, maxLength: 8 },
  { code: "+372", country: "Estonia", flag: "🇪🇪", minLength: 7, maxLength: 8 },
  { code: "+375", country: "Belarus", flag: "🇧🇾", minLength: 9, maxLength: 9 },
  { code: "+380", country: "Ukraine", flag: "🇺🇦", minLength: 9, maxLength: 9 },
  { code: "+373", country: "Moldova", flag: "🇲🇩", minLength: 8, maxLength: 8 },
  { code: "+7", country: "Russia", flag: "🇷🇺", minLength: 10, maxLength: 10 },
  {
    code: "+350",
    country: "Gibraltar",
    flag: "🇬🇮",
    minLength: 8,
    maxLength: 8,
  },
  { code: "+376", country: "Andorra", flag: "🇦🇩", minLength: 6, maxLength: 9 },
  {
    code: "+378",
    country: "San Marino",
    flag: "🇸🇲",
    minLength: 6,
    maxLength: 10,
  },
  { code: "+377", country: "Monaco", flag: "🇲🇨", minLength: 8, maxLength: 9 },
  {
    code: "+379",
    country: "Vatican City",
    flag: "🇻🇦",
    minLength: 6,
    maxLength: 11,
  },
  {
    code: "+298",
    country: "Faroe Islands",
    flag: "🇫🇴",
    minLength: 6,
    maxLength: 6,
  },
  {
    code: "+299",
    country: "Greenland",
    flag: "🇬🇱",
    minLength: 6,
    maxLength: 6,
  },
  {
    code: "+423",
    country: "Liechtenstein",
    flag: "🇱🇮",
    minLength: 7,
    maxLength: 9,
  },

  // ── Asia ──────────────────────────────────────────────────────────────────
  { code: "+91", country: "India", flag: "🇮🇳", minLength: 10, maxLength: 10 },
  { code: "+86", country: "China", flag: "🇨🇳", minLength: 11, maxLength: 11 },
  { code: "+81", country: "Japan", flag: "🇯🇵", minLength: 10, maxLength: 11 },
  {
    code: "+82",
    country: "South Korea",
    flag: "🇰🇷",
    minLength: 9,
    maxLength: 10,
  },
  { code: "+65", country: "Singapore", flag: "🇸🇬", minLength: 8, maxLength: 8 },
  { code: "+60", country: "Malaysia", flag: "🇲🇾", minLength: 9, maxLength: 10 },
  { code: "+66", country: "Thailand", flag: "🇹🇭", minLength: 9, maxLength: 9 },
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
  { code: "+84", country: "Vietnam", flag: "🇻🇳", minLength: 9, maxLength: 10 },
  { code: "+95", country: "Myanmar", flag: "🇲🇲", minLength: 8, maxLength: 10 },
  { code: "+855", country: "Cambodia", flag: "🇰🇭", minLength: 8, maxLength: 9 },
  { code: "+856", country: "Laos", flag: "🇱🇦", minLength: 8, maxLength: 9 },
  {
    code: "+880",
    country: "Bangladesh",
    flag: "🇧🇩",
    minLength: 10,
    maxLength: 10,
  },
  { code: "+94", country: "Sri Lanka", flag: "🇱🇰", minLength: 9, maxLength: 9 },
  { code: "+977", country: "Nepal", flag: "🇳🇵", minLength: 9, maxLength: 10 },
  { code: "+975", country: "Bhutan", flag: "🇧🇹", minLength: 7, maxLength: 8 },
  { code: "+960", country: "Maldives", flag: "🇲🇻", minLength: 7, maxLength: 7 },
  {
    code: "+92",
    country: "Pakistan",
    flag: "🇵🇰",
    minLength: 10,
    maxLength: 10,
  },
  {
    code: "+93",
    country: "Afghanistan",
    flag: "🇦🇫",
    minLength: 9,
    maxLength: 9,
  },
  { code: "+98", country: "Iran", flag: "🇮🇷", minLength: 10, maxLength: 10 },
  { code: "+964", country: "Iraq", flag: "🇮🇶", minLength: 10, maxLength: 10 },
  { code: "+963", country: "Syria", flag: "🇸🇾", minLength: 9, maxLength: 9 },
  { code: "+961", country: "Lebanon", flag: "🇱🇧", minLength: 7, maxLength: 8 },
  { code: "+962", country: "Jordan", flag: "🇯🇴", minLength: 9, maxLength: 9 },
  { code: "+972", country: "Israel", flag: "🇮🇱", minLength: 9, maxLength: 9 },
  {
    code: "+970",
    country: "Palestine",
    flag: "🇵🇸",
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
  {
    code: "+971",
    country: "United Arab Emirates",
    flag: "🇦🇪",
    minLength: 9,
    maxLength: 9,
  },
  { code: "+965", country: "Kuwait", flag: "🇰🇼", minLength: 8, maxLength: 8 },
  { code: "+973", country: "Bahrain", flag: "🇧🇭", minLength: 8, maxLength: 8 },
  { code: "+974", country: "Qatar", flag: "🇶🇦", minLength: 8, maxLength: 8 },
  { code: "+968", country: "Oman", flag: "🇴🇲", minLength: 8, maxLength: 8 },
  { code: "+967", country: "Yemen", flag: "🇾🇪", minLength: 9, maxLength: 9 },
  { code: "+90", country: "Turkey", flag: "🇹🇷", minLength: 10, maxLength: 10 },
  {
    code: "+7",
    country: "Kazakhstan",
    flag: "🇰🇿",
    minLength: 10,
    maxLength: 10,
  },
  {
    code: "+996",
    country: "Kyrgyzstan",
    flag: "🇰🇬",
    minLength: 9,
    maxLength: 9,
  },
  {
    code: "+992",
    country: "Tajikistan",
    flag: "🇹🇯",
    minLength: 9,
    maxLength: 9,
  },
  {
    code: "+993",
    country: "Turkmenistan",
    flag: "🇹🇲",
    minLength: 8,
    maxLength: 8,
  },
  {
    code: "+998",
    country: "Uzbekistan",
    flag: "🇺🇿",
    minLength: 9,
    maxLength: 9,
  },
  {
    code: "+994",
    country: "Azerbaijan",
    flag: "🇦🇿",
    minLength: 9,
    maxLength: 9,
  },
  { code: "+995", country: "Georgia", flag: "🇬🇪", minLength: 9, maxLength: 9 },
  { code: "+374", country: "Armenia", flag: "🇦🇲", minLength: 8, maxLength: 8 },
  {
    code: "+850",
    country: "North Korea",
    flag: "🇰🇵",
    minLength: 9,
    maxLength: 10,
  },
  { code: "+853", country: "Macao", flag: "🇲🇴", minLength: 8, maxLength: 8 },
  {
    code: "+852",
    country: "Hong Kong",
    flag: "🇭🇰",
    minLength: 8,
    maxLength: 8,
  },
  { code: "+886", country: "Taiwan", flag: "🇹🇼", minLength: 9, maxLength: 10 },
  { code: "+976", country: "Mongolia", flag: "🇲🇳", minLength: 8, maxLength: 8 },
  {
    code: "+670",
    country: "Timor-Leste",
    flag: "🇹🇱",
    minLength: 7,
    maxLength: 8,
  },
  { code: "+673", country: "Brunei", flag: "🇧🇳", minLength: 7, maxLength: 7 },
  // { code: "+679", country: "Fiji", flag: "🇫🇯", minLength: 7, maxLength: 7 },
  {
    code: "+689",
    country: "French Polynesia",
    flag: "🇵🇫",
    minLength: 8,
    maxLength: 8,
  },
  {
    code: "+675",
    country: "Papua New Guinea",
    flag: "🇵🇬",
    minLength: 8,
    maxLength: 8,
  },
  { code: "+685", country: "Samoa", flag: "🇼🇸", minLength: 7, maxLength: 7 },
  { code: "+686", country: "Kiribati", flag: "🇰🇮", minLength: 5, maxLength: 8 },
  {
    code: "+687",
    country: "New Caledonia",
    flag: "🇳🇨",
    minLength: 6,
    maxLength: 6,
  },
  { code: "+688", country: "Tuvalu", flag: "🇹🇻", minLength: 5, maxLength: 6 },
  { code: "+690", country: "Tokelau", flag: "🇹🇰", minLength: 4, maxLength: 4 },
  {
    code: "+691",
    country: "Micronesia",
    flag: "🇫🇲",
    minLength: 7,
    maxLength: 7,
  },
  {
    code: "+692",
    country: "Marshall Islands",
    flag: "🇲🇭",
    minLength: 7,
    maxLength: 7,
  },
  { code: "+676", country: "Tonga", flag: "🇹🇴", minLength: 5, maxLength: 7 },
  {
    code: "+677",
    country: "Solomon Islands",
    flag: "🇸🇧",
    minLength: 7,
    maxLength: 7,
  },
  { code: "+678", country: "Vanuatu", flag: "🇻🇺", minLength: 7, maxLength: 7 },
  { code: "+680", country: "Palau", flag: "🇵🇼", minLength: 7, maxLength: 7 },
  {
    code: "+682",
    country: "Cook Islands",
    flag: "🇨🇰",
    minLength: 5,
    maxLength: 5,
  },
  { code: "+683", country: "Niue", flag: "🇳🇺", minLength: 4, maxLength: 4 },
  {
    code: "+684",
    country: "American Samoa",
    flag: "🇦🇸",
    minLength: 7,
    maxLength: 7,
  },

  // ── Africa ────────────────────────────────────────────────────────────────
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
  { code: "+233", country: "Ghana", flag: "🇬🇭", minLength: 9, maxLength: 9 },
  { code: "+20", country: "Egypt", flag: "🇪🇬", minLength: 10, maxLength: 10 },
  { code: "+212", country: "Morocco", flag: "🇲🇦", minLength: 9, maxLength: 9 },
  { code: "+213", country: "Algeria", flag: "🇩🇿", minLength: 9, maxLength: 9 },
  { code: "+216", country: "Tunisia", flag: "🇹🇳", minLength: 8, maxLength: 8 },
  { code: "+218", country: "Libya", flag: "🇱🇾", minLength: 9, maxLength: 10 },
  { code: "+249", country: "Sudan", flag: "🇸🇩", minLength: 9, maxLength: 9 },
  { code: "+251", country: "Ethiopia", flag: "🇪🇹", minLength: 9, maxLength: 9 },
  { code: "+252", country: "Somalia", flag: "🇸🇴", minLength: 8, maxLength: 9 },
  { code: "+253", country: "Djibouti", flag: "🇩🇯", minLength: 8, maxLength: 8 },
  { code: "+255", country: "Tanzania", flag: "🇹🇿", minLength: 9, maxLength: 9 },
  { code: "+256", country: "Uganda", flag: "🇺🇬", minLength: 9, maxLength: 9 },
  { code: "+257", country: "Burundi", flag: "🇧🇮", minLength: 8, maxLength: 8 },
  {
    code: "+258",
    country: "Mozambique",
    flag: "🇲🇿",
    minLength: 9,
    maxLength: 9,
  },
  { code: "+260", country: "Zambia", flag: "🇿🇲", minLength: 9, maxLength: 9 },
  {
    code: "+261",
    country: "Madagascar",
    flag: "🇲🇬",
    minLength: 9,
    maxLength: 9,
  },
  { code: "+262", country: "Réunion", flag: "🇷🇪", minLength: 9, maxLength: 9 },
  { code: "+263", country: "Zimbabwe", flag: "🇿🇼", minLength: 9, maxLength: 9 },
  { code: "+264", country: "Namibia", flag: "🇳🇦", minLength: 9, maxLength: 9 },
  { code: "+265", country: "Malawi", flag: "🇲🇼", minLength: 9, maxLength: 9 },
  { code: "+266", country: "Lesotho", flag: "🇱🇸", minLength: 8, maxLength: 8 },
  { code: "+267", country: "Botswana", flag: "🇧🇼", minLength: 8, maxLength: 8 },
  { code: "+268", country: "Eswatini", flag: "🇸🇿", minLength: 8, maxLength: 8 },
  { code: "+269", country: "Comoros", flag: "🇰🇲", minLength: 7, maxLength: 7 },
  { code: "+291", country: "Eritrea", flag: "🇪🇷", minLength: 7, maxLength: 7 },
  { code: "+241", country: "Gabon", flag: "🇬🇦", minLength: 7, maxLength: 8 },
  {
    code: "+242",
    country: "Republic of Congo",
    flag: "🇨🇬",
    minLength: 9,
    maxLength: 9,
  },
  { code: "+243", country: "DR Congo", flag: "🇨🇩", minLength: 9, maxLength: 9 },
  {
    code: "+236",
    country: "Central African Republic",
    flag: "🇨🇫",
    minLength: 8,
    maxLength: 8,
  },
  { code: "+237", country: "Cameroon", flag: "🇨🇲", minLength: 9, maxLength: 9 },
  {
    code: "+238",
    country: "Cape Verde",
    flag: "🇨🇻",
    minLength: 7,
    maxLength: 7,
  },
  {
    code: "+239",
    country: "São Tomé and Príncipe",
    flag: "🇸🇹",
    minLength: 7,
    maxLength: 7,
  },
  {
    code: "+240",
    country: "Equatorial Guinea",
    flag: "🇬🇶",
    minLength: 9,
    maxLength: 9,
  },
  { code: "+244", country: "Angola", flag: "🇦🇴", minLength: 9, maxLength: 9 },
  {
    code: "+245",
    country: "Guinea-Bissau",
    flag: "🇬🇼",
    minLength: 9,
    maxLength: 9,
  },
  { code: "+220", country: "Gambia", flag: "🇬🇲", minLength: 7, maxLength: 7 },
  { code: "+221", country: "Senegal", flag: "🇸🇳", minLength: 9, maxLength: 9 },
  {
    code: "+222",
    country: "Mauritania",
    flag: "🇲🇷",
    minLength: 8,
    maxLength: 8,
  },
  { code: "+223", country: "Mali", flag: "🇲🇱", minLength: 8, maxLength: 8 },
  { code: "+224", country: "Guinea", flag: "🇬🇳", minLength: 9, maxLength: 9 },
  {
    code: "+225",
    country: "Ivory Coast",
    flag: "🇨🇮",
    minLength: 10,
    maxLength: 10,
  },
  {
    code: "+226",
    country: "Burkina Faso",
    flag: "🇧🇫",
    minLength: 8,
    maxLength: 8,
  },
  { code: "+227", country: "Niger", flag: "🇳🇪", minLength: 8, maxLength: 8 },
  { code: "+228", country: "Togo", flag: "🇹🇬", minLength: 8, maxLength: 8 },
  { code: "+229", country: "Benin", flag: "🇧🇯", minLength: 8, maxLength: 8 },
  {
    code: "+230",
    country: "Mauritius",
    flag: "🇲🇺",
    minLength: 8,
    maxLength: 8,
  },
  { code: "+231", country: "Liberia", flag: "🇱🇷", minLength: 8, maxLength: 8 },
  {
    code: "+232",
    country: "Sierra Leone",
    flag: "🇸🇱",
    minLength: 8,
    maxLength: 8,
  },
  {
    code: "+247",
    country: "Ascension Island",
    flag: "🇦🇨",
    minLength: 4,
    maxLength: 5,
  },
  {
    code: "+248",
    country: "Seychelles",
    flag: "🇸🇨",
    minLength: 7,
    maxLength: 7,
  },
  { code: "+250", country: "Rwanda", flag: "🇷🇼", minLength: 9, maxLength: 9 },
  {
    code: "+290",
    country: "Saint Helena",
    flag: "🇸🇭",
    minLength: 4,
    maxLength: 4,
  },
  {
    code: "+211",
    country: "South Sudan",
    flag: "🇸🇸",
    minLength: 9,
    maxLength: 9,
  },

  // ── Oceania ───────────────────────────────────────────────────────────────
  { code: "+61", country: "Australia", flag: "🇦🇺", minLength: 9, maxLength: 9 },
  {
    code: "+64",
    country: "New Zealand",
    flag: "🇳🇿",
    minLength: 8,
    maxLength: 9,
  },
  { code: "+679", country: "Fiji", flag: "🇫🇯", minLength: 7, maxLength: 7 },
  {
    code: "+675",
    country: "Papua New Guinea",
    flag: "🇵🇬",
    minLength: 8,
    maxLength: 8,
  },
  {
    code: "+677",
    country: "Solomon Islands",
    flag: "🇸🇧",
    minLength: 7,
    maxLength: 7,
  },
  { code: "+678", country: "Vanuatu", flag: "🇻🇺", minLength: 7, maxLength: 7 },
  { code: "+676", country: "Tonga", flag: "🇹🇴", minLength: 5, maxLength: 7 },
  { code: "+685", country: "Samoa", flag: "🇼🇸", minLength: 5, maxLength: 7 },
  { code: "+686", country: "Kiribati", flag: "🇰🇮", minLength: 5, maxLength: 8 },
  {
    code: "+692",
    country: "Marshall Islands",
    flag: "🇲🇭",
    minLength: 7,
    maxLength: 7,
  },
  {
    code: "+691",
    country: "Micronesia",
    flag: "🇫🇲",
    minLength: 7,
    maxLength: 7,
  },
  { code: "+680", country: "Palau", flag: "🇵🇼", minLength: 7, maxLength: 7 },
  { code: "+674", country: "Nauru", flag: "🇳🇷", minLength: 4, maxLength: 7 },
  { code: "+688", country: "Tuvalu", flag: "🇹🇻", minLength: 5, maxLength: 6 },
  {
    code: "+687",
    country: "New Caledonia",
    flag: "🇳🇨",
    minLength: 6,
    maxLength: 6,
  },
  {
    code: "+689",
    country: "French Polynesia",
    flag: "🇵🇫",
    minLength: 8,
    maxLength: 8,
  },
  { code: "+690", country: "Tokelau", flag: "🇹🇰", minLength: 4, maxLength: 4 },
  {
    code: "+682",
    country: "Cook Islands",
    flag: "🇨🇰",
    minLength: 5,
    maxLength: 5,
  },
  { code: "+683", country: "Niue", flag: "🇳🇺", minLength: 4, maxLength: 4 },
  {
    code: "+1-684",
    country: "American Samoa",
    flag: "🇦🇸",
    minLength: 10,
    maxLength: 10,
  },
  { code: "+1-671", country: "Guam", flag: "🇬🇺", minLength: 10, maxLength: 10 },
  {
    code: "+1-670",
    country: "Northern Mariana Islands",
    flag: "🇲🇵",
    minLength: 10,
    maxLength: 10,
  },
  {
    code: "+672",
    country: "Norfolk Island",
    flag: "🇳🇫",
    minLength: 6,
    maxLength: 6,
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

// ─── Particle canvas hook ─────────────────────────────────────────────────────

function useParticles(canvasRef, active) {
  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let rafId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 25 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      alpha: Math.random() * 0.25 + 0.08,
      vx: Math.random() * 0.4 - 0.2,
      vy: Math.random() * 0.4 - 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.fill();
      });
      rafId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [active, canvasRef]);
}

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

  const filtered = search.trim()
    ? COUNTRY_CODES.filter(
        ({ code, country }) =>
          country.toLowerCase().includes(search.toLowerCase()) ||
          code.includes(search.trim()),
      )
    : COUNTRY_CODES;

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

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full mt-1 left-0 w-60 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl overflow-hidden"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SuccessMessage() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-4 py-8 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", bounce: 0.4 }}
    >
      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
        <CheckCircle className="w-8 h-8 text-green-500" />
      </div>
      <div>
        <p className="text-lg font-bold text-gray-900 dark:text-white">
          Thank you!
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          We'll get back to you shortly.
        </p>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PopupContactForm() {
  const [open, setOpen] = useState(true);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const canvasRef = useRef(null);
  useParticles(canvasRef, open);

  // Open popup after 15 s (skip if already closed / submitted this session)
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

      // Replace these with your actual API calls:
      // const web3Result   = await submitWeb3FormData(payload);
      // const backendResult = await submitFormData(payload);

      // Simulated success for demonstration:
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

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Dialog */}
          <motion.div
            key="dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="popup-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-3xl max-h-[95vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Particle BG layer */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-indigo-900">
                <canvas ref={canvasRef} className="w-full h-full" />
              </div>

              {/* Close button */}
              <motion.button
                onClick={handleClose}
                aria-label="Close"
                className="absolute top-3 right-3 z-20 w-7 h-7 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-md transition-all duration-200 hover:scale-110"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={14} />
              </motion.button>

              {/* Main content */}
              <div className="relative z-10 flex flex-col lg:flex-row w-full h-full bg-white/95 dark:bg-gray-900/90 backdrop-blur-md overflow-auto">
                {/* ── Left panel (hidden on mobile) ── */}
                <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center p-6">
                    <Image
                      alt="SAP"
                      src="/images/services/Webp/SAP-Services.webp"
                      width={336}
                      height={504}
                      priority
                      sizes="(max-width: 768px) 100vw, 336px"
                      quality={75}
                    />
                  </div>
                </div>

                {/* ── Right panel (form) ── */}
                <div className="flex flex-col w-full lg:w-7/12 xl:w-1/2">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 shrink-0">
                    <div className="flex items-center justify-center gap-2">
                      {/* Logo placeholder — swap in your <NeonLogoBorder /> */}
                      <div className="scale-75 sm:scale-90">
                        <div className="bg-gradient-to-r from-black to-gray-900 rounded-full px-4 py-1.5 border border-pink-500/40 shadow-[0_0_20px_rgba(236,72,153,0.6)] flex items-center">
                          <Image
                            src="/Webp/AtorixIT.webp"
                            alt="Atorix IT Logo"
                            width={65}
                            height={27}
                            style={{ height: "auto" }}
                          />
                        </div>
                      </div>
                      <h2
                        id="popup-title"
                        className="text-lg font-bold text-white"
                      >
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
                            {selectedCountry.minLength ===
                            selectedCountry.maxLength
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
                            className={
                              inputCls(!!errors.message) + " resize-none"
                            }
                          />
                        </FieldWrapper>

                        {/* API error */}
                        {apiError && (
                          <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg px-3 py-2 text-xs">
                            <AlertCircle
                              size={13}
                              className="shrink-0 mt-0.5"
                            />
                            <span>{apiError}</span>
                          </div>
                        )}

                        {/* Submit */}
                        <motion.button
                          type="submit"
                          disabled={submitting}
                          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-blue-500/25"
                          whileHover={{ scale: submitting ? 1 : 1.015 }}
                          whileTap={{ scale: submitting ? 1 : 0.985 }}
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
                        </motion.button>

                        <p className="text-[11px] text-center text-gray-400 dark:text-gray-500">
                          By submitting, you agree to our privacy policy.
                        </p>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
