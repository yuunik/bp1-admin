/**
 * 批量修改 svg 文件，将 fill / stroke 固定颜色改为 currentColor
 * 使用方式：node scripts/convert-svg-color.js
 */

import fs from 'fs'
import path from 'path'

const iconsDir = path.resolve(process.cwd(), 'src/assets/icons')

function processSvgFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')

  // 匹配 fill="#xxxxxx" 或 fill='xxxx'，但排除 fill="none"
  content = content.replace(
    /fill=("|')(?!none)[^"']*\1/gi,
    'fill="currentColor"',
  )

  // 匹配 stroke="#xxxxxx" 或 stroke='xxxx'，但排除 stroke="none"
  content = content.replace(
    /stroke=("|')(?!none)[^"']*\1/gi,
    'stroke="currentColor"',
  )

  fs.writeFileSync(filePath, content, 'utf8')
  console.log(`✅ 已处理: ${path.basename(filePath)}`)
}

function walkDir(dir) {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      walkDir(fullPath)
    } else if (file.endsWith('.svg')) {
      processSvgFile(fullPath)
    }
  }
}

// 执行
walkDir(iconsDir)
console.log('🎉 所有 SVG 文件已处理完成')
