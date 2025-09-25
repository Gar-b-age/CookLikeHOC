import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const EXCLUDED_DIRS = new Set(['.git', '.github', '.vitepress', 'node_modules', 'public', 'en', 'zh', 'images', 'scripts'])

function isDirectory(p) {
  return fs.existsSync(p) && fs.statSync(p).isDirectory()
}

function isMarkdown(p) {
  return fs.existsSync(p) && fs.statSync(p).isFile() && path.extname(p).toLowerCase() === '.md'
}

function sortByPinyinOrName(a, b) {
  return a.localeCompare(b, 'zh-Hans-CN-u-co-pinyin')
}

const DIR_TITLE_EN = {
  'staple-foods': 'Staple Foods',
  'cold-dishes': 'Cold Dishes',
  'braised-delicacies': 'Braised Delicacies',
  'breakfast': 'Breakfast',
  'soups': 'Soups',
  'stir-fried-dishes': 'Stir-Fried Dishes',
  'stews': 'Stews',
  'fried-items': 'Fried Items',
  'blanched-dishes': 'Blanched Dishes',
  'boiled-pots': 'Boiled Pots',
  'clay-pot-dishes': 'Clay Pot Dishes',
  'steamed-dishes': 'Steamed Dishes',
  'seasonings': 'Seasonings',
  'beverages': 'Beverages',
}

function encodeForMarkdownLink(name) {
  return encodeURIComponent(name).replace(/[()]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
}

function titleFromName(name) {
  return name.replace(/\.md$/i, '')
}

function dirTitle(dirName, lang) {
  if (lang === 'en') {
    if (DIR_TITLE_EN[dirName]) {
      return DIR_TITLE_EN[dirName]
    }
    return dirName
  }
  return dirName
}

function buildIndexContent(dirName, files, lang = 'zh') {
  const title = dirTitle(dirName, lang)
  const header = `# ${title}\n\n<!-- AUTO-GENERATED: index for ${title}. Edit source files instead. -->\n\n`
  if (files.length === 0) {
    const emptyMessage = lang === 'en' ? '(No entries available)' : '（暂无条目）'
    return header + emptyMessage + '\n'
  }
  const list = files
    .sort(sortByPinyinOrName)
    .map((f) => `- [${titleFromName(f)}](./${encodeForMarkdownLink(f)})`)
    .join('\n')
  return header + list + '\n'
}

function shouldOverwriteExisting(readmePath) {
  if (!fs.existsSync(readmePath)) return true
  const content = fs.readFileSync(readmePath, 'utf8')
  // 仅覆盖带有标记的自动生成文件，避免覆盖人工维护的索引
  return content.includes('AUTO-GENERATED: index')
}

function processDirectory(rootPath, lang = 'zh') {
  const entries = fs.readdirSync(rootPath)
  const excludedDirs =
    lang === 'en'
      ? new Set(['.git', '.github', '.vitepress', 'node_modules', 'public'])
      : EXCLUDED_DIRS

  const dirs = entries
    .filter((e) => isDirectory(path.join(rootPath, e)))
    .filter((e) => !excludedDirs.has(e) && !e.startsWith('.'))
    .sort(sortByPinyinOrName)

  let changed = 0
  for (const dir of dirs) {
    const abs = path.join(rootPath, dir)
    const indexPath = path.join(abs, 'index.md')
    if (!fs.existsSync(indexPath)) {
      const legacy = ['README.md', 'readme.md']
        .map((name) => path.join(abs, name))
        .find((candidate) => fs.existsSync(candidate))
      if (legacy) {
        fs.renameSync(legacy, indexPath)
      }
    }

    const allEntries = fs.readdirSync(abs)
    const allFiles = allEntries
      .filter((f) => isMarkdown(path.join(abs, f)))
      .filter((f) => f.toLowerCase() !== 'readme.md' && f.toLowerCase() !== 'index.md')

    // 根据语言过滤文件
    const files = allFiles.filter((f) => {
      if (f.toLowerCase() === 'readme.md' || f.toLowerCase() === 'index.md') return false
      if (lang === 'en') return true
      return !f.toLowerCase().endsWith('english_version.md')
    })

    const targetIndex = path.join(abs, 'index.md')
    if (!shouldOverwriteExisting(targetIndex)) continue

    const content = buildIndexContent(dir, files, lang)
    fs.writeFileSync(targetIndex, content, 'utf8')
    changed++
  }
  return changed
}

function main() {
  let totalChanged = 0

  // 处理中文版本（根目录）
  const zhChanged = processDirectory(ROOT, 'zh')
  totalChanged += zhChanged
  console.log(`[generate-indexes] updated ${zhChanged} Chinese index file(s).`)

  // 处理英文版本（en目录）
  const enPath = path.join(ROOT, 'en')
  if (fs.existsSync(enPath) && isDirectory(enPath)) {
    const enChanged = processDirectory(enPath, 'en')
    totalChanged += enChanged
    console.log(`[generate-indexes] updated ${enChanged} English index file(s).`)
  }

  console.log(`[generate-indexes] total updated ${totalChanged} index file(s).`)
}

main()
