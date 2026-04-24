"use client";

import Navbar from "@/components/Navbar";
import { BarChart3, Plus, Star, Eye, EyeOff, Users, QrCode, TrendingUp } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import CreateProductModal from "@/components/CreateProductModal";
import React from "react"; 

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showBalance, setShowBalance] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userName, setUserName] = useState("infoprodutor");
  const [isGuestMode, setIsGuestMode] = useState(false);
  
  const [showSocietyDot, setShowSocietyDot] = useState(false);
  const [showHallDot, setShowHallDot] = useState(false);
  const [networkUsersCount, setNetworkUsersCount] = useState(0);
  
    const [balance, setBalance] = useState(0);
    const [sales, setSales] = useState(0);
    
    useEffect(() => {
    async function initDashboard() {
        const isGuest = localStorage.getItem('is_guest') === 'true';
        setIsGuestMode(isGuest);
        
        let currentUserName = "infoprodutor";
        const savedUser = JSON.parse(localStorage.getItem('user_profile') || '{}');
        if (savedUser.name) {
            currentUserName = savedUser.name;
            setUserName(currentUserName);
        }

        // Lógica de Sincronização Global
        const { supabase } = await import("@/lib/supabase");
        
        // Busca usuários reais para o Hall da Fama
        const { data: users } = await supabase.from('dito_users').select('id');
        if (users) {
            setNetworkUsersCount(users.length);
            const lastSeenHall = parseInt(localStorage.getItem('last_seen_hall') || '0');
            if (users.length > lastSeenHall) setShowHallDot(true);
        }

        // Sync automático do perfil e busca de SALDO/VENDAS
        if (!isGuest && savedUser.username) {
            const { data: profile } = await supabase
                .from('dito_users')
                .select('balance, sales')
                .eq('username', savedUser.username)
                .single();

            if (profile) {
                setBalance(Number(profile.balance || 0));
                setSales(Number(profile.sales || 0));
                localStorage.setItem('user_balance', profile.balance.toString());
                localStorage.setItem('user_sales', profile.sales.toString());
            }

            // Realtime para saldo/vendas
            supabase.channel(`user-${savedUser.username}`)
                .on('postgres_changes', { 
                    event: 'UPDATE', 
                    schema: 'public', 
                    table: 'dito_users',
                    filter: `username=eq.${savedUser.username}`
                }, (payload) => {
                    setBalance(Number(payload.new.balance || 0));
                    setSales(Number(payload.new.sales || 0));
                })
                .subscribe();

            await supabase.from('dito_users').upsert([{
                id: savedUser.id || Date.now(),
                username: savedUser.username,
                name: savedUser.name || savedUser.username,
                bio: savedUser.bio || "Membro Dito",
                sales: Number(localStorage.getItem('user_sales') || 0),
                avatar: savedUser.avatar || ""
            }], { onConflict: 'username' });
        }
    }

    initDashboard();

    if (searchParams.get("create") === "true") {
      setIsCreateModalOpen(true);
      router.replace("/dashboard");
    }
  }, [searchParams, router]);

  const handleAction = (route: string) => {
    if (isGuestMode) {
      (window as any).notify("Para acessar essa funcionalidade e começar a faturar, você precisa criar uma conta.", "error");
      router.push("/cadastro");
      return;
    }

    // Limpa a notificação ao entrar na tela
    if (route === "/sociedade") {
        const current = JSON.parse(localStorage.getItem('dito_societies') || '[]').length;
        localStorage.setItem('last_seen_societies', current.toString());
        setShowSocietyDot(false);
    }
    if (route === "/hall") {
        const current = JSON.parse(localStorage.getItem('dito_usuarios') || '[]').length;
        localStorage.setItem('last_seen_hall', current.toString());
        setShowHallDot(false);
    }

    router.push(route);
  };

  return (
    <div className="min-h-screen bg-white pb-32 font-sans">
      <Navbar />
      
      <main className="max-w-2xl mx-auto px-6 py-10 flex flex-col items-center">
        {/* Minimalist Balance Section */}
        <section className="w-full bg-white text-black p-6 mb-4 relative text-center border-b border-gray-50">
            <div className="flex flex-col items-center justify-center">
              <div className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full mb-4 border border-gray-100">
                <div className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                <span className="text-[8px] font-black uppercase tracking-widest text-black/60">Sincronia: Cloud Ativa</span>
              </div>
              <span className="text-[9px] font-black tracking-[0.2em] uppercase text-gray-300 mb-2">saldo total</span>
              <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl font-black tracking-tighter">
                {showBalance ? (isGuestMode ? formatCurrency(0) : formatCurrency(balance)) : "••••••••"}
              </div>
              <button 
                onClick={() => setShowBalance(!showBalance)} 
                className="text-black hover:opacity-70 transition-all font-bold"
              >
                {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>
        </section>

        <header className="mb-10 w-full px-2 flex justify-between items-center">
          <p className="text-gray-400 font-extrabold text-lg tracking-tight">Oii, <span className="text-black">{isGuestMode ? "Convidado" : userName}</span></p>
          <div className="text-[9px] font-black uppercase tracking-widest text-[#22c55e]">
            ● Online ({networkUsersCount} elite)
          </div>
        </header>

        {/* PREMIUM BANNER ANIMADO */}
        <section className="w-full px-6 mb-8">
            <div className="w-full bg-gradient-to-br from-[#000] via-[#111] to-[#000] rounded-[2.5rem] p-8 relative overflow-hidden group border border-white/5 shadow-2xl">
                {/* Glow decorativo */}
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#ff005c] rounded-full blur-[100px] opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#0094ff] rounded-full blur-[100px] opacity-20 animate-pulse delay-700"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="bg-white/10 backdrop-blur-md text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">
                            Elite Network
                        </span>
                    </div>
                    <h2 className="text-3xl font-black text-white italic tracking-tighter leading-none mb-2">
                        Acelere suas <br/> <span className="bg-gradient-to-r from-[#ff0045] to-[#0094ff] bg-clip-text text-transparent">Vendas hoje.</span>
                    </h2>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-6">
                        +1.4k infoprodutores online agora
                    </p>
                    <button className="h-12 bg-white text-black px-8 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5">
                        Ver Estratégias
                    </button>
                </div>
                
                {/* Gráfico decorativo de fundo */}
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                    <TrendingUp size={180} className="text-white -rotate-12 translate-x-10 translate-y-10" />
                </div>
            </div>
        </section>

        <section className="w-full overflow-x-auto no-scrollbar flex gap-8 px-8 pb-10 cursor-grab active:cursor-grabbing snap-x snap-mandatory scroll-smooth relative">
            <div className="shrink-0 w-[42px]" aria-hidden="true" />
            
            <div onClick={() => setIsCreateModalOpen(true)} className="flex flex-col items-center gap-3 shrink-0 snap-start group cursor-pointer">
              <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                <Plus size={22} />
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight">Criar</span>
            </div>

          <div onClick={() => handleAction("/vendas")} className="flex flex-col items-center gap-3 shrink-0 snap-start group cursor-pointer">
            <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
              <BarChart3 size={22} />
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight">Vendas</span>
          </div>

          <div onClick={() => handleAction("/sociedade")} className="flex flex-col items-center gap-3 shrink-0 snap-start group cursor-pointer">
            <div className="w-14 h-14 bg-white/50 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all relative">
              <Users size={22} />
              {showSocietyDot && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>}
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight">Sociedade</span>
          </div>

          <div onClick={() => handleAction("/hall")} className="flex flex-col items-center gap-3 shrink-0 snap-start group cursor-pointer">
            <div className="w-14 h-14 bg-white/50 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all relative">
              <Star size={22} />
              {showHallDot && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>}
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight">Hall</span>
          </div>

          <div onClick={() => handleAction("/produtos")} className="flex flex-col items-center gap-3 shrink-0 snap-start group cursor-pointer">
            <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
              <Package size={22} />
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight">Vitrine</span>
          </div>

          <div className="shrink-0 w-[42px]" aria-hidden="true" />
        </section>
        
        {/* EVENTOS DITO (FAIXA ULTRA SLIM - SINCRONIZADO) */}
        <div className="w-full mb-12">
          <h3 className="text-base font-black px-8 mb-4 tracking-tight">Eventos</h3>
          
          <div className="flex gap-0 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth">
            {/* EVENTO RELÂMPAGO */}
            <div className="min-w-[81%] w-[81%] flex-shrink-0 bg-gradient-to-br from-[#ff0045] to-[#ef4444] p-6 text-white snap-center flex flex-col justify-center min-h-[100px]">
              <h4 className="text-base font-black leading-tight mb-3 uppercase tracking-tight">Missão Veloz: 1 Venda em 1h</h4>
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold opacity-90">Ganhe +150 Cupons</p>
                <button className="bg-white text-[#ef4444] px-5 py-2 rounded-full text-[10px] font-black uppercase shadow-lg">PARTICIPAR</button>
              </div>
            </div>

            {/* EVENTO DO DIA */}
            <div className="min-w-[81%] w-[81%] flex-shrink-0 bg-gradient-to-br from-[#0094ff] to-[#0ea5e9] p-6 text-white snap-center flex flex-col justify-center min-h-[100px]">
              <h4 className="text-base font-black leading-tight mb-3 uppercase tracking-tight">Missão Especialista: 5 Vendas Hoje</h4>
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold opacity-90">Ganhe +500 Cupons</p>
                <button className="bg-white text-[#0094ff] px-5 py-2 rounded-full text-[10px] font-black uppercase shadow-lg">PARTICIPAR</button>
              </div>
            </div>

            {/* EVENTO DA SEMANA */}
            <div className="min-w-[81%] w-[81%] flex-shrink-0 bg-gradient-to-br from-[#ffd600] to-[#ffaa00] p-6 text-white snap-center flex flex-col justify-center min-h-[100px]">
              <h4 className="text-base font-black leading-tight mb-3 uppercase tracking-tight">Rei da Rede: 3 Indicações</h4>
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold opacity-90">Ganhe +750 Cupons</p>
                <button className="bg-white text-[#ffd600] px-5 py-2 rounded-full text-[10px] font-black uppercase shadow-lg">PARTICIPAR</button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-50 flex justify-center w-full">
          <div 
            onClick={() => (window as any).installPWA?.()}
            className="flex items-center gap-2 text-gray-300 hover:text-black transition-colors font-bold text-xs cursor-pointer"
          >
            <TrendingUp size={14} className="rotate-90" />
            Baixar App Dito
          </div>
        </div>
      </main>

      <BottomNav />
      <CreateProductModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
}
