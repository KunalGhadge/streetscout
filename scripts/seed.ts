import { db } from '../src/lib/db'

async function cleanAndSeed() {
  // Delete all existing products
  await db.product.deleteMany({})
  console.log('Deleted all products')

  const products = [
    {
      name: 'Hokage Legacy Jersey',
      slug: 'hokage-legacy-jersey',
      collection: 'Leaf Village Series',
      collectionTag: 'NARUTO COLLECTION',
      dropNumber: 'DROP-001',
      universe: 'Naruto',
      universeJp: 'ナルト',
      price: 2499,
      description:
        'A premium athletic jersey channeling the spirit of the hidden leaf. Engineered with moisture-wicking fabric and a tailored fit for the modern shinobi.',
      fabric: 'Recycled Polyester Mesh',
      fit: 'Athletic Tailored',
      breathability: '4-Way Ventilation',
      durability: 'Reinforced Stitching',
      imageFront: '/images/product-naruto.png',
      imageBack: '/images/product-naruto.png',
      accentColor: 'accent',
      isFeatured: true,
      inStock: true,
    },
    {
      name: 'Pirate King Jersey',
      slug: 'pirate-king-jersey',
      collection: 'Grand Line Series',
      collectionTag: 'ONE PIECE COLLECTION',
      dropNumber: 'DROP-002',
      universe: 'One Piece',
      universeJp: 'ワンピース',
      price: 2799,
      description:
        'Sail the grand line in style. This jersey combines maritime-inspired design with premium sportswear engineering for the ultimate adventure-ready fit.',
      fabric: 'Performance Knit Jersey',
      fit: 'Relaxed Oversized',
      breathability: 'Mesh Vent Zones',
      durability: 'Double-Layer Hem',
      imageFront: '/images/product-onepiece.png',
      imageBack: '/images/product-onepiece.png',
      accentColor: 'accent',
      isFeatured: true,
      inStock: true,
    },
    {
      name: 'Cursed Energy Jersey',
      slug: 'cursed-energy-jersey',
      collection: 'Tokyo Jujutsu Series',
      collectionTag: 'JJK COLLECTION',
      dropNumber: 'DROP-003',
      universe: 'Jujutsu Kaisen',
      universeJp: '呪術廻戦',
      price: 2999,
      description:
        'Harness your cursed energy. A sleek, form-fitting jersey with occult-inspired detailing designed for those who walk between worlds.',
      fabric: 'Compression Tech Fabric',
      fit: 'Slim Compression',
      breathability: 'Active Cooling Mesh',
      durability: 'Abrasion Resistant',
      imageFront: '/images/product-jjk.png',
      imageBack: '/images/product-jjk.png',
      accentColor: 'accent',
      isFeatured: true,
      inStock: true,
    },
    {
      name: 'Survey Corps Jersey',
      slug: 'survey-corps-jersey',
      collection: 'Wall Maria Series',
      collectionTag: 'AOT COLLECTION',
      dropNumber: 'DROP-004',
      universe: 'Attack on Titan',
      universeJp: '進撃の巨人',
      price: 2699,
      description:
        'Dedicate your heart. Military-grade athletic jersey built for mobility and endurance, inspired by the elite survey corps.',
      fabric: 'Tactical Performance Blend',
      fit: 'Combat Athletic',
      breathability: 'Strategic Ventilation',
      durability: 'Military-Grade Stitch',
      imageFront: '/images/product-aot.png',
      imageBack: '/images/product-aot.png',
      accentColor: 'accent',
      isFeatured: true,
      inStock: true,
    },
    {
      name: 'Flame Breath Jersey',
      slug: 'flame-breath-jersey',
      collection: 'Demon Slayer Series',
      collectionTag: 'DEMON SLAYER COLLECTION',
      dropNumber: 'DROP-005',
      universe: 'Demon Slayer',
      universeJp: '鬼滅の刃',
      price: 2899,
      description:
        'Ignite your fighting spirit. This jersey features flame-inspired patterns and a haori-inspired checkered design for a unique streetwear silhouette.',
      fabric: 'Breathable Tech Knit',
      fit: 'Standard Athletic',
      breathability: 'Full-Cycle Airflow',
      durability: 'Reinforced Shoulders',
      imageFront: '/images/product-demonslayer.png',
      imageBack: '/images/product-demonslayer.png',
      accentColor: 'accent',
      isFeatured: false,
      inStock: true,
    },
    {
      name: 'Shadow Monarch Jersey',
      slug: 'shadow-monarch-jersey',
      collection: 'Gate Series',
      collectionTag: 'SOLO LEVELING COLLECTION',
      dropNumber: 'DROP-006',
      universe: 'Solo Leveling',
      universeJp: '俺だけレベルアップな件',
      price: 3299,
      description:
        'Arise. The flagship jersey of the Shadow Monarch collection. Premium construction with glowing rune detailing for the ultimate solo player.',
      fabric: 'Premium Tech Fleece',
      fit: 'Oversized Drop-Shoulder',
      breathability: 'Thermal Regulation',
      durability: 'Heavy-Duty Construction',
      imageFront: '/images/product-sololeveling.png',
      imageBack: '/images/product-sololeveling.png',
      accentColor: 'accent',
      isFeatured: true,
      inStock: true,
    },
  ]

  for (const product of products) {
    await db.product.create({ data: product })
  }

  console.log(`Seeded ${products.length} products`)

  // Verify
  const all = await db.product.findMany()
  console.log(`Total products in DB: ${all.length}`)
  console.log('First product:', { name: all[0].name, dropNumber: all[0].dropNumber, collectionTag: all[0].collectionTag, universeJp: all[0].universeJp, price: all[0].price })
}

cleanAndSeed()
  .catch(console.error)
  .finally(() => db.$disconnect())
