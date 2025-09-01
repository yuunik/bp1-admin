<script setup>
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

import BaseUpload from '@/components/BaseUpload.vue'
import { addMerchantApi } from '@/apis/userApi.js'
import { RouteName } from '@/utils/constantsUtil.js'
import { md5Encrypt } from '@/utils/md5Util.js'

// 商家表单信息
const workShopForm = reactive({
  email: '',
  name: '',
  password: '',
  operatingHours: '',
  address: '',
  postalCode: '',
  phoneCountry: '',
  phoneNumber: '',
  une: '',
  file: null,
})

const router = useRouter()

// 创建商家
const addWorkshop = async () => {
  if (!workShopForm.name || !workShopForm.email || !workShopForm.password) {
    // 必须填写,  姓名, 邮箱, 密码
    ElMessage.warning('Name, email, and password are required.')
    return
  }
  // 密码加密
  workShopForm.password = md5Encrypt(workShopForm.password)
  await addMerchantApi(workShopForm)
  // 提示
  ElMessage.success('Create successful')
  router.push({ name: RouteName.EXTERN })
}

// 获取文件
const handleGetLocalFile = (file) => (workShopForm.file = file)
</script>

<template>
  <section class="create-workshop-container flex flex-col gap-16">
    <div class="flex-between mx-32 h-32">
      <h3 class="heading-h2-20px-medium">Create Workshop</h3>
      <div class="flex h-32 gap-8">
        <el-button>Cancel</el-button>
        <el-button type="primary" @click="addWorkshop">Create</el-button>
      </div>
    </div>
    <el-divider />
    <!-- 商家基础信息 -->
    <div class="mx-32 mt-16 flex flex-col gap-24">
      <!-- 文件上传组件 -->
      <base-upload
        default-avatar-text="W"
        @get-local-file="handleGetLocalFile"
      />
      <!-- 分割线 -->
      <el-divider />
      <!-- 商家信息 -->
      <el-form label-width="112px" label-position="left" :model="workShopForm">
        <el-form-item label="Email">
          <el-input
            placeholder="Enter"
            class="w-272!"
            v-model="workShopForm.email"
          />
        </el-form-item>
        <el-form-item label="Name">
          <el-input
            placeholder="Enter"
            class="w-272!"
            show-word-limit
            maxlength="20"
            type="text"
            v-model="workShopForm.name"
          />
        </el-form-item>
        <el-form-item label="Password">
          <el-input
            placeholder="Enter"
            class="w-272!"
            show-password
            type="password"
            v-model="workShopForm.password"
          />
        </el-form-item>
      </el-form>
    </div>
    <!-- 商家详细信息 -->
    <div class="flex flex-col gap-8">
      <!-- 标题 -->
      <h4
        class="row-center heading-body-large-body-14px-medium text-neutrals-off-black mx-32 h-24"
      >
        Workshop Details
      </h4>
      <!-- 分割线 -->
      <el-divider />
      <el-form
        :model="workShopForm"
        label-width="112px"
        label-position="left"
        class="mx-32"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Operating Hours">
              <el-input
                v-model="workShopForm.operatingHours"
                placeholder="Enter"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Phone Country">
              <el-input
                v-model="workShopForm.phoneCountry"
                placeholder="Enter"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Phone Number">
              <el-input
                v-model="workShopForm.phoneNumber"
                placeholder="Enter"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Postal Code">
              <el-input
                v-model="workShopForm.postalCode"
                style="width: 100%"
                placeholder="Enter"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="House No. & Street Name">
              <el-input
                v-model="workShopForm.address"
                style="width: 100%"
                placeholder="Enter"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="UNE">
              <el-input v-model="workShopForm.une" placeholder="Enter" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </section>
</template>

<style scoped lang="scss">
:deep(.el-tabs__header) {
  // tabs 头部栏margin重置
  margin: 0 !important;
  // tabs 头部栏底部边框重置
  border: none !important;
}

.create-workshop-container :deep(.el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
}

.create-workshop-container :deep(.el-input__wrapper::after) {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background-color: var(--el-input-border-color, var(--el-border-color));
  pointer-events: none;
}
</style>
