/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Auto-switch Prisma provider based on DATABASE_URL
 * - If DATABASE_URL starts with "file:" → SQLite (local dev)
 * - If DATABASE_URL starts with "postgresql:" or "postgres:" → PostgreSQL (Vercel)
 */
const fs = require('fs')
const path = require('path')

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma')
const dbUrl = process.env.DATABASE_URL || ''

let provider = 'sqlite'
if (dbUrl.startsWith('postgresql:') || dbUrl.startsWith('postgres:')) {
  provider = 'postgresql'
}

console.log(`[prisma-switch] DATABASE_URL starts with: "${dbUrl.split(':')[0]}"`)
console.log(`[prisma-switch] Using provider: ${provider}`)

let schema = fs.readFileSync(schemaPath, 'utf8')
schema = schema.replace(
  /provider\s*=\s*"(sqlite|postgresql)"/,
  `provider = "${provider}"`
)
fs.writeFileSync(schemaPath, schema)
console.log(`[prisma-switch] Updated prisma/schema.prisma → provider = "${provider}"`)
