<script setup>
import { useRoute } from 'vue-router'

import { getDateWithDDMMMYYYYhhmma } from '@/utils/dateUtil.js'
import { getVehicleScanRecordDetailApi } from '@/apis/obdApi.js'
import EngineIcon from '@/assets/icons/engine-load.svg'
import TransmissionIcon from '@/assets/icons/tranmission.svg'
import BrakesIcon from '@/assets/icons/brakes.svg'
import ElectricalIcon from '@/assets/icons/electronic-central-electric.svg'
import ChassisIcon from '@/assets/icons/chassis.svg'
import BodyAndTrimIcon from '@/assets/icons/services-icon.svg'
import OthersIcon from '@/assets/icons/others-icon.svg'
import { VehicleEcuCategory } from '@/utils/constantsUtil.js'

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

// 是否有 fault code 列表
const hasFaultCodeList = computed(
  () => faultCodeList.value && faultCodeList.value.length > 0,
)

// 引擎分类
const engineItemList = computed(() =>
  hasFaultCodeList.value
    ? faultCodeList.value.filter(
        (item) => item.type === VehicleEcuCategory.ENGINE,
      )
    : [],
)

// 引擎系统DTC数量
const engineSystemDtcCount = computed(() =>
  engineItemList.value.length
    ? engineItemList.value.reduce(
        (pre, cur) => pre + cur.dtcItemDtcDtos.length,
        0,
      )
    : 0,
)

// 变速箱分类
const transmissionItemList = computed(() =>
  hasFaultCodeList.value
    ? faultCodeList.value.filter(
        (item) => item.type === VehicleEcuCategory.TRANSMISSION,
      )
    : [],
)

// 变速箱系统DTC数量
const transmissionSystemDtcCount = computed(() =>
  transmissionItemList.value.length
    ? transmissionItemList.value.reduce(
        (pre, cur) => pre + cur.dtcItemDtcDtos.length,
        0,
      )
    : 0,
)

// 制动分类
const brakesItemList = computed(() =>
  hasFaultCodeList.value
    ? faultCodeList.value.filter(
        (item) => item.type === VehicleEcuCategory.BRAKES,
      )
    : [],
)

// 制动系统DTC数量
const brakesSystemDtcCount = computed(() =>
  brakesItemList.value.length
    ? brakesItemList.value.reduce(
        (pre, cur) => pre + cur.dtcItemDtcDtos.length,
        0,
      )
    : 0,
)

// 电气分类
const electricalItemList = computed(() =>
  hasFaultCodeList.value
    ? faultCodeList.value.filter(
        (item) => item.type === VehicleEcuCategory.ELECTRICAL,
      )
    : [],
)

// 电气分类DTC数量
const electricalSystemDtcCount = computed(() =>
  electricalItemList.value.length
    ? electricalItemList.value.reduce(
        (pre, cur) => pre + cur.dtcItemDtcDtos.length,
        0,
      )
    : 0,
)

// 底盘分类
const chassisItemList = computed(() =>
  hasFaultCodeList.value
    ? faultCodeList.value.filter(
        (item) => item.type === VehicleEcuCategory.CHASSIS,
      )
    : [],
)

// 底盘分类DTC数量
const chassisSystemDtcCount = computed(() =>
  chassisItemList.value.length
    ? chassisItemList.value.reduce(
        (pre, cur) => pre + cur.dtcItemDtcDtos.length,
        0,
      )
    : 0,
)

// 车身分类
const bodyAndTrimItemList = computed(() =>
  hasFaultCodeList.value
    ? faultCodeList.value.filter(
        (item) => item.type === VehicleEcuCategory.BODY_AND_TRIM,
      )
    : [],
)

// 车身分类DTC数量
const bodyAndTrimSystemDtcCount = computed(() =>
  bodyAndTrimItemList.value.length
    ? bodyAndTrimItemList.value.reduce(
        (pre, cur) => pre + cur.dtcItemDtcDtos.length,
        0,
      )
    : 0,
)

// 其他分类
const otherItemList = computed(() =>
  hasFaultCodeList.value
    ? faultCodeList.value.filter(
        (item) => item.type === VehicleEcuCategory.OTHER,
      )
    : [],
)

// 其他分类DTC数量
const otherSystemDtcCount = computed(() =>
  otherItemList.value.length
    ? otherItemList.value.reduce(
        (pre, cur) => pre + cur.dtcItemDtcDtos.length,
        0,
      )
    : 0,
)

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
    <div class="section-container mx-32 pb-32" v-if="hasFaultCodeList">
      <h3 class="section-header">
        <em
          class="title heading-body-large-body-14px-medium text-neutrals-off-black not-italic"
        >
          Fault Codes
        </em>
      </h3>
      <!-- table -->
      <div class="mt-8">
        <!-- thead -->
        <el-row
          class="bg-neutrals-grey-1 rounded-t-8 text-neutrals-grey-4 poppins-10px-semibold rounded"
          :gutter="16"
        >
          <el-col :span="2"></el-col>
          <el-col :span="6">System</el-col>
          <el-col :span="12">ECU</el-col>
          <el-col :span="4">DTC</el-col>
        </el-row>
        <!-- tbody -->
        <!-- Engine -->
        <template v-if="engineItemList.length > 0">
          <el-row
            class="poppins-10px-regular text-neutrals-off-black"
            :gutter="16"
          >
            <el-col :span="2">
              <el-image :src="EngineIcon" class="h-20 w-20" fit="cover" />
            </el-col>
            <el-col :span="6" class="poppins-10px-regular">
              {{ VehicleEcuCategory.ENGINE }}
            </el-col>
            <el-col :span="12"></el-col>
            <el-col :span="4">
              <i
                :class="[
                  'rounded-99',
                  'px-6',
                  'py-2',
                  'text-neutrals-white',
                  'text-truncate',
                  'block',
                  'w-fit',
                  engineSystemDtcCount
                    ? 'bg-status-colours-red'
                    : 'bg-status-colours-green',
                ]"
              >
                {{
                  engineSystemDtcCount
                    ? `${engineSystemDtcCount} DTC${engineSystemDtcCount > 1 ? 's' : ''}`
                    : 'Normal'
                }}
              </i>
            </el-col>
          </el-row>
          <div v-for="(item, index) in engineItemList" :key="item.id">
            <el-row
              class="poppins-10px-regular text-neutrals-off-black"
              :gutter="16"
            >
              <el-col :span="2"></el-col>
              <el-col :span="6"></el-col>
              <el-col :span="12" class="divider-neutral-grey-4-1px">
                {{ item.name }}
              </el-col>
              <el-col :span="4" class="divider-neutral-grey-4-1px">
                {{
                  item.reportDtcItemDtcDtos &&
                  item.reportDtcItemDtcDtos.length > 0
                    ? `${item.reportDtcItemDtcDtos.length} DTC${item.reportDtcItemDtcDtos.length > 1 ? 's' : ''}`
                    : '-'
                }}
              </el-col>
            </el-row>
            <el-row v-if="index !== engineItemList.length - 1">
              <el-col :span="2"></el-col>
              <el-col :span="6"></el-col>
              <el-col :span="16"><el-divider /></el-col>
            </el-row>

            <!-- DTC 数量 -->
            <template
              v-if="
                item.reportDtcItemDtcDtos &&
                item.reportDtcItemDtcDtos.length > 0
              "
            >
              <el-row
                class="poppins-10px-regular text-neutrals-off-black pb-0!"
                :gutter="16"
              >
                <el-col :span="2"></el-col>
                <el-col :span="6"></el-col>
                <el-col :span="16">
                  <el-row
                    :gutter="24"
                    class="rounded-t-8 bg-neutrals-off-white"
                  >
                    <el-col :span="8">DTC</el-col>
                    <el-col :span="16">Description</el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row
                v-for="(dtcDto, index) in item.reportDtcItemDtcDtos"
                :key="dtcDto.id"
                :class="[
                  'poppins-10px-regular',
                  'text-neutrals-off-black',
                  index === item.reportDtcItemDtcDtos.length - 1
                    ? 'pt-1!'
                    : 'py-1!',
                ]"
                :gutter="16"
              >
                <el-col :span="2"></el-col>
                <el-col :span="6"></el-col>
                <el-col :span="16">
                  <el-row
                    :gutter="24"
                    :class="[
                      'bg-neutrals-off-white',
                      {
                        'rounded-b-8':
                          index === item.reportDtcItemDtcDtos.length - 1,
                      },
                    ]"
                  >
                    <el-col :span="8">
                      {{ dtcDto.faultCode || '-' }}
                    </el-col>
                    <el-col :span="16">
                      {{ dtcDto.name || '-' }}
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </div>
          <el-divider class="border-t-4!" />
        </template>
        <!-- Transmission -->
        <template v-if="transmissionItemList.length > 0">
          <el-row
            class="poppins-10px-regular text-neutrals-off-black"
            :gutter="16"
          >
            <el-col :span="2">
              <el-image :src="TransmissionIcon" class="h-20 w-20" fit="cover" />
            </el-col>
            <el-col :span="6" class="poppins-10px-regular">
              {{ VehicleEcuCategory.TRANSMISSION }}
            </el-col>
            <el-col :span="12"></el-col>
            <el-col :span="4">
              <i
                :class="[
                  'rounded-99',
                  'px-6',
                  'py-2',
                  'text-neutrals-white',
                  'text-truncate',
                  'block',
                  'w-fit',
                  transmissionSystemDtcCount
                    ? 'bg-status-colours-red'
                    : 'bg-status-colours-green',
                ]"
              >
                {{
                  transmissionSystemDtcCount
                    ? `${transmissionSystemDtcCount} DTC${transmissionSystemDtcCount > 1 ? 's' : ''}`
                    : 'Normal'
                }}
              </i>
            </el-col>
          </el-row>
          <div v-for="(item, index) in transmissionItemList" :key="item.id">
            <el-row
              class="poppins-10px-regular text-neutrals-off-black"
              :gutter="16"
            >
              <el-col :span="2"></el-col>
              <el-col :span="6"></el-col>
              <el-col :span="12" class="divider-neutral-grey-4-1px">
                {{ item.name }}
              </el-col>
              <el-col :span="4" class="divider-neutral-grey-4-1px">
                {{
                  item.reportDtcItemDtcDtos &&
                  item.reportDtcItemDtcDtos.length > 0
                    ? `${item.reportDtcItemDtcDtos.length} DTC${item.reportDtcItemDtcDtos.length > 1 ? 's' : ''}`
                    : '-'
                }}
              </el-col>
            </el-row>
            <el-row v-if="index !== transmissionItemList.length - 1">
              <el-col :span="2"></el-col>
              <el-col :span="6"></el-col>
              <el-col :span="16"><el-divider /></el-col>
            </el-row>
            <!-- DTC 数量 -->
            <template
              v-if="
                item.reportDtcItemDtcDtos &&
                item.reportDtcItemDtcDtos.length > 0
              "
            >
              <el-row
                class="poppins-10px-regular text-neutrals-off-black pb-0!"
                :gutter="16"
              >
                <el-col :span="2"></el-col>
                <el-col :span="6"></el-col>
                <el-col :span="16">
                  <el-row
                    :gutter="24"
                    class="rounded-t-8 bg-neutrals-off-white"
                  >
                    <el-col :span="8">DTC</el-col>
                    <el-col :span="16">Description</el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row
                v-for="(dtcDto, index) in item.reportDtcItemDtcDtos"
                :key="dtcDto.id"
                :class="[
                  'poppins-10px-regular',
                  'text-neutrals-off-black',
                  index === item.reportDtcItemDtcDtos.length - 1
                    ? 'pt-1!'
                    : 'py-1!',
                ]"
                :gutter="16"
              >
                <el-col :span="2"></el-col>
                <el-col :span="6"></el-col>
                <el-col :span="16">
                  <el-row
                    :gutter="24"
                    :class="[
                      'bg-neutrals-off-white',
                      {
                        'rounded-b-8':
                          index === item.reportDtcItemDtcDtos.length - 1,
                      },
                    ]"
                  >
                    <el-col :span="8">
                      {{ dtcDto.faultCode || '-' }}
                    </el-col>
                    <el-col :span="16">
                      {{ dtcDto.name || '-' }}
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </div>
          <el-divider class="border-t-4!" />
        </template>
        <!-- Brakes -->
        <template v-if="brakesItemList.length > 0">
          <el-row
            class="poppins-10px-regular text-neutrals-off-black"
            :gutter="16"
          >
            <el-col :span="2">
              <el-image :src="BrakesIcon" class="h-20 w-20" fit="cover" />
            </el-col>
            <el-col :span="6" class="poppins-10px-regular">
              {{ VehicleEcuCategory.BRAKES }}
            </el-col>
            <el-col :span="12"></el-col>
            <el-col :span="4">
              <i
                :class="[
                  'rounded-99',
                  'px-6',
                  'py-2',
                  'text-neutrals-white',
                  'text-truncate',
                  'block',
                  'w-fit',
                  brakesSystemDtcCount
                    ? 'bg-status-colours-red'
                    : 'bg-status-colours-green',
                ]"
              >
                {{
                  brakesSystemDtcCount
                    ? `${brakesSystemDtcCount} DTC${brakesSystemDtcCount > 1 ? 's' : ''}`
                    : 'Normal'
                }}
              </i>
            </el-col>
          </el-row>
          <div v-for="(item, index) in brakesItemList" :key="item.id">
            <el-row
              class="poppins-10px-regular text-neutrals-off-black"
              :gutter="16"
            >
              <el-col :span="2"></el-col>
              <el-col :span="6"></el-col>
              <el-col :span="12" class="divider-neutral-grey-4-1px">
                {{ item.name }}
              </el-col>
              <el-col :span="4" class="divider-neutral-grey-4-1px">
                {{
                  item.reportDtcItemDtcDtos &&
                  item.reportDtcItemDtcDtos.length > 0
                    ? `${item.reportDtcItemDtcDtos.length} DTC${item.reportDtcItemDtcDtos.length > 1 ? 's' : ''}`
                    : '-'
                }}
              </el-col>
            </el-row>
            <el-row v-if="index !== brakesItemList.length - 1">
              <el-col :span="2"></el-col>
              <el-col :span="6"></el-col>
              <el-col :span="16"><el-divider /></el-col>
            </el-row>
            <!-- DTC 数量 -->
            <template
              v-if="
                item.reportDtcItemDtcDtos &&
                item.reportDtcItemDtcDtos.length > 0
              "
            >
              <el-row
                class="poppins-10px-regular text-neutrals-off-black pb-0!"
                :gutter="16"
              >
                <el-col :span="2"></el-col>
                <el-col :span="6"></el-col>
                <el-col :span="16">
                  <el-row
                    :gutter="24"
                    class="rounded-t-8 bg-neutrals-off-white"
                  >
                    <el-col :span="8">DTC</el-col>
                    <el-col :span="16">Description</el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row
                v-for="(dtcDto, index) in item.reportDtcItemDtcDtos"
                :key="dtcDto.id"
                :class="[
                  'poppins-10px-regular',
                  'text-neutrals-off-black',
                  index === item.reportDtcItemDtcDtos.length - 1
                    ? 'pt-1!'
                    : 'py-1!',
                ]"
                :gutter="16"
              >
                <el-col :span="2"></el-col>
                <el-col :span="6"></el-col>
                <el-col :span="16">
                  <el-row
                    :gutter="24"
                    :class="[
                      'bg-neutrals-off-white',
                      {
                        'rounded-b-8':
                          index === item.reportDtcItemDtcDtos.length - 1,
                      },
                    ]"
                  >
                    <el-col :span="8">
                      {{ dtcDto.faultCode || '-' }}
                    </el-col>
                    <el-col :span="16">
                      {{ dtcDto.name || '-' }}
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </div>
          <el-divider class="border-t-4!" />
        </template>
        <!-- Electrical -->
        <template v-if="electricalItemList.length > 0">
          <el-row
            class="poppins-10px-regular text-neutrals-off-black"
            :gutter="16"
          >
            <el-col :span="2">
              <el-image :src="ElectricalIcon" class="h-20 w-20" fit="cover" />
            </el-col>
            <el-col :span="6" class="poppins-10px-regular">
              {{ VehicleEcuCategory.ELECTRICAL }}
            </el-col>
            <el-col :span="12"></el-col>
            <el-col :span="4">
              <i
                :class="[
                  'rounded-99',
                  'px-6',
                  'py-2',
                  'text-neutrals-white',
                  'text-truncate',
                  'block',
                  'w-fit',
                  electricalSystemDtcCount
                    ? 'bg-status-colours-red'
                    : 'bg-status-colours-green',
                ]"
              >
                {{
                  electricalSystemDtcCount
                    ? `${electricalSystemDtcCount} DTC${electricalSystemDtcCount > 1 ? 's' : ''}`
                    : 'Normal'
                }}
              </i>
            </el-col>
          </el-row>
          <div v-for="(item, index) in electricalItemList" :key="item.id">
            <el-row
              class="poppins-10px-regular text-neutrals-off-black"
              :gutter="16"
            >
              <el-col :span="2"></el-col>
              <el-col :span="6"></el-col>
              <el-col :span="12" class="divider-neutral-grey-4-1px">
                {{ item.name }}
              </el-col>
              <el-col :span="4" class="divider-neutral-grey-4-1px">
                {{
                  item.reportDtcItemDtcDtos &&
                  item.reportDtcItemDtcDtos.length > 0
                    ? `${item.reportDtcItemDtcDtos.length} DTC${item.reportDtcItemDtcDtos.length > 1 ? 's' : ''}`
                    : '-'
                }}
              </el-col>
            </el-row>
            <el-row v-if="index !== electricalItemList.length - 1">
              <el-col :span="2"></el-col>
              <el-col :span="6"></el-col>
              <el-col :span="16"><el-divider /></el-col>
            </el-row>
            <!-- DTC 数量 -->
            <template
              v-if="
                item.reportDtcItemDtcDtos &&
                item.reportDtcItemDtcDtos.length > 0
              "
            >
              <el-row
                class="poppins-10px-regular text-neutrals-off-black pb-0!"
                :gutter="16"
              >
                <el-col :span="2"></el-col>
                <el-col :span="6"></el-col>
                <el-col :span="16">
                  <el-row
                    :gutter="24"
                    class="rounded-t-8 bg-neutrals-off-white"
                  >
                    <el-col :span="8">DTC</el-col>
                    <el-col :span="16">Description</el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row
                v-for="(dtcDto, index) in item.reportDtcItemDtcDtos"
                :key="dtcDto.id"
                :class="[
                  'poppins-10px-regular',
                  'text-neutrals-off-black',
                  index === item.reportDtcItemDtcDtos.length - 1
                    ? 'pt-1!'
                    : 'py-1!',
                ]"
                :gutter="16"
              >
                <el-col :span="2"></el-col>
                <el-col :span="6"></el-col>
                <el-col :span="16">
                  <el-row
                    :gutter="24"
                    :class="[
                      'bg-neutrals-off-white',
                      {
                        'rounded-b-8':
                          index === item.reportDtcItemDtcDtos.length - 1,
                      },
                    ]"
                  >
                    <el-col :span="8">
                      {{ dtcDto.faultCode || '-' }}
                    </el-col>
                    <el-col :span="16">
                      {{ dtcDto.name || '-' }}
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </div>
          <el-divider class="border-t-4!" />
        </template>
        <!-- Chassis -->
        <template v-if="chassisItemList.length > 0">
          <el-row
            class="poppins-10px-regular text-neutrals-off-black"
            :gutter="16"
          >
            <el-col :span="2">
              <el-image :src="ChassisIcon" class="h-20 w-20" fit="cover" />
            </el-col>
            <el-col :span="6" class="poppins-10px-regular">
              {{ VehicleEcuCategory.CHASSIS }}
            </el-col>
            <el-col :span="12"></el-col>
            <el-col :span="4">
              <i
                :class="[
                  'rounded-99',
                  'px-6',
                  'py-2',
                  'text-neutrals-white',
                  'text-truncate',
                  'block',
                  'w-fit',
                  chassisSystemDtcCount
                    ? 'bg-status-colours-red'
                    : 'bg-status-colours-green',
                ]"
              >
                {{
                  chassisSystemDtcCount
                    ? `${chassisSystemDtcCount} DTC${chassisSystemDtcCount > 1 ? 's' : ''}`
                    : 'Normal'
                }}
              </i>
            </el-col>
          </el-row>
          <div v-for="(item, index) in chassisItemList" :key="item.id">
            <el-row
              class="poppins-10px-regular text-neutrals-off-black"
              :gutter="16"
            >
              <el-col :span="2"></el-col>
              <el-col :span="6"></el-col>
              <el-col :span="12" class="divider-neutral-grey-4-1px">
                {{ item.name }}
              </el-col>
              <el-col :span="4" class="divider-neutral-grey-4-1px">
                {{
                  item.reportDtcItemDtcDtos &&
                  item.reportDtcItemDtcDtos.length > 0
                    ? `${item.reportDtcItemDtcDtos.length} DTC${item.reportDtcItemDtcDtos.length > 1 ? 's' : ''}`
                    : '-'
                }}
              </el-col>
            </el-row>
            <el-row v-if="index !== chassisItemList.length - 1">
              <el-col :span="2"></el-col>
              <el-col :span="6"></el-col>
              <el-col :span="16"><el-divider /></el-col>
            </el-row>
            <!-- DTC 数量 -->
            <template
              v-if="
                item.reportDtcItemDtcDtos &&
                item.reportDtcItemDtcDtos.length > 0
              "
            >
              <el-row
                class="poppins-10px-regular text-neutrals-off-black pb-0!"
                :gutter="16"
              >
                <el-col :span="2"></el-col>
                <el-col :span="6"></el-col>
                <el-col :span="16">
                  <el-row
                    :gutter="24"
                    class="rounded-t-8 bg-neutrals-off-white"
                  >
                    <el-col :span="8">DTC</el-col>
                    <el-col :span="16">Description</el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row
                v-for="(dtcDto, index) in item.reportDtcItemDtcDtos"
                :key="dtcDto.id"
                :class="[
                  'poppins-10px-regular',
                  'text-neutrals-off-black',
                  index === item.reportDtcItemDtcDtos.length - 1
                    ? 'pt-1!'
                    : 'py-1!',
                ]"
                :gutter="16"
              >
                <el-col :span="2"></el-col>
                <el-col :span="6"></el-col>
                <el-col :span="16">
                  <el-row
                    :gutter="24"
                    :class="[
                      'bg-neutrals-off-white',
                      {
                        'rounded-b-8':
                          index === item.reportDtcItemDtcDtos.length - 1,
                      },
                    ]"
                  >
                    <el-col :span="8">
                      {{ dtcDto.faultCode || '-' }}
                    </el-col>
                    <el-col :span="16">
                      {{ dtcDto.name || '-' }}
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </div>
          <el-divider class="border-t-4!" />
        </template>
        <!-- Body and Trim -->
        <template v-if="bodyAndTrimItemList.length > 0">
          <el-row
            class="poppins-10px-regular text-neutrals-off-black"
            :gutter="16"
          >
            <el-col :span="2">
              <el-image :src="BodyAndTrimIcon" class="h-20 w-20" fit="cover" />
            </el-col>
            <el-col :span="6" class="poppins-10px-regular">
              {{ VehicleEcuCategory.BODY_AND_TRIM }}
            </el-col>
            <el-col :span="12"></el-col>
            <el-col :span="4">
              <i
                :class="[
                  'rounded-99',
                  'px-6',
                  'py-2',
                  'text-neutrals-white',
                  'text-truncate',
                  'block',
                  'w-fit',
                  bodyAndTrimSystemDtcCount
                    ? 'bg-status-colours-red'
                    : 'bg-status-colours-green',
                ]"
              >
                {{
                  bodyAndTrimSystemDtcCount
                    ? `${bodyAndTrimSystemDtcCount} DTC${bodyAndTrimSystemDtcCount > 1 ? 's' : ''}`
                    : 'Normal'
                }}
              </i>
            </el-col>
          </el-row>
          <div v-for="(item, index) in bodyAndTrimItemList" :key="item.id">
            <el-row
              class="poppins-10px-regular text-neutrals-off-black"
              :gutter="16"
            >
              <el-col :span="2"></el-col>
              <el-col :span="6"></el-col>
              <el-col :span="12" class="divider-neutral-grey-4-1px">
                {{ item.name }}
              </el-col>
              <el-col :span="4" class="divider-neutral-grey-4-1px">
                {{
                  item.reportDtcItemDtcDtos &&
                  item.reportDtcItemDtcDtos.length > 0
                    ? `${item.reportDtcItemDtcDtos.length} DTC${item.reportDtcItemDtcDtos.length > 1 ? 's' : ''}`
                    : '-'
                }}
              </el-col>
            </el-row>
            <el-row v-if="index !== bodyAndTrimItemList.length - 1">
              <el-col :span="2"></el-col>
              <el-col :span="6"></el-col>
              <el-col :span="16"><el-divider /></el-col>
            </el-row>
            <!-- DTC 数量 -->
            <template
              v-if="
                item.reportDtcItemDtcDtos &&
                item.reportDtcItemDtcDtos.length > 0
              "
            >
              <el-row
                class="poppins-10px-regular text-neutrals-off-black pb-0!"
                :gutter="16"
              >
                <el-col :span="2"></el-col>
                <el-col :span="6"></el-col>
                <el-col :span="16">
                  <el-row
                    :gutter="24"
                    class="rounded-t-8 bg-neutrals-off-white"
                  >
                    <el-col :span="8">DTC</el-col>
                    <el-col :span="16">Description</el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row
                v-for="(dtcDto, index) in item.reportDtcItemDtcDtos"
                :key="dtcDto.id"
                :class="[
                  'poppins-10px-regular',
                  'text-neutrals-off-black',
                  index === item.reportDtcItemDtcDtos.length - 1
                    ? 'pt-1!'
                    : 'py-1!',
                ]"
                :gutter="16"
              >
                <el-col :span="2"></el-col>
                <el-col :span="6"></el-col>
                <el-col :span="16">
                  <el-row
                    :gutter="24"
                    :class="[
                      'bg-neutrals-off-white',
                      {
                        'rounded-b-8':
                          index === item.reportDtcItemDtcDtos.length - 1,
                      },
                    ]"
                  >
                    <el-col :span="8">
                      {{ dtcDto.faultCode || '-' }}
                    </el-col>
                    <el-col :span="16">
                      {{ dtcDto.name || '-' }}
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </div>
          <el-divider class="border-t-4!" />
        </template>
        <!-- Others -->
        <template v-if="otherItemList.length > 0">
          <el-row
            class="poppins-10px-regular text-neutrals-off-black"
            :gutter="16"
          >
            <el-col :span="2">
              <el-image :src="OthersIcon" class="h-20 w-20" fit="cover" />
            </el-col>
            <el-col :span="6" class="poppins-10px-regular">
              {{ VehicleEcuCategory.OTHERS }}
            </el-col>
            <el-col :span="12"></el-col>
            <el-col :span="4">
              <i
                :class="[
                  'rounded-99',
                  'px-6',
                  'py-2',
                  'text-neutrals-white',
                  'text-truncate',
                  'block',
                  'w-fit',
                  otherSystemDtcCount
                    ? 'bg-status-colours-red'
                    : 'bg-status-colours-green',
                ]"
              >
                {{
                  otherSystemDtcCount
                    ? `${otherSystemDtcCount} DTC${otherSystemDtcCount > 1 ? 's' : ''}`
                    : 'Normal'
                }}
              </i>
            </el-col>
          </el-row>
          <div v-for="(item, index) in otherItemList" :key="item.id">
            <el-row
              class="poppins-10px-regular text-neutrals-off-black"
              :gutter="16"
            >
              <el-col :span="2"></el-col>
              <el-col :span="6"></el-col>
              <el-col :span="12" class="divider-neutral-grey-4-1px">
                {{ item.name }}
              </el-col>
              <el-col :span="4" class="divider-neutral-grey-4-1px">
                {{
                  item.reportDtcItemDtcDtos &&
                  item.reportDtcItemDtcDtos.length > 0
                    ? `${item.reportDtcItemDtcDtos.length} DTC${item.reportDtcItemDtcDtos.length > 1 ? 's' : ''}`
                    : '-'
                }}
              </el-col>
            </el-row>
            <el-row v-if="index !== otherItemList.length - 1">
              <el-col :span="2"></el-col>
              <el-col :span="6"></el-col>
              <el-col :span="16"><el-divider /></el-col>
            </el-row>
            <!-- DTC 数量 -->
            <template
              v-if="
                item.reportDtcItemDtcDtos &&
                item.reportDtcItemDtcDtos.length > 0
              "
            >
              <el-row
                class="poppins-10px-regular text-neutrals-off-black pb-0!"
                :gutter="16"
              >
                <el-col :span="2"></el-col>
                <el-col :span="6"></el-col>
                <el-col :span="16">
                  <el-row
                    :gutter="24"
                    class="rounded-t-8 bg-neutrals-off-white"
                  >
                    <el-col :span="8">DTC</el-col>
                    <el-col :span="16">Description</el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row
                v-for="(dtcDto, index) in item.reportDtcItemDtcDtos"
                :key="dtcDto.id"
                :class="[
                  'poppins-10px-regular',
                  'text-neutrals-off-black',
                  index === item.reportDtcItemDtcDtos.length - 1
                    ? 'pt-1!'
                    : 'py-1!',
                ]"
                :gutter="16"
              >
                <el-col :span="2"></el-col>
                <el-col :span="6"></el-col>
                <el-col :span="16">
                  <el-row
                    :gutter="24"
                    :class="[
                      'bg-neutrals-off-white',
                      {
                        'rounded-b-8':
                          index === item.reportDtcItemDtcDtos.length - 1,
                      },
                    ]"
                  >
                    <el-col :span="8">
                      {{ dtcDto.faultCode || '-' }}
                    </el-col>
                    <el-col :span="16">
                      {{ dtcDto.name || '-' }}
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </div>
          <el-divider class="border-t-4!" />
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.poppins-10px-semibold {
  font-size: 12px;
}

.poppins-10px-regular {
  font-size: 12px;
}

:deep(.el-row) {
  height: 32px;
  align-items: center;
}

i {
  font-size: 14px;
}
</style>
