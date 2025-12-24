'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ChristmasDecoration() {
  const [snowflakes, setSnowflakes] = useState<Array<{ id: number; left: number; delay: number; duration: number; size: number }>>([]);

  useEffect(() => {
    // 生成雪花
    const flakes = Array.from({ length: 30 }, (_, i) => ({
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
      {/* 雪花效果 - 仅在首屏 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ height: '100vh' }}>
        {snowflakes.map((flake) => (
          <motion.div
            key={flake.id}
            className="absolute text-white/40 dark:text-white/60"
            style={{
              left: `${flake.left}%`,
              top: '-10px',
              fontSize: `${flake.size}px`,
            }}
            animate={{
              y: ['0vh', '110vh'],
              x: [0, Math.sin(flake.id) * 30],
              rotate: [0, 360],
            }}
            transition={{
              duration: flake.duration,
              delay: flake.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            ❄
          </motion.div>
        ))}
      </div>
    </>
  );
}
