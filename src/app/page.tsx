import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center text-[#0A0A0A]">
      <p className="text-xs uppercase tracking-widest text-[#0A0A0A]">Ante Partners</p>
      <h1 className="mt-3 max-w-lg font-bold text-3xl text-[#0A0A0A] sm:text-4xl">
        Личный кабинет партнёрской программы
      </h1>
      <p className="mt-4 max-w-md text-zinc-500">
        Войдите или зарегистрируйтесь, чтобы получить реферальную ссылку и следить за статистикой.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/register"
          className="rounded-full bg-[#0A0A0A] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80"
        >
          Регистрация
        </Link>
        <Link
          href="/login"
          className="rounded-full border border-black/15 px-6 py-3 text-sm font-semibold text-[#0A0A0A] transition-colors hover:bg-black/5"
        >
          Войти
        </Link>
      </div>
    </main>
  );
}
