<script setup>
import { useRoute } from 'vue-router'

import { getClubInfoApi, getClubMemberApi } from '@/apis/clubApi.js'
import BasePagination from '@/components/BasePagination.vue'
import { getForumListApi } from '@/apis/forumApi.js'
import { getFullFilePath } from '@/utils/dataFormattedUtil.js'
import { getDateWithDDMMMYYYYhhmma } from '../../utils/dateUtil.js'

const route = useRoute()

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
  pageSize: 15,
  total: 0,
})

// 排序参数
const sortParams = reactive({
  sort: '',
  sortBy: '',
})

// 获取俱乐部详情
const getClubInfo = async (clubId) => {
  const { data } = await getClubInfoApi(clubId)
  clubInfo.value = data
}

// 获取俱乐部所属的贴文列表数据
const getClubPostList = async (clubId) => {
  const { data, count } = await getForumListApi({
    clubIds: clubId,
    page: postPagination.currentPage,
    pageSize: postPagination.pageSize,
    sort: sortParams.sort,
    sortBy: sortParams.sortBy,
  })
  postList.value = data
  postPagination.total = count
}

// 获取俱乐部的成员
const getClubMemberList = async (clubId) => {
  const { data } = await getClubMemberApi({
    clubId: clubId,
    page: clubMemberPagination.currentPage,
    pageSize: clubMemberPagination.pageSize,
  })
  clubMemberList.value = data
  clubMemberPagination.total = data.total
}

// 错误行为
const errorHandler = () => true

onMounted(async () => {
  if (route.params.id) {
    const clubId = route.params.id
    await Promise.all([
      getClubInfo(clubId),
      getClubPostList(clubId),
      getClubMemberList(clubId),
    ])
    // getClubPostList(clubId)
    // getClubMemberList(clubId)
    // getClubInfo(clubId)
  }
})
</script>

<template>
  <section class="mx-32 flex flex-col gap-16">
    <!-- header -->
    <div class="flex-between h-24">
      <h3 class="heading-h2-20px-medium text-neutrals-off-black">
        Group Details
      </h3>
    </div>
    <!-- divider -->
    <el-divider />
    <!-- info -->
    <div class="flex flex-col gap-12">
      <!--  -->
      <div class="row-center gap-12">
        <el-avatar
          fit="cover"
          :src="getFullFilePath(clubInfo.logo)"
          alt="brand icon"
          shape="square"
          :size="70"
          @error="errorHandler"
        >
          <img
            src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
          />
        </el-avatar>
        <div class="flex flex-col gap-4">
          <span class="text-30 font-500">{{ clubInfo.name }}</span>
          <el-dropdown
            trigger="click"
            max-height="500"
            :disabled="clubInfo.memberCount === 0"
          >
            <div
              class="flex cursor-pointer gap-8"
              :class="{ 'cursor-default!': clubInfo.memberCount === 0 }"
            >
              <p class="text-16">Members: {{ clubInfo.memberCount }}</p>
              <i class="icon-typesdropdown text-16" />
            </div>
            <template #dropdown>
              <div class="max-h-500 scrollbar-container px-20 py-12">
                <el-scrollbar>
                  <div
                    class="row-center gap-10"
                    v-for="userInfo in clubMemberList"
                    :key="userInfo.id"
                  >
                    <el-avatar
                      fit="cover"
                      :src="getFullFilePath(userInfo.logo)"
                      alt="user avatar"
                      shape="circle"
                      :size="32"
                      @error="errorHandler"
                    >
                      <img
                        src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                      />
                    </el-avatar>
                    <span class="text-16">{{ userInfo.name }}</span>
                  </div>
                </el-scrollbar>
              </div>
            </template>
          </el-dropdown>
        </div>
      </div>
      <!-- description -->
      <p class="rounded-4 text-neutrals-grey-3 bg-[#EAEEF4] p-8">
        {{ clubInfo.description }}
      </p>
    </div>
    <!-- post -->
    <div class="flex flex-col gap-12">
      <h4>Posts</h4>
      <div>
        <el-table :data="postList">
          <el-table-column
            prop="Title"
            label="title"
            column-key="title"
            min-width="17%"
          >
            <template #default="{ row }">
              <el-text>{{ row.title || '-' }}</el-text>
            </template>
          </el-table-column>
          <!-- 用户 -->
          <el-table-column
            prop="userDto?.name"
            label="Author"
            column-key="user"
            min-width="17%"
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
          <!-- 点赞数 -->
          <el-table-column
            prop="likeCount"
            label="Like"
            column-key="status"
            min-width="12%"
          >
            <template #default="{ row }">
              <span>{{ row.likeCount || '-' }}</span>
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
        </el-table>
        <base-pagination v-model="postPagination" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss"></style>
