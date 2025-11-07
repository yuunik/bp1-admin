const downFile = {
  mounted(el, binding) {
    // 定义处理函数并挂到元素上，方便卸载时取到
    el.__downFileHandler__ = () => {
      // 获取传入的下载地址
      const url = binding.value

      // 非空校验
      if (!url) return

      // 创建隐藏的 a 标签
      const link = document.createElement('a')
      link.href = url

      // 设置下载文件名（可选）
      // const filename = url.split('/').pop()
      // link.download = filename || 'download'

      // 触发下载
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    el.addEventListener('click', el.__downFileHandler__)
  },
  unmounted(el) {
    // 移除监听函数
    el.removeEventListener('click', el.__downFileHandler__)
    delete el.__downFileHandler__
  },
}

export default downFile
