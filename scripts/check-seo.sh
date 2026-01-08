#!/bin/bash

# SEO 配置检查脚本

echo "🔍 检查 SEO 配置..."
echo ""

BASE_URL="https://develop.matrixlab.work"

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查函数
check_url() {
    local url=$1
    local name=$2
    
    echo -n "检查 $name... "
    
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$status" = "200" ]; then
        echo -e "${GREEN}✓ OK${NC} (HTTP $status)"
    else
        echo -e "${RED}✗ FAIL${NC} (HTTP $status)"
    fi
}

# 检查 robots.txt
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. 基础文件检查"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_url "$BASE_URL/robots.txt" "robots.txt"
check_url "$BASE_URL/sitemap.xml" "sitemap.xml"
check_url "$BASE_URL/manifest.json" "manifest.json"
echo ""

# 检查主要页面
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. 主要页面检查"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_url "$BASE_URL/zh" "中文首页"
check_url "$BASE_URL/en" "英文首页"
check_url "$BASE_URL/zh/blog" "博客列表"
check_url "$BASE_URL/zh/products/trace" "MatrixTrace"
echo ""

# 检查博客文章
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. 博客文章检查"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_url "$BASE_URL/zh/blog/benign-arbitrage-theory" "良性套利论"
check_url "$BASE_URL/zh/blog/web3-security-trends-2025" "Web3安全趋势"
check_url "$BASE_URL/zh/blog/smart-contract-audit-guide" "智能合约审计"
check_url "$BASE_URL/zh/blog/defi-risk-management" "DeFi风险管理"
echo ""

# 检查 meta 标签
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. Meta 标签检查"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo -n "检查首页 title... "
title=$(curl -s "$BASE_URL/zh" | grep -o '<title>.*</title>' | sed 's/<[^>]*>//g')
if [ -n "$title" ]; then
    echo -e "${GREEN}✓${NC} $title"
else
    echo -e "${RED}✗ 未找到${NC}"
fi

echo -n "检查首页 description... "
desc=$(curl -s "$BASE_URL/zh" | grep -o 'name="description" content="[^"]*"' | sed 's/.*content="\([^"]*\)".*/\1/')
if [ -n "$desc" ]; then
    echo -e "${GREEN}✓${NC} ${desc:0:50}..."
else
    echo -e "${RED}✗ 未找到${NC}"
fi

echo -n "检查首页 keywords... "
keywords=$(curl -s "$BASE_URL/zh" | grep -o 'name="keywords" content="[^"]*"' | sed 's/.*content="\([^"]*\)".*/\1/')
if [ -n "$keywords" ]; then
    echo -e "${GREEN}✓${NC} ${keywords:0:50}..."
else
    echo -e "${RED}✗ 未找到${NC}"
fi
echo ""

# 检查结构化数据
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. 结构化数据检查"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo -n "检查 JSON-LD... "
jsonld=$(curl -s "$BASE_URL/zh" | grep -c 'application/ld+json')
if [ "$jsonld" -gt 0 ]; then
    echo -e "${GREEN}✓${NC} 找到 $jsonld 个结构化数据"
else
    echo -e "${RED}✗ 未找到${NC}"
fi

echo -n "检查 Open Graph... "
og=$(curl -s "$BASE_URL/zh" | grep -c 'property="og:')
if [ "$og" -gt 0 ]; then
    echo -e "${GREEN}✓${NC} 找到 $og 个 OG 标签"
else
    echo -e "${RED}✗ 未找到${NC}"
fi
echo ""

# 性能检查
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6. 性能检查"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo -n "检查首页加载时间... "
load_time=$(curl -s -o /dev/null -w "%{time_total}" "$BASE_URL/zh")
echo -e "${GREEN}${load_time}s${NC}"

echo -n "检查 HTTPS... "
if curl -s "$BASE_URL/zh" | grep -q "https://"; then
    echo -e "${GREEN}✓ 已启用${NC}"
else
    echo -e "${YELLOW}⚠ 检查 HTTPS 配置${NC}"
fi
echo ""

# 建议
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 下一步建议"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. 访问 Google Search Console 提交 sitemap"
echo "2. 访问百度搜索资源平台提交 sitemap"
echo "3. 使用 Google PageSpeed Insights 测试性能"
echo "4. 使用 Google Rich Results Test 测试结构化数据"
echo ""
echo "🔗 有用的链接："
echo "   Google Search Console: https://search.google.com/search-console"
echo "   百度搜索资源平台: https://ziyuan.baidu.com/"
echo "   PageSpeed Insights: https://pagespeed.web.dev/"
echo "   Rich Results Test: https://search.google.com/test/rich-results"
echo ""
