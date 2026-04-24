import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { Wallet, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SacarPage() {
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
          <Wallet size={48} className="mx-auto mb-4 text-gray-200" />
          <h2 className="text-3xl font-extrabold tracking-tight">sacar saldo</h2>
          <p className="text-gray-400 font-medium">transfira seus ganhos para sua conta bancária.</p>
        </header>

        <div className="bg-gradient-to-r from-[#ff005c] to-[#0487ff] p-12 rounded-[3rem] mb-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl transition-all group-hover:bg-white/20"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-2 relative z-10">saldo disponível para saque</p>
            <h3 className="text-5xl font-black tracking-tighter relative z-10 group-hover:scale-105 transition-transform origin-left">R$ 12.450,00</h3>
        </div>

        <button className="w-full h-20 bg-black text-white rounded-full font-black text-lg hover:scale-[0.98] active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Wallet size={18} />
            </div>
            solicitar saque via pix
        </button>
      </main>
      <BottomNav />
    </div>
  );
}
