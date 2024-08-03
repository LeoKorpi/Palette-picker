import { hslToHex } from "./colorConversion.js";

export function updateBackgroundColor(
  bgHue,
  bgSaturation,
  bgLightness,
  bgHexInput,
  bgHueValue,
  bgSaturationValue,
  bgLightnessValue
) {
  const h = bgHue.value;
  const s = bgSaturation.value * 100;
  const l = bgLightness.value * 100;
  const hexColor = hslToHex(h, s, l);

  if (bgHueValue) bgHueValue.textContent = bgHue.value;
  if (bgSaturationValue) bgSaturationValue.textContent = bgSaturation.value;
  if (bgLightnessValue) bgLightnessValue.textContent = bgLightness.value;

  let backgroundColorDisplay = document.querySelector(".background");
  backgroundColorDisplay.style.backgroundColor = hexColor;
  bgHexInput.value = hexColor;

  updateSliderColor(bgLightness.value);
}

export function updateTextColor(
  textHue,
  textSaturation,
  textLightness,
  textHexInput,
  textHueValue,
  textSaturationValue,
  textLightnessValue,
  bgHexInput
) {
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
  textHexInput.value = hexColor;

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
