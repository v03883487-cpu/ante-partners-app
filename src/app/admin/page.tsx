import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminPartnerPanel, type AdminPartnerData } from "@/components/AdminPartnerPanel";
import { BootstrapAdminButton } from "@/components/BootstrapAdminButton";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: self } = await supabase.from("partners").select("is_admin").eq("id", user.id).single();

  if (!self?.is_admin) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center text-[#0A0A0A]">
        <p className="text-xs uppercase tracking-widest text-zinc-500">Ante Partners · Admin</p>
        <h1 className="font-bold text-2xl text-[#0A0A0A]">Доступа нет</h1>
        <p className="max-w-sm text-sm text-zinc-500">
          Если админ ещё не назначен, вы можете стать первым — кнопка сработает только пока админов нет вообще.
        </p>
        <BootstrapAdminButton />
        <Link href="/dashboard" className="mt-4 text-sm text-zinc-500 hover:text-[#0A0A0A]">← В кабинет</Link>
      </main>
    );
  }

  const admin = createAdminClient();
  const { data: authUsers } = await admin.auth.admin.listUsers({ perPage: 200 });
  const { data: partners } = await admin
    .from("partners")
    .select("id, referral_code, telegram, status, balance_cents");
  const { data: statsRows } = await admin
    .from("partner_stats")
    .select("partner_id, clicks, registrations, deposits, revenue_cents, views, fixed_payout_cents");
  const { data: links } = await admin
    .from("tracking_links")
    .select("id, partner_id, label, code, clicks");

  const emailById = new Map(authUsers?.users.map((u) => [u.id, u.email ?? "—"]));
  const statsById = new Map(statsRows?.map((s) => [s.partner_id, s]));

  const rows: AdminPartnerData[] = (partners ?? []).map((p) => ({
    id: p.id,
    email: emailById.get(p.id) ?? "—",
    referral_code: p.referral_code,
    telegram: p.telegram,
    status: p.status,
    balance_cents: p.balance_cents,
    stats: statsById.get(p.id) ?? {
      clicks: 0,
      registrations: 0,
      deposits: 0,
      revenue_cents: 0,
      views: 0,
      fixed_payout_cents: 0,
    },
    links: (links ?? []).filter((l) => l.partner_id === p.id),
  }));

  return (
    <main className="min-h-screen bg-white px-6 py-10 text-[#0A0A0A] sm:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500">Ante Partners · Admin</p>
            <h1 className="mt-1 font-bold text-2xl text-[#0A0A0A]">Управление партнёрами</h1>
          </div>
          <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-[#0A0A0A]">← В кабинет</Link>
        </div>

        <p className="mt-3 text-sm text-zinc-500">
          Правьте цифры любого партнёра для теста — изменения реальные, пишутся напрямую в базу.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          {rows.map((r) => (
            <AdminPartnerPanel key={r.id} partner={r} />
          ))}
          {rows.length === 0 && <p className="text-sm text-zinc-500">Пока нет ни одного партнёра.</p>}
        </div>
      </div>
    </main>
  );
}
