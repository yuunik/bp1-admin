<script setup>
import { useRouter } from 'vue-router'
import BasePagination from '@/components/BasePagination.vue'

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
</script>

<template>
  <section class="flex h-full flex-col gap-16">
    <!-- Header -->
    <div class="flex-between mx-32 h-32">
      <h3 class="heading-h2-20px-medium text-neutrals-off-black">
        Order Management
      </h3>
      <div class="flex gap-8">
        <el-button>Confirm Refund</el-button>
        <el-button type="primary">Create</el-button>
      </div>
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
      <!-- 搜索栏 -->
      <el-input placeholder="Search..." class="internal-list-search w-200!">
        <template #prefix>
          <!-- 前置搜索图标 -->
          <i class="icon-mail-send-line-1 text-16" />
        </template>
      </el-input>
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
</template>

<style scoped lang="scss">
// 输入框样式重置
.internal-list-search {
  :deep(.el-input__wrapper) {
    box-shadow: none;
    background-color: transparent;
  }
}
</style>
