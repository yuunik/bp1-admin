<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  CircleCheckFilled,
  Picture as IconPicture,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

import {
  deleteCommentApi,
  getCommentListByForumApi,
  getForumInfoApi,
  getReportListApi,
} from '@/apis/forumApi.js'
import { RouteName } from '@/utils/constantsUtil.js'
import { getCommentTime, getDateWithDDMMMYYYYhhmma } from '@/utils/dateUtil.js'
import { getFullFilePath } from '@/utils/dataFormattedUtil.js'

// 当前选项卡
const activeName = ref('Details')

// 路由
const route = useRoute()

// 贴文详情
const postInfo = reactive({})

// 举报列表
const reporterList = ref([])

// 被举报次数
const reporterCount = computed(() => reporterList.value.length)

// 贴文的评论列表
const commentList = ref([])

// 贴文的评论列表的分页查询参数
const commentPaginationParams = reactive({
  currentPage: 0,
  total: 0,
  pageSize: 15,
})

// 详情dom
const detailsRef = ref(null)

// 贴文dom
const forumRef = ref(null)

// 评论dom
const commentsRef = ref(null)

watch(activeName, (val) => {
  if (val === 'Post') {
    forumRef.value.scrollIntoView({ behavior: 'smooth' })
  } else if (val === 'Comments') {
    commentsRef.value.scrollIntoView({ behavior: 'smooth' })
  } else if (val === 'Details') {
    forumRef.value.scrollIntoView({ behavior: 'smooth' })
  }
})

// 获取论坛详情
const getForumDetail = async (postId) => {
  const { data } = await getForumInfoApi(postId)
  Object.assign(postInfo, data)
}

// 获取举报列表信息
const getReportList = async (postId) => {
  const { data } = await getReportListApi({
    parentIds: postId,
    types: 'Forum',
    page: 0,
    pageSize: 9999,
  })
  reporterList.value = data
}

// 获取评论列表信息
const getCommentList = async (postId) => {
  const { data } = await getCommentListByForumApi({
    postId: postId,
    page: commentPaginationParams.currentPage,
    pageSize: commentPaginationParams.pageSize,
  })
  commentList.value = data.map((item) => ({ ...item, isShowMoreReply: false }))
}

// 加载头像的错误行为
const errorHandler = () => true

// 删除评论
const handleDeleteComment = async (commentId) => {
  await deleteCommentApi(commentId)
  // 提示
  ElMessage.success('Delete successfully')
  getCommentList(postInfo.id)
}

// 组件挂载后, 获取贴文详情
onMounted(async () => {
  const {
    params: { id },
  } = route
  if (id) {
    await Promise.all([
      getForumDetail(id),
      getReportList(id),
      getCommentList(id),
    ])
  }
})
</script>

<template>
  <div class="flex flex-col overflow-auto">
    <div
      class="heading-h2-20px-medium text-neutrals-off-black flex-between mx-32 mb-16 h-32"
    >
      <h3 class="heading-h2-20px-medium">{{ RouteName.POST_DETAILS }}</h3>
      <el-button>Delete</el-button>
    </div>
    <el-divider />
    <el-tabs v-model="activeName">
      <el-tab-pane label="Details" name="Details" />
      <el-tab-pane label="Post" name="Post" />
      <el-tab-pane label="Comments" name="Comments" />
    </el-tabs>
    <!-- 贴文详情 -->
    <el-scrollbar
      class="box-border flex flex-1 flex-col gap-24 px-32 pb-24 pt-16"
      ref="detailsRef"
    >
      <!-- Post Header -->
      <section class="flex flex-col gap-8" ref="forumRef">
        <!-- 发帖人信息 -->
        <div class="h-76 row-center gap-16">
          <el-avatar
            :size="40"
            :src="getFullFilePath(postInfo.userDto?.logo)"
            @error="errorHandler"
            alt="poster avatar"
            fit="cover"
            shape="circle"
          >
            user
          </el-avatar>
          <span class="heading-body-large-body-14px-medium text-strong-950">
            {{ postInfo.userDto?.name }}
          </span>
        </div>
        <!-- 发帖时间 -->
        <dl class="mt-12 grid h-32 grid-cols-[112px_1fr_112px_1fr] gap-4">
          <dt class="row-center h-32">Date</dt>
          <dd class="row-center h-32">
            {{ getDateWithDDMMMYYYYhhmma(postInfo.createTime) }}
          </dd>
          <dt class="row-center h-32">Status</dt>
          <dd class="row-center h-32">
            <el-tag :type="reporterCount ? 'danger' : 'success'">
              {{ reporterCount ? 'Reported' : 'Normal' }}
            </el-tag>
          </dd>
        </dl>
      </section>
      <!-- 被举报的信息 -->
      <section class="mt-24 flex flex-col gap-8" v-if="reporterCount">
        <div class="heading-body-large-body-14px-medium row-center h-24 gap-2">
          <h4 class="text-neutrals-off-black">Reports</h4>
          <span class="text-neutrals-grey-3">{{ reporterCount }}</span>
        </div>
        <!-- divider -->
        <el-divider />
        <div class="mx-32">
          <el-table :data="reporterList">
            <el-table-column prop="name" label="Name">
              <template #default="{ row }">
                <div class="row-center h-24 gap-8">
                  <el-avatar
                    :src="getFullFilePath(row.userDto?.logo)"
                    fit="cover"
                    alt="whistleblower avatar"
                    shape="circle"
                    :size="20"
                    @error="errorHandler"
                  >
                    user
                  </el-avatar>
                  <el-text>{{ row.userDto?.name }}</el-text>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="Reason" />
          </el-table>
        </div>
      </section>
      <!-- 贴文信息 -->
      <section class="mt-24 flex flex-col gap-8">
        <!-- 标题 -->
        <h4
          class="row-center heading-body-large-body-14px-medium text-neutrals-off-black h-24"
        >
          Post
        </h4>
        <!-- divider -->
        <el-divider />
        <!-- 贴文 -->
        <div class="flex flex-col gap-16">
          <h5
            class="heading-h3-16px-medium text-neutrals-off-black"
            v-if="postInfo.title"
          >
            {{ postInfo.title }}
          </h5>
          <p
            class="text-neutrals-off-black heading-body-large-body-14px-regular"
            v-if="postInfo.content"
          >
            {{ postInfo.content }}
          </p>
          <!-- 图片 -->
          <ul
            class="[&>li]:h-168 attachment-container grid grid-cols-3 gap-8"
            v-if="postInfo.attachmentDtos && postInfo.attachmentDtos.length"
          >
            <li
              v-for="attachment in postInfo.attachmentDtos"
              :key="attachment.id"
            >
              <el-image
                :src="getFullFilePath(attachment.path)"
                fit="cover"
                class="h-168 rounded-8 w-full"
                lazy
                :preview-src-list="
                  getFullFilePath(attachment.path)
                    ? [getFullFilePath(attachment.path)]
                    : []
                "
              >
                <template #error>
                  <div class="image-slot">
                    <el-icon><icon-picture /></el-icon>
                  </div>
                </template>
              </el-image>
            </li>
          </ul>
        </div>
      </section>
      <!-- 评论区 -->
      <section
        class="mt-24 flex flex-col gap-8"
        ref="commentsRef"
        v-if="commentList.length"
      >
        <!-- 标题 -->
        <div class="heading-body-large-body-14px-medium row-center h-24 gap-2">
          <h4 class="text-neutrals-off-black">Comments</h4>
          <span class="text-neutrals-grey-3">{{ commentList.length }}</span>
        </div>
        <!-- divider -->
        <el-divider />
        <!-- 评论列表 -->
        <div class="mt-8 flex flex-col gap-8">
          <div v-for="comment in commentList" :key="comment.id">
            <!-- 评论信息 -->
            <div class="flex gap-8">
              <!-- 评论人头像 -->
              <el-avatar
                :src="getFullFilePath(comment.userDto?.logo)"
                fit="cover"
                shape="circle"
                :size="40"
                @error="errorHandler"
                alt="user avatar"
              >
                user
              </el-avatar>
              <!-- 评论内容 -->
              <div class="flex flex-1 flex-col gap-10">
                <!-- 评论人信息 -->
                <div class="flex-between">
                  <div class="flex gap-8">
                    <!-- 评论人昵称 -->
                    <span
                      class="heading-body-large-body-14px-regular text-neutrals-grey-4"
                    >
                      {{ comment.userDto?.name }}
                    </span>
                    <!-- 被采纳 -->
                    <div
                      class="row-center bg-status-colours-light-green text-status-colours-green rounded-36 gap-4 px-6 py-2"
                      v-if="comment.hasAdopted"
                    >
                      <el-icon><CircleCheckFilled /></el-icon>
                      <span class="heading-body-body-12px-regular">
                        Accepted
                      </span>
                    </div>
                  </div>
                  <el-dropdown trigger="click">
                    <i class="i-ep:more-filled h-16 w-16 cursor-pointer" />
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item
                          @click="handleDeleteComment(comment.id)"
                        >
                          <i class="i-ep:delete mr-5 h-16 w-16" />
                          Delete
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
                <!-- 评论内容 -->
                <p
                  class="heading-body-large-body-14px-regular text-neutrals-off-black"
                >
                  {{ comment.content }}
                </p>
                <!-- 评论图片 -->
                <!--<ul class="flex flex-wrap gap-8">-->
                <!--  <li v-for="url in urls" :key="url">-->
                <!--    <el-image-->
                <!--      :src="url"-->
                <!--      fit="cover"-->
                <!--      class="w-120 h-120 rounded-8 w-full"-->
                <!--      lazy-->
                <!--    />-->
                <!--  </li>-->
                <!--</ul>-->
                <el-image
                  v-if="comment.path"
                  :src="getFullFilePath(comment.path)"
                  fit="cover"
                  class="w-120 h-120 rounded-8"
                  lazy
                  :preview-src-list="
                    getFullFilePath(comment.path)
                      ? [getFullFilePath(comment.path)]
                      : []
                  "
                >
                  <template #error>
                    <div class="image-slot">
                      <el-icon><icon-picture /></el-icon>
                    </div>
                  </template>
                </el-image>
                <!-- 发帖时间 -->
                <span
                  class="text-neutrals-grey-3 heading-body-body-12px-regular"
                >
                  {{ getCommentTime(comment.createTime) }}
                </span>
              </div>
            </div>
            <!-- 回复信息 -->
            <div
              class="flex gap-8 pt-8"
              v-if="comment.commentDtos && comment.commentDtos.length"
            >
              <div class="h-40 w-40"></div>
              <!-- 回复内容 -->
              <div class="flex flex-col gap-12">
                <div
                  class="flex gap-8"
                  v-for="reply in comment.isShowMoreReply
                    ? comment.commentDtos
                    : comment.commentDtos.slice(0, 1)"
                  :key="reply.id"
                >
                  <!-- 评论人头像 -->
                  <el-avatar
                    :src="getFullFilePath(reply.userDto?.logo)"
                    fit="cover"
                    shape="circle"
                    :size="24"
                    @error="errorHandler"
                    alt="user avatar"
                  >
                    user
                  </el-avatar>
                  <!-- 评论内容 -->
                  <div class="flex flex-1 flex-col gap-10">
                    <!-- 评论人信息 -->
                    <div class="row-center gap-8">
                      <!-- 评论人昵称 -->
                      <span
                        class="heading-body-large-body-14px-regular text-neutrals-grey-4"
                      >
                        {{ reply.userDto?.name || '-' }}
                      </span>
                      <!-- 是否为贴文作者 -->
                      <i
                        class="heading-body-body-12px-regular block rounded-full bg-[#E5F0FE] px-6 py-2 text-[#006BF7]"
                        v-if="reply.userDto?.id === postInfo.userDto?.id"
                      >
                        Author
                      </i>
                      <!-- 评论的对象 -->
                      <template v-if="reply.byUserDto?.id">
                        <i class="i-ep:right h-16 w-16" />
                        <span
                          class="heading-body-body-12px-regular text-neutrals-grey-4"
                        >
                          {{ reply.byUserDto?.name }}
                        </span>
                        <!-- 是否为贴文作者 -->
                        <i
                          class="heading-body-body-12px-regular block rounded-full bg-[#E5F0FE] px-6 py-2 text-[#006BF7]"
                          v-if="reply.userDto?.id === postInfo.userDto?.id"
                        >
                          Author
                        </i>
                      </template>
                    </div>
                    <!-- 评论内容 -->
                    <p
                      class="heading-body-large-body-14px-regular text-neutrals-off-black"
                    >
                      {{ reply.content }}
                    </p>
                    <!-- 评论图片 -->
                    <el-image
                      v-if="reply.path"
                      :src="getFullFilePath(reply.path)"
                      fit="cover"
                      class="w-120 h-120 rounded-8"
                      lazy
                      :preview-src-list="
                        getFullFilePath(reply.path)
                          ? [getFullFilePath(reply.path)]
                          : []
                      "
                    >
                      <template #error>
                        <div class="image-slot">
                          <el-icon><icon-picture /></el-icon>
                        </div>
                      </template>
                    </el-image>
                    <!-- 发帖时间 -->
                    <span
                      class="text-neutrals-grey-3 heading-body-body-12px-regular"
                    >
                      {{ getCommentTime(reply.createTime) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 更多回复内容 -->
            <el-button
              text
              class="ml-48 mt-8"
              v-if="
                comment.commentDtos &&
                comment.commentDtos.length > 1 &&
                !comment.isShowMoreReply
              "
              @click="comment.isShowMoreReply = true"
            >
              <span class="heading-body-body-12px-regular text-neutrals-grey-4">
                ----View {{ comment.commentDtos.length - 1 }} repli{{
                  comment.commentDtos.length - 1 === 1 ? 'y' : 'es'
                }}
              </span>
            </el-button>
          </div>
        </div>
      </section>
    </el-scrollbar>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-tabs) {
  @apply my-0;
}

// 图片加载错误的样式
.attachment-container .image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}
.attachment-container .image-slot .el-icon {
  font-size: 30px;
}
</style>
