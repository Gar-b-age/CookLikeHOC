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
  'en',
  'images',
  'scripts',
])

const DIR_TITLE_EN: Record<string, string> = {
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

function isDirectory(p: string) {
  return fs.existsSync(p) && fs.statSync(p).isDirectory()
}

function isMarkdown(p: string) {
  return fs.existsSync(p) && fs.statSync(p).isFile() && DOC_EXT.includes(path.extname(p))
}

function titleFromName(name: string) {
  return name.replace(/\.md$/i, '')
}

function sortByPinyinOrName(a: string, b: string) {
  return a.localeCompare(b, 'zh-Hans-CN-u-co-pinyin')
}

function encodeSegment(name: string, locale: 'zh' | 'en') {
  const base = locale === 'en' ? encodeURIComponent(name) : name
  return base
    .replace(/ /g, '%20')
    .replace(/[()]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
}

function humaniseSlug(slug: string) {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function dirDisplayName(dir: string, locale: 'zh' | 'en') {
  if (locale === 'en') {
    return DIR_TITLE_EN[dir] ?? humaniseSlug(dir)
  }
  return dir
}

export function generateNavAndSidebar(rootDir: string, locale: 'zh' | 'en') {
  const isEnglish = locale === 'en'
  const baseDir = isEnglish ? path.join(rootDir, 'en') : rootDir
  const prefix = isEnglish ? '/en' : ''

  const entries = fs.readdirSync(baseDir)
  const sections = entries
    .filter((e) => isDirectory(path.join(baseDir, e)))
    .filter((e) => !EXCLUDED_DIRS.has(e) && !e.startsWith('.'))
  sections.sort(sortByPinyinOrName)

  const navEntries: { text: string; link: string }[] = []
  const sidebar: Sidebar = {}

  for (const dir of sections) {
    const abs = path.join(baseDir, dir)
    const files = fs
      .readdirSync(abs)
      .filter((f) => isMarkdown(path.join(abs, f)))
      .sort(sortByPinyinOrName)

    const display = dirDisplayName(dir, locale)
    const encodedDir = encodeSegment(dir, locale)
    const baseLink = `${prefix}/${encodedDir}`

    const filteredFiles = files.filter((f) => {
      const lower = f.toLowerCase()
      return lower !== 'readme.md' && lower !== 'index.md'
    })

    const items: SidebarItem[] = filteredFiles.map((f) => ({
      text: titleFromName(f),
      link: `${baseLink}/${encodeSegment(f, locale)}`,
    }))

    const readme = ['README.md', 'readme.md', 'index.md'].find((n) => fs.existsSync(path.join(abs, n)))

    const sidebarKey = `${baseLink}/`

    if (items.length > 0) {
      sidebar[sidebarKey] = [
        {
          text: display,
          items,
        },
      ]
      const navLink = readme ? `${baseLink}/` : items[0].link!
      navEntries.push({ text: display, link: navLink })
    } else {
      const navLink = readme ? `${baseLink}/` : `${baseLink}/`
      navEntries.push({ text: display, link: navLink })
    }
  }

  const navLabel = locale === 'en' ? 'Recipes' : '菜谱'
  const nav = navEntries.length
    ? [{ text: navLabel, items: navEntries }]
    : []

  return { nav, sidebar }
}
