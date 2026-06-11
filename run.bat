@echo off

:: Start Vite frontend
start "Vite" cmd /k "cd /d E:\VaultDL && npm run dev"

:: Start backend
start "Backend" cmd /k "cd /d E:\VaultDL\backend && node server.mjs"

:: Wait for servers to boot
timeout /t 5 /nobreak > nul

:: Open as app window (Chrome)
start chrome --app=http://localhost:5173

exit