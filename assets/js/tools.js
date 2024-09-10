export function copyText(idEl) {
    const textEl = document.getElementById(idEl);

    textEl.select();
    textEl.setSelectionRange(0,Number.MAX_VALUE);

    navigator.clipboard.writeText(textEl.value);

    alert("Copied the text: " + textEl.value);
}