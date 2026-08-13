/**
 * CampusConnect Tanzania
 * ---------------------------------------------------------
 * Express + Gemini + Vite Server
 *
 * Core concept preserved:
 * - University discovery
 * - CampusConnect AI Companion
 * - Student posts
 * - Hostels
 * - Marketplace
 * - Campus events
 * - AI moderation
 * - AI mock-data generation
 * - Gemini AI with local fallback mode
 *
 * Country: Tanzania 🇹🇿
 * Currency: Tanzanian Shillings (TZS / Tsh)
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

/* =========================================================
   BASIC SERVER CONFIGURATION
   ========================================================= */

const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "1mb" }));

app.disable("x-powered-by");

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader(
    "Referrer-Policy",
    "strict-origin-when-cross-origin"
  );

  next();
});

/* =========================================================
   GEMINI CONFIGURATION
   ========================================================= */

const geminiKey = process.env.GEMINI_API_KEY;

const GEMINI_MODEL =
  process.env.GEMINI_MODEL || "gemini-3.5-flash";

let ai: GoogleGenAI | null = null;

if (
  geminiKey &&
  geminiKey.trim() !== "" &&
  geminiKey !== "MY_GEMINI_API_KEY"
) {
  try {
    ai = new GoogleGenAI({
      apiKey: geminiKey,
      httpOptions: {
        headers: {
          "User-Agent": "CampusConnect-Tanzania",
        },
      },
    });

    console.log("✓ Gemini AI initialized");
  } catch (error) {
    console.error(
      "Failed to initialize Gemini:",
      error
    );
  }
} else {
  console.log(
    "⚠ GEMINI_API_KEY not configured."
  );

  console.log(
    "✓ CampusConnect will use fallback AI mode."
  );
}

/* =========================================================
   TANZANIA UNIVERSITIES
   ========================================================= */

const UNIVERSITIES = [
  {
    id: "udsm",
    name: "University of Dar es Salaam",
    shortName: "UDSM",
    acronym: "UDSM",
    city: "Dar es Salaam",
    region: "Dar es Salaam",
    location: {
      lat: -6.7924,
      lng: 39.2083,
    },
    website: "https://www.udsm.ac.tz",
    founded: 1970,
    studentCount: 40000,
    logo: "🎓",
    bannerImage:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1000&q=80",
    emailDomains: [
      "udsm.ac.tz",
      "student.udsm.ac.tz",
    ],
    campuses: [
      "Mlimani Campus",
      "CoICT",
      "DUCE",
      "MUCE",
    ],
  },

  {
    id: "udom",
    name: "University of Dodoma",
    shortName: "UDOM",
    acronym: "UDOM",
    city: "Dodoma",
    region: "Dodoma",
    location: {
      lat: -6.163,
      lng: 35.7516,
    },
    website: "https://www.udom.ac.tz",
    founded: 2007,
    studentCount: 30000,
    logo: "🏛️",
    bannerImage:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=80",
    emailDomains: [
      "udom.ac.tz",
      "student.udom.ac.tz",
    ],
    campuses: [
      "Main Campus",
      "College of Informatics and Virtual Education",
      "College of Health Sciences",
    ],
  },

  {
    id: "sua",
    name: "Sokoine University of Agriculture",
    shortName: "SUA",
    acronym: "SUA",
    city: "Morogoro",
    region: "Morogoro",
    location: {
      lat: -6.8511,
      lng: 37.6591,
    },
    website: "https://www.sua.ac.tz",
    founded: 1984,
    studentCount: 15000,
    logo: "🌾",
    bannerImage:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1000&q=80",
    emailDomains: [
      "sua.ac.tz",
      "student.sua.ac.tz",
    ],
    campuses: [
      "Main Campus",
      "Solomon Mahlangu Campus",
    ],
  },

  {
    id: "mzumbe",
    name: "Mzumbe University",
    shortName: "Mzumbe",
    acronym: "MU",
    city: "Morogoro",
    region: "Morogoro",
    location: {
      lat: -6.7807,
      lng: 37.634,
    },
    website: "https://www.mzumbe.ac.tz",
    founded: 2001,
    studentCount: 10000,
    logo: "📚",
    bannerImage:
      "https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?auto=format&fit=crop&w=1000&q=80",
    emailDomains: [
      "mzumbe.ac.tz",
      "student.mzumbe.ac.tz",
    ],
    campuses: [
      "Main Campus",
      "Dar es Salaam Campus",
    ],
  },

  {
    id: "muhas",
    name: "Muhimbili University of Health and Allied Sciences",
    shortName: "MUHAS",
    acronym: "MUHAS",
    city: "Dar es Salaam",
    region: "Dar es Salaam",
    location: {
      lat: -6.8075,
      lng: 39.2675,
    },
    website: "https://www.muhas.ac.tz",
    founded: 2007,
    studentCount: 6000,
    logo: "🩺",
    bannerImage:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80",
    emailDomains: [
      "muhas.ac.tz",
      "student.muhas.ac.tz",
    ],
    campuses: [
      "Muhimbili Campus",
      "Mloganzila Campus",
    ],
  },

  {
    id: "aru",
    name: "Ardhi University",
    shortName: "ARU",
    acronym: "ARU",
    city: "Dar es Salaam",
    region: "Dar es Salaam",
    location: {
      lat: -6.7689,
      lng: 39.207,
    },
    website: "https://www.aru.ac.tz",
    founded: 2007,
    studentCount: 10000,
    logo: "🏗️",
    bannerImage:
      "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80",
    emailDomains: [
      "aru.ac.tz",
      "student.aru.ac.tz",
    ],
    campuses: [
      "Main Campus",
    ],
  },

  {
    id: "must",
    name: "Mbeya University of Science and Technology",
    shortName: "MUST",
    acronym: "MUST",
    city: "Mbeya",
    region: "Mbeya",
    location: {
      lat: -8.9647,
      lng: 33.4442,
    },
    website: "https://www.must.ac.tz",
    founded: 2012,
    studentCount: 9000,
    logo: "⚙️",
    bannerImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
    emailDomains: [
      "must.ac.tz",
      "student.must.ac.tz",
    ],
    campuses: [
      "Main Campus",
    ],
  },

  {
    id: "mocu",
    name: "Moshi Cooperative University",
    shortName: "MoCU",
    acronym: "MoCU",
    city: "Moshi",
    region: "Kilimanjaro",
    location: {
      lat: -3.3347,
      lng: 37.3404,
    },
    website: "https://www.mocu.ac.tz",
    founded: 1963,
    studentCount: 7000,
    logo: "🤝",
    bannerImage:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80",
    emailDomains: [
      "mocu.ac.tz",
      "student.mocu.ac.tz",
    ],
    campuses: [
      "Main Campus",
    ],
  },

  {
    id: "nm-aist",
    name: "Nelson Mandela African Institution of Science and Technology",
    shortName: "NM-AIST",
    acronym: "NM-AIST",
    city: "Arusha",
    region: "Arusha",
    location: {
      lat: -3.398,
      lng: 36.806,
    },
    website: "https://www.nm-aist.ac.tz",
    founded: 2010,
    studentCount: 3000,
    logo: "🔬",
    bannerImage:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80",
    emailDomains: [
      "nm-aist.ac.tz",
      "student.nm-aist.ac.tz",
    ],
    campuses: [
      "Main Campus",
    ],
  },

  {
    id: "out",
    name: "Open University of Tanzania",
    shortName: "OUT",
    acronym: "OUT",
    city: "Dar es Salaam",
    region: "Dar es Salaam",
    location: {
      lat: -6.7667,
      lng: 39.2067,
    },
    website: "https://www.out.ac.tz",
    founded: 1992,
    studentCount: 30000,
    logo: "🌐",
    bannerImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80",
    emailDomains: [
      "out.ac.tz",
      "student.out.ac.tz",
    ],
    campuses: [
      "Dar es Salaam Headquarters",
      "Regional Centres",
    ],
  },

  {
    id: "suza",
    name: "State University of Zanzibar",
    shortName: "SUZA",
    acronym: "SUZA",
    city: "Zanzibar",
    region: "Zanzibar",
    location: {
      lat: -6.1659,
      lng: 39.1989,
    },
    website: "https://www.suza.ac.tz",
    founded: 2002,
    studentCount: 7000,
    logo: "🌴",
    bannerImage:
      "https://images.unsplash.com/photo-1505881502353-a1986add3762?auto=format&fit=crop&w=1000&q=80",
    emailDomains: [
      "suza.ac.tz",
      "student.suza.ac.tz",
    ],
    campuses: [
      "Tunguu Campus",
      "Maruhubi Campus",
      "Vuga Campus",
    ],
  },

  {
    id: "mwecau",
    name: "Mwenge Catholic University",
    shortName: "MWECAU",
    acronym: "MWECAU",
    city: "Moshi",
    region: "Kilimanjaro",
    location: {
      lat: -3.334,
      lng: 37.335,
    },
    website: "https://www.mwecau.ac.tz",
    founded: 2005,
    studentCount: 6000,
    logo: "🎓",
    bannerImage:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80",
    emailDomains: [
      "mwecau.ac.tz",
      "student.mwecau.ac.tz",
    ],
    campuses: [
      "Main Campus",
      "Hedaru Campus College",
    ],
  },

  {
    id: "saut",
    name: "St. Augustine University of Tanzania",
    shortName: "SAUT",
    acronym: "SAUT",
    city: "Mwanza",
    region: "Mwanza",
    location: {
      lat: -2.5164,
      lng: 32.903,
    },
    website: "https://www.saut.ac.tz",
    founded: 1998,
    studentCount: 10000,
    logo: "🎓",
    bannerImage:
      "https://images.unsplash.com/photo-1544535830-9df3f5687760?auto=format&fit=crop&w=1000&q=80",
    emailDomains: [
      "saut.ac.tz",
      "student.saut.ac.tz",
    ],
    campuses: [
      "Mwanza Main Campus",
      "Dar es Salaam Centre",
      "Arusha Centre",
    ],
  },

  {
    id: "sjuit",
    name: "St. Joseph University in Tanzania",
    shortName: "SJUIT",
    acronym: "SJUIT",
    city: "Dar es Salaam",
    region: "Dar es Salaam",
    location: {
      lat: -6.799,
      lng: 39.235,
    },
    website: "https://www.sjuit.ac.tz",
    founded: 2010,
    studentCount: 5000,
    logo: "🎓",
    bannerImage:
      "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=1000&q=80",
    emailDomains: [
      "sjuit.ac.tz",
      "student.sjuit.ac.tz",
    ],
    campuses: [
      "Main Campus",
    ],
  },

  {
    id: "sjut",
    name: "St. John's University of Tanzania",
    shortName: "SJUT",
    acronym: "SJUT",
    city: "Dodoma",
    region: "Dodoma",
    location: {
      lat: -6.1635,
      lng: 35.738,
    },
    website: "https://www.sjut.ac.tz",
    founded: 2007,
    studentCount: 6000,
    logo: "📖",
    bannerImage:
      "https://images.unsplash.com/photo-1525921429624-479b6c29454f?auto=format&fit=crop&w=1000&q=80",
    emailDomains: [
      "sjut.ac.tz",
      "student.sjut.ac.tz",
    ],
    campuses: [
      "Dodoma Campus",
    ],
  },

  {
    id: "juco",
    name: "Jordan University College",
    shortName: "JUCo",
    acronym: "JUCo",
    city: "Morogoro",
    region: "Morogoro",
    location: {
      lat: -6.821,
      lng: 37.658,
    },
    website: "https://www.juco.ac.tz",
    founded: 1992,
    studentCount: 5000,
    logo: "🎓",
    bannerImage:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80",
    emailDomains: [
      "juco.ac.tz",
      "student.juco.ac.tz",
    ],
    campuses: [
      "Main Campus",
    ],
  },

  {
    id: "zanzibar-university",
    name: "Zanzibar University",
    shortName: "ZU",
    acronym: "ZU",
    city: "Zanzibar",
    region: "Zanzibar",
    location: {
      lat: -6.183,
      lng: 39.248,
    },
    website: "https://www.zanvarsity.ac.tz",
    founded: 1998,
    studentCount: 5000,
    logo: "🌴",
    bannerImage:
      "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&w=1000&q=80",
    emailDomains: [
      "zanvarsity.ac.tz",
      "student.zanvarsity.ac.tz",
    ],
    campuses: [
      "Main Campus",
    ],
  },
];

/* =========================================================
   FALLBACK POSTS
   ========================================================= */

const FALLBACK_POSTS = [
  {
    udsm: [
      {
        content:
          "Comrades, kuna mtu ameona student ID yangu karibu na Mlimani Library? Niliipoteza leo asubuhi. Tafadhali kama umeiona DM.",
        isAnonymous: false,
        tags: ["UDSM", "lost-and-found"],
      },

      {
        content:
          "Anyone looking for a quiet place to study around Mlimani? Library is packed today. Let's share good study spots.",
        isAnonymous: false,
        tags: ["study", "UDSM"],
      },

      {
        content:
          "Kuna group ya Computer Science students wanafanya revision ya database wiki hii? Ningependa kujoin.",
        isAnonymous: false,
        tags: ["CSC", "study-group"],
      },
    ],

    udom: [
      {
        content:
          "UDOM comrades, anyone looking for a roommate around Dodoma campus area? Serious and clean student only.",
        isAnonymous: false,
        tags: ["UDOM", "roommate"],
      },

      {
        content:
          "Who knows a good affordable food spot near UDOM? Trying to survive this semester budget 😭.",
        isAnonymous: false,
        tags: ["food", "budget"],
      },
    ],

    sua: [
      {
        content:
          "SUA students, anyone selling used agricultural science textbooks? DM me with price and condition.",
        isAnonymous: false,
        tags: ["SUA", "books"],
      },

      {
        content:
          "Looking for a study group around SUA for first-year students. Let's organize one before CAT week.",
        isAnonymous: false,
        tags: ["study", "SUA"],
      },
    ],

    mwecau: [
      {
        content:
          "MWECAU comrades, anyone interested in creating a Computer Science revision group this semester?",
        isAnonymous: false,
        tags: ["MWECAU", "Computer Science"],
      },
    ],
  },
];

/* =========================================================
   FALLBACK HOSTELS
   ========================================================= */

const FALLBACK_HOSTELS = [
  {
    udsm: [
      {
        name: "Mlimani Student Residence",
        address: "Mlimani, Dar es Salaam",
        distance: 700,
        single: 180000,
        bedsitter: 300000,
        oneBedroom: 450000,
        description:
          "Student-oriented accommodation close to UDSM. Suitable for students looking for easy campus access and nearby food and transport.",
      },

      {
        name: "Sinza Student Rooms",
        address: "Sinza, Dar es Salaam",
        distance: 3500,
        single: 150000,
        bedsitter: 280000,
        oneBedroom: 400000,
        description:
          "Affordable rooms around Sinza with access to daladala routes, shops and student services.",
      },
    ],

    udom: [
      {
        name: "Dodoma Student Residence",
        address: "Near UDOM, Dodoma",
        distance: 1000,
        single: 120000,
        bedsitter: 220000,
        oneBedroom: 350000,
        description:
          "Affordable student accommodation close to UDOM with access to local shops and transport.",
      },
    ],

    sua: [
      {
        name: "Morogoro Student Lodge",
        address: "Near SUA, Morogoro",
        distance: 800,
        single: 120000,
        bedsitter: 230000,
        oneBedroom: 350000,
        description:
          "Student-friendly accommodation close to SUA with affordable monthly options.",
      },
    ],

    mwecau: [
      {
        name: "Moshi Student Rooms",
        address: "Moshi, Kilimanjaro",
        distance: 1000,
        single: 100000,
        bedsitter: 200000,
        oneBedroom: 320000,
        description:
          "Affordable student rooms around Moshi suitable for MWECAU students.",
      },
    ],
  },
];

/* =========================================================
   FALLBACK MARKETPLACE
   ========================================================= */

const FALLBACK_PRODUCTS = [
  {
    udsm: [
      {
        title:
          "Used Computer Science Textbooks",
        description:
          "Good-condition textbooks suitable for first-year and second-year Computer Science students.",
        category:
          "Textbooks & Notes",
        price: 25000,
        condition: "USED",
        campus: "UDSM",
      },

      {
        title:
          "HP EliteBook Laptop",
        description:
          "Used laptop suitable for programming, assignments and general university work.",
        category: "Electronics",
        price: 650000,
        condition: "USED",
        campus: "Mlimani",
      },

      {
        title:
          "Study Desk",
        description:
          "Compact wooden study desk suitable for hostel rooms.",
        category: "Furniture",
        price: 120000,
        condition: "USED",
        campus: "Mlimani",
      },
    ],

    udom: [
      {
        title:
          "Scientific Calculator",
        description:
          "Good-condition scientific calculator for engineering and science students.",
        category:
          "Electronics",
        price: 30000,
        condition: "LIKE_NEW",
        campus: "UDOM",
      },
    ],

    sua: [
      {
        title:
          "Agriculture Textbook Collection",
        description:
          "Collection of useful agriculture textbooks for undergraduate students.",
        category:
          "Textbooks & Notes",
        price: 90000,
        condition: "USED",
        campus: "SUA",
      },
    ],
  },
];

/* =========================================================
   FALLBACK EVENTS
   ========================================================= */

const FALLBACK_EVENTS = [
  {
    udsm: [
      {
        title:
          "UDSM Student Innovation Day",
        description:
          "A student innovation event showcasing technology, entrepreneurship and academic projects.",
        category: "ACADEMIC",
        startDateTime:
          "2026-09-10T09:00:00",
        endDateTime:
          "2026-09-10T16:00:00",
        locationName:
          "UDSM Main Campus",
        isVirtual: false,
      },

      {
        title:
          "Campus Career Networking Day",
        description:
          "Students meet employers, entrepreneurs and professionals for career advice and networking.",
        category: "CAREER",
        startDateTime:
          "2026-09-20T10:00:00",
        endDateTime:
          "2026-09-20T16:00:00",
        locationName:
          "UDSM Campus",
        isVirtual: false,
      },
    ],

    udom: [
      {
        title:
          "UDOM Technology Innovation Day",
        description:
          "Technology students showcase software, research and innovation projects.",
        category: "ACADEMIC",
        startDateTime:
          "2026-09-15T09:00:00",
        endDateTime:
          "2026-09-15T17:00:00",
        locationName:
          "UDOM Campus",
        isVirtual: false,
      },
    ],

    sua: [
      {
        title:
          "SUA Agriculture Innovation Fair",
        description:
          "Students showcase agricultural technologies and entrepreneurship ideas.",
        category: "ACADEMIC",
        startDateTime:
          "2026-09-18T09:00:00",
        endDateTime:
          "2026-09-18T16:00:00",
        locationName:
          "SUA Campus",
        isVirtual: false,
      },
    ],
  },
];

/* =========================================================
   HELPERS
   ========================================================= */

function sendError(
  res: express.Response,
  status: number,
  message: string,
  details?: unknown
) {
  const payload: Record<
    string,
    unknown
  > = {
    error: message,
  };

  if (
    process.env.NODE_ENV !== "production" &&
    details
  ) {
    payload.details =
      details instanceof Error
        ? details.message
        : details;
  }

  return res
    .status(status)
    .json(payload);
}

function cleanString(
  value: unknown,
  maxLength = 5000
): string {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .trim()
    .slice(0, maxLength);
}

function isNonEmptyString(
  value: unknown
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}

function parseJsonArray(
  text: string
): any[] {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");

  const parsed =
    JSON.parse(cleaned);

  if (!Array.isArray(parsed)) {
    throw new Error(
      "AI response was not an array"
    );
  }

  return parsed;
}

function normaliseHistory(
  history: unknown
) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .slice(-20)
    .filter(
      (turn: any) =>
        turn &&
        (turn.role === "user" ||
          turn.role === "assistant") &&
        isNonEmptyString(
          turn.content
        )
    )
    .map((turn: any) => ({
      role:
        turn.role === "assistant"
          ? "model"
          : "user",

      parts: [
        {
          text: cleanString(
            turn.content,
            4000
          ),
        },
      ],
    }));
}

function findUniversityById(
  id: unknown
) {
  if (!isNonEmptyString(id)) {
    return null;
  }

  return (
    UNIVERSITIES.find(
      (university: any) =>
        university.id === id
    ) || null
  );
}

function getFallbackDataset(
  category: string,
  acronym: string
): any[] {
  const universityKey =
    cleanString(
      acronym,
      50
    ).toLowerCase();

  const sources: Record<
    string,
    any
  > = {
    posts: FALLBACK_POSTS[0],
    hostels: FALLBACK_HOSTELS[0],
    products: FALLBACK_PRODUCTS[0],
    events: FALLBACK_EVENTS[0],
  };

  const source =
    sources[category];

  if (!source) {
    return [];
  }

  return (
    source[universityKey] ||
    source.udsm ||
    source.udom ||
    []
  );
}

/* =========================================================
   HEALTH CHECK
   ========================================================= */

app.get(
  "/api/health",
  (req, res) => {
    res.json({
      status: "ok",
      application:
        "CampusConnect Tanzania",
      country: "Tanzania",
      currency: "TZS",
      gemini:
        ai !== null
          ? "enabled"
          : "fallback",
      model: GEMINI_MODEL,
      universities:
        UNIVERSITIES.length,
      timestamp:
        new Date().toISOString(),
    });
  }
);

/* =========================================================
   UNIVERSITIES
   ========================================================= */

app.get(
  "/api/universities",
  (req, res) => {
    res.json({
      status: "ok",
      country: "Tanzania",
      universities:
        UNIVERSITIES,
    });
  }
);

/* =========================================================
   CAMPUSCONNECT AI CHAT
   ========================================================= */

app.post(
  "/api/chat",
  async (req, res) => {
    try {
      const {
        message,
        history,
        university,
      } = req.body;

      const cleanMessage =
        cleanString(
          message,
          4000
        );

      if (!cleanMessage) {
        return sendError(
          res,
          400,
          "Message content is required"
        );
      }

      if (
        history !== undefined &&
        !Array.isArray(history)
      ) {
        return sendError(
          res,
          400,
          "History must be an array"
        );
      }

      let selectedUniversity: any =
        null;

      if (
        university &&
        typeof university ===
          "object"
      ) {
        selectedUniversity =
          university;
      } else {
        selectedUniversity =
          findUniversityById(
            university
          );
      }

      const uniContext =
        selectedUniversity
          ? `
The student belongs to:
${cleanString(
  selectedUniversity.name,
  200
)}
(${cleanString(
  selectedUniversity.acronym,
  50
)}).

University city:
${cleanString(
  selectedUniversity.city,
  100
)}

University region:
${cleanString(
  selectedUniversity.region,
  100
)}

Tailor your response to this university
when appropriate.
`
          : "";

      const systemInstruction = `
You are CampusConnect Tanzania AI Companion.

You are an advanced, friendly and practical
AI assistant designed specifically for
university students in Tanzania.

You help students with:

- Campus life
- University information
- Student communities
- Hostels
- Accommodation
- Marketplace
- Campus events
- Study planning
- Budgeting
- Student safety
- Clubs
- Career opportunities
- Technology
- Academic productivity

COUNTRY:
Tanzania 🇹🇿

CURRENCY:
Tanzanian Shillings (TZS / Tsh)

${uniContext}

TANZANIAN CONTEXT:

Understand Tanzanian university life.

Use appropriate Tanzanian terms such as:

- chuo
- mwanafunzi
- hostel
- bweni
- room
- single room
- bedsitter
- semester
- CAT
- assignment
- HESLB
- daladala
- bodaboda
- bajaji
- campus
- college
- course
- department
- registration

TRANSPORT:

When discussing transport, use Tanzanian
transport examples such as:

- daladala
- bodaboda
- bajaji
- BRT where appropriate

Do NOT talk about Kenyan matatus,
Kenyan universities or KES unless the user
specifically asks for comparison.

MONEY:

Always use TZS / Tsh for Tanzania.

Do not automatically use KES.

STYLE:

Be friendly.

Be practical.

Use clear Markdown.

Use short paragraphs.

Use bullet points when useful.

You may use Swahili, English,
or a natural mixture depending on
the student's language.

Never invent official university policies.

If you are unsure about an official rule,
tell the student to verify it with
the relevant university office.

SAFETY:

Never encourage dangerous activity,
fraud, harassment, scams, cheating,
or illegal activity.

For accommodation, recommend viewing
the property before paying and verifying
the landlord or accommodation provider.

${uniContext}
`;

      /* =====================================================
         GEMINI MODE
         ===================================================== */

      if (ai) {
        try {
          const formattedContents =
            normaliseHistory(
              history
            );

          formattedContents.push({
            role: "user",
            parts: [
              {
                text: cleanMessage,
              },
            ],
          });

          const response =
            await ai.models.generateContent(
              {
                model:
                  GEMINI_MODEL,

                contents:
                  formattedContents,

                config: {
                  systemInstruction,

                  temperature: 0.7,
                },
              }
            );

          const responseText =
            response.text?.trim();

          if (responseText) {
            return res.json({
              status: "ok",
              response:
                responseText,
            });
          }
        } catch (error) {
          console.error(
            "Gemini chat error:",
            error
          );

          console.log(
            "Using local Tanzania fallback assistant."
          );
        }
      }

      /* =====================================================
         LOCAL FALLBACK AI
         ===================================================== */

      const lower =
        cleanMessage.toLowerCase();

      let reply = `
Habari, comrade! 🇹🇿👋

Mimi ni CampusConnect Tanzania AI Companion.

Kwa sasa niko kwenye offline mode,
lakini bado naweza kukusaidia kuhusu:

- Vyuo Tanzania
- Hostels
- Marketplace
- Events
- Study planning
- Budgeting
- Campus life
- Student safety
- Clubs na communities
- Career opportunities

Niambie unahitaji msaada gani.
`;

      if (
        lower.includes("hostel") ||
        lower.includes("bweni") ||
        lower.includes("room") ||
        lower.includes("bedsitter") ||
        lower.includes("accommodation") ||
        lower.includes("nyumba")
      ) {
        reply = `
## 🏠 Hostel & Accommodation

Ndio comrade!

Unapotafuta hostel Tanzania, angalia:

1. **Umbali kutoka chuoni**
   - Karibu na campus inaweza kupunguza gharama za usafiri.

2. **Usalama**
   - Angalia mazingira mchana na jioni.
   - Ulizia security na locks.

3. **Maji**
   - Ulizia kama kuna maji ya uhakika.

4. **Umeme**
   - Ulizia kuhusu LUKU na namna bili inavyolipwa.

5. **Internet**
   - Kama unasoma Computer Science au course inayohitaji internet, hakikisha network iko vizuri.

6. **Usilipe kabla ya kuona room**
   - Tembelea hostel kwanza.
   - Thibitisha mwenye nyumba au agent.

7. **Transport**
   - Angalia upatikanaji wa daladala, bajaji au bodaboda.

Ukinipa **jina la chuo + budget yako**, naweza kukusaidia kupanga vigezo vya hostel unayotakiwa kutafuta.
`;
      }

      else if (
        lower.includes("budget") ||
        lower.includes("money") ||
        lower.includes("pesa") ||
        lower.includes("gharama") ||
        lower.includes("bajeti") ||
        lower.includes("tsh")
      ) {
        reply = `
## 💰 Student Budget Tanzania

Kusurvive chuo kwa budget ndogo inawezekana,
lakini unatakiwa kupanga matumizi.

### Mfano wa priorities:

1. 🍛 Chakula
2. 🏠 Hostel / accommodation
3. 🚌 Transport
4. 📚 Books & academic materials
5. 📱 Internet / bundles
6. 🧼 Personal expenses
7. 💰 Emergency fund

### Tips:

- Panga matumizi yako kwa wiki.
- Epuka matumizi madogo yasiyo na mpango.
- Nunua textbooks used kama zina hali nzuri.
- Tumia library inapowezekana.
- Share baadhi ya gharama na roommates.
- Weka emergency money pembeni.

Tumia **Tsh/TZS**, sio KES, unapopanga budget Tanzania.
`;
      }

      else if (
        lower.includes("study") ||
        lower.includes("kusoma") ||
        lower.includes("exam") ||
        lower.includes("mtihani") ||
        lower.includes("cat") ||
        lower.includes("assignment")
      ) {
        reply = `
## 📚 Study Support

Comrade, usisubiri wiki ya mtihani kuanza kusoma.

Jaribu mfumo huu:

### Monday - Friday
- Review lecture ya siku hiyo.
- Andika short notes.
- Tengeneza questions zako.

### Weekend
- Fanya revision.
- Solve past questions.
- Study na group kama inasaidia.

### Before CAT
- Review topics zote.
- Focus on areas ambazo hujaelewa.
- Uliza lecturer au classmates.

### Before Final Exam
- Past papers
- Lecture notes
- Revision questions
- Group discussion

CampusConnect inaweza kuwa sehemu yako
ya kupata study communities na academic support.
`;
      }

      else if (
        lower.includes("hello") ||
        lower.includes("hi") ||
        lower.includes("hey") ||
        lower.includes("habari") ||
        lower.includes("mambo") ||
        lower.includes("hujambo")
      ) {
        reply = `
Mambo comrade! 🇹🇿🔥

Karibu CampusConnect Tanzania.

Naweza kukusaidia na:

🎓 Vyuo Tanzania
🏠 Hostels
📚 Study
🛒 Student Marketplace
🎉 Campus Events
💰 Student Budget
🚌 Transport
💼 Career
👥 Student Communities
🔐 Campus Safety

Niambie unataka kuanza na nini.
`;
      }

      else if (
        lower.includes("safe") ||
        lower.includes("security") ||
        lower.includes("usalama") ||
        lower.includes("hatari")
      ) {
        reply = `
## 🔐 Student Safety

Usalama ni priority.

### Ukiwa campus:

- Epuka maeneo yasiyo salama usiku.
- Usitembee peke yako sehemu usiyoijua.
- Linda simu na laptop yako.
- Usishare passwords.
- Usikutane na online seller sehemu ya faragha.
- Kwa marketplace, tumia sehemu salama na yenye watu.
- Thibitisha hostel kabla ya kulipa.
- Hifadhi emergency contacts za chuo.

Kama kuna emergency halisi,
tafuta msaada wa security ya chuo
au mamlaka husika mara moja.
`;
      }

      else if (
        lower.includes("udsm")
      ) {
        reply = `
## 🎓 UDSM

University of Dar es Salaam ni moja
ya vyuo vikuu vikuu Tanzania.

CampusConnect inaweza kukusaidia
kuhusiana na:

- Student communities
- Hostels
- Marketplace
- Events
- Study groups
- Campus life

Ukiwa UDSM, niambie unataka
**hostel, study, events, marketplace
au student community**.
`;
      }

      else if (
        lower.includes("udom")
      ) {
        reply = `
## 🎓 UDOM

University of Dodoma ni mojawapo
ya vyuo vikuu vikubwa Tanzania.

CampusConnect inaweza kukusaidia
kupanga:

- Accommodation
- Study groups
- Marketplace
- Events
- Student communities
- Budget planning

Niambie unahitaji msaada gani kuhusu UDOM.
`;
      }

      else if (
        lower.includes("sua")
      ) {
        reply = `
## 🌾 SUA

Sokoine University of Agriculture
ipo Morogoro na ina mazingira yenye
nguvu kwenye agriculture, science,
technology na related fields.

CampusConnect inaweza kusaidia
SUA students kwenye:

- Study groups
- Marketplace
- Hostels
- Events
- Student communities
- Budgeting
`;
      }

      return res.json({
        status: "ok",
        response: reply,
        mode: "fallback",
      });
    } catch (error) {
      console.error(
        "Chat endpoint error:",
        error
      );

      return sendError(
        res,
        500,
        "Failed to process chat request."
      );
    }
  }
);

/* =========================================================
   AI MODERATION
   ========================================================= */

app.post(
  "/api/moderate",
  async (req, res) => {
    try {
      const {
        content,
      } = req.body;

      const cleanContent =
        cleanString(
          content,
          5000
        );

      if (!cleanContent) {
        return res.json({
          status: "APPROVED",
          reason:
            "Empty content bypass",
        });
      }

      const moderationInstruction = `
You are CampusConnect Tanzania's
content moderation AI.

Review student-generated content.

Block content containing:

1. Hate speech
2. Tribal or ethnic hatred
3. Serious harassment
4. Threats
5. Doxxing
6. Explicit sexual content
7. Pornographic content
8. Scams
9. Phishing
10. Fraud
11. Illegal activity
12. Academic cheating services
13. Severe cyberbullying
14. Dangerous instructions

Return ONLY valid JSON:

{
  "status": "APPROVED" | "BLOCKED",
  "reason": "short explanation"
}
`;

      if (ai) {
        try {
          const response =
            await ai.models.generateContent(
              {
                model:
                  GEMINI_MODEL,

                contents:
                  cleanContent,

                config: {
                  systemInstruction:
                    moderationInstruction,

                  responseMimeType:
                    "application/json",

                  temperature: 0.1,
                },
              }
            );

          const parsed =
            JSON.parse(
              response.text.trim()
            );

          if (
            parsed &&
            (
              parsed.status ===
                "APPROVED" ||
              parsed.status ===
                "BLOCKED"
            )
          ) {
            return res.json({
              status:
                parsed.status,

              reason:
                typeof parsed.reason ===
                "string"
                  ? parsed.reason
                  : "Moderation completed.",
            });
          }
        } catch (error) {
          console.error(
            "Gemini moderation error:",
            error
          );
        }
      }

      /* =====================================================
         LOCAL MODERATION FALLBACK
         ===================================================== */

      const blockedKeywords = [
        "scam",
        "phishing",
        "fake payment",
        "send password",
        "send otp",
        "academic cheating",
        "exam answers for sale",
        "tribal war",
        "ethnic group is superior",
        "fuck",
        "bitch",
      ];

      const lowerContent =
        cleanContent.toLowerCase();

      for (
        const keyword of blockedKeywords
      ) {
        if (
          lowerContent.includes(
            keyword
          )
        ) {
          return res.json({
            status: "BLOCKED",

            reason:
              "Content violates CampusConnect community guidelines.",
          });
        }
      }

      return res.json({
        status: "APPROVED",
        reason:
          "Content passed moderation filters.",
      });
    } catch (error) {
      console.error(
        "Moderation endpoint error:",
        error
      );

      return sendError(
        res,
        500,
        "Moderation failed."
      );
    }
  }
);

/* =========================================================
   AI MOCK DATA GENERATOR
   ========================================================= */

app.post(
  "/api/mock-generate",
  async (req, res) => {
    try {
      const {
        category,
        universityName,
        acronym,
      } = req.body;

      const allowedCategories = [
        "posts",
        "hostels",
        "products",
        "events",
      ];

      const cleanCategory =
        cleanString(
          category,
          50
        ).toLowerCase();

      const cleanAcronym =
        cleanString(
          acronym,
          50
        );

      const cleanUniversityName =
        cleanString(
          universityName,
          200
        );

      if (
        !allowedCategories.includes(
          cleanCategory
        )
      ) {
        return sendError(
          res,
          400,
          "Invalid category. Use posts, hostels, products or events."
        );
      }

      if (!cleanAcronym) {
        return sendError(
          res,
          400,
          "University acronym is required."
        );
      }

      /* =====================================================
         GEMINI GENERATION
         ===================================================== */

      if (ai) {
        const prompt = `
Generate exactly 3 realistic
CampusConnect Tanzania records.

Country:
Tanzania

Currency:
Tanzanian Shillings (TZS / Tsh)

University:
${cleanUniversityName}

Acronym:
${cleanAcronym}

Category:
${cleanCategory}

Important:

Use realistic Tanzanian university
student context.

Do NOT generate Kenyan content.

Do NOT use KES.

Use Tsh/TZS.

Use Tanzanian terms such as:
- chuo
- hostel
- bweni
- daladala
- bodaboda
- bajaji
- semester
- CAT
- assignment

CATEGORY RULES:

If category = posts:

Return:

[
  {
    "content": "realistic Tanzanian student post",
    "isAnonymous": false,
    "tags": ["student", "campus"]
  }
]

If category = hostels:

Return:

[
  {
    "name": "realistic hostel name",
    "address": "realistic local area",
    "distance": 500,
    "single": 150000,
    "bedsitter": 250000,
    "oneBedroom": 400000,
    "description": "realistic student accommodation description"
  }
]

Prices must be in Tanzanian Shillings.

If category = products:

Return:

[
  {
    "title": "product title",
    "description": "student marketplace description",
    "category": "Electronics",
    "price": 500000,
    "condition": "USED",
    "campus": "${cleanUniversityName}"
  }
]

If category = events:

Return:

[
  {
    "title": "realistic campus event",
    "description": "student-friendly event description",
    "category": "ACADEMIC",
    "startDateTime": "2026-09-10T09:00:00",
    "endDateTime": "2026-09-10T16:00:00",
    "locationName": "realistic campus location",
    "isVirtual": false
  }
]

Allowed event categories:

ACADEMIC
SOCIAL
SPORTS
CULTURAL
CAREER
HOSTEL

Return ONLY raw JSON.

No Markdown.

No explanation.
`;

        try {
          const response =
            await ai.models.generateContent(
              {
                model:
                  GEMINI_MODEL,

                contents:
                  prompt,

                config: {
                  responseMimeType:
                    "application/json",

                  temperature: 0.8,
                },
              }
            );

          const data =
            parseJsonArray(
              response.text
            );

          return res.json({
            status: "ok",
            data,
            source: "gemini",
          });
        } catch (error) {
          console.error(
            "Gemini mock generation failed:",
            error
          );

          console.log(
            "Using Tanzania fallback dataset."
          );
        }
      }

      /* =====================================================
         FALLBACK DATA
         ===================================================== */

      const data =
        getFallbackDataset(
          cleanCategory,
          cleanAcronym
        );

      return res.json({
        status: "ok",
        data,
        source: "fallback",
      });
    } catch (error) {
      console.error(
        "Mock generation endpoint error:",
        error
      );

      return sendError(
        res,
        500,
        "Failed to generate mock data."
      );
    }
  }
);

/* =========================================================
   API 404 HANDLER
   ========================================================= */

app.use(
  "/api",
  (req, res) => {
    return sendError(
      res,
      404,
      `API route not found: ${req.method} ${req.path}`
    );
  }
);

/* =========================================================
   GLOBAL ERROR HANDLER
   ========================================================= */

app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(
      "Unhandled server error:",
      error
    );

    if (res.headersSent) {
      return next(error);
    }

    return sendError(
      res,
      500,
      "Internal server error."
    );
  }
);

/* =========================================================
   VITE SERVER
   ========================================================= */

async function startServer() {
  if (
    process.env.NODE_ENV !==
    "production"
  ) {
    const {
      createServer:
        createViteServer,
    } = await import("vite");

    const vite =
      await createViteServer({
        server: {
          middlewareMode: true,
        },

        appType: "spa",
      });

    app.use(
      vite.middlewares
    );
  } else {
    const distPath =
      path.join(
        process.cwd(),
        "dist"
      );

    app.use(
      express.static(
        distPath
      )
    );

    app.get(
      "*",
      (req, res) => {
        res.sendFile(
          path.join(
            distPath,
            "index.html"
          )
        );
      }
    );
  }

  app.listen(
    PORT,
    "0.0.0.0",
    () => {
      console.log("");
      console.log(
        "=============================================="
      );
      console.log(
        "      CAMPUSCONNECT TANZANIA 🇹🇿"
      );
      console.log(
        "=============================================="
      );
      console.log(
        `Server: http://localhost:${PORT}`
      );
      console.log(
        `Environment: ${
          process.env.NODE_ENV ||
          "development"
        }`
      );
      console.log(
        `Gemini: ${
          ai
            ? "ENABLED"
            : "FALLBACK MODE"
        }`
      );
      console.log(
        `Model: ${GEMINI_MODEL}`
      );
      console.log(
        `Universities: ${UNIVERSITIES.length}`
      );
      console.log(
        "Currency: TZS / Tsh"
      );
      console.log(
        "Country: Tanzania 🇹🇿"
      );
      console.log(
        "=============================================="
      );
      console.log("");
    }
  );
}

/* =========================================================
   START APPLICATION
   ========================================================= */

startServer().catch(
  (error) => {
    console.error(
      "Failed to start CampusConnect:",
      error
    );

    process.exit(1);
  }
);
