@echo off
title DITO - CONFIGURAR MERCADO PAGO
color 0b
echo =======================================================
echo          DITO - CONFIGURADOR DE VENDAS (PIX)
echo =======================================================
echo.
echo [!] Voce precisa do seu ACCESS_TOKEN do Mercado Pago.
echo [!] Ele se parece com: APP_USR-12345678-9012...
echo.
set /p mp_token="COLE O SEU ACCESS_TOKEN DO MERCADO PAGO AQUI: "
echo.
echo [!] Enviando chave de seguranca para o Supabase...
echo.

:: Usa o ID do seu projeto que ja sabemos
call npx supabase secrets set MP_ACCESS_TOKEN=%mp_token% --project-ref hlzmahaekybidmwielsr

if %errorlevel% equ 0 (
    echo.
    echo =======================================================
    echo [OK] SUCESSO! O Mercado Pago agora esta ativo.
    echo Agora voce pode gerar Pix reais no seu site.
    echo =======================================================
) else (
    echo.
    echo [!] ERRO: Nao foi possivel configurar. 
    echo Verifique se voce rodou o ATUALIZAR_PIX.bat primeiro.
)
echo.
pause
