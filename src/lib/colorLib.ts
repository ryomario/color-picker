import type { IColor, IColorHexValue, IColorHSVValue, IColorRGBValue, IHslaColor, IHslColor, IHsvaColor, IHsvColor, IObjectColor, IRgbaColor, IRgbColor } from "../types/ColorTypes";

const RGB_MAX = 255
const SV_MAX = 100

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

export const hsvaToHslaString = (hsva: IHsvaColor): string => {
  const { h, s, l, a } = hsvaToHsla(hsva);
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
};

export const hsvaToHsv = ({ h, s, v }: IHsvaColor): IHsvColor => ({ h, s, v });
export const hsvaToHsla = ({ h, s, v, a }: IHsvaColor): IHslaColor => {
  const hh = ((200 - s) * v) / SV_MAX;

  return {
    h,
    s: hh > 0 && hh < 200 ? ((s * v) / SV_MAX / (hh <= SV_MAX ? hh : 200 - hh)) * SV_MAX : 0,
    l: hh / 2,
    a,
  };
};

export const rgbaToHsva = ({ r, g, b, a }: IRgbaColor): IHsvaColor => {
  const max = Math.max(r, g, b);
  const delta = max - Math.min(r, g, b);

  // prettier-ignore
  const hh = delta
    ? max === r
      ? (g - b) / delta
      : max === g
        ? 2 + (b - r) / delta
        : 4 + (r - g) / delta
    : 0;

  return {
    h: 60 * (hh < 0 ? hh + 6 : hh),
    s: max ? (delta / max) * SV_MAX : 0,
    v: (max / RGB_MAX) * SV_MAX,
    a,
  };
};

export const rgbaToRgb = ({ r, g, b }: IRgbaColor): IRgbColor => ({ r, g, b });
export const hslaToHsl = ({ h, s, l }: IHslaColor): IHslColor => ({ h, s, l });
export const hsvaToHex = (hsva: IHsvaColor): string => rgbToHex(hsvaToRgba(hsva));
export const hsvaToHexa = (hsva: IHsvaColor): string => rgbaToHexa(hsvaToRgba(hsva));
export const rgbToHex = ({ r, g, b }: IRgbColor): string => {
  const bin = (r << 16) | (g << 8) | b;
  return `#${((h) => new Array(7 - h.length).join('0') + h)(bin.toString(16))}`;
};

export const rgbaToHexa = ({ r, g, b, a }: IRgbaColor): string => {
  const alpha = typeof a === 'number' && ((a * 255) | (1 << 8)).toString(16).slice(1);
  return `${rgbToHex({ r, g, b })}${alpha ? alpha : ''}`;
};

export const hexToHsva = (hex: string): IHsvaColor => rgbaToHsva(hexToRgba(hex));
export const hexToRgba = (hex: string): IRgbaColor => {
  const htemp = hex.replace('#', '');
  if (/^#?/.test(hex) && htemp.length === 3) {
    hex = `#${htemp.charAt(0)}${htemp.charAt(0)}${htemp.charAt(1)}${htemp.charAt(1)}${htemp.charAt(2)}${htemp.charAt(2)}`;
  }
  const reg = new RegExp(`[A-Za-z0-9]{2}`, 'g');
  const [r, g, b = 0, a] = hex.match(reg)!.map((v) => parseInt(v, 16));
  return {
    r,
    g,
    b,
    a: (a ?? 255) / RGB_MAX,
  };
};


/**
 * Converts HSVA to RGBA. Based on formula from https://en.wikipedia.org/wiki/HSL_and_HSV
 * @param color HSVA color as an array [0-360, 0-1, 0-1, 0-1]
 */
export const hsvaToRgba = ({ h, s, v, a }: IHsvaColor): IRgbaColor => {
  let _h = h / 60,
    _s = s / SV_MAX,
    _v = v / SV_MAX,
    hi = Math.floor(_h) % 6;

  let f = _h - Math.floor(_h),
    _p = RGB_MAX * _v * (1 - _s),
    _q = RGB_MAX * _v * (1 - _s * f),
    _t = RGB_MAX * _v * (1 - _s * (1 - f));
  _v *= RGB_MAX;
  const rgba = {} as IRgbaColor;
  switch (hi) {
    case 0:
      rgba.r = _v;
      rgba.g = _t;
      rgba.b = _p;
      break;
    case 1:
      rgba.r = _q;
      rgba.g = _v;
      rgba.b = _p;
      break;
    case 2:
      rgba.r = _p;
      rgba.g = _v;
      rgba.b = _t;
      break;
    case 3:
      rgba.r = _p;
      rgba.g = _q;
      rgba.b = _v;
      break;
    case 4:
      rgba.r = _t;
      rgba.g = _p;
      rgba.b = _v;
      break;
    case 5:
      rgba.r = _v;
      rgba.g = _p;
      rgba.b = _q;
      break;
  }
  rgba.r = Math.round(rgba.r);
  rgba.g = Math.round(rgba.g);
  rgba.b = Math.round(rgba.b);
  return { ...rgba, a };
};

export const color = (str: string | IHsvaColor) => {
  let rgb!: IRgbColor;
  let hsl!: IHslColor;
  let hsv!: IHsvColor;
  let rgba!: IRgbaColor;
  let hsla!: IHslaColor;
  let hsva!: IHsvaColor;
  let hex!: string;
  let hexa!: string;
  if (typeof str === 'string' && !isValidHexColor(str)) {
    str = '#ffffff';
  }
  if (typeof str === 'string') {
    hsva = hexToHsva(str);
    hex = str;
  } else {
    hsva = str;
  }

  hsv = hsvaToHsv(hsva);
  hsla = hsvaToHsla(hsva);
  rgba = hsvaToRgba(hsva);
  hexa = rgbaToHexa(rgba);
  hex = hsvaToHex(hsva);
  hsl = hslaToHsl(hsla);
  rgb = rgbaToRgb(rgba);

  return { rgb, hsl, hsv, rgba, hsla, hsva, hex, hexa };
};

export function getContrastingColor(c: IHsvaColor | string): string {
  const { r, g, b } = color(c).rgb

  let lum = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow( (v + 0.055 ) / 1.055, 2.4);
  });
  return (
    lum[0] * 0.2126 + lum[1] * 0.7152 + lum[2] * 0.0722
  ) > (1/4.5)
  ? '#000000'
  : '#ffffff'
}