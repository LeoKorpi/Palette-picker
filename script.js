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
  debounceUpdateColorsAndContrast();
});

textSaturation.addEventListener("input", () => {
  textSaturationValue.textContent = textSaturation.value;
  debounceUpdateColorsAndContrast();
});

textLightness.addEventListener("input", () => {
  textLightnessValue.textContent = textLightness.value;
  debounceUpdateColorsAndContrast();
});

bgHue.addEventListener("input", () => {
  bgHueValue.textContent = bgHue.value;
  debounceUpdateColorsAndContrast();
});

bgSaturation.addEventListener("input", () => {
  bgSaturationValue.textContent = bgSaturation.value;
  debounceUpdateColorsAndContrast();
});

bgLightness.addEventListener("input", () => {
  bgLightnessValue.textContent = bgLightness.value;
  debounceUpdateColorsAndContrast();
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
  debounceUpdateColorsAndContrast();
}

function generateHue() {
  return Math.floor(Math.random() * 360);
}

function generateSaturationOrLightness() {
  const precision = 100; //Få värden med två decimalers precision
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
  debounceUpdateColorsAndContrast();

  //Det är något konstigt här, funkar endast när contrast-ration är över 3 (varför?)
}

function hslToHex(h, s, l) {
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
  const hexColor = hslToHex(h, s, l);

  bgHueValue.textContent = bgHue.value;
  bgSaturationValue.textContent = bgSaturation.value;
  bgLightnessValue.textContent = bgLightness.value;

  let backgroundColorDisplay = document.querySelector(".background");
  backgroundColorDisplay.style.backgroundColor = hexColor;
  bgHex.value = hexColor;
  updateSliderColor(bgLightness.value);
}

function updateTextColor() {
  const h = textHue.value;
  const s = textSaturation.value * 100;
  const l = textLightness.value * 100;
  const hexColor = hslToHex(h, s, l);

  textHueValue.textContent = textHue.value;
  textSaturationValue.textContent = textSaturation.value;
  textLightnessValue.textContent = textLightness.value;

  let textColorDisplay = document.querySelectorAll(".text");
  textColorDisplay.forEach((element) => {
    element.style.color = hexColor;
  });
  textHex.value = hexColor;

  updateButtonStyles(hexColor, bgHex.value);
  updateSlideThumbsColor(hexColor);
}

function updateButtonStyles(textColor, bgColor) {
  const buttons = document.querySelectorAll(".button.text");
  buttons.forEach((button) => {
    button.style.backgroundColor = textColor;
    button.style.color = bgColor;
  });
}

function updateSlideThumbsColor(thumbColor) {
  const sliders = document.querySelectorAll(".slider");
  sliders.forEach((slider) => {
    slider.style.setProperty("--thumb-color", thumbColor);
  });
}

function updateSliderColor(lightness) {
  const sliderBorderColor =
    lightness > 0.5 ? "hsla(0, 0%, 0%, 0.4)" : "hsla(0, 0%, 100%, 0.4)";
  const sliders = document.querySelectorAll(".slider");
  sliders.forEach((slider) => {
    slider.style.setProperty("--slider-border-color", sliderBorderColor);
  });
}

async function fetchContrastRatio(textColor, bgColor) {
  const response = await fetch(
    `https://webaim.org/resources/contrastchecker/?fcolor=${textColor}&bcolor=${bgColor}&api`
  );
  const data = await response.json();
  return data;
}

async function updateContrastRatio() {
  const textHexColor = hslToHex(
    textHue.value,
    textSaturation.value * 100,
    textLightness.value * 100
  ).substring(1); //Substring för att ta bort '#'
  const bgHexColor = hslToHex(
    bgHue.value,
    bgSaturation.value * 100,
    bgLightness.value * 100
  ).substring(1);

  const data = await fetchContrastRatio(textHexColor, bgHexColor);
  const contrastRatio = data.ratio;
  const contrastRatioDisplay = document.querySelector("#contrast-ratio");
  contrastRatioDisplay.textContent = `${contrastRatio}`;
  const contrastCheckDisplay = document.querySelector("#contrast-check");
  const contrastResult = displayContrastCheck(contrastRatio);

  if (contrastResult === "Fail") {
    adjustTextColor();
  } else {
    updateTextColor();
  }
  contrastCheckDisplay.textContent = contrastResult;
}

function displayContrastCheck(contrastRatio) {
  if (contrastRatio < 3) return "Fail";
  if (contrastRatio >= 3 && contrastRatio < 4.5) return "AA";
  if (contrastRatio >= 4.5 && contrastRatio < 7) return "Large Text";
  if (contrastRatio >= 7) return "AAA";
}

function adjustTextColor() {
  const colorsSection = document.querySelector(".colors");
  const backgroundLightness = bgLightness.value;

  const textColor = backgroundLightness <= 0.5 ? "#FFF" : "#000";
  const bgColor = backgroundLightness > 0.5 ? "#FFF" : "#000";
  colorsSection.style.color = textColor;
  const textElements = colorsSection.querySelectorAll(".text");
  textElements.forEach((element) => {
    element.style.color = textColor;
  });

  updateButtonStyles(textColor, bgColor);
  updateSlideThumbsColor(textColor);
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const debounceUpdateColorsAndContrast = debounce(async () => {
  updateBackgroundColor();
  await updateContrastRatio();
}, 12); // antalet millisekunder innan metoden kan kallas på igen

document.addEventListener("DOMContentLoaded", () => {
  start();
});

function start() {
  generateRandomColors();
  debounceUpdateColorsAndContrast();
}
