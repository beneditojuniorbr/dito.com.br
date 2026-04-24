@echo off
title DITO - ATUALIZAR PIX (MERCADO PAGO)
color 0e
echo =======================================================
echo          DITO - ATUALIZADOR DE PIX / SUPABASE
echo =======================================================
echo.
echo [!] Este processo resolve o erro de CORS do Pix.
echo [!] Se abrir o navegador, clique em "Authorize".
echo.

:: Navega para a pasta correta se necessario
cd /d "%~dp0"

where npx >nul 2>&1
if %errorlevel% equ 0 (
    echo [1/3] Preparando conexao com Supabase...
    call npx supabase login
    echo.
    echo [2/3] Conectando ao projeto hlzmahaekybidmwielsr...
    call npx supabase link --project-ref hlzmahaekybidmwielsr
    echo.
    echo [3/3] Enviando correcao do Mercado Pago...
    call npx supabase functions deploy mercado-pago-bridge --no-verify-jwt
    echo.
    echo =======================================================
    echo [OK] TUDO PRONTO! 
    echo O Pix agora deve funcionar sem erro no site oficial.
    echo =======================================================
) else (
    echo [!] ERRO: Voce precisa do Node.js instalado para atualizar.
    echo Baixe em nodejs.org e tente novamente.
)
echo.
pause
