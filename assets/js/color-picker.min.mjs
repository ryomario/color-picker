/*! Color Picker v1.0.0 | (C) 2024 - Mario | MIT license */
/******/ // The require scope
/******/ var __webpack_require__ = {};
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ ColorPicker)
});

;// CONCATENATED MODULE: ./src/base/ClassWithListener.js
class ClassWithListener {
  constructor() {
    const $this = this;
    /**
     * Internal use only (not accessable)
     * @type {Object.<string,Array<Function>>}
     */
    const listeners = {};
    /**
     * 
     * @param {string} name 
     * @param {Function} callback 
     */
    function addEventListener(name, callback) {
      if (!listeners[name]) listeners[name] = [];
      if (typeof callback !== 'function') return;
      if (!listeners[name].includes(callback)) {
        listeners[name].push(callback);
      }
    }
    this.addEventListener = addEventListener;
    /**
     * 
     * @param {string} name 
     * @param {Function} callback 
     */
    function removeEventListener(name, callback) {
      if (!listeners[name]) return;
      if (typeof callback !== 'function') return;
      let idx = listeners[name].findIndex(l => l === callback);
      if (idx != -1) {
        listeners[name].splice(idx, 1);
      }
    }
    this.removeEventListener = removeEventListener;
    /**
     * 
     * @param {string} name 
     * @param {any} args 
     */
    function dispatchEvent(name, ...args) {
      if (!listeners[name]) return;
      for (const callback of listeners[name]) {
        callback.apply($this, args);
      }
    }
    this.dispatchEvent = dispatchEvent;
  }
}
;// CONCATENATED MODULE: ./src/tools/colors.js
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
function decToHex(c) {
  if (isNaN(c)) return '';
  if (c < 0) c = 0;
  if (c > 255) c = 255;
  let hex = Math.round(Number(c)).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
/**
 * rgb(0,0,0) to #000000
 * @param {RGB} rgb 
 * @param {number} [a=1] 0 - 1
 * @returns {string}
 */
function rgb2hex({
  r,
  g,
  b,
  a
}, forceRemoveAlpha = false) {
  return "#" + decToHex(r) + decToHex(g) + decToHex(b) + (!forceRemoveAlpha && a != undefined ? decToHex(a * 255) : '');
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
function hex2rgb(hex) {
  if (!hex) hex = '';
  if (!hex.startsWith('#')) hex = '#' + hex;
  if (hex.length >= 1 && hex.length < 4) hex = hex.padEnd(4, '0');
  if (hex.length > 5 && hex.length < 7) hex = hex.substring(0, 5);
  if (hex.length == 8) hex = hex + hex.charAt(7);
  if (hex.length > 9) hex = hex.substring(0, 9);
  // Expand shorthand form (e.g. "#03F[A]") to full form (e.g. "#0033FF[AA]")
  let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d]?)$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b, a) {
    return '#' + r + r + g + g + b + b + a + a;
  });
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const a = hex.length == 7 ? 1 : parseInt(hex.slice(7, 9), 16) / 255;
  return {
    r,
    g,
    b,
    a
  };
}
/**
 * Check if given string is a valid hexadecimal color or not
 * match - #000 | #000a | #000000aa | #000000
 * @param {string} hex 
 * @returns {boolean}
 */
function isValidHexColor(hex) {
  const regex = /^#[a-f\d]{3}(?:[a-f\d]?|(?:[a-f\d]{3}(?:[a-f\d]{2})?)?)\b/i;
  return regex.exec(hex) !== null;
}

/**
 * hsv(0,0,0) to rgb(0,0,0)
 * @param {HSV} hsv 
 * @returns {RGB}
 */
function hsv2rgb({
  h,
  s,
  v
}) {
  let r, g, b;
  let i = Math.floor(h * 6);
  let f = h * 6 - i;
  let p = v * (1 - s);
  let q = v * (1 - f * s);
  let t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      r = v, g = t, b = p;
      break;
    case 1:
      r = q, g = v, b = p;
      break;
    case 2:
      r = p, g = v, b = t;
      break;
    case 3:
      r = p, g = q, b = v;
      break;
    case 4:
      r = t, g = p, b = v;
      break;
    case 5:
      r = v, g = p, b = q;
      break;
  }
  return {
    r: r * 255,
    g: g * 255,
    b: b * 255
  };
}
/**
 * rgb(0,0,0) to hsv(0,0,0)
 * @param {RGB} rgb
 * @returns {HSV}
 */
function rgb2hsv({
  r,
  g,
  b
}) {
  r /= 255;
  g /= 255;
  b /= 255;
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    v = max;
  let d = max - min;
  s = max == 0 ? 0 : d / max;
  if (max == min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h,
    s,
    v
  };
}

/**
 * Get color luminance
 * @param {RGB} rgb 
 * @returns {number}
 */
function luminance({
  r,
  g,
  b
}) {
  let lum = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return lum[0] * 0.2126 + lum[1] * 0.7152 + lum[2] * 0.0722;
}

/**
 * Check is color light
 * @param {RGB} color 
 * @returns {boolean}
 */
function isLightColor(color) {
  return luminance(color) > 1 / 4.5;
}
;// CONCATENATED MODULE: ./src/tools/webAnimation.js
/**
 * 
 * @param {Function} callback 
 */
function rAFThrottle(callback) {
  let requestID;
  return function (...args) {
    const context = this;
    cancelAnimationFrame(requestID);
    requestID = requestAnimationFrame(() => {
      callback.call(context, ...args);
    });
  };
}
;// CONCATENATED MODULE: ./src/color-picker.js
/**
 * @typedef Position
 * @property {number} x
 * @property {number} y
 */





/**
 * 
 * @param {ColorPicker} $this 
 * @param {Object} options 
 */
function init($this, options) {
  const elems = {
    box: document.createElement('div'),
    colorbox: document.createElement('div'),
    toolbox: document.createElement('div'),
    colorbox_pointer: document.createElement('div'),
    toolbox_top: document.createElement('div'),
    toolbox_bot: document.createElement('div'),
    color_preview_contianer: document.createElement('div'),
    color_preview: document.createElement('div'),
    sliders_container: document.createElement('div'),
    hue_slider_track: document.createElement('div'),
    hue_slider_thumb: document.createElement('div'),
    alpha_slider_track: document.createElement('div'),
    alpha_slider_thumb: document.createElement('div'),
    result_container: document.createElement('div'),
    result_changeformat: document.createElement('div'),
    input_hex: createInputHex()
  };
  function createInput(label, value, onChange) {
    const container = document.createElement('div');
    const input = document.createElement('input');
    input.setAttribute('name', Date.now());
    container.classList.add('color-picker-inputfield');
    input.setAttribute('spellcheck', 'false');
    container.dataset.label = label;
    input.value = value;
    container.appendChild(input);
    input.addEventListener('input', onChange);
    return [container, input];
  }
  function createInputHex() {
    let changedFromInput = false;
    const [container, input] = createInput('HEX', options.defaultColor, e => {
      /**
       * @type {string}
       */
      let hexValue = e.currentTarget.value;
      hexValue = hexValue.trim();
      if (!isValidHexColor(hexValue)) return;
      changedFromInput = true;
      $this.setColor(hexValue);
    });
    $this.addEventListener('change.color.rgba', function ({
      r,
      g,
      b,
      a
    }) {
      if (changedFromInput) {
        changedFromInput = false;
        return;
      }
      input.value = rgb2hex({
        r,
        g,
        b,
        a
      }, a == 1);
    });
    return container;
  }
  $this.addEventListener('view.update.elems', function () {
    $this.root.classList.add('color-picker-container');
    elems.box.classList.add('color-picker-box');
    elems.colorbox.classList.add('color-picker-colorbox');
    elems.toolbox.classList.add('color-picker-toolbox');
    elems.colorbox_pointer.classList.add('color-picker-pointer');
    elems.toolbox_top.classList.add('color-picker-toolbox-top');
    elems.toolbox_bot.classList.add('color-picker-toolbox-bot');
    elems.color_preview_contianer.classList.add('color-picker-colorpreview-container');
    elems.color_preview.classList.add('color-picker-colorpreview');
    elems.sliders_container.classList.add('color-picker-sliders-container');
    elems.hue_slider_thumb.classList.add('color-picker-pointer');
    elems.hue_slider_track.classList.add('color-picker-hueslider-track');
    elems.alpha_slider_thumb.classList.add('color-picker-pointer');
    elems.alpha_slider_track.classList.add('color-picker-alphaslider-track');
    elems.result_container.classList.add('color-picker-result-container');
    elems.result_changeformat.classList.add('color-picker-result-changeformat');
    $this.root.style.setProperty('--size', options.size + 'px');
    $this.root.innerHTML = '';
    $this.root.appendChild(elems.box);
    elems.box.appendChild(elems.colorbox);
    elems.box.appendChild(elems.toolbox);
    elems.colorbox.appendChild(elems.colorbox_pointer);
    elems.toolbox.appendChild(elems.toolbox_top);
    elems.toolbox.appendChild(elems.toolbox_bot);
    elems.toolbox_top.appendChild(elems.color_preview_contianer);
    elems.toolbox_top.appendChild(elems.sliders_container);
    elems.color_preview_contianer.appendChild(elems.color_preview);
    elems.sliders_container.appendChild(elems.hue_slider_track);
    elems.sliders_container.appendChild(elems.alpha_slider_track);
    elems.hue_slider_track.appendChild(elems.hue_slider_thumb);
    elems.alpha_slider_track.appendChild(elems.alpha_slider_thumb);
    elems.toolbox_bot.appendChild(elems.result_container);
    elems.toolbox_bot.appendChild(elems.result_changeformat);
    elems.result_container.appendChild(elems.input_hex);
  });
  $this.addEventListener('view.update.colorhue', function () {
    let rgb = $this.getColorFromSelectedHue();
    $this.root.style.setProperty('--colorhue', rgb2hex(rgb));
  });
  $this.addEventListener('view.update.color', function () {
    let rgb = $this.getColorFromSelectedPointer();
    let alpha = $this.alphaPos;
    let color = rgb2hex(rgb, false);
    let colorWithAlpha = rgb2hex({
      ...rgb,
      a: alpha
    });
    if (isLightColor(rgb)) elems.colorbox_pointer.classList.remove('white');else elems.colorbox_pointer.classList.add('white');
    $this.root.style.setProperty('--color', color);
    $this.root.style.setProperty('--color-with-alpha', colorWithAlpha);
    $this.dispatchEvent('change.color.rgba', {
      ...rgb,
      a: alpha
    });
  });
  $this.addEventListener('view.update.position.pointerInColorBox', function () {
    let {
      x,
      y
    } = $this.colorPos;
    x = elems.colorbox.offsetWidth * x;
    y = elems.colorbox.offsetHeight * y;
    elems.colorbox_pointer.style.left = x + 'px';
    elems.colorbox_pointer.style.top = y + 'px';
  });
  $this.addEventListener('view.update.position.pointerInHueSlider', function () {
    let x = $this.huePos;
    x = elems.hue_slider_track.offsetWidth * x;
    elems.hue_slider_thumb.style.left = x + 'px';
  });
  $this.addEventListener('view.update.position.pointerInAlphaSlider', function () {
    let x = $this.alphaPos;
    x = elems.alpha_slider_track.offsetWidth * x;
    elems.alpha_slider_thumb.style.left = x + 'px';
  });
  $this.addEventListener('update.view', function () {
    $this.dispatchEvent('view.update.position.pointerInColorBox');
    $this.dispatchEvent('view.update.position.pointerInHueSlider');
    $this.dispatchEvent('view.update.position.pointerInAlphaSlider');
    $this.dispatchEvent('view.update.colorhue');
    $this.dispatchEvent('view.update.color');
  });
  function updateColorBoxPointer({
    x,
    y
  }) {
    $this.colorPos = {
      x,
      y
    };
    $this.dispatchEvent('view.update.position.pointerInColorBox');
    $this.dispatchEvent('view.update.color');
  }
  function updateHueSliderPointer(x) {
    $this.huePos = x;
    $this.dispatchEvent('view.update.position.pointerInHueSlider');
    $this.dispatchEvent('view.update.colorhue');
    $this.dispatchEvent('view.update.color');
  }
  function updateAlphaSliderPointer(x) {
    $this.alphaPos = x;
    $this.dispatchEvent('view.update.position.pointerInAlphaSlider');
    $this.dispatchEvent('view.update.color');
  }

  /**
   * View - check is coor position given on the slider thumb?
   * @param {number} x 
   * @param {number} y 
   * @returns {boolean}
   */
  function isOnHueSliderThumbPos(x, y) {
    const radius = elems.hue_slider_thumb.offsetWidth / 2;
    return x >= elems.hue_slider_thumb.offsetLeft - radius && x <= elems.hue_slider_thumb.offsetLeft + radius;
  }
  /**
   * View - check is coor position given on the slider thumb?
   * @param {number} x 
   * @param {number} y 
   * @returns {boolean}
   */
  function isOnAlphaSliderThumbPos(x, y) {
    const radius = elems.alpha_slider_thumb.offsetWidth / 2;
    return x >= elems.alpha_slider_thumb.offsetLeft - radius && x <= elems.alpha_slider_thumb.offsetLeft + radius;
  }
  /**
   * View - check is coor position given on the box pointer?
   * @param {number} x 
   * @param {number} y 
   * @returns {boolean}
   */
  function isOnColorBoxPointerPos(x, y) {
    const radius = elems.colorbox_pointer.offsetWidth / 2;
    let viewX = $this.colorPos.x * elems.colorbox.offsetWidth;
    let viewY = $this.colorPos.y * elems.colorbox.offsetHeight;
    return x >= viewX - radius && x <= viewX + radius && y >= viewY - radius && y <= viewY + radius;
  }

  /**
   * Internal use only
   * @type {boolean}
   */
  let _dragging = false;
  const isDraging = () => _dragging;
  function setDragging(val) {
    _dragging = Boolean(val);
    if (_dragging) {
      $this.root.classList.add('dragging');
    } else {
      $this.root.classList.remove('dragging');
    }
  }

  /**
   * View + system - Handle box pointer move
   * @param {MouseEvent} event 
   */
  function HandlePointer(event) {
    if (event.type === 'mousedown') {
      setDragging(true);
      document.documentElement.style.setProperty('cursor', 'move', 'important');
      document.addEventListener('mousemove', HandlePointer);
      document.addEventListener('mouseup', HandlePointer);
    }
    if (event.type === 'mouseup') {
      setDragging(false);
      document.documentElement.style.cursor = '';
      document.removeEventListener('mousemove', HandlePointer);
      document.removeEventListener('mouseup', HandlePointer);
    }
    if (event.type === 'mousemove' && !isDraging()) return;
    let rect = elems.colorbox.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    x = x / elems.colorbox.offsetWidth;
    y = y / elems.colorbox.offsetHeight;
    updateColorBoxPointer({
      x,
      y
    });
  }
  HandlePointer = rAFThrottle(HandlePointer);
  elems.colorbox.addEventListener('mousedown', HandlePointer);

  /**
   * View + system - Handle hue slider thumb move
   * @param {MouseEvent} event 
   */
  function HandleHueSlider(event) {
    if (event.type === 'mousedown') {
      setDragging(true);
      document.documentElement.style.setProperty('cursor', 'ew-resize', 'important');
      document.addEventListener('mousemove', HandleHueSlider);
      document.addEventListener('mouseup', HandleHueSlider);
    }
    if (event.type === 'mouseup') {
      setDragging(false);
      document.documentElement.style.cursor = '';
      document.removeEventListener('mousemove', HandleHueSlider);
      document.removeEventListener('mouseup', HandleHueSlider);
    }
    if (event.type === 'mousemove' && !isDraging()) return;
    let rect = elems.hue_slider_track.getBoundingClientRect();
    let x = event.clientX - rect.left;
    x = x / elems.hue_slider_track.offsetWidth;
    updateHueSliderPointer(x);
  }
  HandleHueSlider = rAFThrottle(HandleHueSlider);
  elems.hue_slider_track.addEventListener('mousedown', HandleHueSlider);

  /**
   * View + system - Handle alpha slider thumb move
   * @param {MouseEvent} event 
   */
  function HandleAlphaSlider(event) {
    if (event.type === 'mousedown') {
      setDragging(true);
      document.documentElement.style.setProperty('cursor', 'ew-resize', 'important');
      document.addEventListener('mousemove', HandleAlphaSlider);
      document.addEventListener('mouseup', HandleAlphaSlider);
    }
    if (event.type === 'mouseup') {
      setDragging(false);
      document.documentElement.style.cursor = '';
      document.removeEventListener('mousemove', HandleAlphaSlider);
      document.removeEventListener('mouseup', HandleAlphaSlider);
    }
    if (event.type === 'mousemove' && !isDraging()) return;
    let rect = elems.alpha_slider_track.getBoundingClientRect();
    let x = event.clientX - rect.left;
    x = x / elems.alpha_slider_track.offsetWidth;
    updateAlphaSliderPointer(x);
  }
  HandleAlphaSlider = rAFThrottle(HandleAlphaSlider);
  elems.alpha_slider_track.addEventListener('mousedown', HandleAlphaSlider);

  /**
   * View + system - Handle mouse move (check if hover & note dragging)
   * @param {MouseEvent} event 
   */
  function HandleCursor(event) {
    // on hover box
    let rect = elems.box.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    if (isDraging()) {
      elems.colorbox.style.cursor = '';
      elems.hue_slider_track.style.cursor = '';
      elems.alpha_slider_track.style.cursor = '';
      return;
    }
    if (isOnColorBoxPointerPos(x, y)) {
      elems.colorbox.style.cursor = 'move';
    } else {
      elems.colorbox.style.cursor = 'crosshair';
    }

    // on hover hue slider track
    rect = elems.hue_slider_track.getBoundingClientRect();
    x = event.clientX - rect.left;
    y = event.clientY - rect.top;
    if (isOnHueSliderThumbPos(x, y)) {
      elems.hue_slider_track.style.cursor = 'ew-resize';
    } else {
      elems.hue_slider_track.style.cursor = 'crosshair';
    }

    // on hover alpha slider track
    rect = elems.alpha_slider_track.getBoundingClientRect();
    x = event.clientX - rect.left;
    y = event.clientY - rect.top;
    if (isOnAlphaSliderThumbPos(x, y)) {
      elems.alpha_slider_track.style.cursor = 'ew-resize';
    } else {
      elems.alpha_slider_track.style.cursor = 'crosshair';
    }
  }
  HandleCursor = rAFThrottle(HandleCursor);
  document.addEventListener('mousemove', HandleCursor);

  /**
   * 
   * @param {MouseEvent} event 
   */
  function HandleCopyResult(event) {
    if (elems.color_preview.classList.contains('copied')) return;
    let rgb = $this.getColorFromSelectedPointer();
    let alpha = $this.alphaPos;
    let color = rgb2hex({
      ...rgb,
      a: alpha
    }, alpha == 1);
    copyText(color, copied => {
      if (!copied) {
        alert('Failed to copy!');
        return;
      }
      elems.color_preview.classList.add('copied');
      setTimeout(() => {
        elems.color_preview.classList.remove('copied');
      }, 1500);
    });
  }
  elems.color_preview.addEventListener('click', HandleCopyResult);
  $this.dispatchEvent('view.update.elems');
}

/**
 * 
 * @param {string} text 
 * @param {(copied: boolean)=>void} callback 
 */
async function copyText(text, callback) {
  try {
    let result = await navigator.permissions.query({
      name: 'clipboard-write'
    });
    if (result.state != 'prompt' && result.state != 'granted') throw new Error('No Permission');
    await navigator.clipboard.writeText(text);
    callback(true);
  } catch (error) {
    callback(false);
  }
}
class ColorPicker extends ClassWithListener {
  _colorPos;
  /**
   * @type {Position} 0 - 1
   */
  get colorPos() {
    return this._colorPos;
  }
  /**
   * @param {Position} pos 0 - 1
   */
  set colorPos({
    x,
    y
  }) {
    if (x < 0) x = 0;
    if (x > 1) x = 1;
    if (y < 0) y = 0;
    if (y > 1) y = 1;
    this._colorPos = {
      x,
      y
    };
  }
  _huePos;
  /**
   * @type {number} 0 - 1
   */
  get huePos() {
    return this._huePos;
  }
  /**
   * @param {number} x
   */
  set huePos(x) {
    if (x < 0) x = 0;
    if (x > 1) x = 1;
    this._huePos = x;
  }
  _alphaPos;
  /**
   * @type {number} 0 - 1
   */
  get alphaPos() {
    return this._alphaPos;
  }
  /**
   * @param {number} x
   */
  set alphaPos(x) {
    if (x < 0) x = 0;
    if (x > 1) x = 1;
    this._alphaPos = x;
  }

  /**
   * @type {HTMLElement}
   */
  root;

  /**
   * @constructor
   * @param {HTMLElement} parentel 
   */
  constructor(parentel, options) {
    super();
    this.root = parentel;
    options = {
      ...ColorPicker.defaultOptions,
      ...options
    };
    const $this = this;
    this.colorPos = {
      x: 0,
      y: 0
    };
    this.huePos = 1;
    this.alphaPos = 1;
    init(this, options);
    this.setColor(options.defaultColor);
  }

  /**
   * System - Get RGB Color from current slider thumb position
   * @returns {RGB}
   */
  getColorFromSelectedHue() {
    const h = this.huePos;
    return hsv2rgb({
      h,
      s: 1,
      v: 1
    });
  }

  /**
   * System - Get RGB Color from box pointer position
   * @returns {RGB}
   */
  getColorFromSelectedPointer() {
    let {
      x,
      y
    } = this.colorPos;
    let h = this.huePos;
    let s = x;
    let v = 1 - y;
    return hsv2rgb({
      h,
      s,
      v
    });
  }

  /**
   * App - Change color & update view & trigger event `change-color`
   * @param {string} hexColor - color in HEX Format (auto fixed format)
   */
  setColor(hexColor) {
    const rgb = hex2rgb(hexColor);
    const {
      h,
      s,
      v
    } = rgb2hsv(rgb);
    const a = rgb.a;
    this.colorPos = {
      x: s,
      y: 1 - v
    };
    this.huePos = h;
    this.alphaPos = a;

    // update view
    this.dispatchEvent('update.view');
  }
  static defaultOptions = {
    size: 300,
    defaultColor: '#0000ff'
  };
}
var __webpack_exports__default = __webpack_exports__.A;
export { __webpack_exports__default as default };
