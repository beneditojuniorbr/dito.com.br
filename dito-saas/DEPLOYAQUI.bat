@echo off
title Dito SaaS - Enviador Automatico
color 0b
echo =======================================================
echo              BEM-VINDO AO DEPLOY FACIL DITO
echo =======================================================
echo.
echo 1. Vou abrir seu navegador para voce criar o repositorio...
timeout /t 2 >nul
start https://github.com/new
echo.
echo 2. Crie o repositorio com o nome "dito-saas".
echo 3. Depois de criar, copie o link que termina em ".git".
echo.
set /p repo="PASTE/COLE A URL DO GITHUB AQUI E APERTE ENTER: "

echo.
echo Enviando arquivos... Aguarde um instante...
git init
git add .
git commit -m "primeiro commit dito saas"
git branch -M main
git remote add origin %repo%
git push -u origin main -f

if %errorlevel% neq 0 (
    color 0c
    echo.
    echo [ERRO] Algo deu errado. Verifique se o Git esta instalado
    echo e se voce colou a URL correta.
) else (
    color 0a
    echo.
    echo [SUCESSO!] Seu codigo ja esta no GitHub.
    echo Agora va no arquivo FACILITADOR.html e siga o Passo 3.
)
echo.
pause
