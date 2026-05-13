"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { 
  Package, 
  ArrowLeft, 
  Link as LinkIcon, 
  Edit3, 
  ExternalLink, 
  Trash2,
  Eye,
  RefreshCw
} from "lucide-react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";

export default function ProdutosPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    setLoading(true);
    try {
      const userStr = localStorage.getItem('user_profile') || localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const username = user?.username;

      if (!username) {
        setLoading(false);
        return;
      }

      // 1. Fetch from Supabase
      const { supabase } = await import("@/lib/supabase");
      const { data, error } = await supabase
        .from('dito_market_products')
        .select('*')
        .eq('author', username)
        .order('created_at', { ascending: false });

      // 2. Fallback to local cache if needed
      const localProducts = JSON.parse(localStorage.getItem('dito_products_vanilla') || '[]')
        .filter((p: any) => p.author === username || p.seller === "Você");

      let allProducts = data || [];
      
      // Merge unique
      localProducts.forEach((lp: any) => {
        if (!allProducts.find((ap: any) => ap.id === lp.id)) {
          allProducts.push(lp);
        }
      });

      setProducts(allProducts);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
    }
    setLoading(false);
  };

  const copyLink = (product: any) => {
    const link = `https://dito.com.br/p/${product.slug || product.id}`;
    navigator.clipboard.writeText(link);
    (window as any).notify?.("Link do produto copiado!", "success");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <RefreshCw className="animate-spin text-gray-200" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-6">
        <button 
          onClick={() => router.back()} 
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-black transition-all group font-bold text-sm"
        >
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
            <ArrowLeft size={16} />
          </div>
          voltar
        </button>

        <header className="mb-10 text-center">
          <Package size={48} className="mx-auto mb-4 text-gray-200" />
          <h2 className="text-3xl font-extrabold tracking-tight">meus produtos</h2>
          <p className="text-gray-400 font-medium">gerencie seus ebooks, cursos e mentorias.</p>
        </header>

        <section className="space-y-4">
          {products.length === 0 ? (
            <div className="p-12 border-2 border-dashed border-gray-100 rounded-[2.5rem] text-center bg-gray-50/50">
              <Package size={40} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400 text-sm font-bold lowercase">você ainda não criou nenhum produto.</p>
              <button 
                onClick={() => router.push('/dashboard?create=true')}
                className="mt-6 bg-black text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl"
              >
                Criar Primeiro Produto
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="p-6 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">{product.type}</span>
                        {!product.visible && <span className="text-[8px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full font-black uppercase">Oculto</span>}
                      </div>
                      <h3 className="text-lg font-black italic lowercase leading-tight">{product.name}</h3>
                      <p className="text-xl font-black text-black mt-1">{formatCurrency(product.price)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">{product.salesCount || 0} vendas</span>
                        <div className="flex gap-1">
                           {[1,2,3,4,5].map(s => <div key={s} className="w-1 h-1 rounded-full bg-gray-100"></div>)}
                        </div>
                    </div>
                  </div>

                  {/* Management Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-50">
                    <button 
                      onClick={() => copyLink(product)}
                      className="flex-1 min-w-[100px] h-11 bg-gray-50 hover:bg-black hover:text-white rounded-full flex items-center justify-center gap-2 transition-all group/btn"
                    >
                      <LinkIcon size={14} className="text-black group-hover/btn:text-white transition-colors" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Link</span>
                    </button>

                    <button 
                      onClick={() => (window as any).notify?.("Editor de produto em breve!", "info")}
                      className="flex-1 min-w-[100px] h-11 bg-gray-50 hover:bg-black hover:text-white rounded-full flex items-center justify-center gap-2 transition-all group/btn"
                    >
                      <Edit3 size={14} className="text-black group-hover/btn:text-white transition-colors" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Editar</span>
                    </button>

                    <button 
                      onClick={() => router.push(`/builder?product=${product.id}`)}
                      className="flex-1 min-w-[100px] h-11 bg-gray-50 hover:bg-black hover:text-white rounded-full flex items-center justify-center gap-2 transition-all group/btn"
                    >
                      <ExternalLink size={14} className="text-black group-hover/btn:text-white transition-colors" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Página</span>
                    </button>
                    
                    <button 
                      className="w-11 h-11 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                      onClick={() => (window as any).notify?.("Excluir em breve!", "error")}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
