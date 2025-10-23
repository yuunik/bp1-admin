<script setup>
import { ref, reactive } from 'vue'

import { postOrderApi } from '@/apis/shareApi.js'

import PD1 from '@/assets/images/pd1_logo.png'
import SuccessIcon from '@/assets/specialIcons/check_one.svg'
import { ElMessage } from 'element-plus'

const orderForm = reactive({
  username: '',
  email: '',
  phoneNumber: '',
  deviceNumber: '1',
  notes: '',
  phoneCountry: '+65',
})

// 订单成功弹窗
const dialogSuccessPageVisible = ref(false)

// 加载状态
const loading = ref(false)

// 订单表单校验规则
const orderRules = reactive({
  username: [
    { required: true, message: 'Please enter your full name', trigger: 'blur' },
  ],
  email: [
    {
      required: true,
      message: 'Please enter your email address',
      trigger: 'blur',
    },

    {
      validator: (rule, value, callback) => {
        // 邮箱格式
        if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
          callback(new Error('Please enter a valid email address'))
          return
        }
        callback()
      },
    },
  ],
  phoneNumber: [
    {
      required: true,
      message: 'Please enter your phone number',
      trigger: 'blur',
    },
    {
      validator: (rule, value, callback) => {
        // 第一位数字必须为8或者9
        if (!/^[8-9]\d{7}$/.test(value)) {
          // 总共 8 位
          if (!/^\d{8}$/.test(value)) {
            callback(new Error('Please enter a valid phone number'))
            return
          }
          callback(new Error('The first digit must be 8 or 9'))
          return
        }

        callback()
      },
    },
  ],
  deviceNumber: [
    {
      required: true,
      message: 'Please enter the number of devices',
      trigger: 'blur',
    },
    // 只能输入数字
    {
      validator: (rule, value, callback) => {
        if (!/^\d+$/.test(value)) {
          callback(new Error('Please enter a valid number'))
          return
        }
        callback()
      },
    },
  ],
})

// 订单表单实例
const orderFormRef = ref(null)

// 下订单
const submitOrder = async () => {
  try {
    // 校验
    await orderFormRef.value.validate()
    // 加载中
    loading.value = true
    await postOrderApi({
      contactName: orderForm.username,
      contactEmail: orderForm.email,
      phoneCountry: orderForm.phoneCountry,
      phoneNumber: orderForm.phoneNumber,
      quantity: orderForm.deviceNumber,
      description: orderForm.notes,
    })
    // 订单成功弹窗
    dialogSuccessPageVisible.value = true
  } catch {
    // 网络错误, 请稍后再试
    ElMessage.fail('Network error, please try again later')
  } finally {
    // 加载完成
    loading.value = false
  }
}

// 再次下单
const handleOrderAgain = () => {
  // 重置表单
  orderForm.username = ''
  orderForm.email = ''
  orderForm.phoneCountry = '+65'
  orderForm.phoneNumber = ''
  orderForm.deviceNumber = '1'
  orderForm.notes = ''
  dialogSuccessPageVisible.value = false
}
</script>

<template>
  <div v-if="!dialogSuccessPageVisible" class="flex h-full w-full flex-col">
    <header class="flex-center gap-4 py-16">
      <el-image :src="PD1" class="h-32 w-32" fit="cover" alt="PD1-Logo" />
      <h1 class="text-neutrals-off-black leading-23">
        <strong class="h2-20px-semibold">Order Information</strong>
      </h1>
    </header>
    <main class="pb-68 flex-1 px-20 pt-20">
      <el-scrollbar>
        <el-form
          :model="orderForm"
          :rules="orderRules"
          ref="orderFormRef"
          label-width="140px"
          label-position="top"
          class="el-form-item--h5"
          hide-required-asterisk
        >
          <el-form-item
            label="Full Name"
            prop="username"
            class="label-required"
          >
            <el-input
              v-model="orderForm.username"
              placeholder="Please enter your full name"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="Email Address"
            class="label-required"
            prop="email"
          >
            <el-input
              placeholder="example@email.com"
              v-model="orderForm.email"
              type="email"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="Phone No."
            class="label-required"
            prop="phoneNumber"
          >
            <el-select v-model="orderForm.phoneCountry" class="w-100! mr-8!">
              <el-option label="+65" value="+65" />
              <el-option label="+60" value="+60" />
              <el-option label="+62" value="+62" />
              <el-option label="+66" value="+66" />
              <el-option label="+86" value="+86" />
            </el-select>
            <el-input
              placeholder="Enter your phone number"
              v-model="orderForm.phoneNumber"
              clearable
              type="tel"
              class="flex-1!"
            />
          </el-form-item>
          <el-form-item
            label="No. of Devices"
            class="label-required"
            prop="deviceNumber"
          >
            <el-input
              placeholder="Enter device No."
              v-model="orderForm.deviceNumber"
              clearable
              type="number"
            />
          </el-form-item>
          <el-form-item label="Additional Notes (Optional)">
            <el-input
              type="textarea"
              placeholder="Any extra information?"
              v-model="orderForm.notes"
              rows="5"
              clearable
            />
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </main>
    <footer class="fixed inset-x-0 bottom-20 mx-20 py-8">
      <el-button
        type="primary"
        class="w-full! h-48! text-16!"
        @click="submitOrder"
      >
        Submit Order
      </el-button>
    </footer>
  </div>
  <div v-else class="flex-center h-full px-20 py-40">
    <div class="flex flex-col items-center gap-16">
      <el-image :src="SuccessIcon" class="h-80 w-80" fit="cover" />
      <h1 class="h1-24px-semibold text-neutrals-off-black mt-16">
        Thank You for Your Order
      </h1>
      <p class="h3-16px-regular text-neutrals-grey-4 text-align-center">
        Thank you for joining us at today’s event. We hope you had a wonderful
        time!
      </p>
      <el-button
        type="primary"
        class="mt-84! h-48! py-16! px-32! text-16! w-180!"
        :loading="loading"
        @click="handleOrderAgain"
      >
        Order again
      </el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-button) {
  /* 基础背景和边框 */
  --el-button-bg-color: #202834;
  --el-button-border-color: #202834;
  --el-button-text-color: #ffffff; /* 显式设置文字颜色 */

  /* 轮廓按钮的边框颜色（用于 plain 或 outline 按钮）*/
  --el-button-outline-color: #3a4252; /* 稍亮一点的灰色 */

  /* 按钮激活（按下）时的颜色 */
  --el-button-active-color: #ffffff;
  --el-button-active-bg-color: #181e28; /* 稍暗 */
  --el-button-active-border-color: #181e28;

  /* Hover 状态 */
  --el-button-hover-text-color: #ffffff;
  --el-button-hover-bg-color: #2a3240; /* 稍亮 */
  --el-button-hover-border-color: #2a3240;

  /* 链接按钮 hover 文字色（如果适用）*/
  --el-button-hover-link-text-color: #6b7d9a; /* 可选，若使用 link 类型 */

  /* Disabled 状态 */
  --el-button-disabled-text-color: #5a6270;
  --el-button-disabled-bg-color: #2c3442;
  --el-button-disabled-border-color: #2c3442;

  border-radius: 12px !important;
}
</style>
