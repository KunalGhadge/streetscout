import { db } from '../src/lib/db'

async function seed() {
  const products = [
    {
      name: 'Shadow Hokage Jersey',
      slug: 'shadow-hokage-jersey',
      collection: 'Leaf Village Series',
      universe: 'Naruto',
      price: 89.0,
      description:
        'A premium athletic jersey channeling the spirit of the hidden leaf. Engineered with moisture-wicking fabric and a tailored fit for the modern shinobi.',
      fabric: 'Recycled Polyester Mesh',
      fit: 'Athletic Tailored',
      breathability: '4-Way Ventilation',
      durability: 'Reinforced Stitching',
      imageFront: '/images/product-naruto.png',
      imageBack: '/images/product-naruto.png',
      accentColor: 'crimson',
      isFeatured: true,
      inStock: true,
    },
    {
      name: 'King of Pirates Jersey',
      slug: 'king-of-pirates-jersey',
      collection: 'Grand Line Series',
      universe: 'One Piece',
      price: 95.0,
      description:
        'Sail the grand line in style. This jersey combines maritime-inspired design with premium sportswear engineering for the ultimate adventure-ready fit.',
      fabric: 'Performance Knit Jersey',
      fit: 'Relaxed Oversized',
      breathability: 'Mesh Vent Zones',
      durability: 'Double-Layer Hem',
      imageFront: '/images/product-onepiece.png',
      imageBack: '/images/product-onepiece.png',
      accentColor: 'crimson',
      isFeatured: true,
      inStock: true,
    },
    {
      name: 'Cursed Energy Jersey',
      slug: 'cursed-energy-jersey',
      collection: 'Tokyo Jujutsu Series',
      universe: 'Jujutsu Kaisen',
      price: 99.0,
      description:
        'Harness your cursed energy. A sleek, form-fitting jersey with occult-inspired detailing designed for those who walk between worlds.',
      fabric: 'Compression Tech Fabric',
      fit: 'Slim Compression',
      breathability: 'Active Cooling Mesh',
      durability: 'Abrasion Resistant',
      imageFront: '/images/product-jjk.png',
      imageBack: '/images/product-jjk.png',
      accentColor: 'purple',
      isFeatured: true,
      inStock: true,
    },
    {
      name: 'Survey Corps Jersey',
      slug: 'survey-corps-jersey',
      collection: 'Wall Maria Series',
      universe: 'Attack on Titan',
      price: 92.0,
      description:
        'Dedicate your heart. Military-grade athletic jersey built for mobility and endurance, inspired by the elite survey corps.',
      fabric: 'Tactical Performance Blend',
      fit: 'Combat Athletic',
      breathability: 'Strategic Ventilation',
      durability: 'Military-Grade Stitch',
      imageFront: '/images/product-aot.png',
      imageBack: '/images/product-aot.png',
      accentColor: 'blue',
      isFeatured: true,
      inStock: true,
    },
    {
      name: 'Flame Breath Jersey',
      slug: 'flame-breath-jersey',
      collection: 'Demon Slayer Series',
      universe: 'Demon Slayer',
      price: 94.0,
      description:
        'Ignite your fighting spirit. This jersey features flame-inspired patterns and a haori-inspired checkered design for a unique streetwear silhouette.',
      fabric: 'Breathable Tech Knit',
      fit: 'Standard Athletic',
      breathability: 'Full-Cycle Airflow',
      durability: 'Reinforced Shoulders',
      imageFront: '/images/product-demonslayer.png',
      imageBack: '/images/product-demonslayer.png',
      accentColor: 'crimson',
      isFeatured: false,
      inStock: true,
    },
    {
      name: 'Shadow Monarch Jersey',
      slug: 'shadow-monarch-jersey',
      collection: 'Gate Series',
      universe: 'Solo Leveling',
      price: 105.0,
      description:
        'Arise. The flagship jersey of the Shadow Monarch collection. Premium construction with glowing rune detailing for the ultimate solo player.',
      fabric: 'Premium Tech Fleece',
      fit: 'Oversized Drop-Shoulder',
      breathability: 'Thermal Regulation',
      durability: 'Heavy-Duty Construction',
      imageFront: '/images/product-sololeveling.png',
      imageBack: '/images/product-sololeveling.png',
      accentColor: 'purple',
      isFeatured: true,
      inStock: true,
    },
  ]

  for (const product of products) {
    await db.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    })
  }

  console.log(`Seeded ${products.length} products`)
}

seed()
  .catch(console.error)
  .finally(() => db.$disconnect())
