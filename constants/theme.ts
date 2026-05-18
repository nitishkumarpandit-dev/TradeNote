// theme.ts — Trade Note design tokens
// Mirrors the Tailwind config in the HTML source

export const COLORS = {
  // Backgrounds & Surfaces
  background: "#10141A",
  surface: "#10141A",
  surfaceContainer: "#1C2026",
  surfaceContainerLow: "#181C22",
  surfaceContainerHigh: "#262A31",
  surfaceContainerHighest: "#31353C",
  surfaceContainerLowest: "#0A0E14",
  surfaceBright: "#353940",
  surfaceVariant: "#31353C",

  // Primary (blue)
  primary: "#ADC6FF",
  primaryContainer: "#4D8EFF",
  primaryFixedDim: "#ADC6FF",
  onPrimary: "#002E6A",
  onPrimaryContainer: "#00285D",
  inversePrimary: "#005AC2",

  // Secondary (green/teal)
  secondary: "#43E5B1",
  secondaryContainer: "#01C896",
  secondaryFixed: "#60FCC6",
  secondaryFixedDim: "#3ADFAB",
  onSecondary: "#003828",
  onSecondaryContainer: "#004D38",

  // Tertiary (red)
  tertiary: "#FFB3AD",
  tertiaryContainer: "#FF5451",
  tertiaryFixed: "#FFDAD7",
  tertiaryFixedDim: "#FFB3AD",
  onTertiary: "#68000A",
  onTertiaryContainer: "#5C0008",

  // Neutral
  onSurface: "#DFE2EB",
  onSurfaceVariant: "#C2C6D6",
  onBackground: "#DFE2EB",
  outline: "#8C909F",
  outlineVariant: "#424754",
  inverseSurface: "#DFE2EB",
  inverseOnSurface: "#2D3137",

  // Error
  error: "#FFB4AB",
  errorContainer: "#93000A",
  onError: "#690005",
  onErrorContainer: "#FFDAD6",

  // Misc
  surfaceTint: "#ADC6FF",
};

export const RADIUS = {
  sm: 4,
  DEFAULT: 4,
  lg: 8,
  xl: 16,
  "2xl": 24,
  full: 9999,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
};

export const TYPOGRAPHY = {
  // Display
  displayLg: { fontSize: 24, fontWeight: "800" as const, letterSpacing: -0.5 },
  displayMd: { fontSize: 20, fontWeight: "800" as const, letterSpacing: -0.3 },

  // Headings
  h1: { fontSize: 18, fontWeight: "700" as const },
  h2: { fontSize: 16, fontWeight: "700" as const },
  h3: { fontSize: 14, fontWeight: "700" as const },

  // Body
  bodyLg: { fontSize: 15, fontWeight: "400" as const, lineHeight: 22 },
  bodyMd: { fontSize: 13, fontWeight: "400" as const, lineHeight: 20 },
  bodySm: { fontSize: 12, fontWeight: "400" as const },

  // Labels
  labelLg: { fontSize: 12, fontWeight: "600" as const, letterSpacing: 0.5 },
  labelMd: { fontSize: 11, fontWeight: "600" as const, letterSpacing: 0.4 },
  labelSm: {
    fontSize: 10,
    fontWeight: "600" as const,
    letterSpacing: 0.8,
    textTransform: "uppercase" as const,
  },

  // Mono/numbers
  numLg: { fontSize: 22, fontWeight: "800" as const },
  numMd: { fontSize: 16, fontWeight: "700" as const },
};
