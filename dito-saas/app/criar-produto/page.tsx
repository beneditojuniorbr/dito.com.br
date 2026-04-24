"use client";

import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { ArrowLeft, BookOpen, PlayCircle, Users, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function CriarProdutoPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    date: "",
    sales_link: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !formData.name || !formData.price) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Pega o usuário logado do localStorage
    const userStr = localStorage.getItem('dito_user_data') || localStorage.getItem('user');
    const currentUser = userStr ? JSON.parse(userStr) : null;
    const authorName = currentUser?.username || "Ditão";

    const newProd = {
      id: 'p-' + Date.now(),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      type: selectedType,
      sales_link: formData.sales_link,
      createdAt: Date.now(),
      author: authorName,
      seller: authorName, // Agora o vendedor é o usuário que criou o produto!
      showInMarket: true
    };

    try {
      // 1. Salva no Supabase (se disponível)
      const { data, error } = await supabase.from('dito_products').insert([newProd]);
      
      // 2. Salva localmente para persistência imediata
      const local = JSON.parse(localStorage.getItem('dito_products') || '[]');
      local.unshift(newProd);
      localStorage.setItem('dito_products', JSON.stringify(local));

      alert(`Sucesso! Seu produto "${formData.name}" ja esta no mercado.`);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar produto.");
    }
  };

  const types = [
    { id: "Ebook", icon: BookOpen, label: "Ebook" },
    { id: "Curso", icon: PlayCircle, label: "Curso" },
    { id: "Mentoria", icon: Users, label: "Mentoria" },
  ];

  return (
    <div className="min-h-screen bg-white pb-40">
      <Navbar />
      
      <main className="max-w-2xl mx-auto px-6 pt-6">
        <button 
          onClick={() => router.push("/dashboard")} 
          className="mb-10 text-black hover:scale-110 active:scale-90 transition-all"
        >
          <ArrowLeft size={32} />
        </button>

        <header className="text-center mb-16">
            <h1 className="text-4xl font-black tracking-tight mb-4 italic">Criar produto</h1>
        </header>

        <section className="flex justify-center gap-12 mb-20">
          {types.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;
            
            return (
              <div key={type.id} className="flex flex-col items-center gap-4">
                <button
                  onClick={() => setSelectedType(type.id)}
                  className={cn(
                    "w-24 h-24 rounded-full border-2 transition-all flex items-center justify-center shadow-sm",
                    isSelected 
                      ? "border-black bg-black text-white scale-110 shadow-2xl" 
                      : "border-gray-50 bg-gray-50 text-gray-300 hover:border-black hover:text-black hover:bg-white"
                  )}
                >
                  <Icon size={32} />
                </button>
                <span className={cn(
                  "text-[11px] font-black uppercase tracking-widest transition-colors",
                  isSelected ? "text-black" : "text-gray-300"
                )}>
                  {type.label}
                </span>
              </div>
            );
          })}
        </section>

        {selectedType && (
          <form onSubmit={handleSubmit} className="space-y-8 animate-in slide-in-from-bottom-8 duration-700 max-w-lg mx-auto bg-gray-50 p-10 rounded-[3rem] border border-gray-100">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Nome do Produto</label>
              <input 
                type="text" 
                placeholder="Como se chama seu produto?"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white border-2 border-transparent rounded-[2rem] py-5 px-8 font-bold text-base focus:border-black outline-none transition-all shadow-sm"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Descrição curta</label>
              <input 
                type="text" 
                placeholder="Resuma em poucas palavras..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-white border-2 border-transparent rounded-[2rem] py-5 px-8 font-bold text-base focus:border-black outline-none transition-all shadow-sm"
              />
            </div>

            {selectedType === "Ebook" && (
              <div className="space-y-3 animate-in fade-in duration-500">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Upload do Ebook (PDF)</label>
                <div className="relative w-full p-8 border-2 border-dashed border-gray-200 rounded-[2rem] text-center bg-white group hover:border-black transition-all">
                  <BookOpen className="mx-auto mb-2 text-gray-300 group-hover:text-black transition-colors" />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Enviar PDF</p>
                  <input type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
            )}

            {selectedType === "Curso" && (
              <div className="space-y-3 animate-in fade-in duration-500">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Upload das Aulas (Vídeos)</label>
                <div className="relative w-full p-8 border-2 border-dashed border-gray-200 rounded-[2rem] text-center bg-white group hover:border-black transition-all">
                  <UploadCloud className="mx-auto mb-2 text-gray-300 group-hover:text-black transition-colors" />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selecionar Vídeos</p>
                  <input type="file" multiple accept="video/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
            )}

            {selectedType === "Mentoria" && (
              <div className="space-y-3 animate-in fade-in duration-500">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Link da Mentoria</label>
                <input 
                  type="url" 
                  placeholder="https://zoom.us/j/..."
                  className="w-full bg-white border-2 border-transparent rounded-[2rem] py-5 px-8 font-bold text-base focus:border-black outline-none transition-all shadow-sm"
                />
              </div>
            )}

            <div className="space-y-3 animate-in fade-in duration-500">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 italic">Link de Pagamento (Stripe/Pix)</label>
              <input 
                type="url" 
                placeholder="https://buy.stripe.com/..."
                value={formData.sales_link}
                onChange={(e) => setFormData({...formData, sales_link: e.target.value})}
                className="w-full bg-white/50 border-2 border-dashed border-gray-200 rounded-[2rem] py-5 px-8 font-bold text-base focus:border-black focus:bg-white outline-none transition-all shadow-sm italic text-gray-400 focus:text-black"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Preço sugerido (R$)</label>
              <input 
                type="number" 
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full bg-white border-2 border-transparent rounded-[2rem] py-5 px-8 font-bold text-lg focus:border-black outline-none transition-all shadow-sm"
              />
            </div>

            {selectedType === "Mentoria" && (
              <div className="space-y-3 animate-in fade-in duration-500">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Data da Mentoria ao Vivo</label>
                <input 
                  type="date" 
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-white border-2 border-transparent rounded-[2rem] py-5 px-8 font-bold text-base focus:border-black outline-none transition-all shadow-sm"
                />
              </div>
            )}

            <div className="flex gap-4 pt-6">
              <button 
                type="button"
                onClick={() => router.push("/dashboard")}
                className="flex-1 py-5 rounded-[2rem] border-2 border-gray-200 text-gray-400 font-black uppercase tracking-widest text-[11px] hover:border-black hover:text-black transition-all bg-white"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="flex-[2] bg-black text-white py-5 px-10 rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-2xl hover:scale-[1.05] active:scale-95 transition-transform"
              >
                Publicar Produto
              </button>
            </div>
          </form>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
