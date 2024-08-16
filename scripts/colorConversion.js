// Översätter HEX till RGB
export function hexToRgb(hex) {
  hex = expandHex(hex); // se till att hexvärdet är 6 siffror långt
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

// Översätter HEX till HSL
export function hexToHsl(hex) {
  // Konvertera först till RGB
  const { r, g, b } = hexToRgb(hex);

  // Normalisera värderna mellan [0,1]
  let rNorm = r / 255;
  let gNorm = g / 255;
  let bNorm = b / 255;

  // Hitta min och max-värderna för att få ut ljusheten
  const cmin = Math.min(rNorm, gNorm, bNorm);
  const cmax = Math.max(rNorm, gNorm, bNorm);
  const delta = cmax - cmin;

  // Initialisera H, S & L-värdena
  let h = 0;
  let s = 0;
  let l = (cmax + cmin) / 2;

  // Beräkna H och S
  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    if (cmax === rNorm) {
      h = ((gNorm - bNorm) / delta) % 6;
    } else if (cmax === gNorm) {
      h = (bNorm - rNorm) / delta + 2;
    } else {
      h = (rNorm - gNorm) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  // Avrunda L med 2 decimalers precision
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h, s, l };
}

// Översätter HSL till HEX
export function hslToHex(h, s, l) {
  // Normalisera värderna som kommer in
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;

  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/*
 * Godkänner emdast numeriska värden mellan 0-9
 * och bokstäver mellan A-f
 */
export function isValidHex(hex) {
  const hexPattern = /^#([0-9A-Fa-f]{3}){1,2}$/;
  return hexPattern.test(hex);
}

/**
 * "Förlänger" ett hexvärde från 3 till 6st tecken
 * genom att lägga till ett likadant tecken efter
 * det ursprungliga tecknets position
 */
export function expandHex(hex) {
  if (hex.length === 4) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  return hex;
}
