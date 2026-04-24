import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { Link as LinkIcon, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LinksPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white pb-32">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-6 transition-all">
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
          <LinkIcon size={48} className="mx-auto mb-4 text-gray-200" />
          <h2 className="text-3xl font-extrabold tracking-tight">links de venda</h2>
          <p className="text-gray-400 font-medium">copie e compartilhe seus links para vender mais.</p>
        </header>

        <section className="space-y-4">
          <div className="p-8 bg-black text-white rounded-[2.5rem] flex items-center justify-between group overflow-hidden relative">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Checkout Mestre</span>
              <span className="text-sm font-bold truncate max-w-[200px]">dito.app/p/mentoria-elite</span>
            </div>
            <button 
              onClick={() => (window as any).notify?.("Link copiado com sucesso! 💳", "success")}
              className="bg-white text-black px-6 py-3 rounded-full text-xs font-black hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              copiar
            </button>
          </div>

          <div className="p-8 bg-gray-50 border border-gray-100 rounded-[2.5rem] flex items-center justify-between group overflow-hidden relative">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Página do Produto</span>
              <span className="text-sm font-bold text-black truncate max-w-[200px]">dito.app/m/mentoria-elite</span>
            </div>
            <button 
              onClick={() => (window as any).notify?.("Link da página copiado!", "success")}
              className="bg-black text-white px-6 py-3 rounded-full text-xs font-black hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              copiar
            </button>
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
