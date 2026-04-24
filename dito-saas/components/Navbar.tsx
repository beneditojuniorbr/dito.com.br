"use client";

import { Search, LogOut, Plus, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Simulação de busca no banco
      const usuarios = JSON.parse(localStorage.getItem('dito_usuarios') || '[]');
      const userFound = usuarios.find((u: any) => 
        u.name.toLowerCase().includes(query.toLowerCase()) || 
        u.email.toLowerCase().includes(query.toLowerCase())
      );

      if (userFound) {
        router.push(`/user/${userFound.id}`);
      } else {
        // Se não achar, tenta a rota genérica antiga ou avisa
        router.push(`/user/${query.toLowerCase().replace(/\s/g, "")}`);
      }
      setIsSearching(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('is_logged_in');
    router.push("/login");
  };

  return (
    <nav className="bg-white px-6 py-6 border-b border-gray-50 sticky top-0 z-[100] backdrop-blur-md bg-white/90">
      <div className="max-w-2xl mx-auto flex items-center justify-between relative h-10">
        
        {/* Left Side: Create Button */}
        <div className={`transition-all duration-500 ${isSearching ? "opacity-0 invisible scale-95" : "opacity-100 visible scale-100"}`}>
          <div className="group relative">
            <button 
              onClick={() => router.push("/criar-produto")}
              className="flex items-center justify-center hover:scale-110 transition-transform p-2 text-gray-400 hover:text-black"
            >
              <Plus size={26} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Center: Branding */}
        <Link 
          href="/dashboard" 
          className={`absolute left-1/2 -translate-x-1/2 flex items-center gap-1 transition-all duration-500 ${isSearching ? "opacity-0 invisible scale-90" : "opacity-100 visible scale-100"}`}
        >
          <span className="text-2xl font-black tracking-tighter capitalize">Dito</span>
        </Link>

        {/* Right Side Actions & Search Bar */}
        <div className="flex items-center gap-3 relative min-w-[40px] justify-end flex-1 ml-4">
          
          <form 
            onSubmit={handleSearch}
            className={`flex items-center bg-gray-50 rounded-full transition-all duration-500 overflow-hidden absolute right-0 z-20 ${
              isSearching ? "w-[calc(100%+80px)] h-12 px-6 shadow-lg border border-gray-100 bg-white" : "w-0 h-10 p-0 opacity-0"
            }`}
          >
            <Search size={20} className="text-gray-400 mr-3 flex-shrink-0" />
            <input 
              autoFocus
              type="text"
              placeholder="Pesquisar usuários..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent border-none outline-none flex-1 text-sm font-bold"
            />
            <button 
              type="button" 
              onClick={() => { setIsSearching(false); setQuery(""); }}
              className="text-gray-400 hover:text-black ml-2"
            >
              <X size={18} />
            </button>
          </form>

          {/* New Order: LogOut then Search (far right) */}
          {!isSearching && (
            <button 
              onClick={handleLogout}
              className="w-10 h-10 text-gray-400 hover:text-red-500 transition-colors flex items-center justify-center animate-in fade-in duration-700"
            >
              <LogOut size={22} />
            </button>
          )}

          <button 
            onClick={() => setIsSearching(!isSearching)}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 z-30 ${
                isSearching ? "bg-black text-white" : "text-gray-400 hover:bg-gray-50 hover:text-black"
            }`}
          >
            <Search size={22} />
          </button>
        </div>
      </div>
    </nav>
  );
}
