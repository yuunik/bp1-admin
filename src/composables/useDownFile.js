import { getFullFilePath } from '@/utils/dataFormattedUtil.js'

const useDownFile = () => {
  return async (path) => {
    const res = await fetch(getFullFilePath(path))
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)

    const aElement = document.createElement('a')
    aElement.href = url
    aElement.download =
      typeof path === 'string' ? path.split('/').pop() : 'downloaded-file'
    aElement.click()
    URL.revokeObjectURL(url)
  }
}

export default useDownFile
