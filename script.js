document.addEventListener("DOMContentLoaded", function () {
  let firstColor;
  let secondColor;

  function loadColor() {
    firstColor = Math.floor(Math.random() * 360);
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

  document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      loadColor();
    }
  });
});
