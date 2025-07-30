<script setup>
import { useRoute } from 'vue-router'
import { reactive } from 'vue'

import { getBrandModelInfoApi } from '@/apis/appApi.js'
import { getFullPath } from '@/utils/dataFormattedUtil.js'

// 车辆详情
const brandModelInfo = reactive({})

// 获取车辆品牌详情
const getBrandModelInfo = async (id) => {
  const { data } = await getBrandModelInfoApi(id)
  // 请求成功
  Object.assign(brandModelInfo, data)
}

// 组件创建时
const route = useRoute()
if (route.params.id) {
  // 有 id , 则说明查看详情
  getBrandModelInfo(route.params.id)
}
</script>

<template>
  <section class="h-full">
    <!-- header -->
    <div class="py-16 px-32 flex-between">
      <h3 class="heading-h2-20px-medium neutrals-off-black">Audi</h3>
      <div class="flex gap-8">
        <el-button>Disable</el-button>
        <el-button>Sort</el-button>
        <el-button type="primary">Edit</el-button>
      </div>
    </div>
    <!-- divider -->
    <el-divider />
    <!-- content -->
    <div class="px-32 py-16">
      <!-- 车辆信息 -->
      <div>
        <div class="w-400 h-80 flex gap-24">
          <!-- 车辆品牌 logo -->
          <el-image
            v-if="brandModelInfo"
            :src="getFullPath(brandModelInfo?.logo)"
            fit="cover"
            class="w-64 h-64"
            loading="lazy"
          />
          <!-- desc -->
          <div class="flex flex-col gap-16">
            <el-text>Logo</el-text>
            <!-- 更换 logo 图片 -->
            <el-button>Change</el-button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss"></style>
