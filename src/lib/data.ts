import type { Universe } from './types'

export const universes: Universe[] = [
  {
    id: 'naruto',
    name: 'Naruto',
    japanese: 'ナルト',
    dropNumber: 'DROP-001',
    image: '/images/universe-naruto.png',
  },
  {
    id: 'onepiece',
    name: 'One Piece',
    japanese: 'ワンピース',
    dropNumber: 'DROP-002',
    image: '/images/universe-onepiece.png',
  },
  {
    id: 'jjk',
    name: 'Jujutsu Kaisen',
    japanese: '呪術廻戦',
    dropNumber: 'DROP-003',
    image: '/images/universe-jjk.png',
  },
  {
    id: 'aot',
    name: 'Attack on Titan',
    japanese: '進撃の巨人',
    dropNumber: 'DROP-004',
    image: '/images/universe-aot.png',
  },
  {
    id: 'demonslayer',
    name: 'Demon Slayer',
    japanese: '鬼滅の刃',
    dropNumber: 'DROP-005',
    image: '/images/universe-demonslayer.png',
  },
  {
    id: 'sololeveling',
    name: 'Solo Leveling',
    japanese: '俺だけレベルアップな件',
    dropNumber: 'DROP-006',
    image: '/images/universe-sololeveling.png',
  },
]

export const lifestyleImages = [
  {
    src: '/images/lifestyle-college.png',
    label: 'College',
    japanese: '大学',
    tag: 'SCENE-01',
    description: 'Everyday campus legends',
  },
  {
    src: '/images/lifestyle-streetwear.png',
    label: 'Streetwear',
    japanese: 'ストリート',
    tag: 'SCENE-02',
    description: 'Tokyo after dark',
  },
  {
    src: '/images/lifestyle-gaming.png',
    label: 'Gaming',
    japanese: 'ゲーミング',
    tag: 'SCENE-03',
    description: 'Solo queue ready',
  },
  {
    src: '/images/lifestyle-animeevent.png',
    label: 'Anime Events',
    japanese: 'イベント',
    tag: 'SCENE-04',
    description: 'Where fandom meets',
  },
]

export const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

// Accent color (single accent system)
export const ACCENT = {
  hex: '#FF2D55',
  rgb: '255, 45, 85',
}

// Helper to format INR
export function formatINR(amount: number): string {
  return '₹' + Math.round(amount).toLocaleString('en-IN')
}
