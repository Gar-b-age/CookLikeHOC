import { defineConfig } from 'vitepress'
import { autoNavigation } from './autoNavgation.ts'

const sidebar = autoNavigation('./cookbook');
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Cook Like HOC",
  description: "像老乡鸡那样做饭",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/soilzhu/cooklikehoc' }
    ]
  },

  // 临时处理，须在每个菜品分类文件夹下手动创建 index.md 文件
  ignoreDeadLinks: true
})
