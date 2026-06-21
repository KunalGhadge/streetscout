import { db } from '../src/lib/db'

async function seedStoreStatus() {
  // Check if store status exists
  const existing = await db.storeStatus.findFirst()
  if (!existing) {
    await db.storeStatus.create({
      data: {
        accepting: true,
        message: '',
      },
    })
    console.log('Created default store status (accepting orders)')
  } else {
    console.log('Store status already exists:', existing)
  }
}

seedStoreStatus()
  .catch(console.error)
  .finally(() => db.$disconnect())
