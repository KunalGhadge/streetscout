/**
 * Seed Production Database
 * Run this AFTER deploying to Vercel to fill the database with demo content
 *
 * Usage:
 *   1. Make sure DATABASE_URL in .env points to your Vercel Postgres
 *      (run: npx vercel env pull .env.production.local)
 *   2. Run: bun run scripts/seed-production.ts
 *
 * This script is IDEMPOTENT — safe to run multiple times.
 * It will not duplicate data or overwrite your changes.
 */

import { db } from '../src/lib/db'

async function seedProduction() {
  console.log('🌱 Seeding production database...\n')

  // ============================================
  // 1. PRODUCTS
  // ============================================
  console.log('📦 Checking products...')
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
      description: 'A premium athletic jersey channeling the spirit of the hidden leaf. Engineered with moisture-wicking fabric and a tailored fit for the modern shinobi.',
      fabric: 'Recycled Polyester Mesh',
      fit: 'Athletic Tailored',
      breathability: '4-Way Ventilation',
      durability: 'Reinforced Stitching',
      sizes: 'XS,S,M,L,XL,XXL',
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
      description: 'Sail the grand line in style. This jersey combines maritime-inspired design with premium sportswear engineering for the ultimate adventure-ready fit.',
      fabric: 'Performance Knit Jersey',
      fit: 'Relaxed Oversized',
      breathability: 'Mesh Vent Zones',
      durability: 'Double-Layer Hem',
      sizes: 'XS,S,M,L,XL,XXL',
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
      description: 'Harness your cursed energy. A sleek, form-fitting jersey with occult-inspired detailing designed for those who walk between worlds.',
      fabric: 'Compression Tech Fabric',
      fit: 'Slim Compression',
      breathability: 'Active Cooling Mesh',
      durability: 'Abrasion Resistant',
      sizes: 'XS,S,M,L,XL,XXL',
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
      description: 'Dedicate your heart. Military-grade athletic jersey built for mobility and endurance, inspired by the elite survey corps.',
      fabric: 'Tactical Performance Blend',
      fit: 'Combat Athletic',
      breathability: 'Strategic Ventilation',
      durability: 'Military-Grade Stitch',
      sizes: 'XS,S,M,L,XL,XXL',
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
      description: 'Ignite your fighting spirit. This jersey features flame-inspired patterns and a haori-inspired checkered design for a unique streetwear silhouette.',
      fabric: 'Breathable Tech Knit',
      fit: 'Standard Athletic',
      breathability: 'Full-Cycle Airflow',
      durability: 'Reinforced Shoulders',
      sizes: 'XS,S,M,L,XL,XXL',
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
      description: 'Arise. The flagship jersey of the Shadow Monarch collection. Premium construction with glowing rune detailing for the ultimate solo player.',
      fabric: 'Premium Tech Fleece',
      fit: 'Oversized Drop-Shoulder',
      breathability: 'Thermal Regulation',
      durability: 'Heavy-Duty Construction',
      sizes: 'XS,S,M,L,XL,XXL',
      imageFront: '/images/product-sololeveling.png',
      imageBack: '/images/product-sololeveling.png',
      accentColor: 'accent',
      isFeatured: true,
      inStock: true,
    },
  ]

  for (const product of products) {
    const existing = await db.product.findUnique({ where: { slug: product.slug } })
    if (!existing) {
      await db.product.create({ data: product })
      console.log(`  ✅ Created: ${product.name}`)
    } else {
      console.log(`  ⏭️  Already exists: ${product.name}`)
    }
  }

  // ============================================
  // 2. UNIVERSES
  // ============================================
  console.log('\n🌐 Checking universes...')
  const universes = [
    { name: 'Naruto', japanese: 'ナルト', dropNumber: 'DROP-001', image: '/images/universe-naruto.png', order: 0 },
    { name: 'One Piece', japanese: 'ワンピース', dropNumber: 'DROP-002', image: '/images/universe-onepiece.png', order: 1 },
    { name: 'Jujutsu Kaisen', japanese: '呪術廻戦', dropNumber: 'DROP-003', image: '/images/universe-jjk.png', order: 2 },
    { name: 'Attack on Titan', japanese: '進撃の巨人', dropNumber: 'DROP-004', image: '/images/universe-aot.png', order: 3 },
    { name: 'Demon Slayer', japanese: '鬼滅の刃', dropNumber: 'DROP-005', image: '/images/universe-demonslayer.png', order: 4 },
    { name: 'Solo Leveling', japanese: '俺だけレベルアップな件', dropNumber: 'DROP-006', image: '/images/universe-sololeveling.png', order: 5 },
  ]

  for (const u of universes) {
    const existing = await db.universe.findFirst({ where: { name: u.name } })
    if (!existing) {
      await db.universe.create({ data: u })
      console.log(`  ✅ Created: ${u.name}`)
    } else {
      console.log(`  ⏭️  Already exists: ${u.name}`)
    }
  }

  // ============================================
  // 3. DROPS
  // ============================================
  console.log('\n🔥 Checking drops...')
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
    const existing = await db.drop.findFirst({ where: { number: d.number } })
    if (!existing) {
      await db.drop.create({ data: d })
      console.log(`  ✅ Created: ${d.title} (${d.number})`)
    } else {
      console.log(`  ⏭️  Already exists: ${d.title} (${d.number})`)
    }
  }

  // ============================================
  // 4. LIFESTYLE
  // ============================================
  console.log('\n📸 Checking lifestyle...')
  const lifestyles = [
    { label: 'College', japanese: '大学', tag: 'SCENE-01', description: 'Everyday campus legends', image: '/images/lifestyle-college.png', order: 0 },
    { label: 'Streetwear', japanese: 'ストリート', tag: 'SCENE-02', description: 'Tokyo after dark', image: '/images/lifestyle-streetwear.png', order: 1 },
    { label: 'Gaming', japanese: 'ゲーミング', tag: 'SCENE-03', description: 'Solo queue ready', image: '/images/lifestyle-gaming.png', order: 2 },
    { label: 'Anime Events', japanese: 'イベント', tag: 'SCENE-04', description: 'Where fandom meets', image: '/images/lifestyle-animeevent.png', order: 3 },
  ]

  for (const l of lifestyles) {
    const existing = await db.lifestyle.findFirst({ where: { label: l.label } })
    if (!existing) {
      await db.lifestyle.create({ data: l })
      console.log(`  ✅ Created: ${l.label}`)
    } else {
      console.log(`  ⏭️  Already exists: ${l.label}`)
    }
  }

  // ============================================
  // 5. STORE STATUS (default: accepting orders)
  // ============================================
  console.log('\n🏪 Checking store status...')
  const storeStatus = await db.storeStatus.findFirst()
  if (!storeStatus) {
    await db.storeStatus.create({ data: { accepting: true, message: '' } })
    console.log('  ✅ Created: Store accepting orders')
  } else {
    console.log('  ⏭️  Already exists')
  }

  // ============================================
  // 6. SETTINGS (WhatsApp number)
  // ============================================
  console.log('\n📞 Checking settings...')
  const whatsappSetting = await db.setting.findUnique({ where: { key: 'whatsapp_number' } })
  if (!whatsappSetting) {
    await db.setting.create({ data: { key: 'whatsapp_number', value: '918451818607' } })
    console.log('  ✅ Created: WhatsApp number (918451818607)')
  } else {
    console.log(`  ⏭️  Already exists: ${whatsappSetting.value}`)
  }

  // ============================================
  // SUMMARY
  // ============================================
  const counts = {
    products: await db.product.count(),
    universes: await db.universe.count(),
    drops: await db.drop.count(),
    lifestyle: await db.lifestyle.count(),
    coupons: await db.coupon.count(),
    notifications: await db.notification.count(),
    affiliates: await db.affiliate.count(),
    settings: await db.setting.count(),
  }

  console.log('\n✅ Seed complete! Database now contains:')
  console.log(`   📦 Products:     ${counts.products}`)
  console.log(`   🌐 Universes:    ${counts.universes}`)
  console.log(`   🔥 Drops:        ${counts.drops}`)
  console.log(`   📸 Lifestyle:    ${counts.lifestyle}`)
  console.log(`   🎟️ Coupons:      ${counts.coupons}`)
  console.log(`   🔔 Notifications: ${counts.notifications}`)
  console.log(`   🤝 Affiliates:   ${counts.affiliates}`)
  console.log(`   ⚙️ Settings:     ${counts.settings}`)
  console.log('\n🚀 Your site is ready! Visit it and everything should be populated.')

  await db.$disconnect()
}

seedProduction()
  .catch((error) => {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  })
