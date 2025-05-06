export function rgbToHex(rgb: [number, number, number]): string {
    return `#${rgb.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}
