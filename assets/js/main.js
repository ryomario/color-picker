import { copyText, hex2rgb, rgbToHex, getCSSColorRGB, getRelativeLuminance } from './tools.js';
window.copyText = copyText;

document.addEventListener('DOMContentLoaded', function() {
    const initColorHex = '#56baed';
    const initColorRGB = hex2rgb(initColorHex);
    const inputBGColor = document.getElementById('background_color');
    inputBGColor.value = initColorHex;

    const onInput = function () {
        const bg = hex2rgb(inputBGColor.value);

        const y = getRelativeLuminance(bg);

        const is_color_light = y > (255 / 2);

        let fg = '#ffffff';
        if(is_color_light) {
            fg = '#000000';
        }
        document.body.style.color = getCSSColorRGB(hex2rgb(fg));
        document.body.style.backgroundColor = getCSSColorRGB(bg);

        document.getElementById('text_color_txt').value = fg;
        document.getElementById('background_color_txt').value = inputBGColor.value;
        document.getElementById('background_color_rgb').value = getCSSColorRGB(bg);
    };
    inputBGColor.addEventListener('input', onInput);

    onInput();

    // RGB picker
    const inputsRange = this.querySelectorAll('.rgb-color-picker input[type=range]');
    const targetRGBInput = this.getElementById('background_color');
    const changeInput = () => {
        const colorMap = {r:0,g:0,b:0};
        inputsRange.forEach(input => {
            const fieldColor = input.getAttribute('data-color');
            colorMap[fieldColor] = input.value;
        });
        targetRGBInput.value = rgbToHex(colorMap);
        onInput();
    }
    inputsRange.forEach(input => {
        input.min = 0;
        input.max = 255;
        
        const fieldColor = input.getAttribute('data-color');
        input.value = initColorRGB[fieldColor];
        const valuePreviewEl = this.querySelector('.rgb-color-picker .rgb-color-'+fieldColor+' .value');
        const previewEl = this.querySelector('.rgb-color-picker .rgb-color-'+fieldColor+' .preview');

        const onInputRange = () => {
            valuePreviewEl.textContent = (input.value);
            const thisColorMap = {r:0,g:0,b:0};
            thisColorMap[fieldColor] = input.value;
            previewEl.style.backgroundColor = getCSSColorRGB(thisColorMap);
            changeInput();
        }

        input.addEventListener('input', onInputRange);

        onInputRange();
    })
})