import { serverEnv } from "@/lib/env";

async function postJson(url: string, payload: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Webhook failed (${res.status})${text ? `: ${text.slice(0, 200)}` : ""}`,
    );
  }

  return res;
}

export async function forwardLead(payload: unknown) {
  return postJson(serverEnv.leadWebhookUrl(), payload);
}

export async function forwardBooking(payload: unknown) {
  return postJson(serverEnv.bookingWebhookUrl(), payload);
}

export async function forwardAgentSubmission(payload: unknown) {
  return postJson(serverEnv.agentWebhookUrl(), payload);
}

export async function uploadMedia(file: File) {
  const body = new FormData();
  body.append("file", file, file.name);
  body.append("name", file.name);

  const res = await fetch(serverEnv.mediaUploadUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serverEnv.mediaToken()}`,
      Version: "2021-07-28",
    },
    body,
    cache: "no-store",
  });

  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const message =
      (data.message as string) ||
      (data.error as string) ||
      `Media upload failed (HTTP ${res.status})`;
    throw new Error(message);
  }

  const nested = data.file as Record<string, unknown> | undefined;
  const dataNode = data.data as Record<string, unknown> | undefined;
  const uploaded = data.uploadedFiles as Array<Record<string, unknown>> | undefined;

  const url =
    (data.url as string) ||
    (data.fileUrl as string) ||
    (data.link as string) ||
    (nested?.url as string) ||
    (dataNode?.url as string) ||
    (uploaded?.[0]?.url as string) ||
    "";

  if (!url) {
    throw new Error("Upload succeeded but no file URL was returned.");
  }

  return {
    url,
    fileId: (data.id as string) || (nested?.id as string) || "",
    name: file.name,
  };
}
