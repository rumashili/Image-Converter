import { rgbToHsv, hsvToRgb } from "./utlity.js";

export function reduceColor(data, level) {
  if (level === 0) return data;

  const step = 2 ** level;

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

  return data;
}