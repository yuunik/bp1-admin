<script setup>
import { reactive } from 'vue'
import { useRoute } from 'vue-router'

import AppScaffold from '@/components/AppScaffold.vue'
import { getVehicleErrorCodeInfoApi } from '@/apis/shareApi.js'

// 图片加载错误的图片
import LevelIcon from '@/assets/specialIcons/Ellipse 1.svg'
import BaseSvgIcon from '@/components/BaseSvgIcon.vue'
import { getDateWithDDMMMYYYYhhmma } from '@/utils/dateUtil.js'

// 获取路由
const route = useRoute()

// 修改该网页的标题
document.title = route.meta.title

// 贴文详情
const faultInfo = reactive({})

// 获取错误码详情
const getFaultInfo = async (id) => {
  const { data } = await getVehicleErrorCodeInfoApi(id)
  Object.assign(faultInfo, data)
}

// 获取当前页面的id
const faultCodeId = route.params.id
if (faultCodeId) {
  // 有id, 则获取贴文详情
  getFaultInfo(faultCodeId)
}
</script>

<template>
  <app-scaffold
    footer-gap="gap-16"
    footer-display="flex items-center"
    content-py="py-8"
    app-bar-title="Fault Details"
    :is-actions-visible="true"
    :is-leading-visible="true"
    :is-footer-visible="false"
    :is-title-visible="true"
  >
    <!-- 内容 -->
    <article class="mt-24 flex flex-col gap-16">
      <!-- 错误码详情 -->
      <section class="bg-branding-primary rounded-20 flex flex-col gap-16 p-16">
        <!-- ecuName -->
        <div class="h-19 row-center gap-8">
          <base-svg-icon name="engine-load" color="#FFFFFF" size="20px" />
          <span class="heading-h3-16px-regular text-neutrals-white">
            {{ faultInfo.dtcName }}
          </span>
        </div>
        <!-- faultName -->
        <div class="h-68 flex flex-col gap-8">
          <h2 class="h2-20px-semibold text-neutrals-white h-46">
            {{ faultInfo.title }}
          </h2>
          <p class="font-400 text-12 text-neutrals-grey-2 leading-14 h-14">
            Code: {{ faultInfo.code }},
            {{ getDateWithDDMMMYYYYhhmma(faultInfo.createTime) }}
          </p>
        </div>
        <el-button>
          <template #icon>
            <base-svg-icon name="fi_tool" color="#1B1A1E" size="20px" />
          </template>
          <span class="heading-h3-16px-regular text-branding-primary">
            Repair
          </span>
        </el-button>
      </section>
      <!-- Description -->
      <section
        class="rounded-20 bg-neutrals-card-filling flex flex-col gap-16 p-16"
      >
        <div class="row-center h-20 gap-8">
          <base-svg-icon name="description" color="#1B1A1E" size="20px" />
          <h3 class="heading-h3-16px-regular text-neutrals-off-black">
            Description
          </h3>
        </div>
        <p class="heading-body-large-body-14px-regular text-neutrals-grey-4">
          {{ faultInfo.description }}
        </p>
      </section>
      <!-- Possible Symptoms -->
      <section
        class="rounded-20 bg-neutrals-card-filling flex flex-col gap-16 p-16"
      >
        <div class="row-center h-20 gap-8">
          <base-svg-icon name="possible symptoms" color="#1B1A1E" size="20px" />
          <h3 class="heading-h3-16px-regular text-neutrals-off-black">
            Possible Symptoms
          </h3>
        </div>
        <p class="heading-body-large-body-14px-regular text-neutrals-grey-4">
          {{ faultInfo.symptoms }}
        </p>
      </section>
      <!-- Repair Importance Level -->
      <section
        class="rounded-20 bg-neutrals-card-filling flex flex-col gap-16 p-16"
      >
        <div class="row-center h-20 gap-8">
          <base-svg-icon
            name="repair lmportance level"
            color="#1B1A1E"
            size="20px"
          />
          <h3 class="heading-h3-16px-regular text-neutrals-off-black">
            Repair Importance Level
          </h3>
        </div>
        <div class="row-center h-16 gap-8">
          <base-svg-icon
            name="ellipse 1"
            :color="
              faultInfo.level === 0
                ? '#05AD9D'
                : faultInfo.level === 1
                  ? '#FF6D1A'
                  : '#EF3C30'
            "
            size="6px"
          />
          <span
            :class="[
              'heading-body-large-body-14px-regular',
              {
                'text-status-colours-green': faultInfo.level === 0,
                'text-status-colours-orange': faultInfo.level === 1,
                'text-status-colours-red': faultInfo.level === 2,
              },
            ]"
          >
            {{
              faultInfo.level === 0
                ? 'LOW'
                : faultInfo.level === 1
                  ? 'Medium'
                  : 'High'
            }}
          </span>
        </div>
        <p class="heading-body-large-body-14px-regular text-neutrals-grey-4">
          {{ faultInfo.levelDescription }}
        </p>
      </section>
      <!-- Estimated Cost -->
      <section
        class="rounded-20 bg-neutrals-card-filling flex flex-col gap-16 p-16"
      >
        <div class="row-center h-20 gap-8">
          <base-svg-icon name="price" color="#1B1A1E" size="20px" />
          <h3 class="heading-h3-16px-regular text-neutrals-off-black">
            Estimated Cost
          </h3>
        </div>
        <!-- cost -->
        <div class="flex flex-col gap-8">
          <div class="flex-between h-16">
            <p
              class="heading-body-large-body-14px-regular text-neutrals-grey-4"
            >
              Part
            </p>
            <span
              class="heading-body-large-body-14px-regular text-neutrals-off-black"
            >
              {{ faultInfo.part }}
            </span>
          </div>
          <div class="flex-between h-16">
            <p
              class="heading-body-large-body-14px-regular text-neutrals-grey-4"
            >
              Labour
            </p>
            <span
              class="heading-body-large-body-14px-regular text-neutrals-off-black"
            >
              {{ faultInfo.labour }}
            </span>
          </div>
          <el-divider />
          <div class="flex-between h-16">
            <p
              class="heading-body-large-body-14px-regular text-neutrals-grey-4"
            >
              Total
            </p>
            <span
              class="heading-body-large-body-14px-regular text-neutrals-off-black"
            >
              {{ faultInfo.total }}
            </span>
          </div>
        </div>
      </section>
    </article>
  </app-scaffold>
</template>

<style scoped lang="scss"></style>
