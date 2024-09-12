/**
 * @typedef RGB
 * @type {object}
 * @property {number} r - Red value
 * @property {number} g - Green value
 * @property {number} b - Blue value
 * @property {number} a - Alpha value
 */

/**
 * @typedef HSV
 * @type {object}
 * @property {number} h - Hue value
 * @property {number} s - Saturation value
 * @property {number} v - Light value
 */

/**
 * 
 * @param {number} c 0 - 255
 * @returns 
 */
export function decToHex(c) {
    if(isNaN(c))return '';
    if(c < 0)c = 0;
    if(c > 255)c = 255;
    let hex = Math.round(Number(c)).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
/**
 * rgb(0,0,0) to #000000
 * @param {RGB} rgb 
 * @param {number} [a=1] 0 - 1
 * @returns {string}
 */
export function rgb2hex({r,g,b,a},forceRemoveAlpha = false) {
    return "#" + decToHex(r) + decToHex(g) + decToHex(b) + (!forceRemoveAlpha && a != undefined ?  decToHex(a * 255) : '');
}
/**
 * #000000 to rgb(0,0,0)
 * 
 * autofix # - 000 => #000 | 000000 => #000000
 * autofix   - 
 * - \# => #000 | #0 => #000 | #00 => #000
 * - #00000 => #0000
 * - #00000a => #000000aa
 * - #00000aa0 => #000000aa
 * @param {string} hex 
 * @returns {RGB}
 */
export function hex2rgb(hex) {
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
/**
 * Check if given string is a valid hexadecimal color or not
 * match - #000 | #000a | #000000aa | #000000
 * @param {string} hex 
 * @returns {boolean}
 */
export function isValidHexColor(hex) {
    const regex = /^#[a-f\d]{3}(?:[a-f\d]?|(?:[a-f\d]{3}(?:[a-f\d]{2})?)?)\b/i;
    return regex.exec(hex) !== null;
}

/**
 * hsv(0,0,0) to rgb(0,0,0)
 * @param {HSV} hsv 
 * @returns {RGB}
 */
export function hsv2rgb({h, s, v}) {
    let r, g, b;

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
/**
 * rgb(0,0,0) to hsv(0,0,0)
 * @param {RGB} rgb
 * @returns {HSV}
 */
export function rgb2hsv({r, g, b}) {        
    r /= 255;
    g /= 255;
    b /= 255;
    
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;
    
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

/**
 * Get color luminance
 * @param {RGB} rgb 
 * @returns {number}
 */
export function luminance({r, g, b}) {
    let lum = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow( (v + 0.055 ) / 1.055, 2.4);
    });
    return lum[0] * 0.2126 + lum[1] * 0.7152 + lum[2] * 0.0722;
}

/**
 * Check is color light
 * @param {RGB} color 
 * @returns {boolean}
 */
export function isLightColor(color) {
    return luminance(color) > 1/4.5
}