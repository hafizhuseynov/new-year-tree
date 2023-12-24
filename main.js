let text = "HAPPYNEWYEAR";

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  text = urlParams.get("text") || text;

  document.body.style.margin = "0";
  document.body.style.padding = "0";

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
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

  const { fontSize, fontFamily } = window.getComputedStyle(
    document.documentElement
  );

  let lastColorChangeTime = 0;

  function animate(timestamp) {
    if (!lastColorChangeTime) lastColorChangeTime = timestamp;

    const elapsedTime = timestamp - lastColorChangeTime;

    if (elapsedTime > 300) {
      // reorder colors clockwise
      colors = colors.slice(-1).concat(colors.slice(0, -1));
      lastColorChangeTime = timestamp;
    }

    fillCanvasWithText(
      ctx,
      canvas.width,
      canvas.height,
      text,
      colors,
      fontSize,
      fontFamily
    );

    requestAnimationFrame(animate);
  }

  window.onresize = handleResize;
  animate();
});

function handleResize() {
  const canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function fillCanvasWithText(
  ctx,
  width,
  height,
  text,
  colors,
  fontSize,
  fontFamily
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const next = wordIterator(text);
  const fontSizeParsed = parseInt(fontSize);

  ctx.font = fontSizeParsed + "px" + " " + fontFamily;

  let x = 0;
  let y = fontSizeParsed;
  const lineHeight = fontSizeParsed * 1.2;

  while (y < height) {
    let letter = next();
    let currentLine = Math.round(y / lineHeight);

    // Triangle coordinates
    let triangleHeight = Math.min(width / lineHeight / 1.2, 40);
    let triangleStart = 5;
    let triangleEnd = triangleStart + triangleHeight;

    const isHeightMatch =
      currentLine >= triangleStart && currentLine <= triangleEnd;

    // to left and to right from center
    const widthOffset = ((currentLine - triangleStart) * lineHeight) / 2;

    const isWidthMatch =
      x >= width / 2 - widthOffset && x <= width / 2 + widthOffset;

    ctx.fillStyle =
      isHeightMatch && isWidthMatch
        ? colors[currentLine % colors.length]
        : "rgb(130, 100, 90)";
    ctx.fillText(letter, x, y);

    const letterWidth = ctx.measureText(letter).width;
    x += letterWidth;

    // go to next line, if there is not enought space
    if (x + letterWidth > width) {
      // color = colors[Math.floor(Math.random() * colors.length)];
      x = 0;
      y += lineHeight;
    }
  }
}

function wordIterator(word) {
  let i = 0;
  return () => word[i >= word.length ? (i = 0) : i++];
}
