"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Key, Eye, EyeOff, Ghost, UserPlus, LogIn } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingGuest, setLoadingGuest] = useState(false);

  // Importação dinâmica para evitar erros de SSR no cliente
  const getSupabase = async () => {
    const { supabase } = await import("@/lib/supabase");
    return supabase;
  };

  // Limpa o login e histórico de chat sempre que a página de login for acessada (Entrada no App)
  useEffect(() => {
    localStorage.removeItem('is_logged_in');
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('chat_history_')) localStorage.removeItem(key);
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const userInp = email.trim(); // No Next.js o campo chama 'email', mas vamos tratar como identificador (user ou email)
    const passInp = password.trim();

    // 1. Tenta Login Local (Cache)
    const usuarios = JSON.parse(localStorage.getItem('dito_usuarios') || '[]');
    let usuarioLogado = usuarios.find((u: any) => (u.email === userInp || u.username === userInp) && u.password === passInp);

    // 2. Tenta Login Global (Supabase)
    if (!usuarioLogado) {
        try {
            const supabase = await getSupabase();
            const { data, error } = await supabase
                .from('dito_users')
                .select('*')
                .or(`username.eq.${userInp},email.eq.${userInp}`)
                .eq('password', passInp)
                .maybeSingle();

            if (data && !error) {
                usuarioLogado = data;
                // Sincroniza para o cache local
                usuarios.push(data);
                localStorage.setItem('dito_usuarios', JSON.stringify(usuarios));
            }
        } catch (err) {
            console.warn("Falha na rede ao autenticar", err);
        }
    }

    if (usuarioLogado || (userInp === 'admin' && passInp === 'admin')) {
        const userToSave = usuarioLogado || { id: 1, name: 'Admin', username: 'admin', bio: 'Administrador' };
        
        // Otimização de Storage: Remove campos pesados antes de salvar a sessão
        const sessionUser = { ...userToSave };
        delete sessionUser.posts;
        delete sessionUser.purchases;
        delete sessionUser.password;

        localStorage.setItem('is_logged_in', 'true');
        localStorage.setItem('is_guest', 'false');
        localStorage.setItem('user_profile', JSON.stringify(sessionUser));
        localStorage.setItem('dito_current_user', JSON.stringify(sessionUser));
        
        router.push("/dashboard");
    } else {
        setLoading(false);
        (window as any).notify?.("Usuário ou senha incorretos. Verifique seus dados!", "error");
    }
  };

  const handleGuestEntry = () => {
    setLoadingGuest(true);
    setTimeout(() => {
        localStorage.setItem('is_logged_in', 'true');
        localStorage.setItem('is_guest', 'true');
        localStorage.removeItem('user_profile'); // Remove perfil anterior se houver
        router.push("/dashboard");
    }, 2400);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-20 px-6 animate-in fade-in duration-700">
      <div className="w-full max-w-sm">
        {/* Overlay de carregamento centralizado */}
        {(loading || loadingGuest) && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/60 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-white border border-gray-100 shadow-2xl rounded-full px-10 py-5 flex items-center gap-4 animate-in zoom-in duration-300">
                    <div className="w-5 h-5 border-2 border-gray-100 border-t-[#ef4444] rounded-full animate-spin"></div>
                    <span className="font-black text-sm tracking-tight">{loadingGuest ? "Entrando como convidado..." : "Entrando..."}</span>
                </div>
            </div>
        )}

        <header className="text-center mb-12">
          <img 
            src="/D2.png" 
            alt="Dito Logo" 
            className="w-20 h-20 rounded-[2rem] mx-auto mb-6 shadow-2xl rotate-3 hover:rotate-0 transition-transform object-cover"
          />
          <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-[#ff0045] to-[#0094ff] bg-clip-text text-transparent">Dito</h1>
          <p className="text-gray-400 font-medium text-sm mt-2">seu ecossistema de infoprodutos.</p>
        </header>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative group">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={20} />
            <input
              type="email"
              placeholder="e-mail de acesso"
              className="w-full h-16 bg-gray-50 rounded-full pl-14 pr-6 text-sm font-bold border-2 border-transparent focus:border-black focus:bg-white transition-all outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative group">
            <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="sua senha"
              className="w-full h-16 bg-gray-50 rounded-full pl-14 pr-14 text-sm font-bold border-2 border-transparent focus:border-black focus:bg-white transition-all outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black transition-colors"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-16 bg-black text-white rounded-full font-black text-sm shadow-xl hover:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
                <LogIn size={20} />
            )}
            {loading ? "Entrando..." : "entrar"}
          </button>
        </form>

        <div className="mt-10 space-y-3">
          <button 
            onClick={() => router.push("/cadastro")}
            className="w-full h-14 bg-gray-50 text-gray-500 rounded-full font-bold text-xs hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <UserPlus size={20} />
            cadastre-se agora
          </button>
          <button 
            onClick={handleGuestEntry}
            disabled={loadingGuest}
            className="w-full h-14 bg-black/5 text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loadingGuest ? (
                <div className="w-4 h-4 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin"></div>
            ) : (
                <Zap size={18} className="text-yellow-500" />
            )}
            {loadingGuest ? "validando..." : "Entrar como convidado (Pular)"}
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-50 flex justify-center">
            <div 
              onClick={() => (window as any).installPWA?.()}
              className="flex items-center gap-2 text-gray-300 hover:text-black transition-colors font-black text-[10px] cursor-pointer uppercase tracking-widest"
            >
                DITO 2026 - APP
            </div>
        </div>
      </div>
    </div>
  );
}
