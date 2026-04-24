"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Key, Eye, EyeOff, UserPlus, ArrowLeft } from "lucide-react";

export default function CadastroPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: ""
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const novoUsuario = {
        name: formData.nome,
        username: formData.email.split('@')[0], // Gera um username baseado no email para compatibilidade
        email: formData.email,
        password: formData.senha, // Salva senha para possibilitar login cross-device
        avatar: "",
        bio: "Novo produtor na Dito! 🚀",
        link: "",
        balance: 0,
        sales: 0,
        last_seen: new Date().toISOString()
    };

    try {
        const { supabase } = await import("@/lib/supabase");
        
        // 1. Salva na Rede (Supabase)
        const { error } = await supabase.from('dito_users').upsert([novoUsuario], { onConflict: 'username' });
        
        if (error) throw error;

        // 2. Salva no Cache Local (Otimizado)
        const currentLocal = JSON.parse(localStorage.getItem('dito_usuarios') || '[]');
        currentLocal.push(novoUsuario);
        localStorage.setItem('dito_usuarios', JSON.stringify(currentLocal));

        // 3. Define Sessão (Sem campos pesados)
        const sessionUser = { ...novoUsuario };
        delete (sessionUser as any).password;
        
        localStorage.setItem('is_logged_in', 'true');
        localStorage.setItem('is_guest', 'false');
        localStorage.setItem('user_profile', JSON.stringify(sessionUser));

        (window as any).notify?.("Conta criada com sucesso! Seja bem-vindo à Dito.", "success");
        router.push("/dashboard");
    } catch (err: any) {
        console.error("Erro no cadastro:", err);
        (window as any).notify?.("Erro ao criar conta: " + (err.message || "Verifique sua conexão"), "error");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-20 px-6 animate-in slide-in-from-right duration-500">
      <div className="w-full max-w-sm">
        
        <button 
          onClick={() => router.push("/login")}
          className="mb-8 flex items-center gap-2 text-gray-400 hover:text-black transition-all font-bold text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={16} />
          voltar para login
        </button>

        <header className="text-center mb-10">
          <img 
            src="/D2.png" 
            alt="Dito Logo" 
            className="w-16 h-16 rounded-2xl mx-auto mb-6 shadow-xl object-cover"
          />
          <p className="text-[#ef4444] font-black text-xs uppercase tracking-widest mb-1">Dito</p>
          <h1 className="text-3xl font-black tracking-tighter lowercase">criar conta</h1>
          <p className="text-gray-400 font-medium text-sm mt-2">junte-se à elite dos infoprodutores.</p>
        </header>

        <form onSubmit={handleCadastro} className="space-y-4">
          {/* Nome */}
          <div className="relative group">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={20} />
            <input
              type="text"
              placeholder="seu nome completo"
              className="w-full h-16 bg-gray-50 rounded-full pl-14 pr-6 text-sm font-bold border-2 border-transparent focus:border-black focus:bg-white transition-all outline-none"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              required
            />
          </div>

          {/* Email */}
          <div className="relative group">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={20} />
            <input
              type="email"
              placeholder="seu melhor e-mail"
              className="w-full h-16 bg-gray-50 rounded-full pl-14 pr-6 text-sm font-bold border-2 border-transparent focus:border-black focus:bg-white transition-all outline-none"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          {/* Senha */}
          <div className="relative group">
            <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="crie uma senha forte"
              className="w-full h-16 bg-gray-50 rounded-full pl-14 pr-14 text-sm font-bold border-2 border-transparent focus:border-black focus:bg-white transition-all outline-none"
              value={formData.senha}
              onChange={(e) => setFormData({...formData, senha: e.target.value})}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Termos de Uso */}
          <div className="flex items-center gap-3 px-4 py-2">
            <input 
              type="checkbox" 
              id="terms-check" 
              required
              className="w-5 h-5 rounded-md border-2 border-gray-200 checked:bg-black transition-all"
            />
            <label htmlFor="terms-check" className="text-[10px] font-bold text-gray-500 uppercase tracking-tight leading-none cursor-pointer">
              Li e concordo com os <button type="button" className="text-black underline" onClick={() => (window as any).notify?.("Termos: O Dito é uma plataforma segura e ética. É proibido conteúdo ilegal.", "info")}>Termos de Uso</button>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-16 bg-black text-white rounded-full font-black text-sm shadow-xl hover:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
          >
            {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
                <UserPlus size={18} />
            )}
            {loading ? "Criando conta..." : "Finalizar Cadastro"}
          </button>
        </form>

        <p className="text-center mt-10 text-gray-300 text-[9px] uppercase font-bold tracking-widest leading-relaxed">
            DITO 2026 - APP
        </p>
      </div>
    </div>
  );
}
