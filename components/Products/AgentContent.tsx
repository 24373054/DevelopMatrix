'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Shield, Brain, TrendingUp, ArrowRight, PlayCircle, Lock } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function AgentContent() {
  const t = useTranslations('agent');
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const demoSectionRef = useRef<HTMLElement>(null);

  const scrollToDemo = () => {
    demoSectionRef.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  };

  const features = [
    {
      key: 'prescreening',
      icon: <Shield className="w-10 h-10 text-red-400" />,
    },
    {
      key: 'ai',
      icon: <Brain className="w-10 h-10 text-purple-400" />,
    },
    {
      key: 'traffic',
      icon: <TrendingUp className="w-10 h-10 text-green-400" />,
    },
  ];

  // 视频水印效果 - 动态移动的 MatrixLab 水印
  useEffect(() => {
    if (!videoRef.current || !canvasRef.current || !isPlaying) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    let animationId: number;
    
    const drawWatermark = () => {
      if (video.paused || video.ended) {
        setIsPlaying(false);
        return;
      }
      
      // 设置画布尺寸
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
      
      // 绘制视频帧
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // 动态水印 - 使用时间戳创建移动效果
      const time = Date.now() / 1000;
      const text = 'MatrixLab';
      
      // 多个水印位置
      const positions = [
        {
          x: (Math.sin(time * 0.5) * 0.3 + 0.5) * canvas.width,
          y: (Math.cos(time * 0.3) * 0.3 + 0.5) * canvas.height,
        },
        {
          x: (Math.sin(time * 0.7 + Math.PI) * 0.3 + 0.5) * canvas.width,
          y: (Math.cos(time * 0.5 + Math.PI) * 0.3 + 0.5) * canvas.height,
        },
      ];
      
      positions.forEach((pos, index) => {
        ctx.save();
        ctx.font = 'bold 32px Arial';
        ctx.fillStyle = `rgba(255, 255, 255, ${0.15 + Math.sin(time + index) * 0.05})`;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // 添加旋转效果
        ctx.translate(pos.x, pos.y);
        ctx.rotate(Math.sin(time * 0.2 + index) * 0.1);
        
        ctx.strokeText(text, 0, 0);
        ctx.fillText(text, 0, 0);
        ctx.restore();
      });
      
      animationId = requestAnimationFrame(drawWatermark);
    };

    drawWatermark();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPlaying]);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center md:text-left"
          >
            <div className="inline-block px-4 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold mb-6">
              {t('hero.badge')}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              {t('hero.title')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mt-2">
                {t('hero.subtitle')}
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto md:mx-0">
              {t('hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <a
                href="https://agent.matrixlab.work/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 flex items-center gap-2"
              >
                <span>{t('hero.cta_start')}</span>
                <ArrowRight size={20} />
              </a>
              <button 
                onClick={scrollToDemo}
                className="px-8 py-4 rounded-full bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 transition-colors flex items-center gap-2 backdrop-blur-sm"
              >
                <PlayCircle size={20} />
                <span>{t('hero.cta_demo')}</span>
              </button>
            </div>
          </motion.div>

          {/* Visual/Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex-1 w-full max-w-xl"
          >
             <div className="relative aspect-[4/3] rounded-2xl bg-black border border-zinc-800 shadow-2xl overflow-hidden group">
                {/* 背景网格 */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                
                {/* 扫描线效果 */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent animate-pulse" style={{ animationDuration: '3s' }} />
                
                <div className="relative h-full flex flex-col p-6">
                  {/* 顶部状态栏 */}
                  <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                       <span className="text-xs font-mono text-zinc-400 tracking-wider">RISK MONITOR</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="text-[10px] font-mono text-zinc-500">LIVE</div>
                       <div className="w-1 h-1 rounded-full bg-red-500" />
                    </div>
                  </div>
                  
                  {/* 风险评估表格 */}
                  <div className="flex-1 space-y-2">
                    {/* 表头 */}
                    <div className="grid grid-cols-12 gap-2 text-[10px] font-mono text-zinc-600 uppercase tracking-wider pb-2">
                      <div className="col-span-6">Address</div>
                      <div className="col-span-3">Score</div>
                      <div className="col-span-3 text-right">Status</div>
                    </div>
                    
                    {/* 数据行 - Safe */}
                    <div className="grid grid-cols-12 gap-2 items-center py-2.5 px-3 bg-zinc-900/50 border border-zinc-800/50 hover:border-green-500/20 transition-colors">
                      <div className="col-span-6 font-mono text-xs text-zinc-300">0x1a2b...3c4d</div>
                      <div className="col-span-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: '85%' }} />
                          </div>
                          <span className="text-[10px] font-mono text-green-400">85</span>
                        </div>
                      </div>
                      <div className="col-span-3 text-right">
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-green-400 bg-green-500/10 px-2 py-0.5 rounded">
                          <div className="w-1 h-1 rounded-full bg-green-400" />
                          SAFE
                        </span>
                      </div>
                    </div>
                    
                    {/* 数据行 - Caution */}
                    <div className="grid grid-cols-12 gap-2 items-center py-2.5 px-3 bg-zinc-900/50 border border-zinc-800/50 hover:border-yellow-500/20 transition-colors">
                      <div className="col-span-6 font-mono text-xs text-zinc-300">0x5e6f...7g8h</div>
                      <div className="col-span-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500" style={{ width: '45%' }} />
                          </div>
                          <span className="text-[10px] font-mono text-yellow-400">45</span>
                        </div>
                      </div>
                      <div className="col-span-3 text-right">
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded">
                          <div className="w-1 h-1 rounded-full bg-yellow-400" />
                          WARN
                        </span>
                      </div>
                    </div>
                    
                    {/* 数据行 - High Risk */}
                    <div className="grid grid-cols-12 gap-2 items-center py-2.5 px-3 bg-zinc-900/50 border border-red-500/20 hover:border-red-500/40 transition-colors">
                      <div className="col-span-6 font-mono text-xs text-zinc-300">0x9i0j...1k2l</div>
                      <div className="col-span-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500" style={{ width: '12%' }} />
                          </div>
                          <span className="text-[10px] font-mono text-red-400">12</span>
                        </div>
                      </div>
                      <div className="col-span-3 text-right">
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
                          <div className="w-1 h-1 rounded-full bg-red-400 animate-pulse" />
                          BLOCK
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 底部统计 */}
                  <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-[10px] font-mono text-zinc-500">2.4K SAFE</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                        <span className="text-[10px] font-mono text-zinc-500">156 WARN</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <span className="text-[10px] font-mono text-zinc-500">43 BLOCK</span>
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-zinc-600">v2.1.0</div>
                  </div>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-foreground/5 border-y border-foreground/5">
         <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {features.map((feature, index) => (
                  <motion.div
                    key={feature.key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center md:text-left"
                  >
                     <div className="mb-6 inline-flex p-4 rounded-2xl bg-zinc-950 dark:bg-black border border-foreground/10 shadow-xl">
                        {feature.icon}
                     </div>
                     <h3 className="text-xl font-bold mb-4">{t(`features.${feature.key}.title`)}</h3>
                     <p className="text-muted-foreground leading-relaxed">
                        {t(`features.${feature.key}.desc`)}
                     </p>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Video Demo Section */}
      <section ref={demoSectionRef} className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('demo.title')}</h2>
            <p className="text-muted-foreground">{t('demo.description')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden shadow-2xl border border-foreground/10"
            onContextMenu={(e) => e.preventDefault()}
          >
            {/* 防下载和防截图遮罩层 */}
            <div 
              className="absolute inset-0 z-10 pointer-events-none select-none"
              style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
            />
            
            {/* 视频播放器容器 */}
            <div className="relative bg-black aspect-video">
              {/* 播放按钮覆盖层 */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/80 via-black/60 to-black/80 backdrop-blur-sm z-20">
                  <button
                    onClick={handlePlayVideo}
                    className="group px-12 py-6 rounded-full bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold hover:from-red-700 hover:to-orange-700 transition-all shadow-2xl shadow-red-500/30 flex items-center gap-3 transform hover:scale-105"
                  >
                    <PlayCircle size={32} className="group-hover:scale-110 transition-transform" />
                    <span className="text-xl">{t('demo.play')}</span>
                  </button>
                </div>
              )}
              
              {/* 视频元素 - 隐藏原生控件 */}
              <video
                ref={videoRef}
                className="w-full h-full object-contain"
                style={{ display: isPlaying ? 'none' : 'block' }}
                controlsList="nodownload nofullscreen noremoteplayback"
                disablePictureInPicture
                disableRemotePlayback
                onContextMenu={(e) => e.preventDefault()}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                playsInline
                preload="metadata"
                crossOrigin="anonymous"
              >
                <source src="/videos/agent-demo.mp4" type="video/mp4" />
                您的浏览器不支持视频播放
              </video>
              
              {/* 带水印的画布 - 实际显示的内容 */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none select-none"
                style={{ 
                  display: isPlaying ? 'block' : 'none',
                  userSelect: 'none',
                  WebkitUserSelect: 'none'
                }}
                onContextMenu={(e) => e.preventDefault()}
              />
              
              {/* 自定义控制栏 */}
              {isPlaying && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-30">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        if (videoRef.current) {
                          if (videoRef.current.paused) {
                            videoRef.current.play();
                          } else {
                            videoRef.current.pause();
                          }
                        }
                      }}
                      className="text-white hover:text-red-400 transition-colors"
                    >
                      {videoRef.current?.paused ? (
                        <PlayCircle size={24} />
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="6" y="4" width="4" height="16" />
                          <rect x="14" y="4" width="4" height="16" />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: '0%' }} />
                    </div>
                    <div className="text-white text-sm font-mono">
                      MatrixAgent Demo
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
