import { timingSafeEqual } from "crypto";
import { serverEnv } from "@/lib/env";

/** Constant-time PIN comparison to avoid timing leaks. */
export function verifyAgentPin(candidate: string): boolean {
  const expected = serverEnv.agentPin();
  const a = Buffer.from(String(candidate || ""));
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
