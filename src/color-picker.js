/**
 * @typedef Position
 * @property {number} x
 * @property {number} y
 */

import ClassWithListener from "./base/ClassWithListener";
import { hex2rgb, hsv2rgb, isLightColor, isValidHexColor, rgb2hex, rgb2hsv } from "./tools/colors";
import { handleDragElement, rAFThrottle } from "./tools/webAnimation";

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

        input_hex: createInputHex(),
    }
    function createInput(label,value,onChange) {
        const container = document.createElement('div');
        const input = document.createElement('input');
        input.setAttribute('name',Date.now());
        container.classList.add('color-picker-inputfield');
        input.setAttribute('spellcheck','false');
        container.dataset.label = label;
        input.value = value;
        container.appendChild(input);

        input.addEventListener('input',onChange);
        return [container, input];
    }
    function createInputHex() {
        let changedFromInput = false;
        const [container, input] = createInput('HEX',options.defaultColor,(e) => {
            /**
             * @type {string}
             */
            let hexValue = e.currentTarget.value;
            hexValue = hexValue.trim();
            if(!isValidHexColor(hexValue))return

            changedFromInput = true;
            $this.setColor(hexValue);
        });

        $this.addEventListener('change.color.rgba',function({r,g,b,a}) {
            if(changedFromInput){
                changedFromInput = false;
                return;
            }
            input.value = rgb2hex({r,g,b,a},a == 1);
        });

        return container;
    }

    $this.addEventListener('view.update.elems',function(){
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
    
        $this.root.style.setProperty('--size',options.size + 'px');
    
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

    $this.addEventListener('view.update.colorhue',function(){
        let rgb = $this.getColorFromSelectedHue();
        $this.root.style.setProperty('--colorhue',rgb2hex(rgb));
    });
    $this.addEventListener('view.update.color',function(){
        let rgb = $this.getColorFromSelectedPointer();
        let alpha = $this.alphaPos;
        let color = rgb2hex(rgb,false);
        let colorWithAlpha = rgb2hex({...rgb,a:alpha});
        if(isLightColor(rgb))elems.colorbox_pointer.classList.remove('white');
        else elems.colorbox_pointer.classList.add('white');
        $this.root.style.setProperty('--color',color);
        $this.root.style.setProperty('--color-with-alpha',colorWithAlpha);
        $this.dispatchEvent('change.color.rgba',{...rgb,a: alpha});
    });
    $this.addEventListener('view.update.position.pointerInColorBox',function(){
        let {x, y} = $this.colorPos;
        x = elems.colorbox.offsetWidth * x;
        y = elems.colorbox.offsetHeight * y;
        elems.colorbox_pointer.style.left = x + 'px';
        elems.colorbox_pointer.style.top = y + 'px';
    });
    $this.addEventListener('view.update.position.pointerInHueSlider',function(){
        let x = $this.huePos;
        x = elems.hue_slider_track.offsetWidth * x;
        elems.hue_slider_thumb.style.left = x + 'px';
    });
    $this.addEventListener('view.update.position.pointerInAlphaSlider',function(){
        let x = $this.alphaPos;
        x = elems.alpha_slider_track.offsetWidth * x;
        elems.alpha_slider_thumb.style.left = x + 'px';
    });
    $this.addEventListener('update.view',function(){
        $this.dispatchEvent('view.update.position.pointerInColorBox');
        $this.dispatchEvent('view.update.position.pointerInHueSlider');
        $this.dispatchEvent('view.update.position.pointerInAlphaSlider');
        $this.dispatchEvent('view.update.colorhue');
        $this.dispatchEvent('view.update.color');
    });

    function updateColorBoxPointer({x,y}) {
        $this.colorPos = {x,y}
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
        return (x >= (elems.hue_slider_thumb.offsetLeft - radius) && x <= (elems.hue_slider_thumb.offsetLeft + radius));
    }
    /**
     * View - check is coor position given on the slider thumb?
     * @param {number} x 
     * @param {number} y 
     * @returns {boolean}
     */
    function isOnAlphaSliderThumbPos(x, y) {
        const radius = elems.alpha_slider_thumb.offsetWidth / 2;
        return (x >= (elems.alpha_slider_thumb.offsetLeft - radius) && x <= (elems.alpha_slider_thumb.offsetLeft + radius));
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
        return (x >= (viewX - radius) && x <= (viewX + radius)) && 
                (y >= (viewY - radius) && y <= (viewY + radius));
    }

    /**
     * Internal use only
     * @type {boolean}
     */
    let _dragging = false;
    const isDraging = () => _dragging;
    function setDragging(val) {
        _dragging = Boolean(val);
        if(_dragging){
            $this.root.classList.add('dragging');
        }else{
            $this.root.classList.remove('dragging');
        }
    }

    handleDragElement(elems.colorbox_pointer,elems.colorbox,{
        onstart: (event) => {
            setDragging(true);
            document.documentElement.style.setProperty('cursor','move','important');
            if(event instanceof TouchEvent)document.documentElement.style.setProperty('overflow','hidden');
        },
        onend: (event) => {
            setDragging(false);
            document.documentElement.style.setProperty('overflow','auto');
            document.documentElement.style.cursor = '';
        },
        ondefault: (event) => {
            if(!isDraging())return false;
            if(event instanceof TouchEvent){
                if(!event.cancelable || event.targetTouches.length != 1)return false;
                event.preventDefault();
                event.stopPropagation();
                event.clientX = event.targetTouches[0].clientX;
                event.clientY = event.targetTouches[0].clientY;
            }
            let rect = elems.colorbox.getBoundingClientRect();
            let x = event.clientX - rect.left;
            let y = event.clientY - rect.top;
            x = x / elems.colorbox.offsetWidth;
            y = y / elems.colorbox.offsetHeight;
            updateColorBoxPointer({x,y});
        }
    });

    handleDragElement(elems.hue_slider_thumb,elems.hue_slider_track,{
        onstart: (event) => {
            setDragging(true);
            document.documentElement.style.setProperty('cursor','ew-resize','important');
            if(event instanceof TouchEvent)document.documentElement.style.setProperty('overflow','hidden');
        },
        onend: (event) => {
            setDragging(false);
            document.documentElement.style.setProperty('overflow','auto');
            document.documentElement.style.cursor = '';
        },
        ondefault: (event) => {
            if(!isDraging())return false;
            if(event instanceof TouchEvent){
                if(!event.cancelable || event.targetTouches.length != 1)return false;
                event.preventDefault();
                event.stopPropagation();
                event.clientX = event.targetTouches[0].clientX;
                event.clientY = event.targetTouches[0].clientY;
            }
            let rect = elems.hue_slider_track.getBoundingClientRect();
            let x = event.clientX - rect.left;
            x = x / elems.hue_slider_track.offsetWidth;
            updateHueSliderPointer(x);
        }
    });

    handleDragElement(elems.alpha_slider_thumb,elems.alpha_slider_track,{
        onstart: (event) => {
            setDragging(true);
            document.documentElement.style.setProperty('cursor','ew-resize','important');
            if(event instanceof TouchEvent)document.documentElement.style.setProperty('overflow','hidden');
        },
        onend: (event) => {
            setDragging(false);
            document.documentElement.style.setProperty('overflow','auto');
            document.documentElement.style.cursor = '';
        },
        ondefault: (event) => {
            if(!isDraging())return false;
            if(event instanceof TouchEvent){
                if(!event.cancelable || event.targetTouches.length != 1)return false;
                event.preventDefault();
                event.stopPropagation();
                event.clientX = event.targetTouches[0].clientX;
                event.clientY = event.targetTouches[0].clientY;
            }
            let rect = elems.alpha_slider_track.getBoundingClientRect();
            let x = event.clientX - rect.left;
            x = x / elems.alpha_slider_track.offsetWidth;
            updateAlphaSliderPointer(x);
        }
    });
    
    /**
     * View + system - Handle mouse move (check if hover & note dragging)
     * @param {MouseEvent} event 
     */
    function HandleCursor(event) {
        // on hover box
        let rect = elems.box.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        if(isDraging()){
            elems.colorbox.style.cursor = '';
            elems.hue_slider_track.style.cursor = '';
            elems.alpha_slider_track.style.cursor = '';
            return;
        }

        if(isOnColorBoxPointerPos(x, y)) {
            elems.colorbox.style.cursor = 'move';
        } else {
            elems.colorbox.style.cursor = 'crosshair';
        }

        // on hover hue slider track
        rect = elems.hue_slider_track.getBoundingClientRect();
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
        if(isOnHueSliderThumbPos(x, y)) {
            elems.hue_slider_track.style.cursor = 'ew-resize';
        } else {
            elems.hue_slider_track.style.cursor = 'crosshair';
        }

        // on hover alpha slider track
        rect = elems.alpha_slider_track.getBoundingClientRect();
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
        if(isOnAlphaSliderThumbPos(x, y)) {
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
        if(elems.color_preview.classList.contains('copied'))return;

        let rgb = $this.getColorFromSelectedPointer();
        let alpha = $this.alphaPos;
        let color = rgb2hex({...rgb,a:alpha},alpha == 1);
        copyText(color,(copied) => {
            if(!copied){
                alert('Failed to copy!');
                return;
            }

            elems.color_preview.classList.add('copied');

            setTimeout(() => {
                elems.color_preview.classList.remove('copied');
            }, 1500);
        });
    }
    elems.color_preview.addEventListener('click',HandleCopyResult);

    
    $this.dispatchEvent('view.update.elems');
}

/**
 * 
 * @param {string} text 
 * @param {(copied: boolean)=>void} callback 
 */
async function copyText(text, callback) {
    try {
        let result = await navigator.permissions.query({ name: 'clipboard-write' });
        if(result.state != 'prompt' && result.state != 'granted')throw new Error('No Permission');
        await navigator.clipboard.writeText(text);
        callback(true);
    } catch (error) {
        callback(false);
    }
}

export default class ColorPicker extends ClassWithListener {
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
    set colorPos({x,y}) {
        if(x < 0)x = 0;
        if(x > 1)x = 1;
        if(y < 0)y = 0;
        if(y > 1)y = 1;
        this._colorPos = {x,y};
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
        if(x < 0)x = 0;
        if(x > 1)x = 1;
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
        if(x < 0)x = 0;
        if(x > 1)x = 1;
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
        options = {...ColorPicker.defaultOptions, ...options};

        const $this = this;
        this.colorPos = {x:0,y:0};
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
        return hsv2rgb({ h, s: 1, v: 1 });
    }

    /**
     * System - Get RGB Color from box pointer position
     * @returns {RGB}
     */
    getColorFromSelectedPointer() {
        let {x, y} = this.colorPos;
        let h = this.huePos;
        let s = x;
        let v = 1 - y;
        return hsv2rgb({ h, s, v});
    }

    /**
     * App - Change color & update view & trigger event `change-color`
     * @param {string} hexColor - color in HEX Format (auto fixed format)
     */
    setColor(hexColor) {
        const rgb = hex2rgb(hexColor);
        const { h, s, v } = rgb2hsv(rgb);
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
        defaultColor: '#0000ff',
    }
}