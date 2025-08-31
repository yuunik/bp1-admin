<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const onRowClick = (_, column) => {
  const { no } = column
  if (no === 0 || no === 5) {
    return
  }
  router.push({ name: 'Internal Manage', params: { id: '12432314231' } })
}

const internalDataList = ref([
  {
    id: 1,
    name: 'Ralph Edwards',
    status: 'Active',
    email: 'tim.jennings@example.com',
    role: 'Admin',
  },
  {
    id: 2,
    name: 'Kristin Watson',
    status: 'Active',
    email: 'debra.holt@example.com',
    role: 'Admin',
  },
  {
    id: 3,
    name: 'Guy Hawkins',
    status: 'Disabled',
    email: 'michelle.rivera@example.com',
    role: 'Admin',
  },
  {
    id: 4,
    name: 'Bessie Cooper',
    status: 'Disabled',
    email: 'sara.cruz@example.com',
    role: 'Support',
  },
  {
    id: 5,
    name: 'Brooklyn Simmons',
    status: 'Active',
    email: 'willie.jennings@example.com',
    role: 'Technician',
  },
  {
    id: 6,
    name: 'Theresa Webb',
    status: 'Active',
    email: 'curtis.weaver@example.com',
    role: 'Support',
  },
  {
    id: 7,
    name: 'Cameron Williamson',
    status: 'Active',
    email: 'kenzi.lawson@example.com',
    role: 'Technician',
  },
  {
    id: 8,
    name: 'Jenny Wilson',
    status: 'Disabled',
    email: 'dolores.chambers@example.com',
    role: 'Support',
  },
  {
    id: 9,
    name: 'Courtney Henry',
    status: 'Disabled',
    email: 'tanya.hill@example.com',
    role: 'Support',
  },
  {
    id: 10,
    name: 'Esther Howard',
    status: 'Disabled',
    email: 'deanna.curtis@example.com',
    role: 'Technician',
  },
  {
    id: 11,
    name: 'Jane Cooper',
    status: 'Active',
    email: 'alma.lawson@example.com',
    role: 'Technician',
  },
  {
    id: 12,
    name: 'Ronald Richards',
    status: 'Active',
    email: 'georgia.young@example.com',
    role: 'Admin',
  },
  {
    id: 13,
    name: 'Robert Fox',
    status: 'Active',
    email: 'michael.mitc@example.com',
    role: 'Support',
  },
  {
    id: 14,
    name: 'Dianne Russell',
    status: 'Active',
    email: 'debbie.baker@example.com',
    role: 'Technician',
  },
  {
    id: 15,
    name: 'Arlene McCoy',
    status: 'Active',
    email: 'nevaeh.simmons@example.com',
    role: 'Support',
  },
])

const pageQueryParams = ref({
  currentPage: 0,
  total: 0,
  pageSize: 15,
})
</script>

<template>
  <router-view v-if="$route.name === 'Internal Manage'" />
  <router-view v-else-if="$route.name === 'Create Internal User'" />
  <section class="flex flex-col gap-16" v-else>
    <!-- Header -->
    <div class="flex-between mx-32 h-32">
      <h3>Internal</h3>
      <el-button
        type="primary"
        @click="$router.push({ name: 'Create Internal User' })"
      >
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
            Role
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
          <i class="icon-typessearch h-16 w-16" />
        </template>
      </el-input>
    </div>
    <!-- Divider -->
    <el-divider />
    <!-- Table -->
    <div class="mx-32 flex flex-1 flex-col overflow-auto pb-32">
      <el-table
        :data="internalDataList"
        @row-click="onRowClick"
        row-class-name="clickable-row"
        class="flex-1"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="Name" prop="name" sortable />
        <el-table-column label="Status" prop="status">
          <template #default="{ row }">
            <i
              :class="[
                'block',
                'p-8',
                'w-fit',
                'rounded-4',
                'leading-24',
                {
                  'bg-status-colours-light-green': row.status === 'Active',
                  'text-status-colours-green': row.status === 'Active',
                  'bg-neutrals-grey-1': row.status === 'Disabled',
                  'text-neutrals-grey-4': row.status === 'Disabled',
                },
              ]"
            >
              {{ row.status }}
            </i>
          </template>
        </el-table-column>
        <el-table-column label="Email" prop="email" sortable />
        <el-table-column label="Role" prop="role" />
        <!-- 操作 -->
        <el-table-column align="center" prop="actions" width="100">
          <template #default="{ row }">
            <!-- 状态搜索 -->
            <el-dropdown popper-class="custom-dropdown">
              <i class="icon-more-2-line" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>Edit</el-dropdown-item>
                  <el-dropdown-item>Reset Password</el-dropdown-item>
                  <el-dropdown-item>Enable</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
