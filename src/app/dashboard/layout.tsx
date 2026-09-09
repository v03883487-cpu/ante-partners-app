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
    <div className="min-h-screen bg-[#0A0B0E] text-zinc-50">
      <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-4 sm:px-12">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-sm font-bold text-white">
            ANTE <span className="text-[#D7FF3F]">PARTNERS</span>
          </Link>
          <div className="hidden items-center gap-6 text-sm text-zinc-400 sm:flex">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-white">
                {l.label}
              </Link>
            ))}
            {partner?.is_admin && (
              <Link href="/admin" className="text-[#D7FF3F] transition-colors hover:text-white">
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
