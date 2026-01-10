#!/bin/bash

# API Key Setup Script
# Helps users securely configure their DeepSeek API key

set -e

echo "═══════════════════════════════════════════════════════════════"
echo "           DeepSeek API Key Setup                              "
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Check if .env.local already exists
if [ -f .env.local ]; then
    echo "⚠️  .env.local already exists!"
    echo ""
    read -p "Do you want to overwrite it? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

# Copy from example if it exists
if [ -f .env.example ]; then
    cp .env.example .env.local
    echo "✅ Created .env.local from .env.example"
else
    # Create from scratch
    cat > .env.local << 'EOF'
# DeepSeek API Configuration
# Get your API key from: https://platform.deepseek.com/
DEEPSEEK_API_KEY=your-api-key-here
DEEPSEEK_API_BASE=https://api.deepseek.com/v1

# Next.js Configuration
NEXT_PUBLIC_SITE_URL=https://develop.matrixlab.work
EOF
    echo "✅ Created .env.local"
fi

echo ""
echo "📝 Next steps:"
echo ""
echo "1. Get your API key from: https://platform.deepseek.com/"
echo "2. Edit .env.local and replace 'your-api-key-here' with your actual key"
echo "3. Save the file"
echo ""
echo "To edit .env.local:"
echo "  nano .env.local"
echo "  # or"
echo "  vim .env.local"
echo "  # or use your preferred editor"
echo ""
echo "⚠️  SECURITY REMINDER:"
echo "  • Never commit .env.local to git"
echo "  • Never share your API key"
echo "  • Keep your API key secure"
echo ""
echo "To verify setup:"
echo "  npm run ai-create-article"
echo ""
echo "═══════════════════════════════════════════════════════════════"
