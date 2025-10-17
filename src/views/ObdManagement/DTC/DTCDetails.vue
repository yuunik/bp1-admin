<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useSessionStorage } from '@vueuse/core'

import { getDateWithDDMMMYYYYhhmma } from '@/utils/dateUtil.js'
import { getVehicleScanRecordDetailApi } from '@/apis/obdApi.js'
import { RouteName, VehicleEcuCategory } from '@/utils/constantsUtil.js'

// 展开图标
import ExpandIcon from '@/assets/specialIcons/arrow-down-s-line.svg'
// 收起图标
import CollapseIcon from '@/assets/specialIcons/arrow-right-s-line.svg'
import { getFullFilePath } from '@/utils/dataFormattedUtil.js'

const route = useRoute()

const router = useRouter()

// 车辆名称
const carName = ref('')

// dtc 详情
const dtcInfo = ref({})

// 故障码列表
const faultCodeList = ref([])

// 获取车辆故障码列表
const getFaultCodeList = async (id) => {
  const { data } = await getVehicleScanRecordDetailApi(id)
  // dtc 详情
  dtcInfo.value = data
  // 故障码列表
  faultCodeList.value =
    dtcInfo.value?.dtcItemDtos && dtcInfo.value?.dtcItemDtos.length
      ? dtcInfo.value.dtcItemDtos.map((item) => ({
          ...item,
          // 可以展开, 即有有 OEM 子项
          hasOEMItem: item.dtcItemDtcDtos && item.dtcItemDtcDtos.length > 0,
          // 若有OEM 子项, 默认不展开
          isExpand: false,
        }))
      : []
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

// 引擎分类展开状态
const engineItemIsExpand = ref(false)

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

// 变速箱分类展开状态
const transmissionItemIsExpand = ref(false)

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

// 制动分类展开状态
const brakesItemIsExpand = ref(false)

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

// 电气分类展开状态
const electricalItemIsExpand = ref(false)

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

// 底盘分类展开状态
const chassisItemIsExpand = ref(false)

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

// 车身分类展开状态
const bodyAndTrimItemIsExpand = ref(false)

// 其他分类
const otherItemList = computed(() =>
  hasFaultCodeList.value
    ? faultCodeList.value.filter(
        (item) => item.type === VehicleEcuCategory.OTHERS,
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

// 其他分类展开状态
const otherItemIsExpand = ref(false)

// 车辆名称
const vehicleName = computed(
  () =>
    `${dtcInfo.value.vehicleDto?.brand} ${dtcInfo.value.vehicleDto?.model}`.trim() ||
    '-',
)

// 错误码详情参数
const faultData = useSessionStorage('faultData', {
  code: '',
  title: '',
  vehicleId: '',
  dtcName: '',
})

// 打开OEM 子项
const handleOpenOEMItem = (oem) => {
  // 没有子项校验
  if (!oem.hasOEMItem) return
  // 除点击项目, 其他项全部收起
  faultCodeList.value.forEach((item) => {
    if (item.id === oem.id) {
      // 当前点击的项：切换展开状态
      item.isExpand = !item.isExpand
    } else {
      // 其他项：全部收起
      item.isExpand && (item.isExpand = false)
    }
  })
}

// 查看DTC详情
const handleViewDtcDetail = (dtc, dtcName) => {
  // 临时存储错误码详情信息
  faultData.value = {
    vehicleId: dtcInfo.value.vehicleId,
    code: dtc.code,
    title: dtc.name,
    dtcName: dtcName,
  }
  // 跳转 dtc 详情页
  router.push({
    name: RouteName.ERROR_CODE_DETAILS,
  })
}

const {
  params: { id },
} = route
if (id) {
  getFaultCodeList(id)
}
</script>

<template>
  <section class="flex flex-col gap-16">
    <!-- header -->
    <h3 class="heading-h2-20px-medium text-neutrals-off-black px-32">
      {{ vehicleName }}
    </h3>
    <!-- divider -->
    <el-divider />
    <!-- vehicle info -->
    <div class="mx-32 mt-6 flex max-w-full justify-between gap-24">
      <div class="flex-1">
        <div class="flex flex-col gap-4">
          <dl class="flex items-center gap-8">
            <dt class="w-112 leading-32 h-32">User</dt>
            <dd class="flex-1">
              {{ dtcInfo.userDto?.name || '-' }}
            </dd>
          </dl>
          <dl class="flex items-center gap-8">
            <dt class="w-112 leading-32 h-32">Serial Number</dt>
            <dd class="flex-1">{{ dtcInfo.userDto?.name || '-' }}</dd>
          </dl>
          <dl class="flex items-center gap-8">
            <dt class="w-112 leading-32 h-32">VIN</dt>
            <dd class="flex-1">{{ dtcInfo.obdDto?.sn || '-' }}</dd>
          </dl>
        </div>
      </div>
      <div class="flex-1">
        <div class="flex flex-col gap-4">
          <dl class="flex items-center gap-8">
            <dt class="w-112 leading-32 h-32">Brand</dt>
            <dd class="flex-1">
              <el-avatar
                :src="getFullFilePath(dtcInfo.vehicleDto?.cover)"
                fit="cover"
                :size="20"
                @error="() => true"
              >
                B
              </el-avatar>
              <span class="text-neutrals-off-black ml-8">
                {{ dtcInfo.vehicleDto?.brand || '-' }}
              </span>
            </dd>
          </dl>
          <dl class="flex items-center gap-8">
            <dt class="w-112 leading-32 h-32">Model</dt>
            <dd class="flex-1">
              {{ dtcInfo.vehicleDto?.model || '-' }}
            </dd>
          </dl>
          <dl class="flex items-center gap-8">
            <dt class="w-112 leading-32 h-32">Year</dt>
            <dd class="flex-1">
              {{ dtcInfo.vehicleDto?.year || '-' }}
            </dd>
          </dl>
        </div>
      </div>
    </div>
    <!-- Fault Codes -->
    <div class="section-container pb-32" v-if="hasFaultCodeList">
      <h3 class="section-header mx-32">
        <em
          class="title heading-body-large-body-14px-medium text-neutrals-off-black not-italic"
        >
          Fault Codes
        </em>
      </h3>
      <!-- divider -->
      <el-divider class="mt-8!" />
      <!-- table -->
      <div class="fault-codes-container">
        <!-- fault codes table thead -->
        <el-row class="text-neutrals-grey-3" :gutter="16">
          <el-col :span="1"></el-col>
          <el-col :span="14">System</el-col>
          <el-col :span="9">ECU</el-col>
        </el-row>
        <el-divider />
        <!-- fault codes table tbody -->
        <!-- Engine -->
        <template v-if="engineItemList.length > 0">
          <!-- Engine table -->
          <el-row
            :gutter="16"
            :class="[
              'hover:bg-status-colours-light-blue-hover!',
              'text-neutrals-grey-4',
              'cursor-pointer',
              engineItemIsExpand
                ? 'bg-status-colours-light-blue-hover! divider-bottom-grey-4-1px! text-neutrals-off-black'
                : '',
            ]"
            @click.stop="engineItemIsExpand = !engineItemIsExpand"
          >
            <el-col :span="1" class="is-center">
              <el-image
                :src="engineItemIsExpand ? ExpandIcon : CollapseIcon"
                class="h-16 w-16 cursor-pointer"
                fit="cover"
                @click.stop="engineItemIsExpand = !engineItemIsExpand"
              />
            </el-col>
            <el-col :span="14">
              {{ VehicleEcuCategory.ENGINE }}
            </el-col>
            <el-col :span="9">
              <i
                :class="[
                  'rounded-99',
                  'px-6',
                  'py-4',
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
          <el-divider
            :class="{ 'divider-neutral-off-white-1px!': engineItemIsExpand }"
          />
          <!-- OEM table -->
          <template v-if="engineItemIsExpand">
            <el-row
              :span="16"
              class="text-neutrals-off-black bg-neutrals-off-white pt-16!"
            >
              <el-col :span="1"></el-col>
              <el-col :span="23">
                <el-row
                  :span="16"
                  class="w-full! text-neutrals-grey-4 bg-neutrals-off-white'"
                >
                  <el-col :span="1"></el-col>
                  <el-col :span="14" class="pl-8!">OEM Name</el-col>
                  <el-col :span="9" class="pl-8!">Fault Codes</el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row
              :span="16"
              class="no-height text-neutrals-off-black bg-neutrals-off-white"
            >
              <el-col :span="1"></el-col>
              <el-col :span="23">
                <el-divider class="divider-neutral-off-white-1px!" />
              </el-col>
            </el-row>
            <div
              v-for="(item, index) in engineItemList"
              :key="item.id"
              :class="{
                'bg-neutrals-off-white': engineItemIsExpand,
                'pb-16': index === engineItemList.length - 1,
              }"
            >
              <!-- DTC Code Table -->
              <el-row
                :span="16"
                :class="[
                  'h-40',
                  'text-neutrals-off-black',
                  {
                    'bg-neutrals-off-white': engineItemIsExpand,
                    'pr-16': item.hasOEMItem && item.isExpand,
                  },
                ]"
              >
                <el-col :span="1"></el-col>
                <el-col
                  :span="23"
                  :class="{
                    'bg-neutrals/off-white': item.hasOEMItem && item.isExpand,
                  }"
                >
                  <el-row
                    class="w-full! text-neutrals-off-black white-border"
                    :gutter="16"
                    :class="{
                      'cursor-pointer': item.hasOEMItem,
                      'gray-border': item.hasOEMItem && item.isExpand,
                      'hover:bg-neutrals/off-white': item.hasOEMItem,
                    }"
                    @click.stop="handleOpenOEMItem(item)"
                  >
                    <el-col
                      :span="1"
                      class="is-center"
                      @click.stop="handleOpenOEMItem(item)"
                    >
                      <el-image
                        v-if="item.hasOEMItem"
                        :src="item.isExpand ? ExpandIcon : CollapseIcon"
                        class="h-16 w-16 cursor-pointer"
                        fit="cover"
                      />
                    </el-col>
                    <el-col :span="14">
                      <el-tooltip :content="item.name">
                        <span class="text-truncate">
                          {{ item.name || '-' }}
                        </span>
                      </el-tooltip>
                    </el-col>
                    <el-col :span="9">
                      {{
                        item.dtcItemDtcDtos && item.dtcItemDtcDtos.length > 0
                          ? `${item.dtcItemDtcDtos.length} DTC${item.dtcItemDtcDtos.length > 1 ? 's' : ''}`
                          : '-'
                      }}
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <!-- Code table -->
              <div v-if="item.hasOEMItem && item.isExpand" class="pb-16 pr-16">
                <el-row :span="16">
                  <el-col :span="1"></el-col>
                  <el-col :span="23" class="bg-neutrals/off-white">
                    <el-row :span="16" class="w-full!">
                      <el-col :span="1"></el-col>
                      <el-col :span="23">
                        <!-- 层级二 ==>  dtcItemDtcDtos  table header  -->
                        <el-row :gutter="16" class="w-full! gray-border">
                          <el-col :span="5" class="extra">Code</el-col>
                          <el-col :span="15">Description</el-col>
                          <el-col :span="4"></el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <!-- 层级二 ==> dtcItemDtcDtos  table body -->
                <el-row
                  :span="16"
                  v-if="item.hasOEMItem && item.isExpand"
                  v-for="(dtcDto, index) in item.dtcItemDtcDtos"
                  :key="dtcDto.id"
                  class="h-40"
                >
                  <el-col :span="1"></el-col>
                  <el-col
                    :span="23"
                    class="bg-neutrals/off-white"
                    :class="
                      index === item.dtcItemDtcDtos.length - 1
                        ? 'flex flex-wrap'
                        : ''
                    "
                  >
                    <el-row :span="16" class="w-full!">
                      <el-col :span="1"></el-col>
                      <el-col :span="23">
                        <el-row :gutter="16" class="w-full! gray-border">
                          <el-col :span="5" class="extra">
                            <el-tooltip :content="dtcDto.name">
                              <span class="text-truncate">
                                {{ dtcDto.name || '-' }}
                              </span>
                            </el-tooltip>
                          </el-col>
                          <el-col :span="15">
                            {{
                              dtcDto.dtcItemDtcDataDtos &&
                              dtcDto.dtcItemDtcDataDtos.length > 0
                                ? `${dtcDto.dtcItemDtcDataDtos.length} DTC${dtcDto.dtcItemDtcDataDtos.length > 1 ? 's' : ''}`
                                : '-'
                            }}
                          </el-col>
                          <el-col :span="4">
                            <el-button
                              class="rounded-full! h-24!"
                              @click.stop="
                                handleViewDtcDetail(dtcDto, item.name)
                              "
                            >
                              View Details
                            </el-button>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                    <!-- 多余的空白 -->
                    <div
                      class="bg-neutrals/off-white h-16 w-full"
                      v-if="index === item.dtcItemDtcDtos.length - 1"
                    ></div>
                  </el-col>
                </el-row>
              </div>
            </div>
            <el-divider class="border-t-1!" />
          </template>
        </template>
        <!-- Transmission -->
        <template v-if="transmissionItemList.length > 0">
          <!-- table -->
          <el-row
            :gutter="16"
            :class="[
              'hover:bg-status-colours-light-blue-hover!',
              'text-neutrals-grey-4',
              'cursor-pointer',
              transmissionItemIsExpand
                ? 'bg-status-colours-light-blue-hover! divider-bottom-grey-4-1px! text-neutrals-off-black'
                : '',
            ]"
            @click.stop="transmissionItemIsExpand = !transmissionItemIsExpand"
          >
            <el-col :span="1" class="is-center">
              <el-image
                :src="transmissionItemIsExpand ? ExpandIcon : CollapseIcon"
                class="h-16 w-16 cursor-pointer"
                fit="cover"
                @click.stop="
                  transmissionItemIsExpand = !transmissionItemIsExpand
                "
              />
            </el-col>
            <el-col :span="14">
              {{ VehicleEcuCategory.TRANSMISSION }}
            </el-col>
            <el-col :span="9">
              <i
                :class="[
                  'rounded-99',
                  'px-6',
                  'py-4',
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
          <el-divider
            :class="{
              'divider-neutral-off-white-1px!': transmissionItemIsExpand,
            }"
          />
          <!-- OEM table -->
          <template v-if="transmissionItemIsExpand">
            <el-row
              :span="16"
              class="text-neutrals-off-black bg-neutrals-off-white pt-16!"
            >
              <el-col :span="1"></el-col>
              <el-col :span="23">
                <el-row
                  :span="16"
                  class="w-full! text-neutrals-grey-4 bg-neutrals-off-white'"
                >
                  <el-col :span="1"></el-col>
                  <el-col :span="14" class="pl-8!">OEM Name</el-col>
                  <el-col :span="9" class="pl-8!">Fault Codes</el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row
              :span="16"
              class="no-height text-neutrals-off-black bg-neutrals-off-white"
            >
              <el-col :span="1"></el-col>
              <el-col :span="23">
                <el-divider class="divider-neutral-off-white-1px!" />
              </el-col>
            </el-row>
            <div
              v-for="(item, index) in transmissionItemList"
              :key="item.id"
              :class="{
                'bg-neutrals-off-white': transmissionItemIsExpand,
                'pb-16': index === transmissionItemList.length - 1,
              }"
            >
              <!-- DTC Code Table -->
              <el-row
                :span="16"
                :class="[
                  'h-40',
                  'text-neutrals-off-black',
                  {
                    'bg-neutrals-off-white': transmissionItemIsExpand,
                    'pr-16': item.hasOEMItem && item.isExpand,
                  },
                ]"
              >
                <el-col :span="1"></el-col>
                <el-col
                  :span="23"
                  :class="{
                    'bg-neutrals/off-white': item.hasOEMItem && item.isExpand,
                  }"
                >
                  <el-row
                    class="w-full! text-neutrals-off-black white-border"
                    :gutter="16"
                    :class="{
                      'cursor-pointer': item.hasOEMItem,
                      'gray-border': item.hasOEMItem && item.isExpand,
                      'hover:bg-neutrals/off-white': item.hasOEMItem,
                    }"
                    @click.stop="handleOpenOEMItem(item)"
                  >
                    <el-col
                      :span="1"
                      class="is-center"
                      @click.stop="handleOpenOEMItem(item)"
                    >
                      <el-image
                        v-if="item.hasOEMItem"
                        :src="item.isExpand ? ExpandIcon : CollapseIcon"
                        class="h-16 w-16 cursor-pointer"
                        fit="cover"
                      />
                    </el-col>
                    <el-col :span="14">
                      <el-tooltip :content="item.name">
                        <span class="text-truncate">
                          {{ item.name || '-' }}
                        </span>
                      </el-tooltip>
                    </el-col>
                    <el-col :span="9">
                      {{
                        item.dtcItemDtcDtos && item.dtcItemDtcDtos.length > 0
                          ? `${item.dtcItemDtcDtos.length} DTC${item.dtcItemDtcDtos.length > 1 ? 's' : ''}`
                          : '-'
                      }}
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <!-- Code table -->
              <div v-if="item.hasOEMItem && item.isExpand" class="pb-16 pr-16">
                <el-row :span="16">
                  <el-col :span="1"></el-col>
                  <el-col :span="23" class="bg-neutrals/off-white">
                    <el-row :span="16" class="w-full!">
                      <el-col :span="1"></el-col>
                      <el-col :span="23">
                        <!-- 层级二 ==>  dtcItemDtcDtos  table header  -->
                        <el-row :gutter="16" class="w-full! gray-border">
                          <el-col :span="5" class="extra">Code</el-col>
                          <el-col :span="15">Description</el-col>
                          <el-col :span="4"></el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <!-- 层级二 ==> dtcItemDtcDtos  table body -->
                <el-row
                  :span="16"
                  v-if="item.hasOEMItem && item.isExpand"
                  v-for="(dtcDto, index) in item.dtcItemDtcDtos"
                  :key="dtcDto.id"
                  class="h-40"
                >
                  <el-col :span="1"></el-col>
                  <el-col
                    :span="23"
                    class="bg-neutrals/off-white"
                    :class="
                      index === item.dtcItemDtcDtos.length - 1
                        ? 'flex flex-wrap'
                        : ''
                    "
                  >
                    <el-row :span="16" class="w-full!">
                      <el-col :span="1"></el-col>
                      <el-col :span="23">
                        <el-row :gutter="16" class="w-full! gray-border">
                          <el-col :span="5" class="extra">
                            <el-tooltip :content="dtcDto.name">
                              <span class="text-truncate">
                                {{ dtcDto.name || '-' }}
                              </span>
                            </el-tooltip>
                            <!--<span class="text-truncate">-->
                            <!--  {{ dtcDto.name || '-' }}-->
                            <!--</span>-->
                          </el-col>
                          <el-col :span="15">
                            {{
                              dtcDto.dtcItemDtcDataDtos &&
                              dtcDto.dtcItemDtcDataDtos.length > 0
                                ? `${dtcDto.dtcItemDtcDataDtos.length} DTC${dtcDto.dtcItemDtcDataDtos.length > 1 ? 's' : ''}`
                                : '-'
                            }}
                          </el-col>
                          <el-col :span="4">
                            <el-button
                              class="rounded-full! h-24!"
                              @click.stop="
                                handleViewDtcDetail(dtcDto, item.name)
                              "
                            >
                              View Details
                            </el-button>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                    <!-- 多余的空白 -->
                    <div
                      class="bg-neutrals/off-white h-16 w-full"
                      v-if="index === item.dtcItemDtcDtos.length - 1"
                    ></div>
                  </el-col>
                </el-row>
              </div>
            </div>
            <el-divider class="border-t-1!" />
          </template>
        </template>
        <!-- Brakes -->
        <template v-if="brakesItemList.length > 0">
          <!-- table -->
          <el-row
            :gutter="16"
            :class="[
              'hover:bg-status-colours-light-blue-hover!',
              'text-neutrals-grey-4',
              'cursor-pointer',
              brakesItemIsExpand
                ? 'bg-status-colours-light-blue-hover! divider-bottom-grey-4-1px! text-neutrals-off-black'
                : '',
            ]"
            @click.stop="brakesItemIsExpand = !brakesItemIsExpand"
          >
            <el-col :span="1" class="is-center">
              <el-image
                :src="brakesItemIsExpand ? ExpandIcon : CollapseIcon"
                class="h-16 w-16 cursor-pointer"
                fit="cover"
                @click.stop="brakesItemIsExpand = !brakesItemIsExpand"
              />
            </el-col>
            <el-col :span="14">
              {{ VehicleEcuCategory.BRAKES }}
            </el-col>
            <el-col :span="9">
              <i
                :class="[
                  'rounded-99',
                  'px-6',
                  'py-4',
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
          <el-divider
            :class="{
              'divider-neutral-off-white-1px!': brakesItemIsExpand,
            }"
          />
          <!-- OEM table -->
          <template v-if="brakesItemIsExpand">
            <el-row
              :span="16"
              class="text-neutrals-off-black bg-neutrals-off-white pt-16!"
            >
              <el-col :span="1"></el-col>
              <el-col :span="23">
                <el-row
                  :span="16"
                  class="w-full! text-neutrals-grey-4 bg-neutrals-off-white'"
                >
                  <el-col :span="1"></el-col>
                  <el-col :span="14" class="pl-8!">OEM Name</el-col>
                  <el-col :span="9" class="pl-8!">Fault Codes</el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row
              :span="16"
              class="no-height text-neutrals-off-black bg-neutrals-off-white"
            >
              <el-col :span="1"></el-col>
              <el-col :span="23">
                <el-divider class="divider-neutral-off-white-1px!" />
              </el-col>
            </el-row>
            <div
              v-for="(item, index) in brakesItemList"
              :key="item.id"
              :class="{
                'bg-neutrals-off-white': brakesItemIsExpand,
                'pb-16': index === brakesItemList.length - 1,
              }"
            >
              <!-- DTC Code Table -->
              <el-row
                :span="16"
                :class="[
                  'h-40',
                  'text-neutrals-off-black',
                  {
                    'bg-neutrals-off-white': brakesItemIsExpand,
                    'pr-16': item.hasOEMItem && item.isExpand,
                  },
                ]"
              >
                <el-col :span="1"></el-col>
                <el-col
                  :span="23"
                  :class="{
                    'bg-neutrals/off-white': item.hasOEMItem && item.isExpand,
                  }"
                >
                  <el-row
                    class="w-full! text-neutrals-off-black white-border"
                    :gutter="16"
                    :class="{
                      'cursor-pointer': item.hasOEMItem,
                      'gray-border': item.hasOEMItem && item.isExpand,
                      'hover:bg-neutrals/off-white': item.hasOEMItem,
                    }"
                    @click.stop="handleOpenOEMItem(item)"
                  >
                    <el-col
                      :span="1"
                      class="is-center"
                      @click.stop="handleOpenOEMItem(item)"
                    >
                      <el-image
                        v-if="item.hasOEMItem"
                        :src="item.isExpand ? ExpandIcon : CollapseIcon"
                        class="h-16 w-16 cursor-pointer"
                        fit="cover"
                      />
                    </el-col>
                    <el-col :span="14">
                      <el-tooltip :content="item.name">
                        <span class="text-truncate">
                          {{ item.name || '-' }}
                        </span>
                      </el-tooltip>
                    </el-col>
                    <el-col :span="9">
                      {{
                        item.dtcItemDtcDtos && item.dtcItemDtcDtos.length > 0
                          ? `${item.dtcItemDtcDtos.length} DTC${item.dtcItemDtcDtos.length > 1 ? 's' : ''}`
                          : '-'
                      }}
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <!-- Code table -->
              <div v-if="item.hasOEMItem && item.isExpand" class="pb-16 pr-16">
                <el-row :span="16">
                  <el-col :span="1"></el-col>
                  <el-col :span="23" class="bg-neutrals/off-white">
                    <el-row :span="16" class="w-full!">
                      <el-col :span="1"></el-col>
                      <el-col :span="23">
                        <!-- 层级二 ==>  dtcItemDtcDtos  table header  -->
                        <el-row :gutter="16" class="w-full! gray-border">
                          <el-col :span="5" class="extra">Code</el-col>
                          <el-col :span="15">Description</el-col>
                          <el-col :span="4"></el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <!-- 层级二 ==> dtcItemDtcDtos  table body -->
                <el-row
                  :span="16"
                  v-if="item.hasOEMItem && item.isExpand"
                  v-for="(dtcDto, index) in item.dtcItemDtcDtos"
                  :key="dtcDto.id"
                  class="h-40"
                >
                  <el-col :span="1"></el-col>
                  <el-col
                    :span="23"
                    class="bg-neutrals/off-white"
                    :class="
                      index === item.dtcItemDtcDtos.length - 1
                        ? 'flex flex-wrap'
                        : ''
                    "
                  >
                    <el-row :span="16" class="w-full!">
                      <el-col :span="1"></el-col>
                      <el-col :span="23">
                        <el-row :gutter="16" class="w-full! gray-border">
                          <el-col :span="5" class="extra">
                            <el-tooltip :content="dtcDto.name">
                              <span class="text-truncate">
                                {{ dtcDto.name || '-' }}
                              </span>
                            </el-tooltip>
                            <!--<span class="text-truncate">-->
                            <!--  {{ dtcDto.name || '-' }}-->
                            <!--</span>-->
                          </el-col>
                          <el-col :span="15">
                            {{
                              dtcDto.dtcItemDtcDataDtos &&
                              dtcDto.dtcItemDtcDataDtos.length > 0
                                ? `${dtcDto.dtcItemDtcDataDtos.length} DTC${dtcDto.dtcItemDtcDataDtos.length > 1 ? 's' : ''}`
                                : '-'
                            }}
                          </el-col>
                          <el-col :span="4">
                            <el-button
                              class="rounded-full! h-24!"
                              @click.stop="
                                handleViewDtcDetail(dtcDto, item.name)
                              "
                            >
                              View Details
                            </el-button>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                    <!-- 多余的空白 -->
                    <div
                      class="bg-neutrals/off-white h-16 w-full"
                      v-if="index === item.dtcItemDtcDtos.length - 1"
                    ></div>
                  </el-col>
                </el-row>
              </div>
            </div>
            <el-divider class="border-t-1!" />
          </template>
        </template>
        <!-- Electrical -->
        <template v-if="electricalItemList.length > 0">
          <!-- table -->
          <el-row
            :gutter="16"
            :class="[
              'hover:bg-status-colours-light-blue-hover!',
              'text-neutrals-grey-4',
              'cursor-pointer',
              electricalItemIsExpand
                ? 'bg-status-colours-light-blue-hover! divider-bottom-grey-4-1px! text-neutrals-off-black'
                : '',
            ]"
            @click.stop="electricalItemIsExpand = !electricalItemIsExpand"
          >
            <el-col :span="1" class="is-center">
              <el-image
                :src="electricalItemIsExpand ? ExpandIcon : CollapseIcon"
                class="h-16 w-16 cursor-pointer"
                fit="cover"
                @click.stop="electricalItemIsExpand = !electricalItemIsExpand"
              />
            </el-col>
            <el-col :span="14">
              {{ VehicleEcuCategory.ELECTRICAL }}
            </el-col>
            <el-col :span="9">
              <i
                :class="[
                  'rounded-99',
                  'px-6',
                  'py-4',
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
          <el-divider
            :class="{
              'divider-neutral-off-white-1px!': electricalItemIsExpand,
            }"
          />
          <!-- OEM table -->
          <template v-if="electricalItemIsExpand">
            <el-row
              :span="16"
              class="text-neutrals-off-black bg-neutrals-off-white pt-16!"
            >
              <el-col :span="1"></el-col>
              <el-col :span="23">
                <el-row
                  :span="16"
                  class="w-full! text-neutrals-grey-4 bg-neutrals-off-white'"
                >
                  <el-col :span="1"></el-col>
                  <el-col :span="14" class="pl-8!">OEM Name</el-col>
                  <el-col :span="9" class="pl-8!">Fault Codes</el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row
              :span="16"
              class="no-height text-neutrals-off-black bg-neutrals-off-white"
            >
              <el-col :span="1"></el-col>
              <el-col :span="23">
                <el-divider class="divider-neutral-off-white-1px!" />
              </el-col>
            </el-row>
            <div
              v-for="(item, index) in electricalItemList"
              :key="item.id"
              :class="{
                'bg-neutrals-off-white': electricalItemIsExpand,
                'pb-16': index === electricalItemList.length - 1,
              }"
            >
              <!-- DTC Code Table -->
              <el-row
                :span="16"
                :class="[
                  'h-40',
                  'text-neutrals-off-black',
                  {
                    'bg-neutrals-off-white': electricalItemIsExpand,
                    'pr-16': item.hasOEMItem && item.isExpand,
                  },
                ]"
              >
                <el-col :span="1"></el-col>
                <el-col
                  :span="23"
                  :class="{
                    'bg-neutrals/off-white': item.hasOEMItem && item.isExpand,
                  }"
                >
                  <el-row
                    class="w-full! text-neutrals-off-black white-border"
                    :gutter="16"
                    :class="{
                      'cursor-pointer': item.hasOEMItem,
                      'gray-border': item.hasOEMItem && item.isExpand,
                      'hover:bg-neutrals/off-white': item.hasOEMItem,
                    }"
                    @click.stop="handleOpenOEMItem(item)"
                  >
                    <el-col
                      :span="1"
                      class="is-center"
                      @click.stop="handleOpenOEMItem(item)"
                    >
                      <el-image
                        v-if="item.hasOEMItem"
                        :src="item.isExpand ? ExpandIcon : CollapseIcon"
                        class="h-16 w-16 cursor-pointer"
                        fit="cover"
                      />
                    </el-col>
                    <el-col :span="14">
                      <el-tooltip :content="item.name">
                        <span class="text-truncate">
                          {{ item.name || '-' }}
                        </span>
                      </el-tooltip>
                    </el-col>
                    <el-col :span="9">
                      {{
                        item.dtcItemDtcDtos && item.dtcItemDtcDtos.length > 0
                          ? `${item.dtcItemDtcDtos.length} DTC${item.dtcItemDtcDtos.length > 1 ? 's' : ''}`
                          : '-'
                      }}
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <!-- Code table -->
              <div v-if="item.hasOEMItem && item.isExpand" class="pb-16 pr-16">
                <el-row :span="16">
                  <el-col :span="1"></el-col>
                  <el-col :span="23" class="bg-neutrals/off-white">
                    <el-row :span="16" class="w-full!">
                      <el-col :span="1"></el-col>
                      <el-col :span="23">
                        <!-- 层级二 ==>  dtcItemDtcDtos  table header  -->
                        <el-row :gutter="16" class="w-full! gray-border">
                          <el-col :span="5" class="extra">Code</el-col>
                          <el-col :span="15">Description</el-col>
                          <el-col :span="4"></el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <!-- 层级二 ==> dtcItemDtcDtos  table body -->
                <el-row
                  :span="16"
                  v-if="item.hasOEMItem && item.isExpand"
                  v-for="(dtcDto, index) in item.dtcItemDtcDtos"
                  :key="dtcDto.id"
                  class="h-40"
                >
                  <el-col :span="1"></el-col>
                  <el-col
                    :span="23"
                    class="bg-neutrals/off-white"
                    :class="
                      index === item.dtcItemDtcDtos.length - 1
                        ? 'flex flex-wrap'
                        : ''
                    "
                  >
                    <el-row :span="16" class="w-full!">
                      <el-col :span="1"></el-col>
                      <el-col :span="23">
                        <el-row :gutter="16" class="w-full! gray-border">
                          <el-col :span="5" class="extra">
                            <el-tooltip :content="dtcDto.name">
                              <span class="text-truncate">
                                {{ dtcDto.name || '-' }}
                              </span>
                            </el-tooltip>
                            <!--<span class="text-truncate">-->
                            <!--  {{ dtcDto.name || '-' }}-->
                            <!--</span>-->
                          </el-col>
                          <el-col :span="15">
                            {{
                              dtcDto.dtcItemDtcDataDtos &&
                              dtcDto.dtcItemDtcDataDtos.length > 0
                                ? `${dtcDto.dtcItemDtcDataDtos.length} DTC${dtcDto.dtcItemDtcDataDtos.length > 1 ? 's' : ''}`
                                : '-'
                            }}
                          </el-col>
                          <el-col :span="4">
                            <el-button
                              class="rounded-full! h-24!"
                              @click.stop="
                                handleViewDtcDetail(dtcDto, item.name)
                              "
                            >
                              View Details
                            </el-button>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                    <!-- 多余的空白 -->
                    <div
                      class="bg-neutrals/off-white h-16 w-full"
                      v-if="index === item.dtcItemDtcDtos.length - 1"
                    ></div>
                  </el-col>
                </el-row>
              </div>
            </div>
            <el-divider class="border-t-1!" />
          </template>
        </template>
        <!-- Chassis -->
        <template v-if="chassisItemList.length > 0">
          <!-- table -->
          <el-row
            :gutter="16"
            :class="[
              'hover:bg-status-colours-light-blue-hover!',
              'text-neutrals-grey-4',
              'cursor-pointer',
              chassisItemIsExpand
                ? 'bg-status-colours-light-blue-hover! divider-bottom-grey-4-1px! text-neutrals-off-black'
                : '',
            ]"
            @click.stop="chassisItemIsExpand = !chassisItemIsExpand"
          >
            <el-col :span="1" class="is-center">
              <el-image
                :src="chassisItemIsExpand ? ExpandIcon : CollapseIcon"
                class="h-16 w-16 cursor-pointer"
                fit="cover"
                @click.stop="chassisItemIsExpand = !chassisItemIsExpand"
              />
            </el-col>
            <el-col :span="14">
              {{ VehicleEcuCategory.CHASSIS }}
            </el-col>
            <el-col :span="9">
              <i
                :class="[
                  'rounded-99',
                  'px-6',
                  'py-4',
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
          <el-divider
            :class="{
              'divider-neutral-off-white-1px!': chassisItemIsExpand,
            }"
          />
          <!-- OEM table -->
          <template v-if="chassisItemIsExpand">
            <el-row
              :span="16"
              class="text-neutrals-off-black bg-neutrals-off-white pt-16!"
            >
              <el-col :span="1"></el-col>
              <el-col :span="23">
                <el-row
                  :span="16"
                  class="w-full! text-neutrals-grey-4 bg-neutrals-off-white'"
                >
                  <el-col :span="1"></el-col>
                  <el-col :span="14" class="pl-8!">OEM Name</el-col>
                  <el-col :span="9" class="pl-8!">Fault Codes</el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row
              :span="16"
              class="no-height text-neutrals-off-black bg-neutrals-off-white"
            >
              <el-col :span="1"></el-col>
              <el-col :span="23">
                <el-divider class="divider-neutral-off-white-1px!" />
              </el-col>
            </el-row>
            <div
              v-for="(item, index) in chassisItemList"
              :key="item.id"
              :class="{
                'bg-neutrals-off-white': chassisItemIsExpand,
                'pb-16': index === chassisItemList.length - 1,
              }"
            >
              <!-- DTC Code Table -->
              <el-row
                :span="16"
                :class="[
                  'h-40',
                  'text-neutrals-off-black',
                  {
                    'bg-neutrals-off-white': chassisItemIsExpand,
                    'pr-16': item.hasOEMItem && item.isExpand,
                  },
                ]"
              >
                <el-col :span="1"></el-col>
                <el-col
                  :span="23"
                  :class="{
                    'bg-neutrals/off-white': item.hasOEMItem && item.isExpand,
                  }"
                >
                  <el-row
                    class="w-full! text-neutrals-off-black white-border"
                    :gutter="16"
                    :class="{
                      'cursor-pointer': item.hasOEMItem,
                      'gray-border': item.hasOEMItem && item.isExpand,
                      'hover:bg-neutrals/off-white': item.hasOEMItem,
                    }"
                    @click.stop="handleOpenOEMItem(item)"
                  >
                    <el-col
                      :span="1"
                      class="is-center"
                      @click.stop="handleOpenOEMItem(item)"
                    >
                      <el-image
                        v-if="item.hasOEMItem"
                        :src="item.isExpand ? ExpandIcon : CollapseIcon"
                        class="h-16 w-16 cursor-pointer"
                        fit="cover"
                      />
                    </el-col>
                    <el-col :span="14">
                      <el-tooltip :content="item.name">
                        <span class="text-truncate">
                          {{ item.name || '-' }}
                        </span>
                      </el-tooltip>
                    </el-col>
                    <el-col :span="9">
                      {{
                        item.dtcItemDtcDtos && item.dtcItemDtcDtos.length > 0
                          ? `${item.dtcItemDtcDtos.length} DTC${item.dtcItemDtcDtos.length > 1 ? 's' : ''}`
                          : '-'
                      }}
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <!-- Code table -->
              <div v-if="item.hasOEMItem && item.isExpand" class="pb-16 pr-16">
                <el-row :span="16">
                  <el-col :span="1"></el-col>
                  <el-col :span="23" class="bg-neutrals/off-white">
                    <el-row :span="16" class="w-full!">
                      <el-col :span="1"></el-col>
                      <el-col :span="23">
                        <!-- 层级二 ==>  dtcItemDtcDtos  table header  -->
                        <el-row :gutter="16" class="w-full! gray-border">
                          <el-col :span="5" class="extra">Code</el-col>
                          <el-col :span="15">Description</el-col>
                          <el-col :span="4"></el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <!-- 层级二 ==> dtcItemDtcDtos  table body -->
                <el-row
                  :span="16"
                  v-if="item.hasOEMItem && item.isExpand"
                  v-for="(dtcDto, index) in item.dtcItemDtcDtos"
                  :key="dtcDto.id"
                  class="h-40"
                >
                  <el-col :span="1"></el-col>
                  <el-col
                    :span="23"
                    class="bg-neutrals/off-white"
                    :class="
                      index === item.dtcItemDtcDtos.length - 1
                        ? 'flex flex-wrap'
                        : ''
                    "
                  >
                    <el-row :span="16" class="w-full!">
                      <el-col :span="1"></el-col>
                      <el-col :span="23">
                        <el-row :gutter="16" class="w-full! gray-border">
                          <el-col :span="5" class="extra">
                            <el-tooltip :content="dtcDto.name">
                              <span class="text-truncate">
                                {{ dtcDto.name || '-' }}
                              </span>
                            </el-tooltip>
                            <!--<span class="text-truncate">-->
                            <!--  {{ dtcDto.name || '-' }}-->
                            <!--</span>-->
                          </el-col>
                          <el-col :span="15">
                            {{
                              dtcDto.dtcItemDtcDataDtos &&
                              dtcDto.dtcItemDtcDataDtos.length > 0
                                ? `${dtcDto.dtcItemDtcDataDtos.length} DTC${dtcDto.dtcItemDtcDataDtos.length > 1 ? 's' : ''}`
                                : '-'
                            }}
                          </el-col>
                          <el-col :span="4">
                            <el-button
                              class="rounded-full! h-24!"
                              @click.stop="
                                handleViewDtcDetail(dtcDto, item.name)
                              "
                            >
                              View Details
                            </el-button>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                    <!-- 多余的空白 -->
                    <div
                      class="bg-neutrals/off-white h-16 w-full"
                      v-if="index === item.dtcItemDtcDtos.length - 1"
                    ></div>
                  </el-col>
                </el-row>
              </div>
            </div>
            <el-divider class="border-t-1!" />
          </template>
        </template>
        <!-- Body and Trim -->
        <template v-if="bodyAndTrimItemList.length > 0">
          <!-- table -->
          <el-row
            :gutter="16"
            :class="[
              'hover:bg-status-colours-light-blue-hover!',
              'text-neutrals-grey-4',
              'cursor-pointer',
              bodyAndTrimItemIsExpand
                ? 'bg-status-colours-light-blue-hover! divider-bottom-grey-4-1px! text-neutrals-off-black'
                : '',
            ]"
            @click.stop="bodyAndTrimItemIsExpand = !bodyAndTrimItemIsExpand"
          >
            <el-col :span="1" class="is-center">
              <el-image
                :src="bodyAndTrimItemIsExpand ? ExpandIcon : CollapseIcon"
                class="h-16 w-16 cursor-pointer"
                fit="cover"
                @click.stop="bodyAndTrimItemIsExpand = !bodyAndTrimItemIsExpand"
              />
            </el-col>
            <el-col :span="14">
              {{ VehicleEcuCategory.BODY_AND_TRIM }}
            </el-col>
            <el-col :span="9">
              <i
                :class="[
                  'rounded-99',
                  'px-6',
                  'py-4',
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
          <el-divider
            :class="{
              'divider-neutral-off-white-1px!': bodyAndTrimItemIsExpand,
            }"
          />
          <!-- OEM table -->
          <template v-if="bodyAndTrimItemIsExpand">
            <el-row
              :span="16"
              class="text-neutrals-off-black bg-neutrals-off-white pt-16!"
            >
              <el-col :span="1"></el-col>
              <el-col :span="23">
                <el-row
                  :span="16"
                  class="w-full! text-neutrals-grey-4 bg-neutrals-off-white'"
                >
                  <el-col :span="1"></el-col>
                  <el-col :span="14" class="pl-8!">OEM Name</el-col>
                  <el-col :span="9" class="pl-8!">Fault Codes</el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row
              :span="16"
              class="no-height text-neutrals-off-black bg-neutrals-off-white"
            >
              <el-col :span="1"></el-col>
              <el-col :span="23">
                <el-divider class="divider-neutral-off-white-1px!" />
              </el-col>
            </el-row>
            <div
              v-for="(item, index) in bodyAndTrimItemList"
              :key="item.id"
              :class="{
                'bg-neutrals-off-white': bodyAndTrimItemIsExpand,
                'pb-16': index === bodyAndTrimItemList.length - 1,
              }"
            >
              <!-- DTC Code Table -->
              <el-row
                :span="16"
                :class="[
                  'h-40',
                  'text-neutrals-off-black',
                  {
                    'bg-neutrals-off-white': bodyAndTrimItemIsExpand,
                    'pr-16': item.hasOEMItem && item.isExpand,
                  },
                ]"
              >
                <el-col :span="1"></el-col>
                <el-col
                  :span="23"
                  :class="{
                    'bg-neutrals/off-white': item.hasOEMItem && item.isExpand,
                  }"
                >
                  <el-row
                    class="w-full! text-neutrals-off-black white-border"
                    :gutter="16"
                    :class="{
                      'cursor-pointer': item.hasOEMItem,
                      'gray-border': item.hasOEMItem && item.isExpand,
                      'hover:bg-neutrals/off-white': item.hasOEMItem,
                    }"
                    @click.stop="handleOpenOEMItem(item)"
                  >
                    <el-col
                      :span="1"
                      class="is-center"
                      @click.stop="handleOpenOEMItem(item)"
                    >
                      <el-image
                        v-if="item.hasOEMItem"
                        :src="item.isExpand ? ExpandIcon : CollapseIcon"
                        class="h-16 w-16 cursor-pointer"
                        fit="cover"
                      />
                    </el-col>
                    <el-col :span="14">
                      <el-tooltip :content="item.name">
                        <span class="text-truncate">
                          {{ item.name || '-' }}
                        </span>
                      </el-tooltip>
                    </el-col>
                    <el-col :span="9">
                      {{
                        item.dtcItemDtcDtos && item.dtcItemDtcDtos.length > 0
                          ? `${item.dtcItemDtcDtos.length} DTC${item.dtcItemDtcDtos.length > 1 ? 's' : ''}`
                          : '-'
                      }}
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <!-- Code table -->
              <div v-if="item.hasOEMItem && item.isExpand" class="pb-16 pr-16">
                <el-row :span="16">
                  <el-col :span="1"></el-col>
                  <el-col :span="23" class="bg-neutrals/off-white">
                    <el-row :span="16" class="w-full!">
                      <el-col :span="1"></el-col>
                      <el-col :span="23">
                        <!-- 层级二 ==>  dtcItemDtcDtos  table header  -->
                        <el-row :gutter="16" class="w-full! gray-border">
                          <el-col :span="5" class="extra">Code</el-col>
                          <el-col :span="15">Description</el-col>
                          <el-col :span="4"></el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <!-- 层级二 ==> dtcItemDtcDtos  table body -->
                <el-row
                  :span="16"
                  v-if="item.hasOEMItem && item.isExpand"
                  v-for="(dtcDto, index) in item.dtcItemDtcDtos"
                  :key="dtcDto.id"
                  class="h-40"
                >
                  <el-col :span="1"></el-col>
                  <el-col
                    :span="23"
                    class="bg-neutrals/off-white"
                    :class="
                      index === item.dtcItemDtcDtos.length - 1
                        ? 'flex flex-wrap'
                        : ''
                    "
                  >
                    <el-row :span="16" class="w-full!">
                      <el-col :span="1"></el-col>
                      <el-col :span="23">
                        <el-row :gutter="16" class="w-full! gray-border">
                          <el-col :span="5" class="extra">
                            <el-tooltip :content="dtcDto.name">
                              <span class="text-truncate">
                                {{ dtcDto.name || '-' }}
                              </span>
                            </el-tooltip>
                            <!--<span class="text-truncate">-->
                            <!--  {{ dtcDto.name || '-' }}-->
                            <!--</span>-->
                          </el-col>
                          <el-col :span="15">
                            {{
                              dtcDto.dtcItemDtcDataDtos &&
                              dtcDto.dtcItemDtcDataDtos.length > 0
                                ? `${dtcDto.dtcItemDtcDataDtos.length} DTC${dtcDto.dtcItemDtcDataDtos.length > 1 ? 's' : ''}`
                                : '-'
                            }}
                          </el-col>
                          <el-col :span="4">
                            <el-button
                              class="rounded-full! h-24!"
                              @click.stop="
                                handleViewDtcDetail(dtcDto, item.name)
                              "
                            >
                              View Details
                            </el-button>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                    <!-- 多余的空白 -->
                    <div
                      class="bg-neutrals/off-white h-16 w-full"
                      v-if="index === item.dtcItemDtcDtos.length - 1"
                    ></div>
                  </el-col>
                </el-row>
              </div>
            </div>
            <el-divider class="border-t-1!" />
          </template>
        </template>
        <!-- Others -->
        <template v-if="otherItemList.length > 0">
          <!-- table -->
          <el-row
            :gutter="16"
            :class="[
              'hover:bg-status-colours-light-blue-hover!',
              'text-neutrals-grey-4',
              'cursor-pointer',
              otherItemIsExpand
                ? 'bg-status-colours-light-blue-hover! divider-bottom-grey-4-1px! text-neutrals-off-black'
                : '',
            ]"
            @click.stop="otherItemIsExpand = !otherItemIsExpand"
          >
            <el-col :span="1" class="is-center">
              <el-image
                :src="otherItemIsExpand ? ExpandIcon : CollapseIcon"
                class="h-16 w-16 cursor-pointer"
                fit="cover"
                @click.stop="otherItemIsExpand = !otherItemIsExpand"
              />
            </el-col>
            <el-col :span="14">
              {{ VehicleEcuCategory.OTHERS }}
            </el-col>
            <el-col :span="9">
              <i
                :class="[
                  'rounded-99',
                  'px-6',
                  'py-4',
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
          <el-divider
            :class="{
              'divider-neutral-off-white-1px!': otherItemIsExpand,
            }"
          />
          <!-- OEM table -->
          <template v-if="otherItemIsExpand">
            <el-row
              :span="16"
              class="text-neutrals-off-black bg-neutrals-off-white pt-16!"
            >
              <el-col :span="1"></el-col>
              <el-col :span="23">
                <el-row
                  :span="16"
                  class="w-full! text-neutrals-grey-4 bg-neutrals-off-white'"
                >
                  <el-col :span="1"></el-col>
                  <el-col :span="14" class="pl-8!">OEM Name</el-col>
                  <el-col :span="9" class="pl-8!">Fault Codes</el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row
              :span="16"
              class="no-height text-neutrals-off-black bg-neutrals-off-white"
            >
              <el-col :span="1"></el-col>
              <el-col :span="23">
                <el-divider class="divider-neutral-off-white-1px!" />
              </el-col>
            </el-row>
            <div
              v-for="(item, index) in otherItemList"
              :key="item.id"
              :class="{
                'bg-neutrals-off-white': otherItemIsExpand,
                'pb-16': index === otherItemList.length - 1,
              }"
            >
              <!-- DTC Code Table -->
              <el-row
                :span="16"
                :class="[
                  'h-40',
                  'text-neutrals-off-black',
                  {
                    'bg-neutrals-off-white': otherItemIsExpand,
                    'pr-16': item.hasOEMItem && item.isExpand,
                  },
                ]"
              >
                <el-col :span="1"></el-col>
                <el-col
                  :span="23"
                  :class="{
                    'bg-neutrals/off-white': item.hasOEMItem && item.isExpand,
                  }"
                >
                  <el-row
                    class="w-full! text-neutrals-off-black white-border"
                    :gutter="16"
                    :class="{
                      'cursor-pointer': item.hasOEMItem,
                      'gray-border': item.hasOEMItem && item.isExpand,
                      'hover:bg-neutrals/off-white': item.hasOEMItem,
                    }"
                    @click.stop="handleOpenOEMItem(item)"
                  >
                    <el-col
                      :span="1"
                      class="is-center"
                      @click.stop="handleOpenOEMItem(item)"
                    >
                      <el-image
                        v-if="item.hasOEMItem"
                        :src="item.isExpand ? ExpandIcon : CollapseIcon"
                        class="h-16 w-16 cursor-pointer"
                        fit="cover"
                      />
                    </el-col>
                    <el-col :span="14">
                      <el-tooltip :content="item.name">
                        <span class="text-truncate">
                          {{ item.name || '-' }}
                        </span>
                      </el-tooltip>
                    </el-col>
                    <el-col :span="9">
                      {{
                        item.dtcItemDtcDtos && item.dtcItemDtcDtos.length > 0
                          ? `${item.dtcItemDtcDtos.length} DTC${item.dtcItemDtcDtos.length > 1 ? 's' : ''}`
                          : '-'
                      }}
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <!-- Code table -->
              <div v-if="item.hasOEMItem && item.isExpand" class="pb-16 pr-16">
                <el-row :span="16">
                  <el-col :span="1"></el-col>
                  <el-col :span="23" class="bg-neutrals/off-white">
                    <el-row :span="16" class="w-full!">
                      <el-col :span="1"></el-col>
                      <el-col :span="23">
                        <!-- 层级二 ==>  dtcItemDtcDtos  table header  -->
                        <el-row :gutter="16" class="w-full! gray-border">
                          <el-col :span="5" class="extra">Code</el-col>
                          <el-col :span="15">Description</el-col>
                          <el-col :span="4"></el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <!-- 层级二 ==> dtcItemDtcDtos  table body -->
                <el-row
                  :span="16"
                  v-if="item.hasOEMItem && item.isExpand"
                  v-for="(dtcDto, index) in item.dtcItemDtcDtos"
                  :key="dtcDto.id"
                  class="h-40"
                >
                  <el-col :span="1"></el-col>
                  <el-col
                    :span="23"
                    class="bg-neutrals/off-white"
                    :class="
                      index === item.dtcItemDtcDtos.length - 1
                        ? 'flex flex-wrap'
                        : ''
                    "
                  >
                    <el-row :span="16" class="w-full!">
                      <el-col :span="1"></el-col>
                      <el-col :span="23">
                        <el-row :gutter="16" class="w-full! gray-border">
                          <el-col :span="5" class="extra">
                            <el-tooltip :content="dtcDto.name">
                              <span class="text-truncate">
                                {{ dtcDto.name || '-' }}
                              </span>
                            </el-tooltip>
                            <!--<span class="text-truncate">-->
                            <!--  {{ dtcDto.name || '-' }}-->
                            <!--</span>-->
                          </el-col>
                          <el-col :span="15">
                            {{
                              dtcDto.dtcItemDtcDataDtos &&
                              dtcDto.dtcItemDtcDataDtos.length > 0
                                ? `${dtcDto.dtcItemDtcDataDtos.length} DTC${dtcDto.dtcItemDtcDataDtos.length > 1 ? 's' : ''}`
                                : '-'
                            }}
                          </el-col>
                          <el-col :span="4">
                            <el-button
                              class="rounded-full! h-24!"
                              @click.stop="
                                handleViewDtcDetail(dtcDto, item.name)
                              "
                            >
                              View Details
                            </el-button>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                    <!-- 多余的空白 -->
                    <div
                      class="bg-neutrals/off-white h-16 w-full"
                      v-if="index === item.dtcItemDtcDtos.length - 1"
                    ></div>
                  </el-col>
                </el-row>
              </div>
            </div>
            <el-divider class="border-t-1!" />
          </template>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.fault-codes-container {
  @apply mx-32;

  :deep(.el-row) {
    @apply text-14 font-500 mx-0!;

    // 居中
    .el-col {
      @apply leading-32 row-center box-border h-32;

      &:first-child {
        @apply pl-0!;
      }

      &:last-child {
        @apply pr-0!;
      }

      &.extra {
        @apply pl-8!;
      }

      &.is-center {
        @apply flex-center;
      }

      /// 重置图标样式
      i {
        @apply text-12 font-400 leading-17 h-17;
      }
    }

    // 删除行高
    &.no-height {
      .el-col {
        @apply h-auto;
      }
    }

    // 40px
    &.h-40 {
      .el-col {
        @apply h-40;
      }
    }

    // 添加白色边框
    &.white-border {
      @apply border-b-1 border-b-solid border-b-[#FCFCFC];
    }

    // 添加灰色边框
    &.gray-border {
      @apply border-b-1 border-b-solid border-b-[#EAEEF4];
    }
  }
}
</style>
