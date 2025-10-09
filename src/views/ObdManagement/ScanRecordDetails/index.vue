<script setup>
import { useRoute } from 'vue-router'
import { getFaultCodeListApi } from '@/apis/appApi.js'
import { getDateWithDDMMMYYYY } from '@/utils/dateUtil.js'

const route = useRoute()

// 故障码列表
const faultCodeList = ref([])

// 获取车辆故障码列表
const getFaultCodeList = async () => {
  const {
    data: { dtcItemDtos },
  } = await getFaultCodeListApi('6e0f056c-ef19-42d1-ba9d-5ee3114cca0a')
  faultCodeList.value = dtcItemDtos
}

const {
  params: { id },
} = route
if (id) {
  getFaultCodeList()
}
</script>

<template>
  <section class="flex flex-col gap-16">
    <!-- header -->
    <h3 class="heading-h2-20px-medium text-neutrals-off-black px-32">BMW</h3>
    <!-- divider -->
    <el-divider />
    <!-- vehicle info -->
    <div class="mx-32 mt-6 flex max-w-full justify-between gap-24">
      <div class="flex-1">
        <div class="flex flex-col gap-4">
          <dl class="flex items-center gap-8">
            <dt class="w-112 leading-32 h-32">Scanned Date</dt>
            <dd class="flex-1">-</dd>
          </dl>
          <dl class="flex items-center gap-8">
            <dt class="w-112 leading-32 h-32">Type</dt>
            <dd class="flex-1">-</dd>
          </dl>
        </div>
      </div>
      <div class="flex-1">
        <div class="flex flex-col gap-4">
          <dl class="flex items-center gap-8">
            <dt class="w-112 leading-32 h-32">Fault Codes</dt>
            <dd class="flex-1">-</dd>
          </dl>
        </div>
      </div>
    </div>
    <!-- Fault Codes -->
    <div class="mt-24 flex flex-col gap-8" ref="faultCodesRef">
      <h4
        class="leading-24 heading-body-large-body-14px-medium text-neutrals-off-black mx-32"
      >
        Fault Codes
      </h4>
      <!-- divider -->
      <el-divider />
      <!-- table -->
      <div class="mx-32">
        <el-table :data="faultCodeList" class="w-full">
          <el-table-column type="expand" min-width="2%">
            <template #default="{ row }">
              <el-table :data="row.dtcItemDtcDtos">
                <el-table-column prop="name" label="DTC Name" />
                <el-table-column prop="code" label="Code" />
                <!--<el-table-column prop="severity" label="Severity" />-->
                <!--<el-table-column>-->
                <!--  <template #default="{ row }">-->
                <!--    <el-button class="rounded-full!">View Details</el-button>-->
                <!--  </template>-->
                <!--</el-table-column>-->
              </el-table>
            </template>
          </el-table-column>
          <el-table-column prop="systemName" label="ECU" min-width="50%" />
          <el-table-column label="Fault Codes" min-width="48%">
            <template #default="{ row }">
              <template v-if="row.faultCount === 0">0</template>
              <template v-else-if="row.faultCount === 1">1 DTC</template>
              <template v-else>{{ row.faultCount }} DTCs</template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss"></style>
