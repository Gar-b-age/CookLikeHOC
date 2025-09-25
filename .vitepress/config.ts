import { defineConfig } from 'vitepress'
import { generateNavAndSidebar } from './navSidebar'

const { nav, sidebar } = generateNavAndSidebar(process.cwd())

export default defineConfig({
  lang: 'zh-CN',
  title: 'CookLikeHOC',
  description: '像老乡鸡那样做饭',
  head: [
    ['link', { rel: 'icon', href: '/logo2.png' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
  ],
  lastUpdated: true,
  cleanUrls: true,
  themeConfig: {
    logo: '/logo2.png',
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
