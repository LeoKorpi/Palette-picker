import { handleHexInput, handleSliderChange } from "./eventHandlers.js";
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

let previousColors = {
  text: "#000000",
  background: "#ffffff",
  contrastResult: null,
};

const debounceUpdateColorsAndContrast = debounce(async () => {
  updateBackgroundColor(
    bgParams.hue,
    bgParams.saturation,
    bgParams.lightness,
    bgParams.hexInput,
    bgParams.hueValue,
    bgParams.saturationValue,
    bgParams.lightnessValue
  );

  const contrastRatio = await getContrastResult(
    textParams.hue.value,
    textParams.saturation.value,
    textParams.lightness.value,
    bgParams.hue.value,
    bgParams.saturation.value,
    bgParams.lightness.value
  );
  const contrastResult = displayContrastCheck(contrastRatio);

  if (contrastResult !== previousColors.contrastResult) {
    if (contrastResult === "Fail") {
      adjustTextColor(
        colorsSection,
        bgParams.lightness.value,
        textElements,
        updateButtonStyles,
        updateSlideThumbsColor,
        updateContrastCheckTextColor
      );
    } else {
      updateTextColor(
        textParams.hue,
        textParams.saturation,
        textParams.lightness,
        textParams.hexInput,
        textParams.hueValue,
        textParams.saturationValue,
        textParams.lightnessValue,
        bgParams.hexInput
      );
    }
    previousColors.contrastResult = contrastResult;
  }

  document.querySelector("#contrast-ratio").textContent = contrastRatio;
  document.querySelector("#contrast-check").textContent = contrastResult;
}, 12); // antalet millisekunder innan metoden kan kallas på igen

textParams.hexInput.addEventListener("input", (event) =>
  handleHexInput(
    event,
    textParams.hue,
    textParams.saturation,
    textParams.lightness,
    bgParams.hue,
    bgParams.saturation,
    bgParams.lightness,
    debounceUpdateColorsAndContrast
  )
);
bgParams.hexInput.addEventListener("input", (event) =>
  handleHexInput(
    event,
    textParams.hue,
    textParams.saturation,
    textParams.lightness,
    bgParams.hue,
    bgParams.saturation,
    bgParams.lightness,
    debounceUpdateColorsAndContrast
  )
);

const handleSliderEvent = (event) => {
  handleSliderChange(
    event,
    textParams,
    bgParams,
    debounceUpdateColorsAndContrast
  );
};

textParams.hue.addEventListener("input", handleSliderEvent);
textParams.saturation.addEventListener("input", handleSliderEvent);
textParams.lightness.addEventListener("input", handleSliderEvent);
bgParams.hue.addEventListener("input", handleSliderEvent);
bgParams.saturation.addEventListener("input", handleSliderEvent);
bgParams.lightness.addEventListener("input", handleSliderEvent);

textParams.hue.addEventListener("input", () => {
  textParams.hueValue.textContent = textParams.hue.value;
  debounceUpdateColorsAndContrast();
});

textParams.saturation.addEventListener("input", () => {
  textParams.saturationValue.textContent = textParams.saturation.value;
  debounceUpdateColorsAndContrast();
});

textParams.lightness.addEventListener("input", () => {
  textParams.lightnessValue.textContent = textParams.lightness.value;
  debounceUpdateColorsAndContrast();
});

bgParams.hue.addEventListener("input", () => {
  bgParams.hueValue.textContent = bgParams.hue.value;
  debounceUpdateColorsAndContrast();
});

bgParams.saturation.addEventListener("input", () => {
  bgParams.saturationValue.textContent = bgParams.saturation.value;
  debounceUpdateColorsAndContrast();
});

bgParams.lightness.addEventListener("input", () => {
  bgParams.lightnessValue.textContent = bgParams.lightness.value;
  debounceUpdateColorsAndContrast();
});

const rndButton = document.querySelector("#button-random");
rndButton.addEventListener("click", () => {
  generateRandomColors(
    textParams.hue,
    textParams.saturation,
    textParams.lightness,
    bgParams.hue,
    bgParams.saturation,
    bgParams.lightness,
    debounceUpdateColorsAndContrast
  );
});

const revButton = document.querySelector("#button-reverse");
revButton.addEventListener("click", () => {
  switchColors(
    textParams.hue,
    textParams.saturation,
    textParams.lightness,
    bgParams.hue,
    bgParams.saturation,
    bgParams.lightness,
    debounceUpdateColorsAndContrast
  );
});

function getBgHex() {
  return bgParams.hexInput.value;
}

function getTextHex() {
  return textParams.hexInput.value;
}

function start() {
  generateRandomColors(
    textParams.hue,
    textParams.saturation,
    textParams.lightness,
    bgParams.hue,
    bgParams.saturation,
    bgParams.lightness,
    debounceUpdateColorsAndContrast
  );
  previousColors = {
    text: getTextHex(),
    background: getBgHex(),
    contrastResult: null,
  };
  debounceUpdateColorsAndContrast();
}

document.addEventListener("DOMContentLoaded", () => {
  start();
});
