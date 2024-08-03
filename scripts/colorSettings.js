import { updateBackgroundColor } from "./uiUpdates.js";

export function generateRandomColors(
  textParams,
  bgParams,
  debounceUpdateColorsAndContrast
) {
  textParams.hue.value = generateHue();
  textParams.saturation.value = generateSaturationOrLightness();
  textParams.lightness.value = generateSaturationOrLightness();
  bgParams.hue.value = generateHue();
  bgParams.saturation.value = generateSaturationOrLightness();
  bgParams.lightness.value = generateSaturationOrLightness();

  updateBackgroundColor(bgParams);
  debounceUpdateColorsAndContrast();
}

export function switchColors(
  textParams,
  bgParams,
  debounceUpdateColorsAndContrast
) {
  const tempHue = textParams.hue.value;
  const tempSat = textParams.saturation.value;
  const tempLight = textParams.lightness.value;
  textParams.hue.value = bgParams.hue.value;
  textParams.saturation.value = bgParams.saturation.value;
  textParams.lightness.value = bgParams.lightness.value;
  bgParams.hue.value = tempHue;
  bgParams.saturation.value = tempSat;
  bgParams.lightness.value = tempLight;
  debounceUpdateColorsAndContrast();
}

export function generateHue() {
  return Math.floor(Math.random() * 360);
}

export function generateSaturationOrLightness() {
  const precision = 100; //Få värden med två decimalers precision
  return Math.floor(Math.random() * precision) / precision;
}
