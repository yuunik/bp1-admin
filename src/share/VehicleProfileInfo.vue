<script setup>
import { useRoute } from 'vue-router'

import AppScaffold from '@/components/AppScaffold.vue'
import { getPhotoInfoApi } from '@/apis/shareApi.js'
import { getFullFilePath } from '@/utils/dataFormattedUtil.js'
import DefaultCardImg from '@/assets/specialIcons/default-car-img.svg'
import EmptyStatePic from '@/assets/specialIcons/Empty States.svg'

const vehicleProfileInfo = ref({})

const route = useRoute()

const getCornerClass = (index) => {
  const cols = 3
  const total = 30
  const lastRow = Math.floor((total - 1) / cols)

  const row = Math.floor(index / cols)
  const col = index % cols

  if (row === 0 && col === 0) return 'rounded-tl-12'
  if (row === 0 && col === cols - 1) return 'rounded-tr-12'
  if (row === lastRow && col === 0) return 'rounded-bl-12'
  if (row === lastRow && col === cols - 1) return 'rounded-br-12'
  return ''
}

// 获取图片详情
const getPicInfo = async (id) => {
  const { data } = await getPhotoInfoApi(id)
  vehicleProfileInfo.value = data
}

// 相册图片张数
const picCount = computed(() =>
  vehicleProfileInfo.value.attachmentDtos &&
  vehicleProfileInfo.value.attachmentDtos.length
    ? vehicleProfileInfo.value.attachmentDtos.length
    : 0,
)

const {
  params: { id },
} = route
if (id) {
  getPicInfo(id)
}
</script>

<template>
  <app-scaffold
    footer-gap="gap-16"
    footer-display="flex items-center"
    content-py="py-8"
    :is-app-bar-visible="true"
    :is-title-visible="true"
    :is-footer-visible="false"
    class="code-info-container"
  >
    <div class="flex gap-16">
      <div class="h-66 flex flex-1 flex-col gap-4">
        <h2 class="h2-20px-semibold text-neutrals-off-black">
          {{ vehicleProfileInfo.vehicleDto?.brand }}
          {{ vehicleProfileInfo.vehicleDto?.model }}
        </h2>
        <span class="heading-body-large-body-14px-regular">
          {{ picCount }} photo{{ picCount !== 1 ? 's' : '' }}
        </span>
      </div>
      <el-image
        :src="vehicleProfileInfo.vehicleDto?.cover"
        fit="cover"
        class="rounded-12 h-64 w-96 object-cover"
      >
        <template #error>
          <!-- 车辆图片加载失败的默认 -->
          <el-image
            :src="DefaultCardImg"
            alt="user vehicle image"
            fit="cover"
          />
        </template>
      </el-image>
    </div>
    <div
      class="mt-20 grid grid-cols-3 gap-2"
      v-if="
        vehicleProfileInfo.attachmentDtos &&
        vehicleProfileInfo.attachmentDtos.length
      "
    >
      <el-image
        v-for="(attachment, index) in vehicleProfileInfo.attachmentDtos"
        :key="attachment.id"
        :src="getFullFilePath(attachment.path)"
        fit="cover"
        class="aspect-square w-full object-cover"
        :class="{ [getCornerClass(index)]: true }"
      />
    </div>
    <el-empty v-else class="m-auto">
      <template #image>
        <el-image :src="EmptyStatePic" class="w-200 h-200" fit="cover" />
      </template>
      <template #description>
        <div class="flex flex-col gap-8">
          <h3 class="h2-20px-semibold text-neutrals-off-black h-23 flex-center">
            No Photos Yet
          </h3>
          <span
            class="heading-body-large-body-14px-regular text-neutrals-grey-4 row-center text-align-center h-32"
          >
            Upload photos of your vehicle to create your personal
            <br />
            car album.
          </span>
        </div>
      </template>
    </el-empty>
  </app-scaffold>
</template>

<style scoped lang="scss">
:deep(.el-scrollbar__view) {
  @apply flex h-full w-full flex-col;
}
</style>
