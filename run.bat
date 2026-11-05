@echo off
cd /d "%~dp0"
if not defined ADMIN_PASSWORD (
  echo ERROR: Set ADMIN_PASSWORD before starting DonorConnect.
  echo See READ_ME_FIRST.txt for setup instructions.
  pause
  exit /b 1
)
echo Installing (first time only)...
python -m pip install -r requirements.txt
echo.
echo Starting DonorConnect. KEEP THIS WINDOW OPEN.
echo Website: http://127.0.0.1:5000/
echo Admin:   http://127.0.0.1:5000/admin
start "" cmd /c "timeout /t 4 >nul & start http://127.0.0.1:5000/admin"
python app.py
pause
