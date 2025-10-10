<script setup>
import { watch, ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import BaseFilterPanel from '@/components/BaseFilterPanel.vue'
import BaseFilterInput from '@/components/BaseFilterInput.vue'
import BasePagination from '@/components/BasePagination.vue'
import { TimingPreset } from '@/utils/constantsUtil.js'
import BaseDialog from '@/components/BaseDialog.vue'

// 通知列表
const notificationList = ref([
  {
    id: 1,
    title: 'App Update Available',
    content: 'Version 2.3.1 is ready to download.',
    type: 'System',
    status: 'Pending',
    editedAt: '09 Oct 2023 14:30:25',
    actualSentTime: '09 Oct 2023 14:30:25',
    targeted: 500,
  },
  {
    id: 2,
    title: 'App Update Available',
    content: 'Version 2.3.1 is ready to download.',
    type: 'System',
    status: 'Sent',
    editedAt: '09 Oct 2023 14:30:28',
    actualSentTime: '09 Oct 2023 14:30:28',
    targeted: 500,
  },
  {
    id: 3,
    title: 'App Update Available',
    content: 'Version 2.3.1 is ready to download.',
    type: 'System',
    status: 'Sent',
    editedAt: '09 Oct 2023 14:30:30',
    actualSentTime: '09 Oct 2023 14:30:30',
    targeted: 500,
  },
  {
    id: 4,
    title: 'App Update Available',
    content: 'Version 2.3.1 is ready to download.',
    type: 'System',
    status: 'Sent',
    editedAt: '09 Oct 2023 14:30:33',
    actualSentTime: '09 Oct 2023 14:30:33',
    targeted: 500,
  },
  {
    id: 5,
    title: 'App Update Available',
    content: 'Version 2.3.1 is ready to download.',
    type: 'System',
    status: 'Sent',
    editedAt: '09 Oct 2023 14:30:35',
    actualSentTime: '09 Oct 2023 14:30:35',
    targeted: 500,
  },
  {
    id: 6,
    title: 'App Update Available',
    content: 'Version 2.3.1 is ready to download.',
    type: 'System',
    status: 'Sent',
    editedAt: '09 Oct 2023 14:30:37',
    actualSentTime: '09 Oct 2023 14:30:37',
    targeted: 500,
  },
  {
    id: 7,
    title: 'App Update Available',
    content: 'Version 2.3.1 is ready to download.',
    type: 'System',
    status: 'Sent',
    editedAt: '09 Oct 2023 14:30:39',
    actualSentTime: '09 Oct 2023 14:30:39',
    targeted: 500,
  },
  {
    id: 8,
    title: 'App Update Available',
    content: 'Version 2.3.1 is ready to download.',
    type: 'System',
    status: 'Sent',
    editedAt: '09 Oct 2023 14:30:41',
    actualSentTime: '09 Oct 2023 14:30:41',
    targeted: 500,
  },
  {
    id: 9,
    title: 'App Update Available',
    content: 'Version 2.3.1 is ready to download.',
    type: 'System',
    status: 'Sent',
    editedAt: '09 Oct 2023 14:30:43',
    actualSentTime: '09 Oct 2023 14:30',
    targeted: 500,
  },
])

// 通知类型筛选参数
const typeList = ref([])

const typeKeys = computed(() =>
  typeList.value.length ? typeList.value.join(',') : '',
)

const typeFilterParams = ref([])

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

// 用户搜索条件
const userSearchText = ref('')

// app平台类型筛选参数
const applicationTypeList = ref([])

const applicationKeys = computed(() =>
  applicationTypeList.value.length ? applicationTypeList.value.join(',') : '',
)

const applicationFilterParams = ref([])

// 实际发送时间筛选参数
const actualSentTimeList = ref([])

const actualSentTimeKeys = computed(() =>
  actualSentTimeList.value.length ? actualSentTimeList.value.join(',') : '',
)

const actualSentTimeFilterParams = ref([
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
const notificationForm = ref({})

// 数据初始化
const initData = async () => {
  /// todo 获取数据
}

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
  refresh()
}

// 当单元格 hover 进入时会触发该事件
const handleCellMouseEnter = (row) => (row.isHover = true)

// 当单元格 hover 离开时会触发该事件
const handleCellMouseLeave = (row) => (row.isHover = false)

// 查看详情
const handleViewDetails = (_, column) => {
  const { no } = column
  if (no === 0 || no === 8) {
    return
  }
  // 打开详情弹窗
  dialogNotificationDetailsVisible.value = true
}

// 管理Notification
const handleManageNotification = async () => {
  if (!notificationForm.value.id) {
    console.log('新增 notificaiton')
  } else {
    console.log('编辑 notificaiton')
  }
}

// 监听分页数据变化
watch(
  () => pagination.currentPage,
  () => {
    initData()
  },
)
</script>

<template>
  <section class="flex flex-col gap-16 px-32 pb-32">
    <!-- header -->
    <div class="flex-between h-32">
      <h2 class="heading-h2-20px-medium text-neutrals-off-black">
        Push notifications
      </h2>
      <el-button type="primary">Create</el-button>
    </div>
    <!-- Search bar -->
    <div class="flex-between h-24">
      <div class="row-center flex-wrap gap-8">
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
        <base-filter-panel
          v-model="actualSentTimeList"
          :section-list="actualSentTimeFilterParams"
          condition-text="Actual Sent Time"
          @search="refresh"
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
    <div class="flex flex-1 flex-col">
      <el-divider />
      <!-- Batch delete -->
      <div class="flex-between h-42" v-show="selectedNotificationIdList.length">
        <span class="text-neutrals-off-black heading-body-body-12px-regular">
          {{ selectedNotificationIdList.length }} selected
        </span>
        <el-button @click="dialogBatchDeleteNotificationItemVisible = true">
          Delete
        </el-button>
      </div>
      <div class="flex flex-1 flex-col justify-between">
        <el-table
          :data="notificationList"
          class="flex-1"
          @cell-mouse-enter="handleCellMouseEnter"
          @cell-mouse-leave="handleCellMouseLeave"
          @row-click="handleViewDetails"
          row-class-name="clickable-row"
        >
          <el-table-column type="selection" min-width="6%" align="center" />
          <el-table-column prop="title" label="Title" min-width="20%" />
          <el-table-column
            prop="content"
            label="Content"
            min-width="20%"
            show-overflow-tooltip
          />
          <el-table-column prop="type" label="Type" min-width="10%" />
          <el-table-column label="Status" min-width="12%">
            <template #default="{ row }">
              <el-tag :type="row.status === 'Sent' ? 'success' : 'info'">
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="editedAt" label="Edited At" min-width="18%" />
          <el-table-column
            prop="actualSentTime"
            label="Actual Sent Time"
            min-width="21%"
          />
          <el-table-column prop="targeted" label="Targeted" min-width="7%" />
          <el-table-column min-width="6%" align="center">
            <template #default="{ row }">
              <el-dropdown trigger="click">
                <i
                  v-show="row.isHover"
                  class="icon-more-2-line text-16 cursor-pointer"
                />
                <template #dropdown>
                  <el-dropdown-menu class="px-16! py-8! rounded-8!" place>
                    <el-dropdown-item>Edit</el-dropdown-item>
                    <el-dropdown-item>Delete</el-dropdown-item>
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
    @click.self="dialogNotificationDetailsVisible = false"
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
            Rainy Day Driving Tip
          </h3>
          <i
            class="rounded-4 text-neutrals-grey-4 bg-neutrals-grey-1 heading-caption-caption-10px-regular block p-8"
          >
            Pending
          </i>
        </div>
        <el-dropdown trigger="click">
          <i class="icon-more-2-line text-16 cursor-pointer" />
          <template #dropdown>
            <el-dropdown-menu class="px-16! py-8! rounded-8!" place>
              <el-dropdown-item>Edit</el-dropdown-item>
              <el-dropdown-item>Delete</el-dropdown-item>
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
            Roads may be slippery today. Please drive carefully and check your
            wipers and lights.
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
              System
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
              All
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
              All
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
              All
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
              Schedule 20 Oct 2023 14:30:00
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
              3
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
    :confirm-text="notificationForm.id ? 'Edit' : 'Create'"
    @cancel="dialogNotificationFormVisible = false"
    @confirm="handleManageNotification"
  >
    111111111111111111
  </base-dialog>
</template>

<style scoped lang="scss"></style>
