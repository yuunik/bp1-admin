<script setup>
import { useRoute } from 'vue-router'
import { reactive } from 'vue'

import { getBrandModelInfoApi } from '@/apis/appApi.js'
import { getFullPath } from '@/utils/dataFormattedUtil.js'
import emitter from '@/utils/emitterUtil.js'
import { EmitterEvent } from '@/utils/constantsUtil.js'

// 车辆详情
const brandModelInfo = reactive({})

// 获取车辆品牌详情
const getBrandModelInfo = async (id) => {
  const { data } = await getBrandModelInfoApi(id)
  // 请求成功
  Object.assign(brandModelInfo, data)
  emitter.emit(EmitterEvent.UPDATE_BREADCRUMB_LIST, brandModelInfo.brand)
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
      <h3 class="heading-h2-20px-medium neutrals-off-black">
        {{ brandModelInfo.brand }}
      </h3>
      <div class="flex gap-8">
        <el-button>Disable</el-button>
        <el-button>Sort</el-button>
        <el-button type="primary">Edit</el-button>
      </div>
    </div>
    <!-- divider -->
    <el-divider />
    <!-- content -->
    <div>
      <!-- 品牌信息 -->
      <div class="px-32 pt-16 pb-24 flex gap-24">
        <!-- 品牌 logo -->
        <div class="flex-1 w-400 h-80 flex gap-24">
          <!-- logo -->
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
        <!-- 品牌名称 -->
        <div class="flex-1 w-384 h-80 flex flex-col gap-4">
          <!-- 名称 -->
          <div class="flex gap-8">
            <!-- 标签 -->
            <label
              class="w-112 h-32 heading-body-body-12px-medium neutrals-grey-3"
            >
              Brand
            </label>
            <!-- 值 -->
            <el-text class="w-264 h-32">
              {{ brandModelInfo?.brand ?? '-' }}
            </el-text>
          </div>
          <!-- 状态 -->
          <div class="flex gap-8">
            <!-- 标签 -->
            <label
              class="w-112 h-32 heading-body-body-12px-medium neutrals-grey-3"
            >
              Status
            </label>
            <!-- 值 -->
            <div class="w-264 h-32">
              <el-tag
                :type="brandModelInfo.isDelete === 0 ? 'success' : 'info'"
              >
                {{ brandModelInfo.isDelete === 0 ? 'Active' : 'Disabled' }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
      <!-- 型号信息-->
      <div>
        <!-- 标签信息 -->
        <div class="px-32 py-7 box-border flex items-center-safe gap-8">
          <h4>Model List</h4>
          <!-- 型号数量 -->
          <el-text class="flex-1">
            {{ brandModelInfo?.vehicleModelDtos?.length ?? 0 }}
          </el-text>
        </div>
        <!-- 分割线 -->
        <el-divider class="mt-8" />
        <!-- 型号列表 -->
        <ul
          class="px-32 grid grid-cols-3 gap-x-24 [&>li]:border-b [&>li]:border-b-solid [&>li]:border-b-[#EAEEF4] [&>li]:h-[32px] [&>li]:pl-8 [&>li]:box-border [&>li]:flex [&>li]:items-center"
        >
          <li
            v-for="vehicleModel in brandModelInfo?.vehicleModelDtos"
            :key="vehicleModel.id"
            class="heading-body-body-12px-regular neutrals-off-black"
          >
            {{ vehicleModel.name }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss"></style>
