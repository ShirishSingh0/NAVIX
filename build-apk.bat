@echo off
setlocal
echo ========================================================
echo   NAVIX Moto Companion - APK Build Helper
echo ========================================================
echo.

:: 1. Check for JDK 17+
javac -version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [!] JDK is not currently in PATH or outdated.
    echo [*] Checking for Microsoft OpenJDK 17 via winget...
    winget install --id Microsoft.OpenJDK.17 -e --source winget --accept-source-agreements --accept-package-agreements
    echo.
    echo [*] Please restart this script or command prompt once JDK 17 is installed.
    pause
    exit /b 1
)

:: 2. Build Web Assets & Sync
echo [*] Step 1/3: Building web distribution...
cd /d "%~dp0"
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [!] Web build failed!
    pause
    exit /b 1
)

echo [*] Step 2/3: Syncing Capacitor Android assets...
call npx cap sync android
if %ERRORLEVEL% NEQ 0 (
    echo [!] Capacitor sync failed!
    pause
    exit /b 1
)

:: 3. Assemble APK
echo [*] Step 3/3: Assembling Android Debug APK...
cd /d "%~dp0android"
call gradlew.bat assembleDebug

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo   BUILD SUCCESSFUL!
    echo ========================================================
    echo APK Location:
    echo %~dp0android\app\build\outputs\apk\debug\app-debug.apk
    echo.
    explorer /select,"%~dp0android\app\build\outputs\apk\debug\app-debug.apk"
) else (
    echo.
    echo [!] Gradle build failed. Check that Android SDK and JDK 17+ are configured.
)

pause
