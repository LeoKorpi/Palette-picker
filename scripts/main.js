import {
  handleHexInput,
  handleSliderChange,
  handleSliderEnd,
  getOriginalHexValues,
} from "./eventHandlers.js";
import {
  updateBackgroundColor,
  updateTextColor,
  updateButtonStyles,
  updateSlideThumbsColor,
  adjustTextColor,
  updateContrastCheckTextColor,
} from "./uiUpdates.js";
import { debounce } from "./utils.js";
import { generateRandomColors, switchColors } from "./colorSettings.js";
import { getContrastResult, displayContrastCheck } from "./contrastCheck.js";

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

const colorsSection = document.querySelector(".colors");
const textElements = colorsSection.querySelectorAll(".text");

function updateColors() {
  const originalHexValues = getOriginalHexValues();
  updateTextColor(textParams, bgParams.hexInput, originalHexValues.text);
  updateBackgroundColor(bgParams, originalHexValues.background);
}

const debounceUpdateContrast = debounce(async () => {
  const contrastRatio = await getContrastResult(textParams, bgParams);
  const contrastResult = displayContrastCheck(contrastRatio);

  updateColors();

  if (contrastResult === "Fail") {
    adjustTextColor(
      colorsSection,
      bgParams.lightness.value,
      textElements,
      updateButtonStyles,
      updateSlideThumbsColor,
      updateContrastCheckTextColor
    );
  }

  document.querySelector("#contrast-ratio").textContent = contrastRatio;
  document.querySelector("#contrast-check").textContent = contrastResult;
}, 12); // antalet millisekunder innan metoden kan kallas på igen

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

const rndButton = document.querySelector("#button-random");
rndButton.addEventListener("click", () => {
  generateRandomColors(textParams, bgParams, debounceUpdateContrast);
});

const revButton = document.querySelector("#button-reverse");
revButton.addEventListener("click", () => {
  switchColors(textParams, bgParams, debounceUpdateContrast);
});

function start() {
  generateRandomColors(textParams, bgParams, debounceUpdateContrast);
  debounceUpdateContrast();
}

document.addEventListener("DOMContentLoaded", () => {
  start();
});
