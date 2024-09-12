import "./assets/css/styles.css";
import "./assets/css/color-picker.css";
import ColorPicker from "./color-picker";

document.addEventListener('DOMContentLoaded', function(e) {
    const cp = new ColorPicker(document.getElementById('color-picker'),{
        size: 300,
        defaultColor: '#56baed',
    })
});