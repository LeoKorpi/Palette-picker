import { hslToHex } from "./colorConversion.js";
import { getContrastResult } from "./contrastCheck.js";
import {
  getOriginalHexValues,
  setOriginalHexValues,
  checkSelectedRadio,
} from "./eventHandlers.js";

function setHslValues(params, hsl) {
  params.hue.value = hsl.h;
  params.saturation.value = hsl.s;
  params.lightness.value = hsl.l;
}

function generateRandomHsl() {
  return {
    h: Math.floor(Math.random() * 360),
    s: Math.random() * 0.8 + 0.2,
    l: Math.random() * 0.7 + 0.3,
  };
}

function generateContrastingHsl(refLightness) {
  let lightnessDiff = Math.random() * 0.5 + 0.5;
  let newLightness = refLightness + lightnessDiff;

  if (newLightness > 1) {
    newLightness = refLightness - lightnessDiff;
  }

  return {
    h: Math.floor(Math.random() * 360),
    s: Math.random() * 0.8 + 0.2,
    l: newLightness,
  };
}

export async function generateRandomColors(
  textParams,
  bgParams,
  debounceUpdateContrast
) {
  let contrastRatio = 0;
  const minimumThreshold = checkSelectedRadio();
  const maxAttempts = 100;
  let attempts = 0;

  let textHsl, bgHsl;

  do {
    attempts++;

    // Generera slumpmässiga HSL-värden
    textHsl = generateRandomHsl();
    bgHsl = generateContrastingHsl(textHsl.l);

    setHslValues(textParams, textHsl);
    setHslValues(bgParams, bgHsl);

    contrastRatio = await getContrastResult(textParams, bgParams);

    if (attempts >= maxAttempts) {
      console.warn(
        "Max attempts reached. Using the latest generated combination."
      );
      break;
    }
  } while (contrastRatio <= minimumThreshold);

  setHslValues(textParams, textHsl);
  setHslValues(bgParams, bgHsl);

  changeOriginalHexValues(textParams, bgParams);
  debounceUpdateContrast();
}

export function switchColors(textParams, bgParams, debounceUpdateContrast) {
  const tempHue = textParams.hue.value;
  const tempSat = textParams.saturation.value;
  const tempLight = textParams.lightness.value;

  setHslValues(textParams, {
    h: bgParams.hue.value,
    s: bgParams.saturation.value,
    l: bgParams.lightness.value,
  });

  setHslValues(bgParams, {
    h: tempHue,
    s: tempSat,
    l: tempLight,
  });

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
