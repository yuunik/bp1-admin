<script setup>
import { reactive } from 'vue'
import { useRoute } from 'vue-router'

import { getForumInfoApi } from '@/apis/shareApi.js'
import { getFullPath } from '@/utils/dataFormattedUtil.js'
import { getCommentTime } from '@/utils/dateUtil.js'

// 图片加载错误的图片
import ErrorImage from '@/assets/images/error-img.png'
// 点赞图标
import LikeIcon from '@/assets/icons/fi_like.svg'
// 评论图标
import CommentIcon from '@/assets/icons/fi_message-square.svg'
// 收藏图标
import FavoriteIcon from '@/assets/icons/fi_star_b.svg'
import useAppLauncher from '@/composables/useAppLauncher.js'

// 获取路由
const route = useRoute()

// 获取 App 启动的回调
const { launchApp } = useAppLauncher()

// 修改该网页的标题
document.title = route.meta.title

// 贴文详情
const forumInfo = reactive({})
// 获取贴文详情
const getForumInfo = async (forumId) => {
  const { data } = await getForumInfoApi(forumId)
  // 获取成功
  Object.assign(forumInfo, data)
}

// 获取当前页面的id
const forumId = route.params.id
if (forumId) {
  // 有id, 则获取贴文详情
  getForumInfo(forumId)
}

// 头像加载失败的回调
const handleErrorImage = () => true
</script>

<template>
  <!-- 论坛详情 -->
  <div className="w-full h-full flex-col-between">
    <!-- 用户贴文内容 -->
    <main class="flex-col-between gap-24 px-20 pt-8">
      <!-- 用户信息容器 -->
      <div class="flex gap-12">
        <!-- 用户头像 -->
        <el-avatar
          :size="40"
          :src="getFullPath(forumInfo?.userDto?.logo)"
          @error="handleErrorImage"
        >
          <el-image :src="ErrorImage" fit="cover" alt="error image" />
        </el-avatar>
        <!-- 用户信息 -->
        <div class="flex flex-col gap-4">
          <!-- 用户名 -->
          <el-text class="text-align-left w-full">
            {{ forumInfo?.userDto?.name }}
          </el-text>
          <!-- 评论时间 -->
          <el-text>
            {{ getCommentTime(forumInfo?.createTime) }}
          </el-text>
        </div>
      </div>
      <!-- 贴文内容 -->
      <article>
        <!-- 标题 -->
        <section v-if="forumInfo?.title">
          <h1 class="h2-20px-semibold">{{ forumInfo?.title }}</h1>
        </section>
        <!-- 内容 -->
        <section v-if="forumInfo?.content">
          <pre
            class="heading-h3-16px-regular neutrals-off-black forum-content whitespace-pre-wrap break-words"
            >{{ forumInfo?.content }}</pre
          >
        </section>
        <!-- 图片 -->
        <section
          v-if="
            forumInfo?.attachmentDtos && forumInfo.attachmentDtos.length > 0
          "
          class="mt-16 flex w-full flex-col gap-12"
        >
          <!-- 第一行：1张图片 -->
          <div
            v-if="forumInfo.attachmentDtos.length >= 1"
            class="h-257 rounded-8 w-full bg-cover bg-center bg-no-repeat"
            :style="{
              backgroundImage: `url(${getFullPath(forumInfo.attachmentDtos[0].path)})`,
            }"
          ></div>

          <!-- 第二行：2张图片 -->
          <div
            v-if="forumInfo.attachmentDtos.length >= 2"
            class="grid grid-cols-2 gap-12"
          >
            <div
              v-for="item in forumInfo.attachmentDtos.slice(1, 3)"
              :key="item.id"
              class="h-166 rounded-8 w-full bg-cover bg-center bg-no-repeat"
              :style="{
                backgroundImage: `url(${getFullPath(item.path)})`,
              }"
            ></div>
          </div>

          <!-- 第三行：3张图片 -->
          <div
            v-if="forumInfo.attachmentDtos.length >= 4"
            class="grid grid-cols-3 gap-12"
          >
            <div
              v-for="item in forumInfo.attachmentDtos.slice(3, 6)"
              :key="item.id"
              class="h-150 rounded-8 w-full bg-cover bg-center bg-no-repeat"
              :style="{
                backgroundImage: `url(${getFullPath(item.path)})`,
              }"
            ></div>
          </div>

          <!-- 第四行：3张图片 -->
          <div
            v-if="forumInfo.attachmentDtos.length >= 7"
            class="grid grid-cols-3 gap-12"
          >
            <div
              v-for="(item, index) in forumInfo.attachmentDtos.slice(6, 9)"
              :key="index + 6"
              class="h-150 rounded-8 w-full bg-cover bg-center bg-no-repeat"
              :style="{
                backgroundImage: `url(${getFullPath(item.path)})`,
              }"
            ></div>
          </div>
        </section>
      </article>
    </main>
    <!-- 打开 App 的按钮 -->
    <el-button
      class="right-112 left-112 bottom-68 btn-12 fixed h-48 bg-[#006BF7]"
      type="primary"
      @click="launchApp"
    >
      Open in App
    </el-button>
    <!-- 底部操作栏 -->
    <footer
      class="border-t-solid fixed bottom-0 left-0 box-border flex h-52 w-full items-center gap-16 border-t border-t-[1px] border-t-[#EAEEF4] bg-[#F4F7FA] px-16 py-8"
      @click="launchApp"
    >
      <!-- 评论输入框 -->
      <el-input
        placeholder="Say something..."
        class="rounded-12 placeholder:text-14 h-36 border-none bg-[#EAEEF4] placeholder:font-normal placeholder:text-[#99A0AE]"
        :disabled="true"
      />
      <!-- 点赞数 -->
      <div class="row-items-center gap-4">
        <el-image class="h-24 w-24" :src="LikeIcon" alt="like number" />
        <el-text>{{ forumInfo?.accepted ?? 1 }}</el-text>
      </div>
      <!-- 收藏数 -->
      <div class="row-items-center gap-4">
        <el-image class="h-24 w-24" :src="FavoriteIcon" alt="favorite number" />
        <el-text>{{ forumInfo?.favouriteCount ?? 2 }}</el-text>
      </div>
      <!-- 评论数 -->
      <div class="row-items-center gap-4">
        <el-image class="h-24 w-24" :src="CommentIcon" alt="comment number" />
        <el-text>{{ forumInfo?.commentCount ?? 3 }}</el-text>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.forum-content {
  font-family: 'Roboto', sans-serif;
}
</style>
