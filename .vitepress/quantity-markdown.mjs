// markdown-it 插件：把菜谱正文中的「数字 + 单位」包裹成
// <span class="qty" data-qty="…" data-unit="…">…</span>，供前端按比例缩放。
// 不修改任何源 .md 文件。

// 可缩放的重量/体积单位（国家标准以 g 为主）与计数单位。
// 注意：长度(cm)、热量(Kcal)、营养(mg)、包装单位(包/袋/盒/瓶)、时间温度等不缩放。
const SCALE_UNITS = [
  '千克', '毫克', '毫升',
  'kg', 'mg', 'ml',
  '克', '升', '斤', '两',
  '个', '只', '片', '根', '块', '瓣', '朵', '条', '份',
  '颗', '粒', '段', '节', '勺', '匙', '滴', '杯', '碗', '把',
  'g', 'l', 'L',
].join('|')

// 匹配「数字 + (可选空白) + 单位」，且单位后不能紧跟英文字母（避免误匹配英文单词）。
const QUANTITY_RE_SOURCE = `(\\d+(?:\\.\\d+)?)(\\s*)(${SCALE_UNITS})(?![a-zA-Z])`

function renderWrapped(content, escapeHtml) {
  const re = new RegExp(QUANTITY_RE_SOURCE, 'g')
  let out = ''
  let last = 0
  let matched = false
  let m
  while ((m = re.exec(content)) !== null) {
    matched = true
    out += escapeHtml(content.slice(last, m.index))
    const num = m[1]
    const gap = m[2]
    const unit = m[3]
    out += `<span class="qty" data-qty="${num}" data-unit="${escapeHtml(gap + unit)}">${escapeHtml(num + gap + unit)}</span>`
    last = m.index + m[0].length
  }
  if (!matched) return null
  out += escapeHtml(content.slice(last))
  return out
}

export function quantityMarkdownPlugin(md) {
  const escapeHtml = md.utils.escapeHtml

  md.core.ruler.push('scale-quantity', (state) => {
    let inTable = false
    for (const token of state.tokens) {
      if (token.type === 'table_open') {
        inTable = true
      } else if (token.type === 'table_close') {
        inTable = false
      } else if (token.type === 'inline' && !inTable && token.children) {
        for (const child of token.children) {
          if (child.type !== 'text') continue
          const html = renderWrapped(child.content, escapeHtml)
          if (html === null) continue
          child.type = 'html_inline'
          child.content = html
        }
      }
    }
    return true
  })
}
