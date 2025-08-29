<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import { ObdDetailsTabs, RouteName } from '@/utils/constantsUtil.js'
import ObdDetails from './ObdDetails.vue'
import BehaviorStatistics from './BehaviorStatistics.vue'
import { getOBDInfoApi, unbindOBDApi } from '@/apis/obdApi.js'

// 当前激活的标签
const activeTabName = ref(ObdDetailsTabs.OBD_DETAILS)

// OBD 信息
const obdInfo = ref({})

// 当前 OBD 的id
const currentOBDId = ref('')

// 路由
const route = useRoute()

// 路由器
const router = useRouter()

// 点击标签
const handleTabClick = (tab) => (activeTabName.value = tab)

// tabPane 组件映射
const tabPaneList = Object.freeze([
  {
    key: ObdDetailsTabs.OBD_DETAILS,
    component: ObdDetails,
  },
  {
    key: ObdDetailsTabs.BEHAVIOR_STATISTICS,
    component: BehaviorStatistics,
  },
])

// 获取 OBD 详情
const getOBDInfo = async (id) => {
  const { data } = await getOBDInfoApi(id)
  obdInfo.value = data
}

// 解绑 OBD 绑定的用户
const handleUnbindUser = async () => {
  await unbindOBDApi(currentOBDId.value)
  ElMessage.success('Unbind success')
}

const obdDetailsRef = ref(null)

const handleScrollToBehaviorStatistics = () => {
  obdDetailsRef.value.scrollToBehaviorStatistics()
}

// 获取路径中 id
const {
  params: { id },
} = route
if (id) {
  // 记录当前 OBD id
  currentOBDId.value = id
  getOBDInfo(id)
}

// 提供 OBD 详情
provide('obdInfo', obdInfo)
provide('getOBDInfo', getOBDInfo)
</script>

<template>
  <router-view
    v-if="$route.name === RouteName.VIEW_VEHICLE"
    @refresh="getOBDInfo"
  />
  <section class="flex h-full flex-col overflow-auto" v-else>
    <!-- header -->
    <div class="flex-between px-32">
      <h3 class="heading-h2-20px-medium text-neutrals-off-black">
        {{ obdInfo.sn }}
      </h3>
      <el-button @click="handleUnbindUser" v-if="obdInfo.userDto?.id">
        Unbind User
      </el-button>
    </div>
    <!-- divider -->
    <el-divider class="mt-16! mb-19!" />
    <!-- tabs -->
    <!--<el-tabs v-model="activeTabName" @tab-click="handleTabClick" class="ml-32">-->
    <!--  <el-tab-pane-->
    <!--    :label="ObdDetailsTabs.OBD_DETAILS"-->
    <!--    :name="ObdDetailsTabs.OBD_DETAILS"-->
    <!--  />-->
    <!--  <el-tab-pane-->
    <!--    :label="ObdDetailsTabs.BEHAVIOR_STATISTICS"-->
    <!--    :name="ObdDetailsTabs.BEHAVIOR_STATISTICS"-->
    <!--  />-->
    <!--</el-tabs>-->
    <div class="el-tabs el-tabs--top ml-32">
      <div class="el-tabs__header is-top">
        <div class="el-tabs__nav-wrap is-top">
          <!---->
          <div class="el-tabs__nav-scroll">
            <div
              class="el-tabs__nav is-top"
              role="tablist"
              style="transform: translateX(0px)"
            >
              <div
                class="el-tabs__active-bar is-top"
                style="width: 79px; transform: translateX(0px)"
              ></div>
              <div
                class="el-tabs__item is-top is-active"
                id="tab-OBD Details"
                aria-controls="pane-OBD Details"
                role="tab"
                aria-selected="true"
                tabindex="0"
              >
                OBD Details
                <!---->
              </div>
              <div
                class="el-tabs__item is-top"
                id="tab-Behavior Statistics"
                aria-controls="pane-Behavior Statistics"
                role="tab"
                aria-selected="false"
                tabindex="-1"
                @click="handleScrollToBehaviorStatistics"
              >
                Behavior Statistics
                <!---->
              </div>
            </div>
          </div>
        </div>
        <!---->
      </div>
    </div>
    <!-- divider -->
    <el-divider class="mb-16!" />
    <!-- content -->
    <obd-details ref="obdDetailsRef" />
  </section>
</template>

<style scoped lang="scss"></style>
