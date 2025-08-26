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
const obdInfo = reactive({})

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
  Object.assign(obdInfo, data)
}

// 解绑 OBD 绑定的用户
const handleUnbindUser = async () => {
  await unbindOBDApi(currentOBDId)
  ElMessage.success('Unbind success')
  // 路由跳转至 OBD List 页
  router.push({ name: RouteName.OBD_LIST })
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
</script>

<template>
  <section class="flex h-full flex-col overflow-auto">
    <!-- header -->
    <div class="flex-between px-32">
      <h3 class="heading-h2-20px-medium text-neutrals-off-black">
        PD-1 | A000002
      </h3>
      <el-button @click.stop="handleUnbindUser">Unbind User</el-button>
    </div>
    <!-- divider -->
    <el-divider class="mt-16! mb-19!" />
    <!-- tabs -->
    <el-tabs v-model="activeTabName" @tab-click="handleTabClick" class="ml-32">
      <el-tab-pane
        :label="ObdDetailsTabs.OBD_DETAILS"
        :name="ObdDetailsTabs.OBD_DETAILS"
      />
      <el-tab-pane
        :label="ObdDetailsTabs.BEHAVIOR_STATISTICS"
        :name="ObdDetailsTabs.BEHAVIOR_STATISTICS"
      />
    </el-tabs>
    <!-- divider -->
    <el-divider class="mb-16!" />
    <!-- content -->
    <keep-alive>
      <component
        :is="tabPaneList.find((tab) => tab.key === activeTabName).component"
        class="flex-1"
      />
    </keep-alive>
  </section>
</template>

<style scoped lang="scss"></style>
