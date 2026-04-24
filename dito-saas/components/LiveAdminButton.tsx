"use client";

import { Cast } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function LiveAdminButton() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkStatus = () => {
      const userStr = localStorage.getItem("current_user"); // Nome padrão no Next.js pode variar
      const isLoggedIn = localStorage.getItem("is_logged_in") === "true";
      const isAuthPage = pathname === "/login" || pathname === "/cadastro";

      if (!isLoggedIn || isAuthPage) {
        setIsVisible(false);
        return;
      }

      if (userStr) {
        const user = JSON.parse(userStr);
        // Regra do Ditão ou se o usuário for mentor com produtos ativos (mock simplificado por enquanto)
        if (user.username === "Ditão" || user.role === "mentor") {
          setIsVisible(true);
        }
      }
    };

    checkStatus();
    // Escuta mudanças de storage para reagir ao login/logout
    window.addEventListener("storage", checkStatus);
    return () => window.removeEventListener("storage", checkStatus);
  }, [pathname]);

  if (!isVisible) return null;

  return (
    <button
      onClick={() => (window as any).notify?.("Painel de Transmissão em breve no Next.js!", "default")}
      className="fixed bottom-[85px] left-4 sm:left-20 w-14 h-14 bg-white rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.1)] flex items-center justify-center z-[999] hover:scale-110 active:scale-95 transition-all"
    >
      <Cast size={24} className="text-black stroke-[2.5]" />
    </button>
  );
}
