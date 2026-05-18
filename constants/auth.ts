// constants/auth.ts

export const AUTH_ROUTES = {
  login: "/(auth)/screens/LoginScreen",
  register: "/(auth)/screens/RegisterScreen",
  forgotPassword: "/(auth)/screens/ForgotPasswordScreen",
  resetPassword: "/(auth)/screens/ResetPasswordScreen",
  emailVerification: "/(auth)/screens/EmailVerificationScreen",
  app: "/(tabs)/DashboardScreen",
} as const;

export const AUTH_COPY = {
  brand: {
    name: "Trade Note",
    tagline: "Track. Analyze. Improve.",
  },
  login: {
    title: "Welcome Back",
    subtitle: "Login to continue your trading journey",
    cta: "Login",
    googleCta: "Continue with Google",
    forgotPassword: "Forgot password?",
    noAccount: "Don't have an account?",
    signUp: "Sign Up",
  },
  register: {
    title: "Create Account",
    cta: "Create Account",
    googleCta: "Continue with Google",
    hasAccount: "Already have an account?",
    login: "Login",
  },
  forgotPassword: {
    title: "Forgot Password?",
    subtitle: "Enter your email to receive a password reset link.",
    emailLabel: "EMAIL ADDRESS",
    emailPlaceholder: "Enter your email",
    cta: "Reset Password",
    remembered: "Remembered?",
    login: "Login",
    secureNote: "SECURE ENCRYPTION ENABLED",
    successTitle: "Check your inbox!",
    successSubtitle: "A reset link has been sent to your email.",
  },
  emailVerification: {
    title: "Verify Your Email",
    subtitle: "Enter the 6-digit code sent to your email address.",
    cta: "Verify Email",
    noEmail: "Didn't receive a code?",
    resend: "Resend",
  },
  resetPassword: {
    title: "Reset Password",
    subtitle: "Enter your verification code and choose a new password.",
    cta: "Reset Password",
    successTitle: "Password Reset!",
    successSubtitle:
      "Your password has been successfully updated. You can now log in.",
  },
  shared: {
    or: "OR",
    terms: "By continuing, you agree to our",
    termsLink: "Terms of Service",
    and: "and",
    privacyLink: "Privacy Policy",
    emailPlaceholder: "Email Address",
    passwordPlaceholder: "Password",
    namePlaceholder: "Full Name",
  },
} as const;

export const COLORS = {
  screenBg: "#0B0F1A",
  cardBg: "rgba(28, 32, 38, 0.45)",
  inputBg: "#0a0e14",
  primaryBlue: "#4d8eff",
  primaryBlueDim: "#adc6ff",
  purple: "#a855f7",
  teal: "#43e5b1",
  red: "#ff5451",
  textPrimary: "#dfe2eb",
  textMuted: "#c2c6d6",
  textHint: "#8c909f",
  borderDefault: "rgba(66, 71, 84, 0.4)",
  borderFocus: "#4d8eff",
  borderCard: "rgba(255, 255, 255, 0.06)",
  gradientStart: "#4d8eff",
  gradientEnd: "#a855f7",
  orbBlue: "rgba(173, 198, 255, 0.12)",
  orbRed: "rgba(255, 84, 81, 0.06)",
} as const;

export const ASYNC_STORAGE_KEYS = {
  authToken: "auth_token",
  user: "user_data",
  onboarded: "onboarded",
} as const;
