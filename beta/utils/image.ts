import chroma from 'chroma-js';

export function dataToColorScaleUrl(
  data: (number|null)[],
  width: number,
  height: number,
  transparentVal: number | null,
  colorScale: (value: number) => chroma.Color,
  scaleFactor: number
): string {
  // Create base canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas 2D context");

  const imageData = ctx.createImageData(width, height);

  data.forEach((value, i) => {
    if (value === transparentVal || value === null) {
      imageData.data[i * 4] = 0;
      imageData.data[i * 4 + 1] = 0;
      imageData.data[i * 4 + 2] = 0;
      imageData.data[i * 4 + 3] = 0;
    } else {
      const color = colorScale(value).rgb();
      imageData.data[i * 4] = color[0];
      imageData.data[i * 4 + 1] = color[1];
      imageData.data[i * 4 + 2] = color[2];
      imageData.data[i * 4 + 3] = 255;
    }
  });

  ctx.putImageData(imageData, 0, 0);
    
  if (scaleFactor === 1) {
    return canvas.toDataURL();
  }
    
  // Draw and scale to final size
  const scaledCanvas = document.createElement("canvas");
  scaledCanvas.width = width * scaleFactor;
  scaledCanvas.height = height * scaleFactor;
  const scaledCtx = scaledCanvas.getContext("2d");
  if (!scaledCtx) throw new Error("Failed to get scaled canvas 2D context");

  scaledCtx.imageSmoothingEnabled = false;
  scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

  return scaledCanvas.toDataURL();
}

export function dataToStaticColorUrl(
  data: (number|null)[],
  width: number,
  height: number,
  transparentVal: number | null,
  colors: string[],
  scaleFactor: number
): string {
  // Create base canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas 2D context");

  const imageData = ctx.createImageData(width, height);

  data.forEach((value, i) => {
    if (value === transparentVal || value === null) {
      imageData.data[i * 4] = 0;
      imageData.data[i * 4 + 1] = 0;
      imageData.data[i * 4 + 2] = 0;
      imageData.data[i * 4 + 3] = 0;
    } else {
      const [r, g, b] = chroma(colors[value]).rgb();
      imageData.data[i * 4] = r;
      imageData.data[i * 4 + 1] = g;
      imageData.data[i * 4 + 2] = b;
      imageData.data[i * 4 + 3] = 255;
    }
  });

  ctx.putImageData(imageData, 0, 0);
    
  if (scaleFactor === 1) {
    return canvas.toDataURL();
  }
    
  // Draw and scale to final size
  const scaledCanvas = document.createElement("canvas");
  scaledCanvas.width = width * scaleFactor;
  scaledCanvas.height = height * scaleFactor;
  const scaledCtx = scaledCanvas.getContext("2d");
  if (!scaledCtx) throw new Error("Failed to get scaled canvas 2D context");

  scaledCtx.imageSmoothingEnabled = false;
  scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

  return scaledCanvas.toDataURL();
}
