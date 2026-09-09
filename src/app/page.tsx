import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0A0B0E] px-6 text-center text-zinc-50">
      <p className="text-xs uppercase tracking-widest text-[#D7FF3F]">Ante Partners</p>
      <h1 className="mt-3 max-w-lg font-bold text-3xl text-white sm:text-4xl">
        Личный кабинет партнёрской программы
      </h1>
      <p className="mt-4 max-w-md text-zinc-400">
        Войдите или зарегистрируйтесь, чтобы получить реферальную ссылку и следить за статистикой.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/register"
          className="rounded-full bg-[#D7FF3F] px-6 py-3 text-sm font-semibold text-[#0A0B0E] transition-transform hover:scale-105"
        >
          Регистрация
        </Link>
        <Link
          href="/login"
          className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
        >
          Войти
        </Link>
      </div>
    </main>
  );
}
