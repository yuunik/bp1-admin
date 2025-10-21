<script setup>
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useCloned, useSessionStorage } from '@vueuse/core'

import {
  addClubMemberApi,
  approveClubApi,
  approveUserApi,
  deleteClubApi,
  deleteClubMemberApi,
  editClubApi,
  getClubInfoApi,
  getClubLogApi,
  getClubMemberApi,
  manageClubAdminApi,
  manageClubApi,
  rejectUserApi,
} from '@/apis/clubApi.js'
import BasePagination from '@/components/BasePagination.vue'
import { getFullFilePath } from '@/utils/dataFormattedUtil.js'
import { getDateWithDDMMMYYYY } from '@/utils/dateUtil.js'
import { useUserStore } from '@/store/index.js'
import useFileUpload from '@/composables/useFileUpload.js'
import BaseTag from '@/components/BaseTag.vue'
import BaseFilterInput from '@/components/BaseFilterInput.vue'
import BaseFilterPanel from '@/components/BaseFilterPanel.vue'
import BaseDialog from '@/components/BaseDialog.vue'
import { getUserListApi } from '@/apis/userApi.js'
import { useSort } from '@/composables/useSort.js'
import { RouteName } from '@/utils/constantsUtil.js'
import BaseUpload from '@/components/BaseUpload.vue'

const uploadUrl = `${import.meta.env.VITE_SERVER_URL_API}/manager/club/edit`

const route = useRoute()

const stateColorMap = {
  Pending: 'orange',
  Rejected: 'red',
  Disabled: 'gray',
  Active: 'green',
}

// 俱乐部管理者列表
const clubManagerList = useSessionStorage('selectedClubManagerList', [])

// 当前俱乐部的 id
const clubId = ref('')

// 俱乐部详情
const clubInfo = ref({})

// 俱乐部成员列表
const clubMemberList = ref([])

// 俱乐部成员表格分页参数
const clubMemberPagination = reactive({
  currentPage: 0,
  pageSize: 15,
  total: 0,
})

// 俱乐部日志表格分页参数
const clubLogPagination = reactive({
  currentPage: 0,
  pageSize: 15,
  total: 0,
})

// 排序参数
const sortParams = reactive({
  sort: '',
  sortBy: '',
})

// 当前选项卡
const activeName = ref('Group Details')

// club 表单
const clubForm = ref({
  name: '',
  description: '',
  logo: '',
})

// 用户角色筛选参数
const roleList = ref([])

const roleKeys = computed(() =>
  roleList.value.length ? roleList.value.join(',') : '',
)

const roleFilterParams = ref([
  {
    label: 'Admin',
    value: '1',
  },
  {
    label: 'Member',
    value: '0',
  },
])

// 输入搜索关键字
const searchKeywords = ref('')

// 待添加用户弹窗
const dialogAddUserVisible = ref(false)

const userStore = useUserStore()

const { token } = storeToRefs(userStore)

const fileUpload = useFileUpload()

// 日志列表
const clubLogList = ref()

// 新添加的用户列表
const newUserList = ref([])

// 新增加的用户的id
const selectedUserId = ref('')

// 根据 row.status 计算出当前行的菜单项
const computedMenuItems = computed(() => (row) => {
  const items = []

  if (row.isOwner === '1') {
    // Admin
    items.push({ label: 'Remove Admin', action: 'Remove Admin' })
  } else {
    // Member
    items.push(
      { label: 'Promote to Admin', action: 'Promote to Admin' },
      { label: 'Remove', action: 'Remove' },
    )
  }

  return items
})

// 根据 clubInfo.value.state 计算出当前所需的按钮组
const computedButtonItems = computed(() => {
  const items = []

  if (clubInfo.value.state === 'Pending') {
    // Pending
    items.push(
      { label: 'Approve', action: 'approve' },
      { label: 'Reject', action: 'reject' },
    )
  } else if (clubInfo.value.state === 'Rejected') {
    //  Rejected
    items.push(
      { label: 'Edit', action: 'edit' },
      { label: 'Re-Approve', action: 'reApprove' },
    )
  } else if (clubInfo.value.state === 'Disabled') {
    // Disabled
    items.push({ label: 'Enable', action: 'enable' })
  } else if (clubInfo.value.state === 'Active') {
    //  Active
    items.push(
      { label: 'Edit', action: 'edit' },
      { label: 'Disable', action: 'disable' },
      { label: 'Disband', action: 'disband' },
    )
  }

  return items
})

// 处理按键的时间
const handleButtonItemClick = (action, row) => {
  switch (action) {
    case 'approve':
      handleApproveClub(row.id)
      break
    case 'reject':
      handleOpenRejectGroupDialog(row)
      break
    case 'edit':
      openEditClubItemDialog()
      break
    case 'reApprove':
      handleApproveClub(row.id)
      break
    case 'enable':
      handleClubStatus(row.id, action)
      break
    case 'disable':
      handleClubStatus(row.id, action)
      break
    case 'disband':
      handleOpenDeleteClubItemDialog(row)
      break
    default:
      console.warn('Unknown action:', action)
  }
}

// 拒绝用户加入俱乐部的弹窗
const dialogRejectUserVisible = ref(false)

// 拒绝用户的表单
const rejectUserForm = ref({
  reason: '',
})

// 俱乐部表单
const dialogClubFormVisible = ref(false)

// 确认删除弹窗
const dialogDeleteClubItemVisible = ref(false)

// 禁止俱乐部创建的弹窗
const dialogRejectGroupVisible = ref(false)

// 拒绝的俱乐部表单
const rejectClubForm = reactive({
  clubId: '',
  reason: '',
  name: '',
})

// 获取俱乐部详情
const getClubInfo = async () => {
  const { data } = await getClubInfoApi(clubId.value)
  clubInfo.value = data
}

// 获取俱乐部的成员
const getClubMemberList = async () => {
  const { data, count } = await getClubMemberApi({
    clubId: clubId.value,
    page: clubMemberPagination.currentPage,
    pageSize: clubMemberPagination.pageSize,
    role: roleKeys.value,
    searchKey: searchKeywords.value,
    sort: sortParams.sort,
    sortBy: sortParams.sortBy,
  })
  clubMemberList.value = data
  clubMemberPagination.total = count
}

// 初始化
const init = async () =>
  await Promise.all([getClubInfo(), getClubMemberList(), getClubLog()])

// 错误行为
const errorHandler = () => true

// 俱乐部用户表格刷新
const refresh = () => {
  if (!clubMemberPagination.currentPage) {
    return getClubMemberList()
  }
  clubMemberPagination.currentPage = 0
}

const handleTabChange = (val) => {
  // if (val === 'Post') {
  //   detailsRef.value.setScrollTop(postRef.value.offsetTop)
  // } else if (val === 'Comments') {
  //   commentsRef.value.scrollIntoView({ behavior: 'smooth' })
  // } else if (val === 'Details') {
  //   detailsRef.value.setScrollTop(0)
  // }
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
  newUserList.value = data.map((item) => ({
    label: item.name,
    value: item.id,
  }))
}

// 打开新增用户的弹窗
const openAddMemberDialog = async () => {
  await getUserList()
  dialogAddUserVisible.value = true
}

// 新增俱乐部的用户
const handleAddMember = async () => {
  try {
    await addClubMemberApi({
      clubId: clubId.value,
      userId: selectedUserId.value,
    })
    // 提示
    ElMessage.success('Add successfully')
    init()
  } finally {
    dialogAddUserVisible.value = false
  }
}

// 管理员批准用户加入俱乐部
const handleApproveUser = async (userId) => {
  await approveUserApi(userId)
  // 提示
  ElMessage.success('Approved successfully')
  init()
}

// 管理员设置或移除管理员
const handleSetOrRemoveAdmin = async (userId) => {
  await manageClubAdminApi(userId)
  // 提示
  ElMessage.success('Updated successfully')
  init()
}

// 管理员删除用户
const handleRemoveUser = async (userId) => {
  await deleteClubMemberApi(userId)
  // 提示
  ElMessage.success('Removed successfully')
  init()
}

// 处理 操作栏的事件
const handleDropdownItemClick = (action, row) => {
  switch (action) {
    case 'Remove Admin':
      handleSetOrRemoveAdmin(row.userId)
      break
    case 'Promote to Admin':
      handleSetOrRemoveAdmin(row.userId)
      break
    case 'Remove':
      handleRemoveUser(row.userId)
      break
    default:
      console.warn('Unknown action:', action)
  }
}

// 拒绝用户加入俱乐部
const openRejectUserDialog = async (row) => {
  // 创建一个副本
  const { cloned } = useCloned(row)
  // 设置表单数据
  rejectUserForm.value = cloned
  dialogRejectUserVisible.value = true
}

// 拒绝用户加入俱乐部
const handleRejectUser = async () => {
  if (!rejectUserForm.value.reason) {
    ElMessage.error('Please enter a reason')
    return
  }
  await rejectUserApi(rejectUserForm.value)
  // 提示
  ElMessage.success('Rejected successfully')
  init()
}

const sort = useSort(sortParams, getClubMemberList)

// 显示用于回显的logo
const getLogoDisplay = (logo) => {
  // logo为空, 直接返回
  if (!logo) {
    return logo
  }
  if (logo instanceof File) {
    // logo为本地文件, 创建本地文件路径
    return URL.createObjectURL(logo)
  } else {
    // logo为服务器文件, 拼接全称路径
    return getFullFilePath(logo)
  }
}

// 打开表单弹窗
const openEditClubItemDialog = () => {
  const { cloned } = useCloned(clubInfo.value)
  clubForm.value = cloned.value
  dialogClubFormVisible.value = true
}

// 获取上传的本地文件
const handleGetLocalFile = (file) => (clubForm.value.logo = file)

// 编辑 club
const handleEditClubItem = async () => {
  await editClubApi(clubForm.value)
  // 关闭弹窗
  dialogClubFormVisible.value = false
  // 提示
  ElMessage.success('Edit successfully')
  init()
}

// 批准俱乐部
const handleApproveClub = async (clubId) => {
  await approveClubApi(clubId)
  // 提示
  ElMessage.success('Approved successfully')
  init()
}

// 打开拒绝俱乐部创建的弹窗
const handleOpenRejectGroupDialog = (row) => {
  const { cloned } = useCloned(row)
  Object.assign(rejectClubForm, cloned.value)
  rejectClubForm.clubId = row.id
  dialogRejectGroupVisible.value = true
}

// 禁用/启用俱乐部
const handleClubStatus = async (clubId, type) => {
  await manageClubApi(clubId)
  // 提示
  ElMessage.success(
    `${type.charAt(0).toUpperCase() + type.slice(1)} successfully`,
  )
  init()
}

// 打开确认删除弹窗
const handleOpenDeleteClubItemDialog = (row) => {
  clubForm.value = row
  dialogDeleteClubItemVisible.value = true
}

// 删除俱乐部
const handleDeleteClub = async () => {
  await deleteClubApi(clubForm.value.id)
  dialogDeleteClubItemVisible.value = false
  // 提示
  ElMessage.success('Delete successfully')
  init()
}

// 获取俱乐部日志
const getClubLog = async () => {
  const { data, count } = await getClubLogApi({
    clubId: clubId.value,
    page: clubLogPagination.currentPage,
    pageSize: clubLogPagination.pageSize,
  })
  clubLogList.value = data
  clubLogPagination.total = count
}

watch(
  () => clubMemberPagination.currentPage,
  () => {
    getClubMemberList()
  },
)

onMounted(async () => {
  const {
    params: { id },
  } = route
  if (id) {
    clubId.value = id
    init()
  }
})

onUnmounted(() => {
  // 销毁
  clubManagerList.value = []
})
</script>

<template>
  <section class="flex flex-col gap-16">
    <!-- header -->
    <div class="flex-between mx-32">
      <h3 class="heading-h2-20px-medium text-neutrals-off-black">
        Group Details
      </h3>
      <div class="flex h-32 gap-8">
        <el-button
          v-for="item in computedButtonItems"
          :key="item.label"
          :type="
            item.label === 'Edit'
              ? 'primary'
              : item.label === 'Reject'
                ? 'danger'
                : 'default'
          "
          @click="handleButtonItemClick(item.action, clubInfo)"
        >
          {{ item.label }}
        </el-button>
      </div>
    </div>
    <!-- divider -->
    <el-tabs v-model="activeName" @tab-change="handleTabChange" class="has-top">
      <el-tab-pane label="Group Details" name="Group Details" />
      <el-tab-pane label="Members" name="Members" />
      <el-tab-pane label="Logs & Note" name="Logs & Note" />
    </el-tabs>
    <!-- info -->
    <div class="mx-32 flex flex-col gap-4">
      <!-- logo -->
      <div class="row-center h-76 gap-16">
        <el-avatar
          fit="cover"
          :src="getFullFilePath(clubInfo.logo)"
          alt="brand icon"
          shape="circle"
          :size="40"
          @error="errorHandler"
        >
          <img
            src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
          />
        </el-avatar>
        <span>{{ clubInfo.name }}</span>
        <el-upload
          :action="uploadUrl"
          name="file"
          :show-file-list="false"
          :data="{ token: token, clubId: clubInfo.id }"
          :before-upload="fileUpload.beforeAvatarUpload"
          :on-success="init"
        >
          <el-button>Change Avatar</el-button>
        </el-upload>
      </div>
      <!-- info -->
      <div class="flex flex-col gap-4">
        <div class="flex h-32 gap-24">
          <div class="row-center h-32 gap-8">
            <span
              class="w-112 heading-body-body-12px-medium text-neutrals-grey-3"
            >
              Status
            </span>
            <base-tag
              :text="clubInfo.state"
              :color="stateColorMap[clubInfo.state]"
            />
          </div>
          <div class="row-center h-32 gap-8">
            <span
              class="w-112 heading-body-body-12px-medium text-neutrals-grey-3"
            >
              Owner
            </span>
            <template v-if="clubManagerList && clubManagerList.length">
              <div v-if="clubManagerList.length === 1" class="row-center">
                <el-avatar
                  v-if="clubManagerList[0].logo"
                  fit="cover"
                  :src="getFullFilePath(clubManagerList[0].logo)"
                  class="mr-8 h-20 w-20 shrink-0"
                  alt="user avatar"
                  shape="circle"
                  :size="20"
                  @error="errorHandler"
                >
                  <template #error>
                    <i class="i-ep:picture" />
                  </template>
                </el-avatar>
                <span
                  class="text-wrap underline"
                  @click="
                    $router.push({
                      name: RouteName.PERSON_MANAGE,
                      params: { id: clubManagerList[0].userId },
                    })
                  "
                >
                  {{ clubManagerList[0].name || '-' }}
                </span>
              </div>
              <el-dropdown v-else>
                <div class="row-center">
                  <el-avatar
                    v-if="clubManagerList[0].logo"
                    fit="cover"
                    :src="getFullFilePath(clubManagerList[0].logo)"
                    class="mr-8 h-20 w-20 shrink-0"
                    alt="user avatar"
                    shape="circle"
                    :size="20"
                    @error="errorHandler"
                  >
                    <template #error>
                      <i class="i-ep:picture" />
                    </template>
                  </el-avatar>
                  <span class="text-wrap underline">
                    {{ clubManagerList[0].name || '-' }}
                  </span>
                  <span>+{{ clubManagerList.length - 1 }}</span>
                </div>
                <template #dropdown>
                  <el-dropdown-menu class="custom-dropdown-menu">
                    <el-dropdown-item
                      v-for="user in clubManagerList"
                      :key="user.id"
                    >
                      <div class="clubManagerList-center">
                        <el-avatar
                          v-if="user.logo"
                          fit="cover"
                          :src="getFullFilePath(user.logo)"
                          class="mr-8 h-20 w-20 shrink-0"
                          alt="user avatar"
                          shape="circle"
                          :size="20"
                          @error="errorHandler"
                        >
                          <template #error>
                            <i class="i-ep:picture" />
                          </template>
                        </el-avatar>
                        <span class="text-wrap">
                          {{ user.name || '-' }}
                        </span>
                      </div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
            <span v-else>-</span>
          </div>
        </div>
        <div class="row-center gap-8" v-if="clubInfo.state !== 'Rejected'">
          <span
            class="w-112 heading-body-body-12px-medium text-neutrals-grey-3"
          >
            Description
          </span>
          <p class="heading-body-body-12px-regular text-neutrals-off-black">
            {{ clubInfo.description || '-' }}
          </p>
        </div>
        <div class="row-center gap-8" v-else>
          <span
            class="w-112 heading-body-body-12px-medium text-neutrals-grey-3"
          >
            Reject Reason
          </span>
          <p class="heading-body-body-12px-regular text-neutrals-off-black">
            {{ clubInfo.reason || '-' }}
          </p>
        </div>
      </div>
    </div>
    <!-- members -->
    <div class="flex flex-col gap-8">
      <!-- header -->
      <div class="flex-between mx-32">
        <div class="row-center h-24 gap-8">
          <h3
            class="heading-body-large-body-14px-medium text-neutrals-off-black"
          >
            Members
          </h3>
          <span
            class="heading-body-large-body-14px-medium text-neutrals-grey-3"
          >
            {{ clubMemberList.length }}
          </span>
        </div>
        <!-- 添加按钮 -->
        <el-button
          type="primary"
          text
          class="w-fit"
          size="small"
          @click="openAddMemberDialog"
        >
          <template #icon>
            <i class="icon-typesadd text-neutrals-blue" />
          </template>
          <template #default>Add Member</template>
        </el-button>
      </div>
      <!-- divider -->
      <el-divider />
      <!-- table -->
      <div class="mx-32 flex flex-col gap-8">
        <!-- 搜索栏 -->
        <div class="flex-between">
          <div class="row-center filter-container flex-wrap gap-8">
            <!-- 应用平台筛选 -->
            <base-filter-panel
              v-model="roleList"
              :section-list="roleFilterParams"
              condition-text="Role"
              @search="refresh"
            />
            <!-- 清除按钮 -->
            <el-button
              text
              class="h-24! text-status-colours-blue!"
              @click="roleList = []"
              v-show="roleList.length"
            >
              Clear
            </el-button>
          </div>
          <!-- 输入搜索 -->
          <base-filter-input v-model="searchKeywords" @inputChange="refresh" />
        </div>
        <!-- divider -->
        <el-divider />
        <el-table :data="clubMemberList" @sort-change="sort">
          <el-table-column type="selection" min-width="6%" />
          <!-- 用户 -->
          <el-table-column prop="name" label="User">
            <template #default="{ row }">
              <el-avatar
                v-if="row.logo"
                fit="cover"
                :src="getFullFilePath(row.logo)"
                class="mr-8 h-20 w-20 shrink-0"
                alt="brand icon"
                shape="circle"
                :size="20"
                @error="errorHandler"
              >
                <template #error>
                  <i class="i-ep:picture" />
                </template>
              </el-avatar>
              <span
                class="cursor-pointer text-wrap underline"
                @click="
                  $router.push({
                    name: RouteName.PERSON_MANAGE,
                    params: { id: row.userId },
                  })
                "
              >
                {{ row.name || '-' }}
              </span>
            </template>
          </el-table-column>

          <!-- 角色 -->
          <el-table-column prop="role" label="Role" sortable="custom">
            <template #default="{ row }">
              <!-- isOwner 为 1, 则Admin-->
              <!-- isOwner 为 0, 则Member-->
              <span>{{ row.isOwner === '1' ? 'Admin' : 'Member' }}</span>
            </template>
          </el-table-column>

          <!-- 添加日期 -->
          <el-table-column
            prop="createTime"
            label="Added Date"
            sortable="custom"
          >
            <template #default="{ row }">
              <span>{{ getDateWithDDMMMYYYY(row.createTime) }}</span>
            </template>
          </el-table-column>

          <!-- 状态 -->
          <el-table-column prop="state" label="Status">
            <template #default="{ row }">
              <base-tag :text="row.state" :color="stateColorMap[row.state]" />
            </template>
          </el-table-column>
          <el-table-column min-width="6%">
            <template #default="{ row }">
              <el-dropdown trigger="click">
                <i class="icon-more-2-line text-16 cursor-pointer" />
                <template #dropdown>
                  <el-dropdown-menu
                    class="custom-dropdown-menu"
                    v-if="row.state === 'Active'"
                  >
                    <el-dropdown-item
                      v-for="item in computedMenuItems(row)"
                      :key="item.label"
                      @click="handleDropdownItemClick(item.action, row)"
                    >
                      {{ item.label }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                  <el-dropdown-menu class="custom-dropdown-menu" v-else>
                    <el-dropdown-item @click="handleApproveUser(row.id)">
                      Approve
                    </el-dropdown-item>
                    <el-dropdown-item @click="openRejectUserDialog(row)">
                      Reject
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <base-pagination v-model="clubMemberPagination" />
      </div>
    </div>
    <!-- Logs & Note -->
    <div class="flex flex-col gap-8">
      <!-- header -->
      <div class="flex-between mx-32 h-24">
        <h3 class="heading-body-large-body-14px-medium text-neutrals-off-black">
          Logs & Note
        </h3>
        <!-- 添加按钮 -->
        <el-button type="primary" text class="w-fit" size="small">
          <template #icon>
            <i class="icon-typesadd text-neutrals-blue" />
          </template>
          <template #default>New Note</template>
        </el-button>
      </div>
      <!-- divider -->
      <el-divider />
      <!-- table -->
      <div class="mx-32!">
        <el-table :data="clubLogList">
          <el-table-column
            prop="createTime"
            label="Date & Time"
            sortable="custom"
            min-width="19%"
          />
          <el-table-column prop="name" label="User" min-width="19%">
            <template #default="{ row }">
              <el-avatar
                v-if="row.logo"
                fit="cover"
                :src="getFullFilePath(row.logo)"
                class="mr-8 h-20 w-20 shrink-0"
                alt="brand icon"
                shape="circle"
                :size="20"
                @error="errorHandler"
              >
                <template #error>
                  <i class="i-ep:picture" />
                </template>
              </el-avatar>
              <span
                class="cursor-pointer text-wrap underline"
                @click="
                  $router.push({
                    name: RouteName.PERSON_MANAGE,
                    params: { id: row.userId },
                  })
                "
              >
                {{ row.name || '-' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="action" label="Action" min-width="19%" />
          <el-table-column prop="description" label="Detail" min-width="43%">
            <template #default="{ row }">
              <span class="text-wrap">{{ row.description || '-' }}</span>
            </template>
          </el-table-column>
        </el-table>
        <base-pagination v-model="clubLogPagination" />
      </div>
    </div>
  </section>
  <!-- 待添加用户弹窗 -->
  <base-dialog
    v-model="dialogAddUserVisible"
    title="Add Member"
    confirm-text="Add Member"
    @cancel="dialogAddUserVisible = false"
    @confirm="handleAddMember"
    class="add-member-container"
  >
    <template #content>
      <div class="row-center gap-8">
        <span
          class="w-112 leading-32 heading-body-body-12px-medium text-neutrals-grey-3 h-32"
        >
          User
        </span>
        <el-select
          class="select-container h-32"
          v-model="selectedUserId"
          placeholder="Select a user"
        >
          <el-option
            v-for="userInfo in newUserList"
            :key="userInfo.value"
            :label="userInfo.label"
            :value="userInfo.value"
          />
        </el-select>
      </div>
    </template>
  </base-dialog>
  <!-- 拒绝用户加入俱乐部的弹窗 -->
  <base-dialog
    v-model="dialogRejectUserVisible"
    title="Reject Member"
    confirm-text="Reject Member"
    @cancel="dialogRejectUserVisible = false"
    @confirm="handleRejectUser"
  >
    <template #content>
      <div class="row-center gap-8">
        <span
          class="w-112 leading-32 heading-body-body-12px-medium text-neutrals-grey-3 h-32"
        >
          Member
        </span>
        <div class="flex-1">
          <el-avatar
            v-if="rejectUserForm.logo"
            fit="cover"
            :src="getFullFilePath(rejectUserForm.logo)"
            class="mr-8 h-20 w-20 shrink-0"
            alt="brand icon"
            shape="circle"
            :size="20"
            @error="errorHandler"
          >
            <template #error>
              <i class="i-ep:picture" />
            </template>
          </el-avatar>
          <span class="text-wrap">
            {{ rejectUserForm.name || '-' }}
          </span>
        </div>
      </div>
      <el-divider />
      <div class="row-center gap-8">
        <span
          class="w-112 leading-32 heading-body-body-12px-medium text-neutrals-grey-3 h-32"
        >
          Reason*
        </span>
        <el-input
          placeholder="Enter"
          class="reason-container"
          rows="3"
          type="textarea"
        />
      </div>
    </template>
  </base-dialog>
  <!-- 编辑 club 弹窗 -->
  <base-dialog
    v-model="dialogClubFormVisible"
    title="Edit Club"
    confirm-text="Edit"
    @cancel="dialogClubFormVisible = false"
    @confirm="handleEditClubItem"
  >
    <template #content>
      <div class="flex flex-col gap-8">
        <!-- 上传 logo -->
        <base-upload
          v-if="dialogClubFormVisible"
          ref="baseUploadRef"
          default-avatar-text="A"
          :img-path="getLogoDisplay(clubForm.logo)"
          @get-local-file="handleGetLocalFile"
        />
        <div class="flex flex-col gap-8">
          <p class="heading-body-body-12px-medium text-neutrals-off-black">
            Club Name
          </p>
          <el-input
            v-model="clubForm.name"
            placeholder="Enter"
            class="club-name-input"
          />
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
            class="club-description-input"
          />
        </div>
      </div>
    </template>
  </base-dialog>
  <!-- 删除俱乐部提示框 -->
  <base-dialog
    v-model="dialogDeleteClubItemVisible"
    title="Delete Item ?"
    button-type="danger"
    confirm-text="Delete"
    @cancel="dialogDeleteClubItemVisible = false"
    @confirm="handleDeleteClub"
  >
    <template #content>
      <p class="heading-body-body-12px-regular text-neutrals-grey-3">
        Are you sure you want to delete the {{ clubForm.name }} Club? All data
        associated with this club will be permanently deleted, and this action
        cannot be undone.
      </p>
    </template>
  </base-dialog>
</template>

<style scoped lang="scss">
.select-container :deep(.el-select__wrapper) {
  // 重置下拉框样式
  background-color: $neutrals-off-white;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background-color: var(--el-input-border-color, var(--el-border-color));
    pointer-events: none;
  }
}

.reason-container :deep(.el-textarea__inner) {
  background-color: transparent !important;
  border: none; /* 去掉默认边框 */
  border-bottom: 1px solid #dcdfe6; /* 只保留底部边框 */
  border-radius: 0; /* 去掉圆角 */
  box-shadow: none;
  padding: 0;
}
</style>
