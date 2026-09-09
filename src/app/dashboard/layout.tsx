import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/SignOutButton";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: partner } = await supabase.from("partners").select("is_admin").eq("id", user.id).single();

  const navLinks = [
    { href: "/dashboard", label: "Главная" },
    { href: "/dashboard/links", label: "Трекинговые ссылки" },
    { href: "/dashboard/reports", label: "Отчёты" },
  ];

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A]">
      <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 px-6 py-4 sm:px-12">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="font-display text-sm font-black tracking-tight text-[#0A0A0A]">
            ANTE <span className="text-zinc-500">PARTNERS</span>
          </Link>
          <div className="hidden items-center gap-6 text-sm text-zinc-500 sm:flex">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-[#0A0A0A]">
                {l.label}
              </Link>
            ))}
            {partner?.is_admin && (
              <Link href="/admin" className="font-semibold text-[#0A0A0A] transition-opacity hover:opacity-60">
                Админка
              </Link>
            )}
          </div>
        </div>
        <SignOutButton />
      </nav>
      {children}
    </div>
  );
}
