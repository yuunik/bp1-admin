<script setup>
import { ElMessage } from 'element-plus'
import { useCloned, useDebounceFn } from '@vueuse/core'

// 当前 tab 名称
import BaseFilterPanel from '@/components/BaseFilterPanel.vue'
import BaseFilterInput from '@/components/BaseFilterInput.vue'
import { TimingPreset } from '@/utils/constantsUtil.js'
import BasePagination from '@/components/BasePagination.vue'
import {
  addExpenseItemApi,
  deleteExpenseItemApi,
  getExpenditureUserListApi,
  getExpenseGroupListApi,
  getExpenseListApi,
  getMaintenanceListApi,
  modifyExpenseItemApi,
} from '@/apis/appApi.js'
import { getDateWithDDMMMYYYY } from '@/utils/dateUtil.js'
import BaseDialog from '@/components/BaseDialog.vue'
import { useSort } from '@/composables/useSort.js'
import BaseUpload from '@/components/BaseUpload.vue'
import { addClubApi, editClubApi, getClubListApi } from '@/apis/clubApi.js'
import { getFullFilePath } from '@/utils/dataFormattedUtil.js'

const activeName = ref('All')

const clubList = ref([])

// 筛选组参数
const groupList = ref([])

const groupKeys = computed(() =>
  groupList.value.length ? groupList.value.join(',') : '',
)

const groupFilterParams = ref([])

// 分类参数
const categoryList = ref([])

const categoryKeys = computed(() =>
  categoryList.value.length ? categoryList.value.join(',') : '',
)

const categoryFilterParams = ref([])

// 模块参数
const moduleList = ref([])

const moduleKeys = computed(() =>
  moduleList.value.length ? moduleList.value.join(',') : '',
)

const moduleFilterParams = ref([])

// 创建者参数
const creatorList = ref([])

const creatorKeys = computed(() =>
  creatorList.value.length ? creatorList.value.join(',') : '',
)

const creatorFilterParams = ref([])

// 创建日期参数
const createdDateList = ref([])

// 是否显示group筛选
const isShowCreatedDateFilter = computed(() => activeName.value === 'All')

const createdDateKeys = computed(() =>
  createdDateList.value.length ? createdDateList.value.join(',') : '',
)

const createdDateFilterParams = ref([
  {
    label: 'All',
    value: 'All',
  },
  {
    label: 'Today',
    value: 'Today',
  },
  {
    label: 'This Month',
    value: 'This Month',
  },
  {
    label: 'This Year',
    value: 'This Year',
  },
])

// 分页数据
const pagination = reactive({
  currentPage: 0,
  pageSize: 15,
  total: 0,
})

// 是否有筛选条件
const hasCondition = computed(() => {
  if (isShowCreatedDateFilter.value) {
    return (
      groupList.value.length > 0 ||
      categoryList.value.length > 0 ||
      moduleList.value.length > 0 ||
      creatorList.value.length > 0 ||
      createdDateList.value.length > 0
    )
  }

  return (
    categoryList.value.length > 0 ||
    moduleList.value.length > 0 ||
    creatorList.value.length > 0 ||
    createdDateList.value.length > 0
  )
})

// 输入搜索关键字
const searchKeywords = ref('')

// 列表数据
const expenseList = ref([])

// 创建Expense的弹窗
const dialogClubFormVisible = ref(false)

// expense item表单
const expenseItemForm = ref({
  name: '',
  group: '',
  category: '',
  module: '',
  maintenanceName: '',
})

// club 表单
const clubForm = ref({
  name: '',
  description: '',
  sort: 1,
  logo: '',
})

// 确认删除弹窗
const dialogDeleteExpenseItemVisible = ref(false)

// 排序参数
const sortParams = reactive({
  sort: '',
  sortBy: '',
})

// 勾选的expense item list
const selectedExpenseIdList = ref([])

// 批量删除弹窗
const dialogBatchDeleteExpenseItemVisible = ref(false)

// 用户搜索条件
const creatorSearchText = ref('')

// 当前所选中的expense item
const selectedExpenseItem = ref({})

// 刷新
const refresh = useDebounceFn(() => {
  if (!pagination.currentPage) {
    return getClubList()
  }
  // 设置当前页为 1
  pagination.currentPage = 0
}, TimingPreset.DEBOUNCE)

// 清除筛选条件
const handleClearCondition = () => {
  isShowCreatedDateFilter.value && (groupList.value = [])
  categoryList.value = []
  moduleList.value = []
  creatorList.value = []
  createdDateList.value = []
  refresh()
}

// 获取expense列表
const getExpenseList = async () => {
  const { data, count } = await getExpenseListApi({
    groups: groupKeys.value,
    categorys: categoryKeys.value,
    modules: moduleKeys.value,
    userIds: creatorKeys.value,
    // createTimes: createdDateKeys.value,

    searchKey: searchKeywords.value,

    sort: sortParams.sort,
    sortBy: sortParams.sortBy,

    page: pagination.currentPage,
    pageSize: pagination.pageSize,
  })

  // 保存 expense
  expenseList.value = data
  // 记录总条数
  pagination.total = count
}

// 获取分组信息
const getGroupList = async () => {
  const {
    data: { categories, groups, modules },
  } = await getExpenseGroupListApi()
  groupFilterParams.value = groups.map((item) => ({
    label: item,
    value: item,
  }))
  categoryFilterParams.value = categories.map((item) => ({
    label: item,
    value: item,
  }))
  moduleFilterParams.value = modules.map((item) => ({
    label: item,
    value: item,
  }))
}

// 新增 club
const handleCreateClubItem = async () => {
  console.log(clubForm.value, '@@@@@@@@@@@@')
  await addClubApi(clubForm.value)
  // 关闭弹窗
  dialogClubFormVisible.value = false
  // 提示
  ElMessage.success('Added successfully')
  refresh()
}

// 打开表单弹窗
const openEditExpenseItemDialog = (row) => {
  const { cloned } = useCloned(row)
  clubForm.value = cloned.value
  dialogClubFormVisible.value = true
}

// 编辑 expense
const handleEditClubItem = async () => {
  console.log(typeof clubForm.value.logo)
  await editClubApi(clubForm.value)
  // 关闭弹窗
  dialogClubFormVisible.value = false
  // 提示
  ElMessage.success('Edit  successfully')
  refresh()
}

// 管理expense item
const handleManageExpenseItem = async () => {
  if (!clubForm.value.id) {
    handleCreateClubItem()
  } else {
    handleEditClubItem()
  }
}

// 打开确认删除弹窗
const handleOpenDeleteExpenseItemDialog = (row) => {
  expenseItemForm.value = row
  dialogDeleteExpenseItemVisible.value = true
}

// 删除 expense item
const handleDeleteExpenseItem = async () => {
  await deleteExpenseItemApi(expenseItemForm.value.id)
  dialogDeleteExpenseItemVisible.value = false
  // 提示
  ElMessage.success('Delete successfully')
  refresh()
}

// 获取用户列表
const getUserList = async () => {
  const { data } = await getExpenditureUserListApi()
  creatorFilterParams.value = data.map((item) => ({
    label: item.name,
    value: item.id,
  }))
}

// 排序函数
const handleSortChange = useSort(sortParams, () => refresh())

// 数据初始化
const initData = async () =>
  await Promise.all([
    getExpenseList(),
    getGroupList(),
    getUserList(),
    getMaintenanceList(),
  ])

// 勾选框勾选
const handleSelectionChange = (val) =>
  (selectedExpenseIdList.value = val.map((item) => item.id))

// 批量删除
const handleBatchDeleteExpenseItems = async () => {
  await deleteExpenseItemApi(selectedExpenseIdList.value.join(','))
  dialogBatchDeleteExpenseItemVisible.value = false
  // 提示
  ElMessage.success('Edit  successfully')
  refresh()
}

const maintenanceFilterParams = ref([])

// 获取保养列表
const getMaintenanceList = async () => {
  const { data } = await getMaintenanceListApi({
    page: 0,
    pageSize: 999,
  })
  maintenanceFilterParams.value = data.map((item) => ({
    label: item.name,
    value: item.name,
  }))
}

const getClubList = async () => {
  const { data } = await getClubListApi({
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
    searchKey: searchKeywords.value,
    sort: sortParams.sort,
    sortBy: sortParams.sortBy,
  })
  clubList.value = data
}

// 获取上传的本地文件
const handleGetLocalFile = (file) => (clubForm.value.logo = file)

// 错误行为
const errorHandler = (error) => true

// 监听
watch(dialogDeleteExpenseItemVisible, (val) => {
  if (!val) {
    clubForm.value = {}
  }
})

watch(dialogClubFormVisible, (val) => {
  if (!val) {
    clubForm.value = {}
  }
})

watch(
  () => pagination.currentPage,
  () => getClubList(),
)

// 网络请求
onMounted(async () => {
  getClubList()
})
</script>

<template>
  <section
    class="mx-32 box-border flex h-full flex-col gap-16 overflow-auto pb-32"
  >
    <!-- 标题栏 -->
    <div class="flex-between h-32">
      <h3
        class="heading-h2-20px-medium text-neutrals-off-black row-center h-32"
      >
        Club List
      </h3>
      <el-button type="primary" @click="dialogClubFormVisible = true">
        Create
      </el-button>
    </div>
    <!-- 搜索栏 -->
    <div class="flex-between">
      <div class="row-center flex-wrap gap-8">
        <!-- 组筛选 -->
        <base-filter-panel
          v-model="groupList"
          :section-list="groupFilterParams"
          condition-text="Group"
          @search="refresh"
          v-show="isShowCreatedDateFilter"
        />
        <!-- 分类筛选 -->
        <base-filter-panel
          v-model="categoryList"
          :section-list="categoryFilterParams"
          condition-text="Category"
          @search="refresh"
        />
        <!-- 模块筛选 -->
        <base-filter-panel
          v-model="moduleList"
          :section-list="moduleFilterParams"
          condition-text="Module"
          @search="refresh"
        />
        <!-- 创建者筛选 -->
        <base-filter-panel
          v-model="creatorList"
          v-model:keywords="creatorSearchText"
          :section-list="creatorFilterParams"
          condition-text="Creator"
          :is-need-input="true"
          @search="refresh"
        />
        <!-- 创建日期筛选 -->
        <!--<base-filter-panel-->
        <!--  v-model="createdDateList"-->
        <!--  :section-list="createdDateFilterParams"-->
        <!--  condition-text="Creation Date"-->
        <!--  @search="refresh"-->
        <!--/>-->

        <!-- 清除按钮 -->
        <el-button
          text
          class="h-24! text-status-colours-blue!"
          @click="handleClearCondition"
          v-show="hasCondition"
        >
          Clear
        </el-button>
      </div>
      <!-- 输入搜索 -->
      <base-filter-input v-model="searchKeywords" @inputChange="refresh" />
    </div>
    <div class="flex-between h-42" v-show="selectedExpenseIdList.length">
      <span class="text-neutrals-off-black heading-body-body-12px-regular">
        {{ selectedExpenseIdList.length }} selected
      </span>
      <el-button @click="dialogBatchDeleteExpenseItemVisible = true">
        Delete
      </el-button>
    </div>
    <!-- 表格内容 -->
    <div class="flex flex-1 flex-col justify-between overflow-hidden">
      <el-table
        :data="clubList"
        style="width: 100%"
        class="flex-1"
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" min-width="6%" sortable="custom" />
        <el-table-column
          prop="name"
          label="Name"
          min-width="17.6%"
          sortable="custom"
        >
          <template #default="{ row }">
            <div class="flex items-center">
              <el-avatar
                v-if="row.logo"
                fit="cover"
                :src="getFullFilePath(row.logo)"
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
              <el-text>{{ row.name || '-' }}</el-text>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="Description"
          min-width="17.6%"
          sortable="custom"
        />
        <el-table-column
          prop="memberCount"
          label="Member Count"
          min-width="17.6%"
          sortable="custom"
        />
        <el-table-column
          prop="sort"
          label="Sort"
          min-width="17.6%"
          sortable="custom"
        />
        <el-table-column
          prop="createTime"
          label="Create Time"
          min-width="17.6%"
          sortable="custom"
        >
          <template #default="{ row }">
            <span>{{ getDateWithDDMMMYYYY(row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="6%">
          <template #default="{ row }">
            <el-dropdown trigger="click">
              <i class="icon-more-2-line text-16 cursor-pointer" />
              <template #dropdown>
                <el-dropdown-menu class="px-16! py-8! rounded-8!" place>
                  <el-dropdown-item @click="openEditExpenseItemDialog(row)">
                    Edit
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click="handleOpenDeleteExpenseItemDialog(row)"
                  >
                    Delete
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <base-pagination v-model="pagination" />
    </div>
  </section>
  <!-- 创建 club 弹窗 -->
  <base-dialog
    v-model="dialogClubFormVisible"
    :title="clubForm.id ? 'Edit Club' : 'Create a New Club'"
    :confirm-text="clubForm.id ? 'Edit' : 'Create'"
    @cancel="dialogClubFormVisible = false"
    @confirm="handleManageExpenseItem"
    class="club-form-container"
  >
    <template #content>
      <div class="flex flex-col gap-8">
        <!-- 上传 logo -->
        <base-upload
          default-avatar-text="A"
          :img-path="getFullFilePath(clubForm.logo)"
          @get-local-file="handleGetLocalFile"
        />
        <div class="flex flex-col gap-8">
          <p class="heading-body-body-12px-medium text-neutrals-off-black">
            Club Name
          </p>
          <el-input v-model="clubForm.name" placeholder="Enter" />
        </div>
        <div class="flex flex-col gap-8">
          <p class="heading-body-body-12px-medium text-neutrals-off-black">
            Sort
          </p>
          <el-input-number v-model="clubForm.sort" :min="1" />
        </div>
        <div class="flex flex-col gap-8">
          <p class="heading-body-body-12px-medium text-neutrals-off-black">
            Description
          </p>
          <el-input
            type="textarea"
            v-model="clubForm.description"
            rows="3"
            placeholder="Enter"
          />
        </div>
      </div>
    </template>
  </base-dialog>
  <!-- 删除 expense item 提示框 -->
  <base-dialog
    v-model="dialogDeleteExpenseItemVisible"
    title="Delete Item ?"
    button-type="danger"
    confirm-text="Delete"
    @cancel="dialogDeleteExpenseItemVisible = false"
    @confirm="handleDeleteExpenseItem"
  >
    <template #content>
      <p class="heading-body-body-12px-regular text-neutrals-grey-3">
        Are you sure you want to delete the this club? Once deleted, it cannot
        be recovered.
      </p>
    </template>
  </base-dialog>
  <!-- 批量删除 expense item 提示框 -->
  <base-dialog
    v-model="dialogBatchDeleteExpenseItemVisible"
    title="Delete Item ?"
    button-type="danger"
    confirm-text="Delete"
    @cancel="dialogBatchDeleteExpenseItemVisible = false"
    @confirm="handleBatchDeleteExpenseItems"
  >
    <template #content>
      <p class="heading-body-body-12px-regular text-neutrals-grey-3">
        Are you sure you want to delete the
        {{ selectedExpenseIdList.length }} selected Expense Items? Once deleted,
        it cannot be recovered.
      </p>
    </template>
  </base-dialog>
</template>

<style scoped lang="scss">
// 重置 el-input 的样式
:deep(.club-form-container .el-textarea) {
  .el-textarea__inner {
    @apply rounded-12 bg-[#EAEEF480];
  }
}

// 重置选择框的样式
:deep(.club-form-container .el-input) {
  .el-input__wrapper {
    @apply rounded-12 h-32 bg-[#EAEEF480];
  }
}
</style>
