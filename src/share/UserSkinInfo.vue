<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { getSkinInfoApi } from '@/apis/shareApi'
import { getFullFilePath } from '@/utils/dataFormattedUtil.js'
import AppScaffold from '@/components/AppScaffold.vue'
import BaseInfoCard from '@/components/BaseInfoCard.vue'

// 当前用户皮肤id
const userSkinId = ref('')

// 用户信息
const userInfo = ref({})

// 皮肤信息
const skinInfo = ref({})

// 获取路由参数
const route = useRoute()

// 获取用户皮肤信息
const getUserSkinInfo = async () => {
  const { data } = await getSkinInfoApi(userSkinId.value)
  userInfo.value = data.userInfo
  skinInfo.value = data.skinInfo
}

const {
  params: { id },
} = route
if (id) {
  userSkinId.value = id
  getUserSkinInfo()
}
</script>

<template>
  <app-scaffold
    content-py="py-8"
    :is-app-bar-visible="false"
    :is-footer-visible="false"
  >
    <base-info-card
      :logo="userInfo.logo"
      :name="userInfo.name"
      :avatar-size="40"
      name-style="text-16 text-neutrals-off-black"
    />
    <div class="mt-24 flex flex-col gap-8">
      <span>{{ skinInfo.name }}</span>
      <el-image
        :src="getFullFilePath(skinInfo.cover)"
        fit="cover"
        :preview-src-list="[getFullFilePath(skinInfo.cover)]"
        :max-scale="1"
      />
    </div>
  </app-scaffold>
</template>

<style scoped lang="scss">
:deep(.el-scrollbar__view) {
  @apply h-full;
}

:deep(.el-image-viewer__wrapper) {
  @apply bg-black; /* 完全不透明 */
}
</style>
