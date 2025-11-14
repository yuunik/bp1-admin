<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  CircleCheckFilled,
  Picture as IconPicture,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import Quill from 'quill'

import {
  deleteCommentApi,
  getCommentInfoApi,
  getCommentListByForumApi,
  getForumInfoApi,
  getReportListApi,
} from '@/apis/forumApi.js'
import { RouteName } from '@/utils/constantsUtil.js'
import {
  getFormattedPublishTime,
  getDateWithDDMMMYYYYhhmma,
} from '@/utils/dateUtil.js'
import { getFullFilePath } from '@/utils/dataFormattedUtil.js'
import BaseFileDisplay from '@/components/BaseFileDisplay.vue'

const emit = defineEmits(['changeTabName'])

// 当前选项卡
const activeName = ref('Details')

// 路由
const route = useRoute()

// 路由器
const router = useRouter()

// 贴文详情
const postInfo = reactive({})

// 评论详情
const commentInfo = reactive({})

// 当前评论的id
const currentCommentId = ref('')

// 当前贴文的id
const currentPostId = ref('')

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
const postRef = ref(null)

// 评论dom
const commentsRef = ref(null)

// 发帖人信息dom
const posterInfoRef = ref(null)

// 举报信息dom
const reportsRef = ref(null)

// 是否有更多评论
const isHasMoreComments = ref(true)

// 是否正在加载中
const isLoading = ref(false)

// 内容是否为 json 字符串
const isJson = computed(() => {
  if (!postInfo.content) return false

  try {
    const parsed = JSON.parse(postInfo.content)
    return typeof parsed === 'object' && parsed != null
  } catch {
    return false
  }
})

// 富文本容器
const quillContainer = ref(null)

const handleTabChange = (val) => {
  if (val === 'Post') {
    detailsRef.value.setScrollTop(postRef.value.offsetTop)
  } else if (val === 'Comments') {
    commentsRef.value.scrollIntoView({ behavior: 'smooth' })
  } else if (val === 'Details') {
    detailsRef.value.setScrollTop(0)
  }
}

// 获取论坛详情
const getForumDetail = async () => {
  const { data } = await getForumInfoApi(currentPostId.value)
  Object.assign(postInfo, data)
  // 如果是富文本 则解析
  if (!isJson.value) return
  const deltaOps = JSON.parse(postInfo.content)
  // 补全 link 前缀
  deltaOps.forEach((op) => {
    const link = op?.attributes?.link
    if (link && !/^https?:\/\//.test(link)) {
      op.attributes.link = `https://${link}`
    }
  })
  const quill = new Quill(quillContainer.value, {
    theme: 'snow',
    readOnly: true, // 只读模式
    modules: {
      toolbar: false, // 隐藏工具栏
    },
  })
  nextTick(() => {
    quill.setContents({ ops: deltaOps })
  })
}

// 获取评论详情
const getCommentInfo = async () => {
  const { data } = await getCommentInfoApi(currentCommentId.value)
  Object.assign(commentInfo, data)
  currentPostId.value = data.forumDto?.id
}

// 获取举报列表信息
const getReportList = async () => {
  const { data } = await getReportListApi({
    parentIds: currentCommentId.value,
    types: 'Comment',
    page: 0,
    pageSize: 9999,
  })
  reporterList.value = data
}

// 获取评论列表信息
const getCommentList = async () => {
  if (!isHasMoreComments.value) {
    return
  }
  const { data, count } = await getCommentListByForumApi({
    postId: currentPostId.value,
    page: commentPaginationParams.currentPage++,
    pageSize: commentPaginationParams.pageSize,
  })
  if (data.length) {
    !commentPaginationParams.total && (commentPaginationParams.total = count)
    commentList.value.push(
      ...data.map((item) => ({ ...item, isShowMoreReply: false })),
    )
  } else {
    isHasMoreComments.value = false
  }
}

// 加载头像的错误行为
const errorHandler = () => true

// 删除评论
const handleDeleteComment = async (commentId) => {
  await deleteCommentApi(commentId)
  if (commentId === currentCommentId.value) {
    // 如果删除的是评论详细页的评论, 则回到评论列表页
    router.push({ name: RouteName.FORUM_MANAGEMENT })
    // 切换至评论列表页
    emit('changeTabName')
  } else {
    // 刷新评论列表
    getCommentList(postInfo.id)
  }
  // 提示
  ElMessage.success('Delete successfully')
}

// 处理滚动事件
const handleScroll = (scrollData) => {
  const { scrollTop } = scrollData
  if (scrollTop >= reportsRef.value.offsetTop) {
    activeName.value = 'Post'
  } else {
    activeName.value = 'Details'
  }
}

// 组件挂载后, 获取贴文详情
onMounted(async () => {
  const {
    params: { id },
  } = route
  if (id) {
    // 获取当前的评论id
    currentCommentId.value = id
    // 打开加载状态
    isLoading.value = true
    try {
      await getCommentInfo()
      await Promise.all([getForumDetail(), getReportList(), getCommentList()])
    } finally {
      isLoading.value = false
    }
  }
})
</script>

<template>
  <div class="flex h-full flex-col overflow-auto" v-loading="isLoading">
    <div
      class="heading-h2-20px-medium text-neutrals-off-black flex-between mx-32 mb-16 h-32"
    >
      <h3 class="heading-h2-20px-medium">{{ RouteName.COMMENT_DETAILS }}</h3>
      <el-button @click="handleDeleteComment(currentCommentId)">
        Delete
      </el-button>
    </div>
    <el-divider />
    <el-tabs v-model="activeName" @tab-change="handleTabChange">
      <el-tab-pane label="Details" name="Details" />
      <el-tab-pane label="Post" name="Post" />
      <el-tab-pane label="Comments" name="Comments" />
    </el-tabs>
    <!-- 贴文详情 -->
    <el-scrollbar
      class="post-container box-border flex-1 px-32 pb-24 pt-16"
      ref="detailsRef"
      @end-reached="getCommentList"
      @scroll="handleScroll"
    >
      <!-- Post Header -->
      <section class="flex flex-col gap-8" ref="posterInfoRef">
        <!-- 发帖人信息 -->
        <div class="h-76 row-center gap-16">
          <el-avatar
            :size="40"
            :src="getFullFilePath(commentInfo.userDto?.logo)"
            @error="errorHandler"
            alt="poster avatar"
            fit="cover"
            shape="circle"
          >
            user
          </el-avatar>
          <span class="heading-body-large-body-14px-medium text-strong-950">
            {{ commentInfo.userDto?.name }}
          </span>
        </div>
        <!-- 发帖时间 -->
        <dl class="mt-12 grid h-32 grid-cols-[112px_1fr_112px_1fr] gap-4">
          <dt class="row-center h-32">Date</dt>
          <dd class="row-center h-32">
            {{ getDateWithDDMMMYYYYhhmma(commentInfo.createTime) }}
          </dd>
          <dt class="row-center h-32">Status</dt>
          <dd class="row-center h-32">
            <el-tag :type="reporterCount ? 'danger' : 'success'">
              {{ reporterCount ? 'Reported' : 'Normal' }}
            </el-tag>
          </dd>
          <dt class="row-center h-32">Content</dt>
          <dd class="row-center h-32">
            {{ commentInfo.content }}
          </dd>
        </dl>
      </section>
      <!-- 被举报的信息 -->
      <section
        class="mt-24 flex flex-col gap-8"
        v-if="reporterCount"
        ref="reportsRef"
      >
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
      <section class="mt-24 flex flex-col gap-8" ref="postRef">
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
            v-if="!isJson && postInfo?.content"
          >
            {{ postInfo.content }}
          </p>
          <p v-else ref="quillContainer" class="forum-content" />
          <!-- 图片 -->
          <ul
            class="[&>li]:h-168 attachment-container grid grid-cols-3 gap-8"
            v-if="postInfo.attachmentDtos && postInfo.attachmentDtos.length"
          >
            <li
              v-for="attachment in postInfo.attachmentDtos"
              :key="attachment.id"
            >
              <base-file-display
                :file-path="attachment.path"
                :file-type="attachment.type"
              />
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
                    <i class="i-ep:more h-16 w-16 cursor-pointer" />
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
                  {{ getFormattedPublishTime(comment.createTime) }}
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
                      {{ getFormattedPublishTime(reply.createTime) }}
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

// 滚动条样式覆盖
.post-container :deep(.el-scrollbar__view) {
  @apply flex flex-col gap-16;
}

// 重置富文本编辑器的默认样式
:deep(.ql-container) {
  @apply border-none;

  .ql-editor {
    @apply text-16 font-400 text-neutrals-off-black p-0;
  }
}
</style>
