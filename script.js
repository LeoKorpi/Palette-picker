document.addEventListener("DOMContentLoaded", function () {
  let firstColor = Math.floor(Math.random() * 360);
  let secondColor;

  function loadColor() {
    setSecondColor();
    document.getElementById(
      "first-color"
    ).style.backgroundColor = `hsla(${firstColor}, 100%, 50%, 1)`;
    document.getElementById(
      "second-color"
    ).style.backgroundColor = `hsla(${secondColor}, 100%, 50%, 1)`;
  }

  function setSecondColor() {
    secondColor = firstColor + 180;
    if (secondColor >= 360) {
      secondColor -= 360;
    }
  }

  loadColor();
});
