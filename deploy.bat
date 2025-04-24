@echo off
echo Running deployment for Inventory Management System...

rem Clean previous build files
if exist "build" rmdir /s /q build
if exist "node_modules\.cache" rmdir /s /q node_modules\.cache

rem Set environment variable for OpenSSL legacy provider
set NODE_OPTIONS=--openssl-legacy-provider

rem Run the build and deploy commands
call npm run build
if %errorlevel% neq 0 (
  echo Build failed with error code %errorlevel%
  exit /b %errorlevel%
)

echo Build completed successfully, deploying to GitHub Pages...
call npm run deploy

echo Deployment process completed!
