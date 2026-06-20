// Helper to get accent color values
export const accentColors = {
  crimson: {
    hex: '#DC143C',
    rgb: '220, 20, 60',
  },
  purple: {
    hex: '#BF00FF',
    rgb: '191, 0, 255',
  },
  blue: {
    hex: '#0066FF',
    rgb: '0, 102, 255',
  },
} as const

export type AccentColor = keyof typeof accentColors

export function getAccent(color: string) {
  return accentColors[color as AccentColor] || accentColors.purple
}
