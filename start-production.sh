#!/bin/bash

# 启动生产服务器脚本

echo "🚀 启动生产服务器..."
echo ""
echo "📋 检查构建..."

if [ ! -d ".next" ]; then
    echo "❌ 未找到构建文件，请先运行: npm run build"
    exit 1
fi

echo "✅ 构建文件存在"
echo ""
echo "🌐 启动服务器在端口 3108..."
echo "📱 访问地址: http://localhost:3108"
echo ""
echo "💡 提示:"
echo "   - 按 Ctrl+C 停止服务器"
echo "   - 查看所有文章: http://localhost:3108/zh/blog"
echo "   - 查看新文章: http://localhost:3108/zh/blog/otc的尽头是合规化-反洗钱正成为行业亟须"
echo ""

npm run start
