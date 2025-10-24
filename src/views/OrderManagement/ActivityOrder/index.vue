<script setup>
import { useRouter } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'
import { ElMessage } from 'element-plus'

import BasePagination from '@/components/BasePagination.vue'
import BaseDialog from '@/components/BaseDialog.vue'
import { postOrderApi } from '@/apis/shareApi.js'
import { deleteActiveOrderApi, getActiveOrderListApi } from '@/apis/orderApi.js'
import { useSort } from '@/composables/useSort.js'
import { getDateWithDDMMMYYYYhhmma } from '@/utils/dateUtil.js'
import BaseFilterInput from '@/components/BaseFilterInput.vue'

const router = useRouter()

const onRowClick = (_, column) => {
  const { no } = column
  if (no === 0 || no === 5) {
    return
  }
  router.push({ name: 'Internal Manage', params: { id: '12432314231' } })
}

// 订单数据
const orderDataList = ref([])

// 分页查询条件
const pagination = reactive({
  currentPage: 0,
  pageSize: 15,
  total: 0,
})

// 搜索文本
const searchText = ref('')

// 新增订单弹窗
const dialogAddOrderVisible = ref(false)

// 订单表单
const orderForm = reactive({
  username: '',
  email: '',
  phoneNumber: '',
  deviceNumber: '1',
  notes: '',
  phoneCountry: '+65',
})

// 订单列表
const orderList = ref([])

// 订单表单实例
const orderFormRef = ref(null)

// 排序参数
const sortParams = reactive({
  sort: '',
  sortBy: '',
})

// 删除弹窗
const dialogConfirmDeleteVisible = ref(false)

// 所选中的订单信息
const selectedRow = ref({})

// 删除提示信息
const deleteContent = ref('')

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
        const country = orderForm.phoneCountry // 获取国家区号

        // 先检查是否为纯数字（不含 + 或空格等）
        if (!/^\d+$/.test(value)) {
          callback(new Error('Phone number must contain only digits'))
          return
        }

        // 根据国家区号进行校验
        switch (country) {
          case '+65': // Singapore
            // 8位，以8或9开头
            if (!/^[8-9]\d{7}$/.test(value)) {
              callback(
                new Error(
                  'Singapore number must be 8 digits and start with 8 or 9',
                ),
              )
              return
            }
            break

          case '+60': // Malaysia
            // 常见格式：10-11位，以01开头（如 012-3456789）
            // 用户通常输入本地格式（带0），如 0123456789（10位）或 01112345678（11位）
            if (!/^01\d{8,9}$/.test(value)) {
              callback(
                new Error(
                  'Malaysia number must start with 01 and be 10-11 digits',
                ),
              )
              return
            }
            break

          case '+62': // Indonesia
            // 本地格式通常以 08 开头，总长 10-12 位（如 081234567890）
            // 国际格式去掉 0，但这里假设用户输入的是本地号码（带0）
            if (!/^08\d{8,10}$/.test(value)) {
              callback(
                new Error(
                  'Indonesia number must start with 08 and be 10-12 digits',
                ),
              )
              return
            }
            break

          case '+66': // Thailand
            // 本地格式通常以 0 开头，总长 10 位（如 0812345678）
            // 常见前缀：06, 08, 09
            if (!/^0[689]\d{8}$/.test(value)) {
              callback(
                new Error(
                  'Thailand number must be 10 digits and start with 06, 08 or 09',
                ),
              )
              return
            }
            break

          case '+86': // China
            // 11位，以1开头（移动/联通/电信）
            if (!/^1[3-9]\d{9}$/.test(value)) {
              callback(
                new Error('China number must be 11 digits and start with 1'),
              )
              return
            }
            break

          default:
            // 如果未指定支持的国家，可选择跳过校验或提示
            // 这里选择允许通过（或你也可以要求必须是支持的国家）
            break
        }

        callback() // 校验通过
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
    // 刷新页面
    refresh()
  } catch {
    // 网络错误, 请稍后再试
    ElMessage.error('Network error, please try again later')
  } finally {
    // 关闭新增订单弹窗
    handleCloseAddOrder()
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

// 获取订单列表
const getOrderList = async () => {
  const { data, count } = await getActiveOrderListApi({
    searchKey: searchText.value,
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
    sort: sortParams.sort,
    sortBy: sortParams.sortBy,
  })
  orderDataList.value = data
  pagination.total = count
}

// 排序查询
const sort = useSort(sortParams, () => getOrderList())

// 当单元格 hover 进入时会触发该事件
// const handleCellMouseEnter = (row) => (row.isHover = true)

// 当单元格 hover 离开时会触发该事件
// const handleCellMouseLeave = (row) => (row.isHover = false)

// 刷新页面
const refresh = () => {
  if (pagination.currentPage === 0) {
    return getOrderList()
  }
  pagination.currentPage = 0
}

// 打开删除确认弹窗
const openConfirmDeleteDialog = (row) => {
  selectedRow.value = row
  // 记录删除信息
  deleteContent.value = `Are you sure you want to delete the ${selectedRow.value.orderNo} order? Once deleted, it cannot be recovered.`
  dialogConfirmDeleteVisible.value = true
}

// 删除订单
const handleDeleteVersionControl = async () => {
  try {
    await deleteActiveOrderApi(selectedRow.value.id)
    // 提示
    ElMessage.success('Delete successfully')
    refresh()
  } finally {
    // 关闭删除确认弹窗
    dialogConfirmDeleteVisible.value = false
  }
}

// 监听 pagination.currentPage, 自动发起查询
watch(
  () => pagination.currentPage,
  () => getOrderList,
)

// 获取订单列表
getOrderList()
</script>

<template>
  <section class="flex h-full flex-col gap-16">
    <!-- Header -->
    <div class="flex-between mx-32 h-32">
      <h3 class="heading-h2-20px-medium text-neutrals-off-black">
        Activity Order
      </h3>
      <el-button type="primary" @click="dialogAddOrderVisible = true">
        Create
      </el-button>
    </div>
    <!-- Search -->
    <div class="flex-end mx-32 flex h-24 gap-20">
      <!--<><div class="flex gap-8">-->
      <!--  &lt;!&ndash; 状态搜索 &ndash;&gt;-->
      <!--  <el-dropdown>-->
      <!--    <span-->
      <!--      class="border-1 neutrals-grey-3 default-transition flex cursor-pointer gap-5 rounded-full border-solid px-8 py-4"-->
      <!--    >-->
      <!--      Source-->
      <!--      <i class="icon-typesdropdown" />-->
      <!--    </span>-->
      <!--    <template #dropdown>-->
      <!--      <div class="w-190 h-93 flex flex-col gap-8 px-6 py-12">-->
      <!--        <div class="flex-between">-->
      <!--          <span>Status</span>-->
      <!--          <el-button text>Clear</el-button>-->
      <!--        </div>-->
      <!--        <el-checkbox-group>-->
      <!--          <el-checkbox value="1">Active</el-checkbox>-->
      <!--          <el-checkbox value="2">Disabled</el-checkbox>-->
      <!--        </el-checkbox-group>-->
      <!--      </div>-->
      <!--    </template>-->
      <!--  </el-dropdown>-->
      <!--  &lt;!&ndash; 状态搜索 &ndash;&gt;-->
      <!--  <el-dropdown>-->
      <!--    <span-->
      <!--      class="border-1 neutrals-grey-3 default-transition flex cursor-pointer gap-5 rounded-full border-solid px-8 py-4"-->
      <!--    >-->
      <!--      Status-->
      <!--      <i class="icon-typesdropdown" />-->
      <!--    </span>-->
      <!--    <template #dropdown>-->
      <!--      <div class="w-190 h-93 flex flex-col gap-8 px-6 py-12">-->
      <!--        <div class="flex-between">-->
      <!--          <span>Role</span>-->
      <!--          <el-button text>Clear</el-button>-->
      <!--        </div>-->
      <!--        <el-checkbox-group>-->
      <!--          <el-checkbox value="1">Admin</el-checkbox>-->
      <!--          <el-checkbox value="2">Support</el-checkbox>-->
      <!--          <el-checkbox value="2">Technician</el-checkbox>-->
      <!--        </el-checkbox-group>-->
      <!--      </div>-->
      <!--    </template>-->
      <!--  </el-dropdown>-->
      <!--</div></>-->
      <!-- 输入搜索栏 -->
      <base-filter-input v-model="searchText" @input-change="refresh" />
    </div>
    <!-- Divider -->
    <el-divider />
    <!-- Table -->
    <div class="mx-32 flex flex-1 flex-col overflow-hidden pb-32">
      <el-table :data="orderDataList" class="flex-1" @sort-change="sort">
        <!-- 订单号 -->
        <el-table-column prop="orderNo" label="Order No." sortable />

        <!-- 活动id -->
        <el-table-column prop="activityNo" label="Activity No." sortable />

        <!-- 客户 -->
        <el-table-column prop="contactName" label="Customer" sortable />

        <!-- 用户邮箱 -->
        <el-table-column prop="contactEmail" label="Email" sortable />

        <!-- 联系电话 -->
        <el-table-column prop="phoneNumber" label="Phone No.">
          <template #default="{ row }">
            <span>({{ row.phoneCountry }}) {{ row.phoneNumber }}</span>
          </template>
        </el-table-column>

        <!-- OBD -->
        <el-table-column prop="quantity" label="Order Quantity" sortable />

        <!-- 客户备注 -->
        <el-table-column prop="description" label="Notes" />

        <!-- 订单日期 -->
        <el-table-column prop="createTime" label="Order Date" sortable>
          <template #default="{ row }">
            {{ getDateWithDDMMMYYYYhhmma(row.createTime) }}
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column align="center" width="100">
          <template #default="{ row }">
            <i
              class="icon-delete-bin-line text-16 cursor-pointer"
              @click="openConfirmDeleteDialog(row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <base-pagination v-model="pagination" />
    </div>
  </section>
  <!-- 新增订单的弹窗 -->
  <base-dialog
    v-if="dialogAddOrderVisible"
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
  <!-- 删除确认弹窗 -->
  <base-dialog
    v-model="dialogConfirmDeleteVisible"
    title="Delete order ?"
    button-type="danger"
    @cancel="dialogConfirmDeleteVisible = false"
    @confirm="handleDeleteVersionControl"
  >
    <template #content>
      <p class="heading-body-body-12px-medium text-neutrals-grey-3">
        {{ deleteContent }}
      </p>
    </template>
  </base-dialog>
</template>

<style scoped lang="scss"></style>
