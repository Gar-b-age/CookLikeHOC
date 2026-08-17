import { defineConfig } from 'vitepress'
import { generateNavAndSidebar } from './navSidebar'
// @ts-ignore - .mjs 无类型声明，构建由 esbuild 处理
import { quantityMarkdownPlugin } from './quantity-markdown.mjs'

const { nav, sidebar } = generateNavAndSidebar(process.cwd())

export default defineConfig({
  lang: 'zh-CN',
  title: 'CookLikeHOC',
  description: '像老乡鸡那样做饭',
  lastUpdated: true,
  cleanUrls: true,
  markdown: {
    config: (md) => {
      md.use(quantityMarkdownPlugin)
    },
  },
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: '首页', link: '/' },
      ...nav,
      { text: 'GitHub', link: 'https://github.com/Gar-b-age/CookLikeHOC' },
    ],
    sidebar,
    search: {
      provider: 'local'
    },
    outline: [2, 3],
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    lastUpdatedText: '上次更新',
  },
  vite: {
    server: { host: true },
  },
})
