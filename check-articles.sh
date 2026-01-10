#!/bin/bash

echo "📚 检查文章状态..."
echo ""

# 检查 messages 文件
echo "1️⃣  检查 messages/zh.json 中的文章："
node -e "
const data = require('./messages/zh.json');
const articles = data.blog?.articles || {};
console.log('   总数:', Object.keys(articles).length);
console.log('');
console.log('   文章列表:');
Object.keys(articles).forEach((id, i) => {
  console.log('   ' + (i+1) + '. ' + articles[id].title);
  console.log('      ID: ' + id);
});
"

echo ""
echo "2️⃣  检查构建状态："
if [ -d ".next" ]; then
    echo "   ✅ 构建文件存在"
else
    echo "   ❌ 构建文件不存在，请运行: npm run build"
fi

echo ""
echo "3️⃣  启动生产服务器："
echo "   运行: npm run start"
echo "   或者: ./start-production.sh"
echo ""
echo "4️⃣  访问地址："
echo "   所有文章: http://localhost:3108/zh/blog"
echo "   新文章: http://localhost:3108/zh/blog/otc的尽头是合规化-反洗钱正成为行业亟须"
