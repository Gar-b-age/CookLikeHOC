import fs from 'node:fs'
import path from 'node:path'

const outputDir = path.resolve('.vercel/output')
const staticDir = path.join(outputDir, 'static')

fs.mkdirSync(staticDir, { recursive: true })

const configPath = path.join(outputDir, 'config.json')
const config = {
  version: 3,
}

fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
