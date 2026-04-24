"use client";

import { Star, Heart, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Button from "./Button";
import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
  id: string | number;
  name: string;
  price: number;
  category: string;
  image?: string;
  rating?: number;
  isBestSeller?: boolean;
}

export default function ProductCard({ id, name, price, category, image, rating = 5, isBestSeller }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const isMentoria = category?.toLowerCase() === 'mentoria';

  return (
    <div className={`group bg-white border ${isMentoria ? 'border-[#ff005c]/20' : 'border-gray-100'} rounded-[2rem] overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col h-full relative`}>
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {isMentoria && (
          <span className="bg-[#ff005c] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span> AO VIVO
          </span>
        )}
        {isBestSeller && !isMentoria && (
          <span className="bg-black text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
            Mais Vendido
          </span>
        )}
        <span className="bg-gray-100/80 backdrop-blur-md text-gray-500 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
            {category}
        </span>
      </div>

      {/* Favorite Button */}
      <button 
        onClick={(e) => { e.preventDefault(); setIsFavorite(!isFavorite); }}
        className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm text-gray-400 hover:text-red-500 transition-colors"
      >
        <Heart size={20} fill={isFavorite ? "currentColor" : "none"} className={isFavorite ? "text-red-500" : ""} />
      </button>

      {/* Image Placeholder */}
      <Link href={`/mercado/${id}`} className="aspect-square flex items-center justify-center overflow-hidden relative">
        <div className={`absolute inset-0 bg-gray-50 transition-all duration-700 ${isMentoria ? 'p-1' : ''}`}>
            {isMentoria && (
                <div className="absolute inset-0 bg-gradient-to-tr from-[#ff005c] to-[#0487ff] animate-spin-slow opacity-20"></div>
            )}
            <div className={`w-full h-full bg-white rounded-[1.8rem] flex items-center justify-center relative overflow-hidden ${isMentoria ? 'border-2 border-white' : ''}`}>
                <div className="w-20 h-20 bg-gray-200 rounded-2xl group-hover:scale-110 transition-transform duration-700 blur-2xl opacity-50"></div>
                {image ? (
                    <img src={image} className="w-full h-full object-cover absolute inset-0" alt={name} />
                ) : (
                    <ShoppingBag size={40} className="text-gray-200 absolute" />
                )}
            </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill={i < rating ? "black" : "none"} className={i < rating ? "text-black" : "text-gray-200"} />
            ))}
        </div>
        
        <Link href={`/mercado/${id}`} className="flex-1">
            <h3 className="text-base font-bold text-black mb-1 line-clamp-2 hover:underline">{name}</h3>
            <p className="text-xl font-black text-black mt-2">{formatCurrency(price)}</p>
        </Link>

        <Link href={isMentoria ? `/live/${id}` : `/mercado/${id}`} className="w-full mt-6">
          <Button variant={isMentoria ? "secondary" : "primary"} className={`w-full h-12 rounded-2xl text-[10px] uppercase font-black tracking-widest ${isMentoria ? 'bg-black text-white' : ''}`}>
            {isMentoria ? 'Ingressar na Sala' : 'Comprar Agora'}
          </Button>
        </Link>
      </div>
    </div>
  );
}
