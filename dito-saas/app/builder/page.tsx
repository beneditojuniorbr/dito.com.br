"use client";

import React, { useState, useEffect, Suspense } from "react";
import { 
  Plus, 
  Type, 
  Image as ImageIcon, 
  PlayCircle, 
  Star, 
  CheckCircle2, 
  Save, 
  ArrowLeft,
  X,
  ChevronUp,
  ChevronDown,
  Trash2,
  ExternalLink,
  Zap,
  RefreshCw,
  Eye
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

type BlockType = "hero" | "features" | "testimonials" | "cta" | "video";

interface Block {
  id: string;
  type: BlockType;
  content: any;
}

function BuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");
  
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    if (productId) {
      loadPage();
    } else {
      setBlocks([
        {
          id: "1",
          type: "hero",
          content: {
            title: "Sua Oferta Irresistível Aqui",
            subtitle: "Explique como seu produto resolve o problema do seu cliente em poucos segundos.",
            cta: "Quero Começar Agora"
          }
        }
      ]);
    }
  }, [productId]);

  const loadPage = async () => {
    try {
      const { supabase } = await import("@/lib/supabase");
      const { data, error } = await supabase
        .from('dito_sales_pages')
        .select('*')
        .eq('product_id', productId)
        .maybeSingle();

      if (data) {
        setPageData(data);
        if (data.config) setBlocks(data.config);
      } else {
        const { data: prod } = await supabase
          .from('dito_market_products')
          .select('*')
          .eq('id', productId)
          .single();
        
        if (prod) {
          setBlocks([
            {
              id: "1",
              type: "hero",
              content: {
                title: prod.name,
                subtitle: prod.description || "Descrição do seu produto de elite.",
                cta: "Comprar Agora"
              }
            }
          ]);
        }
      }
    } catch (err) {
      console.error("Erro ao carregar página:", err);
    }
  };

  const handleSave = async () => {
    if (!productId) {
       (window as any).notify?.("ID do produto não encontrado.", "error");
       return;
    }

    setIsSaving(true);
    try {
      const { supabase } = await import("@/lib/supabase");
      const userStr = localStorage.getItem('user_profile') || localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      const payload = {
        author: user?.username || "Ditão",
        product_id: productId,
        slug: pageData?.slug || `page-${productId}-${Date.now()}`,
        title: blocks.find(b => b.type === 'hero')?.content.title || "Sales Page",
        config: blocks,
        updated_at: new Date().toISOString()
      };

      const { data: savedPage, error } = await supabase
        .from('dito_sales_pages')
        .upsert(payload, { onConflict: 'product_id' })
        .select()
        .single();

      if (error) throw error;

      setPageData(savedPage);
      (window as any).notify?.("Página de vendas salva com sucesso!", "success");
    } catch (err) {
      console.error("Erro ao salvar:", err);
      (window as any).notify?.("Erro ao salvar página.", "error");
    }
    setIsSaving(false);
  };

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type)
    };
    setBlocks([...blocks, newBlock]);
    setIsAddingBlock(false);
    setEditingBlock(newBlock.id);
  };

  const getDefaultContent = (type: BlockType) => {
    switch (type) {
      case "hero": return { title: "Novo Título", subtitle: "Nova Descrição", cta: "Comprar" };
      case "features": return { title: "O que você vai aprender", items: ["Benefício 1", "Benefício 2", "Benefício 3"] };
      case "testimonials": return { name: "Cliente Feliz", text: "Este produto mudou minha vida!", role: "Empreendedor" };
      case "video": return { url: "", title: "Assista ao Vídeo" };
      case "cta": return { price: "97,00", buttonText: "Garantir minha vaga" };
      default: return {};
    }
  };

  const updateBlockContent = (id: string, newContent: any) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content: { ...b.content, ...newContent } } : b));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
    if (editingBlock === id) setEditingBlock(null);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-black pb-32">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 flex items-center justify-between px-6">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-black italic text-lg uppercase tracking-tighter">Page Builder</h1>
        <div className="flex gap-2">
          {pageData?.slug && (
            <button 
              onClick={() => window.open(`/v/${pageData.slug}`, '_blank')}
              className="p-2 bg-gray-100 hover:bg-black hover:text-white rounded-full transition-colors"
              title="Ver Página Pública"
            >
              <Eye size={20} />
            </button>
          )}
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-black text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg active:scale-95 transition-transform disabled:opacity-50"
          >
            {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />} 
            {isSaving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </header>

      {/* Main Content / Preview Area */}
      <main className="pt-24 max-w-lg mx-auto px-4 space-y-6">
        <div className="text-center mb-8">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Preview Mobile</span>
        </div>

        <div className="space-y-4">
          {blocks.map((block, index) => (
            <div 
              key={block.id} 
              className={cn(
                "group relative bg-white rounded-[2.5rem] overflow-hidden border-2 transition-all duration-300",
                editingBlock === block.id ? "border-black shadow-2xl scale-[1.02]" : "border-transparent shadow-sm hover:border-gray-200"
              )}
              onClick={() => setEditingBlock(block.id)}
            >
              {/* Block Controls */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button onClick={(e) => { e.stopPropagation(); moveBlock(index, 'up'); }} className="p-2 bg-white/90 rounded-full shadow-sm hover:bg-black hover:text-white transition-colors">
                  <ChevronUp size={14} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); moveBlock(index, 'down'); }} className="p-2 bg-white/90 rounded-full shadow-sm hover:bg-black hover:text-white transition-colors">
                  <ChevronDown size={14} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }} className="p-2 bg-red-50 text-red-500 rounded-full shadow-sm hover:bg-red-500 hover:text-white transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Block Content Renderers */}
              <div className="p-8">
                {block.type === "hero" && (
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-black italic leading-tight">{block.content.title}</h2>
                    <p className="text-gray-500 font-medium leading-relaxed">{block.content.subtitle}</p>
                    <button className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl">
                      {block.content.cta}
                    </button>
                  </div>
                )}

                {block.type === "features" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-black italic uppercase text-center">{block.content.title}</h3>
                    <div className="space-y-3">
                      {block.content.items.map((item: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                          <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                          <span className="font-bold text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {block.type === "video" && (
                  <div className="space-y-4">
                    <div className="aspect-video bg-gray-100 rounded-3xl flex items-center justify-center border-2 border-dashed border-gray-200">
                      <PlayCircle size={48} className="text-gray-300" />
                    </div>
                    <p className="text-center font-black uppercase text-[10px] tracking-widest text-gray-400">{block.content.title || "VÍDEO DE VENDAS"}</p>
                  </div>
                )}

                {block.type === "testimonials" && (
                  <div className="bg-gray-50 p-6 rounded-3xl space-y-4 italic relative">
                    <div className="flex gap-1 text-yellow-500">
                        {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                    </div>
                    <p className="text-gray-700 font-medium leading-relaxed">"{block.content.text}"</p>
                    <div>
                        <p className="font-black text-sm not-italic uppercase">{block.content.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest not-italic">{block.content.role}</p>
                    </div>
                  </div>
                )}

                {block.type === "cta" && (
                  <div className="text-center space-y-6">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Investimento</p>
                        <p className="text-4xl font-black italic">R$ {block.content.price}</p>
                    </div>
                    <button className="w-full bg-[#ff751f] text-black py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2">
                      <Zap size={18} fill="black" /> {block.content.buttonText}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Block Placeholder */}
        <button 
          onClick={() => setIsAddingBlock(true)}
          className="w-full py-8 border-2 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-black hover:text-black transition-all bg-white/50"
        >
          <Plus size={32} />
          <span className="font-black uppercase text-[10px] tracking-widest">Adicionar Seção</span>
        </button>
      </main>

      {/* Bottom Sheet for Adding Blocks */}
      {isAddingBlock && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-end animate-in fade-in duration-300">
          <div className="w-full bg-white rounded-t-[3rem] p-8 pb-12 animate-in slide-in-from-bottom-full duration-500 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black italic uppercase">O que adicionar?</h3>
              <button onClick={() => setIsAddingBlock(false)} className="p-2 bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { type: "hero", icon: Type, label: "Cabeçalho" },
                { type: "video", icon: PlayCircle, label: "Vídeo/Imagem" },
                { type: "features", icon: CheckCircle2, label: "Benefícios" },
                { type: "testimonials", icon: Star, label: "Depoimentos" },
                { type: "cta", icon: Zap, label: "Checkout/Preço" },
              ].map((item) => (
                <button 
                  key={item.type}
                  onClick={() => addBlock(item.type as BlockType)}
                  className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-[2rem] hover:bg-black hover:text-white transition-all group"
                >
                  <item.icon size={32} className="text-gray-400 group-hover:text-white transition-colors" />
                  <span className="font-black uppercase text-[10px] tracking-widest">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Editing Overlay */}
      {editingBlock && (
        <div className="fixed inset-0 bg-white z-[110] flex flex-col animate-in slide-in-from-right duration-500 md:w-96 md:left-auto md:shadow-2xl">
          <header className="h-16 border-b flex items-center justify-between px-6">
            <h3 className="font-black italic uppercase text-sm">Editando Seção</h3>
            <button onClick={() => setEditingBlock(null)} className="p-2 bg-gray-100 rounded-full">
                <X size={20} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {blocks.find(b => b.id === editingBlock)?.type === "hero" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Título Principal</label>
                  <textarea 
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 font-bold focus:border-black outline-none transition-all"
                    value={blocks.find(b => b.id === editingBlock)?.content.title}
                    onChange={(e) => updateBlockContent(editingBlock, { title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Subtítulo</label>
                  <textarea 
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 font-medium text-sm focus:border-black outline-none transition-all"
                    value={blocks.find(b => b.id === editingBlock)?.content.subtitle}
                    onChange={(e) => updateBlockContent(editingBlock, { subtitle: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Texto do Botão</label>
                  <input 
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 font-black uppercase text-xs tracking-widest focus:border-black outline-none transition-all"
                    value={blocks.find(b => b.id === editingBlock)?.content.cta}
                    onChange={(e) => updateBlockContent(editingBlock, { cta: e.target.value })}
                  />
                </div>
              </div>
            )}

            {blocks.find(b => b.id === editingBlock)?.type === "cta" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Preço (R$)</label>
                  <input 
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 font-black text-xl focus:border-black outline-none transition-all"
                    value={blocks.find(b => b.id === editingBlock)?.content.price}
                    onChange={(e) => updateBlockContent(editingBlock, { price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Botão Final</label>
                  <input 
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 font-black uppercase text-xs tracking-widest focus:border-black outline-none transition-all"
                    value={blocks.find(b => b.id === editingBlock)?.content.buttonText}
                    onChange={(e) => updateBlockContent(editingBlock, { buttonText: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Default for other blocks */}
            {!["hero", "cta"].includes(blocks.find(b => b.id === editingBlock)?.type || "") && (
               <div className="text-center py-20 space-y-4">
                  <Zap size={48} className="mx-auto text-gray-200" />
                  <p className="font-black italic uppercase text-gray-400">Editor avançado em breve!</p>
               </div>
            )}
            
            <button 
              onClick={() => deleteBlock(editingBlock)}
              className="w-full flex items-center justify-center gap-2 py-4 text-red-500 font-black uppercase text-[10px] tracking-widest border-2 border-red-50 border-dashed rounded-2xl hover:bg-red-50 transition-all"
            >
              <Trash2 size={14} /> Excluir esta Seção
            </button>
          </div>

          <footer className="p-6 border-t">
            <button 
                onClick={() => setEditingBlock(null)}
                className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl"
            >
              Concluir Edição
            </button>
          </footer>
        </div>
      )}
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <RefreshCw className="animate-spin text-gray-200" size={32} />
      </div>
    }>
      <BuilderContent />
    </Suspense>
  );
}
