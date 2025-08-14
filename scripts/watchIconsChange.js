import chokidar from 'chokidar'
import { exec } from 'child_process'
import path from 'path'

const iconsDir = path.resolve(process.cwd(), 'src/assets/icons')

const runConvert = () => {
  console.log('🔄 检测到 SVG 变化，正在执行转换脚本...')
  exec('node scripts/formatSvgIcon.js', (err, stdout, stderr) => {
    if (err) {
      console.error('❌ 转换出错:', err)
      return
    }
    console.log(stdout)
    if (stderr) console.error(stderr)
  })
}

console.log(`👀 正在监听: ${iconsDir}`)
const watcher = chokidar.watch(`${iconsDir}/**/*.svg`, {
  ignoreInitial: true,
})

// 监听新增或修改
watcher.on('add', runConvert).on('change', runConvert)
