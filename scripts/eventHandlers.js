import {
  hexToHsl,
  expandHex,
  isValidHex,
  hslToHex,
} from "./colorConversion.js";
import { changeOriginalHexValues } from "./colorSettings.js";

let previousHexValues = {
  text: "#000000",
  background: "#ffffff",
};

let originalHexValues = {
  text: "#000000",
  background: "#ffffff",
};

export function handleHexInput(
  event,
  textParams,
  bgParams,
  debounceUpdateContrast
) {
  const inputElement = event.target;
  let hexValue = inputElement.value.trim();

  if (event.key === "Enter") {
    let processedHex = hexValue;

    // Se till att #-tecknet alltid finns med
    if (!processedHex.startsWith("#")) {
      processedHex = "#" + processedHex;
    }

    if (processedHex.length === 4) {
      processedHex = expandHex(processedHex);
    }

    if (isValidHex(processedHex)) {
      const hsl = hexToHsl(processedHex);
      if (inputElement.id === "text-value") {
        textParams.hue.value = hsl.h;
        textParams.saturation.value = hsl.s / 100;
        textParams.lightness.value = hsl.l / 100;
        previousHexValues.text = processedHex;
        originalHexValues.text = processedHex;
      } else if (inputElement.id === "background-value") {
        bgParams.hue.value = hsl.h;
        bgParams.saturation.value = hsl.s / 100;
        bgParams.lightness.value = hsl.l / 100;
        previousHexValues.background = processedHex;
        originalHexValues.background = processedHex;
      }
      updateSliders(textParams, bgParams);
      debounceUpdateContrast();
    } else {
      inputElement.value =
        inputElement.id === "text-value"
          ? previousHexValues.text
          : previousHexValues.background;
    }
  }
}

function updateSliders(textParams, bgParams) {
  document.querySelector("#text-hue").value = textParams.hue.value;
  document.querySelector("#text-saturation").value =
    textParams.saturation.value;
  document.querySelector("#text-lightness").value = textParams.lightness.value;
  document.querySelector("#background-hue").value = bgParams.hue.value;
  document.querySelector("#background-saturation").value =
    bgParams.saturation.value;
  document.querySelector("#background-lightness").value =
    bgParams.lightness.value;
}

export function getOriginalHexValues() {
  return originalHexValues;
}

export function setOriginalHexValues(newValues) {
  originalHexValues = newValues;
}

export function handleSliderChange(
  textParams,
  bgParams,
  debounceUpdateContrast
) {
  updateSliders(textParams, bgParams);
  debounceUpdateContrast();
}

export function handleSliderEnd(textParams, bgParams, debounceUpdateContrast) {
  changeOriginalHexValues(textParams, bgParams);
  handleSliderChange(textParams, bgParams, debounceUpdateContrast);
}

export function checkSelectedRadio() {
  const radioGroup = document.querySelector(".radio-group");
  const radios = radioGroup.querySelectorAll('input[type="radio"]');

  let selectedValue = null;
  radios.forEach((radio) => {
    if (radio.checked) {
      selectedValue = radio.value;
    }
  });
  return selectedValue;
}
