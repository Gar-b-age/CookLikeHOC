import { defineConfig } from 'vitepress';
import { generateNavAndSidebar } from './navSidebar';

const { nav: zhNav, sidebar: zhSidebar } = generateNavAndSidebar(process.cwd());
const { nav: enNav, sidebar: enSidebar } = generateNavAndSidebar(
  process.cwd(),
  'en'
);

export default defineConfig({
  lang: 'zh-CN',
  title: 'CookLikeHOC',
  description: '像老乡鸡那样做饭',
  lastUpdated: true,
  cleanUrls: true,
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: '目录', items: [...zhNav] },
      { text: 'GitHub', link: 'https://github.com/Gar-b-age/CookLikeHOC' },
    ],
    sidebar: zhSidebar,
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
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
    },
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      title: 'CookLikeHOC',
      description: 'Cook like HOC - Traditional Chinese recipes',
      themeConfig: {
        nav: [
          { text: 'Directory', items: [...enNav] },
          { text: 'GitHub', link: 'https://github.com/Gar-b-age/CookLikeHOC' },
        ],
        sidebar: enSidebar,
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
});
