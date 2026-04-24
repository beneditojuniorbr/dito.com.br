"use client";

import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { Star, ArrowLeft, Crown, Timer, TrendingUp, Medal, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function HallOfFamePage() {
  const router = useRouter();
  const [daysLeft, setDaysLeft] = useState(24);

  const [rankings, setRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRankings() {
      const { supabase } = await import("@/lib/supabase");
      const { data: users, error } = await supabase
        .from('dito_users')
        .select('*')
        .order('sales', { ascending: false });

      if (users && !error) {
        setRankings(users.map((u, i) => ({
          ...u,
          pos: i + 1,
          name: u.name || u.username,
          sales: Number(u.sales || 0),
          growth: "↑ " + (Math.floor(Math.random() * 5) + 1) + "%" // Simulado
        })));
      }
      setLoading(false);
    }
    
    fetchRankings();
  }, []);

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center font-black">Conectando à Elite...</div>;
  if (!rankings.length) return <div className="min-h-screen bg-white flex items-center justify-center font-black">Nenhum competidor na rede.</div>;

  const firstPlace = rankings[0];
  const others = rankings.slice(1, 11); // Top 10 outros

  return (
    <div className="min-h-screen bg-white pb-40">
      <Navbar />
      
      <main className="max-w-2xl mx-auto px-6 pt-6">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-gray-400 hover:text-black transition-all group font-bold text-sm"
          >
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
              <ArrowLeft size={16} />
            </div>
            voltar
          </button>

          <button 
            onClick={() => router.push("/sociedade")}
            className="flex items-center gap-2 bg-gray-50 hover:bg-black text-gray-400 hover:text-white px-5 py-2 rounded-full transition-all group border border-transparent hover:border-black shadow-sm"
          >
            <Users size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Sociedades</span>
          </button>
        </div>

        {/* Space Monthly Reset Timer */}
        <div className="flex justify-center mb-10">
            <div className="inline-flex items-center gap-2 bg-black text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                <Timer size={14} className="animate-pulse" />
                Reseta em {daysLeft} dias
            </div>
        </div>

            {/* LEFT SIDE: Micro Spotlight */}
            <div className="md:sticky md:top-24 flex flex-col items-center text-center md:w-[30%] p-2 group">
                <div className="absolute -inset-4 bg-yellow-400/5 blur-[40px] rounded-full animate-pulse pointer-events-none"></div>
                
                <div className="relative">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-500 z-20">
                      <Crown size={32} className="fill-yellow-500" />
                    </div>
                    <div className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center relative z-10 border-4 border-white group-hover:scale-105 transition-transform duration-500 shadow-lg bg-gray-50">
                        {firstPlace.avatar ? (
                            <img src={firstPlace.avatar} alt={firstPlace.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <Star size={60} className="text-gray-200" />
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="mt-6 relative z-10">
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-yellow-600 mb-2 block">Mestre do Mês</span>
                    <h1 className="text-3xl font-black tracking-tighter mb-1 italic text-black leading-none">{firstPlace.name}</h1>
                    <div className="text-5xl font-black tracking-tighter text-black flex items-baseline justify-center gap-1">
                        <span className="text-2xl font-black opacity-30">R$</span>
                        {formatCurrency(firstPlace.sales).replace('R$', '').split(',')[0]}
                        <span className="text-xs opacity-20">,{formatCurrency(firstPlace.sales).split(',')[1]}</span>
                    </div>
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full font-black text-[9px] uppercase italic tracking-widest">
                        <TrendingUp size={10} />
                        {firstPlace.growth} este mês
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: Compact Elite List */}
            <div className="flex-1 w-full md:max-w-md bg-white p-2 mt-10">
                <div className="flex items-center gap-3 px-4 mb-4 border-b border-gray-50 pb-4">
                  <Medal size={16} className="text-gray-300" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Ranking da Elite</span>
                </div>
                
                <div className="space-y-1.5 max-h-[500px] overflow-y-auto no-scrollbar pr-2">
                  {rankings.slice(1, 10).map((user) => {
                    const isSilver = user.pos === 2;
                    const isBronze = user.pos === 3;
                    
                    return (
                      <a href={`/perfil/${user.name.toLowerCase().replace(/\s+/g, '-')}`} key={user.pos} className={cn(
                        "flex items-center justify-between p-2.5 rounded-2xl transition-all group cursor-pointer border",
                        isSilver ? "bg-gray-50/50 border-gray-100" : 
                        isBronze ? "bg-orange-50/20 border-orange-50" : 
                        "bg-white border-transparent hover:bg-gray-50"
                      )}>
                          <div className="flex items-center gap-3">
                              <span className={cn(
                                "text-xs font-black italic w-5 text-center",
                                isSilver ? "text-gray-400" : 
                                isBronze ? "text-orange-400" : 
                                "text-gray-200"
                              )}>
                                {user.pos}º
                              </span>
                              <div className={cn(
                                "w-8 h-8 rounded-full overflow-hidden shadow-sm border",
                                isSilver ? "border-gray-200" : isBronze ? "border-orange-200" : "border-white"
                              )}>
                                  {user.avatar ? (
                                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                  ) : (
                                      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                                          <Star size={10} className="text-gray-200" />
                                      </div>
                                  )}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[11px] font-black text-black leading-none mb-0.5 group-hover:underline">{user.name}</span>
                                <span className="text-[7px] font-bold uppercase text-gray-300">Elite</span>
                              </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[11px] font-black tabular-nums text-black block leading-none">
                              R$ {user.sales.toLocaleString()}
                            </span>
                          </div>
                      </a>
                    );
                  })}
                </div>

                {/* COMPACT USER POSITION */}
                <div className="mt-6 p-6 bg-black rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                 <Star size={16} className="text-white animate-pulse" />
                            </div>
                            <div>
                                <span className="text-white/40 text-[8px] font-black uppercase tracking-widest mb-0.5 block">Sua Posição</span>
                                <h4 className="text-white text-sm font-black italic">Você é o 42º</h4>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-green-400 text-xs font-black block">↑ 4 pos</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Global Competitor Call */}
        <div className="mt-16 p-10 bg-gray-50 rounded-[3rem] text-center border border-dashed border-gray-200">
            <p className="text-gray-400 text-xs font-bold leading-relaxed lowercase mb-6">
                todos os usuários registrados entram automaticamente na competição. <br/> suba de posição vendendo mais e conquiste o mestre do mês!
            </p>
            <div className="text-[10px] font-black uppercase tracking-widest text-black/40">
                Reseta em 24/04/2026
            </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
