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

// 商家表单信息校验
const workShopFormRules = reactive({
  name: [
    {
      required: true,
      message: 'Please enter your name',
      trigger: 'blur',
    },
  ],
  postalCode: [
    // 只能输入数字
    {
      validator(rule, value, callback) {
        if (value && !/^\d+$/.test(value)) {
          callback(new Error('Please enter a valid postal code'))
        } else {
          callback()
        }
      },
    },
  ],
  phoneNumber: [
    // 只能输入数字
    {
      validator(rule, value, callback) {
        if (value && !/^\d+$/.test(value)) {
          callback(new Error('Please enter a valid phone number'))
        } else {
          callback()
        }
      },
    },
  ],
  une: [
    {
      required: true,
      message: 'Please enter your UNE',
      trigger: 'blur',
    },
  ],
})

// 商家表单
const workShopFormRef = ref(null)
const workShopFormRef2 = ref(null)
const passwordRef = ref(null)

// 是否显示密码
const readonlyInput = ref(true)
const isShowPassword = ref(false)

const router = useRouter()

// 创建商家
const addWorkshop = async () => {
  // 表单信息校验
  await Promise.all([
    workShopFormRef.value.validate(),
    workShopFormRef2.value.validate(),
  ])
  if (!workShopForm.name) {
    // 必须填写,  姓名, 邮箱, 密码
    ElMessage.warning('Name are required.')
    return
  }
  if (workShopForm.email && !workShopForm.password) {
    // 必须填写,  姓名, 邮箱, 密码
    ElMessage.warning('Email and password are required.')
    return
  }
  if (!workShopForm.email && workShopForm.password) {
    // 必须填写,  姓名, 邮箱, 密码
    ElMessage.warning('Email and password are required.')
    return
  }
  // 密码加密
  workShopForm.password &&
    (workShopForm.password = md5Encrypt(workShopForm.password))
  await addMerchantApi(workShopForm)
  // 提示
  ElMessage.success('Create successful')
  router.push({ name: RouteName.EXTERN })
}

// 获取文件
const handleGetLocalFile = (file) => (workShopForm.file = file)

const inputChange = (e) => {
  readonlyInput.value = true;
  setTimeout(() => {
    readonlyInput.value = false;
  }, 50)
}

const inputClick = (e) => {
  passwordRef.value.blur();
}

const cancelReadOnly = () => {
  readonlyInput.value = true;
  setTimeout(() => {
    readonlyInput.value = false;
  }, 50)
}

const setReadOnly = () => {
  readonlyInput.value = true;
}

const showRealPassword = () => {
  isShowPassword.value = !isShowPassword.value;
  setTimeout(() => {
    passwordRef.value.blur();
  }, 100)
}

</script>

<template>
  <section class="create-workshop-container flex flex-col gap-16">
    <div class="flex-between mx-32 h-32">
      <h3 class="heading-h2-20px-medium">Create Workshop</h3>
      <div class="flex h-32 gap-8">
        <el-button @click="$router.go(-1)">Cancel</el-button>
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
      <el-form
        label-width="112px"
        label-position="left"
        :model="workShopForm"
        :rules="workShopFormRules"
        ref="workShopFormRef"
      >
        <el-form-item label="Email">
          <el-input
            placeholder="Enter"
            class="w-272!"
            v-model="workShopForm.email"
            autocomplete="new-email"
          />
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input
            placeholder="Enter"
            class="w-272!"
            show-word-limit
            maxlength="20"
            type="text"
            v-model="workShopForm.name"
            autocomplete="new-name"
          />
        </el-form-item>
        <el-form-item label="Password">
          <el-input
            ref="passwordRef"
            placeholder="Enter"
            class="w-272! pwd-container"
            :type="isShowPassword ? 'text' : 'password'"
            v-model="workShopForm.password"
            autocomplete="new-password"
            @focus="cancelReadOnly"
            @blur="setReadOnly"
            @input="inputChange"
            :readonly="readonlyInput"
            @click.self="inputClick"
            name="password"
          >
            <template #suffix>
              <i
                :class="`text-24 cursor-pointer ${isShowPassword ? 'icon-typespassword' : 'icon-eye-off-line'}`"
                @click="showRealPassword"
              />
            </template>
          </el-input>
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
        class="work-shop-form-container mx-32"
        :rules="workShopFormRules"
        ref="workShopFormRef2"
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
            <el-form-item label="Phone Country" prop="phoneCountry">
              <el-select v-model="workShopForm.phoneCountry">
                <el-option label="+65" value="+65" />
                <el-option label="+60" value="+60" />
                <el-option label="+62" value="+62" />
                <el-option label="+66" value="+66" />
                <el-option label="+86" value="+86" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Phone Number" prop="phoneNumber">
              <el-input
                v-model="workShopForm.phoneNumber"
                placeholder="Enter"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Postal Code" prop="postalCode">
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

.create-workshop-container {
  // 重置下拉框样式
  :deep(.el-select__wrapper) {
    background-color: $neutrals-off-white;
    box-shadow: none !important;
    border: none !important;
    padding: 0 !important;
  }

  :deep(.el-select__wrapper::after) {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background-color: var(--el-input-border-color, var(--el-border-color));
    pointer-events: none;
  }
}
</style>
