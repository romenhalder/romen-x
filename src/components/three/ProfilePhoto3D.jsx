import { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useThemeStore } from '../../store/themeStore';

/**
 * ProfilePhoto3D — A large, animated, CSS-based profile photo with neon glow.
 * No nested Canvas — renders as a pure DOM component to avoid conflicts with the
 * main Hero Canvas. Uses CSS animations for float, pulse, and glow.
 */
export function ProfilePhoto3D({ size = 320 }) {
  const { theme } = useThemeStore();
  const [photoUrl, setPhotoUrl] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const isOcean = theme === 'ocean';
  const accent = isOcean ? '#0EA5E9' : '#C77DFF';
  const accent2 = isOcean ? '#38BDF8' : '#A855F7';
  const glowColor = isOcean ? 'rgba(14,165,233,' : 'rgba(199,125,255,';

  // Try to dynamically load the profile photo
  useEffect(() => {
    import('../../assets/profile-photo.jpg')
      .then((mod) => setPhotoUrl(mod.default))
      .catch(() => setPhotoUrl(null));
  }, []);

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Romen Halder profile photo"
    >
      {/* Outer pulsing glow */}
      <div
        className="hero-photo-glow"
        style={{
          position: 'absolute',
          inset: '-12%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${glowColor}0.25) 0%, ${glowColor}0.08) 40%, transparent 70%)`,
          animation: 'heroPhotoGlow 3s ease-in-out infinite',
          transition: 'all 0.5s ease',
          transform: isHovered ? 'scale(1.08)' : 'scale(1)',
        }}
      />

      {/* Rotating ring 1 — outer dashed */}
      <div
        style={{
          position: 'absolute',
          inset: '-6%',
          borderRadius: '50%',
          border: `2px dashed ${glowColor}0.35)`,
          animation: 'heroRingSpin 20s linear infinite',
        }}
      />

      {/* Rotating ring 2 — inner solid thin */}
      <div
        style={{
          position: 'absolute',
          inset: '-2%',
          borderRadius: '50%',
          border: `1.5px solid ${glowColor}0.6)`,
          animation: 'heroRingSpin 14s linear infinite reverse',
        }}
      />

      {/* Rotating ring 3 — partial arc */}
      <div
        style={{
          position: 'absolute',
          inset: '-9%',
          borderRadius: '50%',
          border: `2px solid transparent`,
          borderTop: `2px solid ${accent}`,
          borderRight: `2px solid ${accent2}`,
          animation: 'heroRingSpin 8s linear infinite',
          opacity: 0.7,
        }}
      />

      {/* Floating dots on orbit */}
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <div
          key={deg}
          style={{
            position: 'absolute',
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: accent,
            boxShadow: `0 0 8px ${accent}, 0 0 16px ${accent}`,
            top: '50%',
            left: '50%',
            transform: `rotate(${deg}deg) translateX(${size * 0.54}px) translateY(-50%)`,
            animation: `heroRingSpin 12s linear infinite`,
            opacity: 0.8,
          }}
        />
      ))}

      {/* Main photo container */}
      <div
        className="hero-photo-float"
        style={{
          width: size * 0.82,
          height: size * 0.82,
          borderRadius: '50%',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 2,
          border: `3px solid ${glowColor}0.6)`,
          boxShadow: `
            0 0 20px ${glowColor}0.5),
            0 0 40px ${glowColor}0.3),
            0 0 80px ${glowColor}0.15),
            inset 0 0 30px ${glowColor}0.1)
          `,
          animation: 'heroPhotoFloat 5s ease-in-out infinite',
          transition: 'transform 0.4s ease, box-shadow 0.4s ease',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        }}
      >
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Romen Halder"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              filter: `brightness(1.05) contrast(1.05) saturate(1.1)`,
            }}
            draggable={false}
          />
        ) : (
          /* Placeholder with initials */
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `radial-gradient(circle at 40% 35%, #1a2a4a, #071220)`,
              position: 'relative',
            }}
          >
            {/* Silhouette */}
            <svg viewBox="0 0 200 200" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <circle cx="100" cy="72" r="35" fill="#2a3f60" />
              <ellipse cx="100" cy="160" rx="52" ry="55" fill="#2a3f60" />
            </svg>
            <span
              style={{
                position: 'relative',
                zIndex: 2,
                fontSize: size * 0.18,
                fontWeight: 900,
                fontFamily: '"Space Grotesk", monospace',
                color: accent,
                textShadow: `0 0 20px ${accent}, 0 0 40px ${accent}`,
              }}
            >
              RH
            </span>
          </div>
        )}

        {/* Hover scan-line overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: isHovered
              ? `linear-gradient(180deg, transparent 0%, ${glowColor}0.1) 50%, transparent 100%)`
              : 'none',
            pointerEvents: 'none',
            transition: 'background 0.4s ease',
          }}
        />
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes heroPhotoFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.02); }
        }
        @keyframes heroPhotoGlow {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes heroRingSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
