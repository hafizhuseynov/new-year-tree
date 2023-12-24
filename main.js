let text = "HAPPYNEWYEAR";

const urlParams = new URLSearchParams(window.location.search);
const textParam = urlParams.get("text");

if (textParam) {
  text = String(textParam).replace(/[^a-zA-Z]+/g, "") || "*";
}

const colors = [
  "#FFB6C1",
  "#ADD8E6",
  "#E0FFFF",
  "#D3D3D3",
  "#FAFAD2",
  "#90EE90",
  "#FFB3DE",
  "#FFDAB9",
  "#FFFFE0",
  "#B0E0E6",
];

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  text = urlParams.get("text") || text;

  document.body.style.margin = "0";
  document.body.style.padding = "0";

  const canvas = document.getElementById("canvas");
  canvas.style.backgroundColor = "rgb(86, 14, 255)";
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

  const fontSize = parseInt(
    window.getComputedStyle(document.documentElement).fontSize
  );

  ctx.font = fontSize + 'px "Courier New"';

  let x = 0;
  let y = fontSize * 1.2;
  const lineHeight = fontSize * 1.2;
  let color = colors[Math.floor(Math.random() * colors.length)];
  while (y < canvas.height) {
    let letter = next();
    let currentLine = Math.round(y / lineHeight);
    let triangleHeight = Math.min(canvas.width / lineHeight / 1.2, 40);
    let triangleStart = 5;
    let triangleEnd = triangleStart + triangleHeight;

    const isHeightMatch =
      currentLine >= triangleStart && currentLine <= triangleEnd;

    const isWidthMatch =
      x >=
        canvas.width / 2 - ((currentLine - triangleStart) * lineHeight) / 2 &&
      x <= canvas.width / 2 + ((currentLine - triangleStart) * lineHeight) / 2;

    if (isHeightMatch && isWidthMatch) {
      ctx.fillStyle = color;
      ctx.fillText(letter, x, y);
    } else {
      ctx.fillStyle = "rgb(130, 100, 90)";
      ctx.fillText(letter, x, y);
    }

    const letterWidth = ctx.measureText(letter).width;
    x += letterWidth;

    if (x + letterWidth > canvas.width) {
      color = colors[Math.floor(Math.random() * colors.length)];
      x = 0;
      y += lineHeight;
    }
  }
}

function wordIterator(word) {
  let i = 0;
  return () => word[i++ % word.length];
}
