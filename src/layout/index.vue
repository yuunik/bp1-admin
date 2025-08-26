<script setup>
import { storeToRefs } from 'pinia'
import { computed, provide } from 'vue'
import { useRoute } from 'vue-router'

import routes from '@/router/routes/index.js'
import { useUserStore } from '@/store/index.js'
import MenuItem from './components/MenuItem/index.vue'
import Breadcrumb from './components/Breadcrumb/index.vue'

import CompanyLogo from '@/assets/icons/company-logo.svg'

const userStore = useUserStore()
// 获取用户相关信息
const { username, userRole, usernameAbbr } = storeToRefs(userStore)
const route = useRoute()
const dynamicBreadcrumbList = computed(() =>
  route.matched.map((item) => ({ ...item })),
)

provide('dynamicBreadcrumbList', dynamicBreadcrumbList)
</script>

<template>
  <div class="bg-container">
    <!-- menu bar -->
    <nav class="heading-body-body-12px-regular relative flex flex-col gap-16">
      <!-- Company Logo -->
      <img :src="CompanyLogo" alt="Company Logo" class="w-83 ml-8 mt-8 h-24" />
      <!-- menu -->
      <el-menu
        class="nav-menu"
        background-color="transparent"
        text-color="#99A0AE"
        :default-active="$route.path"
      >
        <menu-item :user-menu-routes="routes" />
      </el-menu>
      <!-- user center -->
      <ul class="neutrals-grey-3 flex flex-col gap-16 p-8">
        <li class="flex cursor-pointer items-center gap-8">
          <i class="icon-typesnotification text-16" />
          <span class="flex-1">Notifications</span>
          <!-- notification dot -->
          <i
            class="icon-typesnotification-dot heading-caption-caption-10px-medium3 neutrals-grey-3"
          >
            1
          </i>
        </li>
        <li class="item-style">
          <i class="icon-typessetting" />
          <span>Settings</span>
        </li>
        <el-divider class="divider" />
        <!-- 底部用户信息相关设置 -->
        <li class="item-style">
          <!-- user avatar-->
          <i class="user-avatar">
            <!-- 用户名字缩写 -->
            <span class="heading-body-body-12px-medium">
              {{ usernameAbbr }}
            </span>
          </i>
          <!-- user info -->
          <div class="flex flex-col gap-8">
            <!-- user name -->
            <span class="heading-caption-caption-10px-medium">
              {{ username }}
            </span>
            <!-- user role -->
            <span class="heading-caption-caption-10px-regular">
              {{ userRole }}
            </span>
          </div>
        </li>
      </ul>
      <!-- expand button -->
      <div class="expand-btn">
        <i class="icon-typescollapsable1" />
      </div>
    </nav>
    <!-- content -->
    <main class="content-container">
      <!-- breadcrumb -->
      <breadcrumb class="shrink-0" />
      <!-- router view -->
      <router-view class="flex-1" />
    </main>
  </div>
</template>

<style scoped lang="scss">
.bg-container {
  // 公用背景色
  @extend %common-bg-style;

  // 菜单栏
  .nav-menu {
    @apply w-210 flex-1 overflow-hidden border-none;
  }

  // 底部用户信息相关设置
  .item-style {
    @apply flex cursor-pointer items-center gap-8;

    // user avatar
    .user-avatar {
      @apply flex-center h-32 w-32 rounded-full;
      background-color: $neutrals-10-white;
    }
  }

  // 消息通知图标
  .icon-typesnotification-dot {
    @apply rounded-100 flex-center h-16 w-16;
    background-color: $status-colours-green;
  }

  // 展开按钮
  .expand-btn {
    @apply rounded-200 flex-center absolute h-72 w-16 cursor-pointer;
    border: 1px $neutrals-grey-2 solid;
    background-color: $neutrals-off-white;
    top: 50%;
    right: -16px;
  }

  // 内容区域
  .content-container {
    @apply rounded-8 flex h-full flex-1 flex-col;
    background-color: $neutrals-off-white;
  }
}
</style>
