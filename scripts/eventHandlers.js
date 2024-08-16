import { hexToHsl, expandHex, isValidHex } from "./colorConversion.js";
import { changeOriginalHexValues } from "./colorSettings.js";

/**
 * Om hex-värdet användaren skrev in inte godkänns
 * faller inputfältet tillbaka på dessa gamla värden
 */
let previousHexValues = {
  text: "#000000",
  background: "#ffffff",
};

// De faktiska värdena på färgerna sparas här
let originalHexValues = {
  text: "#000000",
  background: "#ffffff",
};

/**
 * Funktionen hanterar hex-inputs genom flera processer
 *  - se till att de börjar med #
 *  - förlänger de till 7st tecken om det endast är 4st
 *  - validerar de genom regex
 *  Efter att dessa steg godkänts ändras hsl-värdena och färgerna på webbsidan
 */
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

// Uppdaterar HSL-värdena för alla sliders
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

// Getter för Hex-värdena
export function getOriginalHexValues() {
  return originalHexValues;
}

// Setter för Hex-värdena
export function setOriginalHexValues(newValues) {
  originalHexValues = newValues;
}

// Uppdaterar alla sliders på "input"
export function handleSliderChange(
  textParams,
  bgParams,
  debounceUpdateContrast
) {
  updateSliders(textParams, bgParams);
  debounceUpdateContrast();
}

// Uppdatera alla sliders på "change"
export function handleSliderEnd(textParams, bgParams, debounceUpdateContrast) {
  changeOriginalHexValues(textParams, bgParams);
  handleSliderChange(textParams, bgParams, debounceUpdateContrast);
}

// Går igenom alla radio-knappar för att hitta den som är checked och hämtar dess värde
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
