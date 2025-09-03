<script setup>
import { useRouter } from 'vue-router'

import BasePagination from '@/components/BasePagination.vue'
import { deleteForumApi, getForumListApi } from '@/apis/forumApi.js'
import { getFullFilePath } from '@/utils/dataFormattedUtil.js'
import { getDateWithDDMMMYYYYhhmma } from '@/utils/dateUtil.js'
import { useDebounceFn } from '@vueuse/core'
import { RouteName, TimingPreset } from '@/utils/constantsUtil.js'
import BaseFilterPanel from '@/components/BaseFilterPanel.vue'
import BaseFilterInput from '@/components/BaseFilterInput.vue'
import BaseDialog from '@/components/BaseDialog.vue'
import { ElMessage } from 'element-plus'

// 帖子列表
const postList = ref([])

// 分页参数
const pagination = reactive({
  pageSize: 10,
  total: 0,
  currentPage: 0,
})

// 条件搜索参数
const conditionSearchParams = reactive({
  searchText: '',
  type: '',
})

const router = useRouter()

// 筛选参数列表
const filterParams = ref([
  {
    label: 'Article',
    value: '0',
  },
  {
    label: 'Question',
    value: '1',
  },
])

const dialogConfirmDeletePostVisible = ref(false)

const selectedPostId = ref('')

// 帖子详情
const handleViewPostDetails = (row, column) => {
  const { no } = column
  if (no === 0 || no === 7) {
    return
  }
  router.push({
    name: RouteName.POST_DETAILS,
    params: { id: row.id },
  })
}

// 获取帖子列表
const getPostList = async () => {
  const { data } = await getForumListApi({
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
    searchKey: conditionSearchParams.searchText,
    type: conditionSearchParams.type,
  })
  postList.value = data
}

// 错误处理
const errorHandler = () => true

// 搜索
const handleSearchByInput = useDebounceFn(async () => {
  pagination.currentPage = 0
  const { data } = await getForumListApi({
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
    searchKey: conditionSearchParams.searchText,
    type: conditionSearchParams.type,
  })
  postList.value = data
}, TimingPreset.DEBOUNCE)

// 筛选
const handleSearchByType = (val) => {
  conditionSearchParams.type = val
  refresh()
}

// 刷新
const refresh = () => {
  if (pagination.currentPage === 0) {
    return getPostList()
  }
  pagination.currentPage = 0
}

// 删除论坛
const handleDeleteForum = async () => {
  try {
    await deleteForumApi(selectedPostId.value)
    // 提示
    ElMessage.success('Delete successfully')
    refresh()
  } finally {
    dialogConfirmDeletePostVisible.value = false
  }
}

const openConfirmDeleteDialog = (id) => {
  selectedPostId.value = id
  dialogConfirmDeletePostVisible.value = true
}

// 网络请求
getPostList()

// 监听翻页
watch(
  () => pagination.currentPage,
  () => {
    getPostList()
  },
)
</script>

<template>
  <!-- 搜索栏 -->
  <div class="flex-between mx-32 flex gap-8">
    <!-- 状态搜索 -->
    <base-filter-panel
      :section-list="filterParams"
      condition-text="Type"
      @search="handleSearchByType"
    />
    <!-- 条件搜索 -->
    <base-filter-input
      v-model="conditionSearchParams.searchText"
      @input-change="handleSearchByInput"
    />
  </div>
  <!-- 分割线 -->
  <el-divider class="diver" />
  <div class="pb-38 flex flex-1 flex-col overflow-auto px-32 pt-16">
    <!-- 贴文列表表格 -->
    <el-table
      :data="postList"
      class="flex-1"
      row-class-name="clickable-row"
      @row-click="handleViewPostDetails"
    >
      <!-- 选择框 -->
      <el-table-column type="selection" column-key="selection" min-width="7%" />
      <!-- 用户 -->
      <el-table-column
        prop="userDto?.name"
        label="User"
        column-key="user"
        min-width="17%"
        sortable
      >
        <template #default="{ row }">
          <div class="flex items-center">
            <el-avatar
              v-if="row.userDto?.logo"
              fit="cover"
              :src="getFullFilePath(row.userDto?.logo)"
              class="mr-8 h-20 w-20"
              alt="brand icon"
              shape="circle"
              :size="20"
              @error="errorHandler"
            >
              <template #error>
                <i class="i-ep:picture" />
              </template>
            </el-avatar>
            <el-text>{{ row.userDto?.name || '-' }}</el-text>
          </div>
        </template>
      </el-table-column>
      <!-- 内容 -->
      <el-table-column
        prop="content"
        label="Content"
        column-key="content"
        min-width="15%"
      >
        <template #default="{ row }">
          <span class="h-41 text-truncate">{{ row.content || '-' }}</span>
        </template>
      </el-table-column>
      <!-- 被举报次数 -->
      <el-table-column
        prop="tipOffCount"
        label="Reports"
        sortable
        column-key="status"
        min-width="12%"
      >
        <template #default="{ row }">
          <span>{{ row.reports || '-' }}</span>
        </template>
      </el-table-column>
      <!-- 评论数 -->
      <el-table-column
        prop="commentCount"
        label="Comments"
        sortable
        column-key="comments"
        min-width="12%"
      />
      <!-- 状态 -->
      <el-table-column
        prop="status"
        label="Status"
        sortable
        column-key="status"
        min-width="12%"
      >
        <template #default="{ row }">
          <el-tag :type="row.tipOffCount ? 'danger' : 'success'">
            {{ row.tipOffCount ? 'Reported' : 'Normal' }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- 日期 -->
      <el-table-column
        prop="date"
        label="Date"
        sortable
        column-key="date"
        min-width="19%"
      >
        <template #default="{ row }">
          {{ getDateWithDDMMMYYYYhhmma(row.createTime) }}
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column column-key="actions" min-width="6%">
        <template #default="{ row }">
          <el-dropdown trigger="click">
            <i class="icon-more-2-line cursor-pointer" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="openConfirmDeleteDialog(row.id)">
                  Delete
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加按钮 -->
    <base-pagination v-model="pagination" />
  </div>
  <!-- 是否删除贴文弹窗 -->
  <base-dialog
    v-model="dialogConfirmDeletePostVisible"
    title="Delete Post"
    button-type="danger"
    @cancel="dialogConfirmDeletePostVisible = false"
    @confirm="handleDeleteForum"
  >
    <template #content>
      <p class="heading-body-body-12px-medium text-neutrals-off-black">
        Are you sure you want to delete this post?
      </p>
    </template>
  </base-dialog>
</template>

<style scoped lang="scss"></style>
