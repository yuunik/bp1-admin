<script setup>
import { useRoute } from 'vue-router'

import { VehicleDetailTabs } from '@/utils/constantsUtil.js'
import VehicleDetails from './VehicleDetails.vue'
import LiveData from './LiveData.vue'
import FaultCodes from './FaultCodes.vue'
import ScannedHistory from './ScannedHistory.vue'
import { getVehicleInfoApi } from '@/apis/obdApi.js'

const activeTabName = ref(VehicleDetailTabs.VEHICLE_DETAILS)

const route = useRoute()

// 车辆详情
const vehicleDetails = reactive({})

const handleTabClick = (tabName) => (activeTabName.value = tabName)

// tabPane 组件映射
const tabPaneList = Object.freeze([
  {
    key: VehicleDetailTabs.VEHICLE_DETAILS,
    component: VehicleDetails,
  },
  {
    key: VehicleDetailTabs.LIVE_DATA,
    component: LiveData,
  },
  {
    key: VehicleDetailTabs.FAULT_CODES,
    component: FaultCodes,
  },
  {
    key: VehicleDetailTabs.SCANNED_HISTORY,
    component: ScannedHistory,
  },
])

// 获取车辆详情
const getVehicleDetails = async (id) => {
  const { data } = await getVehicleInfoApi(id)
  Object.assign(vehicleDetails, data)
}

// 获取页面路径id, 发起请求
const {
  params: { id },
} = route
if (id) {
  getVehicleDetails(id)
}

// 提供 vehicle info
provide('vehicleDetails', vehicleDetails)
</script>

<template>
  <section class="flex h-full flex-col overflow-auto">
    <!-- header -->
    <h3 class="heading-h2-20px-medium text-neutrals-off-black px-32">
      {{ vehicleDetails.brand }}
    </h3>
    <!-- divider -->
    <el-divider class="mt-16! mb-19!" />
    <!-- tabs -->
    <el-tabs v-model="activeTabName" @tab-click="handleTabClick" class="ml-32">
      <el-tab-pane
        :label="VehicleDetailTabs.VEHICLE_DETAILS"
        :name="VehicleDetailTabs.VEHICLE_DETAILS"
      />
      <el-tab-pane
        :label="VehicleDetailTabs.LIVE_DATA"
        :name="VehicleDetailTabs.LIVE_DATA"
      />
      <el-tab-pane
        :label="VehicleDetailTabs.FAULT_CODES"
        :name="VehicleDetailTabs.FAULT_CODES"
      />
      <el-tab-pane
        :label="VehicleDetailTabs.SCANNED_HISTORY"
        :name="VehicleDetailTabs.SCANNED_HISTORY"
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
