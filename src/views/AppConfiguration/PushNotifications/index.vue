<script setup>
import { watch, ref } from 'vue'
import { useCloned, useDebounceFn } from '@vueuse/core'
import dayjs from 'dayjs'

import BaseFilterPanel from '@/components/BaseFilterPanel.vue'
import BaseFilterInput from '@/components/BaseFilterInput.vue'
import BasePagination from '@/components/BasePagination.vue'
import { TimingPreset } from '@/utils/constantsUtil.js'
import BaseDialog from '@/components/BaseDialog.vue'
import {
  createPushTaskApi,
  deletePushTaskApi,
  editPushTaskApi,
  getPushTaskListApi,
  getPushTaskUserListApi,
} from '@/apis/appApi.js'
import { ElMessage } from 'element-plus'
import { getOBDVersionListApi } from '@/apis/obdApi.js'
import { getFirstLetter, getFullFilePath } from '@/utils/dataFormattedUtil.js'
import BaseTag from '@/components/BaseTag.vue'
import { getDateWithDDMMMYYYYhhmma } from '@/utils/dateUtil.js'
import { useSort } from '@/composables/useSort.js'
import { getUserListApi } from '@/apis/userApi.js'

// 通知列表
const notificationList = ref([])

// 当前的时间戳
const currentTimestamp = ref(dayjs().valueOf())

// 通知类型筛选参数
const typeList = ref([])

const typeKeys = computed(() =>
  typeList.value.length ? typeList.value.join(',') : '',
)

const typeFilterParams = ref([
  {
    label: 'Order',
    value: 'Order',
  },
  {
    label: 'System',
    value: 'System',
  },
  {
    label: 'Brakes',
    value: 'Brakes',
  },
  {
    label: 'Liked',
    value: 'Liked',
  },
  {
    label: 'Collected',
    value: 'Collected',
  },
  {
    label: 'Commented',
    value: 'Commented',
  },
])

// OBD 版本筛选参数
const obdVersionList = ref([])

const obdVersionKeys = computed(() =>
  obdVersionList.value.length ? obdVersionList.value.join(',') : '',
)

const obdVersionFilterParams = ref([])

// 用户账户状态筛选参数
const userStatusList = ref([])

const userStatusKeys = computed(() =>
  userStatusList.value.length ? userStatusList.value.join(',') : '',
)

const userStatusFilterParams = ref([])

// 被选择的用户的完整信息的列表
const selectedUserList = computed(() =>
  userStatusFilterParams.value.filter((userInfo) =>
    userStatusList.value.includes(userInfo.value),
  ),
)

// 用户搜索条件
const userSearchText = ref('')

// app平台类型筛选参数
const applicationTypeList = ref([])

const applicationKeys = computed(() =>
  applicationTypeList.value.length ? applicationTypeList.value.join(',') : '',
)

const applicationFilterParams = ref([
  {
    label: 'iOS',
    value: 'iOS',
  },
  {
    label: 'Android',
    value: 'Android',
  },
])

// 实际发送时间筛选参数
const actualSentTimeList = ref([])

const actualSentTimeKeys = computed(() => {
  if (!actualSentTimeList.value || actualSentTimeList.value.length !== 2) {
    return []
  }
  return actualSentTimeList.value
    .map((date) => new Date(date).getTime())
    .join(',')
})

// 分页数据
const pagination = reactive({
  currentPage: 0,
  pageSize: 15,
  total: 0,
})

// 是否有筛选条件
const hasCondition = computed(
  () =>
    typeList.value.length ||
    obdVersionList.value.length ||
    userStatusList.value.length ||
    applicationTypeList.value.length ||
    actualSentTimeList.value.length,
)

// 输入搜索关键字
const searchKeywords = ref('')

// 勾选的消息通知
const selectedNotificationIdList = ref([])

// 批量删除弹窗
const dialogBatchDeleteNotificationItemVisible = ref(false)

// 详情弹窗
const dialogNotificationDetailsVisible = ref(false)

// 表单弹窗
const dialogNotificationFormVisible = ref(false)

// Notification 表单
const notificationForm = ref({
  title: '',
  content: '',
  type: 'System',
  obdVersion: 'all',
  applicationType: 'all',
  userStatus: '', // all / selected
  sendTime: '', // 推送任务的目标时间戳
  scheduleTime: '',
})

// 条件搜索参数
const conditionParams = reactive({
  sortBy: '',
  sort: '',
})

// 日期选择器
const datePickerVisible = computed(
  () => notificationForm.value.sendTime === 'schedule',
)

// 用户选择器
const userSelectorVisible = computed(
  () => notificationForm.value.userStatus === 'selected',
)

// 实际发送时间显示文字
const actualSendTimeRangeDisplay = computed(() =>
  actualSentTimeList.value.length
    ? `Actual Sent Time: ${actualSentTimeList.value.join(' ~ ')}`
    : 'Actual Sent Time',
)

// 筛选有值时的边框颜色
const conditionBorderColor = computed(() =>
  actualSentTimeList.value.length ? '#006BF7' : ' #CACFD8',
)

// 是否选择了推送用户
const hasPushUser = computed(() => {
  const { userStatus } = notificationForm.value

  // 情况 1：userStatus 为空 → 没有选择
  if (!userStatus) return false

  // 情况 2：userStatus 为 custom，但 userStatusKeys 为空 → 没有选择
  if (userStatus === 'custom' && !userStatusKeys.value) return false

  return true
})

// 是否选择了推送时间
const hasPushTime = computed(() => {
  const { sendTime, scheduleTime } = notificationForm.value

  // 情况 1：sendTime 为空字符串、null 或 undefined → 没有选择
  if (sendTime === '' || sendTime === null || sendTime === undefined) {
    return false
  }

  // 情况 2：sendTime 为 'schedule'，但 scheduleTime 为空 → 没有选择
  if (sendTime === 'schedule' && !scheduleTime) {
    return false
  }

  // 其他情况（包括 sendTime === 0）→ 已选择
  return true
})

// 弹窗推送任务的指定时间的时间戳
const scheduleTime = ref(-1)

// 删除推送任务弹窗
const dialogDeleteNotificationVisible = ref(false)

// 需要删除的推送任务id
const deleteNotificationId = ref('')

// 日期筛选参数
const dateFilterParams = ref({
  sentStart: -1,
  sentEnd: -1,
})

// 新增推送任务
const addNotification = async () => {
  console.log('新增 notification')

  // 基础参数（必传）
  const params = {
    title: notificationForm.value.title,
    content: notificationForm.value.content,
    type: notificationForm.value.type,
    sentTime:
      hasPushTime.value && notificationForm.value.sendTime === 'schedule'
        ? scheduleTime.value
        : notificationForm.value.sendTime,
  }

  // 条件传递 obdVersion
  if (notificationForm.value.obdVersion !== 'all') {
    params.obdVersion = notificationForm.value.obdVersion
  }

  // 条件传递 appType
  if (notificationForm.value.applicationType !== 'all') {
    params.appType = notificationForm.value.applicationType
  }

  // 条件传递 pushUserIds
  if (hasPushUser.value && notificationForm.value.userStatus === 'selected') {
    params.pushUserIds = userStatusKeys.value
  }

  // 必填校验
  if (!params.title) {
    ElMessage.error('Title is required')
    return
  }
  if (!params.content) {
    ElMessage.error('Content is required')
    return
  }
  if (!params.type) {
    ElMessage.error('Type is required')
    return
  }
  if (!hasPushUser.value) {
    ElMessage.error('User Status is required')
    return
  }
  if (!hasPushTime.value) {
    ElMessage.error('Send Time is required')
    return
  }

  try {
    // 新增
    await createPushTaskApi(params)
    // 提示
    ElMessage.success('Add Notification Success')
    // 刷新
    refresh()
  } finally {
    // 关闭弹窗
    dialogNotificationFormVisible.value = false
    // 重置
    handleReset()
  }
}

// 编辑推送任务
const editNotification = async () => {
  console.log('编辑 notification', notificationForm.value)

  // 基础参数（必传）
  const params = {
    pushTaskId: notificationForm.value.id,
    title: notificationForm.value.title,
    content: notificationForm.value.content,
    type: notificationForm.value.type,
    sentTime:
      hasPushTime.value && notificationForm.value.sendTime === 'schedule'
        ? scheduleTime.value
        : notificationForm.value.sendTime,
  }

  // 条件传递 obdVersion
  if (notificationForm.value.obdVersion !== 'all') {
    params.obdVersion = notificationForm.value.obdVersion
  }

  // 条件传递 appType
  if (notificationForm.value.applicationType !== 'all') {
    params.appType = notificationForm.value.applicationType
  }

  // 条件传递 pushUserIds
  if (hasPushUser.value && notificationForm.value.userStatus === 'selected') {
    params.pushUserIds = userStatusKeys.value
  }

  // 必填校验
  if (!params.title) {
    ElMessage.error('Title is required')
    return
  }
  if (!params.content) {
    ElMessage.error('Content is required')
    return
  }
  if (!params.type) {
    ElMessage.error('Type is required')
    return
  }
  if (!hasPushUser.value) {
    ElMessage.error('User Status is required')
    return
  }
  if (!hasPushTime.value) {
    ElMessage.error('Send Time is required')
    return
  }

  try {
    // 编辑
    await editPushTaskApi(params)
    // 提示
    ElMessage.success('Edit Notification Success')
    // 刷新
    refresh()
  } finally {
    // 关闭弹窗
    dialogNotificationFormVisible.value = false
    // 重置
    handleReset()
  }
}

// 获取通知列表
const getNotificationList = async () => {
  const { data, count } = await getPushTaskListApi({
    searchKey: searchKeywords.value,
    types: typeKeys.value,
    obdVersions: obdVersionKeys.value,
    appTypes: applicationKeys.value,
    sort: conditionParams.sort,
    sortBy: conditionParams.sortBy,
    userKey: userStatusKeys.value,
    sentStart: dateFilterParams.value.sentStart,
    sentEnd: dateFilterParams.value.sentEnd,
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
  })
  // 设置分页数据
  pagination.total = count
  // 设置通知列表数据
  notificationList.value = data
}

// 获取用户列表
const getUserList = async () => {
  const { data } = await getUserListApi({
    page: 0,
    pageSize: 9999,
    sort: '',
    sortBy: '',
    statusKey: '',
    searchKey: '',
  })
  userStatusFilterParams.value = data.map((item) => ({
    id: item.id,
    label: item.name,
    value: item.id,
    logo: item.logo,
    name: item.name,
  }))
}

const getOBDVersionList = async () => {
  const { data } = await getOBDVersionListApi()
  obdVersionFilterParams.value = data.map((item) => ({
    label: item,
    value: item,
  }))
}

// 数据初始化
const initData = async () =>
  await Promise.all([getNotificationList(), getUserList(), getOBDVersionList()])

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
  typeList.value = []
  obdVersionList.value = []
  userStatusList.value = []
  applicationTypeList.value = []
  actualSentTimeList.value = []
  dateFilterParams.value = {
    sentStart: -1,
    sentEnd: -1,
  }
  refresh()
}

// 当单元格 hover 进入时会触发该事件
const handleCellMouseEnter = (row) => (row.isHover = true)

// 当单元格 hover 离开时会触发该事件
const handleCellMouseLeave = (row) => (row.isHover = false)

// 查看详情
const handleViewDetails = (row, column) => {
  const { no } = column
  if (no === 0 || no === 8) {
    return
  }
  // 设置表单数据
  notificationForm.value = row
  // 打开详情弹窗
  dialogNotificationDetailsVisible.value = true
}

// 管理Notification
const handleManageNotification = async () => {
  if (!notificationForm.value.id) {
    // 新增
    addNotification()
  } else {
    // 编辑
    editNotification()
  }
}

// 取消选择用户
const handleUnselectUser = (userId) => {
  userStatusList.value = userStatusList.value.filter((item) => item !== userId)
}

// 取消全部的选择用户
const handleReset = () => {
  notificationForm.value = {
    title: '',
    content: '',
    type: 'System',
    obdVersion: 'all',
    applicationType: 'all',
    userStatus: '', // all / selected
    sendTime: '', // 推送任务的目标时间戳
    scheduleTime: '',
  }
  userStatusList.value = []
}

const handleDateChange = (val) => {
  scheduleTime.value = dayjs(val).valueOf()
}

const handleClose = () => {
  handleReset()
  dialogNotificationFormVisible.value = false
}

// 关闭详情弹窗
const handleCloseNotificationInfoDialog = () => {
  // 关闭
  dialogNotificationDetailsVisible.value = false
  // 重置
  notificationForm.value = {
    title: '',
    content: '',
    type: 'System',
    obdVersion: 'all',
    applicationType: 'all',
    userStatus: '', // all / selected
    sendTime: '', // 推送任务的目标时间戳
    scheduleTime: '',
  }
}

// 排序函数
const sort = useSort(conditionParams, () => refresh())

// 打开删除推送任务弹窗
const openDeleteNotificationDialog = async (id) => {
  // 如果 查看详情弹窗打开，则关闭
  if (dialogNotificationDetailsVisible.value) {
    await handleCloseNotificationInfoDialog()
  }
  deleteNotificationId.value = id
  dialogDeleteNotificationVisible.value = true
}

// 确认删除
const handleDeleteNotification = async () => {
  try {
    await deletePushTaskApi(deleteNotificationId.value)
    // 提示
    ElMessage.success('Delete successfully')
    // 刷新
    refresh()
  } finally {
    dialogDeleteNotificationVisible.value = false
  }
}

// 获取目标推送任务所需要的推送用户列表
const getPushTaskUserList = async (pushTaskId) => {
  const { data } = await getPushTaskUserListApi(pushTaskId)
  userStatusList.value = data.map((item) => item.userId)
}

// 打开编辑弹窗
const openEditNotificationDialog = async (notification) => {
  // 创建一个副本
  const { cloned } = useCloned(notification)
  // 设置表单数据
  notificationForm.value = cloned.value
  // 回显推送任务的时间
  notificationForm.value.userStatus =
    cloned.value.isGlobal === 1 ? 'all' : 'selected'
  if (cloned.value.isGlobal !== 1) {
    // 则不是推送所有用户，则需要获取推送用户列表
    await getPushTaskUserList()
  }
  notificationForm.value.sendTime =
    cloned.value.sendTime === cloned.value.updateTime ? 'schedule' : 0
  // 回显obd版本
  notificationForm.value.obdVersion = cloned.value.obdVersion
    ? cloned.value.obdVersion
    : 'all'
  // 回显应用类型
  notificationForm.value.applicationType = cloned.value.applicationType
    ? cloned.value.applicationType
    : 'all'
  // 打开编辑弹窗
  dialogNotificationFormVisible.value = true
}

// 日期筛选
const handleDateFilterChange = (selectedDateList) => {
  const [startTime, endTime] = selectedDateList
  dateFilterParams.value.sentStart = dayjs(startTime).valueOf()
  dateFilterParams.value.sentEnd = dayjs(endTime).valueOf()
  refresh()
}

// 监听分页数据变化
watch(
  () => pagination.currentPage,
  () => {
    initData()
  },
)

// 组件创建, 发起网络请求
initData()
</script>

<template>
  <section class="flex h-full flex-col gap-16 px-32 pb-32">
    <!-- header -->
    <div class="flex-between h-32">
      <h2 class="heading-h2-20px-medium text-neutrals-off-black">
        Push notifications
      </h2>
      <el-button type="primary" @click="dialogNotificationFormVisible = true">
        Create
      </el-button>
    </div>
    <!-- Search bar -->
    <div class="flex-between">
      <div class="row-center filter-container flex-wrap gap-8">
        <!-- 通知类型筛选 -->
        <base-filter-panel
          v-model="typeList"
          :section-list="typeFilterParams"
          condition-text="Notification Type"
          @search="refresh"
        />
        <!-- OBD 版本筛选 -->
        <base-filter-panel
          v-model="obdVersionList"
          :section-list="obdVersionFilterParams"
          condition-text="OBD Version"
          @search="refresh"
        />
        <!-- 用户账号状态筛选 -->
        <base-filter-panel
          v-model="userStatusList"
          v-model:keywords="userSearchText"
          :section-list="userStatusFilterParams"
          condition-text="User status"
          :is-need-input="true"
          @search="refresh"
        />
        <!-- 应用平台筛选 -->
        <base-filter-panel
          v-model="applicationTypeList"
          :section-list="applicationFilterParams"
          condition-text="Application Type"
          @search="refresh"
        />
        <!-- 实际发送时间筛选 -->
        <el-date-picker
          v-model="actualSentTimeList"
          type="daterange"
          :range-separator="actualSendTimeRangeDisplay"
          start-placeholder="Start date"
          end-placeholder="End date"
          format="DD MMM YYYY"
          value-format="YYYY-MM-DD"
          placement="bottom-start"
          :class="{
            '[&>.el-range-separator]:text-[#006BF7]!':
              actualSentTimeList.length,
            '[&>.el-date-editor--daterange]:border-[#006BF7]!':
              actualSentTimeList.length,
          }"
          @change="handleDateFilterChange"
        />

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
    <!-- table container -->
    <div class="mt-8 flex flex-1 flex-col">
      <el-divider />
      <!-- Batch delete -->
      <div class="flex-between h-42" v-show="selectedNotificationIdList.length">
        <span class="text-neutrals-off-black heading-body-body-12px-regular">
          {{ selectedNotificationIdList.length }} selected
        </span>
        <el-button>Delete</el-button>
      </div>
      <div class="flex flex-1 flex-col justify-between">
        <el-table
          :data="notificationList"
          class="flex-1"
          @cell-mouse-enter="handleCellMouseEnter"
          @cell-mouse-leave="handleCellMouseLeave"
          @row-click="handleViewDetails"
          row-class-name="clickable-row"
          @sort-change="sort"
        >
          <el-table-column type="selection" min-width="6%" align="center" />
          <el-table-column
            prop="title"
            label="Title"
            min-width="20%"
            sortable="custom"
          />
          <el-table-column
            prop="content"
            label="Content"
            min-width="20%"
            show-overflow-tooltip
          />
          <el-table-column
            prop="type"
            label="Type"
            min-width="10%"
            sortable="custom"
          />
          <el-table-column
            prop="status"
            label="Status"
            min-width="12%"
            sortable="custom"
          >
            <template #default="{ row }">
              <base-tag
                :color="row.status === 'Sent' ? 'green' : 'gray'"
                :text="row.status === 'Sent' ? 'Sent' : 'Pending'"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="Edited At"
            min-width="18%"
            sortable="custom"
          >
            <template #default="{ row }">
              {{ getDateWithDDMMMYYYYhhmma(row.updateTime) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="sentTime"
            label="Actual Sent Time"
            min-width="21%"
            sortable="custom"
          >
            <template #default="{ row }">
              {{ getDateWithDDMMMYYYYhhmma(row.sentTime) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="targeted"
            label="Targeted"
            min-width="7%"
            sortable="custom"
          >
            <template #default="{ row }">
              {{ row.targeted || '-' }}
            </template>
          </el-table-column>
          <el-table-column min-width="6%" align="center">
            <template #default="{ row }">
              <el-dropdown trigger="click" v-show="row.status !== 'Sent'">
                <i class="icon-more-2-line text-16 cursor-pointer" />
                <template #dropdown>
                  <el-dropdown-menu class="px-16! py-8! rounded-8!">
                    <el-dropdown-item @click="openEditNotificationDialog(row)">
                      Edit
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click="openDeleteNotificationDialog(row.id)"
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
    </div>
  </section>
  <!-- 详情弹窗 -->
  <div
    class="flex-center z-9999 fixed inset-0 bg-black/50"
    v-show="dialogNotificationDetailsVisible"
    @click.self="handleCloseNotificationInfoDialog"
  >
    <div
      class="bg-neutrals/off-white rounded-8 w-700 flex flex-col gap-16 px-16 py-24"
    >
      <!-- title -->
      <div class="flex-between h-24">
        <div class="row-center h-24 gap-4">
          <h3
            class="heading-body-large-body-14px-medium text-neutrals-off-black"
          >
            {{ notificationForm.title }}
          </h3>
          <base-tag
            :color="notificationForm.status === 'Sent' ? 'green' : 'gray'"
            :text="notificationForm.status === 'Sent' ? 'Sent' : 'Pending'"
          />
        </div>
        <el-dropdown>
          <i class="icon-more-2-line text-16 cursor-pointer" />
          <template #dropdown>
            <el-dropdown-menu class="px-16! py-8! rounded-8!" place>
              <el-dropdown-item
                @click="openEditNotificationDialog(notificationForm)"
              >
                Edit
              </el-dropdown-item>
              <el-dropdown-item
                @click="openDeleteNotificationDialog(notificationForm.id)"
              >
                Delete
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <!-- content -->
      <div class="flex flex-col gap-8">
        <div class="flex flex-col gap-8 py-8">
          <h4
            class="heading-body-body-12px-medium text-neutrals-off-black leading-16"
          >
            Content
          </h4>
          <p
            class="leading-24 heading-body-body-12px-regular text-neutrals-grey-4 h-24"
          >
            {{ notificationForm.content }}
          </p>
        </div>
        <div class="flex gap-8 py-8">
          <div class="flex flex-1 flex-col gap-8">
            <h4
              class="heading-body-body-12px-medium text-neutrals-off-black leading-16"
            >
              Notification Type
            </h4>
            <p
              class="leading-24 heading-body-body-12px-regular text-neutrals-grey-4 h-24"
            >
              {{ notificationForm.type }}
            </p>
          </div>
          <div class="flex flex-1 flex-col gap-8">
            <h4
              class="heading-body-body-12px-medium text-neutrals-off-black leading-16"
            >
              OBD Version
            </h4>
            <p
              class="leading-24 heading-body-body-12px-regular text-neutrals-grey-4 h-24"
            >
              {{ notificationForm.obdVersion || '-' }}
            </p>
          </div>
        </div>
        <div class="flex gap-8 py-8">
          <div class="flex flex-1 flex-col gap-8">
            <h4
              class="heading-body-body-12px-medium text-neutrals-off-black leading-16"
            >
              User status
            </h4>
            <p
              class="leading-24 heading-body-body-12px-regular text-neutrals-grey-4 h-24"
            >
              {{ notificationForm.isGlobal === 1 ? 'All' : 'Specific' }}
            </p>
          </div>
          <div class="flex flex-1 flex-col gap-8">
            <h4
              class="heading-body-body-12px-medium text-neutrals-off-black leading-16"
            >
              Application Type
            </h4>
            <p
              class="leading-24 heading-body-body-12px-regular text-neutrals-grey-4 h-24"
            >
              {{ notificationForm.appType || '-' }}
            </p>
          </div>
        </div>
        <div class="flex gap-8 py-8">
          <div class="flex flex-1 flex-col gap-8">
            <h4
              class="heading-body-body-12px-medium text-neutrals-off-black leading-16"
            >
              Actual Sent Time
            </h4>
            <p
              class="leading-24 heading-body-body-12px-regular text-neutrals-grey-4 h-24"
            >
              Schedule
              {{ getDateWithDDMMMYYYYhhmma(notificationForm.sentTime) }}
            </p>
          </div>
          <div class="flex flex-1 flex-col gap-8">
            <h4
              class="heading-body-body-12px-medium text-neutrals-off-black leading-16"
            >
              Targeted
            </h4>
            <p
              class="leading-24 heading-body-body-12px-regular text-neutrals-grey-4 h-24"
            >
              {{ notificationForm.targeted || '-' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 表单弹窗  -->
  <base-dialog
    v-model="dialogNotificationFormVisible"
    :title="
      notificationForm.id
        ? 'Edit Push notification'
        : 'Create Push notification'
    "
    :confirm-text="notificationForm.id ? 'Save' : 'Create'"
    :dialog-width="850"
    @cancel="handleClose"
    @confirm="handleManageNotification"
  >
    <template #content>
      <el-form
        :model="notificationForm"
        label-position="top"
        class="flex w-full flex-col gap-16"
      >
        <!-- Title -->
        <el-form-item label="Title" prop="title" class="label-required">
          <el-input
            v-model="notificationForm.title"
            placeholder="Enter title"
          />
        </el-form-item>

        <!-- Content -->
        <el-form-item label="Content" prop="content" class="label-required">
          <el-input
            type="textarea"
            v-model="notificationForm.content"
            placeholder="Enter content"
            :rows="3"
          />
        </el-form-item>

        <!-- 三列布局 -->
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item
              label="Notification Type"
              prop="type"
              class="label-required"
            >
              <el-select
                v-model="notificationForm.type"
                placeholder="Select type"
              >
                <el-option
                  v-for="typeInfo in typeFilterParams"
                  :key="typeInfo.label"
                  :label="typeInfo.label"
                  :value="typeInfo.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="OBD Version" prop="obdVersion">
              <el-select
                v-model="notificationForm.obdVersion"
                placeholder="Select OBD"
              >
                <el-option label="All" value="all" />
                <el-option
                  v-for="obdInfo in obdVersionFilterParams"
                  :key="obdInfo.label"
                  :label="obdInfo.label"
                  :value="obdInfo.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Application Type" prop="applicationType">
              <el-select
                v-model="notificationForm.applicationType"
                placeholder="Select application"
              >
                <el-option label="All" value="all" />
                <el-option
                  v-for="appInfo in applicationFilterParams"
                  :key="appInfo.label"
                  :label="appInfo.label"
                  :value="appInfo.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- User status -->
        <el-form-item
          label="User status"
          prop="userStatus"
          class="label-required user-status-container"
        >
          <el-radio-group
            v-model="notificationForm.userStatus"
            class="flex! items-start! w-full flex-col gap-8"
          >
            <el-radio label="all" value="all">All Users</el-radio>
            <el-radio label="selected" class="relative w-full" value="selected">
              <span>Selected Users</span>
              <!-- 用户账号状态筛选 -->
              <base-filter-panel
                v-model="userStatusList"
                v-model:keywords="userSearchText"
                :section-list="userStatusFilterParams"
                condition-text="New User"
                :is-need-input="true"
                v-show="userSelectorVisible"
              >
                <template #text>
                  <el-button type="primary" text class="w-fit">
                    <template #icon>
                      <i class="icon-typesadd text-neutrals-blue" />
                    </template>
                    <template #default>New User</template>
                  </el-button>
                </template>
              </base-filter-panel>
              <el-button
                text
                class="absolute bottom-0 right-0 w-fit"
                :class="{
                  'text-neutrals-blue!': selectedUserList.length,
                  'text-neutrals-grey-4!': !selectedUserList.length,
                }"
                v-show="userSelectorVisible"
                @click.stop="userStatusList = []"
              >
                Clear
              </el-button>
            </el-radio>
          </el-radio-group>
          <!-- selected user -->
          <template v-if="userSelectorVisible">
            <el-scrollbar :heigh="200" :max-height="200">
              <div
                class="rounded-4 bg-default-light-blue flex-between box-border w-full p-4"
                v-for="(selectedUserInfo, index) in selectedUserList"
                :key="`${selectedUserInfo.id}${index}`"
              >
                <div class="row-center h-28 gap-8">
                  <el-avatar
                    :src="getFullFilePath(selectedUserInfo.logo)"
                    :size="24"
                    @error="() => true"
                  >
                    {{ getFirstLetter(selectedUserInfo.name) }}
                  </el-avatar>
                  <span class="heading-body-large-body-14px-regular leading-18">
                    {{ selectedUserInfo.name }}
                  </span>
                </div>
                <i
                  class="icon-typesclose text-20 text-default-offset-primary-colour cursor-pointer"
                  @click="handleUnselectUser(selectedUserInfo.id)"
                />
              </div>
            </el-scrollbar>
          </template>
        </el-form-item>

        <!-- Actual Sent Time -->
        <el-form-item
          label="Actual Sent Time"
          prop="sendTime"
          class="label-required"
        >
          <el-radio-group
            v-model="notificationForm.sendTime"
            class="flex! items-start! flex-col gap-8"
          >
            <el-radio label="now" :value="0">Send Now</el-radio>
            <el-radio
              label="schedule"
              class="schedule-container"
              value="schedule"
            >
              <span>Schedule</span>
              <el-date-picker
                v-model="notificationForm.scheduleTime"
                type="datetime"
                placeholder="Select date and time"
                format="DD MMM YYYY HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                class="w-730! ml-8"
                v-if="datePickerVisible"
                @change="handleDateChange"
              />
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </template>
    <template #descriptionFooter>
      <p class="heading-body-body-12px-regular text-neutrals-off-black">
        Estimated reach:
        <span class="text-neutrals-blue">
          {{
            notificationForm.userStatus === 'all'
              ? 'All'
              : selectedUserList.length
          }}
        </span>
        users.
      </p>
    </template>
  </base-dialog>
  <!-- 确认删除弹窗 -->
  <base-dialog
    v-model="dialogDeleteNotificationVisible"
    title="Delete Push notification ?"
    button-type="danger"
    confirm-text="Delete"
    @cancel="dialogDeleteNotificationVisible = false"
    @confirm="handleDeleteNotification"
  >
    <template #content>
      <p class="heading-body-body-12px-regular text-neutrals-grey-3">
        Are you sure you want to delete this scheduled Push notification?This
        action cannot be undone and the message will not be sent.
      </p>
    </template>
  </base-dialog>
</template>

<style scoped lang="scss">
// 重置 el-input 的样式
:deep(.el-input) {
  @apply rounded-12 h-32;

  .el-input__wrapper {
    @apply rounded-12 bg-[#EAEEF480];
  }
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

:deep(.el-form-item__label) {
  color: #1b1a1e !important;
}

:deep(.el-radio__label) {
  display: flex;
  gap: 4px;
}

.schedule-container {
  :deep(.el-date-editor) {
    &:not(.el-date-editor--daterange) {
      // 隐藏默认前缀图标
      .el-input__prefix {
        @apply hidden;
      }

      // 自定义后缀图标
      .el-input__suffix-inner {
        position: relative;

        &::before {
          content: '';
          display: block;
          width: 20px;
          height: 20px;
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
}

// 添加必填星号
.label-required :deep(.el-form-item__label) {
  &::after {
    margin-left: 3px;
    content: '*';
    color: red;
  }
}

// 用户选择框样式
.user-status-container :deep(.el-form-item__content) {
  @apply flex-col items-start gap-8;
}

// 表单单项样式调整
:deep(.el-form-item) {
  @apply mb-0;
}

// 重置datepicker样式
.filter-container {
  :deep(.el-date-editor--daterange) {
    @apply border-1! neutrals-grey-3 default-transition row-center box-border h-24 w-fit grow-0 cursor-pointer gap-5 rounded-full border-solid border-[#CACFD8] px-8 py-4 shadow-none;
    border-color: v-bind(conditionBorderColor);

    .el-range__icon {
      @apply hidden;
    }

    .el-range-input {
      @apply hidden;
    }

    .el-range-separator {
      @apply text-neutrals-grey-3 w-fit! flex-[0_1_auto]!;
    }

    .el-range-separator {
      position: relative;

      &::after {
        margin-left: 4px;
        content: '';
        display: block;
        width: 20px;
        height: 20px;
        background-color: currentColor; // 用文字颜色填充
        -webkit-mask: url('@/assets/specialIcons/calendar-icon.svg') no-repeat
          center;
        mask: url('@/assets/specialIcons/calendar-icon.svg') no-repeat center;
        -webkit-mask-size: contain;
        mask-size: contain;
      }
    }

    .el-range__close-icon {
      @apply hidden;
    }
  }
}

/// 用户选择栏滚动条样式重置
.user-status-container :deep(.el-scrollbar) {
  @apply w-full;

  .el-scrollbar__view {
    @apply flex flex-col gap-8;
  }
}
</style>
