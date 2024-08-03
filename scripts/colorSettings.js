import { updateBackgroundColor, updateTextColor } from "./uiUpdates.js";
import { debounce } from "./utils.js";

export function generateRandomColors(
  textHue,
  textSaturation,
  textLightness,
  bgHue,
  bgSaturation,
  bgLightness,
  debounceUpdateColorsAndContrast,
  bgHexInput,
  bgHueValue,
  bgSaturationValue,
  bgLightnessValue
) {
  textHue.value = generateHue();
  textSaturation.value = generateSaturationOrLightness();
  textLightness.value = generateSaturationOrLightness();
  bgHue.value = generateHue();
  bgSaturation.value = generateSaturationOrLightness();
  bgLightness.value = generateSaturationOrLightness();

  updateBackgroundColor(
    bgHue,
    bgSaturation,
    bgLightness,
    debounceUpdateColorsAndContrast,
    bgHexInput,
    bgHueValue,
    bgSaturationValue,
    bgLightnessValue
  );
  debounceUpdateColorsAndContrast();
}

export function switchColors(
  textHue,
  textSaturation,
  textLightness,
  bgHue,
  bgSaturation,
  bgLightness,
  debounceUpdateColorsAndContrast
) {
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

export function generateHue() {
  return Math.floor(Math.random() * 360);
}

export function generateSaturationOrLightness() {
  const precision = 100; //Få värden med två decimalers precision
  return Math.floor(Math.random() * precision) / precision;
}
