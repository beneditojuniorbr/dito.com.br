"use client";

import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import { ArrowLeft, Instagram, Twitter, Globe, Link as LinkIcon, BadgeCheck, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const router = useRouter();
  const { username } = use(params);

  // Mock data para o usuário
  const user = {
    username: username,
    displayName: "Benedito Estrategista",
    bio: "Especialista em Micro SaaS e infoprodutos de alta conversão. Criador da metodologia Dito. Foco em escala e automação.",
    avatar: "👨‍💻",
    verified: true,
    socials: [
      { icon: Instagram, url: "#" },
      { icon: Twitter, url: "#" },
      { icon: Globe, url: "#" },
    ],
    featuredProduct: {
      id: 99,
      name: "Dito CRM - Gestão de Vendas Automática",
      price: 29.90,
      category: "SaaS",
      rating: 5,
      isBestSeller: true
    }
  };

  return (
    <div className="min-h-screen bg-white pb-40">
      <Navbar />
      
      <main className="max-w-2xl mx-auto px-6 pt-6">
        <button 
          onClick={() => router.back()} 
          className="mb-8 flex items-center gap-2 text-gray-400 hover:text-black transition-all group font-bold text-sm"
        >
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
            <ArrowLeft size={16} />
          </div>
          voltar
        </button>

        {/* Profile Header */}
        <section className="flex flex-col items-center text-center mb-12">
            <div className="w-32 h-32 bg-black rounded-[2.5rem] flex items-center justify-center text-6xl shadow-2xl mb-6 relative border-4 border-white">
                {user.avatar}
                {user.verified && (
                    <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1.5 rounded-full border-4 border-white">
                        <BadgeCheck size={18} fill="currentColor" className="text-white" />
                    </div>
                )}
            </div>
            
            <h1 className="text-3xl font-black tracking-tight mb-2 flex items-center gap-2">
                {user.displayName}
            </h1>
            <p className="text-gray-400 font-bold text-sm mb-6">@{user.username}</p>
            
            <p className="text-gray-500 text-sm leading-relaxed max-w-md font-medium mb-8">
                {user.bio}
            </p>

            <div className="flex gap-4">
                {user.socials.map((social, i) => (
                    <a key={i} href={social.url} className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all">
                        <social.icon size={20} />
                    </a>
                ))}
            </div>
        </section>

        {/* Featured Product Space */}
        <section className="mb-12">
            <div className="flex items-center gap-2 mb-6 ml-2">
                <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Produto em Destaque</h3>
            </div>
            
            <div className="relative">
                <div className="absolute -inset-4 bg-gray-50/50 rounded-[3rem] -z-10 border border-dashed border-gray-100"></div>
                <ProductCard {...user.featuredProduct} />
            </div>
        </section>

        {/* Contact/Action Section */}
        <section className="flex gap-4">
            <button className="flex-1 h-16 bg-black text-white rounded-full font-black text-sm hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2">
                <MessageCircle size={18} />
                Falar com Produtor
            </button>
            <button className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all">
                <LinkIcon size={20} />
            </button>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
