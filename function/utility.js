export function rgbToHsv(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = 0;

  if (d !== 0) {
    if (max === r) h = (g - b) / d % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;

    h *= 60;
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : d / max;
  const v = max;

  return [h, s, v];
}



export function hsvToRgb(h, s, v) {
  const c = v * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = v - c;

  let r = 0, g = 0, b = 0;

  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  ];
}



export function deltaE(c1, c2) {
    // --- RGB(0-255) → sRGB(0-1) ---
    function rgbToSRGB(c) {
        return c.map(v => {
            let s = v / 255;
            return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
        });
    }

    // --- sRGB → XYZ ---
    function rgbToXYZ(rgb) {
        const [r, g, b] = rgb;
        const X = r*0.4124 + g*0.3576 + b*0.1805;
        const Y = r*0.2126 + g*0.7152 + b*0.0722;
        const Z = r*0.0193 + g*0.1192 + b*0.9505;
        return [X, Y, Z];
    }

    // --- XYZ → Lab ---
    function xyzToLab(xyz) {
        const [X, Y, Z] = xyz;
        const Xn = 0.95047, Yn = 1.00000, Zn = 1.08883; // D65白色点
        function f(t) {
            return t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16/116;
        }
        const fx = f(X / Xn);
        const fy = f(Y / Yn);
        const fz = f(Z / Zn);
        const L = 116*fy - 16;
        const a = 500 * (fx - fy);
        const b = 200 * (fy - fz);
        return [L, a, b];
    }

    const lab1 = xyzToLab(rgbToXYZ(rgbToSRGB(c1)));
    const lab2 = xyzToLab(rgbToXYZ(rgbToSRGB(c2)));

    // --- ΔE76 ---
    const delta = Math.sqrt(
        Math.pow(lab1[0]-lab2[0],2) +
        Math.pow(lab1[1]-lab2[1],2) +
        Math.pow(lab1[2]-lab2[2],2)
    );

    return delta;
}



export function resizeImageToFit(img, maxW, maxH) {
  const ratio = Math.min(maxW / img.width, maxH / img.height);

  const newW = Math.floor(img.width * ratio);
  const newH = Math.floor(img.height * ratio);

  return { width: newW, height: newH };
}
