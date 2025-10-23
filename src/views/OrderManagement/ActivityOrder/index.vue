<script setup>
import { useRouter } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'

import BasePagination from '@/components/BasePagination.vue'
import BaseFilterInput from '@/components/BaseFilterInput.vue'
import BaseDialog from '@/components/BaseDialog.vue'
import { postOrderApi } from '@/apis/shareApi.js'
import { ElMessage } from 'element-plus'
import { deleteActiveOrderApi, getActiveOrderListApi } from '@/apis/orderApi.js'
import { useSort } from '@/composables/useSort.js'
import { getDateWithDDMMMYYYYhhmma } from '@/utils/dateUtil.js'

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

// 获取订单列表
const getOrderList = async () => {
  await getActiveOrderListApi({
    searchKey: searchText.value,
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
    sort: sortParams.sort,
    sortBy: sortParams.sortBy,
  })
}

// 排序查询
const sort = useSort(sortParams, () => getOrderList())

// 当单元格 hover 进入时会触发该事件
const handleCellMouseEnter = (row) => (row.isHover = true)

// 当单元格 hover 离开时会触发该事件
const handleCellMouseLeave = (row) => (row.isHover = false)

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
      <base-filter-input v-model="searchText" @input-change="refresh" />
    </div>
    <!-- Divider -->
    <el-divider />
    <!-- Table -->
    <div class="mx-32 flex flex-1 flex-col overflow-hidden pb-32">
      <el-table
        :data="orderDataList"
        class="flex-1"
        @sort-change="sort"
        @cell-mouse-enter="handleCellMouseEnter"
        @cell-mouse-leave="handleCellMouseLeave"
      >
        <!-- 复选框列 -->
        <el-table-column type="selection" width="50" />

        <!-- 订单号 -->
        <el-table-column prop="orderNo" label="Order No." sortable />

        <!-- 客户 -->
        <el-table-column prop="contactName" label="Customer" />

        <!-- 联系电话 -->
        <el-table-column prop="phoneNumber" label="Phone No." />

        <!-- OBD -->
        <el-table-column prop="quantity" label="Order Quantity" sortable />

        <!-- 客户备注 -->
        <el-table-column prop="description" label="Notes" />

        <!-- 订单日期 -->
        <el-table-column prop="createTime" label="Order Date" sortable>
          <template #default="{ row }">
            getDateWithDDMMMYYYYhhmma(row.createTime)
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column align="center" width="100">
          <template #default>
            <i
              class="icon-delete-bin-line text-16 cursor-pointer"
              v-show="row.isHover"
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
