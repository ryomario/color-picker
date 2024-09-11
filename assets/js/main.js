import { copyText } from './tools.js';
window.copyText = copyText;

document.addEventListener('DOMContentLoaded', function() {
    const Formula = CustomColorPicker.Formula;
    const initColorHex = '#56baed';
    const onInput = function () {
        const bg = Formula.hex2rgb(targetColorInput.value);

        const is_color_light = Formula.isLightColor(bg);

        let fg = '#ffffff';
        if(is_color_light) {
            fg = '#000000';
        }
        document.body.style.color = fg;
        document.body.style.backgroundColor = Formula.rgb2hex(bg);

        document.getElementById('text_color_txt').value = fg;
        document.getElementById('background_color_txt').value = targetColorInput.value;
        document.getElementById('background_color_rgb').value = Formula.rgb2hex(bg);
    };
    // Custom Color Picker
    const targetColorInput = this.getElementById('background_color');
    
    const colorPicker = new CustomColorPicker(this.getElementById('color-picker'), {
        defaultColor: initColorHex
    });
    colorPicker.addEventListener('change-color',function(color) {
        targetColorInput.value = color;
        onInput();
    });
    colorPicker.setColor('#56baed');

    const button = this.getElementById('color-picker-button');
    const colorPickerPopup = new CustomColorPicker.Popup({
        defaultColor: initColorHex
    });
    colorPickerPopup.getColorPicker().addEventListener('change-color',function(color) {
        const bg = Formula.hex2rgb(color);

        const is_color_light = Formula.isLightColor(bg);

        let fg = '#ffffff';
        if(is_color_light) {
            fg = '#000000';
        }
        button.style.color = fg;
        button.style.backgroundColor = Formula.rgb2hex(bg);
    });
    button.addEventListener('click',function(event) {
        colorPickerPopup.open(el => {
            let x = button.offsetLeft;
            let y = button.offsetTop - el.offsetHeight;

            el.style.top = y + 'px';
            el.style.left = x + 'px';
        })
    });
})