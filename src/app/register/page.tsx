"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telegram, setTelegram] = useState("");
  const [trafficSource, setTrafficSource] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }

    if (data.user) {
      await supabase
        .from("partners")
        .update({ telegram, traffic_source: trafficSource })
        .eq("id", data.user.id);
    }

    setLoading(false);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0B0E] px-6 py-16 text-zinc-50">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.03] p-8">
        <h1 className="font-bold text-2xl text-white">Стать партнёром</h1>
        <p className="mt-1 text-sm text-zinc-500">Ante Partners</p>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:border-[#D7FF3F]/50"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Пароль (мин. 6 символов)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:border-[#D7FF3F]/50"
          />
          <input
            type="text"
            placeholder="Telegram (@username)"
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:border-[#D7FF3F]/50"
          />
          <input
            type="text"
            placeholder="Источник трафика (Twitch/Kick/медиабаинг…)"
            value={trafficSource}
            onChange={(e) => setTrafficSource(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:border-[#D7FF3F]/50"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[#D7FF3F] px-6 py-3 text-sm font-semibold text-[#0A0B0E] transition-transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? "Создаём аккаунт…" : "Зарегистрироваться"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-500">
          Уже есть аккаунт? <Link href="/login" className="text-white hover:text-[#D7FF3F]">Войти</Link>
        </p>
      </div>
    </main>
  );
}
