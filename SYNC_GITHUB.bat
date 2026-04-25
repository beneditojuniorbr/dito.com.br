@echo off
title DITO PRO - Sincronizador GitHub
color 0b
echo =======================================================
echo          DITO PRO - SINCRONIZANDO COM GITHUB
echo =======================================================
echo.
echo [1/3] Recolhendo alteracoes...
"C:\Program Files\Git\cmd\git.exe" add .

echo [2/3] Criando pacote de atualizacao...
set msg=Atualizacao Automatica: %date% %time%
"C:\Program Files\Git\cmd\git.exe" commit -m "%msg%"

echo [3/3] Subindo para o GitHub...
"C:\Program Files\Git\cmd\git.exe" push origin main

echo.
echo =======================================================
echo ✅ TUDO PRONTO! Seu codigo ja esta nas nuvens.
echo =======================================================
timeout /t 5
