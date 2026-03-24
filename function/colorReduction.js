export function reduceColor(data, level) {
  if (level === 0) return data;

  const step = 2 ** level;

  for (let i = 0; i < data.length; i += 4) {
    data[i]   = Math.floor(data[i]   / step) * step;
    data[i+1] = Math.floor(data[i+1] / step) * step;
    data[i+2] = Math.floor(data[i+2] / step) * step;
  }

  return data;
}