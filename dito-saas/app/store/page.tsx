"use client";

import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StorePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  
  const mockProducts = [
    { id: 1, name: "Ebook: O Futuro da Inteligência Artificial", price: 47.90, category: "Ebook", rating: 5, isBestSeller: true },
    { id: 2, name: "Mentoria Elite SaaS: Do Zero ao Primeiro Cliente", price: 997.00, category: "Mentoria", rating: 5, isBestSeller: true },
    { id: 3, name: "Dito CRM - Gestão de Vendas Automática", price: 29.90, category: "SaaS", rating: 4 },
    { id: 4, name: "Curso Master: Design para Micro SaaS", price: 197.00, category: "Curso", rating: 5 },
    { id: 5, name: "Script VSL de Alta Conversão", price: 67.00, category: "Ebook", rating: 4 },
    { id: 6, name: "Planilha Financeira Automática para Produtores", price: 19.90, category: "Ebook", rating: 5 },
  ];

  const filteredProducts = mockProducts.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white pb-40">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 pt-10">
        {/* Shopee-style Header Bar */}
        <div className="flex flex-col gap-6 mb-12">
            <h1 className="text-4xl font-black tracking-tight lowercase text-center sm:text-left">loja dito 🛍️</h1>
            
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Pesquisar nos produtos..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-16 pl-14 pr-6 bg-gray-50 border border-transparent focus:border-gray-100 rounded-full focus:outline-none focus:bg-white transition-all text-sm font-bold"
                    />
                </div>
                <button className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all">
                    <SlidersHorizontal size={20} />
                </button>
            </div>

        </div>

        {/* Lives Carousel (Stories Style) */}
        {filteredProducts.filter(p => p.category === "Mentoria").length > 0 && (
            <div className="mb-10">
                <div className="flex justify-between items-center mb-4 pl-1">
                    <h3 className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                        AO VIVO AGORA
                    </h3>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                    {filteredProducts.filter(p => p.category === "Mentoria").map(live => (
                        <div key={`live-${live.id}`} className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0 w-[72px]" onClick={() => router.push(`/live/${live.id}`)}>
                            <div className="w-[72px] h-[72px] rounded-full p-1 bg-gradient-to-tr from-[#ff005c] to-[#ff3366] shadow-[0_4px_15px_rgba(255,0,92,0.3)] relative">
                                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-[#ff005c] text-white text-[8px] font-black px-1.5 py-0.5 rounded-md border-2 border-white z-10 tracking-widest text-center whitespace-nowrap">AO VIVO</div>
                                <div className="w-full h-full bg-white rounded-full border-2 border-white flex items-center justify-center overflow-hidden">
                                     <b className="text-2xl text-[#ff005c]">{live.name.charAt(0)}</b>
                                </div>
                            </div>
                            <span className="text-[9px] font-black text-white text-center line-clamp-2 leading-[1.2] w-full mt-1.5">{live.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Quick Filters */}
        <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar mb-8">
            {["Todos", "Ebooks", "Cursos", "Mentorias", "SaaS"].map((filter) => (
                <button key={filter} className="whitespace-nowrap px-6 py-3 rounded-full bg-gray-50 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                    {filter}
                </button>
            ))}
        </div>



        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
            ))}
        </div>

        {filteredProducts.length === 0 && (
            <div className="text-center py-20">
                <p className="text-gray-400 font-bold lowercase">nenhum produto encontrado para sua busca.</p>
            </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
