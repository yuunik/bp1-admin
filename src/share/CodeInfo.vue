<script setup>
import { getVerifyCodeApi } from '@/apis/shareApi.js'
import { getDateWithDDMMMYYYYhhmma } from '@/utils/dateUtil.js'
import AppScaffold from '@/components/AppScaffold.vue'

const codeList = ref([])

const getCode = async () => {
  const { data } = await getVerifyCodeApi()
  codeList.value = data
}

getCode()
</script>

<template>
  <app-scaffold
    footer-gap="gap-16"
    footer-display="flex items-center"
    content-py="py-8"
    app-bar-title="Email verification code"
    :is-actions-visible="false"
    :is-leading-visible="false"
    :is-app-bar-visible="true"
    :is-title-visible="true"
    :is-footer-visible="false"
    :is-open-app-visible="false"
    class="code-info-container"
  >
    <section
      class="flex flex-col gap-8 rounded-3xl border border-solid border-gray-200 bg-white p-20 shadow-sm"
      v-for="(codeInfo, index) in codeList"
      :key="codeInfo.createdTime"
      v-if="codeList.length"
    >
      <div class="flex items-center justify-between">
        <p class="font-medium text-gray-800">{{ codeInfo.email }}</p>
        <span
          class="text-status-colours-blue text-18 font-semibold tracking-wider"
        >
          {{ codeInfo.code }}
        </span>
      </div>
      <p class="text-neutrals-grey-4">
        {{ getDateWithDDMMMYYYYhhmma(codeInfo.createTime) }}
      </p>
    </section>
    <el-empty description="No valid data" class="m-auto" v-else />
  </app-scaffold>
</template>

<style scoped lang="scss">
// 重置el-scrollbar样式
.code-info-container :deep(.el-scrollbar__view) {
  @apply flex h-full w-full flex-col gap-12;
}
</style>
