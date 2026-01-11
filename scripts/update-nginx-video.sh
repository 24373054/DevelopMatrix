#!/bin/bash

# MatrixAgent 视频优化 - Nginx 配置更新脚本
# 此脚本会安全地更新 nginx 配置，不影响现有服务

set -e  # 遇到错误立即退出

echo "🔧 MatrixAgent Nginx 视频优化配置"
echo "=================================="
echo ""

# 检查是否以 root 权限运行
if [ "$EUID" -ne 0 ]; then 
    echo "❌ 请使用 sudo 运行此脚本"
    echo "   sudo ./scripts/update-nginx-video.sh"
    exit 1
fi

# 配置文件路径
NGINX_CONF="/etc/nginx/sites-available/develop.matrixlab.work"
BACKUP_CONF="/etc/nginx/sites-available/develop.matrixlab.work.backup-$(date +%Y%m%d-%H%M%S)"
NEW_CONF="nginx-develop-updated.conf"

# 检查新配置文件是否存在
if [ ! -f "$NEW_CONF" ]; then
    echo "❌ 找不到新配置文件: $NEW_CONF"
    exit 1
fi

echo "📋 当前配置: $NGINX_CONF"
echo "💾 备份位置: $BACKUP_CONF"
echo "📝 新配置: $NEW_CONF"
echo ""

# 备份现有配置
echo "1️⃣  备份现有配置..."
cp "$NGINX_CONF" "$BACKUP_CONF"
echo "   ✅ 备份完成"
echo ""

# 显示配置差异
echo "2️⃣  配置变更预览："
echo "   ----------------------------------------"
diff -u "$NGINX_CONF" "$NEW_CONF" || true
echo "   ----------------------------------------"
echo ""

# 确认更新
read -p "❓ 是否继续更新配置？(y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 取消更新"
    rm "$BACKUP_CONF"
    exit 0
fi

# 更新配置
echo "3️⃣  更新配置文件..."
cp "$NEW_CONF" "$NGINX_CONF"
echo "   ✅ 配置已更新"
echo ""

# 测试配置
echo "4️⃣  测试 Nginx 配置..."
if nginx -t; then
    echo "   ✅ 配置测试通过"
else
    echo "   ❌ 配置测试失败，正在恢复备份..."
    cp "$BACKUP_CONF" "$NGINX_CONF"
    echo "   ✅ 已恢复原配置"
    exit 1
fi
echo ""

# 重载 Nginx
echo "5️⃣  重载 Nginx..."
if systemctl reload nginx; then
    echo "   ✅ Nginx 重载成功"
else
    echo "   ❌ Nginx 重载失败，正在恢复备份..."
    cp "$BACKUP_CONF" "$NGINX_CONF"
    systemctl reload nginx
    echo "   ✅ 已恢复原配置"
    exit 1
fi
echo ""

# 验证服务状态
echo "6️⃣  验证服务状态..."
if systemctl is-active --quiet nginx; then
    echo "   ✅ Nginx 运行正常"
else
    echo "   ❌ Nginx 未运行"
    exit 1
fi
echo ""

echo "✅ 配置更新完成！"
echo ""
echo "📊 更新内容："
echo "   • 视频文件防盗链保护"
echo "   • 视频流速率限制 (2MB/s)"
echo "   • 静态资源缓存优化"
echo "   • 不影响现有功能"
echo ""
echo "💡 提示："
echo "   • 备份文件: $BACKUP_CONF"
echo "   • 如需回滚: sudo cp $BACKUP_CONF $NGINX_CONF && sudo systemctl reload nginx"
echo "   • 查看日志: sudo tail -f /var/log/nginx/develop.matrixlab.work.access.log"
echo ""
