"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, Award, TrendingUp, Package, Globe, Instagram, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function PublicProfile() {
  const params = useParams();
  const router = useRouter();
  const username = params?.username as string;
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      if (!username) return;
      
      try {
        const { data, error } = await supabase
          .from('dito_users')
          .select('*')
          .eq('username', username)
          .maybeSingle();
        
        if (data) {
          setUser(data);
        }
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-gray-200" />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Carregando Arena...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-4xl font-black tracking-tighter mb-4">Usuário não encontrado.</h2>
        <p className="text-gray-400 font-bold mb-8">Essa conta ainda não faz parte do ecossistema Dito.</p>
        <button onClick={() => router.back()} className="bg-black text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest">Voltar</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Profile */}
      <div className="bg-black text-white pt-10 pb-32 px-6 rounded-b-[4rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 -mr-48 -mt-48 rounded-full blur-[100px]"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <button 
            onClick={() => router.back()}
            className="mb-8 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full border-4 border-white/20 p-1 mb-6">
              <div className="w-full h-full rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                {user.avatar ? (
                    <img src={user.avatar} alt={user.name || user.username} className="w-full h-full object-cover" />
                ) : (
                    <div className="text-4xl font-black">{user.name?.[0] || user.username?.[0] || 'D'}</div>
                )}
              </div>
            </div>
            
            <h1 className="text-4xl font-black italic tracking-tighter mb-2">{user.name || user.username}</h1>
            <p className="text-white/60 text-sm max-w-sm mb-6 leading-relaxed font-medium">
              {user.bio || "Membro da Elite Dito Ecosystem."}
            </p>

            <div className="flex gap-4">
               {user.link && (
                 <div className="bg-white/10 border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                    <Globe size={14} className="text-white/50" />
                    <span className="text-[11px] font-black uppercase tracking-wider">{user.link.replace('https://', '').replace('http://', '')}</span>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats & Hall Position */}
      <div className="max-w-4xl mx-auto -mt-16 px-6 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-50 flex flex-col items-center">
            <div className="w-12 h-12 bg-yellow-400/10 rounded-full flex items-center justify-center mb-4">
               <Award size={24} className="text-yellow-500 fill-yellow-500" />
            </div>
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">Posição na Arena</span>
            <h4 className="text-2xl font-black italic">#{user.rank} Global</h4>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-50 flex flex-col items-center">
            <div className="w-12 h-12 bg-green-400/10 rounded-full flex items-center justify-center mb-4">
               <TrendingUp size={24} className="text-green-500" />
            </div>
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">Faturamento total</span>
            <h4 className="text-2xl font-black italic">R$ {(user.sales || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h4>
            <span className="text-[10px] text-green-500 font-bold">Saldo verificado</span>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-50 flex flex-col items-center">
            <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mb-4">
               <Package size={24} className="text-black" />
            </div>
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">Status da Conta</span>
            <h4 className="text-2xl font-black italic">Elite Ativa</h4>
          </div>

        </div>
      </div>

      {/* Products Feed */}
      <div className="max-w-4xl mx-auto px-6 mt-16 pb-20">
        <div className="flex items-center gap-4 mb-8">
           <h3 className="text-xl font-black tracking-tight italic">Produtos em Destaque</h3>
           <div className="h-[1px] flex-1 bg-gray-100"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Card do Produto */}
           {[1, 2, 3, 4].map(i => (
             <div key={i} className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-transparent hover:border-black transition-all group cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Package size={20} className="text-black" />
                  </div>
                  <span className="bg-black text-white px-3 py-1 rounded-full text-[9px] font-black">R$ 97,00</span>
                </div>
                <h4 className="font-black italic text-lg mb-1 leading-tight">Método Escala Dito #{i}</h4>
                <p className="text-gray-400 text-xs leading-relaxed">Desenvolva sua audiência e venda infoprodutos em escala global com este framework.</p>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                   <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Acesso Vitalício</span>
                   <button className="text-[10px] font-black uppercase text-black">Ver detalhes →</button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
