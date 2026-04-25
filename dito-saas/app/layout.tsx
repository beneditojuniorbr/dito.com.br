"use client";

import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import LiveAdminButton from '@/components/LiveAdminButton'

const inter = Inter({ subsets: ['latin'] })

// Variável global para persistir o prompt de instalação entre navegações de página
let deferredPrompt: any = null;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [showSplash, setShowSplash] = useState(false)
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'default' } | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Função global para ser chamada de qualquer lugar do app
    (window as any).notify = (message: string, type: 'success' | 'error' | 'default' = 'default') => {
      setNotification({ message, type })
      setTimeout(() => setNotification(null), 3000)
    }

    const isLoggedIn = localStorage.getItem('is_logged_in') === 'true'
    const publicPaths = ['/login', '/cadastro']
    const isPublicPath = publicPaths.includes(pathname)

    if (!isLoggedIn && !isPublicPath) {
      router.push('/login')
    } else {
      setLoading(false)
    }
  }, [pathname, router])

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      deferredPrompt = e;
      console.log('PWA installation prompt captured and ready');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    (window as any).installPWA = async () => {
      if (deferredPrompt) {
        console.log('Disparando prompt de instalação nativo...');
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('Resultado da instalação:', outcome);
        deferredPrompt = null;
      } else {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        const isStandalone = (window as any).navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

        if (isStandalone) {
          (window as any).notify("O Dito já está instalado!", "success");
        } else if (isIOS) {
          router.push('/baixar-app');
        } else {
          // Se o prompt nativo ainda não carregou, tentamos forçar uma mensagem clara
          if (confirm('Deseja instalar o Dito como aplicativo? (Se a janela não abrir automaticamente, clique em OK para ver as instruções)')) {
            router.push('/baixar-app');
          }
        }
      }
    };

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
          console.log('SW registered');
        });
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [router]);

  return (
    <html lang="pt-BR">
      <head>
        <title>Dito</title>
        <meta name="description" content="A plataforma definitiva para infoprodutores." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <meta name="theme-color" content="#ff005c" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/D2.png?v=2" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={inter.className}>
        {showSplash && (
          <div className="fixed inset-0 bg-gradient-to-br from-[#ff005c] to-[#0487ff] z-[99999] flex items-center justify-center transition-opacity duration-300">
            <img
              src="/D.png"
              alt="Dito Logo"
              className="w-40 h-40 object-contain"
            />
          </div>
        )}
        {children}
        <LiveAdminButton />
        {/* Sistema de Notificação Global */}
        {notification && (
          <div
            key={Date.now()}
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] px-10 py-5 rounded-full font-black shadow-2xl animate-in fade-in zoom-in duration-300 whitespace-nowrap ${notification.type === 'success' ? 'bg-green-500 text-white' :
                notification.type === 'error' ? 'bg-[#ef4444] text-white' :
                  'bg-white text-black border border-gray-100'
              }`}>
            {notification.message}
          </div>
        )}
      </body>
    </html>
  )
}
