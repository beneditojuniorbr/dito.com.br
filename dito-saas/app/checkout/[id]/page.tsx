"use client";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ShoppingBag, ArrowLeft, CreditCard, Diamond, CheckCircle2, Copy, Check, Zap } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");
    const [isGuest, setIsGuest] = useState(true);
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    
    // Estados do Pix
    const [showPixModal, setShowPixModal] = useState(false);
    const [qrCode, setQrCode] = useState("");
    const [paymentId, setPaymentId] = useState("");
    const [copied, setCopied] = useState(false);

    const [product, setProduct] = useState({
        id: resolvedParams.id,
        name: "Carregando...",
        price: 0,
        type: ""
    });

    useEffect(() => {
        const userStr = localStorage.getItem('dito_user_data');
        if (userStr) {
            const user = JSON.parse(userStr);
            setCurrentUser(user);
            setIsGuest(false);
        }

        // Buscar dados reais do produto no Supabase
        const fetchProduct = async () => {
            const { data } = await supabase
                .from('dito_market_products')
                .select('*')
                .eq('id', resolvedParams.id)
                .single();
            if (data) setProduct(data);
        };
        fetchProduct();
    }, [resolvedParams.id]);

    // REALTIME: Escuta o pagamento aprovado
    useEffect(() => {
        if (!paymentId) return;

        const channel = supabase
            .channel(`pay_${paymentId}`)
            .on('postgres_changes', { 
                event: 'UPDATE', 
                schema: 'public', 
                table: 'dito_payments',
                filter: `id=eq.${paymentId}` 
            }, (payload) => {
                if (payload.new.status === 'approved') {
                    handleSuccess();
                    supabase.removeChannel(channel);
                }
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [paymentId]);

    const handleSuccess = async () => {
        setLoading(false);
        setShowPixModal(false);
        
        // ENTREGA DO PRODUTO (Nuvem)
        try {
            const userStr = localStorage.getItem('user_profile');
            if (userStr) {
                const user = JSON.parse(userStr);
                
                // 1. Busca compras atuais
                const { data: userData } = await supabase
                    .from('dito_users')
                    .select('purchases')
                    .eq('username', user.username)
                    .single();
                
                let purchases = [];
                try { 
                    purchases = typeof userData?.purchases === 'string' 
                        ? JSON.parse(userData.purchases) 
                        : (userData?.purchases || []);
                } catch(e) { purchases = []; }

                // 2. Adiciona o novo produto
                if (!purchases.find((p: any) => p.id === product.id)) {
                    purchases.push({
                        id: product.id,
                        name: product.name,
                        date: new Date().toISOString(),
                        type: product.type
                    });

                    // 3. Salva no Supabase
                    await supabase
                        .from('dito_users')
                        .update({ purchases: JSON.stringify(purchases) })
                        .eq('username', user.username);
                    
                    // 4. Salva localmente (Cache)
                    localStorage.setItem(`purchased_products_vanilla_${user.username}`, JSON.stringify(purchases));
                }
            }
        } catch (err) {
            console.error("Erro na entrega do produto:", err);
        }

        alert("🎉 PAGAMENTO CONFIRMADO! Bem-vindo(a).");
        router.push('/dashboard');
    };

    const handleProcessPayment = async () => {
        if (!currentUser && isGuest) {
            alert("Por favor, faça login ou cadastre-se primeiro.");
            return;
        }

        setLoading(true);
        try {
            const internalPaymentId = `pay_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            const resp = await fetch('https://hlzmahaekybidmwielsr.supabase.co/functions/v1/mercado-pago-bridge', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhlb2ZlemV4dmhneWFlamx0Y3ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5OTU0NjMsImV4cCI6MjA5MTU3MTQ2M30.v4G47ddzSdpTEWeozaQXWczNFy-ueUCwRbwMfp8SEUI`
                },
                body: JSON.stringify({
                    action: 'create-pix',
                    amount: product.price,
                    description: `Compra: ${product.name}`,
                    email: currentUser?.email || "convidado@dito.pro",
                    metadata: {
                        payment_id: internalPaymentId,
                        username: currentUser?.username || "convidado",
                        product: product
                    }
                })
            });

            const data = await resp.json();
            if (data.qr_code) {
                setQrCode(data.qr_code);
                setPaymentId(internalPaymentId);
                setShowPixModal(true);
            } else {
                alert("Erro ao gerar Pix: " + (data.error || "Tente novamente."));
            }
        } catch (e) {
            alert("Erro na conexão com o servidor de pagamento.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(qrCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-white">
            <header className="px-6 py-8 flex items-center gap-4">
                <button 
                  onClick={() => router.back()}
                  className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-2">
                    <ShieldCheck className="text-green-500" size={24} />
                    <h1 className="text-2xl font-black tracking-tight">Checkout</h1>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-6 pb-20">
                <section className="mb-10">
                    <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 flex items-center gap-2">
                        <ShoppingBag size={14} /> Resumo do Pedido
                    </h3>
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-gray-600">{product.name}</span>
                        <span className="font-black text-black">{formatCurrency(product.price)}</span>
                    </div>
                    <div className="pt-4 border-t border-dashed border-gray-200 flex justify-between items-center">
                        <span className="font-black text-lg">Total</span>
                        <span className="font-black text-2xl text-[#ff005c]">{formatCurrency(product.price)}</span>
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-6 h-6 bg-black text-white rounded-lg flex items-center justify-center text-[11px] font-black">1</div>
                        <h3 className="text-sm font-black uppercase tracking-tight">Meio de Pagamento</h3>
                    </div>

                    <div className="space-y-3 mb-10">
                        <div 
                          onClick={() => setPaymentMethod("pix")}
                          className={`p-5 rounded-[2rem] border-2 cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === 'pix' ? 'border-black bg-gray-50' : 'border-gray-100 bg-white'}`}
                        >
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                <Diamond className="text-black" size={24} />
                            </div>
                            <div className="flex-1">
                                <p className="font-black text-sm">Pix Instantâneo</p>
                                <p className="text-[10px] font-bold text-gray-400">Liberação imediata via Radar</p>
                            </div>
                            {paymentMethod === 'pix' && <CheckCircle2 className="text-black" size={20} />}
                        </div>
                    </div>

                    <button 
                      onClick={handleProcessPayment}
                      disabled={loading}
                      className="w-full h-20 bg-black text-white rounded-[2rem] font-black text-lg shadow-2xl hover:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Diamond size={22} />
                                GERAR PIX AGORA
                            </>
                        )}
                    </button>
                </section>
            </main>

            {/* Modal do Pix */}
            {showPixModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 bg-black/80 backdrop-blur-sm animate-in fade-in transition-all">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 text-center shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#ff005c] to-[#0094ff]" />
                        
                        <h2 className="text-xl font-black mb-2">Escaneie o QR Code</h2>
                        <p className="text-xs font-bold text-gray-400 mb-8 px-8">O Radar Dito está aguardando seu pagamento para liberar seu acesso.</p>
                        
                        <div className="bg-gray-50 p-6 rounded-[2rem] mb-8 inline-block mx-auto border border-gray-100">
                            {/* Em um app real usaria uma lib de QR Code, aqui mostramos o código */}
                            <div className="w-48 h-48 bg-white flex items-center justify-center rounded-2xl border-2 border-black/5 mb-4 p-2">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrCode)}`} alt="QR Code Pix" />
                            </div>
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Aguardando Aprovação...</p>
                        </div>

                        <div className="space-y-3">
                            <button 
                                onClick={copyToClipboard}
                                className="w-full py-5 bg-gray-50 hover:bg-gray-100 text-black rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2"
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                {copied ? 'CÓDIGO COPIADO!' : 'PIX COPIA E COLA'}
                            </button>
                            
                            <button 
                                onClick={() => setShowPixModal(false)}
                                className="w-full py-4 text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-black transition-all"
                            >
                                Cancelar Pagamento
                            </button>
                        </div>

                        {/* Botão ADM */}
                        {currentUser?.username === 'Ditão' && (
                            <div className="mt-8 pt-8 border-t border-dashed border-gray-100">
                                <button 
                                    onClick={handleSuccess}
                                    className="w-full py-4 bg-[#ff005c] text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#ff005c]/20 flex items-center justify-center gap-2"
                                >
                                    <Zap size={14} /> Simular Liberação (Ditão)
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
