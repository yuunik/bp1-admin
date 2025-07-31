<script setup>
import { ref, reactive, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

import { getForumInfoApi } from '@/apis/shareApi.js'
import { getFullPath } from '@/utils/dataFormattedUtil.js'
import ErrorImage from '@/assets/images/error-img.png'
import { getCommentTime } from '@/utils/dateUtil.js'

// 点赞图标
import LikeIcon from '@/assets/icons/fi_like.svg'
// 评论图标
import CommentIcon from '@/assets/icons/fi_message-square.svg'
// 收藏图标
import FavoriteIcon from '@/assets/icons/fi_star_b.svg'

// 获取路由
const route = useRoute()

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

// 计时器
const timer = ref(null)
// 跳转app
const handleOpenInApp = () => {
  // 获取设备信息
  const useAgent = navigator.userAgent.toLowerCase()
  // 是否为安卓设备
  const isAndroid = /android/i.test(useAgent)
  // 是否为ios设备
  const isIOS = /iphone|ipad|ipod/i.test(useAgent)
  // 尝试打开应用
  window.location.href = 'diagnostics://open'

  // 未安装应用时(超时未唤起), 则跳转到应用市场
  timer.value = setTimeout(() => {
    // 如果用户没跳出页面，大概率是点击了“取消”
    if (!document.hidden) {
      return
    }
    if (isIOS) {
      window.location.href = 'https://itunes.apple.com/cn/app/id6748522066'
    } else if (isAndroid) {
      // TODO: 安卓应用市场链接
      window.location.href = 'https://itunes.apple.com/cn/app/id6748522066'
    }
  }, 2000)
}

// 头像加载失败的回调
const handleErrorImage = () => true

// 组件销毁时
onBeforeUnmount(() => {
  // 清除定时器
  if (timer.value) {
    clearTimeout(timer.value)
    timer.value = null
  }
})
</script>

<template>
  <!-- 论坛详情 -->
  <div className="w-full h-full flex-col-between bg-[#F4F7FA]">
    <!-- 用户贴文内容 -->
    <main class="px-20 pt-8 flex-col-between gap-24">
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
          <el-text class="w-full text-align-left">
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
          <p class="heading-h3-16px-regular">{{ forumInfo?.content }}</p>
        </section>
        <!-- 图片 -->
        <section
          v-if="
            forumInfo?.attachmentDtos && forumInfo.attachmentDtos.length > 0
          "
          class="w-full flex flex-col gap-12 mt-16"
        >
          <!-- 第一行：1张图片 -->
          <div
            v-if="forumInfo.attachmentDtos.length >= 1"
            class="w-full h-257 bg-cover bg-center bg-no-repeat rounded-8"
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
              v-for="(item, index) in forumInfo.attachmentDtos.slice(1, 3)"
              :key="index + 1"
              class="w-full h-166 bg-cover bg-center bg-no-repeat rounded-8"
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
              v-for="(item, index) in forumInfo.attachmentDtos.slice(3, 6)"
              :key="index + 3"
              class="w-full h-150 bg-cover bg-center bg-no-repeat rounded-8"
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
              class="w-full h-150 bg-cover bg-center bg-no-repeat rounded-8"
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
      class="fixed right-112 left-112 bottom-68 btn-12 bg-[#006BF7] h-48"
      type="primary"
      @click="handleOpenInApp"
    >
      Open in App
    </el-button>
    <!-- 底部操作栏 -->
    <footer
      class="fixed bottom-0 left-0 w-full h-52 bg-[#F4F7FA] px-16 py-8 box-border flex items-center gap-16 border-t border-t-[1px] border-t-[#EAEEF4] border-t-solid"
    >
      <!-- 评论输入框 -->
      <el-input
        placeholder="Say something..."
        class="bg-[#EAEEF4] h-36 rounded-12 border-none placeholder:text-14 placeholder:text-[#99A0AE] placeholder:font-normal"
        :disabled="true"
      />
      <!-- 点赞数 -->
      <div class="row-items-center gap-4">
        <el-image class="w-24 h-24" :src="LikeIcon" alt="like number" />
        <el-text>{{ forumInfo?.accepted ?? 1 }}</el-text>
      </div>
      <!-- 收藏数 -->
      <div class="row-items-center gap-4">
        <el-image class="w-24 h-24" :src="FavoriteIcon" alt="favorite number" />
        <el-text>{{ forumInfo?.favouriteCount ?? 2 }}</el-text>
      </div>
      <!-- 评论数 -->
      <div class="row-items-center gap-4">
        <el-image class="w-24 h-24" :src="CommentIcon" alt="comment number" />
        <el-text>{{ forumInfo?.commentCount ?? 3 }}</el-text>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss"></style>
