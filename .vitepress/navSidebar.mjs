import fs from 'node:fs'
import path from 'node:path'

const DOC_EXT = ['.md']
const EXCLUDED_DIRS = new Set(['.git', '.github', '.vitepress', 'node_modules', 'public', 'docs', 'images', 'docker_support'])

function isDirectory(p) {
  return fs.existsSync(p) && fs.statSync(p).isDirectory()
}

function isMarkdown(p) {
  return fs.existsSync(p) && fs.statSync(p).isFile() && DOC_EXT.includes(path.extname(p))
}

function titleFromName(name) {
  return name.replace(/\.md$/i, '')
}

function sortByPinyinOrName(a, b) {
  return a.localeCompare(b, 'zh-Hans-CN-u-co-pinyin')
}

export function generateNavAndSidebar(rootDir) {
  const entries = fs.readdirSync(rootDir)
  const sections = entries
    .filter((e) => isDirectory(path.join(rootDir, e)))
    .filter((e) => !EXCLUDED_DIRS.has(e) && !e.startsWith('.'))
    .sort(sortByPinyinOrName)

  const nav = []
  const sidebar = {}

  for (const dir of sections) {
    const abs = path.join(rootDir, dir)
  const readme = ['README.md', 'readme.md', 'index.md'].find((n) => fs.existsSync(path.join(abs, n)))
    const files = fs
      .readdirSync(abs)
      .filter((f) => isMarkdown(path.join(abs, f)))
      .sort(sortByPinyinOrName)

    const items = files.map((f) => ({
      text: titleFromName(f),
      link: `/${encodeURI(dir)}/${encodeURI(f)}`,
    }))

    if (items.length > 0) {
      sidebar[`/${dir}/`] = [
        {
          text: dir,
          items,
        },
      ]
      if (readme) {
        nav.push({ text: dir, link: `/${encodeURI(dir)}/${encodeURI(readme)}` })
      } else {
        nav.push({ text: dir, link: items[0].link })
      }
    } else {
      nav.push({ text: dir, link: `/${encodeURI(dir)}/` })
    }
  }

  return { nav, sidebar }
}
