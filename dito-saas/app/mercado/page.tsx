"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { 
  Search, ShoppingCart, Flame, Star, 
  ArrowLeft, ChevronRight, Plus, Minus, ShoppingBag, RefreshCw
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function MercadoPage() {
  const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/test_placeholder';
  const [view, setView] = useState<'home' | 'product' | 'cart' | 'checkout'>('home');
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [rotation, setRotation] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { supabase } = await import("@/lib/supabase");
      
      // 1. Busca do Supabase (Nuvem)
      const { data: cloudProducts, error } = await supabase
        .from('dito_market_products')
        .select('*')
        .order('created_at', { ascending: false });

      // 2. Busca do Local (Cache)
      const realVanillaProducts = JSON.parse(localStorage.getItem('dito_products_vanilla') || '[]');
      
      let allProducts = cloudProducts || [];
      
      // Merge com locais que ainda não subiram
      realVanillaProducts.forEach((lp: any) => {
          if (!allProducts.find((mp: any) => mp.id === lp.id)) {
              allProducts.unshift(lp);
          }
      });

      // Inject Seed se vazio
      if (allProducts.length === 0) {
         allProducts = [
             { id: 'elite-1', name: 'Método Anti-Crise Módulos 1 a 4', type: 'Curso', price: '297.00', salesCount: 1420, visible: true },
             { id: 'elite-2', name: 'Pack Dito Premium Ebook', type: 'Ebook', price: '47.90', salesCount: 843, visible: true },
             { id: 'elite-3', name: 'Acesso Sala de Sinais', type: 'Dito', price: '19.90', salesCount: 3105, visible: true },
             { id: 'elite-4', name: 'Mentoria 1-on-1 Avançada', type: 'Mentoria', price: '997.00', salesCount: 22, visible: true }
         ];
      }

      setProducts(allProducts.filter((p: any) => p.visible !== false));
      
      // Realtime listener
      supabase.channel('market-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'dito_market_products' }, () => {
           fetchProducts();
        })
        .subscribe();

    } catch (e) {
      console.error("Erro ao carregar dados", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    const savedCart = localStorage.getItem('dito_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const addToCart = (product: any) => {
    const newCart = [...cart, { ...product, cartId: Date.now() }];
    setCart(newCart);
    localStorage.setItem('dito_cart', JSON.stringify(newCart));
  };

  const refreshMarket = () => {
    setIsRefreshing(true);
    setRotation(prev => prev + 180);
    setTimeout(() => {
      const realProducts = JSON.parse(localStorage.getItem('dito_products') || '[]');
      const realVanillaProducts = JSON.parse(localStorage.getItem('dito_products_vanilla') || '[]');
      const all = [...realProducts, ...realVanillaProducts].sort(() => Math.random() - 0.5);
      setProducts(all);
      setIsRefreshing(false);
    }, 1500);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black italic">DITO MERCADO...</div>;

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-32">
      <Navbar />
      <header className="sticky top-0 bg-white/80 backdrop-blur-xl z-50 px-6 py-6 border-b border-gray-100">
         <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type="text" 
                placeholder="o que está buscando hoje?"
                className="w-full h-12 bg-gray-50 text-black rounded-2xl pl-12 pr-4 text-xs font-bold border-none outline-none focus:ring-2 focus:ring-black transition-all font-black"
              />
            </div>
            <button onClick={refreshMarket} className="w-10 h-10 text-black flex items-center justify-center transition-all overflow-hidden">
               <RefreshCw 
                 size={18} 
                 className="transition-transform duration-[1500ms]" 
                 style={{ transform: `rotate(${rotation}deg)` }}
               />
            </button>
            <button onClick={() => setView('cart')} className="w-10 h-10 text-black flex items-center justify-center relative">
               <ShoppingCart size={20} />
               {cart.length > 0 && <span className="absolute top-0 right-0 bg-red-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black border-2 border-white">{cart.length}</span>}
            </button>
         </div>
      </header>

      <main className={`max-w-2xl mx-auto py-8 transition-opacity duration-[1500ms] ${isRefreshing ? 'opacity-20' : 'opacity-100'}`}>
        {view === 'home' && (
          <div className="px-[9px]">
            {/* Seção de Ebooks com Scroll Horizontal */}
            {products.filter(p => p.type === 'Ebook').length > 0 && (
              <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-black text-black/90 uppercase tracking-widest italic">Destaque para você</h3>
                  <span className="text-[10px] text-black/40 font-bold uppercase italic">deslize para ver mais →</span>
                </div>
                <div className="flex overflow-x-auto gap-3 pb-4 hide-scrollbar snap-x">
                  {products.filter(p => p.type === 'Ebook').map(p => (
                    <div 
                      key={`h-${p.id}`} 
                      onClick={() => { setSelectedProduct(p); setView('product'); }}
                      className="min-w-[130px] max-w-[130px] bg-white rounded-[2rem] p-3 border border-gray-100 snap-center transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-black/5"
                    >
                      <div className="aspect-square bg-gray-50 rounded-2xl mb-2 flex items-center justify-center relative overflow-hidden">
                        <ShoppingBag className="gradient-icon" size={20} />
                      </div>
                      <h4 className="text-[10px] font-black text-black leading-tight mb-2 line-clamp-2">{p.name}</h4>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-black italic">R$ {parseFloat(p.price).toFixed(2)}</span>
                        <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center">
                          <Plus size={12} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h3 className="text-sm font-black text-black/90 uppercase tracking-widest italic mb-6">todos os produtos!</h3>
            
            {products.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
                    <p className="text-gray-400 font-bold text-sm">Nenhum produto publicado no mercado ainda.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 pb-12">
                    {products.map(p => (
                      <div key={p.id} onClick={() => { setSelectedProduct(p); setView('product'); }} className="cursor-pointer">
                         <div className="aspect-square bg-white rounded-[2rem] mb-3 flex items-center justify-center border border-gray-100 relative group overflow-hidden shadow-lg shadow-black/5">
                            <ShoppingBag className="gradient-icon opacity-30" size={40} />
                            <div className="absolute top-4 left-4 bg-[#ffd600] w-2 h-2 rounded-full"></div>
                            <div className="absolute top-4 right-4 bg-black/5 backdrop-blur-sm px-3 py-1 rounded-full">
                                <span className="text-[8px] font-black uppercase tracking-widest text-black">{p.type}</span>
                            </div>
                         </div>
                         <h4 className="text-[11px] font-black lowercase truncate text-black">{p.name}</h4>
                         <div className="flex items-center gap-1 mb-2">
                             <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">
                                 {p.salesCount || 0} unidades vendidas
                             </span>
                         </div>
                         <div className="flex justify-between items-center">
                            <span className="font-black text-[15px] text-black italic">{formatCurrency(parseFloat(p.price))}</span>
                            <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} className="w-8 h-8 bg-black text-white rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg">
                              <Plus size={16} />
                            </button>
                         </div>
                      </div>
                    ))}
                </div>
            )}
          </div>
        )}

        {view === 'product' && selectedProduct && (
          <div className="px-6 animate-in slide-in-from-bottom duration-500">
             <div className="aspect-square bg-gray-50 rounded-[3rem] mb-8 flex items-center justify-center mt-4">
                <ShoppingBag className="text-gray-200" size={100} />
             </div>
             <h1 className="text-3xl font-black tracking-tighter lowercase mb-2">{selectedProduct.name}</h1>
             <p className="text-red-600 font-black text-2xl mb-6">{formatCurrency(selectedProduct.price)}</p>
             <p className="text-gray-500 font-medium mb-10 leading-relaxed">{selectedProduct.description}</p>
             <button onClick={() => addToCart(selectedProduct)} className="w-full h-16 bg-black text-white rounded-full font-black text-sm uppercase tracking-tighter">comprar agora</button>
          </div>
        )}

         {view === 'cart' && (
           <div className="px-6">
              <h1 className="text-3xl font-black tracking-tighter lowercase mb-10 text-white">seu carrinho</h1>
              {cart.length === 0 ? (
                <div className="text-center py-20 bg-white/10 backdrop-blur-md rounded-[2.5rem] text-white/50 font-bold border border-white/10">Seu carrinho está vazio</div>
              ) : (
                <div className="space-y-4">
                   {cart.map((item, idx) => (
                     <div key={idx} className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-white">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center"><ShoppingBag size={20} className="text-white/20" /></div>
                        <div className="flex-1">
                           <p className="text-[10px] font-black lowercase opacity-60">{item.name}</p>
                           <p className="text-sm font-black">{formatCurrency(item.price)}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.cartId)} className="text-white/30 hover:text-white">
                           <Plus style={{ transform: 'rotate(45deg)' }} size={20} />
                        </button>
                     </div>
                   ))}
                   <div className="mt-12 bg-white text-black p-8 rounded-[2.5rem] shadow-2xl">
                      <div className="flex justify-between items-center mb-6">
                         <span className="opacity-60 font-bold text-sm">Total</span>
                         <span className="text-2xl font-black">{formatCurrency(cart.reduce((a, b) => a + b.price, 0))}</span>
                      </div>
                      <button onClick={() => setView('checkout')} className="w-full h-14 bg-black text-white rounded-full font-black text-xs uppercase tracking-tighter hover:scale-105 active:scale-95 transition-all">finalizar compra</button>
                   </div>
                </div>
              )}
           </div>
         )}

          {view === 'checkout' && (() => {
            const productWithLink = cart.find(p => p.sales_link);
            const activeLink = productWithLink ? productWithLink.sales_link : STRIPE_PAYMENT_LINK;
            
            return (
              <div className="px-6 animate-in fade-in slide-in-from-bottom duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => setView('cart')} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white">
                    <ArrowLeft size={18} />
                  </button>
                  <h1 className="text-2xl font-black text-white italic tracking-tighter">Checkout Seguro</h1>
                </div>

                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-8 mb-6">
                  <div className="text-center mb-8">
                    <div className="w-48 h-48 bg-white rounded-3xl mx-auto mb-6 flex items-center justify-center p-4 shadow-2xl">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(activeLink)}`} 
                        alt="QR Code Stripe"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h3 className="text-white font-black text-lg mb-2 italic">Escaneie para Pagar</h3>
                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                      {productWithLink ? `Você está adquirindo "${productWithLink.name}".` : 'Utilize o link de pagamento real da Stripe para processar sua aquisição.'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(activeLink);
                        alert('Link de pagamento copiado!');
                      }}
                      className="w-full h-14 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
                    >
                      <Plus size={14} className="rotate-45" /> Copiar Link de Pagamento
                    </button>
                    
                    <a 
                      href={activeLink} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-14 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all"
                    >
                      Pagar Real Agora <ChevronRight size={14} />
                    </a>
                  </div>
                </div>

                <div className="bg-black/40 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                    <div className="flex justify-between items-center text-white">
                      <div>
                        <p className="text-[10px] font-black opacity-50 uppercase italic mb-1">Total a Pagar</p>
                        <p className="text-2xl font-black italic">{formatCurrency(cart.reduce((a, b) => a + Number(b.price), 0))}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-green-400 uppercase italic">Acesso Imediato</p>
                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-tighter">Após confirmação</p>
                      </div>
                    </div>
                </div>
              </div>
            );
          })()}
      </main>

      <BottomNav />
    </div>
  );
}
