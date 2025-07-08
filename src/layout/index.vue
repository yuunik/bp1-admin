<script setup>
import MenuItem from './components/MenuItem/index.vue'
import Breadcrumb from './components/Breadcrumb/index.vue'
import routes from '@/router/routes/index.js'
</script>

<template>
  <div class="bg-container">
    <!-- menu bar -->
    <nav class="w-200 heading-body-body-12px-regular flex flex-col gap-16 box-border relative">
      <!-- Company Logo -->
      <img src="/src/assets/icons/company-logo.svg" alt="Logo" class="w-83 h-24 mt-8 ml-8" />
      <!-- menu -->
      <el-menu class="nav-menu" background-color="transparent" text-color="#99A0AE">
        <menu-item :user-menu-routes="routes" />
      </el-menu>
      <!-- user center -->
      <ul class="p-8 flex flex-col gap-16">
        <li class="flex items-center gap-8 cursor-pointer">
          <i class="icon-typesnotification text-16" />
          <span class="flex-1">Notifications</span>
          <!-- notification dot -->
          <i class="icon-typesnotification-dot heading-caption-caption-10px-medium">1</i>
        </li>
        <li class="item-style">
          <i class="icon-typessetting" />
          <span>Settings</span>
        </li>
        <el-divider class="divider" />
        <li class="item-style">
          <!-- user avatar-->
          <i class="user-avatar">
            <span class="heading-body-body-12px-medium">JW</span>
          </i>
          <!-- user info -->
          <div class="flex flex-col gap-8">
            <!-- user name -->
            <span class="heading-caption-caption-10px-medium">Jonathan</span>
            <!-- user role -->
            <span class="heading-caption-caption-10px-regular">Admin</span>
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
      <breadcrumb />
      <router-view />
    </main>
  </div>
</template>

<style scoped lang="scss">
.bg-container {
  @extend %common-bg-style;
  @apply h-full p-8 flex gap-8 text-white;

  .content-container {
    @apply flex-1 w-872 flex-auto h-full rounded-8;
    background-color: $neutrals-off-white;
  }

  .nav-menu {
    border: none;
    @apply flex-1 overflow-hidden;
  }

  .divider {
    border: 1px $neutrals-10-white solid;
    margin: 0;
  }

  // user avatar
  .user-avatar {
    @apply w-32 h-32 rounded-full flex-center;
    background-color: $neutrals-10-white;
  }

  .icon-typesnotification-dot {
    @apply rounded-100 w-16 h-16 flex-center;
    background-color: $status-colours-green;
  }

  .expand-btn {
    @apply absolute w-16 h-72 rounded-200 flex-center cursor-pointer;
    border: 1px $neutrals-grey-2 solid;
    background-color: $neutrals-off-white;
    top: 50%;
    right: -16px;
  }
}

.item-style {
  @apply flex gap-8 items-center cursor-pointer;
}
</style>