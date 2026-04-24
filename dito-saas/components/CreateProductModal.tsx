"use client";

import { X, BookOpen, PlayCircle, Users, UploadCloud } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateProductModal({ isOpen, onClose }: CreateProductModalProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    date: "",
    showInMarket: true,
    salesCount: 0
  });

  if (!isOpen) return null;
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !formData.name || !formData.price) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    
    // Objeto do novo produto real
    const productId = "p-" + Date.now();
    const newProduct = {
      id: productId,
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      type: selectedType,
      salesCount: 0,
      seller: "Você",
      rating: 5.0,
      showInMarket: formData.showInMarket,
      createdAt: new Date().toISOString()
    };

    try {
      // 1. Busca o usuário real para o autor
      const userStr = localStorage.getItem('user_profile');
      const user = userStr ? JSON.parse(userStr) : null;
      const authorName = user?.username || "Ditão";

      // 2. Salva no banco de dados local (Cache)
      const existingProducts = JSON.parse(localStorage.getItem('dito_products_vanilla') || '[]');
      localStorage.setItem('dito_products_vanilla', JSON.stringify([newProduct, ...existingProducts]));

      // 3. SINCRONIZA COM SUPABASE (Nuvem)
      const { supabase } = await import("@/lib/supabase");
      const { error } = await supabase.from('dito_market_products').upsert({
          id: productId,
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          type: selectedType,
          visible: true,
          seller: authorName,
          author: authorName,
          created_at: new Date().toISOString()
      });

      if (error) throw error;

      alert(`Produto "${formData.name}" criado e sincronizado na nuvem!`);
      onClose();
      router.push('/mercado');
    } catch (err) {
      console.error("Erro ao sincronizar produto:", err);
      alert("Produto salvo localmente, mas houve erro ao subir para a nuvem.");
      onClose();
      router.push('/mercado');
    }
  };

  const types = [
    { id: "Ebook", icon: BookOpen, label: "Ebook" },
    { id: "Curso", icon: PlayCircle, label: "Curso" },
    { id: "Mentoria", icon: Users, label: "Mentoria" },
    { id: "App", icon: Package, label: "App", isSoon: true },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="w-full max-w-lg bg-white rounded-[3rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute right-8 top-8 w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-black italic tracking-tighter mb-8 text-center">Criar Produto</h2>

        <div className="flex justify-start gap-6 mb-10 overflow-x-auto no-scrollbar py-4 px-8 mr-[-2rem] ml-[-2rem]">
          {types.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;
            
            return (
              <div key={type.id} className="flex flex-col items-center gap-3 shrink-0 relative">
                {type.isSoon && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#ff0045] to-[#0094ff] text-white text-[7px] font-black py-1 px-3 rounded-full whitespace-nowrap shadow-lg z-10 uppercase">
                    Em breve
                  </div>
                )}
                <button
                  onClick={() => !type.isSoon && setSelectedType(type.id)}
                  style={{
                    background: isSelected 
                      ? "linear-gradient(#fff, #fff) padding-box, linear-gradient(90deg, #ff0045 0%, #0094ff 100%) border-box" 
                      : "#f9fafb",
                    borderColor: isSelected ? "transparent" : "#f9fafb",
                    borderWidth: "2px",
                    borderStyle: "solid"
                  }}
                  className={cn(
                    "w-20 h-20 rounded-full transition-all flex items-center justify-center",
                    isSelected 
                      ? "scale-110 shadow-lg shadow-gray-200 text-black" 
                      : (type.isSoon ? "text-gray-200 cursor-not-allowed" : "text-gray-400 hover:border-black hover:text-black")
                  )}
                >
                  <Icon size={28} />
                </button>
                <span className={cn(
                  "text-[10px] font-black tracking-widest transition-colors uppercase",
                  isSelected ? "text-black" : "text-gray-300"
                )}>
                  {type.label}
                </span>
              </div>
            );
          })}
        </div>

        {selectedType && (
          <form onSubmit={handleSubmit} className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 overflow-y-auto max-h-[60vh] px-2 no-scrollbar">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 ml-6 uppercase">
                {selectedType === "Ebook" ? "Nome do ebook:" : selectedType === "Curso" ? "Nome do curso:" : "Nome da mentoria:"}
              </label>
              <input 
                type="text" 
                placeholder=" "
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-gray-50 border-none rounded-full py-4 px-8 font-bold text-sm focus:ring-2 focus:ring-black outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 ml-6 uppercase">
                Descrição {selectedType === "Ebook" ? "do ebook:" : selectedType === "Curso" ? "do curso:" : "da mentoria:"}
              </label>
              <textarea 
                placeholder=" "
                maxLength={300}
                value={formData.description}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = '56px';
                  target.style.height = target.scrollHeight + 'px';
                }}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-gray-50 border-none rounded-[2rem] py-4 px-8 font-bold text-sm focus:ring-2 focus:ring-black outline-none transition-all min-h-[56px] resize-none overflow-hidden"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-500 ml-4">Preço sugerido: (R$)</label>
              <input 
                type="number" 
                placeholder="R$ 0,00"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full bg-gray-50 border-none rounded-full py-4 px-8 font-bold text-sm focus:ring-2 focus:ring-black outline-none transition-all"
              />
            </div>

            {selectedType === "Ebook" && (
              <div className="space-y-4 animate-in slide-in-from-left-4 duration-300 pt-2">
                <label className="text-[11px] font-bold text-gray-500 ml-4">Conteúdo do ebook: (PDF)</label>
                <div className="relative w-full p-10 border-2 border-dashed border-gray-200 hover:border-black rounded-[2rem] text-center bg-gray-50/50 group cursor-pointer transition-all">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <UploadCloud size={24} className="text-gray-300 group-hover:text-black transition-colors" />
                  </div>
                  <p className="text-[11px] font-black text-black">Clique para carregar o PDF</p>
                  <p className="text-[9px] text-gray-400 mt-1 font-bold">Máximo 50MB</p>
                  <input type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
            )}

            {selectedType === "Curso" && (
              <div className="space-y-4 animate-in slide-in-from-left-4 duration-300 pt-2">
                <label className="text-[11px] font-bold text-gray-500 ml-4">Aulas da formação: (Vídeos)</label>
                <div className="relative w-full p-10 border-2 border-dashed border-gray-200 hover:border-black rounded-[2rem] text-center bg-gray-50/50 group cursor-pointer transition-all">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <UploadCloud size={24} className="text-gray-300 group-hover:text-black transition-colors" />
                  </div>
                  <p className="text-[11px] font-black text-black">Selecionar módulos em vídeo</p>
                  <input type="file" multiple accept="video/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
            )}

            {selectedType === "Mentoria" && (
              <div className="space-y-8 animate-in slide-in-from-left-4 duration-300 pt-2">
                <div className="space-y-4">
                  <label className="text-[11px] font-bold text-gray-500 ml-4">Material de apoio: (Opcional)</label>
                  <div className="relative w-full p-10 border-2 border-dashed border-gray-200 hover:border-black rounded-[2rem] text-center bg-gray-50/50 group cursor-pointer transition-all">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                      <UploadCloud size={24} className="text-gray-300 group-hover:text-black transition-colors" />
                    </div>
                    <p className="text-[11px] font-black text-black">Carregar PDF de boas-vindas</p>
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-gray-500 ml-4">Data de início da mentoria:</label>
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Visibility Toggle */}
            <div className="flex items-center justify-between p-6 bg-gray-50/80 rounded-[2.5rem] border border-gray-100 mt-6 group hover:border-black transition-all">
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-black">Mostrar no Mercado?</span>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Visível para compradores</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.showInMarket} 
                  onChange={(e) => setFormData({...formData, showInMarket: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl border-2 border-gray-100 text-gray-400 font-black uppercase tracking-widest text-[10px] hover:border-black hover:text-black transition-all"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="flex-2 bg-black text-white py-4 px-8 rounded-full font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-[1.02] active:scale-95 transition-transform"
              >
                Adicionar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
