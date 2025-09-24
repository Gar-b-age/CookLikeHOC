import { defineConfig } from 'vitepress'
import path from 'node:path'
import { generateNavAndSidebar } from './navSidebar'

const rootDir = process.cwd()
const vercelOutDir = path.resolve(rootDir, '.vercel/output/static')
const { nav: navZh, sidebar: sidebarZh } = generateNavAndSidebar(rootDir, 'zh')
const { nav: navEn, sidebar: sidebarEn } = generateNavAndSidebar(rootDir, 'en')

export default defineConfig({
  outDir: vercelOutDir,
  title: 'CookLikeHOC',
  description: '像老乡鸡那样做饭',
  lastUpdated: true,
  cleanUrls: true,
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/',
      title: 'CookLikeHOC',
      description: '像老乡鸡那样做饭',
      themeConfig: {
        i18nRouting: false,
        logo: '/logo.png',
        nav: [
          { text: '首页', link: '/' },
          ...navZh,
          { text: 'GitHub', link: 'https://github.com/Gar-b-age/CookLikeHOC' },
        ],
        sidebar: sidebarZh,
        localeLinks: {
          text: '选择语言',
          items: [
            { text: '简体中文', link: '/' },
            { text: 'English', link: '/en/' },
          ],
        },
        search: {
          provider: 'local',
        },
        outline: [2, 3],
        docFooter: {
          prev: '上一页',
          next: '下一页',
        },
        lastUpdatedText: '上次更新',
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: 'CookLikeHOC',
      description: 'Cook like Home Original Chicken',
      themeConfig: {
        i18nRouting: false,
        logo: '/logo.png',
        nav: [
          { text: 'Home', link: '/en/' },
          ...navEn,
          { text: 'GitHub', link: 'https://github.com/Gar-b-age/CookLikeHOC' },
        ],
        sidebar: sidebarEn,
        localeLinks: {
          text: 'Languages',
          items: [
            { text: '简体中文', link: '/' },
            { text: 'English', link: '/en/' },
          ],
        },
        search: {
          provider: 'local',
        },
        outline: [2, 3],
        docFooter: {
          prev: 'Previous',
          next: 'Next',
        },
        lastUpdatedText: 'Last Updated',
      },
    },
  },
  vite: {
    server: { host: true },
  },
})
