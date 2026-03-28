/**
 * Valo .next ir node_modules/.cache - veikia visose OS.
 * Naudokite kai atsiranda vendor-chunks arba React hook klaidos.
 */
const fs = require('fs')
const path = require('path')

const dirs = ['.next', path.join('node_modules', '.cache')]

for (const dir of dirs) {
  try {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true })
      console.log(`Istrinta: ${dir}`)
    }
  } catch (err) {
    console.warn(`Nepavyko istrinti ${dir}:`, err.message)
  }
}

console.log('Valymas baigtas. Paleiskite: npm run dev')
