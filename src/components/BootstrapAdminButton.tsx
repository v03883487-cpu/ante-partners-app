"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function BootstrapAdminButton() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  async function handleClick() {
    const res = await fetch("/api/admin/bootstrap", { method: "POST" });
    const data = await res.json();
    if (data.promoted) {
      setMessage("Готово, вы админ. Обновляем страницу…");
      router.refresh();
    } else if (data.alreadyAdmin) {
      setMessage("Вы уже админ.");
      router.refresh();
    } else {
      setMessage("Админ уже назначен другим аккаунтом.");
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className="rounded-full bg-[#0A0A0A] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80"
      >
        Стать первым админом
      </button>
      {message && <p className="mt-3 text-sm text-zinc-500">{message}</p>}
    </div>
  );
}
