import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const {
    partnerId,
    clicks,
    registrations,
    deposits,
    revenueCents,
    viewsCount,
    fixedPayoutCents,
    balanceCents,
    status,
  } = body;

  const supabase = createAdminClient();

  const { error: statsError } = await supabase
    .from("partner_stats")
    .update({
      clicks,
      registrations,
      deposits,
      revenue_cents: revenueCents,
      views: viewsCount,
      fixed_payout_cents: fixedPayoutCents,
      updated_at: new Date().toISOString(),
    })
    .eq("partner_id", partnerId);

  if (statsError) {
    return NextResponse.json({ error: statsError.message }, { status: 500 });
  }

  const { error: partnerError } = await supabase
    .from("partners")
    .update({ balance_cents: balanceCents, status })
    .eq("id", partnerId);

  if (partnerError) {
    return NextResponse.json({ error: partnerError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
