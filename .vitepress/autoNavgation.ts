import fs from 'fs'
import type { DefaultTheme } from 'vitepress'

export const autoNavigation = (baseUrl: string): DefaultTheme.Sidebar => {
    const walk = (dir: string, callback: (path: string) => void) => {
        const files = fs.readdirSync(dir)
        files.forEach(file => {
            const path = `${dir}/${file}`
            const stat = fs.statSync(path)
            if (stat.isDirectory()) {
                walk(path, callback)
            } else {
                callback(path)
            }
        })
    }
    let sidebar: DefaultTheme.Sidebar = [];
    walk(baseUrl, (path) => {
        const relativePath = path.replace(/\.md$/, '')
        const parts = relativePath.split('/')
        parts.splice(0, 2)
        let current = sidebar
        parts.forEach((part, index) => {
            const find = current.find(item => item.text === part)
            if (find) {
                current = find.items || []
            } else {
                const item = {
                    text: part,
                    link: relativePath.replace('./', '/'),
                    items: []
                }
                current.push(item)
                current = item.items
            }
        })
    })
    return sidebar
}
