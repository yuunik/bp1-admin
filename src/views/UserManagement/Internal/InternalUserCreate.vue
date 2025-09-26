<script setup>
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

import { addManagerApi } from '@/apis/userApi.js'
import { RouteName } from '@/utils/constantsUtil.js'
import { md5Encrypt } from '@/utils/md5Util.js'

const internalUserForm = ref({
  email: '',
  name: '',
  password: '',
  role: 'Admin',
  confirmPassword: '',
})

const internalUserFormRules = reactive({
  email: [
    {
      required: true,
      message: 'Please input email',
      trigger: 'blur',
    },
    {
      type: 'email',
      message: 'Please input valid email',
      trigger: 'blur',
    },
  ],
  name: [
    {
      required: true,
      message: 'Please input name',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: 'Please input password',
      trigger: 'blur',
    },
  ],
  role: [
    {
      required: true,
      message: 'Please select role',
      trigger: 'change',
    },
  ],
  confirmPassword: [
    {
      required: true,
      message: 'Please input confirm password',
      trigger: 'blur',
    },
    {
      validator: (_, value, callback) => {
        if (value !== internalUserForm.value.password) {
          callback(new Error('Password does not match'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})

const passwordRef = ref(null)
const internalUserRef = ref(null)

const router = useRouter()

const readonlyInput = ref(true)

const isShowPassword = ref(false)

const isShowConfirmPassword = ref(false)

// 新增管理员
const createInternalUser = async () => {
  try {
    await internalUserRef.value.validate()
    internalUserForm.value.password = md5Encrypt(
      internalUserForm.value.password,
    )
    await addManagerApi(internalUserForm.value)
    ElMessage.success('Create internal user successfully')
    router.push({ name: RouteName.INTERNAL })
  } finally {
    internalUserForm.value.password = ''
    internalUserForm.value.confirmPassword = ''
  }
}

const inputChange = (e) => {
  readonlyInput.value = true
  setTimeout(() => {
    readonlyInput.value = false
  }, 50)
}

const inputClick = (e) => {
  readonlyInput.value = true
  passwordRef.value.blur()
}

const cancelReadOnly = () => {
  readonlyInput.value = true
  setTimeout(() => {
    readonlyInput.value = false
  }, 50)
}

const setReadOnly = () => {
  readonlyInput.value = true
}

const showRealPassword = () => {
  isShowPassword.value = !isShowPassword.value
  setTimeout(() => {
    passwordRef.value.blur()
  }, 100)
}
</script>

<template>
  <section class="flex flex-col gap-16">
    <div class="flex-between mx-32 h-32">
      <h3 class="heading-h2-20px-medium text-neutrals-off-black">
        Create Internal User
      </h3>
      <div class="flex h-32 gap-8">
        <el-button @click="$router.push({ name: RouteName.INTERNAL })">
          Cancel
        </el-button>
        <el-button type="primary" @click="createInternalUser">Create</el-button>
      </div>
    </div>
    <el-divider />
    <el-form
      :model="internalUserForm"
      label-width="140px"
      label-position="left"
      class="form-container mx-32"
      :rules="internalUserFormRules"
      ref="internalUserRef"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Email" prop="email">
            <el-input
              v-model="internalUserForm.email"
              placeholder="Enter email"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Name" prop="name">
            <el-input
              v-model="internalUserForm.name"
              placeholder="Enter name"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Password" prop="password">
            <el-input
              ref="passwordRef"
              v-model="internalUserForm.password"
              style="width: 100%"
              placeholder="Enter password"
              :type="isShowPassword ? 'text' : 'password'"
              autocomplete="new-password"
              @focus="cancelReadOnly"
              @blur="setReadOnly"
              @input="inputChange"
              :readonly="readonlyInput"
              @mousedown.native="inputClick"
            >
              <template #suffix>
                <i
                  :class="`text-24 cursor-pointer ${isShowPassword ? 'icon-typespassword' : 'icon-eye-off-line'}`"
                  @click="showRealPassword"
                />
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <!--<el-col :span="12">-->
        <!--  <el-form-item label="Role" prop="role">-->
        <!--    <el-select-->
        <!--      v-model="internalUserForm.role"-->
        <!--      placeholder="Select role"-->
        <!--      style="width: 100%"-->
        <!--      read-only-->
        <!--    >-->
        <!--      <el-option label="Admin" value="Admin" />-->
        <!--      <el-option label="User" value="User" />-->
        <!--    </el-select>-->
        <!--  </el-form-item>-->
        <!--</el-col>-->
        <el-col :span="12">
          <el-form-item label="Confirm Password" prop="confirmPassword">
            <el-input
              v-model="internalUserForm.confirmPassword"
              placeholder="Enter confirm password"
              :type="isShowConfirmPassword ? 'text' : 'password'"
            >
              <template #suffix>
                <i
                  :class="`text-24 cursor-pointer ${isShowConfirmPassword ? 'icon-typespassword' : 'icon-eye-off-line'}`"
                  @click="isShowConfirmPassword = !isShowConfirmPassword"
                />
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>

<style scoped lang="scss">
.form-container :deep(.el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
}

.form-container :deep(.el-input__wrapper::after) {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background-color: var(--el-input-border-color, var(--el-border-color));
  pointer-events: none;
}

.form-container :deep(.el-select__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
}

.form-container :deep(.el-select__wrapper::after) {
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
