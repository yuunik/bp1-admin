/**
 * 文件上传
 * @param file  文件
 * @returns {*}
 */
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const useFileUpload = () => {
  // 文件的本地路径
  const localFilePath = ref('')

  // 待上传的文件
  const uploadFile = ref(null)

  // 上传图片的基本校验
  const handleValidateImageUpload = (file) => {
    const { raw } = file
    // 文件类型校验
    const isImage = raw.type.startsWith('image/')
    if (!isImage) {
      // 不是图片, 则提示
      ElMessage.error('Please upload an image file')
      return
    }
    // 记录文件路径
    localFilePath.value = URL.createObjectURL(raw)
    // 记录待上传的文件
    uploadFile.value = raw
  }

  return {
    localFilePath,
    uploadFile,
    handleValidateImageUpload,
  }
}

export default useFileUpload
