const textHue = document.querySelector("#text-hue");
const textHueValue = document.querySelector("#text-hue-value");

const textSaturation = document.querySelector("#text-saturation");
const textSaturationValue = document.querySelector("#text-saturation-value");

const textLightness = document.querySelector("#text-lightness");
const textLightnessValue = document.querySelector("#text-lightness-value");

const bgHue = document.querySelector("#background-hue");
const bgHueValue = document.querySelector("#background-hue-value");

const bgSaturation = document.querySelector("#background-saturation");
const bgSaturationValue = document.querySelector(
  "#background-saturation-value"
);

const bgLightness = document.querySelector("#background-lightness");
const bgLightnessValue = document.querySelector("#background-lightness-value");

textHue.addEventListener("input", () => {
  textHueValue.textContent = textHue.value;
  updateTextColor();
});

textSaturation.addEventListener("input", () => {
  textSaturationValue.textContent = textSaturation.value;
  updateTextColor();
});

textLightness.addEventListener("input", () => {
  textLightnessValue.textContent = textLightness.value;
  updateTextColor();
});

bgHue.addEventListener("input", () => {
  bgHueValue.textContent = bgHue.value;
  updateBackgroundColor();
});

bgSaturation.addEventListener("input", () => {
  bgSaturationValue.textContent = bgSaturation.value;
  updateBackgroundColor();
});

bgLightness.addEventListener("input", () => {
  bgLightnessValue.textContent = bgLightness.value;
  updateBackgroundColor();
});

const rndButton = document.querySelector("#button-random");

rndButton.addEventListener("click", () => {
  generateRandomColors();
});

const revButton = document.querySelector("#button-reverse");

revButton.addEventListener("click", () => {
  switchColors();
});

function generateRandomColors() {
  textHue.value = generateHue();
  textSaturation.value = generateSaturationOrLightness();
  textLightness.value = generateSaturationOrLightness();
  bgHue.value = generateHue();
  bgSaturation.value = generateSaturationOrLightness();
  bgLightness.value = generateSaturationOrLightness();

  updateBackgroundColor();
  updateTextColor();
}

function generateHue() {
  return Math.floor(Math.random() * 360);
}

function generateSaturationOrLightness() {
  const precision = 100;
  return Math.floor(Math.random() * precision) / precision;
}

function switchColors() {
  const tempHue = textHue.value;
  const tempSat = textSaturation.value;
  const tempLight = textLightness.value;
  textHue.value = bgHue.value;
  textSaturation.value = bgSaturation.value;
  textLightness.value = bgLightness.value;
  bgHue.value = tempHue;
  bgSaturation.value = tempSat;
  bgLightness.value = tempLight;
  updateBackgroundColor();
  updateTextColor();
}

function hsltoHex(h, s, l) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

const bgHex = document.querySelector("#background-value");
const textHex = document.querySelector("#text-value");

function updateBackgroundColor() {
  const h = bgHue.value;
  const s = bgSaturation.value * 100;
  const l = bgLightness.value * 100;
  const hexColor = hsltoHex(h, s, l);

  bgHueValue.textContent = bgHue.value;
  bgSaturationValue.textContent = bgSaturation.value;
  bgLightnessValue.textContent = bgLightness.value;

  let backgroundColorDisplay = document.querySelector(".background");
  backgroundColorDisplay.style.backgroundColor = hexColor;
  bgHex.value = hexColor;
}

function updateTextColor() {
  const h = textHue.value;
  const s = textSaturation.value * 100;
  const l = textLightness.value * 100;
  const hexColor = hsltoHex(h, s, l);

  textHueValue.textContent = textHue.value;
  textSaturationValue.textContent = textSaturation.value;
  textLightnessValue.textContent = textLightness.value;

  let textColorDisplay = document.querySelectorAll(".text");
  textColorDisplay.forEach((element) => {
    element.style.color = hexColor;
  });
  textHex.value = hexColor;
}

document.addEventListener("DOMContentLoaded", () => {
  start();
});

function start() {
  generateRandomColors();
  updateBackgroundColor();
  updateTextColor();
}
