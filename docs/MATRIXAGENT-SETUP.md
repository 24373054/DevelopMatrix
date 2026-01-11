# MatrixAgent 产品页面配置指南

## 📋 概述

MatrixAgent 是专为 OTC 商家设计的链上风控系统产品页面，包含以下特性：

- ✅ 响应式设计，适配移动端和桌面端
- ✅ 动态水印视频播放器
- ✅ 防下载和防盗链保护
- ✅ 多语言支持（中文/英文）
- ✅ SEO 优化和结构化数据
- ✅ 流畅的动画效果

## 🚀 快速开始

### 1. 访问页面

- **中文版**: https://develop.matrixlab.work/zh/products/agent
- **英文版**: https://develop.matrixlab.work/en/products/agent
- **产品链接**: https://agent.matrixlab.work

### 2. 文件结构

```
├── app/[locale]/products/agent/
│   └── page.tsx                    # 产品页面路由
├── components/Products/
│   └── AgentContent.tsx            # 产品内容组件
├── public/
│   ├── videos/
│   │   └── agent-demo.mp4         # 演示视频
│   ├── agent-hero.png             # 英雄区图片
│   ├── agent-feature-*.png        # 功能特性图片
│   └── og-agent.jpg               # Open Graph 图片
├── messages/
│   ├── zh.json                    # 中文翻译
│   └── en.json                    # 英文翻译
└── docs/
    └── MATRIXAGENT-SETUP.md       # 本文档
```

## 🎬 视频配置

### 视频优化（可选）

如果需要优化视频，可以安装 ffmpeg 并运行优化脚本：

```bash
# 安装 ffmpeg（可选）
sudo apt-get update
sudo apt-get install ffmpeg

# 运行优化脚本
./scripts/optimize-video.sh
```

这将生成：
- `agent-demo-optimized.mp4` - Web 优化版本（推荐使用）
- `agent-demo-preview.mp4` - 低质量预览版本
- `agent-demo-thumbnail.jpg` - 视频缩略图
- `agent-demo.webm` - WebM 格式（备用）

**注意**: 如果不安装 ffmpeg，现有的视频文件可以直接使用，页面功能不受影响。

### 视频防护特性

1. **防下载保护**
   - 禁用右键菜单
   - 禁用浏览器下载控件
   - 禁用画中画模式
   - 禁用远程播放

2. **动态水印**
   - 实时渲染的 MatrixLab 水印
   - 动态移动位置（防止裁剪）
   - 半透明效果（不影响观看）
   - 多个水印位置

3. **防盗链**
   - Nginx 配置限制来源域名
   - 限制播放速率
   - 禁止直接访问视频 URL

### Nginx 配置

将 `nginx-video-config.conf` 中的配置添加到你的 nginx 配置文件：

```bash
# 编辑 nginx 配置
sudo nano /etc/nginx/sites-available/your-site.conf

# 添加视频配置后重启 nginx
sudo nginx -t
sudo systemctl reload nginx
```

## 🎨 自定义内容

### 修改文案

编辑翻译文件：

**中文** (`messages/zh.json`):
```json
{
  "agent": {
    "hero": {
      "title": "你的标题",
      "description": "你的描述"
    }
  }
}
```

**英文** (`messages/en.json`):
```json
{
  "agent": {
    "hero": {
      "title": "Your Title",
      "description": "Your Description"
    }
  }
}
```

### 修改视频

替换 `public/videos/agent-demo.mp4` 文件，然后运行优化脚本：

```bash
./scripts/optimize-video.sh
```

### 修改图片

替换以下文件：
- `public/agent-hero.png` - 英雄区展示图
- `public/agent-feature-1.png` - 功能特性图 1
- `public/agent-feature-2.png` - 功能特性图 2
- `public/agent-feature-3.png` - 功能特性图 3
- `public/og-agent.jpg` - 社交媒体分享图

## 🔧 技术细节

### 视频播放器实现

使用 Canvas API 实现带水印的视频播放：

```typescript
// 1. 隐藏原生 video 元素
// 2. 将视频帧绘制到 canvas
// 3. 在 canvas 上添加动态水印
// 4. 显示 canvas 而非原生视频
```

### 水印算法

```typescript
// 使用正弦函数创建平滑的移动轨迹
const x = (Math.sin(time * 0.5) * 0.3 + 0.5) * canvas.width;
const y = (Math.cos(time * 0.3) * 0.3 + 0.5) * canvas.height;

// 多个水印位置，相位偏移
positions.forEach((pos, index) => {
  // 动态透明度
  const alpha = 0.15 + Math.sin(time + index) * 0.05;
  // 轻微旋转
  const rotation = Math.sin(time * 0.2 + index) * 0.1;
});
```

### 性能优化

1. **视频预加载**
   - 使用 `preload="metadata"` 只加载元数据
   - 点击播放后才加载完整视频

2. **Canvas 优化**
   - 只在播放时渲染 canvas
   - 使用 `requestAnimationFrame` 优化帧率
   - 暂停时取消动画循环

3. **资源优化**
   - 图片使用 WebP 格式（如果支持）
   - 视频使用 H.264 编码
   - 启用 Nginx gzip 压缩

## 🔒 安全配置

### 1. Nginx 防盗链

```nginx
valid_referers none blocked server_names
               *.matrixlab.work
               develop.matrixlab.work;
if ($invalid_referer) {
    return 403;
}
```

### 2. 速率限制

```nginx
limit_rate 2m;  # 限制为 2MB/s
```

### 3. 禁用直接下载

```nginx
add_header Content-Disposition 'inline';
add_header X-Content-Type-Options 'nosniff';
```

## 📊 SEO 优化

页面已包含：

1. **结构化数据** (JSON-LD)
   - SoftwareApplication schema
   - 产品信息和评分

2. **Open Graph 标签**
   - 社交媒体分享优化
   - 自定义预览图

3. **多语言支持**
   - hreflang 标签
   - 规范化 URL

4. **关键词优化**
   - blockchain forensics
   - AML, risk control
   - OTC security

## 🐛 故障排查

### 视频无法播放

1. 检查视频文件是否存在：
   ```bash
   ls -lh public/videos/agent-demo.mp4
   ```

2. 检查视频格式：
   ```bash
   ffmpeg -i public/videos/agent-demo.mp4
   ```

3. 检查浏览器控制台错误

### 水印不显示

1. 确保视频正在播放
2. 检查 canvas 元素是否可见
3. 查看浏览器控制台是否有 Canvas API 错误

### 页面加载慢

1. 运行视频优化脚本
2. 启用 Nginx gzip 压缩
3. 使用 CDN 加速静态资源

## 📝 更新日志

### v1.0.0 (2026-01-11)
- ✅ 初始版本发布
- ✅ 动态水印视频播放器
- ✅ 防下载和防盗链保护
- ✅ 中英文双语支持
- ✅ 响应式设计
- ✅ SEO 优化

## 🔗 相关链接

- **产品页面**: https://develop.matrixlab.work/zh/products/agent
- **产品应用**: https://agent.matrixlab.work
- **GitHub**: https://github.com/24373054/Matrix-Agent
- **技术文档**: 产品介绍/Matrix/MatrixAgent.md

## 💬 联系方式

如有问题或建议，请联系：
- **Email**: 24373054@buaa.edu.cn
- **GitHub Issues**: https://github.com/24373054/Matrix-Agent/issues
