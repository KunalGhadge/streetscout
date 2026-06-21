import { db } from '../src/lib/db'

async function seedContent() {
  // Clear existing
  await db.universe.deleteMany({})
  await db.drop.deleteMany({})
  await db.lifestyle.deleteMany({})

  // Universes
  const universes = [
    { name: 'Naruto', japanese: 'ナルト', dropNumber: 'DROP-001', image: '/images/universe-naruto.png', order: 0 },
    { name: 'One Piece', japanese: 'ワンピース', dropNumber: 'DROP-002', image: '/images/universe-onepiece.png', order: 1 },
    { name: 'Jujutsu Kaisen', japanese: '呪術廻戦', dropNumber: 'DROP-003', image: '/images/universe-jjk.png', order: 2 },
    { name: 'Attack on Titan', japanese: '進撃の巨人', dropNumber: 'DROP-004', image: '/images/universe-aot.png', order: 3 },
    { name: 'Demon Slayer', japanese: '鬼滅の刃', dropNumber: 'DROP-005', image: '/images/universe-demonslayer.png', order: 4 },
    { name: 'Solo Leveling', japanese: '俺だけレベルアップな件', dropNumber: 'DROP-006', image: '/images/universe-sololeveling.png', order: 5 },
  ]
  for (const u of universes) {
    await db.universe.create({ data: u })
  }
  console.log(`Seeded ${universes.length} universes`)

  // Drops
  const drops = [
    {
      number: 'DROP-001',
      japanese: 'ナルト',
      title: 'Hokage Legacy',
      description: 'The founding drop. Channeling the spirit of the hidden leaf with premium mesh construction and reinforced stitching.',
      status: 'AVAILABLE',
      image: '/images/universe-naruto.png',
      order: 0,
    },
    {
      number: 'DROP-003',
      japanese: '呪術廻戦',
      title: 'Cursed Energy',
      description: 'Occult-inspired compression wear. Form-fitting and built for those who walk between worlds.',
      status: 'AVAILABLE',
      image: '/images/universe-jjk.png',
      order: 1,
    },
    {
      number: 'DROP-006',
      japanese: '俺だけレベルアップな件',
      title: 'Shadow Monarch',
      description: 'The flagship. Premium tech fleece with glowing rune detailing for the ultimate solo player.',
      status: 'LIMITED',
      image: '/images/universe-sololeveling.png',
      order: 2,
    },
  ]
  for (const d of drops) {
    await db.drop.create({ data: d })
  }
  console.log(`Seeded ${drops.length} drops`)

  // Lifestyle
  const lifestyles = [
    { label: 'College', japanese: '大学', tag: 'SCENE-01', description: 'Everyday campus legends', image: '/images/lifestyle-college.png', order: 0 },
    { label: 'Streetwear', japanese: 'ストリート', tag: 'SCENE-02', description: 'Tokyo after dark', image: '/images/lifestyle-streetwear.png', order: 1 },
    { label: 'Gaming', japanese: 'ゲーミング', tag: 'SCENE-03', description: 'Solo queue ready', image: '/images/lifestyle-gaming.png', order: 2 },
    { label: 'Anime Events', japanese: 'イベント', tag: 'SCENE-04', description: 'Where fandom meets', image: '/images/lifestyle-animeevent.png', order: 3 },
  ]
  for (const l of lifestyles) {
    await db.lifestyle.create({ data: l })
  }
  console.log(`Seeded ${lifestyles.length} lifestyle items`)
}

seedContent()
  .catch(console.error)
  .finally(() => db.$disconnect())
