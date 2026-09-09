import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PlayerCheck } from "@/components/PlayerCheck";
import { AGENCY_SITE_URL } from "@/lib/site";

function formatMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: partner } = await supabase
    .from("partners")
    .select("referral_code, telegram, traffic_source, balance_cents, status, created_at")
    .eq("id", user.id)
    .single();

  const { data: stats } = await supabase
    .from("partner_stats")
    .select("clicks, registrations, deposits, revenue_cents, views, fixed_payout_cents")
    .eq("partner_id", user.id)
    .single();

  const referralLink = partner ? `${AGENCY_SITE_URL}/?ref=${partner.referral_code}` : "";

  const cards = [
    { label: "Просмотры", value: stats?.views ?? 0 },
    { label: "Клики", value: stats?.clicks ?? 0 },
    { label: "Количество регистраций", value: stats?.registrations ?? 0 },
    { label: "Количество депозитеров", value: stats?.deposits ?? 0 },
    { label: "Комиссия партнера ($)", value: formatMoney(stats?.revenue_cents ?? 0) },
    { label: "Фиксированная выплата, $", value: formatMoney(stats?.fixed_payout_cents ?? 0) },
  ];

  return (
    <main className="px-6 py-10 sm:px-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-bold text-2xl text-[#0A0A0A]">Личный кабинет</h1>
        <p className="mt-1 text-xs text-zinc-500">
          Последнее обновление {new Date().toLocaleString("ru-RU")}
        </p>

        <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Ваша реферальная ссылка</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <code className="rounded-lg bg-black/5 px-3 py-2 text-sm text-[#0A0A0A]">{referralLink}</code>
          </div>
          <div className="mt-4 flex flex-wrap gap-6 text-sm text-zinc-500">
            <span>Статус: <span className="text-[#0A0A0A]">{partner?.status ?? "pending"}</span></span>
            <span>Баланс: <span className="text-[#0A0A0A]">{formatMoney(partner?.balance_cents ?? 0)}</span></span>
            {partner?.telegram && <span>Telegram: <span className="text-[#0A0A0A]">{partner.telegram}</span></span>}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {cards.map((c) => (
            <div key={c.label} className="rounded-2xl border border-black/10 bg-white p-5">
              <div className="font-bold text-2xl text-[#0A0A0A]">{c.value}</div>
              <p className="mt-1 text-xs text-zinc-500">{c.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <p className="text-xs uppercase tracking-widest text-zinc-500">Ваш менеджер</p>
            <p className="mt-3 font-semibold text-[#0A0A0A]">Vladislav Vladimirskiy</p>
            <dl className="mt-3 flex flex-col gap-1 text-sm text-zinc-500">
              <div>Telegram: <span className="text-[#0A0A0A]">@ante_manager</span></div>
              <div>WhatsApp: <span className="text-[#0A0A0A]">по запросу</span></div>
              <div>Почта: <span className="text-[#0A0A0A]">partners@ante.agency</span></div>
            </dl>
          </div>
          <PlayerCheck />
        </div>

        <p className="mt-6 text-xs text-zinc-600">
          Статистика реальна и хранится в базе, но пока не заполняется автоматически — трекинг переходов
          и постбэки от брендов ещё не подключены. Админ может проставить тестовые значения в /admin.
        </p>
      </div>
    </main>
  );
}
