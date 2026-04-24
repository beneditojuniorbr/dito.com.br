"use client";

import { useEffect, use } from "react";
import { useRouter } from "next/navigation";

export default function ProductLinkRedirect({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);

    useEffect(() => {
        // Redireciona diretamente para o checkout do produto
        // para garantir que a opção de cartão apareça imediatamente
        router.replace(`/checkout/${resolvedParams.id}`);
    }, [resolvedParams.id, router]);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div>
                <span className="font-black text-sm uppercase tracking-widest text-gray-300">Carregando Checkout Seguro...</span>
            </div>
        </div>
    );
}
