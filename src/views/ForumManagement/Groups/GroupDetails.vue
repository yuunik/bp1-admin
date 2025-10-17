<script setup>
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'

import {
  editClubApi,
  getClubInfoApi,
  getClubMemberApi,
} from '@/apis/clubApi.js'
import BasePagination from '@/components/BasePagination.vue'
import { getForumListApi } from '@/apis/forumApi.js'
import { getFullFilePath } from '@/utils/dataFormattedUtil.js'
import { getDateWithDDMMMYYYY } from '@/utils/dateUtil.js'
import { useUserStore } from '@/store/index.js'
import useFileUpload from '@/composables/useFileUpload.js'
import BaseTag from '@/components/BaseTag.vue'
import BaseFilterInput from '@/components/BaseFilterInput.vue'
import BaseFilterPanel from '@/components/BaseFilterPanel.vue'

const uploadUrl = `${import.meta.env.VITE_SERVER_URL_API}/manager/club/edit`

const route = useRoute()

const stateColorMap = {
  Pending: 'orange',
  Rejected: 'red',
  Disabled: 'gray',
  Active: 'green',
}

// 当前俱乐部的 id
const clubId = ref('')

// 俱乐部详情
const clubInfo = ref({})

// 帖子列表
const postList = ref([])

// 俱乐部成员列表
const clubMemberList = ref([])

// 帖子列表的分页数据
const postPagination = reactive({
  currentPage: 0,
  pageSize: 15,
  total: 0,
})

// 俱乐部成员
const clubMemberPagination = reactive({
  currentPage: 0,
  pageSize: 9999,
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
    label: 'Owner',
    value: 'Owner',
  },
  {
    label: 'Admin',
    value: 'Admin',
  },
  {
    label: 'Member',
    value: 'Member',
  },
])

// 输入搜索关键字
const searchKeywords = ref('')

const userStore = useUserStore()

const { token } = storeToRefs(userStore)

const fileUpload = useFileUpload()

const logList = ref([
  {
    login_time: '2023-05-15 09:30:00',
    user_name: 'Jenny Wilson',
    action: 'Login',
    ip_address: '123.456',
    device: 'iPhone 14',
    avatar_url: 'https://example.com/jenny.png',
  },
  {
    login_time: '2023-05-15 10:05:00',
    user_name: 'Tom Smith',
    action: 'Login',
    ip_address: '192.168.1.2',
    device: 'MacBook Pro',
    avatar_url: 'https://example.com/tom.png',
  },
  {
    login_time: '2023-05-15 11:20:00',
    user_name: 'Alice Chen',
    action: 'Logout',
    ip_address: '10.0.0.8',
    device: 'Windows 11',
    avatar_url: 'https://example.com/alice.png',
  },
])

const useList = ref([
  {
    user_name: 'Jenny Wilson',
    role: 'Member',
    added_date: '2025-04-03',
    status: 'Pending',
    avatar_url: 'https://example.com/jenny.png',
  },
  {
    user_name: 'Tom Smith',
    role: 'Owner',
    added_date: '2025-04-03',
    status: 'Active',
    avatar_url: 'https://example.com/tom.png',
  },
  {
    user_name: 'Alice Chen',
    role: 'Admin',
    added_date: '2025-04-03',
    status: 'Active',
    avatar_url: 'https://example.com/alice.png',
  },
  {
    user_name: 'Michael Brown',
    role: 'Member',
    added_date: '2025-04-03',
    status: 'Active',
    avatar_url: 'https://example.com/michael.png',
  },
])

// 获取俱乐部详情
const getClubInfo = async () => {
  const { data } = await getClubInfoApi(clubId.value)
  clubInfo.value = data
}

// 获取俱乐部所属的贴文列表数据
const getClubPostList = async () => {
  const { data, count } = await getForumListApi({
    clubIds: clubId.value,
    page: postPagination.currentPage,
    pageSize: postPagination.pageSize,
    sort: sortParams.sort,
    sortBy: sortParams.sortBy,
  })
  postList.value = data
  postPagination.total = count
}

// 获取俱乐部的成员
const getClubMemberList = async () => {
  const { data, count } = await getClubMemberApi({
    clubId: clubId.value,
    page: clubMemberPagination.currentPage,
    pageSize: clubMemberPagination.pageSize,
  })
  clubMemberList.value = data
  clubMemberPagination.total = data.count
}

// 初始化
const init = async () => {
  if (route.params.id) {
    const clubId = route.params.id
    await Promise.all([
      getClubInfo(clubId),
      getClubPostList(clubId),
      getClubMemberList(clubId),
    ])
  }
}

// 错误行为
const errorHandler = () => true

// 刷新
const refresh = () => {
  if (!postPagination.currentPage) {
    return init()
  }
  postPagination.currentPage = 0
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

// 编辑 club
const handleEditClubItem = async () => {
  await editClubApi(clubForm.value)
  // 关闭弹窗
  // dialogClubFormVisible.value = false
  // 提示
  ElMessage.success('Edit successfully')
  // refresh()
}

watch(
  () => postPagination.currentPage,
  () => {
    init()
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
</script>

<template>
  <section class="flex flex-col gap-16">
    <!-- header -->
    <div class="flex-between mx-32">
      <h3 class="heading-h2-20px-medium text-neutrals-off-black">
        Group Details
      </h3>
      <div class="flex h-32 gap-8">
        <el-button>Disable</el-button>
        <el-button>Disband</el-button>
        <el-button type="primary">Edit</el-button>
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
            <base-tag text="Active" color="green" />
          </div>
          <div class="row-center h-32 gap-8">
            <span
              class="w-112 heading-body-body-12px-medium text-neutrals-grey-3"
            >
              Owner
            </span>
            <span
              class="heading-body-body-12px-regular text-neutrals-off-black"
            >
              Bessie Cooper
            </span>
          </div>
        </div>
        <div class="row-center gap-8">
          <span
            class="w-112 heading-body-body-12px-medium text-neutrals-grey-3"
          >
            Reject Reason
          </span>
          <p class="heading-body-body-12px-regular text-neutrals-off-black">
            One morning, when Gregor Samsa woke from troubled dreams, he found
            himself transformed in his bed in One morning, when Gregor Samsa
            woke from troubled dreams, he found himself transformed in his bed
            in
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
        <el-button type="primary" text class="w-fit" size="small">
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
              condition-text="Status"
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
        <el-table :data="clubMemberList">
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
              <span class="text-wrap">
                {{ row.name || '-' }}
              </span>
            </template>
          </el-table-column>

          <!-- 角色 -->
          <el-table-column prop="role" label="Role">
            <template #default="{ row }">
              <!-- isOwner 为 1, 则Owner-->
              <!-- isOwner 为 0, 则Member-->
              <span>{{ row.isOwner === 1 ? 'Admin' : 'Member' }}</span>
            </template>
          </el-table-column>

          <!-- 添加日期 -->
          <el-table-column prop="createTime" label="Added Date">
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
                  <el-dropdown-menu class="px-16! py-8! rounded-8!" place>
                    <el-dropdown-item @click="openEditClubItemDialog(row)">
                      Edit
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click="handleOpenDeleteClubItemDialog(row)"
                    >
                      Delete
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <base-pagination v-model="postPagination" />
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
        <el-table :data="logList">
          <el-table-column prop="login_time" label="Date & Time" />
          <el-table-column prop="user_name" label="User">
            <template #default="{ row }">
              <div class="flex items-center gap-2">
                <el-avatar :src="row.avatar_url" size="small" />
                <span>{{ row.user_name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="action" label="Action" />
          <el-table-column prop="ip_address" label="IP Address" />
          <el-table-column prop="device" label="Device" />
        </el-table>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss"></style>
