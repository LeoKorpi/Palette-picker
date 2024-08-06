import { hslToHex } from "./colorConversion.js";

const contrastResults = {
  Fail: [
    "You should adjust the colors to improve readability and accessibility",
  ],
  WCAGAA: [
    "It's acceptable for large text, but does not meet the guideliness for normal text",
  ],
  LargeText: ["It ensures good readability for most users"],
  WCAGAAA: [
    "It meets the highest standard, ensuring maximum readability for all users.",
  ],
};

export async function fetchContrastRatio(textColor, bgColor) {
  const response = await fetch(
    `https://webaim.org/resources/contrastchecker/?fcolor=${textColor}&bcolor=${bgColor}&api`
  );
  const data = await response.json();
  return data;
}

export async function getContrastResult(textParams, bgParams) {
  const textHexColor = hslToHex(
    textParams.hue.value,
    textParams.saturation.value * 100,
    textParams.lightness.value * 100
  ).substring(1); //Substring för att ta bort '#'
  const bgHexColor = hslToHex(
    bgParams.hue.value,
    bgParams.saturation.value * 100,
    bgParams.lightness.value * 100
  ).substring(1);

  const data = await fetchContrastRatio(textHexColor, bgHexColor);
  return data.ratio;
}

export function displayContrastHeading(contrastRatio) {
  let category;
  if (contrastRatio < 3) category = "Fail";
  if (contrastRatio >= 3 && contrastRatio < 4.5) category = "WCAGAA";
  if (contrastRatio >= 4.5 && contrastRatio < 7) category = "LargeText";
  if (contrastRatio >= 7) category = "WCAGAAA";

  const responses = contrastResults[category];
  const randomIndex = Math.floor(Math.random() * responses.length);

  return responses[randomIndex];
}

export function displayContrastCheck(contrastRatio) {
  if (contrastRatio < 3) return "Fail";
  if (contrastRatio >= 3 && contrastRatio < 4.5) return "WCAG AA";
  if (contrastRatio >= 4.5 && contrastRatio < 7) return "WCAG Large Text";
  if (contrastRatio >= 7) return "WCAG AAA";
}
