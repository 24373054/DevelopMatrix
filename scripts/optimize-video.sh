#!/bin/bash

# 视频优化脚本 - 用于优化 MatrixAgent 演示视频
# 需要安装 ffmpeg: sudo apt-get install ffmpeg

INPUT_VIDEO="public/videos/agent-demo.mp4"
OUTPUT_DIR="public/videos"

echo "🎬 开始优化视频..."

# 1. 创建优化的 MP4 版本（H.264 编码，适合 web 播放）
echo "📹 创建 Web 优化版本..."
ffmpeg -i "$INPUT_VIDEO" \
  -c:v libx264 \
  -preset slow \
  -crf 23 \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  -vf "scale=1920:-2" \
  "$OUTPUT_DIR/agent-demo-optimized.mp4" \
  -y

# 2. 创建低质量预览版本（快速加载）
echo "🔍 创建预览版本..."
ffmpeg -i "$INPUT_VIDEO" \
  -c:v libx264 \
  -preset fast \
  -crf 28 \
  -vf "scale=640:-2" \
  -an \
  "$OUTPUT_DIR/agent-demo-preview.mp4" \
  -y

# 3. 生成视频缩略图
echo "🖼️  生成缩略图..."
ffmpeg -i "$INPUT_VIDEO" \
  -ss 00:00:03 \
  -vframes 1 \
  -vf "scale=1920:-2" \
  "$OUTPUT_DIR/agent-demo-thumbnail.jpg" \
  -y

# 4. 可选：创建 WebM 版本（更好的压缩率）
echo "🎞️  创建 WebM 版本..."
ffmpeg -i "$INPUT_VIDEO" \
  -c:v libvpx-vp9 \
  -crf 30 \
  -b:v 0 \
  -c:a libopus \
  -b:a 128k \
  -vf "scale=1920:-2" \
  "$OUTPUT_DIR/agent-demo.webm" \
  -y

echo "✅ 视频优化完成！"
echo ""
echo "生成的文件："
ls -lh "$OUTPUT_DIR"/agent-demo*

echo ""
echo "💡 建议："
echo "1. 使用 agent-demo-optimized.mp4 作为主要视频源"
echo "2. 使用 agent-demo-preview.mp4 作为预加载/预览"
echo "3. 使用 agent-demo-thumbnail.jpg 作为视频封面"
echo "4. 使用 agent-demo.webm 作为备用格式（支持的浏览器）"
