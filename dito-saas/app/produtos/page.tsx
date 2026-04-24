"use client";

import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { Package, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProdutosPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white pb-32">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-6">
        {/* Intuitve Back Button */}
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
          <div className="p-8 border-2 border-dashed border-gray-100 rounded-[2.5rem] text-center">
            <p className="text-gray-400 text-sm font-bold lowercase">você ainda não criou nenhum produto.</p>
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
