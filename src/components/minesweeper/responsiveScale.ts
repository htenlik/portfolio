export function getResponsiveMineScale(width: number, height: number, rows: number, cols: number) {
  const intrinsicWidth = cols * 16 + 16;
  const intrinsicHeight = rows * 16 + 76;
  const fit = Math.min((width - 8) / intrinsicWidth, (height - 8) / intrinsicHeight);
  return Math.max(1, Math.min(3, Math.floor(fit * 10) / 10));
}
