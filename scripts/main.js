import {
  handleHexInput,
  handleSliderChange,
  handleSliderEnd,
  getOriginalHexValues,
} from "./eventHandlers.js";
import {
  updateBackgroundColor,
  updateTextColor,
  adjustTextColor,
  getYear,
  getTodaysDate,
} from "./uiUpdates.js";
import { debounce } from "./utils.js";
import { generateRandomColors, switchColors } from "./colorSettings.js";
import {
  getContrastResult,
  displayContrastHeading,
  displayContrastCheck,
} from "./contrastCheck.js";

const textParams = {
  hexInput: document.querySelector("#text-value"),
  hue: document.querySelector("#text-hue"),
  hueValue: document.querySelector("#text-hue-value"),
  saturation: document.querySelector("#text-saturation"),
  saturationValue: document.querySelector("#text-saturation-value"),
  lightness: document.querySelector("#text-lightness"),
  lightnessValue: document.querySelector("#text-lightness-value"),
};

const bgParams = {
  hexInput: document.querySelector("#background-value"),
  hue: document.querySelector("#background-hue"),
  hueValue: document.querySelector("#background-hue-value"),
  saturation: document.querySelector("#background-saturation"),
  saturationValue: document.querySelector("#background-saturation-value"),
  lightness: document.querySelector("#background-lightness"),
  lightnessValue: document.querySelector("#background-lightness-value"),
};

const content = document.querySelector("body");
const textElements = content.querySelectorAll(".text");
const smallTextElements = content.querySelectorAll(".small-text");
let contrastRatio;

function updateColors() {
  const originalHexValues = getOriginalHexValues();
  updateTextColor(textParams, bgParams.hexInput, originalHexValues.text);
  updateBackgroundColor(bgParams, originalHexValues.background);
}

const debounceUpdateContrast = debounce(async () => {
  contrastRatio = await getContrastResult(textParams, bgParams);
  const contrastResult = displayContrastCheck(contrastRatio);
  const contrastHeading = displayContrastHeading(contrastRatio);

  updateColors();

  if (contrastResult === "WCAG AA") {
    adjustTextColor(contrastRatio, smallTextElements, bgParams);
  }

  if (contrastResult === "Fail") {
    adjustTextColor(contrastRatio, textElements, bgParams);
  }

  document.querySelector("#contrast-heading").textContent = contrastHeading;
  document.querySelector("#contrast-ratio").textContent = contrastRatio;
  document.querySelector("#contrast-check").textContent = contrastResult;
}, 5); // antalet millisekunder innan metoden kan kallas på igen

textParams.hexInput.addEventListener("keypress", (event) =>
  handleHexInput(event, textParams, bgParams, debounceUpdateContrast)
);
bgParams.hexInput.addEventListener("keypress", (event) =>
  handleHexInput(event, textParams, bgParams, debounceUpdateContrast)
);

const handleSliderEvent = () => {
  handleSliderChange(textParams, bgParams, debounceUpdateContrast);
};

const handleSliderEndEvent = () => {
  handleSliderEnd(textParams, bgParams, debounceUpdateContrast);
};

// Input-events avfyras inte när elements värden ändras genom js
textParams.hue.addEventListener("input", handleSliderEvent);
textParams.saturation.addEventListener("input", handleSliderEvent);
textParams.lightness.addEventListener("input", handleSliderEvent);
bgParams.hue.addEventListener("input", handleSliderEvent);
bgParams.saturation.addEventListener("input", handleSliderEvent);
bgParams.lightness.addEventListener("input", handleSliderEvent);

textParams.hue.addEventListener("change", handleSliderEndEvent);
textParams.saturation.addEventListener("change", handleSliderEndEvent);
textParams.lightness.addEventListener("change", handleSliderEndEvent);
bgParams.hue.addEventListener("change", handleSliderEndEvent);
bgParams.saturation.addEventListener("change", handleSliderEndEvent);
bgParams.lightness.addEventListener("change", handleSliderEndEvent);

function attachRadioListeners() {
  const radios = document.querySelectorAll('input[type="radio"]');
  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      debounceUpdateContrast();
    });
  });
}

function start() {
  const rndButton = document.querySelector("#button-random");
  rndButton.addEventListener("click", () => {
    generateRandomColors(textParams, bgParams, debounceUpdateContrast);
  });

  const revButton = document.querySelector("#button-reverse");
  revButton.addEventListener("click", () => {
    switchColors(textParams, bgParams, debounceUpdateContrast);
  });

  const currentYear = document.querySelector("#current-year");
  currentYear.textContent = getYear();

  const todaysDate = document.querySelector("#today-date");
  todaysDate.textContent = getTodaysDate();

  generateRandomColors(textParams, bgParams, debounceUpdateContrast);
  debounceUpdateContrast();
  attachRadioListeners();
}

document.addEventListener("DOMContentLoaded", () => {
  start();
});
