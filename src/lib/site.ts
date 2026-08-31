export const EVENT = {
  name: "Promofy at SBC Summit 2026",
  eventName: "SBC Summit 2026",
  dateRange: "29 September – 1 October 2026",
  shortDate: "29 SEPT – 1 OCT",
  city: "Lisbon, Portugal",
  venue: "Feira Internacional de Lisboa",
  stand: "Startup Hub · S18",
  canonical: "/sbc-summit-2026/",
  siteUrl: "https://promofy.ai",
} as const;

export const NAV_LINKS = [
  { label: "Meet us", href: "#meet-us" },
  { label: "Why Promofy", href: "#why-promofy" },
] as const;

export type TeamMember = {
  id: string;
  index: string;
  name: string;
  initials: string;
  role: string;
  focus: string;
  linkedinHref: string;
  bookingHref: string;
  bookingLabel: string;
};

export const EVENT_TEAM: TeamMember[] = [
  {
    id: "irakli",
    index: "01",
    name: "Irakli Davarashvili",
    initials: "ID",
    role: "CEO & Co-founder",
    focus: "Company direction, strategic partnerships and long-term commercial fit.",
    linkedinHref: "https://www.linkedin.com/in/irakli-davarashvili/",
    bookingHref:
      process.env.NEXT_PUBLIC_IRAKLI_BOOKING_URL ||
      "https://meetings-eu1.hubspot.com/irakli-davarashvili/sbc-lisbon-irakli?uuid=c4e15f96-d1de-419b-9563-818a86911415",
    bookingLabel: "Book directly",
  },
  {
    id: "vakhtang",
    index: "02",
    name: "Vakhtang Mdivani",
    initials: "VM",
    role: "CPO & Co-founder",
    focus: "Product strategy, AI, gamification mechanics and integration roadmap.",
    linkedinHref: "https://www.linkedin.com/in/vmdivani/",
    bookingHref:
      process.env.NEXT_PUBLIC_VAKHTANG_BOOKING_URL ||
      "https://meetings-eu1.hubspot.com/vakho/sbc-lisbon-vakho?uuid=3c541abd-7014-4dc5-860a-02e1a5ca9d25",
    bookingLabel: "Book directly",
  },
  {
    id: "negin",
    index: "03",
    name: "Negin Namazi",
    initials: "NN",
    role: "Head of Sales",
    focus: "Use-case discovery, commercial scope and the fastest route to a relevant demo.",
    linkedinHref: "https://www.linkedin.com/in/neginnamazi/",
    bookingHref:
      process.env.NEXT_PUBLIC_NEGIN_BOOKING_URL ||
      "https://meetings-eu1.hubspot.com/negin-namazi/sbc-lisbon-2026-negin?uuid=632d0a41-9d0b-4e8d-8125-90589ab85263",
    bookingLabel: "Book directly",
  },
];

export const PARTNER_LOGOS: { src: string; alt: string; tall?: boolean; square?: boolean }[] = [
  { src: "/assets/promofy/xtrmepush.png", alt: "XTRME Push" },
  { src: "/assets/promofy/vegangster.png", alt: "Veganster" },
  { src: "/assets/promofy/cybetic.png", alt: "Cybetic" },
  { src: "/assets/promofy/lynon.png", alt: "Lynon" },
  { src: "/assets/promofy/fasttrack.png", alt: "Fast Track" },
  { src: "/assets/promofy/epicsweep.png", alt: "EpicSweep" },
  { src: "/assets/promofy/smartbet.png", alt: "SmartBet" },
  { src: "/assets/promofy/voyganado.png", alt: "Voyganado" },
  { src: "/assets/promofy/trueightech.png", alt: "TrueigTech" },
  { src: "/assets/promofy/soccer-2.png", alt: "Soccer" },
  { src: "/assets/promofy/bet25.png", alt: "bet25" },
  { src: "/assets/promofy/vyking.png", alt: "Vyking", tall: true },
  { src: "/assets/promofy/shuffleup-1.png", alt: "ShuffleUp", square: true },
  { src: "/assets/promofy/Customer-io.png", alt: "Customer.io", tall: true },
  { src: "/assets/promofy/simplify-1.png", alt: "Simplify", square: true },
];

export const TRUST_PROOF = [
  { value: "GLOBAL", label: "International deployments", note: "Operators and partners across regulated markets" },
  { value: "20", suffix: "+", label: "Customers & partners", note: "Trusted engagement technology partner" },
  { value: "500", suffix: "+", label: "Engagement experiences", note: "Gamification, F2P, loyalty and jackpots" },
  { value: "CRM", suffix: "+", label: "Platform", note: "Connected to your existing ecosystem" },
  { value: "AWARD", label: "Winning", note: "Recognised by the industry" },
];

export type Product = {
  id: string;
  index: string;
  name: string;
  label: string;
  description: string;
  image: string;
  imageAlt: string;
  tags: string[];
  href: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "spark",
    index: "01",
    name: "Spark",
    label: "Turn acquisition on.",
    description:
      "Turn passive traffic into interactive acquisition experiences before asking users to convert. Spark makes registration and activation feel like play — from the very first tap.",
    image: "/assets/promofy/Image-container-2.avif",
    imageAlt: "Promofy Spark interactive quiz acquisition experience",
    tags: ["F2P", "Acquisition", "Onboarding"],
    href: "https://promofy.ai/spark/",
  },
  {
    id: "engagement-hub",
    index: "02",
    name: "Engagement Hub",
    label: "Turn participation on.",
    description:
      "Predictions, competitions, challenges and live engagement experiences built for sports audiences — one hub for every moment of the game.",
    image: "/assets/promofy/imasge.avif",
    imageAlt: "Promofy Engagement Hub sports prediction experience",
    tags: ["Sports engagement", "Predictions", "Competitions"],
    href: "https://promofy.ai/engagement-hub/",
  },
  {
    id: "gamification",
    index: "03",
    name: "Gamification & Loyalty",
    label: "Turn loyalty on.",
    description:
      "Missions, challenges, progression, rewards, leaderboards and behaviour-driven journeys that keep players coming back — and spending more time when they do.",
    image: "/assets/promofy/image-frame-300x300-1.avif",
    imageAlt: "Promofy Gamification Suite missions and rewards",
    tags: ["Missions", "Rewards", "Leaderboards"],
    href: "https://promofy.ai/gamification-suite/",
  },
  {
    id: "jackpots",
    index: "04",
    name: "Jackpots",
    label: "Turn excitement on.",
    description:
      "Create recurring moments of anticipation and participation through flexible jackpot experiences that reward every spin, every day, every week.",
    image: "/assets/promofy/Image-container-3.avif",
    imageAlt: "Promofy Jackpot wheel experience",
    tags: ["Daily jackpots", "Wheels", "Draws"],
    href: "https://promofy.ai/jackpot/",
  },
  {
    id: "ai",
    index: "05",
    name: "Promofy AI",
    label: "Turn intelligence on.",
    description:
      "Use AI to accelerate campaign creation, analyse behaviour and support increasingly intelligent engagement decisions — across every product in the ecosystem.",
    image: "/assets/promofy/Screen-mockup-light-mode-REPLACE-2.avif",
    imageAlt: "Promofy AI-powered campaign creation on mobile",
    tags: ["AI campaign creation", "Behaviour analytics", "Smart segmentation"],
    href: "https://promofy.ai/ai-suite/",
  },
];

export const INTEGRATION_STEPS = [
  {
    icon: "/assets/promofy/connect.png",
    alt: "Connect step icon",
    step: "Step 1",
    title: "Connect",
    copy: "Plug Promofy into your platform through APIs and frontend components — no changes to your core stack.",
  },
  {
    icon: "/assets/promofy/Sync-e1774614691215.avif",
    alt: "Sync step icon",
    step: "Step 2",
    title: "Sync",
    copy: "Send real-time player activity between Promofy and the systems you already run.",
  },
  {
    icon: "/assets/promofy/Launch.png",
    alt: "Launch step icon",
    step: "Step 3",
    title: "Launch",
    copy: "Create and activate engagement experiences — fully branded, from day one.",
  },
  {
    icon: "/assets/promofy/Reward.png",
    alt: "Reward and optimise step icon",
    step: "Step 4",
    title: "Reward & Optimise",
    copy: "Connect rewards to your bonus engine and measure performance as it happens.",
  },
];

export const CAPABILITIES = [
  "API-first",
  "CRM connected",
  "Platform agnostic",
  "Real-time behavioural data",
  "Multi-brand",
  "Multi-market",
  "Multilingual",
  "Multi-currency",
];

export const REVENUE_STAGES = [
  {
    label: "Acquisition",
    title: "Start the loop",
    items: ["F2P", "Interactive acquisition", "Onboarding", "Registration rewards"],
    metrics: [
      { value: 23, prefix: "+", suffix: "%", note: "Deposit conversion" },
      { value: 17, prefix: "+", suffix: "%", note: "Registration rate" },
    ],
  },
  {
    label: "Retention",
    title: "Keep the loop moving",
    items: ["Missions", "Challenges", "Progressive rewards", "Behavioural triggers", "Re-engagement"],
    metrics: [
      { value: 37, prefix: "+", suffix: "%", note: "Retention rate" },
      { value: 29, prefix: "+", suffix: "%", note: "Deposit frequency" },
    ],
  },
  {
    label: "Loyalty",
    title: "Compound the value",
    items: ["VIP progression", "Loyalty journeys", "Rewards", "Recognition", "LTV"],
    metrics: [
      { value: 11, prefix: "+", suffix: "%", note: "LTV" },
      { value: 93, prefix: "+", suffix: "%", note: "Engagement rate" },
    ],
  },
];

export const GLOBAL_FEATURES = [
  {
    icon: "layers",
    title: "Multi-brand",
    copy: "Run every brand from one engagement layer, with per-brand control and consistency.",
  },
  {
    icon: "globe",
    title: "Multi-market",
    copy: "Designed to scale across regions and markets without added complexity.",
  },
  {
    icon: "languages",
    title: "Multilingual",
    copy: "30+ languages supported, with AI-powered translation built into the platform.",
  },
  {
    icon: "coins",
    title: "Multi-currency",
    copy: "Fiat and cryptocurrencies, handled natively across markets.",
  },
  {
    icon: "zap",
    title: "Real-time",
    copy: "Real-time analytics and live engagement, the moment behaviour happens.",
  },
  {
    icon: "braces",
    title: "API-first",
    copy: "Platform-ready architecture that fits the infrastructure you already run.",
  },
];

export const AREAS_OF_INTEREST = [
  "Spark / Acquisition",
  "Gamification & Retention",
  "Sports Engagement",
  "Loyalty",
  "Jackpots",
  "AI",
  "CRM / Platform Integration",
  "Multi-Brand / Multi-Market",
  "Partnership",
  "Other",
];

export const PREFERRED_DAYS = [
  "Online demo — before SBC",
  "Tuesday 29 September",
  "Wednesday 30 September",
  "Thursday 1 October",
  "Flexible",
];

export const PREFERRED_TIMES = [
  "Morning (9:00 – 12:00)",
  "Midday (12:00 – 15:00)",
  "Afternoon (15:00 – 18:00)",
  "Flexible",
];

export const FAQ_ITEMS = [
  {
    q: "When is SBC Summit 2026?",
    a: "SBC Summit 2026 takes place from 29 September to 1 October 2026 at Feira Internacional de Lisboa (FIL) in Lisbon, Portugal.",
  },
  {
    q: "Where can I meet Promofy at SBC Summit?",
    a: "Promofy will be in the Startup Hub at stand S18. Stop by to experience the Promofy engagement ecosystem live — scan, join, predict and see your result on the big screen.",
  },
  {
    q: "What can I see during a Promofy demo?",
    a: "A full walkthrough of the engagement ecosystem: acquisition experiences with Spark, gamification and loyalty journeys, sports engagement, jackpots, Promofy AI and integrations with your existing CRM and operator platforms.",
  },
  {
    q: "Can I meet Promofy before SBC?",
    a: "Yes. Book an online demo before Lisbon and we'll review your engagement challenge and the relevant product and integration setup — so your SBC conversation starts a step ahead.",
  },
  {
    q: "Does Promofy integrate with existing CRM and operator platforms?",
    a: "Yes. Promofy operates as a flexible engagement layer over the infrastructure you already use — API-based integrations with leading CRMs such as Fast Track and Optimove, plus custom or proprietary systems. Rewards can be triggered automatically through your existing bonus engine.",
  },
  {
    q: "How quickly can Promofy be integrated?",
    a: "Promofy is designed for low-touch, enterprise-ready integration. Most partners complete integration and go live within 2–3 weeks, depending on scope — and campaigns can be created and launched in under 15 minutes with the no-code builder.",
  },
  {
    q: "Does Promofy support multiple brands and markets?",
    a: "Yes. Promofy is built for multi-tenant, multi-brand management across regions and markets, with 30+ languages and multi-currency support out of the box.",
  },
];

export const MEETING_FORM_ENDPOINT = process.env.NEXT_PUBLIC_MEETING_FORM_ENDPOINT ?? "";

export function eventJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: EVENT.name,
    description:
      "Meet Promofy at SBC Summit 2026 in Lisbon. Experience AI-driven gamification, loyalty, acquisition and sports engagement live at the Startup Hub, stand S18.",
    startDate: "2026-09-29",
    endDate: "2026-10-01",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "Feira Internacional de Lisboa (FIL)",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Lisbon",
        addressCountry: "PT",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Promofy",
      url: EVENT.siteUrl,
      logo: `${EVENT.siteUrl}/assets/promofy/promofy-logo.svg`,
    },
    superEvent: {
      "@type": "Event",
      name: "SBC Summit 2026",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    image: `${EVENT.siteUrl}/assets/promofy/promofy-logo.svg`,
    url: `${EVENT.siteUrl}${EVENT.canonical}`,
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Promofy",
    url: EVENT.siteUrl,
    logo: `${EVENT.siteUrl}/assets/promofy/promofy-logo.svg`,
    sameAs: [
      "https://www.linkedin.com/company/promofyai/",
      "https://www.facebook.com/promofyinc",
      "https://www.instagram.com/promofy.ai",
      "https://www.youtube.com/@Promofy_ai",
    ],
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}
