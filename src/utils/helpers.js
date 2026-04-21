/**
 * Utility helpers for the portfolio
 */

/**
 * Clamp a number between min and max
 */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Linear interpolation
 */
export const lerp = (start, end, factor) => start + (end - start) * factor;

/**
 * Map a value from one range to another
 */
export const mapRange = (value, inMin, inMax, outMin, outMax) => {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
};

/**
 * Debounce a function
 */
export const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Check if device is mobile/touch
 */
export const isMobile = () => {
  return window.innerWidth < 768 || 'ontouchstart' in window;
};

/**
 * Get CSS variable value
 */
export const getCssVar = (name) => {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
};

/**
 * Convert file to base64
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Smooth scroll to element by ID
 */
export const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

/**
 * Generate a placeholder canvas image as data URL
 */
export const generatePlaceholderImage = (width, height, text, bgColor = '#041E3A') => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Grid pattern
  ctx.strokeStyle = 'rgba(0,212,255,0.1)';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 30) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
  }
  for (let y = 0; y < height; y += 30) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
  }

  // Text
  ctx.fillStyle = '#00D4FF';
  ctx.font = `bold ${Math.min(width, height) / 10}px Inter, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);

  return canvas.toDataURL('image/png');
};
