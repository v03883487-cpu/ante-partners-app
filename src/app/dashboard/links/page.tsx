import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TrackingLinksManager } from "@/components/TrackingLinksManager";

export default async function LinksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: links } = await supabase
    .from("tracking_links")
    .select("id, label, code, clicks, created_at")
    .eq("partner_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="px-6 py-10 sm:px-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-bold text-2xl text-white">Трекинговые ссылки</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Создавайте отдельные ссылки под разные площадки — статистика по каждой считается отдельно.
        </p>
        <div className="mt-6">
          <TrackingLinksManager userId={user.id} initialLinks={links ?? []} />
        </div>
      </div>
    </main>
  );
}
