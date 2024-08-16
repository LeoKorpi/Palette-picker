import { hslToHex } from "./colorConversion.js";

/**
 * Uppdaterar bakgrundsfärgen genom att hämta värdena på alla sliders
 * för bakgrundsfärg, konvertera de till hex och ändra bakgrundens
 * styling till den färgen
 */
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

/**
 * Uppdaterar textfärgen genom att hämta värdena på alla sliders
 * för textfärg, konvertera de till hex och ändra alla element med html-klassen
 * "text" styling till den färgen.
 * Artiklen med klassen "contrast-example" färgas också om för att
 * dess kant ska få samma färg som texten
 */
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

  updateRadioColor(hexColor, bgHexInput.value);
  updateButtonColor(hexInput.value, bgHexInput.value);
  updateSlideThumbsColor(hexColor);
}

/**
 * Om kontrast-förhållandet är för lågt färgar funktion om text-element till
 * antingen svart eller vit, beroende på hur ljus bakgrunden är
 */
export function adjustTextColor(contrastRatio, textElements, bgParams) {
  const bgHexColor = hslToHex(
    bgParams.hue.value,
    bgParams.saturation.value * 100,
    bgParams.lightness.value * 100
  );

  const backgroundLightness = bgParams.lightness.value * 100;

  let textColor = compareTextToBackground(backgroundLightness, contrastRatio);

  textElements.forEach((element) => {
    const forContrastExample = element.closest(".contrast-example") !== null;
    let textColor = compareTextToBackground(
      backgroundLightness,
      contrastRatio,
      forContrastExample
    );
    if (textColor) {
      element.style.color = textColor;
    }
  });

  const article = document.querySelector(".contrast-example");
  if (article) {
    article.style.borderColor = textColor;
  }

  updateRadioColor(textColor, bgHexColor);
  updateButtonColor(textColor, bgHexColor);
  updateSlideThumbsColor(textColor);
}

/**
 * Kontrollerar bakgrundens ljus-värde och kontrastförhållandet
 * för att veta om texten ska färgas om till vitt eller svart
 */
function compareTextToBackground(
  backgroundLightness,
  contrastRatio,
  forContrastExample = false
) {
  if (forContrastExample) return null;
  if (backgroundLightness > 50) return "#000";
  if (backgroundLightness < 35 || contrastRatio < 4.5) return "#fff";
  return "#000";
}

// Ändrar färgen på radio-knapparna
function updateRadioColor(textColor, backgroundColor) {
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

// Ändrar färgen på random & reverse-knapparna
function updateButtonColor(textColor, bgColor) {
  const buttons = document.querySelectorAll(".button.text");
  buttons.forEach((button) => {
    button.style.color = bgColor;
    button.style.backgroundColor = textColor;
  });
}

// Ändrar färgen på cirklarna i alla sliders
function updateSlideThumbsColor(thumbColor) {
  const sliders = document.querySelectorAll(".slider");
  sliders.forEach((slider) => {
    slider.style.setProperty("--thumb-color", thumbColor);
  });
}

// Ändrar färgen på alla sliders
function updateSliderColor(lightness) {
  const sliderBorderColor =
    lightness >= 0.35 ? "hsla(0, 0%, 0%, 0.4)" : "hsla(0, 0%, 100%, 0.4)";
  const sliders = document.querySelectorAll(".slider");
  sliders.forEach((slider) => {
    slider.style.setProperty("--slider-border-color", sliderBorderColor);
  });
}

// Returnerar vilket år det är
export function getYear() {
  const year = new Date().getFullYear();
  return year;
}

// Returnerar dagens datum
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

// Om dagens datum (skrivet i siffror) inte är tvåsiffrigt läggs en nolla till
function adjustDate(day) {
  return day.toString().padStart(2, "0");
}
