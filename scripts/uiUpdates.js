import { hslToHex } from "./colorConversion.js";

export function updateBackgroundColor(bgParams) {
  const {
    hue,
    saturation,
    lightness,
    hexInput,
    hueValue,
    saturationValue,
    lightnessValue,
  } = bgParams;
  const h = hue.value;
  const s = saturation.value * 100;
  const l = lightness.value * 100;
  const hexColor = hslToHex(h, s, l);

  if (hueValue) hueValue.textContent = hue.value;
  if (saturationValue) saturationValue.textContent = saturation.value;
  if (lightnessValue) lightnessValue.textContent = lightness.value;

  let backgroundColorDisplay = document.querySelector(".background");
  backgroundColorDisplay.style.backgroundColor = hexColor;
  hexInput.value = hexColor;

  updateSliderColor(lightness.value);
}

export function updateTextColor(textParams, bgHexInput) {
  const {
    hue,
    saturation,
    lightness,
    hexInput,
    hueValue,
    saturationValue,
    lightnessValue,
  } = textParams;
  const h = hue.value;
  const s = saturation.value * 100;
  const l = lightness.value * 100;
  const hexColor = hslToHex(h, s, l);

  if (hueValue) hueValue.textContent = hue.value;
  if (saturationValue) saturationValue.textContent = saturation.value;
  if (lightness) lightnessValue.textContent = lightness.value;

  let textColorDisplay = document.querySelectorAll(".text");
  textColorDisplay.forEach((element) => {
    element.style.color = hexColor;
  });
  hexInput.value = hexColor;

  updateButtonStyles(hexColor, bgHexInput.value);
  updateSlideThumbsColor(hexColor);
}

export function adjustTextColor(
  colorsSection,
  backgroundLightness,
  textElements,
  updateButtonStyles,
  updateSlideThumbsColor,
  updateContrastCheckTextColor
) {
  const textColor = backgroundLightness <= 0.5 ? "#FFF" : "#000";
  const bgColor = backgroundLightness > 0.5 ? "#FFF" : "#000";
  colorsSection.style.color = textColor;

  textElements.forEach((element) => {
    if (element) {
      element.style.color = textColor;
    }
  });

  updateButtonStyles(textColor, bgColor);
  updateSlideThumbsColor(textColor);
  updateContrastCheckTextColor(backgroundLightness);
}

export function updateButtonStyles(textColor, bgColor) {
  const buttons = document.querySelectorAll(".button.text");
  buttons.forEach((button) => {
    button.style.backgroundColor = textColor;
    button.style.color = bgColor;
  });
}

export function updateSlideThumbsColor(thumbColor) {
  const sliders = document.querySelectorAll(".slider");
  sliders.forEach((slider) => {
    slider.style.setProperty("--thumb-color", thumbColor);
  });
}

export function updateSliderColor(lightness) {
  const sliderBorderColor =
    lightness > 0.5 ? "hsla(0, 0%, 0%, 0.4)" : "hsla(0, 0%, 100%, 0.4)";
  const sliders = document.querySelectorAll(".slider");
  sliders.forEach((slider) => {
    slider.style.setProperty("--slider-border-color", sliderBorderColor);
  });
}

export function updateContrastCheckTextColor(bgColor) {
  const contrastCheckDisplay = document.querySelector("#contrast-check");
  const textColor = bgColor <= 0.5 ? "#fff" : "#000";
  contrastCheckDisplay.style.color = textColor;
}
