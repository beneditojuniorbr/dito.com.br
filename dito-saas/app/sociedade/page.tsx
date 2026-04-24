"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { Users, Plus, Search, ShieldCheck, Lock, Unlock, ArrowRight, X, HeartHandshake, Banknote } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Society {
  id: string;
  name: string;
  description: string;
  admin: string;
  entryFee: number;
  membersCount: number;
  totalContributions: number;
}

export default function SociedadePage() {
  const [societies, setSocieties] = useState<Society[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userContribution, setUserContribution] = useState(0);
  const [newSociety, setNewSociety] = useState({
    name: "",
    description: "",
    entryFee: "0"
  });

  useEffect(() => {
    const saved = localStorage.getItem('dito_societies');
    const contribution = parseFloat(localStorage.getItem('user_society_contribution') || '0');
    setUserContribution(contribution);

    if (saved) {
      setSocieties(JSON.parse(saved));
    } else {
      const initial = [
        { id: '1', name: "Elite Digital", description: "O maior ecossistema de produtores para networking de alto nível.", admin: "Benedito", entryFee: 0, membersCount: 154, totalContributions: 15450.00 },
        { id: '2', name: "Clube dos 6 Dígitos", description: "Focado em escala de anúncios e lançamentos milionários.", admin: "Ana Silva", entryFee: 49.90, membersCount: 42, totalContributions: 8900.00 }
      ];
      setSocieties(initial);
      localStorage.setItem('dito_societies', JSON.stringify(initial));
    }
  }, []);

  const STRIPE_LINK = "https://buy.stripe.com/seu_link_aqui"; // COLE SEU LINK AQUI

  const handleCreateSociety = (e: React.FormEvent) => {
    e.preventDefault();
    const balance = parseFloat(localStorage.getItem('dito_balance') || '0');
    const cost = 15.00;

    if (balance < cost) {
      (window as any).notify("Saldo insuficiente para pagar a taxa de R$ 15,00.", "error");
      return;
    }

    if (confirm(`Deseja criar a sociedade "${newSociety.name}"? Uma taxa de R$ 15,00 será descontada do seu saldo.`)) {
      // Deduzindo saldo
      const newBalance = balance - cost;
      localStorage.setItem('dito_balance', newBalance.toString());
      
      // Criando objeto
      const createdSociety: Society = {
        id: Date.now().toString(),
        name: newSociety.name,
        description: newSociety.description,
        admin: "Você",
        entryFee: parseFloat(newSociety.entryFee) || 0,
        membersCount: 1,
        totalContributions: 0
      };

      const updated = [...societies, createdSociety];
      setSocieties(updated);
      localStorage.setItem('dito_societies', JSON.stringify(updated));
      
      (window as any).notify("Sociedade criada com sucesso!", "success");
      setShowCreateModal(false);
      setNewSociety({ name: "", description: "", entryFee: "0" });
    }
  };

  const handleContribute = () => {
    if (confirm("Deseja realizar uma contribuição real para o fundo de sociedades via Stripe?")) {
      window.location.href = STRIPE_LINK; // Redireciona para o Stripe
    }
  };

  const handleRequestEntry = (societyName: string) => {
    (window as any).notify(`Solicitação enviada para o administrador de ${societyName}.`, "default");
  };

  const filtered = societies.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-white pb-32">
      <Navbar />
      
      <main className="max-w-xl mx-auto px-6 py-10">
        <header className="mb-10">
          <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3">
            <Users size={36} />
            Sociedade
          </h1>
          <p className="text-gray-400 font-bold text-sm mt-2">Junte-se a pessoas como você.</p>
          
          {/* Botões de Cápsula */}
          <div className="flex gap-3 mt-8">
            <button 
              onClick={() => setShowCreateModal(true)}
              className="w-full h-14 bg-black text-white rounded-full flex items-center justify-center gap-2 font-black text-xs uppercase tracking-tighter shadow-lg hover:scale-105 transition-all"
            >
              <Plus size={18} />
              Criar Sociedade
            </button>
          </div>
        </header>

        {/* Busca */}
        <div className="relative mb-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
          <input 
            type="text" 
            placeholder="buscar comunidades..."
            className="w-full h-16 bg-gray-50 rounded-3xl pl-14 pr-6 text-sm font-bold border-2 border-transparent focus:border-black transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Listagem */}
        <div className="grid gap-6">
          {filtered.map((s) => (
            <div key={s.id} className="p-8 bg-white border border-gray-100 rounded-[2.5rem] hover:shadow-2xl transition-all group relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-black lowercase flex items-center gap-2">
                    {s.name}
                    <ShieldCheck size={16} className="text-blue-500" />
                  </h3>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">ADM: {s.admin}</p>
                </div>
                <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase ${s.entryFee === 0 ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'}`}>
                  {s.entryFee === 0 ? 'Gratuita' : formatCurrency(s.entryFee)}
                </div>
              </div>
              
              <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed">
                {s.description}
              </p>

              <div className="pt-6 border-t border-gray-50">
                <div className="flex justify-between items-end">
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-gray-300 uppercase">Membros</span>
                            <span className="text-sm font-black text-black">{s.membersCount}</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => handleRequestEntry(s.name)}
                        className="h-12 px-6 bg-gray-50 rounded-2xl flex items-center gap-3 text-black font-black text-[10px] uppercase tracking-tighter hover:bg-black hover:text-white transition-all"
                    >
                        Solicitar Entrada
                        <ArrowRight size={14} />
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal de Criação (Omitido para brevidade, mas mantido internamente) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-8 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black tracking-tighter lowercase">criar sociedade</h2>
              <button onClick={() => setShowCreateModal(false)} className="bg-gray-50 p-2 rounded-full"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateSociety} className="space-y-4">
              <input required className="w-full h-14 bg-gray-50 rounded-full px-6 text-sm font-bold outline-none border-2 border-transparent focus:border-black" placeholder="Nome da comunidade" value={newSociety.name} onChange={(e) => setNewSociety({...newSociety, name: e.target.value})} />
              <textarea required className="w-full h-24 bg-gray-50 rounded-[2rem] p-6 text-sm font-bold outline-none border-2 border-transparent focus:border-black resize-none" placeholder="Descrição" value={newSociety.description} onChange={(e) => setNewSociety({...newSociety, description: e.target.value})} />
              <input type="number" className="w-full h-14 bg-gray-50 rounded-full px-6 text-sm font-bold outline-none border-2 border-transparent focus:border-black" placeholder="Valor de entrada" value={newSociety.entryFee} onChange={(e) => setNewSociety({...newSociety, entryFee: e.target.value})} />
              <button type="submit" className="w-full h-16 bg-black text-white rounded-full font-black text-sm shadow-xl mt-4">Criar Sociedade (R$ 15,00)</button>
            </form>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
