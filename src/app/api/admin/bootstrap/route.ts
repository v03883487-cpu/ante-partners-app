import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "not authenticated" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { count } = await admin
    .from("partners")
    .select("id", { count: "exact", head: true })
    .eq("is_admin", true);

  if (count && count > 0) {
    const { data: self } = await admin.from("partners").select("is_admin").eq("id", user.id).single();
    return NextResponse.json({ promoted: false, alreadyAdmin: !!self?.is_admin });
  }

  const { error } = await admin.from("partners").update({ is_admin: true }).eq("id", user.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ promoted: true });
}
