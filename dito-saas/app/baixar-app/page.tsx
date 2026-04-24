"use client";

import React from "react";
import { ArrowLeft, Download, Smartphone, Layout, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DownloadAppPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Header Fixo */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md z-50 flex items-center px-6 border-b border-gray-50">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="flex-1 text-center font-black tracking-tighter text-xl mr-10">Baixar Dito</h1>
      </header>

      <main className="max-w-md mx-auto pt-32 px-8 pb-20">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-24 h-24 bg-gradient-to-br from-[#ff005c] to-[#0487ff] rounded-[2.5rem] shadow-2xl flex items-center justify-center mb-8 rotate-3">
             <span className="text-white text-4xl font-black">D</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter mb-4">Seu app pronto em segundos.</h2>
          <p className="text-gray-400 font-bold text-sm leading-relaxed px-4 mb-8">
            O Dito é um Progressive Web App (PWA), o que significa que ele roda direto no seu sistema sem ocupar espaço desnecessário.
          </p>

          <button 
            onClick={() => (window as any).installPWA?.()}
            className="bg-black text-white px-10 py-5 rounded-full font-black text-sm shadow-2xl hover:scale-105 transition-all flex items-center gap-3 active:scale-95 mb-4"
          >
            <Download size={20} />
            INSTALAR AUTOMATICAMENTE
          </button>
          
          <p className="text-[10px] text-gray-300 font-bold mb-10 px-6">
            Nota: A instalação automática requer que o site use HTTPS (cadeado de segurança).
          </p>
        </div>

        <div className="space-y-12">
          <div className="bg-gray-50 p-6 rounded-[2rem] border border-dashed border-gray-200 mb-10 text-center">
             <h4 className="font-black text-xs uppercase mb-2 tracking-widest text-black">Problemas com o botão acima?</h4>
             <p className="text-[11px] text-gray-500 font-bold leading-relaxed">
               Se a mensagem "Deseja instalar" não aparecer, basta clicar nos <span className="text-black">3 pontinhos</span> no topo do Chrome e escolher <span className="text-black">"Instalar Aplicativo"</span>.
             </p>
          </div>
          {/* iOS Section */}
          <section className="animate-in slide-in-from-bottom duration-500 delay-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center">
                <Smartphone size={20} className="text-gray-400" />
              </div>
              <h3 className="font-black text-lg tracking-tight">No iPhone (iOS)</h3>
            </div>
            <div className="space-y-4">
              <div className="group flex gap-4 items-start p-4 hover:bg-gray-50 rounded-[2rem] transition-colors">
                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-black shrink-0">1</span>
                <p className="text-[13px] font-bold leading-relaxed text-gray-500 group-hover:text-black">Abra este site no <span className="text-black">Safari</span>.</p>
              </div>
              <div className="group flex gap-4 items-start p-4 hover:bg-gray-50 rounded-[2rem] transition-colors">
                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-black shrink-0">2</span>
                <p className="text-[13px] font-bold leading-relaxed text-gray-500 group-hover:text-black">Toque no ícone de <span className="text-black inline-flex items-center">compartilhar <Download size={12} className="ml-1" /></span> abaixo.</p>
              </div>
              <div className="group flex gap-4 items-start p-4 hover:bg-gray-50 rounded-[2rem] transition-colors">
                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-black shrink-0">3</span>
                <p className="text-[13px] font-bold leading-relaxed text-gray-500 group-hover:text-black">Selecione <span className="text-black underline underline-offset-4">"Adicionar à Tela de Início"</span>.</p>
              </div>
            </div>
          </section>

          {/* Android Section */}
          <section className="animate-in slide-in-from-bottom duration-500 delay-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center">
                <Layout size={20} className="text-gray-400" />
              </div>
              <h3 className="font-black text-lg tracking-tight">No Android</h3>
            </div>
            <div className="space-y-4">
              <div className="group flex gap-4 items-start p-4 hover:bg-gray-50 rounded-[2rem] transition-colors">
                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-black shrink-0">1</span>
                <p className="text-[13px] font-bold leading-relaxed text-gray-500 group-hover:text-black">Toque nos <span className="text-black text-lg font-black mt-[-4px]">...</span> (três pontos) no canto superior.</p>
              </div>
              <div className="group flex gap-4 items-start p-4 hover:bg-gray-50 rounded-[2rem] transition-colors">
                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-black shrink-0">2</span>
                <p className="text-[13px] font-bold leading-relaxed text-gray-500 group-hover:text-black">Escolha <span className="text-black underline underline-offset-4">"Instalar Aplicativo"</span>.</p>
              </div>
            </div>
          </section>

          <footer className="pt-12 flex flex-col items-center">
             <div className="bg-green-50 text-green-500 px-6 py-3 rounded-full flex items-center gap-2 font-black text-xs">
                <CheckCircle size={14} />
                APP VERIFICADO E SEGURO
             </div>
             <p className="mt-4 text-[10px] text-gray-300 font-bold uppercase tracking-widest">Dito Ecosystem v1.0</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
