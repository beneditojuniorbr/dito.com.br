"use client";

import { Home, Store, Package, Link as LinkIcon, Wallet, User, Users, Radio } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { icon: Home, label: "Início", path: "/dashboard" },
    { icon: Store, label: "Mercado", path: "/mercado" },
    { icon: Package, label: "Produtos", path: "/produtos" },
    { icon: LinkIcon, label: "Links", path: "/links" },
    { icon: Wallet, label: "Sacar", path: "/sacar" },
    { icon: User, label: "Perfil", path: "/perfil" },
  ];

  return (
    <>
      <div className="fixed bottom-[110px] left-6 flex flex-col-reverse gap-4 z-50 pointer-events-auto">
        {/* Mundo Chat (Base) */}
        <button 
          onClick={() => (window as any).notify?.("Chat Global em breve!", "info")}
          className="w-[42px] h-[42px] bg-white rounded-full flex items-center justify-center shadow-[0_5px_15px_rgba(0,0,0,0.1)] border border-gray-50 active:scale-95 transition-transform"
        >
          <div className="text-black"><Store size={18} strokeWidth={2.5} /></div>
        </button>
        {/* Missões (Meio) */}
        <button 
          onClick={() => (window as any).notify?.("Sistema de Missões!", "info")}
          className="w-[42px] h-[42px] bg-white rounded-full flex items-center justify-center shadow-[0_5px_15px_rgba(0,0,0,0.1)] border border-gray-50 active:scale-95 transition-transform"
        >
          <div className="text-black"><Package size={18} strokeWidth={2.5} /></div>
        </button>
        {/* Transmissão (Top) */}
        <button 
          onClick={() => (window as any).notify?.("Iniciando Transmissão...", "success")}
          className="w-[42px] h-[42px] bg-white rounded-full flex items-center justify-center shadow-[0_5px_15px_rgba(0,0,0,0.1)] border border-gray-50 active:scale-95 transition-transform"
        >
          <div className="text-black"><Radio size={18} strokeWidth={2.5} /></div>
        </button>
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full flex flex-col items-center gap-4 z-50 pointer-events-none">
        <nav className="bg-white/90 backdrop-blur-xl border border-gray-100 px-8 py-5 flex justify-between items-center w-[92%] max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[3rem] pointer-events-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            
            return (
              <div 
                key={item.path}
                onClick={() => router.push(item.path)}
                className="cursor-pointer flex flex-col items-center gap-1 group relative"
              >
                <Icon 
                  size={22} 
                  strokeWidth={2.5} 
                  className={cn(
                    "transition-all duration-300",
                    isActive ? "text-black" : "text-gray-400 group-hover:text-black"
                  )}
                />
              </div>
            );
          })}
        </nav>
        {/* Botão Baixar App Simples Abaixo com Degradê */}
        <div 
          onClick={() => (window as any).installPWA?.()}
          className="text-[11px] font-black bg-gradient-to-r from-[#ff0045] to-[#0094ff] bg-clip-text text-transparent tracking-tight pointer-events-auto hover:scale-105 transition-transform cursor-pointer uppercase"
        >
          Dito 2026 - App
        </div>
      </div>
    </>
  );
}
