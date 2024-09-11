(function(){
    "use strict"
    /**
     * @typedef RGB
     * @type {object}
     * @property {number} r - Red value
     * @property {number} g - Green value
     * @property {number} b - Blue value
     */

    /**
     * @typedef HSL
     * @type {object}
     * @property {number} h - Hue value
     * @property {number} s - Saturation value
     * @property {number} l - Light value
     */

    /**
     * @typedef HSV
     * @type {object}
     * @property {number} h - Hue value
     * @property {number} s - Saturation value
     * @property {number} v - Light value
     */

    class Formula {
        /**
         * 
         * @param {number} c 0 - 255
         * @returns 
         */
        static decToHex(c) {
            if(c < 0)c = 0;
            if(c > 255)c = 255;
            let hex = Math.round(Number(c)).toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }
        /**
         * rgb(0,0,0) to #000000
         * @param {RGB} rgb 
         * @returns {string}
         */
        static rgb2hex(rgb) {
            return "#" + Formula.decToHex(rgb.r) + Formula.decToHex(rgb.g) + Formula.decToHex(rgb.b);
        }
        /**
         * #000000 to rgb(0,0,0)
         * 
         * ignore alpha - #000a => #000 or #000000aa => #000000
         * @param {string} hex 
         * @returns {RGB}
         */
        static hex2rgb(hex) {
            if(!hex.startsWith('#'))hex = '#' + hex;
            if(hex.length > 4 && hex.length < 7)hex = hex.substring(0,4);
            if(hex.length > 7)hex = hex.substring(0,7);
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                return '#' + r + r + g + g + b + b;
            });
    
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            
            return { r, g, b };
        }
        /**
         * rgb(0,0,0) to hsl(0,0,0)
         * @param {RGB} rgb 
         * @returns {HSL} between 0 - 1
         */
        static rgb2hsl({r,g,b}) {            
            r /= 255;
            g /= 255;
            b /= 255;
            
            let max = Math.max(r,g,b);
            let min = Math.min(r,g,b);
            
            let h,s,l = (max + min) / 2;
        
            if (max == min) {
                h = s = 0; // achromatic
            } else {
                let d = max - min;
                s = (l > 0.5) ? d / (2 - max - min) : d / (max + min);
                
                if (max == r) {
                    h = (g - b) / d + (g < b ? 6 : 0);
                } else if (max == g) {
                    h = (b - r) / d + 2;
                } else if (max == b) {
                    h = (r - g) / d + 4;
                }
                
                h /= 6;
            }
        
            return {h,s,l}
        }
        /**
         * @private
         * @param {number} p 
         * @param {number} q 
         * @param {number} t 
         * @returns {number} 
         */
        static hue2rgb(p, q, t) {
            if (t < 0) 
                t += 1;
            if (t > 1) 
                t -= 1;
            if (t < 1./6) 
                return p + (q - p) * 6 * t;
            if (t < 1./2) 
                return q;
            if (t < 2./3)   
                return p + (q - p) * (2./3 - t) * 6;
            
            return p;
        }
        /**
         * hsl(0,0,0) to rgb(0,0,0)
         * @param {HSL} hsl 
         * @returns {RGB}
         */
        static hsl2rgb({h,s,l}) {
            let r, g, b = 0;
            if(0 == s) {
                r = g = b = l * 255; // achromatic
            } else {
                let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                let p = 2 * l - q;
                r = Formula.hue2rgb(p, q, h + 1./3) * 255;
                g = Formula.hue2rgb(p, q, h) * 255;
                b = Formula.hue2rgb(p, q, h - 1./3) * 255;
            }
        
            return {r, g, b};
        }
        /**
         * rgb(0,0,0) to hsv(0,0,0)
         * @param {RGB} rgb
         * @returns {HSV}
         */
        static rgb2hsv({r, g, b}) {        
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
         * hsv(0,0,0) to rgb(0,0,0)
         * @param {HSV} hsv 
         * @returns {RGB}
         */
        static hsv2rgb({h, s, v}) {
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
         * HSP equation from http://alienryderflex.com/hsp.html
         * @private
         * @param {RGB} rgb 
         * @returns {number} 
         */
        static getHSPValue = ({r, g, b}) => Math.sqrt(
            0.299 * (r * r) +
            0.587 * (g * g) +
            0.114 * (b * b)
        );
        /**
         * Is color contains more light or not
         * @param {RGB} rgb 
         * @returns {boolean}
         */
        static isLightColor(rgb) {
            return Formula.getHSPValue(rgb) > (255 / 2);
        }
    }
    
    /**
     * @constructor
     * @param {HTMLElement} parentel 
     */
    function ColorPicker(parentel, options) {
        if(!(this instanceof ColorPicker)) return new ColorPicker(parentel, options);
        options = {...defaultOptions, ...options};

        const $this = this;

        const boxWidth = options.size;
        const boxHeight = options.size - (options.size / options.ratio);
        const sliderWidth = options.size;
        const sliderHeight = options.size / options.ratio;

        const boxPointerPos = {
            x: 0,
            y: 0,
        }
        let sliderThumbPos = 0;

        const elems = {
            box: document.createElement('div'),
            slider_container: document.createElement('div'),
            box_pointer: document.createElement('div'),
            slider_track: document.createElement('div'),
            slider_thumb: document.createElement('div'),
        }
        parentel.classList.add('color-picker');
        elems.box.classList.add('color-picker-box');
        elems.box_pointer.classList.add('color-picker-pointer');
        elems.slider_container.classList.add('color-picker-slider-container');
        elems.slider_thumb.classList.add('color-picker-pointer');
        elems.slider_track.classList.add('color-picker-slider-track');
        parentel.style.margin = (options.pointerSize / 2)+'px';
        elems.box.style.width = boxWidth+'px';
        elems.box.style.height = boxHeight+'px';
        elems.box_pointer.style.width = options.pointerSize+'px';
        elems.box_pointer.style.height = options.pointerSize+'px';
        elems.slider_container.style.width = sliderWidth+'px';
        elems.slider_container.style.height = sliderHeight+'px';
        elems.slider_track.style.width = sliderWidth+'px';
        elems.slider_track.style.height = (options.pointerSize / 2)+'px';
        elems.slider_thumb.style.width = options.pointerSize+'px';
        elems.slider_thumb.style.height = options.pointerSize+'px';

        parentel.innerHTML = '';
        
        parentel.appendChild(elems.box);
        parentel.appendChild(elems.slider_container);
        elems.box.appendChild(elems.box_pointer);
        elems.slider_container.appendChild(elems.slider_track);
        elems.slider_track.appendChild(elems.slider_thumb);

        /**
         * View - box background
         * @param {string} color 
         */
        function setBoxBG(color) {
            elems.box.style.backgroundImage = `linear-gradient(to top, #000, #0000), linear-gradient(to left, ${color}, #fff)`;
        }
        /**
         * View - Box pointer color
         * @param {string} bg
         * @param {string} color 
         */
        function setBoxPointerColor(bg,color) {
            elems.box_pointer.style.backgroundColor = bg;
            elems.box_pointer.style.color = color ?? '#fff';
        }
        /**
         * View - Slider thumb color
         * @param {string} bg
         * @param {string} color 
         */
        function setSliderThumbColor(bg,color) {
            elems.slider_thumb.style.backgroundColor = bg;
            elems.slider_thumb.style.color = color ?? '#fff';
        }
        /**
         * View - (x, y) center position
         * @param {number} x
         * @param {number} y
         */
        function setBoxPointerPosition(x, y) {
            if(x < 0)x = 0;
            if(y < 0)y = 0;
            if(x > boxWidth)x = boxWidth;
            if(y > boxHeight)y = boxHeight;

            boxPointerPos.x = x;
            boxPointerPos.y = y;

            // centering view
            let centerX = x - (options.pointerSize / 2)
            let centerY = y - (options.pointerSize / 2)
            elems.box_pointer.style.top = centerY+'px';
            elems.box_pointer.style.left = centerX+'px';
        }
        /**
         * View - x center position
         * @param {number} x
         */
        function setThumbPosition(x) {
            if(x < 0)x = 0;
            if(x > sliderWidth)x = sliderWidth;
            let y = (options.pointerSize / 2) / 2; // center

            sliderThumbPos = x;

            // centering view
            let centerX = x - (options.pointerSize / 2)
            let centerY = y - (options.pointerSize / 2)
            elems.slider_thumb.style.top = centerY+'px';
            elems.slider_thumb.style.left = centerX+'px';
        }
        /**
         * View - check is coor position given on the slider thumb?
         * @param {number} x 
         * @param {number} y 
         * @returns {boolean}
         */
        function isOnSliderThumbPos(x, y) {
            return (x >= (sliderThumbPos - (options.pointerSize / 2)) && x <= (sliderThumbPos + (options.pointerSize / 2)));
        }
        /**
         * View - check is coor position given on the box pointer?
         * @param {number} x 
         * @param {number} y 
         * @returns {boolean}
         */
        function isOnBoxPointerPos(x, y) {
            return (x >= (boxPointerPos.x - (options.pointerSize / 2)) && x <= (boxPointerPos.x + (options.pointerSize / 2))) && 
                   (y >= (boxPointerPos.y - (options.pointerSize / 2)) && y <= (boxPointerPos.y + (options.pointerSize / 2)));
        }

        /**
         * Internal use only
         * @type {boolean}
         */
        let dragging = false;

        /**
         * Internal use only
         * @type {Object.<string,Array<Function>>}
         */
        const listeners = {}
        /**
         * 
         * @param {string} name 
         * @param {Function} callback 
         * @returns 
         */
        function addEventListener(name,callback) {
            if(!listeners[name])listeners[name] = [];
            if(typeof callback !== 'function')return;
            if(!listeners[name].includes(callback)) {
                listeners[name].push(callback);
            }
        }
        this.addEventListener = addEventListener;
        /**
         * 
         * @param {string} name 
         * @param {Function} callback 
         * @returns 
         */
        function removeEventListener(name,callback) {
            if(!listeners[name])return;
            if(typeof callback !== 'function')return;
            let idx = listeners[name].findIndex(l => l === callback);
            if(idx != -1) {
                listeners[name].splice(idx, 1);
            }
        }
        this.removeEventListener = removeEventListener;
        /**
         * 
         * @param {string} name 
         * @param {any} args 
         * @returns 
         */
        function dispatchEvent(name,...args) {
            if(!listeners[name])return;
            for (const callback of listeners[name]) {
                callback.apply($this, args);
            }
        }

        /**
         * View + system - Handle box pointer move
         * @param {MouseEvent} event 
         */
        function HandlePointer(event) {
            if(event.type === 'mousedown'){
                dragging = true;
                document.documentElement.style.cursor = 'grab';
                document.addEventListener('mousemove',HandlePointer);
                document.addEventListener('mouseup', HandlePointer);
            }
            if(event.type === 'mouseup'){
                dragging = false;
                document.documentElement.style.cursor = 'default';
                document.removeEventListener('mousemove',HandlePointer);
                document.removeEventListener('mouseup', HandlePointer);
            }
            if(event.type === 'mousemove' && !dragging)return;
            let rect = elems.box.getBoundingClientRect();
            let x = event.clientX - rect.left;
            let y = event.clientY - rect.top;
            setBoxPointerPosition(x, y);
            updateBoxSelectedColor();
        }
        elems.box.addEventListener('mousedown', HandlePointer);

        /**
         * View + system - Handle slider thumb move
         * @param {MouseEvent} event 
         */
        function HandleSlider(event) {
            if(event.type === 'mousedown'){
                dragging = true;
                document.documentElement.style.cursor = 'grab';
                document.addEventListener('mousemove',HandleSlider);
                document.addEventListener('mouseup', HandleSlider);
            }
            if(event.type === 'mouseup'){
                dragging = false;
                document.documentElement.style.cursor = 'default';
                document.removeEventListener('mousemove',HandleSlider);
                document.removeEventListener('mouseup', HandleSlider);
            }
            if(event.type === 'mousemove' && !dragging)return;
            let rect = elems.slider_track.getBoundingClientRect();
            let x = event.clientX - rect.left;
            setThumbPosition(x);
            updateSelectedColor();
        }
        elems.slider_track.addEventListener('mousedown', HandleSlider);

        /**
         * View + system - Handle mouse move (check if hover & note dragging)
         * @param {MouseEvent} event 
         */
        function HandleCursor(event) {
            // on hover box
            let rect = elems.box.getBoundingClientRect();
            let x = event.clientX - rect.left;
            let y = event.clientY - rect.top;

            if(dragging){
                elems.box.style.cursor = '';
                elems.slider_track.style.cursor = '';
                return;
            }

            if(isOnBoxPointerPos(x, y)) {
                elems.box.style.cursor = 'pointer';
            } else {
                elems.box.style.cursor = '';
            }

            // on hover slider track
            rect = elems.slider_track.getBoundingClientRect();
            x = event.clientX - rect.left;
            y = event.clientY - rect.top;
            if(isOnSliderThumbPos(x, y)) {
                elems.slider_track.style.cursor = 'pointer';
            } else {
                elems.slider_track.style.cursor = '';
            }
        }
        document.addEventListener('mousemove', HandleCursor);

        /**
         * View + system - Update view & trigger callback `change-color`
         */
        function updateSelectedColor() {
            updateSliderThumbColor()
            updateBoxSelectedColor();
        }
        /**
         * View - Update view only (called on change slider thumb)
         */
        function updateSliderThumbColor() {
            const rgb = getSliderSelectedColor();
            const textColor = Formula.isLightColor(rgb) ? '#000000': '#ffffff';
            const selectedColor = Formula.rgb2hex(rgb);
            setSliderThumbColor(selectedColor,textColor);
            setBoxBG(selectedColor);
        }
        /**
         * View + system - Update box view & trigger callback `change-color`
         */
        function updateBoxSelectedColor() {
            const rgb = getBoxSelectedColor();
            const textColor = Formula.isLightColor(rgb) ? '#000000': '#ffffff';
            const selectedColor = Formula.rgb2hex(rgb);
            setBoxPointerColor(selectedColor,textColor);

            dispatchEvent('change-color',selectedColor);
        }

        /**
         * System - Get RGB Color from given box pointer position
         * @param {{x:number,y:number}} pos 
         * @returns {RGB}
         */
        function getBoxSelectedColorFromPos(pos) {
            const hsv = {};
            hsv.h = getSelectedHue();
            hsv.s = pos.x / boxWidth;
            hsv.v = 1 - pos.y / boxHeight;
            return Formula.hsv2rgb(hsv);
        }

        /**
         * System - Get RGB Color from current box pointer position
         * @returns {RGB}
         */
        function getBoxSelectedColor() {
            return getBoxSelectedColorFromPos(boxPointerPos);
        }
        /**
         * System - Get RGB Color from current slider thumb position
         * @returns {RGB}
         */
        function getSliderSelectedColor() {
            const hsl = {
                h: getSelectedHue(),
                s: 1,
                l: 0.5,
            };
            return Formula.hsl2rgb(hsl);
        }
        /**
         * System - Get Color Hue value from current slider thumb position, in range 0 - 1.
         * @returns {number} [ 0 - 1 ]
         */
        function getSelectedHue() {
            return sliderThumbPos / sliderWidth;
        }

        /**
         * System - Get Slider Thumb Position from given color
         * @param {RGB} rgb - color in RGB Format
         */
        function getSliderThumbPosFromColor(rgb) {
            const { h } = Formula.rgb2hsl(rgb);

            return h * sliderWidth;
        }
        /**
         * System - Get Box Pointer Position from given color
         * @param {RGB} rgb - color in RGB Format
         */
        function getBoxPointerPosFromColor(rgb) {
            const { s, v } = Formula.rgb2hsv(rgb);

            let x = s * boxWidth;
            let y = (1 - v) * boxHeight;

            return [x, y];
        }

        /**
         * App - Change color & update view & trigger event `change-color`
         * @param {string} hexColor - color in HEX Format
         */
        function setColor(hexColor) {
            const rgb = Formula.hex2rgb(hexColor);

            let pos = getSliderThumbPosFromColor(rgb);
            let boxPointer_pos = getBoxPointerPosFromColor(rgb);

            setThumbPosition(pos);
            setBoxPointerPosition(...boxPointer_pos);

            // update view
            updateSelectedColor();
        }
        this.setColor = setColor;

        setColor(options.defaultColor);
    }
    /**
     * @constructor
     * @param {Object} options 
     * @returns {Popup}
     */
    function Popup(options) {
        if(!(this instanceof Popup))return new Popup(options);
        const $this = this;

        const colorPickerParentEl = document.createElement('div');
        colorPickerParentEl.style.position = 'absolute';
        colorPickerParentEl.style.top = '-9999px';
        colorPickerParentEl.style.left = '-9999px';
        colorPickerParentEl.classList.add('popup');
        const colorPicker = new ColorPicker(colorPickerParentEl, options);
        this.getColorPicker = function() {
            return colorPicker;
        }
        /**
         * 
         * @param {(parentel:HTMLElement) => void} callback
         */
        function open(callback) {
            document.addEventListener('mousedown',HandleClickMain,true);
            document.body.appendChild(colorPickerParentEl);
            colorPickerParentEl.style.top = '-9999px';
            colorPickerParentEl.style.left = '-9999px';
            callback(colorPickerParentEl);
        }
        this.open = open;
        function close() {
            document.removeEventListener('mousedown',HandleClickMain, true);
            colorPickerParentEl.style.top = '-9999px';
            colorPickerParentEl.style.left = '-9999px';
            colorPickerParentEl.remove();
        }
        this.close = close;

        function HandleClickMain(event) {
            let node = event.target;
            while(node.parentNode && node !== colorPickerParentEl)node = node.parentNode;
            if(node !== colorPickerParentEl){
                close();
            }
        }
    }
    const defaultOptions = {
        size: 300,
        ratio: 6 / 1,
        defaultColor: '#0000ff',
        pointerSize: 20,
    }

    ColorPicker.Formula = Formula;
    ColorPicker.Popup = Popup;

    window.CustomColorPicker = ColorPicker;
})()