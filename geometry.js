export function tileCenter(row, col, width, height) {
  return { x: (col - row) * width / 2, y: (col + row) * height / 2 };
}
export function cellAt(x, y, width, height) {
  const col = x / width + y / height;
  const row = y / height - x / width;
  return { row: Math.floor(row + .5), col: Math.floor(col + .5) };
}
export function assetGeometry(imageWidth, imageHeight, descriptor = {}) {
  const lw = descriptor.logicalWidth, lh = descriptor.logicalHeight;
  if ((lw == null) !== (lh == null)) throw Error('Provide both logicalWidth and logicalHeight.');
  const bleed = descriptor.bleed ?? (lw != null ? (imageWidth - lw) / 2 : imageHeight - imageWidth / 2);
  const width = lw ?? imageWidth - bleed * 2;
  const height = lh ?? imageHeight - bleed * 2;
  if (![width,height,bleed].every(Number.isFinite) || width <= 0 || height <= 0 || bleed < 0 ||
      Math.abs(width / height - 2) > .0001 ||
      Math.abs(imageWidth - width - 2 * bleed) > .001 || Math.abs(imageHeight - height - 2 * bleed) > .001 ||
      (lw == null && bleed > 4)) {
    throw Error('Expected a 2:1 ground diamond with symmetric bleed. Set logicalWidth, logicalHeight and bleed explicitly.');
  }
  return { width, height, bleed };
}
export function validateMap(value) {
  if (!Array.isArray(value) || !value.length || value.length > 64 || !Array.isArray(value[0]) || !value[0].length || value[0].length > 64)
    throw Error('Use a rectangular array between 1×1 and 64×64.');
  const n = value[0].length;
  if (!value.every(row => Array.isArray(row) && row.length === n && row.every(key => key === null || (typeof key === 'string' && key.length))))
    throw Error('Every row must have the same length. Cells must be asset-key strings or null.');
  return value.map(row => [...row]);
}
