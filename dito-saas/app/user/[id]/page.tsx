"use client";

import Navbar from "@/components/Navbar";
import { ArrowLeft, Link as LinkIcon, User } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function PublicProfilePage() {
  const router = useRouter();
  const params = useParams();
  
  const [profile, setProfile] = useState({
    name: "Benedito Santos",
    bio: "Infoprodutor e entusiasta de Micro SaaS. Transformando ideias em lucro.",
    link: "https://dito.com/benedito",
    avatar: ""
  });

  // Simulando busca do banco de dados pelo ID/Username
  useEffect(() => {
    // Aqui faríamos um fetch no Supabase usando o params.id
    const saved = localStorage.getItem('user_profile');
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, [params.id]);

  return (
    <div className="min-h-screen bg-white pb-32">
      <Navbar />
      <main className="max-w-xl mx-auto px-6 py-10 animate-in slide-in-from-bottom duration-700">
        
        <button 
          onClick={() => router.back()} 
          className="mb-12 flex items-center gap-2 text-gray-400 hover:text-black transition-all group font-bold text-sm"
        >
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
            <ArrowLeft size={16} />
          </div>
          voltar
        </button>

        <header className="flex flex-col items-center">
            <div className="w-40 h-40 bg-gray-50 rounded-[3rem] flex items-center justify-center shadow-2xl overflow-hidden border-8 border-white ring-1 ring-gray-100 mb-8">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={80} className="text-gray-200" />
              )}
            </div>

            <h1 className="text-4xl font-black tracking-tighter lowercase mb-4">{profile.name}</h1>
            
            <div className="bg-black text-white px-6 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-8">
                PRODUTOR VERIFICADO
            </div>

            <p className="text-gray-500 font-bold text-sm text-center max-w-sm leading-relaxed mb-10">
                {profile.bio}
            </p>

            {profile.link && (
                <a 
                  href={profile.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full h-16 flex items-center justify-center gap-3 bg-gray-50 text-black font-black text-xs uppercase tracking-[0.2em] rounded-3xl hover:bg-black hover:text-white transition-all shadow-sm border border-gray-100"
                >
                  <LinkIcon size={18} />
                  Acessar Portfolio
                </a>
            )}
        </header>

        <div className="mt-20 pt-10 border-t border-gray-50 text-center">
            <p className="text-gray-300 font-bold text-[10px] uppercase tracking-widest mb-4">Produtos de {profile.name.split(' ')[0]}</p>
            <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square bg-gray-50 rounded-3xl animate-pulse"></div>
                <div className="aspect-square bg-gray-50 rounded-3xl animate-pulse"></div>
            </div>
        </div>
      </main>
    </div>
  );
}
