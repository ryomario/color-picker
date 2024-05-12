export function copyText(idEl) {
    const textEl = document.getElementById(idEl);

    textEl.select();
    textEl.setSelectionRange(0,Number.MAX_VALUE);

    navigator.clipboard.writeText(textEl.value);

    alert("Copied the text: " + textEl.value);
}

export function hex2rgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    // return {r, g, b} 
    return { r, g, b };
}
export const getRelativeLuminance = (rgb) =>
    0.2126 * rgb['r']
    + 0.7152 * rgb['g']
    + 0.0722 * rgb['b'];
export const getCSSColorRGB = (rgb) => `rgb(${rgb['r']},${rgb['g']},${rgb['b']})`;
function decToHex(c) {
    var hex = Number(c).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
export function rgbToHex(rgb) {
    return "#" + decToHex(rgb.r) + decToHex(rgb.g) + decToHex(rgb.b);
}