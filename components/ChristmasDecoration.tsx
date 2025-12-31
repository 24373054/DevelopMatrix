'use client';

import { useEffect, useState } from 'react';

export default function ChristmasDecoration() {
  const [snowflakes, setSnowflakes] = useState<Array<{ id: number; left: number; delay: number; duration: number; size: number }>>([]);

  useEffect(() => {
    // 减少雪花数量以提升性能
    const flakes = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 10,
      size: 2 + Math.random() * 4,
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <>
      {/* 雪花效果 - 使用 CSS 动画优化性能 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ height: '100vh' }}>
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="absolute text-white/40 dark:text-white/60 animate-snowfall"
            style={{
              left: `${flake.left}%`,
              top: '-10px',
              fontSize: `${flake.size}px`,
              animationDelay: `${flake.delay}s`,
              animationDuration: `${flake.duration}s`,
            }}
          >
            ❄
          </div>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes snowfall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          100% {
            transform: translateY(110vh) translateX(30px) rotate(360deg);
          }
        }
        
        .animate-snowfall {
          animation: snowfall linear infinite;
          will-change: transform;
        }
      `}</style>
    </>
  );
}
