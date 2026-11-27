import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { cmsConfig } from "@/lib/config";
import { CMS_TAG } from "@/lib/cms/client";

// Called by a Sanity webhook on publish. The signature is checked against
// SANITY_REVALIDATE_SECRET, then every CMS read is marked stale so pages refresh on their
// next visit without a redeploy.
export async function POST(req: NextRequest) {
  const secret = cmsConfig.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    console.error("Revalidate webhook called but SANITY_REVALIDATE_SECRET is not set");
    return NextResponse.json({ error: "Revalidation is not configured" }, { status: 503 });
  }

  const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true);
  if (!isValidSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  revalidateTag(CMS_TAG, "max");
  return NextResponse.json({ revalidated: true, type: body?._type ?? null });
}
