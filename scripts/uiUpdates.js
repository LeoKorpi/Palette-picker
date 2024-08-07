import { hslToHex } from "./colorConversion.js";

export function updateBackgroundColor(bgParams, originalHex) {
  const {
    hue,
    saturation,
    lightness,
    hexInput,
    hueValue,
    saturationValue,
    lightnessValue,
  } = bgParams;

  const h = hue.value;
  const s = saturation.value * 100;
  const l = lightness.value * 100;
  const hexColor = hslToHex(h, s, l);

  if (hueValue) hueValue.textContent = hue.value;
  if (saturationValue) saturationValue.textContent = saturation.value;
  if (lightnessValue) lightnessValue.textContent = lightness.value;

  const backgroundColorDisplay = document.querySelector(".background");
  backgroundColorDisplay.style.backgroundColor = hexColor;
  hexInput.value = originalHex;

  updateSliderColor(lightness.value);
}

export function updateTextColor(textParams, bgHexInput, originalHex) {
  const {
    hue,
    saturation,
    lightness,
    hexInput,
    hueValue,
    saturationValue,
    lightnessValue,
  } = textParams;

  const h = hue.value;
  const s = saturation.value * 100;
  const l = lightness.value * 100;
  const hexColor = hslToHex(h, s, l);

  if (hueValue) hueValue.textContent = hue.value;
  if (saturationValue) saturationValue.textContent = saturation.value;
  if (lightnessValue) lightnessValue.textContent = lightness.value;

  const textColorDisplay = document.querySelectorAll(".text");
  textColorDisplay.forEach((element) => {
    element.style.color = hexColor;
  });
  hexInput.value = originalHex;

  const article = document.querySelector(".contrast-example");
  if (article) {
    article.style.borderColor = hexColor;
  }

  updateRadioStyles(hexColor, bgHexInput.value);
  updateButtonStyles(hexInput.value, bgHexInput.value);
  updateSlideThumbsColor(hexColor);
}

export function adjustTextColor(contrastRatio, textElements, bgParams) {
  const bgHexColor = hslToHex(
    bgParams.hue.value,
    bgParams.saturation.value * 100,
    bgParams.lightness.value * 100
  );

  const backgroundLightness = bgParams.lightness.value * 100;

  let textColor = compareTextToBackground(backgroundLightness, contrastRatio);

  textElements.forEach((element) => {
    if (element) {
      element.style.color = textColor;
    }
  });

  const article = document.querySelector(".contrast-example");
  if (article) {
    article.style.borderColor = textColor;
  }

  updateRadioStyles(textColor, bgHexColor);
  updateButtonStyles(textColor, bgHexColor);
  updateSlideThumbsColor(textColor);
  updateContrastCheckTextColor(bgHexColor);
}

function compareTextToBackground(backgroundLightness, contrastRatio) {
  if (backgroundLightness > 50) return "#000";
  if (backgroundLightness < 35 || contrastRatio < 4.5) return "#fff";
  return "#000";
}

function updateRadioStyles(textColor, backgroundColor) {
  console.log(`TextHex: ${textColor} bgHex: ${backgroundColor}`);

  /**
   * Just nu kallas funktionen på från flera ställen vilket ställer till det
   * jag vill kalla på funktionen för att uppdatera färgen på knapparna
   * kan man kanske bryta ut funktionen? den borde bara kallas på inuti uiUpdates
   *
   * kanske vore bra att göra som alla sliders, eventListenern bara lyssnar efter input
   * sen kallar de på en ny funktion som i sin tur tittar efter adjust/updateTextColor
   * eftersom att de funktionerna redan ändrar om färger på text-element när det behövs
   */

  const radios = document.querySelectorAll('input[type="radio"]');
  radios.forEach((radio) => {
    const label = radio.nextElementSibling;
    if (radio.checked) {
      label.style.backgroundColor = textColor;
      label.style.color = backgroundColor;
    } else {
      label.style.backgroundColor = "transparent";
      label.style.color = textColor;
    }
    label.style.borderColor = textColor;
  });
}

function updateButtonStyles(textColor, bgColor) {
  const buttons = document.querySelectorAll(".button.text");
  buttons.forEach((button) => {
    button.style.color = bgColor;
    button.style.backgroundColor = textColor;
  });
}

function updateSlideThumbsColor(thumbColor) {
  const sliders = document.querySelectorAll(".slider");
  sliders.forEach((slider) => {
    slider.style.setProperty("--thumb-color", thumbColor);
  });
}

function updateSliderColor(lightness) {
  const sliderBorderColor =
    lightness >= 0.35 ? "hsla(0, 0%, 0%, 0.4)" : "hsla(0, 0%, 100%, 0.4)";
  const sliders = document.querySelectorAll(".slider");
  sliders.forEach((slider) => {
    slider.style.setProperty("--slider-border-color", sliderBorderColor);
  });
}

function updateContrastCheckTextColor(bgColor) {
  const contrastCheckDisplay = document.querySelector("#contrast-check");
  const textColor = bgColor <= 0.35 ? "#fff" : "#000";
  contrastCheckDisplay.style.color = textColor;
}

export function getYear() {
  const year = new Date().getFullYear();
  return year;
}

export function getTodaysDate() {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const today = new Date();
  const day = adjustDate(today.getDate());
  const monthIndex = today.getMonth();
  const year = getYear();
  const todaysDate = `${day} ${monthNames[monthIndex]} ${year}`;
  return todaysDate;
}

function adjustDate(day) {
  return day.toString().padStart(2, "0");
}
