"use client";

import React, { useState, useEffect } from "react";
import { 
  Star, 
  CheckCircle2, 
  PlayCircle, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Lock
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function PublicSalesPage({ params }: { params: { slug: string } }) {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPage();
  }, [params.slug]);

  const fetchPage = async () => {
    try {
      const { supabase } = await import("@/lib/supabase");
      const { data, error } = await supabase
        .from('dito_sales_pages')
        .select('*, product:dito_market_products(*)')
        .eq('slug', params.slug)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setError("Página não encontrada.");
      } else {
        setPageData(data);
      }
    } catch (err) {
      console.error("Erro ao carregar página:", err);
      setError("Ocorreu um erro ao carregar a página.");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black italic uppercase text-[10px] tracking-widest text-gray-300">Carregando Oferta...</p>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-black italic mb-4">Ops!</h1>
        <p className="text-gray-500 font-bold mb-8">{error || "Esta página não existe mais."}</p>
        <button onClick={() => window.location.href = '/mercado'} className="bg-black text-white px-8 py-4 rounded-full font-black uppercase text-xs">
          Voltar para o Mercado
        </button>
      </div>
    );
  }

  const blocks = pageData.config || [];

  return (
    <div className="min-h-screen bg-white text-black selection:bg-[#FFBA09] selection:text-black">
      {/* Dynamic Blocks */}
      <main className="max-w-xl mx-auto">
        {blocks.map((block: any, index: number) => (
          <section key={block.id || index} className="py-12 px-6">
            {block.type === "hero" && (
              <div className="text-center space-y-8 animate-in fade-in slide-in-from-top-8 duration-1000">
                <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Oferta Especial Ativa</span>
                </div>
                <h1 className="text-5xl font-black italic leading-[0.95] tracking-tighter">
                    {block.content.title}
                </h1>
                <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-[90%] mx-auto">
                    {block.content.subtitle}
                </p>
                <div className="pt-4">
                    <button className="w-full bg-black text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                        {block.content.cta} <ArrowRight size={18} />
                    </button>
                </div>
              </div>
            )}

            {block.type === "features" && (
              <div className="space-y-8 animate-in fade-in duration-1000 delay-300">
                <h3 className="text-2xl font-black italic uppercase text-center tracking-tighter">{block.content.title}</h3>
                <div className="grid gap-4">
                  {block.content.items.map((item: string, i: number) => (
                    <div key={i} className="flex items-center gap-4 bg-gray-50 p-6 rounded-[2rem] border border-gray-100 group hover:bg-black hover:text-white transition-all">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm group-hover:bg-white/10 transition-colors">
                        <CheckCircle2 size={20} className="text-green-500" />
                      </div>
                      <span className="font-bold text-base leading-tight">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {block.type === "video" && (
              <div className="animate-in zoom-in-95 duration-1000 delay-500">
                <div className="aspect-video bg-black rounded-[2.5rem] flex items-center justify-center relative overflow-hidden group cursor-pointer shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent z-10"></div>
                    <PlayCircle size={80} className="text-white z-20 group-hover:scale-110 transition-transform" />
                    <div className="absolute bottom-8 left-8 z-20">
                        <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Preview do Conteúdo</p>
                        <p className="text-white font-black italic">{block.content.title || "ASSISTA AGORA"}</p>
                    </div>
                </div>
              </div>
            )}

            {block.type === "testimonials" && (
              <div className="bg-black text-white p-10 rounded-[3rem] space-y-6 relative overflow-hidden shadow-2xl">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FFBA09] rounded-full blur-[80px] opacity-20"></div>
                <div className="flex gap-1 text-[#FFBA09]">
                    {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                </div>
                <p className="text-xl font-medium italic leading-relaxed">
                    "{block.content.text}"
                </p>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full border border-white/10"></div>
                    <div>
                        <p className="font-black text-sm uppercase tracking-tight">{block.content.name}</p>
                        <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">{block.content.role}</p>
                    </div>
                </div>
              </div>
            )}

            {block.type === "cta" && (
              <div className="text-center space-y-10 py-12">
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Investimento Único</p>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl font-bold text-gray-300 line-through">R$ {parseFloat(block.content.price) * 2}</span>
                        <h2 className="text-6xl font-black italic tracking-tighter">R$ {block.content.price}</h2>
                    </div>
                </div>

                <div className="space-y-6">
                    <button className="w-full bg-[#FFBA09] text-black py-7 rounded-[2.5rem] font-black uppercase tracking-widest text-lg shadow-[0_20px_50px_rgba(255,186,9,0.3)] hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-3">
                        <Zap size={24} fill="black" /> {block.content.buttonText}
                    </button>
                    
                    <div className="flex flex-wrap justify-center gap-6">
                        <div className="flex items-center gap-2 text-gray-400">
                            <ShieldCheck size={16} />
                            <span className="text-[9px] font-black uppercase tracking-widest">Compra Segura</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <Smartphone size={16} />
                            <span className="text-[9px] font-black uppercase tracking-widest">Acesso Imediato</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <Lock size={16} />
                            <span className="text-[9px] font-black uppercase tracking-widest">7 Dias de Garantia</span>
                        </div>
                    </div>
                </div>
              </div>
            )}
          </section>
        ))}
      </main>

      {/* Footer Minimalista */}
      <footer className="py-20 px-6 border-t border-gray-50 text-center">
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] mb-4">Desenvolvido por Dito Network</p>
        <div className="flex justify-center gap-8 opacity-30 grayscale hover:grayscale-0 transition-all">
            <span className="font-black italic text-sm">Stripe</span>
            <span className="font-black italic text-sm">Pix</span>
            <span className="font-black italic text-sm">Seguro</span>
        </div>
      </footer>

      {/* Botão de Compra Fixo Mobile (Scroll Progress) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-[100] animate-in slide-in-from-bottom-20 duration-1000">
         <div className="bg-black/90 backdrop-blur-xl p-4 rounded-[2rem] border border-white/10 flex items-center justify-between shadow-2xl">
            <div className="pl-4">
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Por apenas</p>
                <p className="text-white font-black text-lg italic">R$ {blocks.find((b: any) => b.type === 'cta')?.content.price || "---"}</p>
            </div>
            <button className="bg-white text-black px-8 h-12 rounded-full font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all">
                Garantir Vaga
            </button>
         </div>
      </div>
    </div>
  );
}
