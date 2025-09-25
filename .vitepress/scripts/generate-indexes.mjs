import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const EXCLUDED_DIRS = new Set(['.git', '.github', '.vitepress', 'node_modules', 'public', 'docs', 'images', 'docker_support'])

function isDirectory(p) {
  return fs.existsSync(p) && fs.statSync(p).isDirectory()
}

function isMarkdown(p) {
  return fs.existsSync(p) && fs.statSync(p).isFile() && path.extname(p).toLowerCase() === '.md'
}

function sortByPinyinOrName(a, b) {
  return a.localeCompare(b, 'zh-Hans-CN-u-co-pinyin')
}

function titleFromName(name) {
  return name.replace(/\.md$/i, '')
}

function buildIndexContent(dirName, files) {
  const header = `# ${dirName}\n\n<!-- AUTO-GENERATED: index for ${dirName}. Edit source files instead. -->\n\n`
  if (files.length === 0) return header + '（暂无条目）\n'
  const list = files
    .sort(sortByPinyinOrName)
    .map((f) => `- [${titleFromName(f)}](${encodeURI('./' + f)})`)
    .join('\n')
  return header + list + '\n'
}

function shouldOverwriteExisting(readmePath) {
  if (!fs.existsSync(readmePath)) return true
  const content = fs.readFileSync(readmePath, 'utf8')
  // 仅覆盖带有标记的自动生成文件，避免覆盖人工维护的索引
  return content.includes('AUTO-GENERATED: index')
}

function main() {
  const entries = fs.readdirSync(ROOT)
  const dirs = entries
    .filter((e) => isDirectory(path.join(ROOT, e)))
    .filter((e) => !EXCLUDED_DIRS.has(e) && !e.startsWith('.'))
    .sort(sortByPinyinOrName)

  let changed = 0
  for (const dir of dirs) {
    const abs = path.join(ROOT, dir)
    const files = fs
      .readdirSync(abs)
      .filter((f) => isMarkdown(path.join(abs, f)))
      .filter((f) => f.toLowerCase() !== 'readme.md' && f.toLowerCase() !== 'index.md')
      .sort(sortByPinyinOrName)

    const readmePath = path.join(abs, 'README.md')
    if (!shouldOverwriteExisting(readmePath)) continue

    const content = buildIndexContent(dir, files)
    fs.writeFileSync(readmePath, content, 'utf8')
    changed++
  }
  console.log(`[generate-indexes] updated ${changed} index file(s).`)
}

main()
