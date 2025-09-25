import fs from 'node:fs'
import path from 'node:path'

export type SidebarItem = { text: string; link?: string; items?: SidebarItem[] }
export type Sidebar = Record<string, SidebarItem[]>

const DOC_EXT = ['.md']
const EXCLUDED_DIRS = new Set([
  '.git',
  '.github',
  '.vitepress',
  'node_modules',
  'public',
  'docs',
  'images',
  'docker_support',
])

function isDirectory(p: string) {
  return fs.existsSync(p) && fs.statSync(p).isDirectory()
}

function isMarkdown(p: string) {
  return fs.existsSync(p) && fs.statSync(p).isFile() && DOC_EXT.includes(path.extname(p))
}

function titleFromName(name: string) {
  // strip extension & use as-is (Chinese names kept)
  return name.replace(/\.md$/i, '')
}

function sortByPinyinOrName(a: string, b: string) {
  return a.localeCompare(b, 'zh-Hans-CN-u-co-pinyin')
}

export function generateNavAndSidebar(rootDir: string) {
  const entries = fs.readdirSync(rootDir)
  const sections = entries
    .filter((e) => isDirectory(path.join(rootDir, e)))
    .filter((e) => !EXCLUDED_DIRS.has(e) && !e.startsWith('.'))
  sections.sort(sortByPinyinOrName)

  const nav: { text: string; link: string }[] = []
  const sidebar: Sidebar = {}

  for (const dir of sections) {
    const abs = path.join(rootDir, dir)
    const files = fs
      .readdirSync(abs)
      .filter((f) => isMarkdown(path.join(abs, f)))
      .sort(sortByPinyinOrName)

    // Build sidebar for this section
    const items: SidebarItem[] = files.map((f) => ({
      text: titleFromName(f),
      link: `/${encodeURI(dir)}/${encodeURI(f)}`,
    }))

    // Find README.md、readme.md、index.md
    const readme = ['README.md', 'readme.md', 'index.md'].find((n) => fs.existsSync(path.join(abs, n)))

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
        nav.push({ text: dir, link: items[0].link! })
      }
    } else {
      nav.push({ text: dir, link: `/${encodeURI(dir)}/` })
    }
  }

  return { nav, sidebar }
}
