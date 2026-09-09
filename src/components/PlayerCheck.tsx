"use client";

import { useState } from "react";

export function PlayerCheck() {
  const [cid, setCid] = useState("");
  const [result, setResult] = useState<string | null>(null);

  function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    if (!cid) return;
    // Placeholder — реальная проверка появится вместе с интеграцией трекера.
    setResult(`CID ${cid}: интеграция с трекером ещё не подключена.`);
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <p className="text-xs uppercase tracking-widest text-zinc-500">Проверка игрока</p>
      <form onSubmit={handleCheck} className="mt-3 flex gap-2">
        <input
          value={cid}
          onChange={(e) => setCid(e.target.value)}
          placeholder="Cid игрока"
          className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-[#0A0A0A] outline-none focus:border-[#0A0A0A]"
        />
        <button type="submit" className="shrink-0 rounded-full border border-black/15 px-4 py-2 text-sm text-[#0A0A0A] hover:bg-black/5">
          Найти
        </button>
      </form>
      {result && <p className="mt-3 text-xs text-zinc-500">{result}</p>}
    </div>
  );
}
