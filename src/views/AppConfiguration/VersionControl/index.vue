<script setup>
import { useDebounceFn } from '@vueuse/core'
import { useRouter } from 'vue-router'

import { getAppVersionListApi } from '@/apis/appApi.js'
import BasePagination from '@/components/BasePagination.vue'
import { getCommentTime } from '@/utils/dateUtil.js'
import { RouteName, TimingPreset } from '@/utils/constantsUtil.js'

const searchText = ref('')

const handleSearch = () => {}

// 分页查询条件
const pagination = reactive({
  currentPage: 0,
  pageSize: 15,
  total: 0,
})

// 版本数据列表
const appVersionList = ref([])

// 搜索的版本平台
const searchType = ref('')

const router = useRouter()

// 获取版本列表
const getAppVersionList = useDebounceFn(async () => {
  const { data, count } = await getAppVersionListApi({
    types: searchType.value,
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
  })
  appVersionList.value = data
  // 更新分页数据
  pagination.total = count
}, TimingPreset.DEBOUNCE)

// 搜索平台切换
const handlePlatformChange = (command) => {
  searchType.value = command
  // 修改当前页
  if (pagination.currentPage === 0) {
    return getAppVersionList()
  }
  pagination.currentPage = 0
}

// 查看版本详情
const viewVersionDetail = (row) =>
  router.push({ name: RouteName.MANAGE_VERSION, params: { id: row.id } })

// 移除搜索平台
const removeSearchPlatform = () => {
  searchType.value = ''
  // 修改当前页
  if (pagination.currentPage === 0) {
    return getAppVersionList()
  }
  pagination.currentPage = 0
}

// 监听 pagination.currentPage, 自动发起查询
watch(
  () => pagination.currentPage,
  () => getAppVersionList,
)

// 组件创建时, 发起网络请求
getAppVersionList()
</script>

<template>
  <section class="flex flex-col gap-16">
    <!-- header -->
    <div class="flex-between mx-32 h-32">
      <h3 class="heading-h2-20px-medium text-neutrals-off-black">
        Version Control
      </h3>
      <el-button
        type="primary"
        @click="$router.push({ name: RouteName.VERSION_CONTROL_CREATE })"
      >
        New Config
      </el-button>
    </div>
    <!-- search -->
    <div class="flex-between mx-32 h-24 gap-8">
      <!-- 搜索栏 -->
      <el-input
        placeholder="Search..."
        class="version-control-list-search"
        v-model="searchText"
        @input="handleSearch"
      >
        <template #prefix>
          <!-- 前置搜索图标 -->
          <i class="icon-typessearch h-16 w-16" />
        </template>
      </el-input>
      <!-- 状态搜索 -->
      <el-dropdown @command="handlePlatformChange" v-if="!searchType">
        <span
          class="border-1 neutrals-grey-3 flex cursor-pointer gap-5 rounded-full border-solid border-[#CACFD8] px-8 py-4"
        >
          Platform
          <i class="icon-typesdropdown" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="iOS">iOS</el-dropdown-item>
            <el-dropdown-item command="Android">Android</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-tag
        v-else
        closable
        type="primary"
        @close="removeSearchPlatform"
        class="w-84 h-24"
      >
        {{ searchType }}
      </el-tag>
    </div>
    <!-- divider -->
    <el-divider />
    <!-- list -->
    <div class="pb-38 mx-32 flex flex-1 flex-col">
      <el-table
        :data="appVersionList"
        class="flex-1"
        row-class-name="clickable-row"
        @row-click="viewVersionDetail"
      >
        <el-table-column type="selection" />
        <el-table-column prop="type" label="Platform" />
        <el-table-column prop="version" label="Version" />
        <el-table-column label="Status">
          <template #default="{ row }">
            <el-text v-if="row.state === 0">No prompt</el-text>
            <el-text v-else-if="row.state === 1">Prompt to update</el-text>
            <el-text v-else-if="row.state === 2">Force update</el-text>
            <el-text v-else-if="row.state === 3">Under review</el-text>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="Content" />
        <el-table-column label="Create Date">
          <template #default="{ row }">
            {{ getCommentTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column>
          <template #default="{ row }">
            <i class="icon-more-2-line text-neutrals-grey-3 h-16 w-16" />
          </template>
        </el-table-column>
      </el-table>
      <!-- pagination -->
      <base-pagination v-model="pagination" />
    </div>
  </section>
</template>

<style scoped lang="scss">
// 搜索框
.version-control-list-search {
  // 输入框样式重置
  :deep(.el-input__wrapper) {
    box-shadow: none;
    background-color: transparent;
    padding-left: 0;
  }
}
</style>
