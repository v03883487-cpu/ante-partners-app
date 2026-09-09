"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Row = {
  date: string;
  brand: string;
  clicks: number;
  registrations: number;
  deposits: number;
  revenue_cents: number;
};

function formatMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function ReportsTable({ userId }: { userId: string }) {
  const today = new Date().toISOString().slice(0, 10);
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const [from, setFrom] = useState(monthAgo);
  const [to, setTo] = useState(today);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const supabase = createClient();
    supabase
      .from("daily_stats")
      .select("date, brand, clicks, registrations, deposits, revenue_cents")
      .eq("partner_id", userId)
      .gte("date", from)
      .lte("date", to)
      .order("date", { ascending: false })
      .then(({ data }) => {
        if (!cancelled) {
          setRows(data ?? []);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [userId, from, to]);

  const totals = rows.reduce(
    (acc, r) => ({
      clicks: acc.clicks + r.clicks,
      registrations: acc.registrations + r.registrations,
      deposits: acc.deposits + r.deposits,
      revenue_cents: acc.revenue_cents + r.revenue_cents,
    }),
    { clicks: 0, registrations: 0, deposits: 0, revenue_cents: 0 }
  );

  const inputCls =
    "rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-[#0A0A0A] outline-none focus:border-[#0A0A0A]";

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-xs text-zinc-500">
          Начало
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={`mt-1 block ${inputCls}`} />
        </label>
        <label className="text-xs text-zinc-500">
          Конец
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={`mt-1 block ${inputCls}`} />
        </label>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-black/10">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-black/[0.03] text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Дата</th>
              <th className="px-4 py-3">Бренд</th>
              <th className="px-4 py-3">Клики</th>
              <th className="px-4 py-3">Регистрации</th>
              <th className="px-4 py-3">Депозиты</th>
              <th className="px-4 py-3">Доход</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {loading && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-zinc-500">Загрузка…</td></tr>
            )}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-zinc-500">Нет данных за период</td></tr>
            )}
            {rows.map((r, i) => (
              <tr key={i} className="text-zinc-600">
                <td className="px-4 py-3">{r.date}</td>
                <td className="px-4 py-3">{r.brand}</td>
                <td className="px-4 py-3">{r.clicks}</td>
                <td className="px-4 py-3">{r.registrations}</td>
                <td className="px-4 py-3">{r.deposits}</td>
                <td className="px-4 py-3">{formatMoney(r.revenue_cents)}</td>
              </tr>
            ))}
          </tbody>
          {rows.length > 0 && (
            <tfoot className="bg-black/[0.03] font-semibold text-[#0A0A0A]">
              <tr>
                <td className="px-4 py-3" colSpan={2}>Всего за период</td>
                <td className="px-4 py-3">{totals.clicks}</td>
                <td className="px-4 py-3">{totals.registrations}</td>
                <td className="px-4 py-3">{totals.deposits}</td>
                <td className="px-4 py-3">{formatMoney(totals.revenue_cents)}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
