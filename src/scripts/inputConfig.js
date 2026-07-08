const InputHorizontal = document.getElementById("Width");
const inputVertical = document.getElementById("Height");

const horButtonPlus = document.getElementById("plus-hor");
const horButtonMinus = document.getElementById("minus-hor");
const verButtonPlus = document.getElementById("plus-ver");
const verButtonMinus = document.getElementById("minus-ver");

// --- Configuración para el Input Horizontal (Width) ---

horButtonPlus.addEventListener("click", () => {
    let currentValue = parseFloat(InputHorizontal.value) || 0;
    InputHorizontal.value = currentValue + 1;
    InputHorizontal.dispatchEvent(new Event('input'));
});

horButtonMinus.addEventListener("click", () => {
    let currentValue = parseFloat(InputHorizontal.value) || 0;
    if (currentValue > 0) {
        InputHorizontal.value = currentValue - 1;
        InputHorizontal.dispatchEvent(new Event('input'));
    }
});

// --- Configuración para el Input Vertical (Height) ---

verButtonPlus.addEventListener("click", () => {
    let currentValue = parseFloat(inputVertical.value) || 0;
    inputVertical.value = currentValue + 1;
    inputVertical.dispatchEvent(new Event('input'));
});

verButtonMinus.addEventListener("click", () => {
    let currentValue = parseFloat(inputVertical.value) || 0;
    if (currentValue > 0) {
        inputVertical.value = currentValue - 1;
        inputVertical.dispatchEvent(new Event('input'));
    }
});

