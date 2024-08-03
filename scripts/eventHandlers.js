import {
  hexToHsl,
  expandHex,
  isValidHex,
  hslToHex,
} from "./colorConversion.js";

export function handleHexInput(
  event,
  textParams,
  bgParams,
  debounceUpdateColorsAndContrast
) {
  const inputElement = event.target;
  let hexValue = inputElement.value.trim();

  // Se till att #-tecknet alltid finns med
  if (!hexValue.startsWith("#")) {
    hexValue = "#" + hexValue;
  }

  if (isValidHex(hexValue)) {
    const hsl = hexToHsl(expandHex(hexValue));
    if (inputElement.id === "text-value") {
      textParams.hue.value = hsl.h;
      textParams.saturation.value = hsl.s / 100;
      textParams.lightness.value = hsl.l / 100;
    } else if (inputElement.id === "background-value") {
      bgParams.hue.value = hsl.h;
      bgParams.saturation.value = hsl.s / 100;
      bgParams.lightness.value = hsl.l / 100;
    }
    debounceUpdateColorsAndContrast();
  }

  inputElement.value = hexValue;
}

export function handleSliderChange(
  event,
  textParams,
  bgParams,
  debounceUpdateColorsAndContrast
) {
  const h = event.target.value;
  const s = event.target.id.includes("saturation")
    ? event.target.value * 100
    : event.target.value;
  const l = event.target.id.includes("lightness")
    ? event.target.value * 100
    : event.target.value;

  const hexColor = hslToHex(h, s, l);

  if (event.target.id.includes("text")) {
    textParams.hexInput.value = hexColor;
  } else if (event.target.id.includes("background")) {
    bgParams.hexInput.value = hexColor;
  }
  debounceUpdateColorsAndContrast();
}
