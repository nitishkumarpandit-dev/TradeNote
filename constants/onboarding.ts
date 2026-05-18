// constants/onboarding.ts

export const TOTAL_SCREENS = 3;

export const FEATURES = [
  {
    id: "1",
    emoji: "📊",
    title: "Advanced Analytics",
  },
  {
    id: "2",
    emoji: "🤖",
    title: "AI Insights",
  },
  {
    id: "3",
    emoji: "⚡",
    title: "Fast Trade Entry",
  },
  {
    id: "4",
    emoji: "🧠",
    title: "Psychology Tracking",
  },
];

export const ONBOARDING_COPY = {
  screen1: {
    headline: "India's Most Advanced",
    headlineAccent: "Trading Journal",
    subtitle:
      "Track your trades, analyze performance, and improve your results with data.",
    cta: "Next",
  },
  screen2: {
    headline: "Everything You Need to Improve",
    subtitle: "From analytics to psychology tracking — all in one place.",
    cta: "Continue",
  },
  screen3: {
    headline: "Ready to",
    headlineAccent: "Transform",
    headlineSuffix: "Your Trading?",
    subtitle: "Start journaling today and take control of your performance.",
    cta: "🚀 Get Started",
    loginPrompt: "Already have an account?",
    loginCta: "Login",
  },
};

export const DASHBOARD_STATS = {
  equityCurve: "+₹4,52,000",
  winRate: "68.4%",
  avgRR: "1:2.4",
  latestTrade: {
    symbol: "NIFTY 22400 CE",
    date: "24 May",
    pnl: "+₹12,400",
    progress: 0.75,
  },
};

export const HERO_STATS = {
  plCurve: "+142%",
  journalingDay: "Day 30",
};

export const ASYNC_STORAGE_KEYS = {
  onboarded: "onboarded",
};
