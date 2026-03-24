const fileInput = document.getElementById("fileInput");
const runBtn = document.getElementById("runBtn");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

runBtn.addEventListener("click", () => {
  const file = fileInput.files[0];
  if (!file) {
    alert("画像を選んでね");
    return;
  }

  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);
  };
});