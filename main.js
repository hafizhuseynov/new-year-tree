let text = "HAPPYNEWYEAR";

const urlParams = new URLSearchParams(window.location.search);
const textParam = urlParams.get("text");

if (textParam) {
  text = String(textParam).replace(/[^a-zA-Z]+/g, "") || "*";
}

const colors = [
  "hsl(101, 69%, 88%)",
  "hsl(236, 64%, 78%)",
  "hsl(338, 68%, 84%)",
  "hsl(360, 53%, 80%)",
  "hsl(85, 56%, 81%)",
  "hsl(205, 60%, 82%)",
  "hsl(207, 69%, 73%)",
  "hsl(215, 67%, 75%)",
  "hsl(291, 50%, 75%)",
  "hsl(304, 51%, 78%)",
];

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  text = urlParams.get("text") || text;

  document.body.style.margin = "0";
  document.body.style.padding = "0";

  const canvas = document.getElementById("canvas");
  canvas.style.backgroundColor = "#000066";
  canvas.style.display = "block";

  fillCanvasWithText(canvas, text);
  window.onresize = () => fillCanvasWithText(canvas, text);
  setInterval(() => fillCanvasWithText(canvas, text), 500);
});

function fillCanvasWithText(canvas, text) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const next = wordIterator(text);
  const { fontSize, fontFamily } = window.getComputedStyle(
    document.documentElement
  );

  const fontSizeParsed = parseInt(fontSize);

  ctx.font = fontSizeParsed + "px" + " " + fontFamily;

  let x = 0;
  let y = fontSizeParsed;
  const lineHeight = fontSizeParsed * 1.2;

  // Random color for line
  let color = colors[Math.floor(Math.random() * colors.length)];

  while (y < canvas.height) {
    let letter = next();
    let currentLine = Math.round(y / lineHeight);

    // Triangle coordinates
    let triangleHeight = Math.min(canvas.width / lineHeight / 1.2, 40);
    let triangleStart = 5;
    let triangleEnd = triangleStart + triangleHeight;

    const isHeightMatch =
      currentLine >= triangleStart && currentLine <= triangleEnd;

    // to left and to right from center
    const widthOffset = ((currentLine - triangleStart) * lineHeight) / 2;

    const isWidthMatch =
      x >= canvas.width / 2 - widthOffset &&
      x <= canvas.width / 2 + widthOffset;

    ctx.fillStyle = isHeightMatch && isWidthMatch ? color : "rgb(130, 100, 90)";
    ctx.fillText(letter, x, y);

    const letterWidth = ctx.measureText(letter).width;
    x += letterWidth;

    // go to next line, if there is not enought space
    if (x + letterWidth > canvas.width) {
      color = colors[Math.floor(Math.random() * colors.length)];
      x = 0;
      y += lineHeight;
    }
  }
}

function wordIterator(word) {
  let i = 0;
  return () => word[i >= word.length ? (i = 0) : i++];
}
