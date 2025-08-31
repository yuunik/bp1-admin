<script setup>
import { useRouter } from 'vue-router'

import BasePagination from '@/components/BasePagination.vue'

const postList = ref([
  {
    id: 1,
    user: 'Bessie Cooper',
    avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
    content: 'Five examples of why internal co...',
    reports: 6,
    comments: 685,
    status: 'Reported',
    date: '15 May 2025 9:00 am',
  },
  {
    id: 2,
    user: 'Esther Howard',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    content: 'Covid 19 policy updates',
    reports: 3,
    comments: 630,
    status: 'Reported',
    date: '15 May 2025 9:00 am',
  },
  {
    id: 3,
    user: 'Jenny Wilson',
    avatar: 'https://randomuser.me/api/portraits/women/25.jpg',
    content: 'Employee engagement poll...',
    reports: 1,
    comments: 742,
    status: 'Reported',
    date: '15 May 2025 9:30 am',
  },
  {
    id: 4,
    user: 'Jerome Bell',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    content: 'Company business travel...',
    reports: null,
    comments: 226,
    status: 'Normal',
    date: '15 May 2025 9:00 am',
  },
  {
    id: 5,
    user: 'Floyd Miles',
    avatar: 'https://randomuser.me/api/portraits/men/64.jpg',
    content: 'UK employee benefits and han...',
    reports: null,
    comments: 356,
    status: 'Normal',
    date: '15 May 2025 9:00 am',
  },
  {
    id: 6,
    user: 'Wade Warren',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    content: 'Annual security training is coming',
    reports: null,
    comments: 810,
    status: 'Normal',
    date: '15 May 2025 9:00 am',
  },
  {
    id: 7,
    user: 'Jacob Jones',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    content: '5 ways to improve team collaborati...',
    reports: null,
    comments: 342,
    status: 'Normal',
    date: '15 May 2025 9:00 am',
  },
  {
    id: 8,
    user: 'Annette Black',
    avatar: 'https://randomuser.me/api/portraits/women/58.jpg',
    content: 'Inclusion and diversity - How y...',
    reports: null,
    comments: 695,
    status: 'Normal',
    date: '15 May 2025 9:00 am',
  },
  {
    id: 9,
    user: 'Kathryn Murphy',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    content: 'Customer stories - See how our pr...',
    reports: null,
    comments: 543,
    status: 'Normal',
    date: '15 May 2025 9:00 am',
  },
  {
    id: 10,
    user: 'Marvin McKinney',
    avatar: 'https://randomuser.me/api/portraits/men/50.jpg',
    content: 'Holiday schedules for US employees',
    reports: null,
    comments: 519,
    status: 'Normal',
    date: '15 May 2025 9:00 am',
  },
  {
    id: 11,
    user: 'Jane Cooper',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    content: 'Training center important updat...',
    reports: null,
    comments: 450,
    status: 'Normal',
    date: '15 May 2025 9:00 am',
  },
  {
    id: 12,
    user: 'Guy Hawkins',
    avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
    content: 'Workplace communication:...',
    reports: null,
    comments: 284,
    status: 'Normal',
    date: '15 May 2025 9:00 am',
  },
  {
    id: 13,
    user: 'Eleanor Pena',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    content: 'Welcome our new hires in custome...',
    reports: null,
    comments: 330,
    status: 'Normal',
    date: '15 May 2025 8:30 am',
  },
])

const pagination = ref({
  pageSize: 10,
  total: 0,
  currentPage: 0,
})

const router = useRouter()

const handleViewPostDetails = (row) => {
  router.push({ name: 'Post Details', params: { id: row.id } })
}
</script>

<template>
  <div class="pb-38 flex h-full flex-col px-32 pt-16">
    <!-- 评论列表表格 -->
    <el-table
      :data="postList"
      class="flex-1"
      :fit="false"
      row-class-name="clickable-row"
      @row-click="handleViewPostDetails"
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
              v-if="row.avatar"
              fit="cover"
              :src="row.avatar"
              class="mr-8 h-20 w-20"
              alt="brand icon"
              shape="circle"
              :size="20"
            >
              <template #error>
                <i class="i-ep:picture" />
              </template>
            </el-avatar>
            <el-text>{{ row.user }}</el-text>
          </div>
        </template>
      </el-table-column>
      <!-- 内容 -->
      <el-table-column
        prop="content"
        label="Content"
        column-key="content"
        min-width="22%"
      />
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
          {{ row.status }}
        </template>
      </el-table-column>
      <!-- 日期 -->
      <el-table-column
        prop="date"
        label="Date"
        sortable
        column-key="date"
        min-width="19%"
      />
      <!-- 操作 -->
      <el-table-column column-key="actions" min-width="6%">
        <template #default>
          <el-dropdown trigger="click">
            <i class="icon-more-2-line cursor-pointer" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>Delete</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加按钮 -->
    <base-pagination v-model="pagination" />
  </div>
</template>

<style scoped lang="scss">
:deep(.el-table__header) {
  @apply w-full!;
}

:deep(.el-table__body) {
  @apply w-full!;
}
</style>
