import { db } from '../src/lib/db'

async function updateBranding() {
  console.log('🎨 Updating product descriptions with Collector Pack branding...\n')

  const products = await db.product.findMany()

  for (const product of products) {
    let newDescription = product.description

    // Add Collector Pack mention if not already there
    if (!newDescription.toLowerCase().includes('collector pack')) {
      newDescription = newDescription.trim()

      // Check if it ends with a period, if not add one
      if (!newDescription.endsWith('.') && !newDescription.endsWith('!')) {
        newDescription += '.'
      }

      newDescription += '\n\nCollector Pack Included:\n• Exclusive Anime Poster\n• 5 Premium Stickers'
    }

    if (newDescription !== product.description) {
      await db.product.update({
        where: { id: product.id },
        data: { description: newDescription },
      })
      console.log(`  ✅ Updated: ${product.name}`)
    } else {
      console.log(`  ⏭️  Already has Collector Pack: ${product.name}`)
    }
  }

  console.log('\n✅ Branding update complete!')
  console.log('   All products now mention "Collector Pack" instead of goodies.')

  await db.$disconnect()
}

updateBranding()
  .catch((error) => {
    console.error('❌ Update failed:', error)
    process.exit(1)
  })
