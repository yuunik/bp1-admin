<script setup>
import { ref, reactive } from 'vue'

import BasePagination from '@/components/BasePagination/index.vue'
// 获取修理厂列表
import { getMerchantListApi } from '@/apis/userApi.js'
import { UserManagementTab } from '@/utils/constantsUtil.js'
import { getFullPath } from '@/utils/dataFormattedUtil.js'
import { useDebounceFn } from '@vueuse/core'
import { ElMessage } from 'element-plus'

// 修理厂列表
const merchantList = ref([])

// 分页数据
const pagination = reactive({
  currentPage: 0,
  pageSize: 15,
  total: 0,
})

// 搜索条件
const searchKey = ref('')

// 当前tab页
const activeTab = ref(UserManagementTab.PERSON)

// 获取修理厂列表
const getMerchantList = useDebounceFn(async () => {
  const { data, count } = await getMerchantListApi({
    searchKey: searchKey.value,
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
  })
  // 提示
  ElMessage.success('Get Merchant List Success')
  // 记录总数
  pagination.total = count
  // 记录修理厂列表
  merchantList.value = data
}, 500)

// 处理tab切换
const handleTabChange = (tabName) => (activeTab.value = tabName)

// 网络请求
getMerchantList()
</script>

<template>
  <section class="flex flex-col">
    <!-- Extern Header -->
    <div class="px-32 pb-16">
      <!-- 标题栏 -->
      <div class="flex-between">
        <h3 class="heading-h2-20px-medium">Extern</h3>
        <!-- 创建修理厂按钮 -->
        <el-button type="primary" class="w-70 h-32">Create</el-button>
      </div>
      <!-- tab 栏 -->
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane
          :label="UserManagementTab.PERSON"
          :name="UserManagementTab.PERSON"
        />
        <el-tab-pane
          :label="UserManagementTab.Workshop"
          :name="UserManagementTab.Workshop"
        />
      </el-tabs>
      <!-- 搜索栏 -->
      <div class="flex flex-between">
        <!-- 条件搜索 -->
        <el-input
          v-model="searchKey"
          @input="getMerchantList"
          placeholder="Search..."
          class="mt-16 extern-search"
        >
          <template #prefix>
            <!-- 前置搜索图标 -->
            <i class="icon-typessearch w-16 h-16" />
          </template>
        </el-input>
        <!-- 状态搜索 -->
        <el-dropdown :hide-on-click="false">
          <span
            class="rounded-full flex gap-5 border-1 border-[#CACFD8] border-solid px-8 py-4 neutrals-grey-3 cursor-pointer"
          >
            Status
            <i class="icon-typesdropdown" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>Action 1</el-dropdown-item>
              <el-dropdown-item>Action 2</el-dropdown-item>
              <el-dropdown-item>Action 3</el-dropdown-item>
              <el-dropdown-item disabled>Action 4</el-dropdown-item>
              <el-dropdown-item divided>Action 5</el-dropdown-item>
              <el-dropdown-item divided>Action 6</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <!-- 分割线 -->
    <el-divider />
    <!-- person 页 -->
    <template v-if="activeTab === UserManagementTab.PERSON">1111</template>
    <!-- workshop 页 -->
    <template v-if="activeTab === UserManagementTab.Workshop">
      <!-- 表格容器 -->
      <div class="px-32 pt-16 pb-38 flex-1 flex flex-col flex-between">
        <!-- 修理厂列表 -->
        <el-table :data="merchantList" class="h-full" height="100%">
          <!-- 勾选框 -->
          <el-table-column type="selection" min-width="6%" />
          <!-- 修理厂名称 -->
          <el-table-column
            prop="name"
            label="Name"
            :sortable="true"
            min-width="29%"
          >
            <!-- 修理厂 logo -->
            <template #default="{ row }">
              <el-image
                :src="getFullPath(row.logo)"
                v-if="row.logo"
                fit="cover"
                alt="merchant logo"
                class="w-14 h-14 mr-8"
              />
              <!-- 修理厂名称 -->
              <el-text>{{ row?.name ?? '-' }}</el-text>
            </template>
          </el-table-column>
          <!-- 修理厂邮箱 -->
          <el-table-column
            prop="userDto?.email"
            label="Email"
            :sortable="true"
            min-width="29%"
          >
            <template #default="{ row }">
              <!-- 修理厂邮箱 -->
              <el-text>
                {{ row?.userDto?.email === '' ? '-' : row?.userDto?.email }}
              </el-text>
            </template>
          </el-table-column>
          <!-- 修理厂评分 -->
          <el-table-column
            prop="rating"
            label="Reveiw"
            :sortable="true"
            min-width="12%"
          >
            <template #default="{ row }">
              <!-- 星星图标 -->
              <i class="icon icon-fi_star mr-8" />
              <!-- 评分 -->
              <el-text>{{ row?.rating ?? '-' }}</el-text>
            </template>
          </el-table-column>
          <!-- 修理厂状态 -->
          <el-table-column prop="status" label="Status" min-width="18%">
            <template #default="{ row }">
              <el-tag :type="row.isDelete === 0 ? 'success' : 'info'">
                {{ row.isDelete === 0 ? 'Active' : 'Disabled' }}
              </el-tag>
            </template>
          </el-table-column>
          <!-- 操作栏 -->
          <el-table-column min-width="6%" align="center">
            <template #default>
              <i class="icon-more-2-line cursor-pointer" />
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <base-pagination
          :pagination="pagination"
          :handle-page-change="getMerchantList"
        />
      </div>
    </template>
  </section>
</template>

<style scoped lang="scss">
// 搜索框样式重置
.extern-search {
  :deep(.el-input__wrapper) {
    box-shadow: none;
    background-color: transparent;
  }
}

// 评星图标样式
.icon-fi_star {
  color: $status-colours-orange;

  &::before {
    vertical-align: middle;
  }
}
</style>
