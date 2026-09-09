import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: partner } = await supabase
    .from("partners")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!partner?.is_admin) return null;
  return user;
}
