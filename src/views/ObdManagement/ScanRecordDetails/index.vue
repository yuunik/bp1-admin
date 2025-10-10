<script setup>
import { useRoute } from 'vue-router'

import { getDateWithDDMMMYYYYhhmma } from '@/utils/dateUtil.js'
import { getVehicleScanRecordDetailApi } from '@/apis/obdApi.js'
import RightIcon from '@/assets/specialIcons/arrow-right-s-line.svg'
import DownIcon from '@/assets/specialIcons/arrow-down-s-line.svg'
import { CirclePlus, RemoveFilled } from '@element-plus/icons-vue'

const route = useRoute()

// 车辆名称
const carName = ref('')

// dtc 详情
const dtcInfo = ref({})

// 故障码列表
const faultCodeList = ref([])

// 获取车辆故障码列表
const getFaultCodeList = async (id) => {
  const { data } = await getVehicleScanRecordDetailApi(id)
  dtcInfo.value = data
  faultCodeList.value =
    dtcInfo.value?.dtcItemDtos && dtcInfo.value?.dtcItemDtos.length
      ? dtcInfo.value.dtcItemDtos.map((item) => ({
          ...item,
          isExpand: false,
        }))
      : []
}

const handleExpandInfo = (dtcInfo) => {
  const item = faultCodeList.value.find((item) => item.id === dtcInfo.id)
  item.isExpand = !item.isExpand
}

const {
  params: { id },
  query: { name },
} = route
if (id) {
  carName.value = name
  getFaultCodeList(id)
}
</script>

<template>
  <section class="flex flex-col gap-16">
    <!-- header -->
    <h3 class="heading-h2-20px-medium text-neutrals-off-black px-32">
      {{ carName }}
    </h3>
    <!-- divider -->
    <el-divider />
    <!-- vehicle info -->
    <div class="mx-32 mt-6 flex max-w-full justify-between gap-24">
      <div class="flex-1">
        <div class="flex flex-col gap-4">
          <dl class="flex items-center gap-8">
            <dt class="w-112 leading-32 h-32">Scanned Date</dt>
            <dd class="flex-1">
              {{ getDateWithDDMMMYYYYhhmma(dtcInfo.createTime) }}
            </dd>
          </dl>
          <dl class="flex items-center gap-8">
            <dt class="w-112 leading-32 h-32">Type</dt>
            <dd class="flex-1">Quick Scan</dd>
          </dl>
        </div>
      </div>
      <div class="flex-1">
        <div class="flex flex-col gap-4">
          <dl class="flex items-center gap-8">
            <dt class="w-112 leading-32 h-32">Fault Codes</dt>
            <dd class="flex-1">
              {{
                dtcInfo.dtcCount
                  ? `${dtcInfo.dtcCount} DTC${dtcInfo.dtcCount > 1 ? 's' : ''}`
                  : '-'
              }}
            </dd>
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
        <!--<el-table :data="faultCodeList" class="w-full">-->
        <!--  <el-table-column type="expand" min-width="2%">-->
        <!--    <template #default="{ row }">-->
        <!--      <el-table :data="row.dtcItemDtcDtos">-->
        <!--        <el-table-column prop="name" label="DTC Name" />-->
        <!--        <el-table-column prop="code" label="Code" />-->
        <!--      </el-table>-->
        <!--    </template>-->
        <!--  </el-table-column>-->
        <!--  <el-table-column prop="systemName" label="ECU" min-width="50%" />-->
        <!--  <el-table-column label="Fault Codes" min-width="48%">-->
        <!--    <template #default="{ row }">-->
        <!--      <template v-if="row.faultCount === 0">0</template>-->
        <!--      <template v-else-if="row.faultCount === 1">1 DTC</template>-->
        <!--      <template v-else>{{ row.faultCount }} DTCs</template>-->
        <!--    </template>-->
        <!--  </el-table-column>-->
        <!--</el-table>-->
        <!-- theader -->
        <el-row class="leading-30">
          <el-col :span="1" />
          <el-col :span="9" class="h-30">
            <span class="heading-body-body-12px-medium text-neutrals-grey-3">
              ECU
            </span>
          </el-col>
          <el-col :span="14" class="h-30">
            <span class="heading-body-body-12px-medium text-neutrals-grey-3">
              Fault Codes
            </span>
          </el-col>
        </el-row>
        <!-- divider -->
        <el-divider />
        <!-- tbody -->
        <div v-for="codeInfo in faultCodeList" :key="codeInfo.id">
          <el-row
            :class="[
              'leading-30',
              { 'bg-status-colours-light-blue-hover': codeInfo.isExpand },
            ]"
          >
            <el-col
              :span="1"
              @click="codeInfo.isExpand = !codeInfo.isExpand"
              class="h-30 row-center"
            >
              <el-image
                :src="codeInfo.isExpand ? DownIcon : RightIcon"
                class="h-16 w-16 cursor-pointer"
              />
            </el-col>
            <el-col :span="9" class="h-30">
              <span
                :class="[
                  'heading-body-body-12px-medium',
                  { 'text-neutrals-grey-4': true },
                ]"
              >
                {{ codeInfo.systemName }}
              </span>
            </el-col>
            <el-col :span="14" class="h-30">
              <span
                :class="[
                  'heading-body-body-12px-medium',
                  { 'text-neutrals-grey-4': true },
                ]"
              >
                {{
                  codeInfo.faultCount
                    ? `${codeInfo.faultCount} DTC${codeInfo.faultCount > 1 ? 's' : ''}`
                    : '-'
                }}
              </span>
            </el-col>
          </el-row>
          <!-- expand content -->
          <div
            v-if="codeInfo.isExpand"
            class="bg-neutrals-off-white box-border py-16"
          >
            <!-- ec-theader -->
            <el-row class="leading-30">
              <el-col :span="1" />
              <el-col :span="9" class="h-30">
                <span
                  class="heading-body-body-12px-medium text-neutrals-grey-4"
                >
                  DTC Name
                </span>
              </el-col>
              <el-col :span="14" class="h-30">
                <span
                  class="heading-body-body-12px-medium text-neutrals-grey-4"
                >
                  Code
                </span>
              </el-col>
            </el-row>
            <!-- divider -->
            <el-row>
              <el-col :span="1" />
              <el-col :span="23">
                <el-divider class="bg-[#FCFCFC]!" />
              </el-col>
            </el-row>
            <!-- ec-tbody -->
            <template
              v-if="codeInfo.dtcItemDtcDtos.length"
              v-for="item in codeInfo.dtcItemDtcDtos"
              :key="item.id"
            >
              <el-row class="leading-30">
                <el-col :span="1" />
                <el-col :span="9" class="h-30">
                  <span
                    class="heading-body-body-12px-medium text-neutrals-grey-4"
                  >
                    {{ item.name }}
                  </span>
                </el-col>
                <el-col :span="14" class="h-30">
                  <span
                    class="heading-body-body-12px-medium text-neutrals-grey-4"
                  >
                    {{ item.code }}
                  </span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="1" />
                <el-col :span="23">
                  <el-divider class="bg-[#FCFCFC]!" />
                </el-col>
              </el-row>
            </template>
            <el-empty v-else />
          </div>
          <el-divider class="bg-neutrals-grey-1!" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss"></style>
