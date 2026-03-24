import { rgbToHsv, hsvToRgb, deltaE } from "./utility.js";

export function reduceColor(data, level, mode = 0) {
  if (level === 0) return data;

  const step = 2 ** level;

  if (mode === 0) {
    const palette = [];
    const threshold = 2.5;
    for (let i = 0; i < data.length; i += 4) {
      const color = [data[i], data[i+1], data[i+2]];
    
      // パレットに近い色があるか探す
      let found = null;
      for (let pc of palette) {
        if (deltaE(color, pc) < threshold) {
            found = pc;
            break;
        }
      }

      if (found) {
        // 近い色があればその色で置き換え
        data[i]   = found[0];
        data[i+1] = found[1];
        data[i+2] = found[2];
      } else {
        // 近い色がなければ新しい色として登録
        palette.push(color);
      }
    }
  }

  if (mode === 1) {
    // 🎨 RGB丸め
    for (let i = 0; i < data.length; i += 4) {
      data[i]   = Math.round(data[i]   / step) * step;
      data[i+1] = Math.round(data[i+1] / step) * step;
      data[i+2] = Math.round(data[i+2] / step) * step;
    }
  }

  if (mode === 2) {
    // 🌈 HSV処理
    for (let i = 0; i < data.length; i += 4) {
      let [h, s, v] = rgbToHsv(data[i], data[i+1], data[i+2]);

      let h255 = h / 360 * 255;
      let s255 = s * 255;
      let v255 = v * 255;

      h255 = Math.round(h255 / step) * step;
      s255 = Math.floor(s255 / step) * step;
      v255 = Math.ceil(v255 / step) * step;

      h = (h255 / 255) * 360;
      s = s255 / 255;
      v = v255 / 255;

      const [r, g, b] = hsvToRgb(h, s, v);

      data[i] = r;
      data[i+1] = g;
      data[i+2] = b;
    }
  }

  return data;
}
