import { reduceColor } from "./function/colorReduction.js";
import { resizeImageToFit } from "./function/utility.js";

const fileInput = document.getElementById("fileInput");
const runBtn = document.getElementById("runBtn");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const slider = document.getElementById("colorLevel");
const label = document.getElementById("levelValue");

let currentImg = null;

updateLabel();

slider.addEventListener("input", () => {
  updateLabel();
  if (currentImg) processImage();
});

runBtn.addEventListener("click", () => {
  const file = fileInput.files[0];
  if (!file) {
    alert("画像を選んでね");
    return;
  }

  const img = new Image();
  const url = URL.createObjectURL(file);
  img.src = url;

  img.onload = () => {
    try {
      URL.revokeObjectURL(img.src);

      currentImg = img;

      const { width, height } = resizeImageToFit(img, 480, 360);

      canvas.width = width;
      canvas.height = height;

      processImage();
    } catch (e) {
      alert(e)
    }
  };
});

function processImage() {
  if (!currentImg) return;

  ctx.imageSmoothingEnabled = false

  // 🔥 リサイズ描画
  ctx.drawImage(currentImg, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const level = Number(slider.value);
  reduceColor(imageData.data, level);

  ctx.putImageData(imageData, 0, 0);
}

function updateLabel() {
  const level = Number(slider.value);
  const step = level === 0 ? "なし" : 2 ** level;
  label.textContent = `${level} (${step})`;
}
