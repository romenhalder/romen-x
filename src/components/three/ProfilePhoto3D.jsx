import { useEffect, useState } from 'react';
import { useThemeStore } from '../../store/themeStore';

/**
 * ProfilePhoto3D — Large animated profile photo with theme-aware styling.
 * Day: Clean, minimal shadow & elegant ring — Apple-like
 * Night: Neon glow, rotating rings, orbital dots — Cyberpunk
 */
export function ProfilePhoto3D({ size = 320 }) {
  const { theme } = useThemeStore();
  const [photoUrl, setPhotoUrl] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const isDay = theme === 'ocean';

  // Colors per theme
  const accent = isDay ? '#2563EB' : '#C77DFF';
  const accent2 = isDay ? '#0EA5E9' : '#A855F7';
  const glowColor = isDay ? 'rgba(37,99,235,' : 'rgba(199,125,255,';

  useEffect(() => {
    import('../../assets/profile-photo.jpg')
      .then((mod) => setPhotoUrl(mod.default))
      .catch(() => setPhotoUrl(null));
  }, []);

  const photoSize = size * 0.82;

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
      {/* Outer glow — subtle for Day, intense for Night */}
      <div
        style={{
          position: 'absolute',
          inset: '-12%',
          borderRadius: '50%',
          background: isDay
            ? `radial-gradient(circle, ${glowColor}0.06) 0%, transparent 60%)`
            : `radial-gradient(circle, ${glowColor}0.25) 0%, ${glowColor}0.08) 40%, transparent 70%)`,
          animation: isDay ? 'heroPhotoGlowDay 4s ease-in-out infinite' : 'heroPhotoGlowNight 3s ease-in-out infinite',
          transition: 'all 0.5s ease',
          transform: isHovered ? 'scale(1.06)' : 'scale(1)',
        }}
      />

      {/* Ring 1 — outer dashed (Night only shows dashes, Day shows thin solid) */}
      <div
        style={{
          position: 'absolute',
          inset: '-6%',
          borderRadius: '50%',
          border: isDay
            ? `1.5px solid ${glowColor}0.12)`
            : `2px dashed ${glowColor}0.35)`,
          animation: isDay ? 'none' : 'heroRingSpin 20s linear infinite',
        }}
      />

      {/* Ring 2 — inner thin */}
      <div
        style={{
          position: 'absolute',
          inset: '-2%',
          borderRadius: '50%',
          border: isDay
            ? `1px solid ${glowColor}0.08)`
            : `1.5px solid ${glowColor}0.6)`,
          animation: isDay ? 'none' : 'heroRingSpin 14s linear infinite reverse',
        }}
      />

      {/* Ring 3 — partial arc (Night only) */}
      {!isDay && (
        <div
          style={{
            position: 'absolute',
            inset: '-9%',
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTop: `2px solid ${accent}`,
            borderRight: `2px solid ${accent2}`,
            animation: 'heroRingSpin 8s linear infinite',
            opacity: 0.7,
          }}
        />
      )}

      {/* Orbital dots (Night only) */}
      {!isDay && [0, 60, 120, 180, 240, 300].map((deg) => (
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
            animation: 'heroRingSpin 12s linear infinite',
            opacity: 0.8,
          }}
        />
      ))}

      {/* Main photo container */}
      <div
        style={{
          width: photoSize,
          height: photoSize,
          borderRadius: '50%',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 2,
          border: isDay
            ? `2px solid rgba(37,99,235,0.15)`
            : `3px solid ${glowColor}0.6)`,
          boxShadow: isDay
            ? `0 8px 40px rgba(37,99,235,0.12), 0 2px 8px rgba(0,0,0,0.06)`
            : `0 0 20px ${glowColor}0.5), 0 0 40px ${glowColor}0.3), 0 0 80px ${glowColor}0.15), inset 0 0 30px ${glowColor}0.1)`,
          animation: isDay ? 'heroPhotoFloatDay 5s ease-in-out infinite' : 'heroPhotoFloatNight 5s ease-in-out infinite',
          transition: 'transform 0.4s ease, box-shadow 0.4s ease, border-color 0.6s ease',
          transform: isHovered ? 'scale(1.04)' : 'scale(1)',
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
              filter: isDay ? 'brightness(1.02) contrast(1.02)' : 'brightness(1.05) contrast(1.05) saturate(1.1)',
            }}
            draggable={false}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isDay
                ? 'linear-gradient(135deg, #E8F0FE, #DBEAFE)'
                : 'radial-gradient(circle at 40% 35%, #1a2a4a, #071220)',
              position: 'relative',
            }}
          >
            <svg viewBox="0 0 200 200" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <circle cx="100" cy="72" r="35" fill={isDay ? '#C7D2FE' : '#2a3f60'} />
              <ellipse cx="100" cy="160" rx="52" ry="55" fill={isDay ? '#C7D2FE' : '#2a3f60'} />
            </svg>
            <span
              style={{
                position: 'relative',
                zIndex: 2,
                fontSize: size * 0.18,
                fontWeight: 900,
                fontFamily: '"Space Grotesk", monospace',
                color: accent,
                textShadow: isDay ? 'none' : `0 0 20px ${accent}, 0 0 40px ${accent}`,
              }}
            >
              RH
            </span>
          </div>
        )}

        {/* Shimmer overlay for Day on hover */}
        {isDay && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: isHovered
                ? 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)'
                : 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%)',
              pointerEvents: 'none',
              transition: 'background 0.4s ease',
            }}
          />
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes heroPhotoFloatDay {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes heroPhotoFloatNight {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.02); }
        }
        @keyframes heroPhotoGlowDay {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        @keyframes heroPhotoGlowNight {
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
