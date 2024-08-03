import { hslToHex } from "./colorConversion.js";

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

export function displayContrastCheck(contrastRatio) {
  if (contrastRatio < 3) return "Fail";
  if (contrastRatio >= 3 && contrastRatio < 4.5) return "AA";
  if (contrastRatio >= 4.5 && contrastRatio < 7) return "Large Text";
  if (contrastRatio >= 7) return "AAA";
}
