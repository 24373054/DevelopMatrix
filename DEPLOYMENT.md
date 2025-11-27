# 刻熵科技官网部署指南

## 当前状态

✅ **应用已启动并运行在端口 3108**

- 本地访问: http://localhost:3108
- 域名: develop.matrixlab.work (需要配置SSL后通过HTTPS访问)

## 完成的功能

### 1. 核心功能
- ✅ 响应式现代化设计
- ✅ 深色/浅色主题切换（跟随系统 + 手动切换）
- ✅ 中英文双语支持（手动切换）
- ✅ 玻璃态UI设计（低对比度、透明度、融合式组件）
- ✅ 流畅的滚动动画效果

### 2. 页面内容
- ✅ 首页Hero区域
- ✅ 关于我们
- ✅ 业务领域（包含所有链接）
  - Matrix Lab 实验室官网
  - MATRIXLAB EXCHANGE 旗下平台
  - 瀛州纪游戏
  - 开发者社区
- ✅ 团队成员（创始人简历链接）
- ✅ 公司公告
- ✅ 相关链接汇总（包含GitHub开源地址）
- ✅ 页脚备案信息

### 3. 技术实现
- ✅ Next.js 14 (React 18)
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Framer Motion 动画
- ✅ next-intl 国际化
- ✅ next-themes 主题管理

## 下一步：配置SSL证书

### 方法1：自动配置（推荐）

```bash
cd /home/ubuntu/yz/Web3/刻熵科技官网
sudo ./setup-ssl.sh
```

这将自动完成：
1. 安装certbot（如果未安装）
2. 获取Let's Encrypt SSL证书
3. 配置nginx
4. 设置证书自动续期

### 方法2：手动配置

```bash
# 1. 安装certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# 2. 获取SSL证书
sudo certbot certonly --standalone -d develop.matrixlab.work

# 3. 复制nginx配置
sudo cp nginx.conf /etc/nginx/sites-available/develop.matrixlab.work
sudo ln -s /etc/nginx/sites-available/develop.matrixlab.work /etc/nginx/sites-enabled/

# 4. 测试并重启nginx
sudo nginx -t
sudo systemctl restart nginx
```

## 管理命令

### 启动服务
```bash
./start-all.sh
```

### 停止服务
```bash
./stop-all.sh
```

### 查看日志
```bash
tail -f logs/app.log
```

### 重启服务
```bash
./stop-all.sh && ./start-all.sh
```

## 端口使用

- **3108**: Next.js应用（仅此端口，不影响其他服务）
- **80**: HTTP（nginx，重定向到HTTPS）
- **443**: HTTPS（nginx，反向代理到3108）

## 访问地址

配置SSL后：
- **HTTPS**: https://develop.matrixlab.work
- **HTTP**: http://develop.matrixlab.work (自动重定向到HTTPS)

## 备案信息

已集成在网站底部：
- 备案号: 京公网安备11010802046489号
- 备案图标: /public/beian-icon.png
- 链接: https://beian.mps.gov.cn/#/query/webSearch?code=11010802046489

## 注意事项

1. **端口独占**: 脚本只管理3108端口，不会影响服务器上的其他服务
2. **SSL证书**: 需要确保域名DNS已正确解析到服务器IP
3. **防火墙**: 确保80和443端口已开放
4. **自动续期**: certbot会自动设置证书续期，无需手动操作

## 故障排查

### 应用无法启动
```bash
# 查看日志
cat logs/app.log

# 检查端口占用
lsof -i :3108
```

### SSL证书问题
```bash
# 检查证书状态
sudo certbot certificates

# 手动续期
sudo certbot renew
```

### Nginx配置问题
```bash
# 测试配置
sudo nginx -t

# 查看nginx日志
sudo tail -f /var/log/nginx/develop.matrixlab.work.error.log
```

## 更新部署

```bash
# 1. 停止服务
./stop-all.sh

# 2. 拉取最新代码（如果使用git）
git pull

# 3. 安装依赖（如有更新）
npm install

# 4. 重新构建
npm run build

# 5. 启动服务
./start-all.sh
```

## 联系方式

- 创始人: https://24373054.github.io/
- GitHub: https://github.com/24373054/Web3-games
