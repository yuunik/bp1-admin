/**
 * 批量修改 svg 文件，将 fill / stroke 固定颜色改为 currentColor
 * 并将文件名转为 kebab-case（大写变小写并加 -）
 * 使用方式：node scripts/formatSvgIcon.js
 */

import fs from 'fs'
import path from 'path'

const iconsDir = path.resolve(process.cwd(), 'src/assets/icons')

/**
 * 将文件名转换成 kebab-case，例如：
 * PersonGender.svg -> person-gender.svg
 */
const toKebabCaseFileName = (fileName) => {
  return fileName
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // 小写+大写 → 加中划线
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2') // 连续大写开头的单词断开
    .toLowerCase()
}

const processSvgFile = (filePath) => {
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

const walkDir = (dir) => {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      walkDir(fullPath)
    } else if (file.endsWith('.svg')) {
      // 检查文件名是否需要改成 kebab-case
      const kebabName = toKebabCaseFileName(file)
      let targetPath = fullPath
      if (file !== kebabName) {
        targetPath = path.join(dir, kebabName)
        fs.renameSync(fullPath, targetPath)
        console.log(`✏️ 重命名: ${file} → ${kebabName}`)
      }
      processSvgFile(targetPath)
    }
  }
}

// 执行
walkDir(iconsDir)
console.log('🎉 所有 SVG 文件已处理完成')
