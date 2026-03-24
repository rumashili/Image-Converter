import { reduceColor } from "./function/colorReduction.js";

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
    URL.revokeObjectURL(url); // メモリ解放

    currentImg = img;

    // サイズ設定
    canvas.width = img.width;
    canvas.height = img.height;

    processImage();
  };
});

function processImage() {
  if (!currentImg) return;

  // 描画
  ctx.drawImage(currentImg, 0, 0);

  // ピクセル取得
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // 色削減
  const level = Number(slider.value);
  reduceColor(imageData.data, level);

  // 反映
  ctx.putImageData(imageData, 0, 0);
}

function updateLabel() {
  const level = Number(slider.value);
  const step = level === 0 ? "なし" : 2 ** level;
  label.textContent = `${level} (${step})`;
}