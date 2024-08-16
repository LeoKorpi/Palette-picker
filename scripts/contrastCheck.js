import { hslToHex } from "./colorConversion.js";

// Förbestämda strängar för vad som ska stå baserat på kontrasternas resultat
const contrastResults = {
  Fail: [
    "You should adjust the colors to improve readability and accessibility",
  ],
  WCAGAA: [
    "It's acceptable for large text, but does not meet the guideliness for normal text",
  ],
  WCAGLargeText: ["It ensures good readability for most users"],
  WCAGAAA: [
    "It meets the highest standard, ensuring maximum readability for all users.",
  ],
};

// returnerar ett json-objekt med data gällande parameter-färgernas kontrast
export async function fetchContrastRatio(textColor, bgColor) {
  const response = await fetch(
    `https://webaim.org/resources/contrastchecker/?fcolor=${textColor}&bcolor=${bgColor}&api`
  );
  const data = await response.json();
  return data;
}

// returnerar specifikt kontrast-förhållandet mellan de två färgerna
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

// returnerar en kommentar på kontrasten baserat på vilka krav den uppnår
export function displayContrastHeading(contrastRatio) {
  var category = "";
  var results = displayContrastCheck(contrastRatio);
  //Regex-uttryck för att ta bort alla mellanslag
  category = results.replace(/\s/g, "");

  const response = contrastResults[category];
  return response;
}

// returnerar det högsta kravet kontrasterna uppfyller
export function displayContrastCheck(contrastRatio) {
  if (contrastRatio < 3) return "Fail";
  if (contrastRatio >= 3 && contrastRatio < 4.5) return "WCAG AA";
  if (contrastRatio >= 4.5 && contrastRatio < 7) return "WCAG Large Text";
  if (contrastRatio >= 7) return "WCAG AAA";
}
