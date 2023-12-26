let text = "YENIIL";

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  text = urlParams.get("text") || text;

  document.body.style.margin = "0";
  document.body.style.padding = "0";

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  canvas.style.backgroundColor = "rgb(0 0 73)";
  canvas.style.display = "block";

  let canvasWidth = canvas.width;
  let canvasHeight = canvas.height;

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

  // Triangle coordinates
  let triangleHeight = Math.min(canvasWidth / lineHeight / 1.2, 40); // 40 is max triangle height, and changes based on screen size
  let triangleStart = 5;
  let triangleEnd = triangleStart + triangleHeight;

  function animateCanvas(timestamp) {
    if (!lastColorChangeTime) lastColorChangeTime = timestamp;

    const elapsedTime = timestamp - lastColorChangeTime;

    if (elapsedTime > 100) {
      // reorder colors clockwise
      colors = colors.slice(-1).concat(colors.slice(0, -1));
      lastColorChangeTime = timestamp;
    }

    fillCanvasWithText();

    requestAnimationFrame(animateCanvas);
  }

  // Update canvas onload and on resize only
  function updateCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Scale canvas for high DPI devices
    setupHighDPI(canvas);

    const { fontSize, fontFamily } = window.getComputedStyle(
      document.documentElement
    );

    ctx.font = "bold " + fontSize + " " + fontFamily;

    lineHeight = parseInt(fontSize) * 1.2;
    letterWidth = ctx.measureText("A").width; // assuming monospace font, all letters have the same width
    canvasWidth = parseInt(canvas.style.width); // using style.width instead of width, because of high DPI scaling
    canvasHeight = parseInt(canvas.style.height); // using style.height instead of height, because of high DPI scaling

    // Triangle coordinates
    triangleHeight = Math.min(canvasWidth / lineHeight / 1.2, 40); // 40 is max triangle height, and changes based on screen size
    triangleStart = 5;
    triangleEnd = triangleStart + triangleHeight;
  }

  // Animation loop
  function fillCanvasWithText() {
    ctx.clearRect(0, 0, canvasWidth, parseInt(canvasHeight));

    const next = wordIterator(text);

    let x = 0;
    let y = lineHeight;

    while (y < parseInt(canvasHeight)) {
      let letter = next();
      let currentLine = Math.round(y / lineHeight);

      const isHeightMatch =
        currentLine >= triangleStart && currentLine <= triangleEnd;

      const doesMatchTriangle =
        isHeightMatch &&
        x + letterWidth * (currentLine - triangleStart) > canvasWidth / 2 &&
        x - letterWidth * (currentLine - triangleStart) < canvasWidth / 2;

      ctx.fillStyle = doesMatchTriangle
        ? colors[currentLine % colors.length]
        : "rgb(60, 60, 60)";

      ctx.fillText(letter, x, y);

      x += letterWidth;
      // go to next line, if there is not enought space
      if (x + letterWidth > canvasWidth) {
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
  };
}

// https://stackoverflow.com/a/15666143/10629172
function setupHighDPI(canvas) {
  let ctx = canvas.getContext("2d");
  let dpr = window.devicePixelRatio || 1;
  let bsr =
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1;

  let ratio = dpr / bsr;
  console.log(ratio);
  let oldWidth = canvas.width;
  let oldHeight = canvas.height;

  canvas.width = oldWidth * ratio;
  canvas.height = oldHeight * ratio;

  canvas.style.width = oldWidth + "px";
  canvas.style.height = oldHeight + "px";

  ctx.scale(ratio, ratio);
}
