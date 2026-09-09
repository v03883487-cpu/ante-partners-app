import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ReportsTable } from "@/components/ReportsTable";

export default async function ReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <main className="px-6 py-10 sm:px-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-bold text-2xl text-[#0A0A0A]">Отчёты</h1>
        <p className="mt-1 text-sm text-zinc-500">Статистика по дням и брендам за выбранный период.</p>
        <div className="mt-6">
          <ReportsTable userId={user.id} />
        </div>
      </div>
    </main>
  );
}
