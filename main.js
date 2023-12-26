let text = "YENIIL";

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  text = urlParams.get("text") || text;

  document.body.style.margin = "0";
  document.body.style.padding = "0";

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  canvas.style.backgroundColor = "#000066";
  canvas.style.display = "block";

  let colors = [
    "hsl(101, 69%, 88%)",
    "hsl(236, 64%, 78%)",
    "hsl(338, 68%, 84%)",
    "hsl(186, 100%, 50%)",
    "hsl(0, 100%, 50%)",
    "hsl(113, 100%, 50%)",
    "hsl(63, 50%, 50%)",
    "hsl(215, 67%, 75%)",
    "hsl(291, 50%, 75%)",
    "hsl(304, 51%, 78%)",
  ];

  let lineHeight = 0;
  let letterWidth = 0;
  let lastColorChangeTime = 0;

  function animateCanvas(timestamp) {
    if (!lastColorChangeTime) lastColorChangeTime = timestamp;

    const elapsedTime = timestamp - lastColorChangeTime;

    if (elapsedTime > 100) {
      // reorder colors clockwise
      colors = colors.slice(-1).concat(colors.slice(0, -1));
      lastColorChangeTime = timestamp;
    }

    fillCanvasWithText(canvas.width, canvas.height);

    requestAnimationFrame(animateCanvas);
  }

  // Update canvas onload and on resize only
  function updateCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const { fontSize, fontFamily } = window.getComputedStyle(
      document.documentElement
    );

    ctx.font = fontSize + " " + fontFamily;
    lineHeight = parseInt(fontSize) * 1.2;
    letterWidth = ctx.measureText("A").width
  }

  // Animation loop
  function fillCanvasWithText() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const next = wordIterator(text);

    let x = 0;
    let y = lineHeight;

    while (y < canvas.height) {
      let letter = next();
      let currentLine = Math.round(y / lineHeight);

      // Triangle coordinates
      let triangleHeight = Math.min(canvas.width / lineHeight / 1.2, 40);
      let triangleStart = 5;
      let triangleEnd = triangleStart + triangleHeight;

      const isHeightMatch =
        currentLine >= triangleStart && currentLine <= triangleEnd;

      const isWidthMatch =
        x + letterWidth * (currentLine - triangleStart) > canvas.width / 2 &&
        x - letterWidth * (currentLine - triangleStart) < canvas.width / 2;

      ctx.fillStyle =
        isHeightMatch && isWidthMatch
          ? colors[currentLine % colors.length]
          : "rgb(90, 90, 90)";

      ctx.fillText(letter, x, y);

      x += letterWidth;

      // go to next line, if there is not enought space
      if (x + letterWidth > canvas.width) {
        // color = colors[Math.floor(Math.random() * colors.length)];
        x = 0;
        y += lineHeight;
      }
    }
  }

  updateCanvas();
  animateCanvas();
  window.onresize = updateCanvas;
});

function wordIterator(word) {
  let i = 0;
  return () => {
    if (i >= word.length) i = 0;
    return word[i++];
  }
}
