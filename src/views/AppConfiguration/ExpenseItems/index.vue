<script setup>
// 当前 tab 名称
import BaseFilterPanel from '@/components/BaseFilterPanel.vue'
import BaseFilterInput from '@/components/BaseFilterInput.vue'
import { useDebounceFn } from '@vueuse/core'
import { TimingPreset } from '@/utils/constantsUtil.js'
import BasePagination from '@/components/BasePagination.vue'
import {
  addExpenseItemApi,
  deleteExpenseItemApi,
  getExpenditureUserListApi,
  getExpenseGroupListApi,
  getExpenseListApi,
  modifyExpenseItemApi,
} from '@/apis/appApi.js'
import { getDateWithDDMMMYYYY } from '@/utils/dateUtil.js'
import BaseDialog from '@/components/BaseDialog.vue'
import { ElMessage } from 'element-plus'
import { useSort } from '@/composables/useSort.js'

const activeName = ref('All')

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
const hasCondition = computed(
  () =>
    groupList.value.length > 0 ||
    categoryList.value.length > 0 ||
    moduleList.value.length > 0 ||
    creatorList.value.length > 0 ||
    createdDateList.value.length > 0,
)

// 输入搜索关键字
const searchKeywords = ref('')

// 列表数据
const expenseList = ref([])

// 创建Expense的弹窗
const dialogExpenseFormVisible = ref(false)

// expense item表单
const expenseItemForm = ref({
  name: '',
  group: '',
  category: '',
})

// 确认删除弹窗
const dialogDeleteExpenseItemVisible = ref(false)

// 排序参数
const sortParams = reactive({
  sort: '',
  sortBy: '',
})

// 刷新
const refresh = useDebounceFn(() => {
  if (!pagination.currentPage) {
    return initData()
  }
  // 设置当前页为 1
  pagination.currentPage = 0
}, TimingPreset.DEBOUNCE)

// 清除筛选条件
const handleClearCondition = () => {
  groupList.value = []
  categoryList.value = []
  moduleList.value = []
  creatorList.value = []
  createdDateList.value = []
  refresh()
}

// 获取expense列表
const getExpenseList = async () => {
  const { data } = await getExpenseListApi({
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

// 新增 expense item
const handleCreateExpenseItem = async () => {
  await addExpenseItemApi(expenseItemForm.value)
  // 关闭弹窗
  dialogExpenseFormVisible.value = false
  // 提示
  ElMessage.success('Added successfully')
  refresh()
}

// 打开表单弹窗
const openEditExpenseItemDialog = (row) => {
  expenseItemForm.value = row
  dialogExpenseFormVisible.value = true
}

// 编辑 expense
const handleEditExpenseItem = async () => {
  await modifyExpenseItemApi(expenseItemForm.value)
  // 提示
  ElMessage.success('Edit  successfully')
  refresh()
}

// 管理expense item
const handleManageExpenseItem = async () => {
  if (!expenseItemForm.value.id) {
    handleCreateExpenseItem()
  } else {
    handleEditExpenseItem()
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
  await Promise.all([getExpenseList(), getGroupList(), getUserList()])

// 监听分页数据变化
watch(
  () => pagination.currentPage,
  () => {},
)

// 监听
watch(dialogDeleteExpenseItemVisible, (val) => {
  if (!val) {
    expenseItemForm.value = {}
  }
})

watch(dialogExpenseFormVisible, (val) => {
  if (!val) {
    expenseItemForm.value = {}
  }
})

watch(
  () => pagination.currentPage,
  () => initData(),
)

// 网络请求
onMounted(async () => {
  await initData()
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
        Expense Items
      </h3>
      <el-button type="primary" @click="dialogExpenseFormVisible = true">
        Create
      </el-button>
    </div>
    <!-- tab 栏 -->
    <el-tabs v-model="activeName">
      <el-tab-pane label="All" name="All" />
      <el-tab-pane label="Vehicle Parts" name="Vehicle Parts" />
      <el-tab-pane label="Maintenance" name="Maintenance" />
      <el-tab-pane label="Fuel" name="Fuel" />
      <el-tab-pane label="Services" name="Services" />
      <el-tab-pane label="Others" name="Others" />
    </el-tabs>
    <!-- 搜索栏 -->
    <div class="flex-between">
      <div class="row-center flex-wrap gap-8">
        <!-- 组筛选 -->
        <base-filter-panel
          v-model="groupList"
          :section-list="groupFilterParams"
          condition-text="Group"
          @search="refresh"
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
          :section-list="creatorFilterParams"
          condition-text="Creator"
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
          class="h-24!"
          @click="handleClearCondition"
          v-show="hasCondition"
        >
          Clear
        </el-button>
      </div>
      <!-- 输入搜索 -->
      <base-filter-input v-model="searchKeywords" @inputChange="refresh" />
    </div>
    <!-- 表格内容 -->
    <div class="flex flex-1 flex-col justify-between">
      <el-table
        :data="expenseList"
        style="width: 100%"
        class="flex-1"
        @sort-change="handleSortChange"
      >
        <el-table-column type="selection" min-width="6%" sortable="custom" />
        <el-table-column
          prop="group"
          label="Group"
          min-width="17%"
          sortable="custom"
        />
        <el-table-column
          prop="name"
          label="Item Name"
          min-width="17%"
          sortable="custom"
        />
        <el-table-column
          prop="category"
          label="Category"
          min-width="17%"
          sortable="custom"
        />
        <el-table-column
          prop="module"
          label="Module"
          min-width="17%"
          sortable="custom"
        />
        <el-table-column
          prop="user"
          label="Creator"
          min-width="17%"
          sortable="custom"
        >
          <template #default="{ row }">
            {{ row.userDto?.name || '-' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="Creation Date"
          min-width="17%"
          sortable="custom"
        >
          <template #default="{ row }">
            {{ getDateWithDDMMMYYYY(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column min-width="6%" class="flex1111">
          <template #default="scope">
            <el-dropdown trigger="click">
              <i class="icon-more-2-line text-16 cursor-pointer" />
              <template #dropdown="{ row }">
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
  <!-- 创建 expense 弹窗 -->
  <base-dialog
    v-model="dialogExpenseFormVisible"
    title="Create Item"
    confirm-text="Create"
    @cancel="dialogExpenseFormVisible = false"
    @confirm="handleManageExpenseItem"
  >
    <template #content>
      <div class="flex flex-col gap-8">
        <div class="flex flex-col gap-8">
          <p class="heading-body-body-12px-medium text-neutrals-off-black">
            Group
          </p>
          <el-select v-model="expenseItemForm.group" placeholder="Select">
            <el-option
              v-for="item in groupFilterParams"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="flex flex-col gap-8">
          <p class="heading-body-body-12px-medium text-neutrals-off-black">
            Category
          </p>
          <el-select v-model="expenseItemForm.category" placeholder="Select">
            <el-option
              v-for="item in categoryFilterParams"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="flex flex-col gap-8">
          <p class="heading-body-body-12px-medium text-neutrals-off-black">
            Group
          </p>
          <el-input
            type="textarea"
            v-model="expenseItemForm.name"
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
        Are you sure you want to delete the "{{ expenseItemForm.name }}" under
        the "Group {{ expenseItemForm.group }}" section? Once deleted, it cannot
        be recovered.
      </p>
    </template>
  </base-dialog>
</template>

<style scoped lang="scss">
// 重置 tab 栏样式
:deep(.el-tabs__nav-wrap) {
  margin-left: 0 !important;
}

// 重置 el-input 的样式
:deep(.el-textarea) {
  .el-textarea__inner {
    @apply rounded-12 bg-[#EAEEF480];
  }
}

// 重置选择框的样式
:deep(.el-select) {
  .el-select__wrapper {
    @apply rounded-12 h-32 bg-[#EAEEF480];
  }
}
</style>
