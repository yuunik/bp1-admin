<script setup>
import { useRouter } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'

import BasePagination from '@/components/BasePagination.vue'
import BaseFilterInput from '@/components/BaseFilterInput.vue'
import BaseDialog from '@/components/BaseDialog.vue'
import { postOrderApi } from '@/apis/shareApi.js'
import { ElMessage } from 'element-plus'

const router = useRouter()
const onRowClick = (_, column) => {
  const { no } = column
  if (no === 0 || no === 5) {
    return
  }
  router.push({ name: 'Internal Manage', params: { id: '12432314231' } })
}

const orderDataList = ref([
  {
    id: 1,
    orderNo: 'ORD-00014',
    customer: 'Rhode',
    source: 'Web',
    obd: 2,
    status: 'Request Return',
    amount: 1000.0,
    orderDate: '15 May 2025 9:00 am',
  },
  {
    id: 2,
    orderNo: 'ORD-00013',
    customer: 'Rhode',
    source: 'Web',
    obd: 2,
    status: 'Request Replace',
    amount: 1000.0,
    orderDate: '15 May 2025 9:00 am',
  },
  {
    id: 3,
    orderNo: 'ORD-00020',
    customer: 'Rhode',
    source: 'Web',
    obd: 2,
    status: 'To Ship',
    amount: 1000.0,
    orderDate: '15 May 2025 9:30 am',
  },
  {
    id: 4,
    orderNo: 'ORD-00019',
    customer: 'Rhode',
    source: 'App',
    obd: 2,
    status: 'Shipped',
    amount: 1000.0,
    orderDate: '15 May 2025 9:00 am',
  },
  {
    id: 5,
    orderNo: 'ORD-00018',
    customer: 'Rhode',
    source: 'App',
    obd: 2,
    status: 'Completed',
    amount: 1000.0,
    orderDate: '15 May 2025 9:00 am',
  },
  {
    id: 6,
    orderNo: 'ORD-00017',
    customer: 'Rhode',
    source: 'App',
    obd: 2,
    status: 'Refunded',
    amount: 1000.0,
    orderDate: '15 May 2025 9:00 am',
  },
  {
    id: 7,
    orderNo: 'ORD-00016',
    customer: 'Rhode',
    source: 'App',
    obd: 2,
    status: 'Completed',
    amount: 1000.0,
    orderDate: '15 May 2025 9:00 am',
  },
  {
    id: 8,
    orderNo: 'ORD-00015',
    customer: 'Rhode',
    source: 'Web',
    obd: 2,
    status: 'Cancelled',
    amount: 1000.0,
    orderDate: '15 May 2025 9:00 am',
  },
  {
    id: 9,
    orderNo: 'ORD-00012',
    customer: 'Rhode',
    source: 'Web',
    obd: 2,
    status: 'Completed',
    amount: 1000.0,
    orderDate: '15 May 2025 9:00 am',
  },
  {
    id: 10,
    orderNo: 'ORD-00011',
    customer: 'Rhode',
    source: 'Web',
    obd: 2,
    status: 'Completed',
    amount: 1000.0,
    orderDate: '15 May 2025 9:00 am',
  },
  {
    id: 11,
    orderNo: 'ORD-00010',
    customer: 'Rhode',
    source: 'Web',
    obd: 2,
    status: 'Completed',
    amount: 1000.0,
    orderDate: '15 May 2025 9:00 am',
  },
  {
    id: 12,
    orderNo: 'ORD-00009',
    customer: 'Rhode',
    source: 'Web',
    obd: 2,
    status: 'Completed',
    amount: 1000.0,
    orderDate: '15 May 2025 9:00 am',
  },
  {
    id: 13,
    orderNo: 'ORD-00008',
    customer: 'Rhode',
    source: 'Web',
    obd: 2,
    status: 'Completed',
    amount: 1000.0,
    orderDate: '15 May 2025 8:30 am',
  },
  {
    id: 14,
    orderNo: 'ORD-00007',
    customer: 'Rhode',
    source: 'Web',
    obd: 2,
    status: 'Completed',
    amount: 1000.0,
    orderDate: '15 May 2025 8:30 am',
  },
  {
    id: 15,
    orderNo: 'ORD-00006',
    customer: 'Rhode',
    source: 'Web',
    obd: 2,
    status: 'Completed',
    amount: 1000.0,
    orderDate: '15 May 2025 8:30 am',
  },
])

const pageQueryParams = ref({
  currentPage: 0,
  total: 0,
  pageSize: 15,
})

// 搜索文本
const searchText = ref('')

// 新增订单弹窗
const dialogAddOrderVisible = ref(true)

// 订单表单
const orderForm = reactive({
  username: '',
  email: '',
  phoneNumber: '',
  deviceNumber: '1',
  notes: '',
  phoneCountry: '+65',
})

// 订单表单实例
const orderFormRef = ref(null)

const refresh = async () => {}

// 搜索
const handleSearch = useDebounceFn(async () => refresh(), 500)

// 新增订单
const handleAddOrder = async () => {
  try {
    // 校验
    await orderFormRef.value.validate()
    await postOrderApi({
      contactName: orderForm.username,
      contactEmail: orderForm.email,
      phoneCountry: orderForm.phoneCountry,
      phoneNumber: orderForm.phoneNumber,
      quantity: orderForm.deviceNumber,
      description: orderForm.notes,
    })
    // 提示
    ElMessage.success('Order created successfully')
  } catch {
    // 网络错误, 请稍后再试
    ElMessage.fail('Network error, please try again later')
  } finally {
    // 关闭新增订单弹窗
    dialogAddOrderVisible.value = false
  }
}

// 关闭新增订单弹窗
const handleCloseAddOrder = () => {
  // 重置表单
  orderForm.username = ''
  orderForm.email = ''
  orderForm.phoneCountry = '+65'
  orderForm.phoneNumber = ''
  orderForm.deviceNumber = '1'
  orderForm.notes = ''
  dialogAddOrderVisible.value = false
}
</script>

<template>
  <section class="flex h-full flex-col gap-16">
    <!-- Header -->
    <div class="flex-between mx-32 h-32">
      <h3 class="heading-h2-20px-medium text-neutrals-off-black">
        Activity Order
      </h3>
      <el-button type="primary">Create</el-button>
    </div>
    <!-- Search -->
    <div class="flex-between mx-32 flex h-24 gap-20">
      <div class="flex gap-8">
        <!-- 状态搜索 -->
        <el-dropdown>
          <span
            class="border-1 neutrals-grey-3 default-transition flex cursor-pointer gap-5 rounded-full border-solid px-8 py-4"
          >
            Source
            <i class="icon-typesdropdown" />
          </span>
          <template #dropdown>
            <div class="w-190 h-93 flex flex-col gap-8 px-6 py-12">
              <div class="flex-between">
                <span>Status</span>
                <el-button text>Clear</el-button>
              </div>
              <el-checkbox-group>
                <el-checkbox value="1">Active</el-checkbox>
                <el-checkbox value="2">Disabled</el-checkbox>
              </el-checkbox-group>
            </div>
          </template>
        </el-dropdown>
        <!-- 状态搜索 -->
        <el-dropdown>
          <span
            class="border-1 neutrals-grey-3 default-transition flex cursor-pointer gap-5 rounded-full border-solid px-8 py-4"
          >
            Status
            <i class="icon-typesdropdown" />
          </span>
          <template #dropdown>
            <div class="w-190 h-93 flex flex-col gap-8 px-6 py-12">
              <div class="flex-between">
                <span>Role</span>
                <el-button text>Clear</el-button>
              </div>
              <el-checkbox-group>
                <el-checkbox value="1">Admin</el-checkbox>
                <el-checkbox value="2">Support</el-checkbox>
                <el-checkbox value="2">Technician</el-checkbox>
              </el-checkbox-group>
            </div>
          </template>
        </el-dropdown>
      </div>
      <!-- 输入搜索栏 -->
      <base-filter-input v-model="searchText" @input-change="handleSearch" />
    </div>
    <!-- Divider -->
    <el-divider />
    <!-- Table -->
    <div class="mx-32 flex flex-1 flex-col overflow-hidden pb-32">
      <el-table :data="orderDataList" class="flex-1">
        <!-- 复选框列 -->
        <el-table-column type="selection" />

        <!-- 订单号 -->
        <el-table-column prop="orderNo" label="Order No." sortable />

        <!-- 客户 -->
        <el-table-column prop="customer" label="Customer" />

        <!-- 来源 -->
        <el-table-column prop="source" label="Source" />

        <!-- OBD -->
        <el-table-column prop="obd" label="OBD" sortable />

        <!-- 订单状态 -->
        <el-table-column prop="status" label="Order Status" />

        <!-- 金额 -->
        <el-table-column prop="amount" label="Amount (SGD)" sortable>
          <template #default="{ row }">
            {{
              row.amount.toLocaleString('en-SG', { minimumFractionDigits: 2 })
            }}
          </template>
        </el-table-column>

        <!-- 订单日期 -->
        <el-table-column prop="orderDate" label="Order Date" sortable />

        <!-- 操作 -->
        <el-table-column align="center">
          <template #default>
            <i class="icon-more-2-line cursor-pointer" />
          </template>
        </el-table-column>
      </el-table>
      <base-pagination v-model="pageQueryParams" />
    </div>
  </section>
  <!-- 新增订单的弹窗 -->
  <base-dialog
    v-model="dialogAddOrderVisible"
    title="Add Order"
    @cancel="handleCloseAddOrder"
    @confirm="handleAddOrder"
  >
    <template #content>
      <el-form
        :model="orderForm"
        :rules="orderRules"
        ref="orderFormRef"
        label-width="140px"
        label-position="top"
        class="el-form-item--h5"
        hide-required-asterisk
      >
        <el-form-item label="Full Name" prop="username" class="label-required">
          <el-input
            v-model="orderForm.username"
            placeholder="Please enter your full name"
            clearable
          />
        </el-form-item>
        <el-form-item label="Email Address" class="label-required" prop="email">
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
    </template>
  </base-dialog>
</template>

<style scoped lang="scss"></style>
