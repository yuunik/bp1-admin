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

  // 文件名
  const uploadFileName = ref('')

  // 上传图片的基本校验
  const handleValidateImageUpload = (file) => {
    const { raw, name } = file
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
    // 文件名
    uploadFileName.value = name
  }

  // 上传图片的校验
  const beforeAvatarUpload = (rawFile) => {
    if (rawFile.type !== 'image/jpeg') {
      ElMessage.error('Avatar picture must be JPG format!')
      return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
      ElMessage.error('Avatar picture size can not exceed 2MB!')
      return false
    }
    return true
  }

  return {
    localFilePath,
    uploadFile,
    uploadFileName,
    handleValidateImageUpload,
    beforeAvatarUpload,
  }
}

export default useFileUpload
