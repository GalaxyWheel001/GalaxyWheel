'use client';

import { motion } from 'framer-motion';

export function CosmicDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Floating Asteroids */}
      <motion.div
        className="absolute top-20 left-10 w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 opacity-60"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          boxShadow: '0 0 15px rgba(156, 163, 175, 0.4)'
        }}
      />

      <motion.div
        className="absolute top-32 right-16 w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 opacity-70"
        animate={{
          y: [0, 15, 0],
          rotate: [0, -360],
          scale: [1, 0.9, 1]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        style={{
          boxShadow: '0 0 12px rgba(168, 85, 247, 0.5)'
        }}
      />

      <motion.div
        className="absolute bottom-32 left-20 w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 opacity-50"
        animate={{
          y: [0, -25, 0],
          rotate: [0, 180],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
        style={{
          boxShadow: '0 0 18px rgba(251, 146, 60, 0.4)'
        }}
      />

      {/* Cosmic Spaceship */}
      <motion.div
        className="absolute top-1/4 right-10"
        animate={{
          y: [0, -30, 0],
          x: [0, -10, 0],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="relative">
          {/* Spaceship Body */}
          <div
            className="w-16 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full relative"
            style={{
              clipPath: 'polygon(0% 50%, 20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%)',
              boxShadow: '0 0 20px rgba(34, 211, 238, 0.6)'
            }}
          />

          {/* Engine Trail */}
          <motion.div
            className="absolute -left-8 top-1/2 transform -translate-y-1/2 w-8 h-1"
            style={{
              background: 'linear-gradient(to left, rgba(34, 211, 238, 0.8), transparent)',
              boxShadow: '0 0 10px rgba(34, 211, 238, 0.8)'
            }}
            animate={{
              scaleX: [1, 1.5, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Cockpit */}
          <div
            className="absolute top-1 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full opacity-80"
            style={{
              boxShadow: '0 0 8px rgba(253, 224, 71, 0.8)'
            }}
          />
        </div>
      </motion.div>

      {/* Floating Particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Nebula Effects */}
      <div
        className="absolute top-10 right-1/4 w-32 h-32 rounded-full opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)'
        }}
      />

      <div
        className="absolute bottom-20 left-1/3 w-40 h-40 rounded-full opacity-15 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, transparent 70%)'
        }}
      />
    </div>
  );
}
