<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import BasePagination from '@/components/BasePagination.vue'
import { deleteCommentApi, getCommentListApi } from '@/apis/forumApi.js'
import { getFullFilePath } from '@/utils/dataFormattedUtil.js'
import { getDateWithDDMMMYYYYhhmma } from '@/utils/dateUtil.js'
import { useDebounceFn } from '@vueuse/core'
import { RouteName, TimingPreset } from '@/utils/constantsUtil.js'
import BaseFilterPanel from '@/components/BaseFilterPanel.vue'
import BaseFilterInput from '@/components/BaseFilterInput.vue'
import BaseDialog from '@/components/BaseDialog.vue'

const commentList = ref([])

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

// 删除评论弹窗
const dialogConfirmDeleteCommentVisible = ref(false)

// 当前选中的评论 id
const selectedCommentId = ref('')

// 评论类型筛选列表
const typeList = ref([])

// 评论值筛选列表
const typeKeys = computed(() =>
  typeList.value.length > 0 ? typeList.value.join(',') : '',
)

// 是否有筛选条件
const hasCondition = computed(() => {
  return typeList.value.length > 0
})

const router = useRouter()

// 获取帖子列表
const getCommentList = async () => {
  const { data } = await getCommentListApi({
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
    searchKey: conditionSearchParams.searchText,
    type: typeKeys.value,
  })
  commentList.value = data
}

// 搜索
const handleSearchByInput = useDebounceFn(
  async () => refresh(),
  TimingPreset.DEBOUNCE,
)

// 筛选
const handleSearchByType = (val) => {
  conditionSearchParams.type = val
  refresh()
}

// 刷新
const refresh = () => {
  if (pagination.currentPage === 0) {
    return getCommentList()
  }
  pagination.currentPage = 0
}

// 查看帖子详情
const handleViewCommentDetails = (row, column) => {
  const { no } = column
  if (no === 0 || no === 6) {
    return
  }
  router.push({
    name: RouteName.COMMENT_DETAILS,
    params: { id: row.id },
  })
}

// 错误处理
const errorHandler = () => true

// 打开删除评论弹窗
const handleOpenDeleteCommentDialog = (id) => {
  // 设置选中评论 id
  selectedCommentId.value = id
  // 打开弹窗
  dialogConfirmDeleteCommentVisible.value = true
}

// 删除评论
const handleDeleteComment = async () => {
  try {
    await deleteCommentApi(selectedCommentId.value)
    // 提示
    ElMessage.success('Delete successfully')
    // 刷新列表
    refresh()
  } finally {
    // 关闭弹窗
    dialogConfirmDeleteCommentVisible.value = false
  }
}

// 网络请求
getCommentList()

// 监听翻页
watch(
  () => pagination.currentPage,
  () => {
    getCommentList()
  },
)
</script>

<template>
  <div class="flex-end mx-32 flex h-24 gap-8">
    <!--<div class="flex h-24 gap-8">-->
    <!--  &lt;!&ndash; 状态搜索 &ndash;&gt;-->
    <!--  <base-filter-panel-->
    <!--    v-model="typeList"-->
    <!--    :section-list="filterParams"-->
    <!--    condition-text="Type"-->
    <!--    @search="refresh"-->
    <!--  />-->
    <!--  &lt;!&ndash; 重置条件搜索 &ndash;&gt;-->
    <!--  <el-button-->
    <!--    text-->
    <!--    type="primary"-->
    <!--    class="h-24!"-->
    <!--    @click="typeList = []"-->
    <!--    v-show="hasCondition"-->
    <!--  >-->
    <!--    Clear-->
    <!--  </el-button>-->
    <!--</div>-->
    <!-- 条件搜索 -->
    <base-filter-input
      v-model="conditionSearchParams.searchText"
      @input-change="handleSearchByInput"
    />
  </div>
  <!-- 分割线 -->
  <el-divider class="diver" />
  <div class="pb-38 flex h-full flex-1 flex-col overflow-auto px-32 pt-16">
    <!-- 评论列表表格 -->
    <el-table
      :data="commentList"
      class="flex-1"
      row-class-name="clickable-row"
      @row-click="handleViewCommentDetails"
    >
      <!-- 选择框 -->
      <el-table-column type="selection" column-key="selection" min-width="7%" />
      <!-- 用户 -->
      <el-table-column
        prop="user"
        label="User"
        column-key="user"
        min-width="22%"
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
        min-width="22%"
      >
        <template #default="{ row }">
          <span class="h-41 text-truncate">{{ row.content || '-' }}</span>
        </template>
      </el-table-column>
      <!-- 被举报次数 -->
      <el-table-column
        prop="reports"
        label="Reports"
        sortable
        column-key="status"
        min-width="12%"
      >
        <template #default="{ row }">
          <span>{{ row.reports || '-' }}</span>
        </template>
      </el-table-column>
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
                <el-dropdown-item
                  @click="handleOpenDeleteCommentDialog(row.id)"
                >
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
  <!-- 是否删除评论弹窗 -->
  <base-dialog
    v-model="dialogConfirmDeleteCommentVisible"
    title="Delete comment ?"
    button-type="danger"
    @cancel="dialogConfirmDeleteCommentVisible = false"
    @confirm="handleDeleteComment"
  >
    <template #content>
      <p class="heading-body-body-12px-medium text-neutrals-off-black">
        Are you sure you want to delete this comment?
      </p>
    </template>
  </base-dialog>
</template>

<style scoped lang="scss"></style>
