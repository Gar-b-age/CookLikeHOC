import { defineConfig } from 'vitepress'
import { generateNavAndSidebar } from './navSidebar.mjs'

const rootDir = process.cwd()
const { nav: navZh, sidebar: sidebarZh } = generateNavAndSidebar(rootDir, 'zh')
const { nav: navEn, sidebar: sidebarEn } = generateNavAndSidebar(rootDir, 'en')

export default defineConfig({
  lastUpdated: true,
  cleanUrls: true,
  base: '/CookLikeHOC/',
  ignoreDeadLinks: true,
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
          options: {
            locales: {
              root: {
                translations: {
                  button: {
                    buttonText: '搜索文档',
                    buttonAriaLabel: '搜索文档',
                  },
                  modal: {
                    noResultsText: '无法找到相关结果',
                    resetButtonTitle: '清除查询条件',
                    footer: {
                      selectText: '选择',
                      navigateText: '切换',
                    },
                  },
                },
              },
            },
          },
        },
        outline: [2, 3],
        docFooter: { prev: '上一页', next: '下一页' },
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
          options: {
            locales: {
              en: {
                translations: {
                  button: {
                    buttonText: 'Search Docs',
                    buttonAriaLabel: 'Search Docs',
                  },
                  modal: {
                    noResultsText: 'No results for',
                    resetButtonTitle: 'Clear search query',
                    footer: {
                      selectText: 'to select',
                      navigateText: 'to navigate',
                    },
                  },
                },
              },
            },
          },
        },
        outline: [2, 3],
        docFooter: { prev: 'Previous', next: 'Next' },
        lastUpdatedText: 'Last Updated',
      },
    },
  },
  vite: {
    server: { host: true },
  },
})
