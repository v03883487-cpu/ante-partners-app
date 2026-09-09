import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/SignOutButton";

function formatMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: partner } = await supabase
    .from("partners")
    .select("referral_code, telegram, traffic_source, balance_cents, status, created_at")
    .eq("id", user.id)
    .single();

  const { data: stats } = await supabase
    .from("partner_stats")
    .select("clicks, registrations, deposits, revenue_cents")
    .eq("partner_id", user.id)
    .single();

  const referralLink = partner
    ? `https://ante.agency/?ref=${partner.referral_code}`
    : "";

  const cards = [
    { label: "Клики", value: stats?.clicks ?? 0 },
    { label: "Регистрации", value: stats?.registrations ?? 0 },
    { label: "Депозиты (FTD)", value: stats?.deposits ?? 0 },
    { label: "Доход", value: formatMoney(stats?.revenue_cents ?? 0) },
  ];

  return (
    <main className="min-h-screen bg-[#0A0B0E] px-6 py-10 text-zinc-50 sm:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#D7FF3F]">Ante Partners</p>
            <h1 className="mt-1 font-bold text-2xl text-white">Личный кабинет</h1>
          </div>
          <SignOutButton />
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Ваша реферальная ссылка</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <code className="rounded-lg bg-black/30 px-3 py-2 text-sm text-[#D7FF3F]">{referralLink}</code>
          </div>
          <div className="mt-4 flex flex-wrap gap-6 text-sm text-zinc-400">
            <span>Статус: <span className="text-white">{partner?.status ?? "pending"}</span></span>
            <span>Баланс: <span className="text-white">{formatMoney(partner?.balance_cents ?? 0)}</span></span>
            {partner?.telegram && <span>Telegram: <span className="text-white">{partner.telegram}</span></span>}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {cards.map((c) => (
            <div key={c.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="font-bold text-2xl text-white">{c.value}</div>
              <p className="mt-1 text-xs text-zinc-500">{c.label}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-zinc-600">
          Статистика обновится автоматически, как только будет подключён трекинг переходов и постбэки от
          брендов — пока это реальный, но ещё не заполненный трафиком профиль.
        </p>
      </div>
    </main>
  );
}
