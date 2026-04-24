"use client";

import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import Button from "@/components/Button";
import { Star, ShieldCheck, Zap, ArrowLeft, Heart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, use } from "react";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const [isFavorite, setIsFavorite] = useState(false);

    // Mock product data
    const product = {
        id: resolvedParams.id,
        name: "Mentoria Elite SaaS: Do Zero ao Primeiro Cliente",
        price: 997.00,
        category: "Mentoria",
        description: "Aprenda o passo a passo para criar, validar e escalar seu próprio Micro SaaS em tempo recorde. Esta mentoria inclui acesso vitalício a todas as atualizações e uma comunidade exclusiva de fundadores.",
        rating: 5,
        reviews: 124,
        features: ["Acesso vitalício", "Comunidade exclusiva", "Suporte 1-a-1", "Templates prontos"]
    };

    const handleBuy = () => {
        router.push(`/checkout/${product.id}`);
    };

    return (
        <div className="min-h-screen bg-white pb-40">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 pt-6 transition-all">
                <button
                    onClick={() => router.back()}
                    className="mb-8 flex items-center gap-2 text-gray-400 hover:text-black transition-colors font-bold text-sm"
                >
                    <ArrowLeft size={16} />
                    voltar para o mercado
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Product Image Display */}
                    <div className="aspect-square bg-gray-50 rounded-[3rem] flex items-center justify-center relative shadow-inner overflow-hidden">
                        <div className="absolute top-8 right-8">
                            <button onClick={() => setIsFavorite(!isFavorite)} className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md text-gray-300 hover:text-red-500 transition-all">
                                <Heart size={24} fill={isFavorite ? "currentColor" : "none"} className={isFavorite ? "text-red-500" : ""} />
                            </button>
                        </div>
                        <div className="w-40 h-40 bg-gray-100 rounded-full blur-3xl opacity-50"></div>
                        <span className="text-[120px]">📦</span>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <div className="mb-6">
                            <span className="bg-gray-100 text-gray-500 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">{product.category}</span>
                        </div>

                        <h1 className="text-3xl font-black mb-2 tracking-tight">{product.name}</h1>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} fill={i < product.rating ? "black" : "none"} className={i < product.rating ? "text-black" : "text-gray-200"} />
                                ))}
                            </div>
                            <span className="text-gray-400 text-xs font-bold font-sans">({product.reviews} avaliações)</span>
                        </div>

                        <div className="bg-gray-50 p-8 rounded-[2.5rem] mb-10">
                            <p className="text-[10px] font-black uppercase text-gray-400 mb-2">Preço à vista</p>
                            <div className="text-4xl font-black tracking-tighter text-black">{formatCurrency(product.price)}</div>
                        </div>

                        <div className="space-y-4 mb-10">
                            <p className="text-gray-500 leading-relaxed text-sm font-medium">{product.description}</p>

                            <div className="grid grid-cols-2 gap-3 pt-4">
                                {product.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-gray-600">
                                        <Zap size={14} className="text-yellow-500" />
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-auto space-y-4">
                            <Button onClick={handleBuy} className="w-full h-20 text-xl shadow-xl hover:scale-[0.98] transition-all flex items-center justify-center gap-3">
                                🛒 Adicionar à Sacola
                            </Button>
                            <div className="flex items-center justify-center gap-2 text-gray-400 text-[10px] uppercase font-black tracking-widest">
                                <ShieldCheck size={14} />
                                Compra Segura Dito
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
