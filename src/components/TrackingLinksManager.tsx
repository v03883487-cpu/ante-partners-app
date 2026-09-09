"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AGENCY_SITE_URL } from "@/lib/site";

type Link = { id: string; label: string; code: string; clicks: number; created_at: string };

export function TrackingLinksManager({ userId, initialLinks }: { userId: string; initialLinks: Link[] }) {
  const [links, setLinks] = useState(initialLinks);
  const [label, setLabel] = useState("");
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!label) return;
    setCreating(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("tracking_links")
      .insert({ partner_id: userId, label })
      .select("id, label, code, clicks, created_at")
      .single();
    setCreating(false);
    if (!error && data) {
      setLinks([data, ...links]);
      setLabel("");
    }
  }

  function copy(link: Link) {
    const url = `${AGENCY_SITE_URL}/?ref=${link.code}`;
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div>
      <form onSubmit={handleCreate} className="flex gap-2">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Название ссылки, напр. Twitch-описание"
          className="w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm text-[#0A0A0A] outline-none focus:border-[#0A0A0A]"
        />
        <button
          type="submit"
          disabled={creating}
          className="shrink-0 rounded-full bg-[#0A0A0A] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          Создать
        </button>
      </form>

      <div className="mt-6 divide-y divide-black/10 border-y border-black/10">
        {links.length === 0 && <p className="py-6 text-sm text-zinc-500">Ссылок пока нет — создайте первую выше.</p>}
        {links.map((l) => (
          <div key={l.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div>
              <p className="font-semibold text-[#0A0A0A]">{l.label}</p>
              <code className="text-xs text-zinc-500">{AGENCY_SITE_URL}/?ref={l.code}</code>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-500">{l.clicks} кликов</span>
              <button
                onClick={() => copy(l)}
                className="rounded-full border border-black/15 px-3 py-1.5 text-xs text-[#0A0A0A] hover:bg-black/5"
              >
                {copiedId === l.id ? "Скопировано" : "Копировать"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
