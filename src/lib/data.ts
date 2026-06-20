import type { Universe } from './types'

export const universes: Universe[] = [
  {
    id: 'naruto',
    name: 'Naruto',
    japanese: 'ナルト',
    image: '/images/universe-naruto.png',
    accent: 'crimson',
  },
  {
    id: 'onepiece',
    name: 'One Piece',
    japanese: 'ワンピース',
    image: '/images/universe-onepiece.png',
    accent: 'crimson',
  },
  {
    id: 'jjk',
    name: 'Jujutsu Kaisen',
    japanese: '呪術廻戦',
    image: '/images/universe-jjk.png',
    accent: 'purple',
  },
  {
    id: 'aot',
    name: 'Attack on Titan',
    japanese: '進撃の巨人',
    image: '/images/universe-aot.png',
    accent: 'blue',
  },
  {
    id: 'demonslayer',
    name: 'Demon Slayer',
    japanese: '鬼滅の刃',
    image: '/images/universe-demonslayer.png',
    accent: 'crimson',
  },
  {
    id: 'sololeveling',
    name: 'Solo Leveling',
    japanese: '俺だけレベルアップな件',
    image: '/images/universe-sololeveling.png',
    accent: 'purple',
  },
]

export const lifestyleImages = [
  {
    src: '/images/lifestyle-college.png',
    label: 'College',
    japanese: '大学',
    description: 'Everyday campus legends',
  },
  {
    src: '/images/lifestyle-streetwear.png',
    label: 'Streetwear',
    japanese: 'ストリート',
    description: 'Tokyo after dark',
  },
  {
    src: '/images/lifestyle-gaming.png',
    label: 'Gaming',
    japanese: 'ゲーミング',
    description: 'Solo queue ready',
  },
  {
    src: '/images/lifestyle-animeevent.png',
    label: 'Anime Events',
    japanese: 'イベント',
    description: 'Where fandom meets',
  },
]

export const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
