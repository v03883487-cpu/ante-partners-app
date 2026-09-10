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
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs uppercase tracking-widest text-zinc-400">Проверка игрока</p>
      <form onSubmit={handleCheck} className="mt-3 flex gap-2">
        <input
          value={cid}
          onChange={(e) => setCid(e.target.value)}
          placeholder="Cid игрока"
          className="w-full rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-white"
        />
        <button type="submit" className="shrink-0 rounded-full border border-white/15 px-4 py-2 text-sm text-white hover:bg-white/10">
          Найти
        </button>
      </form>
      {result && <p className="mt-3 text-xs text-zinc-400">{result}</p>}
    </div>
  );
}
