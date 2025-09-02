<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

import BasePagination from '@/components/BasePagination.vue'

const activeTab = ref('Inbound')

const inboundDataList = ref([
  {
    no: 'IN-00020',
    user: 'Ralph Edwards',
    category: 'Return',
    count: 4,
    status: 'Waiting inbound',
    date: '2025-04-04',
  },
  {
    no: 'IN-00019',
    user: 'Kristin Watson',
    category: 'Purchase',
    count: 2,
    status: 'Waiting inbound',
    date: '2025-04-04',
  },
  {
    no: 'IN-00018',
    user: 'Guy Hawkins',
    category: 'Manual Adjust',
    count: 5,
    status: 'In Stock',
    date: '2025-04-04',
  },
  {
    no: 'IN-00017',
    user: 'Bessie Cooper',
    category: 'Purchase',
    count: 3,
    status: 'In Stock',
    date: '2025-04-04',
  },
  {
    no: 'IN-00016',
    user: 'Brooklyn Simmons',
    category: 'Purchase',
    count: 5,
    status: 'In Stock',
    date: '2025-04-04',
  },
  {
    no: 'IN-00015',
    user: 'Theresa Webb',
    category: 'Purchase',
    count: 3,
    status: 'Cancelled',
    date: '2025-04-04',
  },
  {
    no: 'IN-00014',
    user: 'Marvin McKinney',
    category: 'Purchase',
    count: 2,
    status: 'In Stock',
    date: '2025-04-04',
  },
  {
    no: 'IN-00013',
    user: 'Jenny Wilson',
    category: 'Purchase',
    count: 4,
    status: 'In Stock',
    date: '2025-04-04',
  },
  {
    no: 'IN-00012',
    user: 'Cameron Howard',
    category: 'Purchase',
    count: 5,
    status: 'In Stock',
    date: '2025-04-04',
  },
  {
    no: 'IN-00011',
    user: 'Esther Howard',
    category: 'Purchase',
    count: 3,
    status: 'In Stock',
    date: '2025-04-04',
  },
  {
    no: 'IN-00010',
    user: 'Ronald Richards',
    category: 'Purchase',
    count: 5,
    status: 'In Stock',
    date: '2025-04-04',
  },
  {
    no: 'IN-00009',
    user: 'Robert Fox',
    category: 'Purchase',
    count: 4,
    status: 'In Stock',
    date: '2025-04-04',
  },
  {
    no: 'IN-00008',
    user: 'Darlene McCoy',
    category: 'Purchase',
    count: 5,
    status: 'In Stock',
    date: '2025-04-04',
  },
])

const inboundPageQueryParams = ref({
  currentPage: 0,
  total: 0,
  pageSize: 15,
})

const router = useRouter()

const handleTabChange = (tab) => (activeTab.value = tab)

const handleCreateInventory = (e) => {
  console.log('click', e)
}

const handleCreateStockOrder = (command) =>
  router.push({
    name: 'Inventory Create Stocker Order',
    query: { type: command },
  })

const handleViewInventoryDetails = (row, column) => {
  const { no } = column
  if (no === 0 || no === 7) {
    return
  }
  router.push({
    name: 'Inventory Details',
    params: {
      id: '123123',
    },
  })
}
</script>

<template>
  <router-view v-if="$route.name === 'Inventory Create Stocker Order'" />
  <router-view v-else-if="$route.name === 'Inventory Details'" />
  <section class="box-border flex h-full flex-col gap-16 px-32 pb-32" v-else>
    <div class="flex-between h-32">
      <h3 class="heading-h2-20px-medium text-neutrals-off-black">Inventory</h3>
      <el-dropdown trigger="click" @command="handleCreateStockOrder">
        <el-button type="primary">
          Create
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="inbound">Inbound</el-dropdown-item>
            <el-dropdown-item command="outbound">Outbound</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="h-85 flex gap-24">
      <div
        class="rounded-8 bg-status-colours-light-green flex flex-1 flex-col gap-16 p-16"
      >
        <p class="heading-body-large-body-14px-regular text-neutrals-grey-4">
          In Stock
        </p>
        <span class="heading-h1-26px-medium text-status-colours-green">
          500
        </span>
      </div>
      <div
        class="rounded-8 bg-status-colours-light-orange flex flex-1 flex-col gap-16 p-16"
      >
        <p class="heading-body-large-body-14px-regular text-neutrals-grey-4">
          Waiting Inbound
        </p>
        <span class="heading-h1-26px-medium text-status-colours-orange">
          500
        </span>
      </div>
      <div
        class="rounded-8 bg-status-colours-light-purple flex flex-1 flex-col gap-16 p-16"
      >
        <p class="heading-body-large-body-14px-regular text-neutrals-grey-4">
          Waiting Outbound
        </p>
        <span class="heading-h1-26px-medium text-status-colours-purple">
          500
        </span>
      </div>
      <div
        class="rounded-8 bg-status-colours-light-blue flex flex-1 flex-col gap-16 p-16"
      >
        <p class="heading-body-large-body-14px-regular text-neutrals-grey-4">
          In Use
        </p>
        <span class="heading-h1-26px-medium text-status-colours-blue">500</span>
      </div>
    </div>
    <el-tabs v-model="activeTab" @tab-change="handleTabChange" class="my-16">
      <el-tab-pane label="Inbound" name="Inbound" />
      <el-tab-pane label="Outbound" name="Outbound" />
    </el-tabs>
    <template v-if="activeTab === 'Inbound'">
      <div class="flex-between flex h-24 gap-20">
        <div class="flex gap-8">
          <!-- 状态搜索 -->
          <el-dropdown>
            <span
              class="border-1 neutrals-grey-3 default-transition flex cursor-pointer gap-5 rounded-full border-solid px-8 py-4"
            >
              Date Range
              <i class="icon-typesdropdown" />
            </span>
            <template #dropdown>
              <div class="w-190 h-93 flex flex-col gap-8 px-6 py-12">
                <div class="flex-between">
                  <span>User</span>
                  <el-button text>Clear</el-button>
                </div>
                <el-checkbox-group>
                  <el-checkbox value="1">7 days</el-checkbox>
                  <el-checkbox value="2">30 days</el-checkbox>
                  <el-checkbox value="2">90 days</el-checkbox>
                </el-checkbox-group>
              </div>
            </template>
          </el-dropdown>
          <!-- 状态搜索 -->
          <el-dropdown>
            <span
              class="border-1 neutrals-grey-3 default-transition flex cursor-pointer gap-5 rounded-full border-solid px-8 py-4"
            >
              Category
              <i class="icon-typesdropdown" />
            </span>
            <template #dropdown>
              <div class="w-190 h-93 flex flex-col gap-8 px-6 py-12">
                <div class="flex-between">
                  <span>Category</span>
                  <el-button text>Clear</el-button>
                </div>
                <el-checkbox-group>
                  <el-checkbox value="1">7 days</el-checkbox>
                  <el-checkbox value="2">30 days</el-checkbox>
                  <el-checkbox value="2">90 days</el-checkbox>
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
                  <span>Status</span>
                  <el-button text>Clear</el-button>
                </div>
                <el-checkbox-group>
                  <el-checkbox value="1">7 days</el-checkbox>
                  <el-checkbox value="2">30 days</el-checkbox>
                  <el-checkbox value="2">90 days</el-checkbox>
                </el-checkbox-group>
              </div>
            </template>
          </el-dropdown>
        </div>
        <!-- 搜索栏 -->
        <el-input placeholder="Search..." class="obd-list-search w-200! mt-16">
          <template #prefix>
            <!-- 前置搜索图标 -->
            <i class="icon-typessearch h-16 w-16" />
          </template>
        </el-input>
      </div>
      <div class="flex-between flex flex-1 flex-col">
        <el-table
          :data="inboundDataList"
          class="flex-1"
          @row-click="handleViewInventoryDetails"
        >
          <el-table-column type="selection" name="good" />
          <el-table-column prop="no" label="Inbound No." sortable />
          <el-table-column prop="user" label="User" sortable />
          <el-table-column prop="category" label="Category" sortable />
          <el-table-column prop="count" label="Count" sortable />
          <el-table-column prop="status" label="Status">
            <template #default="{ row }">
              <template v-if="row.status === 'Waiting inbound'">
                <i
                  class="rounded-4 bg-status-colours-light-orange text-status-colours-orange block h-24 w-fit p-8"
                >
                  {{ row.status }}
                </i>
              </template>
              <template v-else-if="row.status === 'In Stock'">
                <i
                  class="rounded-4 bg-status-colours-light-green text-status-colours-green block h-24 w-fit p-8"
                >
                  {{ row.status }}
                </i>
              </template>
              <template v-else-if="row.status === 'Cancelled'">
                <i
                  class="rounded-4 bg-neutrals-grey-1 text-neutrals-grey-4 block h-24 w-fit p-8"
                >
                  {{ row.status }}
                </i>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="Inbound Date" sortable />
          <!-- 操作 -->
          <el-table-column align="center" prop="actions" width="100">
            <template #default="{ row }">
              <!-- 状态搜索 -->
              <el-dropdown popper-class="custom-dropdown" trigger="click">
                <i class="icon-more-2-line cursor-pointer" />
                <template #dropdown>
                  <el-dropdown-menu class="px-16 py-8">
                    <template v-if="row.status === 'Waiting inbound'">
                      <el-dropdown-item>Confirm Inbound</el-dropdown-item>
                      <el-dropdown-item>Edit</el-dropdown-item>
                      <el-dropdown-item>Cancel</el-dropdown-item>
                    </template>
                    <template v-else-if="row.status === 'In Stock'">
                      <el-dropdown-item>Edit</el-dropdown-item>
                    </template>
                    <template v-else-if="row.status === 'Cancelled'">
                      <el-dropdown-item>Restore</el-dropdown-item>
                      <el-dropdown-item>Duplicate</el-dropdown-item>
                    </template>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <base-pagination v-model="inboundPageQueryParams" />
      </div>
    </template>
    <template v-else-if="activeTab === 'Outbound'">
      <div class="flex-between flex h-24 gap-20">
        <div class="flex gap-8">
          <!-- 状态搜索 -->
          <el-dropdown>
            <span
              class="border-1 neutrals-grey-3 default-transition flex cursor-pointer gap-5 rounded-full border-solid px-8 py-4"
            >
              Date Range
              <i class="icon-typesdropdown" />
            </span>
            <template #dropdown>
              <div class="w-190 h-93 flex flex-col gap-8 px-6 py-12">
                <div class="flex-between">
                  <span>User</span>
                  <el-button text>Clear</el-button>
                </div>
                <el-checkbox-group>
                  <el-checkbox value="1">7 days</el-checkbox>
                  <el-checkbox value="2">30 days</el-checkbox>
                  <el-checkbox value="2">90 days</el-checkbox>
                </el-checkbox-group>
              </div>
            </template>
          </el-dropdown>
          <!-- 状态搜索 -->
          <el-dropdown>
            <span
              class="border-1 neutrals-grey-3 default-transition flex cursor-pointer gap-5 rounded-full border-solid px-8 py-4"
            >
              Category
              <i class="icon-typesdropdown" />
            </span>
            <template #dropdown>
              <div class="w-190 h-93 flex flex-col gap-8 px-6 py-12">
                <div class="flex-between">
                  <span>Category</span>
                  <el-button text>Clear</el-button>
                </div>
                <el-checkbox-group>
                  <el-checkbox value="1">7 days</el-checkbox>
                  <el-checkbox value="2">30 days</el-checkbox>
                  <el-checkbox value="2">90 days</el-checkbox>
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
                  <span>Status</span>
                  <el-button text>Clear</el-button>
                </div>
                <el-checkbox-group>
                  <el-checkbox value="1">7 days</el-checkbox>
                  <el-checkbox value="2">30 days</el-checkbox>
                  <el-checkbox value="2">90 days</el-checkbox>
                </el-checkbox-group>
              </div>
            </template>
          </el-dropdown>
        </div>
        <!-- 搜索栏 -->
        <el-input placeholder="Search..." class="obd-list-search w-200! mt-16">
          <template #prefix>
            <!-- 前置搜索图标 -->
            <i class="icon-typessearch h-16 w-16" />
          </template>
        </el-input>
      </div>
      <div class="flex-between flex flex-1 flex-col">
        <el-table
          :data="inboundDataList"
          class="flex-1"
          row-class-name="clickable-row"
        >
          <el-table-column type="selection" />
          <el-table-column prop="no" label="Outbound No." sortable />
          <el-table-column prop="user" label="User" sortable />
          <el-table-column prop="category" label="Category" sortable />
          <el-table-column prop="count" label="Count" sortable />
          <el-table-column prop="status" label="Status">
            <template #default="{ row }">
              <template v-if="row.status === 'Waiting inbound'">
                <i
                  class="rounded-4 bg-status-colours-light-orange text-status-colours-orange block h-24 w-fit p-8"
                >
                  {{ row.status }}
                </i>
              </template>
              <template v-else-if="row.status === 'In Stock'">
                <i
                  class="rounded-4 bg-status-colours-light-green text-status-colours-green block h-24 w-fit p-8"
                >
                  {{ row.status }}
                </i>
              </template>
              <template v-else-if="row.status === 'Cancelled'">
                <i
                  class="rounded-4 bg-neutrals-grey-1 text-neutrals-grey-4 block h-24 w-fit p-8"
                >
                  {{ row.status }}
                </i>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="Inbound Date" sortable />
          <!-- 操作 -->
          <el-table-column align="center" prop="actions" width="100">
            <template #default="{ row }">
              <!-- 状态搜索 -->
              <el-dropdown popper-class="custom-dropdown" trigger="click">
                <i class="icon-more-2-line cursor-pointer" />
                <template #dropdown>
                  <el-dropdown-menu class="px-16 py-8">
                    <template v-if="row.status === 'Waiting inbound'">
                      <el-dropdown-item>Confirm Outbound</el-dropdown-item>
                      <el-dropdown-item>Edit</el-dropdown-item>
                      <el-dropdown-item>Cancel</el-dropdown-item>
                    </template>
                    <template v-else-if="row.status === 'In Stock'">
                      <el-dropdown-item>Edit</el-dropdown-item>
                    </template>
                    <template v-else-if="row.status === 'Cancelled'">
                      <el-dropdown-item>Restore</el-dropdown-item>
                      <el-dropdown-item>Duplicate</el-dropdown-item>
                    </template>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <base-pagination v-model="inboundPageQueryParams" />
      </div>
    </template>
  </section>
</template>

<style scoped lang="scss">
.el-button,
.el-button--small,
.el-button--large {
  border-radius: 0;
}

// 输入框样式重置
.obd-list-search {
  :deep(.el-input__wrapper) {
    box-shadow: none;
    background-color: transparent;
  }
}
</style>
