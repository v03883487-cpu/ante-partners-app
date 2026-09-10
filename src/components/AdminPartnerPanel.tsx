"use client";

import { useState } from "react";

type TrackingLink = { id: string; label: string; code: string; clicks: number };

export type AdminPartnerData = {
  id: string;
  email: string;
  referral_code: string;
  telegram: string | null;
  status: string;
  balance_cents: number;
  stats: {
    clicks: number;
    registrations: number;
    deposits: number;
    revenue_cents: number;
    views: number;
    fixed_payout_cents: number;
  };
  links: TrackingLink[];
};

async function post(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export function AdminPartnerPanel({ partner }: { partner: AdminPartnerData }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const [clicks, setClicks] = useState(partner.stats.clicks);
  const [registrations, setRegistrations] = useState(partner.stats.registrations);
  const [deposits, setDeposits] = useState(partner.stats.deposits);
  const [revenue, setRevenue] = useState((partner.stats.revenue_cents / 100).toString());
  const [views, setViews] = useState(partner.stats.views);
  const [fixedPayout, setFixedPayout] = useState((partner.stats.fixed_payout_cents / 100).toString());
  const [balance, setBalance] = useState((partner.balance_cents / 100).toString());
  const [status, setStatus] = useState(partner.status);

  const [linkLabel, setLinkLabel] = useState("");
  const [dailyDate, setDailyDate] = useState(new Date().toISOString().slice(0, 10));
  const [dailyBrand, setDailyBrand] = useState("LEON");
  const [dailyClicks, setDailyClicks] = useState(0);
  const [dailyRegs, setDailyRegs] = useState(0);
  const [dailyDeps, setDailyDeps] = useState(0);
  const [dailyRevenue, setDailyRevenue] = useState("0");

  async function saveStats() {
    setSaving(true);
    await post("/api/admin/update-stats", {
      partnerId: partner.id,
      clicks: Number(clicks),
      registrations: Number(registrations),
      deposits: Number(deposits),
      revenueCents: Math.round(Number(revenue) * 100),
      viewsCount: Number(views),
      fixedPayoutCents: Math.round(Number(fixedPayout) * 100),
      balanceCents: Math.round(Number(balance) * 100),
      status,
    });
    setSaving(false);
    setSavedAt(Date.now());
  }

  async function addLink() {
    if (!linkLabel) return;
    await post("/api/admin/add-tracking-link", { partnerId: partner.id, label: linkLabel, clicks: 0 });
    setLinkLabel("");
    window.location.reload();
  }

  async function addDailyStat() {
    await post("/api/admin/add-daily-stat", {
      partnerId: partner.id,
      date: dailyDate,
      brand: dailyBrand,
      clicks: Number(dailyClicks),
      registrations: Number(dailyRegs),
      deposits: Number(dailyDeps),
      revenueCents: Math.round(Number(dailyRevenue) * 100),
    });
    setDailyClicks(0);
    setDailyRegs(0);
    setDailyDeps(0);
    setDailyRevenue("0");
  }

  const inputCls =
    "w-full rounded-lg border border-white/15 bg-white/[0.03] px-3 py-1.5 text-sm text-white outline-none focus:border-white";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between text-left">
        <div>
          <p className="font-semibold text-white">{partner.email}</p>
          <p className="text-xs text-zinc-400">
            ref: {partner.referral_code} · статус: {partner.status} · баланс: ${(partner.balance_cents / 100).toFixed(2)}
          </p>
        </div>
        <span className="text-zinc-400">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="mt-5 flex flex-col gap-6 border-t border-white/10 pt-5">
          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-zinc-400">Статистика кабинета</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <label className="text-xs text-zinc-400">
                Просмотры
                <input type="number" value={views} onChange={(e) => setViews(Number(e.target.value))} className={inputCls} />
              </label>
              <label className="text-xs text-zinc-400">
                Клики
                <input type="number" value={clicks} onChange={(e) => setClicks(Number(e.target.value))} className={inputCls} />
              </label>
              <label className="text-xs text-zinc-400">
                Регистрации
                <input type="number" value={registrations} onChange={(e) => setRegistrations(Number(e.target.value))} className={inputCls} />
              </label>
              <label className="text-xs text-zinc-400">
                Депозиторы
                <input type="number" value={deposits} onChange={(e) => setDeposits(Number(e.target.value))} className={inputCls} />
              </label>
              <label className="text-xs text-zinc-400">
                Доход, $
                <input type="number" value={revenue} onChange={(e) => setRevenue(e.target.value)} className={inputCls} />
              </label>
              <label className="text-xs text-zinc-400">
                Фикс. выплата, $
                <input type="number" value={fixedPayout} onChange={(e) => setFixedPayout(e.target.value)} className={inputCls} />
              </label>
              <label className="text-xs text-zinc-400">
                Баланс, $
                <input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} className={inputCls} />
              </label>
              <label className="text-xs text-zinc-400">
                Статус
                <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
                  <option value="pending">pending</option>
                  <option value="active">active</option>
                  <option value="blocked">blocked</option>
                </select>
              </label>
            </div>
            <button
              onClick={saveStats}
              disabled={saving}
              className="mt-3 rounded-full bg-white px-5 py-2 text-xs font-semibold text-[#0a0a0a] disabled:opacity-50"
            >
              {saving ? "Сохраняем…" : savedAt ? "Сохранено ✓" : "Сохранить"}
            </button>
          </div>

          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-zinc-400">Трекинговые ссылки</p>
            <ul className="mb-3 flex flex-col gap-1 text-xs text-zinc-400">
              {partner.links.map((l) => (
                <li key={l.id}>
                  {l.label} — /?ref={l.code} — {l.clicks} кликов
                </li>
              ))}
              {partner.links.length === 0 && <li>Ссылок пока нет</li>}
            </ul>
            <div className="flex gap-2">
              <input
                placeholder="Название ссылки"
                value={linkLabel}
                onChange={(e) => setLinkLabel(e.target.value)}
                className={inputCls}
              />
              <button onClick={addLink} className="shrink-0 rounded-full border border-white/15 px-4 py-1.5 text-xs text-white hover:bg-white/10">
                Добавить
              </button>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-zinc-400">Добавить строку в отчёт</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-6">
              <input type="date" value={dailyDate} onChange={(e) => setDailyDate(e.target.value)} className={inputCls} />
              <input placeholder="Бренд" value={dailyBrand} onChange={(e) => setDailyBrand(e.target.value)} className={inputCls} />
              <input type="number" placeholder="Клики" value={dailyClicks} onChange={(e) => setDailyClicks(Number(e.target.value))} className={inputCls} />
              <input type="number" placeholder="Рег." value={dailyRegs} onChange={(e) => setDailyRegs(Number(e.target.value))} className={inputCls} />
              <input type="number" placeholder="Деп." value={dailyDeps} onChange={(e) => setDailyDeps(Number(e.target.value))} className={inputCls} />
              <input type="number" placeholder="Доход $" value={dailyRevenue} onChange={(e) => setDailyRevenue(e.target.value)} className={inputCls} />
            </div>
            <button onClick={addDailyStat} className="mt-2 rounded-full border border-white/15 px-4 py-1.5 text-xs text-white hover:bg-white/10">
              Добавить в отчёт
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
