"use client";

import React, { useState, useRef, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import { Camera, Plus, Grid, Bookmark, Users, Heart, ArrowLeft, Settings, Link as LinkIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PerfilInstagramPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const postInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState({
    name: "Benedito Santos",
    username: "benedito_pro",
    bio: "Infoprodutor de Elite | Especialista em SaaS 🚀\nTransformando ideias em lucro real.",
    link: "dito.com/sua-loja",
    avatar: "",
    fans: "12.4k",
    following: "482",
    postsCount: 12
  });

  const [posts, setPosts] = useState<any[]>([
    { id: 1, url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80", pinned: true },
    { id: 2, url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&q=80", pinned: false },
    { id: 3, url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&q=80", pinned: false },
  ]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNewPost = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPost = {
          id: Date.now(),
          url: reader.result as string,
          pinned: false
        };
        setPosts([newPost, ...posts]);
        setProfile({...profile, postsCount: profile.postsCount + 1});
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header Fixo */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-40 px-6 py-4 flex items-center justify-between border-b border-gray-50">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="hover:scale-110 transition-all">
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
          <h2 className="text-xl font-black lowercase tracking-tighter">{profile.username}</h2>
        </div>
        <div className="flex items-center gap-5">
          <button onClick={() => postInputRef.current?.click()} className="hover:scale-110 transition-all">
            <Plus size={26} strokeWidth={2.5} />
          </button>
          <button className="hover:scale-110 transition-all">
            <Settings size={24} strokeWidth={2.5} />
          </button>
        </div>
        <input type="file" ref={postInputRef} className="hidden" accept="image/*" onChange={handleNewPost} />
      </header>

      <main className="max-w-xl mx-auto px-6 py-8">
        {/* Info do Perfil */}
        <section className="flex items-center gap-10 mb-8">
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[3px]">
              <div className="w-full h-full rounded-full bg-white p-[2px]">
                <div className="w-full h-full rounded-full bg-gray-100 overflow-hidden relative group">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Camera size={32} />
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleAvatarChange} />
                  <div 
                    onClick={() => fileInputRef.current?.click()} 
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                  >
                    <Plus size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-1 justify-around text-center">
            <div>
              <p className="text-lg font-black">{profile.postsCount}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Posts</p>
            </div>
            <div>
              <p className="text-lg font-black">{profile.fans}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fãs</p>
            </div>
            <div>
              <p className="text-lg font-black">{profile.following}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Seguindo</p>
            </div>
          </div>
        </section>

        {/* Bio */}
        <section className="mb-10">
          <h1 className="text-sm font-black mb-1">{profile.name}</h1>
          <p className="text-sm text-gray-600 font-medium whitespace-pre-line leading-relaxed mb-3">
            {profile.bio}
          </p>
          <a href="#" className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">
            <LinkIcon size={14} />
            {profile.link}
          </a>
        </section>

        {/* Botões de Ação */}
        <div className="flex gap-2 mb-10">
          <button className="flex-1 h-10 bg-gray-100 hover:bg-gray-200 text-sm font-black rounded-lg transition-all">Editar Perfil</button>
          <button className="flex-1 h-10 bg-gray-100 hover:bg-gray-200 text-sm font-black rounded-lg transition-all">Compartilhar</button>
        </div>

        {/* Tabs Grid */}
        <div className="flex border-t border-gray-100 mb-1">
          <button className="flex-1 py-4 flex justify-center text-black border-t-2 border-black -mt-[2px]">
            <Grid size={20} strokeWidth={2.5} />
          </button>
          <button className="flex-1 py-4 flex justify-center text-gray-300 hover:text-black transition-all">
            <Bookmark size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Galeria de Fotos */}
        <div className="grid grid-cols-3 gap-1">
          {posts.map((post) => (
            <div key={post.id} className="aspect-square relative group cursor-pointer overflow-hidden bg-gray-100">
              <img src={post.url} alt="Post" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              {post.pinned && (
                <div className="absolute top-2 right-2 text-white drop-shadow-lg">
                  <Bookmark size={14} fill="currentColor" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-4 font-black">
                <span className="flex items-center gap-1"><Heart size={16} fill="white" /> 124</span>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="col-span-3 py-20 text-center">
                <Camera size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400 font-bold">ainda não há fotos.</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
