"use client";

import Script from "next/script";
import { SITE } from "@/lib/site";

export default function ChatWidget() {
  if (!SITE.chatWidgetId) return null;
  return (
    <Script
      src="https://widgets.leadconnectorhq.com/loader.js"
      data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
      data-widget-id={SITE.chatWidgetId}
      data-source="WEB_USER"
      strategy="afterInteractive"
    />
  );
}
