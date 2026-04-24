"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, MessageSquare, VideoOff, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function LiveRoomPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    // Simulação de busca do produto (em produção viria do Supabase)
    const mockProduct = {
      id: id,
      name: "Mentoria Elite SaaS",
      content_link: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Exemplo
      description: "Bem-vindo à transmissão exclusiva. Prepare suas perguntas!",
      seller: "Ditão",
    };
    setProduct(mockProduct);
  }, [id]);

  if (!product) return null;

  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between p-5 border-b border-gray-50">
        <button
          onClick={() => router.back()}
          className="w-11 h-11 bg-gray-50 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-center flex-1">
          <span className="text-[9px] font-black text-[#ff005c] uppercase tracking-[0.2em]">Audiência VIP</span>
          <h2 className="text-sm font-black text-black leading-tight">{product.name}</h2>
        </div>
        <div className="w-11"></div>
      </header>

      <main className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Player Container */}
        <div className="w-full aspect-video bg-black rounded-[2rem] overflow-hidden shadow-2xl mb-8 relative flex items-center justify-center">
            {product.content_link ? (
                <iframe
                    src={product.content_link}
                    className="w-full h-full border-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            ) : (
                <div className="text-center p-10">
                    <VideoOff size={48} className="mx-auto mb-4 text-gray-700 opacity-20" />
                    <p className="text-xs font-bold text-gray-500">Aguardando sinal do mentor...</p>
                </div>
            )}
            
            {/* Live Badge Overlay */}
            <div className="absolute top-4 left-4 bg-[#ff005c] text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-lg">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> AO VIVO
            </div>
        </div>

        <div className="px-2">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#ff005c] to-[#0487ff] flex items-center justify-center p-0.5">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-black text-[#ff005c]">D</div>
                </div>
                <div className="flex-1">
                    <p className="text-sm font-black text-black">{product.seller}</p>
                    <div className="flex items-center gap-2 text-green-500 font-bold text-[10px] uppercase">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span> 
                        Conexão Estável
                    </div>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                    <Users size={12} className="text-gray-400" />
                    <span className="text-[10px] font-black text-gray-500">124</span>
                </div>
            </div>

            <div className="bg-gray-50/50 p-6 rounded-[2rem] mb-10">
                <p className="text-xs leading-relaxed text-gray-600 font-bold italic">
                    {product.description}
                </p>
            </div>

            <button 
                onClick={() => (window as any).notify?.("Abrindo Chat da Live...", "default")}
                className="w-full h-16 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:scale-[0.98] transition-all"
            >
                <MessageSquare size={18} />
                Entrar no Chat da Live
            </button>
            <p className="text-center mt-6 text-[9px] font-bold text-gray-300 uppercase tracking-widest">Sinal Criptografado Dito VIP</p>
        </div>
      </main>
    </div>
  );
}
