import fs from 'node:fs'
import path from 'node:path'
import type { DefaultTheme } from 'vitepress'

export type SidebarItem = DefaultTheme.SidebarItem
export type NavItem = DefaultTheme.NavItem
export type Sidebar = DefaultTheme.Sidebar

const DOC_EXT = ['.md']
const EXCLUDED_DIRS = new Set([
  '.git',
  '.github',
  '.vitepress',
  'node_modules',
  'images',
  'docker_support',
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

  const nav: NavItem[] = []
  const sidebar: Sidebar = {}

  // This is the item type we generate from files. It has a required text and link.
  // It is compatible with both NavItem and SidebarItem.
  type LinkItem = { text: string; link: string }

  for (const dir of sections) {
    const abs = path.join(rootDir, dir)
    const files = fs
      .readdirSync(abs)
      .filter((f) => isMarkdown(path.join(abs, f)))
      .sort(sortByPinyinOrName)

    const items: LinkItem[] = files.map((f) => ({
      text: titleFromName(f),
      link: `/${encodeURI(dir)}/${encodeURI(f)}`,
    }))

    if (items.length > 0) {
      const readme = ['README.md', 'readme.md', 'index.md'].find((n) =>
        fs.existsSync(path.join(abs, n)),
      )
      const readmeURI = readme ? `/${encodeURI(dir)}/${encodeURI(readme)}` : undefined

      let sectionLink: string
      let sectionItems: LinkItem[]

      if (readmeURI) {
        sectionLink = readmeURI
        sectionItems = items.filter((i) => i.link !== readmeURI)
      } else {
        sectionLink = items[0].link!
        sectionItems = items.slice(1)
      }

      sidebar[`/${dir}/`] = [
        {
          text: dir,
          link: sectionLink,
          items: sectionItems,
        },
      ]

      nav.push({
        text: dir,
        link: sectionLink,
      })
    } else {
      nav.push({ text: dir, link: `/${encodeURI(dir)}/` })
    }
  }

  return { nav, sidebar }
}
