/**
 * Server-only configuration helpers.
 * Never import this module from Client Components.
 */

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optional(name: string, fallback = ""): string {
  return process.env[name]?.trim() || fallback;
}

/** Values safe to read on the server for outbound integrations. */
export const serverEnv = {
  leadWebhookUrl: () => required("BACKEND_LEAD_WEBHOOK_URL"),
  bookingWebhookUrl: () => required("BACKEND_BOOKING_WEBHOOK_URL"),
  agentWebhookUrl: () => required("BACKEND_AGENT_WEBHOOK_URL"),
  mediaUploadUrl: () => "https://services.leadconnectorhq.com/medias/upload-file",
  mediaToken: () => required("BACKEND_MEDIA_TOKEN"),
  agentPin: () => required("AGENT_PIN"),
};

export const publicSite = {
  url: optional("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
  name: optional("NEXT_PUBLIC_SITE_NAME", "ZL Travel Agency"),
  phone: optional("NEXT_PUBLIC_PHONE", "515-420-0551"),
  phoneE164: optional("NEXT_PUBLIC_PHONE_E164", "+15154200551"),
  email: optional("NEXT_PUBLIC_EMAIL", "Sales@ZLTravelAgency.com"),
  calendlyUrl: optional(
    "NEXT_PUBLIC_CALENDLY_URL",
    "https://calendly.com/zltravelagency-sales/30min",
  ),
  chatWidgetId: optional("NEXT_PUBLIC_CHAT_WIDGET_ID", ""),
  facebookUrl: optional("NEXT_PUBLIC_FACEBOOK_URL", ""),
  instagramUrl: optional("NEXT_PUBLIC_INSTAGRAM_URL", ""),
  youtubeUrl: optional("NEXT_PUBLIC_YOUTUBE_URL", ""),
  bookingTimezone: optional("NEXT_PUBLIC_BOOKING_TIMEZONE", "America/Chicago"),
  bookingTimezoneLabel: optional(
    "NEXT_PUBLIC_BOOKING_TIMEZONE_LABEL",
    "US Central Time (CST/CDT)",
  ),
  bookingCalendarName: optional(
    "NEXT_PUBLIC_BOOKING_CALENDAR_NAME",
    "zltravelconsultationbooking",
  ),
  bookingType: optional(
    "NEXT_PUBLIC_BOOKING_TYPE",
    "30-minute-consultation",
  ),
};
