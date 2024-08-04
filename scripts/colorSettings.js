import { hslToHex } from "./colorConversion.js";
import { getOriginalHexValues, setOriginalHexValues } from "./eventHandlers.js";

export function generateRandomColors(
  textParams,
  bgParams,
  debounceUpdateContrast
) {
  const randomHue = () => Math.floor(Math.random() * 360);
  const randomSaturation = () => Math.random();
  const randomLightness = () => Math.random();

  // Generera slumpmässiga HSL-värden
  const textHsl = {
    h: randomHue(),
    s: randomSaturation(),
    l: randomLightness(),
  };

  const bgHsl = {
    h: randomHue(),
    s: randomSaturation(),
    l: randomLightness(),
  };

  textParams.hue.value = textHsl.h;
  textParams.saturation.value = textHsl.s;
  textParams.lightness.value = textHsl.l;

  bgParams.hue.value = bgHsl.h;
  bgParams.saturation.value = bgHsl.s;
  bgParams.lightness.value = bgHsl.l;

  changeOriginalHexValues(textParams, bgParams);
  debounceUpdateContrast();
}

export function switchColors(textParams, bgParams, debounceUpdateContrast) {
  const tempHue = textParams.hue.value;
  const tempSat = textParams.saturation.value;
  const tempLight = textParams.lightness.value;

  textParams.hue.value = bgParams.hue.value;
  textParams.saturation.value = bgParams.saturation.value;
  textParams.lightness.value = bgParams.lightness.value;

  bgParams.hue.value = tempHue;
  bgParams.saturation.value = tempSat;
  bgParams.lightness.value = tempLight;

  changeOriginalHexValues(textParams, bgParams);
  debounceUpdateContrast();
}

export function changeOriginalHexValues(textParams, bgParams) {
  const textHex = hslToHex(
    textParams.hue.value,
    textParams.saturation.value * 100,
    textParams.lightness.value * 100
  );
  const bgHex = hslToHex(
    bgParams.hue.value,
    bgParams.saturation.value * 100,
    bgParams.lightness.value * 100
  );

  // Updatera Hex-fälten
  textParams.hexInput.value = textHex;
  bgParams.hexInput.value = bgHex;

  // Updatera de ursprungliga Hex-värdena
  const originalHexValues = getOriginalHexValues();
  originalHexValues.text = textHex;
  originalHexValues.background = bgHex;
  setOriginalHexValues(originalHexValues);
}
