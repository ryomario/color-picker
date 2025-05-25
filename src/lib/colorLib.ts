import type { IColor, IColorHexValue, IColorHSVValue, IColorRGBValue } from "../types/ColorTypes";

export function decToHex(num: number): string {
  if(isNaN(num)) num = 0
  if(num < 0) num = 0
  if(num > 255) num = 255
  const hex = Math.round(num).toString(16)
  return hex.padStart(2,'0')
}

export function colorToHex(color: IColor): IColorHexValue {
  if(typeof color == 'string') {
    if(!color.startsWith('#')) {
      color = `#${color}`
    }
    return color
  }

  if(typeof color == 'object') {
    if(['r','g','b'].every(attr => Object.keys(color).includes(attr))) {
      return rgb2hex(color as IColorRGBValue)
    }

    if(['h','s','v'].every(attr => Object.keys(color).includes(attr))) {
      return hsv2hex(color as IColorHSVValue)
    }
  }

  return '#000000'
}

export function rgb2hex({ r, g, b, a }: IColorRGBValue): IColorHexValue {
  return `#${
    decToHex(r)
  }${
    decToHex(g)
  }${
    decToHex(b)
  }${
    a != undefined ? decToHex(a * 255) : ''
  }`
}
export function hsv2hex(color: IColorHSVValue): IColorHexValue {
  return rgb2hex(hsv2rgb(color))
}

export function hsv2rgb({ h, s, v }: IColorHSVValue): IColorRGBValue {
  let r = 0, g = 0, b = 0;

  let i = Math.floor(h * 6);
  let f = h * 6 - i;
  let p = v * (1 - s);
  let q = v * (1 - f * s);
  let t = v * (1 - (1 - f) * s);

  switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
  }

  return { r: r * 255, g: g * 255, b: b * 255 };
}

export function hex2rgb(hex: string): IColorRGBValue {
  if(!hex)hex = '';
    if(!hex.startsWith('#'))hex = '#' + hex;
    if(hex.length >= 1 && hex.length < 4)hex = hex.padEnd(4,'0');
    if(hex.length > 5 && hex.length < 7)hex = hex.substring(0,5);
    if(hex.length == 8)hex = hex + hex.charAt(7);
    if(hex.length > 9)hex = hex.substring(0,9);
    // Expand shorthand form (e.g. "#03F[A]") to full form (e.g. "#0033FF[AA]")
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d]?)$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b, a) {
        return '#' + r + r + g + g + b + b + a + a;
    });

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const a = (hex.length == 7) ? 1 : parseInt(hex.slice(7, 9), 16) / 255;
    
    return { r, g, b, a };
}
export function rgb2hsv({r, g, b}: IColorRGBValue): IColorHSVValue {        
  r /= 255;
  g /= 255;
  b /= 255;
  
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, v = max;
  
  let d = max - min;
  s = max == 0 ? 0 : d / max;
  
  if (max == min) {
      h = 0; // achromatic
  } else {
      switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
      }
  
      h /= 6;
  }
  
  return { h, s, v };
}

export function isLightColor(color: IColor): boolean {
  return luminance(color) > 1/4.5
}

export function luminance(color: IColor): number {
  const {r,g,b} = hex2rgb(colorToHex(color))

  let lum = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow( (v + 0.055 ) / 1.055, 2.4);
  });
  return lum[0] * 0.2126 + lum[1] * 0.7152 + lum[2] * 0.0722;
}

export function isValidHexColor(hex: string) {
  const regex = /^#[a-f\d]{3}(?:[a-f\d]?|(?:[a-f\d]{3}(?:[a-f\d]{2})?)?)\b/i;
  return regex.exec(hex) !== null;
}