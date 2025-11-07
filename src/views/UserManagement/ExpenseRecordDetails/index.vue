<script setup>
import { ref, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import Big from 'big.js'
import { ElMessage } from 'element-plus'
import { useCloned, useDebounceFn } from '@vueuse/core'

import {
  getExpenseListByGroupApi,
  getMerchantListApi,
  getRepairRecordDetailApi,
  updateExpenseItemCostAnalysisApi,
  updateRepairRecordApi,
} from '@/apis/userApi.js'
import BaseInfoCard from '@/components/BaseInfoCard.vue'
import { getDateWithDDMMMYYYYhhmma } from '@/utils/dateUtil.js'
import { getFormatNumberString } from '@/utils/dataFormattedUtil.js'
import { AI_COST_LEVEL, TimingPreset } from '@/utils/constantsUtil.js'
import FileInfoCard from '@/views/UserManagement/ExpenseRecordDetails/components/FileInfoCard.vue'
import { getExpenseGroupListApi, getExpenseListApi } from '@/apis/appApi.js'
import BaseDialog from '@/components/BaseDialog.vue'

// 静态资源
import ExpandIcon from '@/assets/specialIcons/arrow-down-s-line.svg'
import CollapseIcon from '@/assets/specialIcons/arrow-right-s-line.svg'
import UpIcon from '@/assets/specialIcons/fi_trending-up.svg'
import DownIcon from '@/assets/specialIcons/fi_trending-down.svg'
import CNIcon from '@/assets/specialIcons/flag_cn.svg'
import IDIcon from '@/assets/specialIcons/flag_id.svg'
import MYIcon from '@/assets/specialIcons/flag_my.svg'
import SGIcon from '@/assets/specialIcons/flag_sg.svg'
import THIcon from '@/assets/specialIcons/flag_th.svg'
import ErrorImg from '@/assets/images/error-img.png'

// 国旗映射表
const countryFlagMap = Object.freeze({
  CNY: CNIcon,
  IDR: IDIcon,
  MYR: MYIcon,
  SGD: SGIcon,
  THB: THIcon,
})

//  币种映射表
const currencyMap = Object.freeze({
  CNY: '¥',
  IDR: 'Rp',
  MYR: 'RM',
  SGD: '$',
  THB: '฿',
})

const activeTab = ref('Expense Details')

const expenseItemActiveTab = ref('all')

const route = useRoute()

// 维修记录详情
const repairRecordDetail = ref({})

// 操作日志列表
const logList = ref([
  {
    date: '15 May 2023',
    time: '9:30 am',
    user: 'Kristin Watson',
    action: 'Login',
    detail: { ip: '123.45.6', device: 'iPhone 14' },
  },
  {
    date: '15 May 2023',
    time: '9:00 am',
    user: 'Kristin Watson',
    action: 'Create Order',
    detail: { orderNo: 'ORD-00020' },
  },
])

//  编辑预估成本的弹窗
const dialogEditEstimatedCostVisible = ref(false)

// 预估成本表单
const editEstimatedCostForm = ref({
  cost: '',
  description: '',
})

// 表单校验规则
const editEstimatedCostFormRules = reactive({
  cost: [{ required: true, message: '请输入预估成本', trigger: 'blur' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
})

// 预估成本表单引用
const editEstimatedCostFormRef = ref(null)

// 选择的预估成本
const selectedEstimatedCost = ref({})

// 税前小计
const subtotal = computed(() => {
  const totalCost = Big(repairRecordDetail.value.totalCost || 0)
  const gst = Big(repairRecordDetail.value.gst || 0)
  const discount = Big(repairRecordDetail.value.discount || 0)

  // 使用 minus / plus 保证精度
  return totalCost.minus(gst).plus(discount).toFixed(2)
})

// 税前小计(含折扣)
const subtotalWithDiscount = computed(() => {
  const totalCost = Big(repairRecordDetail.value.totalCost || 0)
  const gst = Big(repairRecordDetail.value.gst || 0)

  // 使用 minus / plus 保证精度
  return totalCost.minus(gst).toFixed(2)
})

// 转换汇率后的总价
const totalCostWithExchangeRate = computed(() => {
  const totalCost = Big(repairRecordDetail.value.totalCost || 0)
  const rate = Big(repairRecordDetail.value.rate || 0)

  return (totalCost * rate).toFixed(2)
})

// 编辑模式
const isEditMode = ref(false)

// 修理厂搜索关键字
const workshopSearchKey = ref('')

// 修理厂列表
const merchantList = ref([])

// 修理厂分页参数
const workshopPagination = reactive({
  currentPage: 0,
  pageSize: 15,
  total: 0,
})

// 是否还有更多数据
const hasMoreWorkshopData = ref(true)

// expense 搜索关键字
const expenseSearchKey = ref('')

// expense 分页参数
const expensePagination = reactive({
  currentPage: 0,
  pageSize: 15,
  total: 0,
})

// expense 列表数据
const expenseList = ref([])

// 是否还有更多数据
const hasMoreExpenseData = ref(true)

// 分类参数
const categoryFilterParams = ref([])

// 组参数
const groupFilterParams = ref([])

// 加载状态
const loading = ref(false)

// 是否展开额外信息
const isShowExtraData = ref(true)

// 批量选择的expenseitem id list
const selectedExpenseItemIdList = computed(
  () =>
    (editEstimatedCostForm.value.expenseItemDtos &&
      editEstimatedCostForm.value.expenseItemDtos
        .filter((item) => item.isChecked)
        .map((item) => item.id)) ||
    [],
)

// 是否全选
const isSelectAll = computed(
  () =>
    editEstimatedCostForm.value.expenseItemDtos &&
    editEstimatedCostForm.value.expenseItemDtos.every((item) => item.isChecked),
)

// 分组形式的expense
const expenseListByGroup = ref([])

// 新增的 expense item id 数组
const selectedAddExpenseItemIdList = ref([])

// 新增expense 触发框实例
const addExpenseItemDropdownRef = ref(null)

// 记录时间
const recordTime = ref(-1)

// 详情实例
const expenseDetailsRef = ref(null)

// 账单实例
const billRef = ref(null)

// 附件实例
const attachmentRef = ref(null)

// 日志实例
const logRef = ref(null)

// 编辑模式下, 计算 Subtotal
const editingSubtotal = computed(() => {
  if (!isEditMode.value && !editEstimatedCostForm.value.expenseItemDtos) {
    // 不计算
    return
  }
  return editEstimatedCostForm.value.expenseItemDtos
    .reduce((sum, cur) => sum.plus(cur.totalAmount || 0), Big(0))
    .toNumber()
})

// 编辑模式, 计算 Discount Amount
const editingDiscountAmount = computed(() => {
  if (!isEditMode.value && !editEstimatedCostForm.value.expenseItemDtos) {
    // 不计算
    return
  }
  return editEstimatedCostForm.value.expenseItemDtos
    .reduce((sum, cur) => sum.plus(cur.discount || 0), Big(0))
    .toNumber()
})

// 编辑模式下, 计算 Subtotal with Discount Applied
const editingSubtotalWithDiscountApplied = computed(() => {
  if (!isEditMode.value && !editEstimatedCostForm.value.expenseItemDtos) {
    // 不计算
    return
  }
  return Big(editingSubtotal.value)
    .minus(editingDiscountAmount.value)
    .toNumber()
})

// 编辑模式下, 计算 Total Amount (SGD)
const editingTotalAmountWithCurrency = computed(() => {
  if (!isEditMode.value && !editEstimatedCostForm.value.expenseItemDtos) {
    // 不计算
    return
  }
  return Big(editingSubtotalWithDiscountApplied.value)
    .plus(editEstimatedCostForm.value.gst)
    .toNumber()
})

// 编辑模式下, 计算汇率转换后的总价
const editingTotalAmountWithExchangeRate = computed(() => {
  if (!isEditMode.value && !editEstimatedCostForm.value.expenseItemDtos) {
    // 不计算
    return
  }
  return Big(editingTotalAmountWithCurrency.value)
    .times(editEstimatedCostForm.value.rate)
    .toNumber()
})

// 关闭编辑预估成本的弹窗
const handleCloseEditEstimatedCostDialog = () => {
  editEstimatedCostForm.value.cost = ''
  editEstimatedCostForm.value.description = ''
  dialogEditEstimatedCostVisible.value = false
}

// 提交编辑预估成本表单
const handleEditEstimatedCostForm = async () => {
  try {
    // 验证表单
    await editEstimatedCostFormRef.value.validate()
    // 算 ratio
    const ratio = Big(editEstimatedCostForm.value.totalAmount)
      .minus(editEstimatedCostForm.value.cost)
      .div(editEstimatedCostForm.value.cost)
      .toNumber()
    await updateExpenseItemCostAnalysisApi({
      id: selectedEstimatedCost.value.id,
      avg: editEstimatedCostForm.value.cost,
      remark: editEstimatedCostForm.value.description,
      ratio: ratio,
    })
    // 提示
    ElMessage.success('Edit success')
    // 刷新
    getRepairRecordInfo(route.params.id)
  } finally {
    dialogEditEstimatedCostVisible.value = false
  }
}

// 获取维修记录详情
const getRepairRecordInfo = async (id) => {
  const { data } = await getRepairRecordDetailApi(id)
  // 深拷贝一份，避免直接改接口原始对象
  const { cloned } = useCloned(data)
  // 类型转换, String -> Number
  // cloned.value.totalCost = Number(cloned.value.totalCost)
  // cloned.value.gst = Number(cloned.value.gst)
  // cloned.value.discount = Number(cloned.value.discount)
  // cloned.value.rate = Number(cloned.value.rate)
  // 给每个 expenseItemDtos 元素加上 isExpand
  if (cloned.value.expenseItemDtos && cloned.value.expenseItemDtos.length) {
    cloned.value.expenseItemDtos = cloned.value.expenseItemDtos.map((item) => {
      // item.totalCost = Number(item.totalCost)
      // item.gst = Number(item.gst)
      // item.discount = Number(item.discount)
      // item.rate = Number(item.rate)
      // item.totalAmount = Number(item.totalAmount)
      // item.unitPrice = Number(item.unitPrice)
      return {
        ...item,
        isExpand: false,
        isChecked: false,
      }
    })
  }
  repairRecordDetail.value = cloned.value
}

// 编辑预估成本
const handleOpenEditEstimatedCostDialog = (record) => {
  const { cloned } = useCloned(record)
  selectedEstimatedCost.value = cloned.value
  // 回显表单
  editEstimatedCostForm.value = {
    cost: cloned.value.aiRepairItemDto.avg,
    description: cloned.value.aiRepairItemDto.remark,
    totalAmount: cloned.value.totalAmount,
  }
  dialogEditEstimatedCostVisible.value = true
}

// 获取修理厂列表数据
const getMerchantList = useDebounceFn(async () => {
  if (!hasMoreWorkshopData.value) {
    return
  }
  const { data, count } = await getMerchantListApi({
    searchKey: workshopSearchKey.value,
    page: workshopPagination.currentPage++,
    pageSize: workshopPagination.pageSize,
    sort: '',
    sortBy: '',
    statusKey: '',
  })
  if (!data.length) {
    ElMessage.warning('No more data')
    hasMoreWorkshopData.value = false
    return
  }
  // 记录总数
  workshopPagination.total = count
  // 记录修理厂列表
  merchantList.value.push(...data)
}, 500)

// 切换为编辑模式
const handleSwitchToEditMode = async () => {
  try {
    loading.value = true
    await Promise.all([
      getMerchantList(),
      getExpenseList(),
      getGroupList(),
      getExpenseListByGroup(),
    ])
    // 复制副本
    const { cloned } = useCloned(repairRecordDetail.value)
    editEstimatedCostForm.value = cloned.value
    // 回显日期
    recordTime.value = cloned.value.date
    // 切换为编辑模式
    isEditMode.value = true
  } finally {
    loading.value = false
  }
}

// 切换为正常模式
const handleSwitchToNormalMode = () => {
  // 重置修理厂相关数据
  workshopSearchKey.value = ''
  merchantList.value = []
  workshopPagination.currentPage = 0
  workshopPagination.pageSize = 15
  workshopPagination.total = 0
  hasMoreWorkshopData.value = true
  // 切换为正常模式
  isEditMode.value = false
}

// 获取expense列表
const getExpenseList = async () => {
  if (!hasMoreExpenseData.value) {
    return
  }

  const { data, count } = await getExpenseListApi({
    groups: '',
    categorys: '',
    modules: '',
    userIds: '',

    searchKey: expenseSearchKey.value,

    sort: '',
    sortBy: '',

    page: expensePagination.currentPage,
    pageSize: expensePagination.pageSize,
  })

  if (!data.length) {
    ElMessage.warning('No more data')
    hasMoreExpenseData.value = false
    return
  }

  // 保存 expense
  expenseList.value = data
  // 记录总条数
  expensePagination.total = count
}

// 获取分组信息
const getGroupList = async () => {
  const {
    data: { categories, groups },
  } = await getExpenseGroupListApi()
  categoryFilterParams.value = categories.map((item) => ({
    label: item,
    value: item,
  }))
  groupFilterParams.value = groups.map((item) => ({
    label: item,
    value: item,
  }))
}

const selectedAddExpenseItemList = computed(
  () =>
    isEditMode &&
    itemList.value.filter((item) =>
      selectedAddExpenseItemIdList.value.includes(item.id),
    ),
)

// 新增一行
const handleAddNewRow = () => {
  // 打开加载状态
  loading.value = true
  for (const expenseItem of selectedAddExpenseItemList.value) {
    editEstimatedCostForm.value.expenseItemDtos.push({
      id: '',
      name: expenseItem.name,
      amount: '',
      date: '',
      note: '',
      group: '',
      category: expenseItem.category,
      type: expenseItem.module,
      isExpand: false,
      isChecked: false,
    })
  }
  // 关闭加载状态
  loading.value = false
  nextTick(() => {
    // 关闭dropdown
    addExpenseItemDropdownRef.value?.handleClose()
    // 重置复选框
    selectedAddExpenseItemIdList.value = []
  })
}

// 清除额外的折扣,税率, 总计
const clearExtraData = () => {
  editEstimatedCostForm.value.discount = '0'
  editEstimatedCostForm.value.gst = '0'
  editEstimatedCostForm.value.totalCost = '0'
  // 隐藏额外数据信息
  isShowExtraData.value = false
}

// 获取额外数据
const handleGetExtraData = () => {
  editEstimatedCostForm.value.discount = repairRecordDetail.value.discount
  editEstimatedCostForm.value.gst = repairRecordDetail.value.gst
  editEstimatedCostForm.value.totalCost = repairRecordDetail.value.totalCost
  // 隐藏额外数据信息
  isShowExtraData.value = true
}

// 编辑维修记录
const handleEditRepairRecord = useDebounceFn(async () => {
  // 非空校验
  if (!editEstimatedCostForm.value.expenseItemDtos.length) {
    return ElMessage.error('Expense Item Can Not Be Empty')
  }

  try {
    await updateRepairRecordApi(editEstimatedCostForm.value)
    ElMessage.success('Edit success')
    // 刷新
    getRepairRecordInfo(route.params.id)
  } finally {
    isEditMode.value = false
  }
}, TimingPreset.DEBOUNCE)

// 全选维修记录子项
const handleCheckAll = (val) => {
  for (const expenseItem of editEstimatedCostForm.value.expenseItemDtos) {
    expenseItem.isChecked = val
  }
}

// 批量删除所选中的 expense item
const handleBatchDeleteSelectedExpenseItem = () => {
  editEstimatedCostForm.value.expenseItemDtos =
    editEstimatedCostForm.value.expenseItemDtos.filter(
      (expenseItem) =>
        !selectedExpenseItemIdList.value.includes(expenseItem.id),
    )
}

// 删除所选中的 expense item
const handleDeleteSelectedExpenseItem = (selectedExpenseItemId) => {
  editEstimatedCostForm.value.expenseItemDtos =
    editEstimatedCostForm.value.expenseItemDtos.filter(
      (expenseItem) => expenseItem.id !== selectedExpenseItemId,
    )
}

const itemList = computed(() =>
  expenseListByGroup.value.flatMap((item) => item.list),
)

// 以group进行分组的形式获取所有的expense
const getExpenseListByGroup = async () => {
  const { data } = await getExpenseListByGroupApi({
    userId: repairRecordDetail.value.userId,
    searchKey: expenseSearchKey.value,
  })
  expenseListByGroup.value = data
}

// 限制日期的选择范围
const disableDate = (time) => time.getTime() > Date.now()

// 切换标签, 滚动至指定位置
const handleTabChange = (val) => {
  if (val === 'Expense Details') {
    expenseDetailsRef.value.setScrollTop(0)
  } else if (val === 'Bills') {
    billRef.value.scrollIntoView({ behavior: 'smooth' })
  } else if (val === 'Attachments') {
    attachmentRef.value.scrollIntoView({ behavior: 'smooth' })
  } else if (val === 'Logs & Note') {
    logRef.value.scrollIntoView({ behavior: 'smooth' })
  }
}

// unit price 的输入框的 change 事件
const handleUnitPriceChange = useDebounceFn(
  (record, val) =>
    (record.totalAmount = Big(val)
      .times(record.quantity || 0) // unitPrice * quantity
      .minus(record.discount || 0) // - discount
      .plus(record.gst || 0) // - tax rate
      // .toFixed(2) // 保留两位小数
      .toNumber()), // 转为数字
  TimingPreset.DEBOUNCE,
)

// quantity 的输入框的 change 事件
const handleQuantityChange = useDebounceFn(
  (record, val) =>
    (record.totalAmount = Big(record.unitPrice)
      .times(val) // unitPrice * quantity
      .minus(record.discount || 0) // - discount
      .plus(record.gst || 0) // - tax rate
      // .toFixed(2) // 保留两位小数
      .toNumber()), // 转为数字
  TimingPreset.DEBOUNCE,
)

// discount 的输入框的 change 事件
const handleDiscountChange = useDebounceFn(
  (record, val) =>
    (record.totalAmount = Big(record.unitPrice)
      .times(record.quantity || 0) // unitPrice * quantity
      .minus(val) // - discount
      .plus(record.gst || 0) // - tax rate
      // .toFixed(2) // 保留两位小数
      .toNumber()), // 转为数字
  TimingPreset.DEBOUNCE,
)

// gst 的输入框的 change 事件
const handleGstChange = useDebounceFn(
  (record, val) =>
    (record.totalAmount = Big(record.unitPrice)
      .times(record.quantity || 0) // unitPrice * quantity
      .minus(record.discount || 0) // - discount
      .plus(val) // - tax rate
      // .toFixed(2) // 保留两位小数
      .toNumber()), // 转为数字
  TimingPreset.DEBOUNCE,
)

// total amount 的输入框的 change 事件
const handleTotalAmountChange = useDebounceFn(
  (record, val) =>
    (record.unitPrice = Big(val)
      .plus(record.discount || 0) // totalAmount + discount
      .minus(record.gst || 0) // - gst
      .div(record.quantity) // ÷ quantity
      // .toFixed(2) // 保留两位小数
      .toNumber()), // 转为数字
  TimingPreset.DEBOUNCE,
)

// 维修记录item name的下拉框的change事件
const handleItemNameChange = (val, record) => {
  // 获取所选中的 item 信息
  const selectedItem = itemList.value.find((item) => item.name === val)
  // 设置 category 信息
  record.category = selectedItem.category
  // 设置 type 信息
  record.type = selectedItem.module
}

// record time 的输入框的 change 事件
const handleRecordTimeChange = (val) => {
  editEstimatedCostForm.value.date = val
}

// 处理维修厂的选择事件
const handleMerchantDtoChange = (selectedId) => {
  const selectedItem = merchantList.value.find((item) => item.id === selectedId)
  if (selectedItem) {
    editEstimatedCostForm.value.merchantDto.id = selectedItem.id
    editEstimatedCostForm.value.merchantDto.name = selectedItem.name
  }
}

// 组件创建后, 发起请求
const {
  params: { id },
} = route

// 获取数据
getRepairRecordInfo(id)
</script>

<template>
  <section
    class="flex h-full flex-col overflow-auto pb-32"
    v-loading.fullscreen.lock="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
  >
    <div class="flex-between mx-32 mb-16">
      <!-- header -->
      <h2
        class="heading-h2-20px-medium text-neutrals-off-black leading-30 row-center h-32"
      >
        Expense Records Details
      </h2>
      <el-button
        v-show="!isEditMode"
        type="primary"
        @click="handleSwitchToEditMode"
      >
        Edit
      </el-button>
      <div v-show="isEditMode">
        <el-button @click="handleSwitchToNormalMode">Cancel</el-button>
        <el-button type="primary" @click="handleEditRepairRecord">
          Save
        </el-button>
      </div>
    </div>
    <!-- tabs -->
    <el-tabs
      v-model="activeTab"
      class="has-top mb-16"
      @tab-change="handleTabChange"
    >
      <el-tab-pane label="Expense Details" name="Expense Details" />
      <el-tab-pane label="Bills" name="Bills" />
      <el-tab-pane label="Attachments" name="Attachments" />
      <el-tab-pane label="Logs & Note" name="Logs & Note" />
    </el-tabs>
    <el-scrollbar ref="expenseDetailsRef">
      <!-- details -->
      <dl
        class="[&>dt]:leading-32 [&>dd]:leading-32 [&>dd]:row-center input--underline [&>dt]:row-center mx-32 mb-24 grid grid-cols-[112px_1fr_112px_1fr] gap-x-8 gap-y-20 [&>dd]:min-h-32 [&>dt]:min-h-32"
      >
        <dt>Workshop</dt>
        <dd>
          <base-info-card
            :logo="repairRecordDetail.merchantDto?.logo"
            :name="repairRecordDetail.merchantDto?.name"
            v-if="!isEditMode"
          />
          <el-select
            v-model="editEstimatedCostForm.merchantDto.id"
            class="select--underline"
            placeholder="Select"
            @change="handleMerchantDtoChange"
            v-else
          >
            <el-option
              v-for="item in merchantList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </dd>
        <dt>Mileage</dt>
        <dd>
          <span v-if="!isEditMode">{{ repairRecordDetail.mileage }} km</span>
          <el-input
            v-model.number="editEstimatedCostForm.mileage"
            placeholder="Enter"
            v-else
          >
            <template #suffix>
              <span>km</span>
            </template>
          </el-input>
        </dd>
        <dt>Date</dt>
        <dd class="date-container">
          <span v-if="!isEditMode">
            {{ getDateWithDDMMMYYYYhhmma(repairRecordDetail.date) }}
          </span>
          <el-date-picker
            v-model="recordTime"
            type="date"
            placeholder="Select"
            format="DD MMM YYYY"
            value-format="x"
            :disabled-date="disableDate"
            v-else
            @change="handleRecordTimeChange"
          />
        </dd>
        <dt>Note</dt>
        <dd class="note-container">
          <p class="whitespace-pre" v-show="!isEditMode">
            {{ repairRecordDetail.note || '-' }}
          </p>
          <el-input
            v-model="editEstimatedCostForm.note"
            placeholder="Enter"
            type="textarea"
            :row="4"
            v-show="isEditMode"
          />
        </dd>
      </dl>
      <!-- items table -->
      <div class="mb-24">
        <!-- header -->
        <div class="flex-between mx-32 h-24">
          <div class="row-center h-24">
            <h3
              class="heading-body-large-body-14px-medium text-neutrals-off-black leading-20 row-center h-24"
            >
              Items
            </h3>
            <span
              class="heading-body-large-body-14px-medium text-neutrals-grey-3 ml-8"
            >
              {{ repairRecordDetail.expenseItemDtos?.length || '0' }}
            </span>
          </div>
          <el-button
            text
            type="primary"
            v-show="isShowExtraData && isEditMode"
            @click="clearExtraData"
          >
            <template #icon>
              <i class="icon-typesclose text-neutrals-blue" />
            </template>
            <template #default>
              <span>Clear Extra Discount & Tax</span>
            </template>
          </el-button>
          <el-button
            text
            type="primary"
            v-show="!isShowExtraData && isEditMode"
            @click="handleGetExtraData"
          >
            <template #icon>
              <i class="icon-typesadd text-neutrals-blue" />
            </template>
            <template #default>
              <span>Extra Discount & Tax</span>
            </template>
          </el-button>
        </div>
        <!-- divider -->
        <el-divider class="mt-8!" />
        <!-- table -->
        <div class="items-table-container mx-32">
          <!-- Batch delete -->
          <div
            class="flex-between h-42"
            v-show="selectedExpenseItemIdList.length"
          >
            <span
              class="text-neutrals-off-black heading-body-body-12px-regular"
            >
              {{ selectedExpenseItemIdList.length }} selected
            </span>
            <el-button @click="handleBatchDeleteSelectedExpenseItem">
              Delete
            </el-button>
          </div>
          <!-- header -->
          <el-row>
            <el-col :span="isEditMode ? 1 : 1">
              <el-checkbox
                v-show="isEditMode"
                @change="handleCheckAll"
                v-model="isSelectAll"
              />
            </el-col>
            <el-col :span="isEditMode ? 6 : 6">Item</el-col>
            <el-col :span="isEditMode ? 4 : 3">Category</el-col>
            <el-col :span="isEditMode ? 2 : 3">Unit Price</el-col>
            <el-col :span="isEditMode ? 2 : 2">Qty</el-col>
            <el-col :span="isEditMode ? 2 : 3">Discount</el-col>
            <el-col :span="isEditMode ? 2 : 3">Tax Rate</el-col>
            <el-col :span="isEditMode ? 4 : 3" class="flex-end!">
              Total Amount
            </el-col>
            <el-col v-show="isEditMode" :span="isEditMode ? 1 : 0" />
          </el-row>
          <template v-if="repairRecordDetail.expenseItemDtos?.length">
            <!-- 非编辑模式: 显示明细行 -->
            <template v-if="!isEditMode">
              <template
                v-for="record in repairRecordDetail.expenseItemDtos"
                :key="record.id"
              >
                <!-- body -->
                <el-row
                  :class="{
                    'bg-status-colours-light-blue': record.isExpand,
                    'no-hover-cursor': !record.aiRepairItemDto.id,
                  }"
                  @click.stop="record.isExpand = !record.isExpand"
                >
                  <el-col :span="1">
                    <el-image
                      v-if="record.aiRepairItemDto.id"
                      :src="record.isExpand ? ExpandIcon : CollapseIcon"
                      class="h-16 w-16 cursor-pointer"
                      fit="cover"
                      @click.stop="record.isExpand = !record.isExpand"
                    />
                  </el-col>
                  <el-col :span="6">{{ record.name }}</el-col>
                  <el-col :span="3">{{ record.category }}</el-col>
                  <el-col :span="3">
                    {{ getFormatNumberString(record.unitPrice) }}
                  </el-col>
                  <el-col :span="2">{{ record.quantity }}</el-col>
                  <el-col :span="3">
                    {{ getFormatNumberString(record.discount) }}
                  </el-col>
                  <el-col :span="3">
                    {{ getFormatNumberString(record.gst) }}
                  </el-col>
                  <el-col :span="3" class="row-center">
                    <el-image
                      v-if="record.aiRepairItemDto.level === AI_COST_LEVEL.HIGH"
                      :src="UpIcon"
                      class="mr-8 h-16 w-16"
                      fit="cover"
                    />
                    <el-image
                      v-else-if="
                        record.aiRepairItemDto.level === AI_COST_LEVEL.LOW
                      "
                      :src="DownIcon"
                      class="mr-8 h-16 w-16"
                      fit="cover"
                    />
                    <span class="add-prefix-dollar-sign">
                      {{ getFormatNumberString(record.totalAmount) }}
                    </span>
                  </el-col>
                </el-row>
                <!-- expand row -->
                <el-row
                  v-if="record.aiRepairItemDto.id && record.isExpand"
                  :class="[
                    'is-expand',
                    'no-hover-cursor',
                    { 'bg-neutrals-off-white': record.isExpand },
                  ]"
                >
                  <el-col :span="1" />
                  <el-col :span="23">
                    <!-- cost analysis header -->
                    <div class="row-center flex gap-8">
                      <h4
                        class="heading-body-body-12px-medium text-neutrals-grey-4 leading-16"
                      >
                        Cost Analysis
                      </h4>
                      <i
                        class="icon-edit-line text-16 text-neutrals-grey-3 cursor-pointer"
                        @click="handleOpenEditEstimatedCostDialog(record)"
                      />
                    </div>
                    <div>
                      <el-image
                        v-if="
                          record.aiRepairItemDto.level === AI_COST_LEVEL.HIGH
                        "
                        :src="UpIcon"
                        class="mr-8 h-16 w-16"
                        fit="cover"
                      />
                      <el-image
                        v-else-if="
                          record.aiRepairItemDto.level === AI_COST_LEVEL.LOW
                        "
                        :src="DownIcon"
                        class="mr-8 h-16 w-16"
                        fit="cover"
                      />
                      <span
                        :class="{
                          'text-status-colours-red':
                            record.aiRepairItemDto.level === -1,
                          'text-status-colours-green':
                            record.aiRepairItemDto.level === 2,
                        }"
                      >
                        {{ Big(record.aiRepairItemDto.ratio).times(100) }} %
                      </span>
                      <p
                        class="heading-body-body-12px-medium text-neutrals-off-black"
                      >
                        Market Average: ${{
                          getFormatNumberString(record.aiRepairItemDto.avg)
                        }}
                        · Your Price: ${{
                          getFormatNumberString(record.totalAmount)
                        }}
                      </p>
                      <p
                        class="heading-body-body-12px-medium text-neutrals-off-black"
                      >
                        {{ record.aiRepairItemDto.remark }}
                      </p>
                    </div>
                  </el-col>
                </el-row>
              </template>
            </template>
            <!-- 编辑模式: 显示编辑表格 -->
            <template v-else>
              <template
                v-for="(record, index) in editEstimatedCostForm.expenseItemDtos"
                :key="record.id"
              >
                <el-row
                  class="edit-row no-hover-cursor input--bg-neutrals-grey-1 select--bg-neutrals-grey-1"
                >
                  <el-col :span="1">
                    <el-checkbox v-model="record.isChecked" />
                  </el-col>
                  <el-col :span="6">
                    <el-select
                      v-model="record.name"
                      filterable
                      @change="(val) => handleItemNameChange(val, record)"
                    >
                      <el-option
                        v-for="item in itemList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name"
                      />
                    </el-select>
                  </el-col>
                  <el-col :span="4">
                    <el-select v-model="record.category">
                      <el-option
                        v-for="category in categoryFilterParams"
                        :key="category.label"
                        :label="category.label"
                        :value="category.value"
                      />
                    </el-select>
                  </el-col>
                  <el-col :span="2">
                    <el-input
                      type="number"
                      v-model.number="record.unitPrice"
                      @input="(val) => handleUnitPriceChange(record, val)"
                    />
                  </el-col>
                  <el-col :span="2">
                    <el-input
                      type="number"
                      v-model.number="record.quantity"
                      @input="(val) => handleQuantityChange(record, val)"
                    />
                  </el-col>
                  <el-col :span="2">
                    <el-input
                      type="number"
                      v-model.number="record.discount"
                      @input="(val) => handleDiscountChange(record, val)"
                    />
                  </el-col>
                  <el-col :span="2">
                    <el-input
                      type="number"
                      v-model.number="record.gst"
                      @input="(val) => handleGstChange(record, val)"
                    />
                  </el-col>
                  <el-col :span="4" class="text-end">
                    <!--  record.unitPrice *  record.quantity - record.discount + record.gst  -->
                    <el-input
                      type="number"
                      v-model.number="record.totalAmount"
                      @input="(val) => handleTotalAmountChange(record, val)"
                    />
                  </el-col>
                  <el-col :span="1" class="justify-center!">
                    <i
                      class="icon-delete-bin-line cursor-pointer"
                      @click="handleDeleteSelectedExpenseItem(record.id)"
                    />
                  </el-col>
                </el-row>
                <!-- Extra Discount & Tax -->
                <el-row
                  class="edit-row no-hover-cursor input--bg-neutrals-grey-1"
                  v-show="
                    isShowExtraData &&
                    index === editEstimatedCostForm.expenseItemDtos.length - 1
                  "
                >
                  <el-col :span="1" />
                  <el-col :span="6" />
                  <el-col :span="4" />
                  <el-col :span="4">
                    <span
                      class="heading-body-body-12px-medium text-neutrals-off-black"
                    >
                      Extra Discount & Tax
                    </span>
                  </el-col>
                  <el-col :span="2">
                    <el-input
                      placeholder="0.00"
                      v-model.number="editEstimatedCostForm.discount"
                    />
                  </el-col>
                  <el-col :span="2">
                    <el-input
                      placeholder="0.00"
                      v-model.number="editEstimatedCostForm.gst"
                    />
                  </el-col>
                  <el-col :span="4" />
                  <el-col :span="1" class="justify-center!">
                    <i
                      class="icon-delete-bin-line cursor-pointer"
                      @click="clearExtraData"
                    />
                  </el-col>
                </el-row>
              </template>
            </template>
            <!-- billing summary row -->
            <el-row v-if="!isEditMode" class="billing-summary no-hover-cursor">
              <el-col :span="12" />
              <el-col :span="12">
                <div class="mb-12 flex w-full flex-col gap-16">
                  <!-- item -->
                  <dl
                    class="[&>dd]:flex-end grid grid-cols-[1fr_auto] gap-x-8 gap-y-16 px-8 pt-12 [&>dd]:flex"
                  >
                    <dt>Subtotal (Excluding Tax)</dt>
                    <dd>
                      <span class="text-neutrals-off-black">
                        {{ getFormatNumberString(subtotal) }}
                      </span>
                    </dd>
                    <dt>Discount Amount</dt>
                    <dd>
                      <span class="text-neutrals-off-black">
                        {{ getFormatNumberString(repairRecordDetail.discount) }}
                      </span>
                    </dd>
                    <dt>Subtotal with Discount Applied</dt>
                    <dd>
                      <span class="text-neutrals-off-black">
                        {{ getFormatNumberString(subtotalWithDiscount) }}
                      </span>
                    </dd>
                    <dt>Tax</dt>
                    <dd>
                      <span class="text-neutrals-off-black">
                        {{ getFormatNumberString(repairRecordDetail.gst) }}
                      </span>
                    </dd>
                  </dl>
                  <el-divider />
                  <!-- Total Amount (SGD) -->
                  <div class="flex-between text-neutrals-off-black px-8">
                    <p class="heading-body-large-body-14px-medium">
                      Total Amount (SGD)
                    </p>
                    <span class="heading-body-large-body-14px-medium">
                      ${{ getFormatNumberString(repairRecordDetail.totalCost) }}
                    </span>
                  </div>
                  <!-- total amount convert -->
                  <div
                    class="rounded-8 flex flex-col gap-16 bg-[#EAEEF480] p-8"
                  >
                    <!-- Currency Rate -->
                    <div class="flex-between text-neutrals-off-black">
                      <p
                        class="heading-body-large-body-14px-medium text-neutrals-grey-4"
                      >
                        Currency Rate
                      </p>
                      <div class="row-center gap-4">
                        <div
                          class="row-center heading-body-body-12px-medium text-neutrals-off-black gap-4"
                        >
                          <el-avatar
                            :size="16"
                            :src="SGIcon"
                            @error="() => true"
                            class="border-neutral-grey-1-1px!"
                          >
                            <el-image :src="ErrorImg" class="h-16" />
                          </el-avatar>
                          <span class="heading-body-body-12px-medium">1</span>
                          <span class="heading-body-body-12px-medium">SGD</span>
                          <span class="heading-body-body-12px-medium">=</span>
                          <el-avatar
                            :size="16"
                            :src="countryFlagMap[repairRecordDetail.currency]"
                            @error="() => true"
                            class="border-neutral-grey-1-1px!"
                          >
                            <el-image :src="ErrorImg" class="h-16" />
                          </el-avatar>
                          <span class="heading-body-body-12px-medium">
                            {{ repairRecordDetail.rate }}
                          </span>
                          <span class="heading-body-body-12px-medium">
                            {{ repairRecordDetail.currency }}
                          </span>
                        </div>
                        <!-- TODO 10/24, 月姐说暂时没有修改汇率的功能 -->
                        <!--<i class="icon-edit-line text-16 text-neutrals-grey-3" />-->
                      </div>
                    </div>
                    <div class="flex-between text-neutrals-off-black">
                      <p class="heading-body-large-body-14px-medium">
                        Total Amount ({{ repairRecordDetail.currency }})
                      </p>
                      <span class="heading-body-large-body-14px-medium">
                        {{ currencyMap[repairRecordDetail.currency]
                        }}{{ getFormatNumberString(totalCostWithExchangeRate) }}
                      </span>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-row v-else class="billing-summary no-hover-cursor">
              <el-col :span="12" class="items-start! justify-start!">
                <el-dropdown
                  trigger="click"
                  placement="bottom-start"
                  ref="addExpenseItemDropdownRef"
                >
                  <el-button text type="primary">
                    <template #default>
                      <span>New Item</span>
                    </template>
                    <template #icon>
                      <i class="icon-typesadd text-neutrals-blue" />
                    </template>
                  </el-button>
                  <template #dropdown>
                    <div class="h-344 rounded-12">
                      <el-input
                        class="input--without-border h-39"
                        placeholder="Enter"
                        v-model="expenseSearchKey"
                      >
                        <template #prefix>
                          <i class="icon-mail-send-line-1" />
                        </template>
                      </el-input>
                      <el-divider />
                      <div class="px-16 py-8">
                        <!-- group 分类-->
                        <el-tabs
                          v-model="expenseItemActiveTab"
                          class="no-bottom tabs-container"
                        >
                          <el-tab-pane label="All" name="all" />

                          <el-tab-pane
                            label="Vehicle Parts"
                            name="Vehicle Parts"
                          />
                          <el-tab-pane label="Maintenance" name="Maintenance" />
                          <el-tab-pane label="Fuel" name="Fuel" />
                          <el-tab-pane label="Services" name="Services" />
                          <el-tab-pane label="Others" name="Others" />
                        </el-tabs>
                        <!-- batch select -->
                        <div
                          class="flex-between h-32"
                          v-show="selectedAddExpenseItemList.length"
                        >
                          <span
                            class="heading-body-body-12px-regular text-neutrals-off-black"
                          >
                            {{ selectedAddExpenseItemList.length }} selected
                          </span>
                          <div>
                            <el-button
                              size="small"
                              @click.stop="selectedAddExpenseItemIdList = []"
                            >
                              Clear
                            </el-button>
                            <el-button
                              size="small"
                              type="primary"
                              @click.stop="handleAddNewRow"
                            >
                              Add
                            </el-button>
                          </div>
                        </div>
                        <el-checkbox-group
                          v-model="selectedAddExpenseItemIdList"
                        >
                          <div
                            class="py-8"
                            v-for="group in groupFilterParams"
                            :key="group.value"
                            v-show="
                              expenseItemActiveTab === 'all' ||
                              expenseItemActiveTab === group.value
                            "
                          >
                            <h4
                              class="heading-body-body-12px-medium text-neutrals-grey-3 leading-16 h-17 row-center"
                            >
                              {{ group.label }}
                            </h4>
                            <div
                              class="gap gap-x-107 mt-4 grid grid-cols-2 gap-y-4"
                            >
                              <template
                                v-for="(item, index) in expenseListByGroup"
                                :key="`${index}${item.group}${index}`"
                              >
                                <template v-if="item.group === group.value">
                                  <!-- expense item 搜索时, 忽略大小写 -->
                                  <template
                                    v-for="listItem in expenseSearchKey
                                      ? item.list.filter((x) =>
                                          x.name
                                            .toLowerCase()
                                            .includes(
                                              expenseSearchKey.toLowerCase(),
                                            ),
                                        )
                                      : item.list"
                                    :key="listItem.id"
                                  >
                                    <el-checkbox
                                      :label="listItem.name"
                                      :value="listItem.id"
                                      size="small"
                                    />
                                  </template>
                                </template>
                              </template>
                            </div>
                          </div>
                        </el-checkbox-group>
                      </div>
                    </div>
                  </template>
                </el-dropdown>
              </el-col>
              <el-col :span="12">
                <div class="mb-12 flex w-full flex-col gap-16">
                  <!-- item -->
                  <dl
                    class="[&>dd]:flex-end grid grid-cols-[1fr_auto] gap-x-8 gap-y-16 px-8 pt-12 [&>dd]:flex"
                  >
                    <dt>Subtotal (Excluding Tax)</dt>
                    <dd>
                      <span class="text-neutrals-off-black">
                        {{ getFormatNumberString(editingSubtotal) }}
                      </span>
                    </dd>
                    <dt>Discount Amount</dt>
                    <dd>
                      <span class="text-neutrals-off-black">
                        {{
                          getFormatNumberString(editEstimatedCostForm.discount)
                        }}
                      </span>
                    </dd>
                    <dt>Subtotal with Discount Applied</dt>
                    <dd>
                      <span class="text-neutrals-off-black">
                        {{
                          getFormatNumberString(
                            editingSubtotalWithDiscountApplied,
                          )
                        }}
                      </span>
                    </dd>
                    <dt>Tax</dt>
                    <dd>
                      <span class="text-neutrals-off-black">
                        {{ getFormatNumberString(editEstimatedCostForm.gst) }}
                      </span>
                    </dd>
                  </dl>
                  <el-divider />
                  <!-- Total Amount (SGD) -->
                  <div class="flex-between text-neutrals-off-black px-8">
                    <p class="heading-body-large-body-14px-medium">
                      Total Amount (SGD)
                    </p>
                    <span class="heading-body-large-body-14px-medium">
                      ${{
                        getFormatNumberString(editingTotalAmountWithCurrency)
                      }}
                    </span>
                  </div>
                  <!-- total amount convert -->
                  <div
                    class="rounded-8 flex flex-col gap-16 bg-[#EAEEF480] p-8"
                  >
                    <!-- Currency Rate -->
                    <div class="flex-between text-neutrals-off-black">
                      <p
                        class="heading-body-large-body-14px-medium text-neutrals-grey-4"
                      >
                        Currency Rate
                      </p>
                      <div class="row-center gap-4">
                        <div
                          class="row-center heading-body-body-12px-medium text-neutrals-off-black gap-4"
                        >
                          <el-avatar
                            :size="16"
                            :src="SGIcon"
                            @error="() => true"
                            class="border-neutral-grey-1-1px!"
                          >
                            <el-image :src="ErrorImg" class="h-16" />
                          </el-avatar>
                          <span class="heading-body-body-12px-medium">1</span>
                          <span class="heading-body-body-12px-medium">SGD</span>
                          <span class="heading-body-body-12px-medium">=</span>
                          <el-avatar
                            :size="16"
                            :src="
                              countryFlagMap[editEstimatedCostForm.currency]
                            "
                            @error="() => true"
                            class="border-neutral-grey-1-1px!"
                          >
                            <el-image :src="ErrorImg" class="h-16" />
                          </el-avatar>
                          <span class="heading-body-body-12px-medium">
                            {{ editEstimatedCostForm.rate }}
                          </span>
                          <span class="heading-body-body-12px-medium">
                            {{ editEstimatedCostForm.currency }}
                          </span>
                        </div>
                        <!-- TODO 10/24, 月姐说暂时没有修改汇率的功能 -->
                        <!--<i class="icon-edit-line text-16 text-neutrals-grey-3" />-->
                      </div>
                    </div>
                    <div class="flex-between text-neutrals-off-black">
                      <p class="heading-body-large-body-14px-medium">
                        Total Amount ({{ editEstimatedCostForm.currency }})
                      </p>
                      <span class="heading-body-large-body-14px-medium">
                        {{ currencyMap[editEstimatedCostForm.currency]
                        }}{{ editingTotalAmountWithExchangeRate }}
                      </span>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </template>
          <el-empty v-else description="No expense record data" />
        </div>
      </div>
      <!-- bills -->
      <div class="mb-24" ref="billRef">
        <!-- header -->
        <div class="row-center mx-32 flex h-24 gap-8">
          <h3
            class="heading-body-large-body-14px-medium text-neutrals-off-black leading-20 row-center h-24"
          >
            Bills
          </h3>
          <span
            class="heading-body-large-body-14px-medium text-neutrals-grey-3"
          >
            {{ repairRecordDetail.ticketDtos?.length || '-' }}
          </span>
        </div>
        <!-- divider -->
        <el-divider class="mt-8! mb-12!" />
        <!-- bills grid view -->
        <div
          class="mx-32 grid grid-cols-2 gap-12"
          v-if="repairRecordDetail.ticketDtos?.length"
        >
          <file-info-card
            v-for="item in repairRecordDetail.ticketDtos"
            :key="item.id"
            :info="item"
          />
        </div>
        <el-empty v-else description="No bill data" />
      </div>
      <!-- Attachments -->
      <div class="mb-24" ref="attachmentRef">
        <!-- header -->
        <div class="row-center mx-32 flex h-24 gap-8">
          <h3
            class="heading-body-large-body-14px-medium text-neutrals-off-black leading-20 row-center h-24"
          >
            Attachments
          </h3>
          <span
            class="heading-body-large-body-14px-medium text-neutrals-grey-3"
          >
            {{ repairRecordDetail.attachmentDtos?.length || 0 }}
          </span>
        </div>
        <!-- divider -->
        <el-divider class="mt-8! mb-12!" />
        <!-- attachment grid view -->
        <div
          class="mx-32 grid grid-cols-2 gap-12"
          v-if="repairRecordDetail.attachmentDtos?.length"
        >
          <file-info-card
            v-for="item in repairRecordDetail.attachmentDtos"
            :key="item.id"
            :info="item"
          />
        </div>
        <el-empty v-else description="No attachment data" />
      </div>
      <!-- Logs & Note -->
      <div class="flex flex-col gap-8" ref="logRef">
        <!-- header -->
        <h3
          class="heading-body-large-body-14px-medium text-neutrals-off-black row-center mx-32 h-24"
        >
          Logs & Note
        </h3>
        <!-- divider -->
        <el-divider />
        <!-- table -->
        <div class="mx-32">
          <el-table :data="logList" class="log-table-container">
            <el-table-column prop="date" label="Date" min-width="160" />
            <el-table-column prop="time" label="Time" min-width="120" />
            <el-table-column prop="user" label="User" min-width="160" />
            <el-table-column prop="action" label="Action" min-width="140" />
            <el-table-column label="Detail" min-width="220">
              <template #default="{ row }">
                <div v-if="row.action === 'Login'">
                  <span>IP:</span>
                  {{ row.detail.ip }}
                  <span class="mx-8">|</span>
                  <span>Device:</span>
                  {{ row.detail.device }}
                </div>
                <div v-else-if="row.action === 'Create Order'">
                  <span>Order No.</span>
                  {{ row.detail.orderNo }}
                </div>
                <div v-else>
                  {{ row.detailText ?? '' }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-scrollbar>
  </section>
  <!-- 编辑预估成本的弹窗  -->
  <base-dialog
    v-model="dialogEditEstimatedCostVisible"
    title="Edit Cost Analysis"
    confirm-text="Save"
    @cancel="handleCloseEditEstimatedCostDialog"
    @confirm="handleEditEstimatedCostForm"
    :show-close-button="true"
  >
    <template #content>
      <el-form
        :model="editEstimatedCostForm"
        ref="editEstimatedCostFormRef"
        :rules="editEstimatedCostFormRules"
        label-position="top"
        class="input--underline el-form-item--inline"
        hide-required-asterisk
      >
        <!-- Title -->
        <el-form-item label="Market Average ($)" prop="cost">
          <el-input
            v-model.number="editEstimatedCostForm.cost"
            placeholder="Enter cost"
          />
        </el-form-item>

        <!-- Content -->
        <el-form-item label="Description" prop="description">
          <el-input
            type="textarea"
            :rows="4"
            v-model="editEstimatedCostForm.description"
            placeholder="Enter description"
          />
        </el-form-item>
      </el-form>
    </template>
  </base-dialog>
</template>

<style scoped lang="scss">
.items-table-container :deep(.el-row) {
  @apply text-14 leading-16 text-neutrals-grey-4 default-transition min-h-32 py-8 font-medium;
  border-bottom: 1px solid $neutrals-grey-1;

  // columns 样式
  .el-col {
    @apply row-center;

    // 首列的样式
    &:first-child {
      @apply justify-center;
    }

    // 列间间距
    &:not(:first-child):not(:last-child) {
      @apply pl-8;
    }

    // 最后一列的样式
    &:last-child {
      @apply flex justify-end pr-8;
    }
  }

  // 非首行的样式
  &:not(.no-hover-cursor):not(:first-child) {
    @apply hover:bg-status-colours-light-blue cursor-pointer;
  }

  // 展开行的样式
  &.is-expand {
    @apply h-auto leading-normal;

    .el-col {
      // 最后一列的样式
      &:last-child {
        @apply flex flex-col items-start justify-start gap-8 py-16 pl-8;
      }
    }
  }

  // 账单总结所在行的样式
  &.billing-summary {
    @apply h-auto cursor-default border-none leading-normal hover:bg-transparent;

    .el-col {
      // 最后一列的样式
      &:last-child {
        @apply flex flex-col items-start justify-start pr-0;
      }
    }
  }

  // 编辑行的样式
  &.edit-row {
    @apply h-48;

    // columns 样式
    .el-col {
      // 最后一列的样式
      &:last-child {
        @apply justify-start pl-8 pr-0;
      }
    }
  }
}

/* TODO 无日志数据, 文字暂时置灰 */
.log-table-container {
  :deep(.el-table__row) {
    @apply text-neutrals-grey-2;
  }
}

// 日期选择容器
.date-container {
  :deep(.el-date-editor--date) {
    @apply border-1! box-border w-full border-solid border-none border-[#CACFD8] bg-transparent;

    .el-input__prefix {
      @apply hidden;
    }

    .el-input__inner {
      @apply h-32;
    }

    // 自定义后置图标
    .el-input__suffix {
      @apply row-center relative;

      &::after {
        margin-left: 4px;
        content: '';
        display: block;
        width: 16px;
        height: 16px;
        background-color: currentColor; // 用文字颜色填充
        -webkit-mask: url('@/assets/specialIcons/calendar-icon.svg') no-repeat
          center;
        mask: url('@/assets/specialIcons/calendar-icon.svg') no-repeat center;
        -webkit-mask-size: contain;
        mask-size: contain;
      }
    }
  }
}

// tabs 样式重置
.tabs-container {
  :deep(.el-tabs__nav-wrap) {
    @apply ml-0;
  }

  :deep(.el-tabs__item) {
    @apply h-29!;
  }
}

// 重置note文本框样式
.note-container {
  :deep(.el-textarea__inner) {
    @apply bg-transparent;
  }
}

// 重置让输入框的文字居右
:deep(.el-col) {
  &.text-end {
    .el-input__inner {
      @apply text-align-end;
    }
  }
}
</style>
