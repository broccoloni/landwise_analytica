import chroma from 'chroma-js';

export function getHeatMapUrl(
  data: number[],
  width: number,
  height: number,
  transparentVal: number | null,
  colorScale,
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
    if (value === transparentVal) {
      imageData.data[i * 4 + 3] = 0;
    } else {
      const color = colorScale(value).rgb();
      imageData.data[i * 4] = color[0];
      imageData.data[i * 4 + 1] = color[1];
      imageData.data[i * 4 + 2] = color[2];
      imageData.data[i * 4 + 3] = 255;
    }
  });

  if (scaleFactor === 1) {
    return canvas.toDataURL();
  }
    
  // Draw and scale to final size
  ctx.putImageData(imageData, 0, 0);
  const scaledCanvas = document.createElement("canvas");
  scaledCanvas.width = width * scaleFactor;
  scaledCanvas.height = height * scaleFactor;
  const scaledCtx = scaledCanvas.getContext("2d");
  if (!scaledCtx) throw new Error("Failed to get scaled canvas 2D context");

  scaledCtx.imageSmoothingEnabled = false;
  scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

  return scaledCanvas.toDataURL();
}
