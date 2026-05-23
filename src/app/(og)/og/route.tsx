import {createOgImage} from "@/lib/og-image";

export const runtime = "edge";

export function GET() {
  return createOgImage("en");
}
