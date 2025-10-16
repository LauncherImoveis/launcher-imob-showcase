/**
 * Color utility functions for theme customization
 */

/**
 * Validates if a string is a valid HEX color
 */
export function isValidHex(hex: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

/**
 * Normalizes HEX color to 6-digit format
 */
export function normalizeHex(hex: string): string {
  if (!hex.startsWith('#')) {
    hex = '#' + hex;
  }
  
  // Convert 3-digit to 6-digit
  if (hex.length === 4) {
    hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }
  
  return hex.toUpperCase();
}

/**
 * Converts HEX to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = normalizeHex(hex);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalized);
  
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Converts RGB to HSL for Tailwind CSS variables
 */
export function rgbToHsl(r: number, g: number, b: number): string {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  const lVal = Math.round(l * 100);

  return `${h} ${s}% ${lVal}%`;
}

/**
 * Converts HEX to HSL for Tailwind CSS variables
 */
export function hexToHsl(hex: string): string | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  
  return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

/**
 * Calculates relative luminance for contrast ratio
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculates contrast ratio between two colors
 * Returns a number between 1 and 21
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  
  if (!rgb1 || !rgb2) return 1;
  
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Determines the best contrast color (white or black) for a given background
 */
export function getContrastColor(bgHex: string): string {
  const whiteContrast = getContrastRatio(bgHex, '#FFFFFF');
  const blackContrast = getContrastRatio(bgHex, '#000000');
  
  return whiteContrast >= blackContrast ? '#FFFFFF' : '#000000';
}

/**
 * Checks if contrast meets WCAG AA standard (4.5:1 for normal text)
 */
export function meetsWCAGAA(bgHex: string, fgHex: string): boolean {
  return getContrastRatio(bgHex, fgHex) >= 4.5;
}

/**
 * Predefined color palettes
 */
export const COLOR_PALETTES = [
  { name: 'Azul Escuro', hex: '#0b3b66', label: 'Padrão' },
  { name: 'Preto', hex: '#000000', label: 'Preto' },
  { name: 'Cinza Escuro', hex: '#374151', label: 'Cinza' },
  { name: 'Marrom', hex: '#78350f', label: 'Marrom' },
  { name: 'Vermelho', hex: '#991b1b', label: 'Vermelho' },
  { name: 'Rosa', hex: '#9f1239', label: 'Rosa' },
  { name: 'Laranja', hex: '#c2410c', label: 'Laranja' },
  { name: 'Verde', hex: '#166534', label: 'Verde' },
  { name: 'Azul', hex: '#1e40af', label: 'Azul' },
  { name: 'Roxo', hex: '#6b21a8', label: 'Roxo' },
] as const;
