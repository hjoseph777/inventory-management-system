#!/bin/bash

echo "🔧 Fixing deployment issues for GitHub Pages..."

# Step 1: Delete package-lock.json if it exists
echo "Removing package-lock.json..."
if [ -f package-lock.json ]; then
  rm package-lock.json
  echo "  ✅ package-lock.json deleted"
else
  echo "  ℹ️ package-lock.json not found, skipping"
fi

# Step 2: Delete node_modules folder
echo "Removing node_modules directory..."
if [ -d node_modules ]; then
  rm -rf node_modules
  echo "  ✅ node_modules deleted"
else
  echo "  ℹ️ node_modules not found, skipping"
fi

# Step 3: Create proper tsconfig.json
echo "Creating proper tsconfig.json..."
cat > tsconfig.json << 'EOL'
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": [
    "src"
  ]
}
EOL
echo "  ✅ tsconfig.json created"

# Step 4: Update package.json with compatible TypeScript version and OpenSSL legacy provider
echo "Updating package.json..."
cat > package.json << 'EOL'
{
  "homepage": "https://hjoseph777.github.io/inventory-management-system",
  "name": "inventory-management-system",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "start": "set NODE_OPTIONS=--openssl-legacy-provider && react-scripts start",
    "build": "set NODE_OPTIONS=--openssl-legacy-provider && react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "dev": "set NODE_OPTIONS=--openssl-legacy-provider && react-scripts start",
    "predeploy": "set NODE_OPTIONS=--openssl-legacy-provider && npm run build",
    "deploy": "gh-pages -d build"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.15.0",
    "react-scripts": "4.0.3",
    "typescript": "^4.1.2"
  },
  "devDependencies": {
    "@types/node": "^14.14.41",
    "@types/react": "^17.0.3",
    "@types/react-dom": "^17.0.3",
    "gh-pages": "^6.3.0"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
EOL
echo "  ✅ package.json updated"

# Step 5: Create .env file with needed configuration
echo "Creating .env file..."
cat > .env << 'EOL'
SKIP_PREFLIGHT_CHECK=true
GENERATE_SOURCEMAP=false
EOL
echo "  ✅ .env file created"

# Step 6: Reinstall dependencies
echo "Reinstalling dependencies..."
npm install
echo "  ✅ Dependencies reinstalled"

# Step 7: Run the build to test
echo "Testing build process..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
  # Windows
  set NODE_OPTIONS=--openssl-legacy-provider && npm run build
else
  # Mac/Linux
  NODE_OPTIONS=--openssl-legacy-provider npm run build
fi

if [ $? -eq 0 ]; then
  echo "  ✅ Build successful!"
else
  echo "  ❌ Build failed. Additional troubleshooting may be needed."
  exit 1
fi

echo ""
echo "🎉 Setup completed successfully!"
echo "You can now run 'npm run deploy' to deploy to GitHub Pages."
