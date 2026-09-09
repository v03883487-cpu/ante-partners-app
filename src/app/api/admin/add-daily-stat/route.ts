import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { partnerId, date, brand, clicks, registrations, deposits, revenueCents } = body;

  const supabase = createAdminClient();
  const { error } = await supabase.from("daily_stats").insert({
    partner_id: partnerId,
    date,
    brand,
    clicks,
    registrations,
    deposits,
    revenue_cents: revenueCents,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
