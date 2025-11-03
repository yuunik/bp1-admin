<script setup>
import { useRoute } from 'vue-router'
import Big from 'big.js'

import {
  getImgUrlToBase64,
  getVehicleReportInfoApi,
  getPdfApi,
} from '@/apis/shareApi.js'
import {
  getDateWithDDMMMYYYY,
  getGeneratedDateWithDDMMMYYYYhhmma,
} from '@/utils/dateUtil.js'
import {
  getFormatNumber,
  getFormatNumberString,
  getFullFilePath,
  roundToInt,
} from '@/utils/dataFormattedUtil.js'
import { VehicleEcuCategory } from '@/utils/constantsUtil.js'

import FaultCodesIcon from '@/assets/icons/fault-code-icon.svg'
import DefaultCardImg from '@/assets/images/default-car-img.png'
import RepairIcon from '@/assets/icons/fi_tool.svg'
import MaintenanceIcon from '@/assets/icons/fi_file-minus.svg'
import FuelIcon from '@/assets/icons/fuel-level.svg'
import ModificationIcon from '@/assets/icons/modification.svg'
import EngineIcon from '@/assets/icons/engine-load.svg'
import TransmissionIcon from '@/assets/icons/tranmission.svg'
import BrakesIcon from '@/assets/icons/brakes.svg'
import ElectricalIcon from '@/assets/icons/car-battery.svg'
import ChassisIcon from '@/assets/icons/chassis.svg'
import BodyAndTrimIcon from '@/assets/icons/services-icon.svg'
import OthersIcon from '@/assets/icons/others-icon.svg'
import BaseSvgIcon from '@/components/BaseSvgIcon.vue'
import RepairShopIcon from '@/assets/icons/Repair Shop.svg'
// 正常状态的图标
import NormalStatusIcon from '@/assets/specialIcons/check-one-fill.svg'
import ErrorImg from '@/assets/images/error-img.png'

// module 图标映射
const moduleIconMap = Object.freeze({
  [VehicleEcuCategory.ENGINE]: EngineIcon,
  [VehicleEcuCategory.TRANSMISSION]: TransmissionIcon,
  [VehicleEcuCategory.BRAKES]: BrakesIcon,
  [VehicleEcuCategory.ELECTRICAL]: ElectricalIcon,
  [VehicleEcuCategory.CHASSIS]: ChassisIcon,
  [VehicleEcuCategory.BODY_AND_TRIM]: BodyAndTrimIcon,
  [VehicleEcuCategory.OTHERS]: OthersIcon,
})

// 页面加载状态
const isLoading = ref(false)

// pdf 生成状态
const isGeneratingPdf = ref(false)

// 车辆报告详情
const vehicleReportInfo = reactive({})

// 显示导出按钮
const showExportButton = ref(true)

const route = useRoute()

const vehicleImg = ref('')

const totalCost = computed(
  () =>
    vehicleReportInfo.reportCategoryDtos &&
    vehicleReportInfo.reportCategoryDtos?.reduce(
      (acc, cur) => acc + parseFloat(cur.amount),
      0,
    ),
)
// 获取车辆报告详情
const getVehicleReportInfo = async (id) => {
  isLoading.value = true
  try {
    const { data } = await getVehicleReportInfoApi(id)
    // 获取成功
    Object.assign(vehicleReportInfo, data)
    // 将网络图片转为本地图片
    const res = await getImgUrlToBase64(
      getFullFilePath(vehicleReportInfo.vehicleDto?.cover),
    )
    vehicleImg.value = res
    isLoading.value = false
  } catch (e) {
  } finally {
    isLoading.value = false
  }
}

// 获取路径中的id参数
const { id } = route.params
if (id) {
  // 获取到id
  getVehicleReportInfo(id)
}

// 是否有 fault code 列表
const hasFaultCodeList = computed(
  () =>
    vehicleReportInfo.reportDtcItemDtos &&
    vehicleReportInfo.reportDtcItemDtos.length > 0,
)

// 引擎分类
const engineItemList = computed(() =>
  hasFaultCodeList.value
    ? vehicleReportInfo.reportDtcItemDtos.filter(
        (item) => item.type === VehicleEcuCategory.ENGINE,
      )
    : [],
)

// 引擎系统DTC数量
const engineSystemDtcCount = computed(() =>
  engineItemList.value.length
    ? engineItemList.value.reduce(
        (pre, cur) => pre + cur.reportDtcItemDtcDtos.length,
        0,
      )
    : 0,
)

// 变速箱分类
const transmissionItemList = computed(() =>
  hasFaultCodeList.value
    ? vehicleReportInfo.reportDtcItemDtos.filter(
        (item) => item.type === VehicleEcuCategory.TRANSMISSION,
      )
    : [],
)

// 变速箱系统DTC数量
const transmissionSystemDtcCount = computed(() =>
  transmissionItemList.value.length
    ? transmissionItemList.value.reduce(
        (pre, cur) => pre + cur.reportDtcItemDtcDtos.length,
        0,
      )
    : 0,
)

// 制动分类
const brakesItemList = computed(() =>
  hasFaultCodeList.value
    ? vehicleReportInfo.reportDtcItemDtos.filter(
        (item) => item.type === VehicleEcuCategory.BRAKES,
      )
    : [],
)

// 制动系统DTC数量
const brakesSystemDtcCount = computed(() =>
  brakesItemList.value.length
    ? brakesItemList.value.reduce(
        (pre, cur) => pre + cur.reportDtcItemDtcDtos.length,
        0,
      )
    : 0,
)

// 电气分类
const electricalItemList = computed(() =>
  hasFaultCodeList.value
    ? vehicleReportInfo.reportDtcItemDtos.filter(
        (item) => item.type === VehicleEcuCategory.ELECTRICAL,
      )
    : [],
)

// 电气分类DTC数量
const electricalSystemDtcCount = computed(() =>
  electricalItemList.value.length
    ? electricalItemList.value.reduce(
        (pre, cur) => pre + cur.reportDtcItemDtcDtos.length,
        0,
      )
    : 0,
)

// 底盘分类
const chassisItemList = computed(() =>
  hasFaultCodeList.value
    ? vehicleReportInfo.reportDtcItemDtos.filter(
        (item) => item.type === VehicleEcuCategory.CHASSIS,
      )
    : [],
)

// 底盘分类DTC数量
const chassisSystemDtcCount = computed(() =>
  chassisItemList.value.length
    ? chassisItemList.value.reduce(
        (pre, cur) => pre + cur.reportDtcItemDtcDtos.length,
        0,
      )
    : 0,
)

// 车身分类
const bodyAndTrimItemList = computed(() =>
  hasFaultCodeList.value
    ? vehicleReportInfo.reportDtcItemDtos.filter(
        (item) => item.type === VehicleEcuCategory.BODY_AND_TRIM,
      )
    : [],
)

// 车身分类DTC数量
const bodyAndTrimSystemDtcCount = computed(() =>
  bodyAndTrimItemList.value.length
    ? bodyAndTrimItemList.value.reduce(
        (pre, cur) => pre + cur.reportDtcItemDtcDtos.length,
        0,
      )
    : 0,
)

// 其他分类
const otherItemList = computed(() =>
  hasFaultCodeList.value
    ? vehicleReportInfo.reportDtcItemDtos.filter(
        (item) => item.type === VehicleEcuCategory.OTHER,
      )
    : [],
)

// 其他分类DTC数量
const otherSystemDtcCount = computed(() =>
  otherItemList.value.length
    ? otherItemList.value.reduce(
        (pre, cur) => pre + cur.reportDtcItemDtcDtos.length,
        0,
      )
    : 0,
)

// 分类的图标映射
const categoryIconMap = Object.freeze({
  Repair: RepairIcon,
  Maintenance: MaintenanceIcon,
  Fuel: FuelIcon,
  Services: BodyAndTrimIcon,
  Modification: ModificationIcon,
  Others: OthersIcon,
})

// 生成 pdf
const generatePdf = async () => {
  try {
    isGeneratingPdf.value = true
    showExportButton.value = false
    const { data } = await getPdfApi({
      id: vehicleReportInfo.id,
      url: `${window.location.href}?type=print`,
    })
    const link = document.createElement('a')
    link.href = getFullFilePath(data)
    link.download = 'report.pdf'
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } finally {
    isGeneratingPdf.value = false
    showExportButton.value = true
  }
}

// avatar 加载的错误行为
const avatarErrorHandler = () => true
</script>

<template>
  <div class="report-container flex flex-col p-20" v-loading="isLoading">
    <!-- 头部区 -->
    <header>
      <hgroup class="flex flex-col gap-4">
        <h1 class="poppins-28px-semibold text-neutrals-off-black">
          Vehicle Report
        </h1>
        <h2 class="poppins-12px-medium text-neutrals-grey-4">
          {{ getGeneratedDateWithDDMMMYYYYhhmma(vehicleReportInfo.createTime) }}
        </h2>
      </hgroup>
    </header>
    <!-- 内容区 -->
    <main class="relative">
      <!-- 报告 -->
      <article>
        <!-- 车辆信息 -->
        <section class="my-16 flex items-center gap-16">
          <el-image
            :src="getFullFilePath(vehicleReportInfo.vehicleDto?.cover)"
            alt="user vehicle image"
            class="w-120 rounded-16 md:(w-200 h-133) row-center! h-80"
            fit="cover"
          >
            <template #error>
              <!-- 车辆图片加载失败的默认 -->
              <el-image
                :src="DefaultCardImg"
                class="rounded-16"
                alt="user vehicle image"
                fit="cover"
              />
            </template>
          </el-image>
          <div class="flex flex-1 flex-col gap-8">
            <h2 class="row-center">
              <em
                class="text-16 text-neutrals-blue h-30 row-center poppins-20px-semibold not-italic"
              >
                {{
                  `${vehicleReportInfo.brand} ${vehicleReportInfo.model} ${vehicleReportInfo.year}` ||
                  '-'
                }}
              </em>
            </h2>
            <ul class="flex flex-col gap-4 [&>li]:flex [&>li]:gap-8">
              <li class="flex items-center">
                <p class="poppins-10px-regular text-neutrals-grey-4 min-w-80">
                  VIN
                </p>
                <span
                  class="poppins-10px-regular wrap-text text-neutrals-off-black flex-1"
                >
                  {{ vehicleReportInfo.vin || '-' }}
                </span>
              </li>
              <li class="flex items-center">
                <p class="poppins-10px-regular text-neutrals-grey-4 min-w-80">
                  License Plate
                </p>
                <span
                  class="poppins-10px-regular wrap-text text-neutrals-off-black flex-1"
                >
                  {{ vehicleReportInfo.licensePlate || '-' }}
                </span>
              </li>
              <li class="flex items-center">
                <p class="poppins-10px-regular text-neutrals-grey-4 min-w-80">
                  Mileage
                </p>
                <span
                  class="poppins-10px-regular wrap-text text-neutrals-off-black flex-1"
                >
                  {{ getFormatNumber(vehicleReportInfo.mileage) || '-' }} km
                </span>
              </li>
            </ul>
          </div>
        </section>
        <div class="flex flex-col gap-24">
          <!-- 车辆评分 -->
          <section
            class="bg-branding-primary rounded-16 text-neutrals-white flex gap-16 p-12"
          >
            <!-- 评分 -->
            <div class="min-w-42 flex flex-col">
              <em
                class="hanno-20px-regular text-align-center font-hanno leading-24 h-24 not-italic"
              >
                {{ vehicleReportInfo.grade }}
              </em>
              <span class="text-10px-regular text-neutrals-grey-2 font-roboto">
                out of 10
              </span>
            </div>
            <!-- 分割线 -->
            <div class="box-border py-5">
              <div class="bg-neutrals-grey-4 h-full w-1" />
            </div>
            <!-- 车辆评分等级 -->
            <div class="flex flex-1 flex-col gap-4">
              <span class="roboto-12px-semibold h-14">Evaluation Level</span>
              <p class="text-neutrals-grey-2 text-10px-regular">
                {{ vehicleReportInfo.explain || '-' }}
              </p>
            </div>
          </section>
          <!-- 总览 -->
          <section class="section-container">
            <h3 class="section-header h-18 leading-18">
              <em class="title h-18">Overview</em>
            </h3>
            <!-- Issues -->
            <div class="flex flex-col gap-8">
              <h4 class="ml-12">
                <span
                  class="poppins-10px-semibold text-neutrals-grey-4 min-h-14"
                >
                  Issues
                </span>
              </h4>
              <div class="flex gap-8">
                <div
                  class="bg-neutrals-off-white rounded-8 text-truncate flex flex-1 flex-col items-center gap-8 p-12"
                >
                  <base-svg-icon
                    name="fault-code-icon"
                    size="24px"
                    :color="
                      vehicleReportInfo.faultCodeCount > 0
                        ? '#EF3C30'
                        : '#6F7788'
                    "
                  />
                  <p
                    :class="[
                      'poppins-10px-semibold',
                      'wrap-text',
                      vehicleReportInfo.faultCodeCount > 0
                        ? 'text-status-colours-red'
                        : 'text-neutrals-off-black',
                    ]"
                  >
                    {{ `${vehicleReportInfo.faultCodeCount} Fault Codes` }}
                  </p>
                </div>
                <div
                  class="bg-neutrals-off-white rounded-8 text-truncate flex flex-1 flex-col items-center gap-8 p-12"
                >
                  <base-svg-icon
                    name="prediction-icon"
                    size="24px"
                    :color="
                      vehicleReportInfo.reportPredictionDtos?.length > 0
                        ? '#EF3C30'
                        : '#6F7788'
                    "
                  ></base-svg-icon>
                  <p
                    :class="[
                      'poppins-10px-semibold',
                      'wrap-text',
                      vehicleReportInfo.reportPredictionDtos?.length > 0
                        ? 'text-status-colours-red'
                        : 'text-neutrals-off-black',
                    ]"
                  >
                    {{
                      `${vehicleReportInfo.reportPredictionDtos?.length} Prediction`
                    }}
                  </p>
                </div>
              </div>
            </div>
            <!-- Expense Records -->
            <div class="flex flex-col gap-8">
              <h4 class="ml-12">
                <span
                  class="poppins-10px-semibold text-neutrals-grey-4 min-h-14"
                >
                  Expense Records
                </span>
              </h4>
              <div class="flex gap-8">
                <!-- Repair -->
                <div
                  class="bg-neutrals-off-white rounded-8 text-truncate box-border flex flex-1 flex-col items-center gap-8 p-12"
                >
                  <base-svg-icon
                    name="fi_tool"
                    size="24px"
                    color="#6F7788"
                  ></base-svg-icon>
                  <p
                    class="poppins-10px-semibold h-15 wrap-text text-align-center w-full break-normal"
                  >
                    {{ vehicleReportInfo.repairCount ?? '-' }} Repair
                  </p>
                </div>
                <!-- Maintenance -->
                <div
                  class="bg-neutrals-off-white rounded-8 text-truncate box-border flex flex-1 flex-col items-center gap-8 p-12"
                >
                  <base-svg-icon
                    name="fi_file-minus"
                    size="24px"
                    color="#6F7788"
                  ></base-svg-icon>
                  <p
                    class="poppins-10px-semibold h-15 wrap-text text-align-center w-full break-normal"
                  >
                    {{ vehicleReportInfo.maintenanceCount ?? '-' }} Maintenance
                  </p>
                </div>
                <!-- Modification -->
                <div
                  class="bg-neutrals-off-white text-truncate rounded-8 box-border flex flex-1 flex-col items-center gap-8 whitespace-nowrap p-12"
                >
                  <base-svg-icon
                    name="modification"
                    size="24px"
                    color="#6F7788"
                  ></base-svg-icon>
                  <p
                    class="poppins-10px-semibold h-15 wrap-text text-align-center w-full break-normal"
                  >
                    {{ vehicleReportInfo.modificationCount ?? '-' }}
                    Modification
                  </p>
                </div>
              </div>
            </div>
          </section>
          <!-- Vehicle Information -->
          <section class="section-container">
            <h3 class="section-header h-18 row-center">
              <em class="title">Vehicle Information</em>
            </h3>
            <ul
              class="[&_p]:min-w-100 [&>li]:h-15 grid grid-cols-1 gap-8 px-12 md:grid-cols-2 [&>li]:flex [&>li]:gap-8"
            >
              <li>
                <p class="poppins-10px-regular text-neutrals-grey-4">
                  Vehicle Type
                </p>
                <span class="poppins-10px-regular text-neutrals-off-black">
                  {{ vehicleReportInfo.vehicleDto?.vehicleType || '-' }}
                </span>
              </li>
              <li>
                <p class="poppins-10px-regular text-neutrals-grey-4">
                  Primary Colour
                </p>
                <span class="poppins-10px-regular text-neutrals-off-black">
                  {{ vehicleReportInfo.vehicleDto?.primaryColour || '-' }}
                </span>
              </li>
              <li>
                <p class="poppins-10px-regular text-neutrals-grey-4">
                  Manufacturing Year
                </p>
                <span class="poppins-10px-regular text-neutrals-off-black">
                  {{ vehicleReportInfo.vehicleDto?.year || '-' }}
                </span>
              </li>
              <li>
                <p class="poppins-10px-regular text-neutrals-grey-4">
                  Chassis No.
                </p>
                <span class="poppins-10px-regular text-neutrals-off-black">
                  {{ vehicleReportInfo.vehicleDto?.vin || '-' }}
                </span>
              </li>
              <li>
                <p class="poppins-10px-regular text-neutrals-grey-4">
                  Original Reg. Date
                </p>
                <span class="poppins-10px-regular text-neutrals-off-black">
                  {{
                    getDateWithDDMMMYYYY(
                      vehicleReportInfo.vehicleDto?.createTime,
                    ) || '-'
                  }}
                </span>
              </li>
              <li>
                <p class="poppins-10px-regular text-neutrals-grey-4">
                  Transfer Count
                </p>
                <span class="poppins-10px-regular text-neutrals-off-black">
                  {{ vehicleReportInfo.vehicleDto?.transferCount || '-' }}
                </span>
              </li>
              <li>
                <p class="poppins-10px-regular text-neutrals-grey-4">
                  COE Category
                </p>
                <span class="poppins-10px-regular text-neutrals-off-black">
                  {{ vehicleReportInfo.vehicleDto?.coeCategory || '-' }}
                </span>
              </li>
              <li>
                <p class="poppins-10px-regular text-neutrals-grey-4">
                  Engine Capacity
                </p>
                <span class="poppins-10px-regular text-neutrals-off-black">
                  {{ vehicleReportInfo.vehicleDto?.engineCapacity || '-' }}
                </span>
              </li>
            </ul>
          </section>
          <!-- Fault Codes -->
          <section
            class="section-container"
            v-if="
              vehicleReportInfo.reportDtcItemDtos &&
              vehicleReportInfo.reportDtcItemDtos.length > 0
            "
          >
            <div class="row-center h-18 leading-18 section-header gap-4">
              <h3 class="text-neutrals-off-black poppins-12px-semibold">
                Fault Codes
              </h3>
              <span class="text-neutrals-off-black poppins-12px-semibold">
                ({{ vehicleReportInfo.faultCodeCount }})
              </span>
            </div>
            <!-- table -->
            <div>
              <!-- thead -->
              <el-row
                class="bg-neutrals-grey-1 rounded-t-8 text-neutrals-grey-4 rounded"
                :gutter="16"
              >
                <el-col :span="2"></el-col>
                <el-col :xs="18" :sm="6">
                  <span class="poppins-10px-semibold hidden md:block">
                    System
                  </span>
                  <span class="poppins-10px-semibold md:hidden">
                    System & OEM
                  </span>
                </el-col>
                <el-col
                  :span="12"
                  class="hidden! md:block! poppins-10px-semibold"
                >
                  OEM
                </el-col>
                <el-col :span="4" class="poppins-10px-semibold">DTC</el-col>
              </el-row>
              <!-- tbody -->
              <!-- Engine -->
              <template v-if="engineItemList.length > 0">
                <el-row
                  class="poppins-10px-regular text-neutrals-off-black row-center"
                  :gutter="16"
                >
                  <el-col :span="2" class="flex!">
                    <img
                      :src="EngineIcon"
                      class="mx-auto h-16 w-16 object-cover"
                    />
                  </el-col>
                  <el-col :xs="18" :sm="6" class="poppins-10px-regular">
                    {{ VehicleEcuCategory.ENGINE }}
                  </el-col>
                  <el-col :xs="0" :sm="12" />
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
                    <el-col :span="2" />
                    <el-col :xs="0" :sm="6" />
                    <el-col
                      :xs="18"
                      :sm="12"
                      class="divider-neutral-grey-4-1px"
                    >
                      {{ item.name }}
                    </el-col>
                    <el-col :span="4" class="divider-neutral-grey-4-1px">
                      <span
                        v-if="
                          item.reportDtcItemDtcDtos &&
                          item.reportDtcItemDtcDtos.length > 0
                        "
                      >
                        {{ item.reportDtcItemDtcDtos.length }} DTC{{
                          item.reportDtcItemDtcDtos.length > 1 ? 's' : ''
                        }}
                      </span>
                      <el-image
                        v-else
                        :src="NormalStatusIcon"
                        class="h-12 w-12"
                        fit="cover"
                      />
                    </el-col>
                  </el-row>
                  <el-row
                    v-if="index !== engineItemList.length - 1"
                    class="no-p"
                  >
                    <el-col :span="2" />
                    <el-col :xs="0" :sm="6" />
                    <el-col :xs="22" :sm="16"><el-divider /></el-col>
                  </el-row>

                  <!-- DTC 数量 -->
                  <template
                    v-if="
                      item.reportDtcItemDtcDtos &&
                      item.reportDtcItemDtcDtos.length > 0
                    "
                  >
                    <el-row
                      class="poppins-10px-regular text-neutrals-off-black poppins-10px-semibold py-0! px-0!"
                      :gutter="16"
                    >
                      <el-col :span="2" />
                      <el-col :xs="0" :sm="6" />
                      <el-col :xs="22" :sm="16" class="pl-0!">
                        <el-row
                          :gutter="24"
                          class="rounded-t-8 bg-neutrals-off-white md-model text-neutrals-grey-4"
                        >
                          <el-col :span="6">DTC</el-col>
                          <el-col :span="18">Description</el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                    <el-row
                      v-for="(dtcDto, index) in item.reportDtcItemDtcDtos"
                      :key="dtcDto.id"
                      :class="[
                        'poppins-10px-regular',
                        'text-neutrals-off-black',
                        'px-0!',
                        index === item.reportDtcItemDtcDtos.length - 1
                          ? 'pt-1!'
                          : 'pt-1! pb-0!',
                      ]"
                      :gutter="16"
                    >
                      <el-col :span="2" />
                      <el-col :xs="0" :sm="6" />
                      <el-col :xs="22" :sm="16" class="pl-0!">
                        <el-row
                          :gutter="24"
                          :class="[
                            'bg-neutrals-off-white',
                            'items-start!',
                            'md-model',
                            {
                              'rounded-b-8':
                                index === item.reportDtcItemDtcDtos.length - 1,
                            },
                          ]"
                        >
                          <el-col :span="6">
                            <span>
                              {{ dtcDto.faultCode || '-' }}
                            </span>
                          </el-col>
                          <el-col :span="18">
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
                  class="poppins-10px-regular text-neutrals-off-black row-center"
                  :gutter="16"
                >
                  <el-col :span="2" class="flex!">
                    <img
                      :src="TransmissionIcon"
                      class="mx-auto h-16 w-16 object-cover"
                    />
                  </el-col>
                  <el-col :xs="18" :sm="6" class="poppins-10px-regular">
                    {{ VehicleEcuCategory.TRANSMISSION }}
                  </el-col>
                  <el-col :xs="0" :sm="12" />
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
                <div
                  v-for="(item, index) in transmissionItemList"
                  :key="item.id"
                >
                  <el-row
                    class="poppins-10px-regular text-neutrals-off-black"
                    :gutter="16"
                  >
                    <el-col :span="2" />
                    <el-col :xs="0" :sm="6" />
                    <el-col
                      :xs="18"
                      :sm="12"
                      class="divider-neutral-grey-4-1px"
                    >
                      {{ item.name }}
                    </el-col>
                    <el-col :span="4" class="divider-neutral-grey-4-1px">
                      <span
                        v-if="
                          item.reportDtcItemDtcDtos &&
                          item.reportDtcItemDtcDtos.length > 0
                        "
                      >
                        {{ item.reportDtcItemDtcDtos.length }} DTC{{
                          item.reportDtcItemDtcDtos.length > 1 ? 's' : ''
                        }}
                      </span>
                      <el-image
                        v-else
                        :src="NormalStatusIcon"
                        class="h-12 w-12"
                        fit="cover"
                      />
                    </el-col>
                  </el-row>
                  <el-row
                    v-if="index !== transmissionItemList.length - 1"
                    class="no-p"
                  >
                    <el-col :span="2" />
                    <el-col :xs="0" :sm="6" />
                    <el-col :xs="22" :sm="16"><el-divider /></el-col>
                  </el-row>

                  <!-- DTC 数量 -->
                  <template
                    v-if="
                      item.reportDtcItemDtcDtos &&
                      item.reportDtcItemDtcDtos.length > 0
                    "
                  >
                    <el-row
                      class="poppins-10px-regular text-neutrals-off-black py-0! px-0!"
                      :gutter="16"
                    >
                      <el-col :span="2" />
                      <el-col :xs="0" :sm="6" />
                      <el-col :xs="22" :sm="16" class="pl-0!">
                        <el-row
                          :gutter="24"
                          class="rounded-t-8 bg-neutrals-off-white"
                        >
                          <el-col :span="6">DTC</el-col>
                          <el-col :span="18">Description</el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                    <el-row
                      v-for="(dtcDto, index) in item.reportDtcItemDtcDtos"
                      :key="dtcDto.id"
                      :class="[
                        'poppins-10px-regular',
                        'text-neutrals-off-black',
                        'px-0!',
                        index === item.reportDtcItemDtcDtos.length - 1
                          ? 'pt-1!'
                          : 'pt-1! pb-0!',
                      ]"
                      :gutter="16"
                    >
                      <el-col :span="2" />
                      <el-col :xs="0" :sm="6" />
                      <el-col :xs="22" :sm="16" class="pl-0!">
                        <el-row
                          :gutter="24"
                          :class="[
                            'bg-neutrals-off-white',
                            'items-start!',
                            {
                              'rounded-b-8':
                                index === item.reportDtcItemDtcDtos.length - 1,
                            },
                          ]"
                        >
                          <el-col :span="6">
                            <span>
                              {{ dtcDto.faultCode || '-' }}
                            </span>
                          </el-col>
                          <el-col :span="18">
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
                  class="poppins-10px-regular text-neutrals-off-black row-center"
                  :gutter="16"
                >
                  <el-col :span="2" class="flex!">
                    <img
                      :src="BrakesIcon"
                      class="mx-auto h-16 w-16 object-cover"
                    />
                  </el-col>
                  <el-col :xs="18" :sm="6" class="poppins-10px-regular">
                    {{ VehicleEcuCategory.BRAKES }}
                  </el-col>
                  <el-col :xs="0" :sm="12" />
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
                    <el-col :span="2" />
                    <el-col :xs="0" :sm="6" />
                    <el-col
                      :xs="18"
                      :sm="12"
                      class="divider-neutral-grey-4-1px"
                    >
                      {{ item.name }}
                    </el-col>
                    <el-col :span="4" class="divider-neutral-grey-4-1px">
                      <span
                        v-if="
                          item.reportDtcItemDtcDtos &&
                          item.reportDtcItemDtcDtos.length > 0
                        "
                      >
                        {{ item.reportDtcItemDtcDtos.length }} DTC{{
                          item.reportDtcItemDtcDtos.length > 1 ? 's' : ''
                        }}
                      </span>
                      <el-image
                        v-else
                        :src="NormalStatusIcon"
                        class="h-12 w-12"
                        fit="cover"
                      />
                    </el-col>
                  </el-row>
                  <el-row
                    v-if="index !== brakesItemList.length - 1"
                    class="no-p"
                  >
                    <el-col :span="2" />
                    <el-col :xs="0" :sm="6" />
                    <el-col :xs="22" :sm="16"><el-divider /></el-col>
                  </el-row>

                  <!-- DTC 数量 -->
                  <template
                    v-if="
                      item.reportDtcItemDtcDtos &&
                      item.reportDtcItemDtcDtos.length > 0
                    "
                  >
                    <el-row
                      class="poppins-10px-regular text-neutrals-off-black py-0! px-0!"
                      :gutter="16"
                    >
                      <el-col :span="2" />
                      <el-col :xs="0" :sm="6" />
                      <el-col :xs="22" :sm="16" class="pl-0!">
                        <el-row
                          :gutter="24"
                          class="rounded-t-8 bg-neutrals-off-white"
                        >
                          <el-col :span="6">DTC</el-col>
                          <el-col :span="18">Description</el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                    <el-row
                      v-for="(dtcDto, index) in item.reportDtcItemDtcDtos"
                      :key="dtcDto.id"
                      :class="[
                        'poppins-10px-regular',
                        'text-neutrals-off-black',
                        'px-0!',
                        index === item.reportDtcItemDtcDtos.length - 1
                          ? 'pt-1!'
                          : 'pt-1! pb-0!',
                      ]"
                      :gutter="16"
                    >
                      <el-col :span="2" />
                      <el-col :xs="0" :sm="6" />
                      <el-col :xs="22" :sm="16" class="pl-0!">
                        <el-row
                          :gutter="24"
                          :class="[
                            'bg-neutrals-off-white',
                            'items-start!',
                            {
                              'rounded-b-8':
                                index === item.reportDtcItemDtcDtos.length - 1,
                            },
                          ]"
                        >
                          <el-col :span="6">
                            <span>
                              {{ dtcDto.faultCode || '-' }}
                            </span>
                          </el-col>
                          <el-col :span="18">
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
                  class="poppins-10px-regular text-neutrals-off-black row-center"
                  :gutter="16"
                >
                  <el-col :span="2" class="flex!">
                    <img
                      :src="ElectricalIcon"
                      class="mx-auto h-16 w-16 object-cover"
                    />
                  </el-col>
                  <el-col :xs="18" :sm="6" class="poppins-10px-regular">
                    {{ VehicleEcuCategory.ELECTRICAL }}
                  </el-col>
                  <el-col :xs="0" :sm="12" />
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
                    <el-col :span="2" />
                    <el-col :xs="0" :sm="6" />
                    <el-col
                      :xs="18"
                      :sm="12"
                      class="divider-neutral-grey-4-1px"
                    >
                      {{ item.name }}
                    </el-col>
                    <el-col :span="4" class="divider-neutral-grey-4-1px">
                      <span
                        v-if="
                          item.reportDtcItemDtcDtos &&
                          item.reportDtcItemDtcDtos.length > 0
                        "
                      >
                        {{ item.reportDtcItemDtcDtos.length }} DTC{{
                          item.reportDtcItemDtcDtos.length > 1 ? 's' : ''
                        }}
                      </span>
                      <el-image
                        v-else
                        :src="NormalStatusIcon"
                        class="h-12 w-12"
                        fit="cover"
                      />
                    </el-col>
                  </el-row>
                  <el-row
                    v-if="index !== electricalItemList.length - 1"
                    class="no-p"
                  >
                    <el-col :span="2" />
                    <el-col :xs="0" :sm="6" />
                    <el-col :xs="22" :sm="16"><el-divider /></el-col>
                  </el-row>

                  <!-- DTC 数量 -->
                  <template
                    v-if="
                      item.reportDtcItemDtcDtos &&
                      item.reportDtcItemDtcDtos.length > 0
                    "
                  >
                    <el-row
                      class="poppins-10px-regular text-neutrals-off-black py-0! px-0!"
                      :gutter="16"
                    >
                      <el-col :span="2" />
                      <el-col :xs="0" :sm="6" />
                      <el-col :xs="22" :sm="16" class="pl-0!">
                        <el-row
                          :gutter="24"
                          class="rounded-t-8 bg-neutrals-off-white"
                        >
                          <el-col :span="6">DTC</el-col>
                          <el-col :span="18">Description</el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                    <el-row
                      v-for="(dtcDto, index) in item.reportDtcItemDtcDtos"
                      :key="dtcDto.id"
                      :class="[
                        'poppins-10px-regular',
                        'text-neutrals-off-black',
                        'px-0!',
                        index === item.reportDtcItemDtcDtos.length - 1
                          ? 'pt-1!'
                          : 'pt-1! pb-0!',
                      ]"
                      :gutter="16"
                    >
                      <el-col :span="2" />
                      <el-col :xs="0" :sm="6" />
                      <el-col :xs="22" :sm="16" class="pl-0!">
                        <el-row
                          :gutter="24"
                          :class="[
                            'bg-neutrals-off-white',
                            'items-start!',
                            {
                              'rounded-b-8':
                                index === item.reportDtcItemDtcDtos.length - 1,
                            },
                          ]"
                        >
                          <el-col :span="6">
                            <span>
                              {{ dtcDto.faultCode || '-' }}
                            </span>
                          </el-col>
                          <el-col :span="18">
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
                  class="poppins-10px-regular text-neutrals-off-black row-center"
                  :gutter="16"
                >
                  <el-col :span="2" class="flex!">
                    <img
                      :src="ChassisIcon"
                      class="mx-auto h-16 w-16 object-cover"
                    />
                  </el-col>
                  <el-col :xs="18" :sm="6" class="poppins-10px-regular">
                    {{ VehicleEcuCategory.CHASSIS }}
                  </el-col>
                  <el-col :xs="0" :sm="12" />
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
                    <el-col :span="2" />
                    <el-col :xs="0" :sm="6" />
                    <el-col
                      :xs="18"
                      :sm="12"
                      class="divider-neutral-grey-4-1px"
                    >
                      {{ item.name }}
                    </el-col>
                    <el-col :span="4" class="divider-neutral-grey-4-1px">
                      <span
                        v-if="
                          item.reportDtcItemDtcDtos &&
                          item.reportDtcItemDtcDtos.length > 0
                        "
                      >
                        {{ item.reportDtcItemDtcDtos.length }} DTC{{
                          item.reportDtcItemDtcDtos.length > 1 ? 's' : ''
                        }}
                      </span>
                      <el-image
                        v-else
                        :src="NormalStatusIcon"
                        class="h-12 w-12"
                        fit="cover"
                      />
                    </el-col>
                  </el-row>
                  <el-row
                    v-if="index !== chassisItemList.length - 1"
                    class="no-p"
                  >
                    <el-col :span="2" />
                    <el-col :xs="0" :sm="6" />
                    <el-col :xs="22" :sm="16"><el-divider /></el-col>
                  </el-row>

                  <!-- DTC 数量 -->
                  <template
                    v-if="
                      item.reportDtcItemDtcDtos &&
                      item.reportDtcItemDtcDtos.length > 0
                    "
                  >
                    <el-row
                      class="poppins-10px-regular text-neutrals-off-black py-0! px-0!"
                      :gutter="16"
                    >
                      <el-col :span="2" />
                      <el-col :xs="0" :sm="6" />
                      <el-col :xs="22" :sm="16" class="pl-0!">
                        <el-row
                          :gutter="24"
                          class="rounded-t-8 bg-neutrals-off-white"
                        >
                          <el-col :span="6">DTC</el-col>
                          <el-col :span="18">Description</el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                    <el-row
                      v-for="(dtcDto, index) in item.reportDtcItemDtcDtos"
                      :key="dtcDto.id"
                      :class="[
                        'poppins-10px-regular',
                        'text-neutrals-off-black',
                        'px-0!',
                        index === item.reportDtcItemDtcDtos.length - 1
                          ? 'pt-1!'
                          : 'pt-1! pb-0!',
                      ]"
                      :gutter="16"
                    >
                      <el-col :span="2" />
                      <el-col :xs="0" :sm="6" />
                      <el-col :xs="22" :sm="16" class="pl-0!">
                        <el-row
                          :gutter="24"
                          :class="[
                            'bg-neutrals-off-white',
                            'items-start!',
                            {
                              'rounded-b-8':
                                index === item.reportDtcItemDtcDtos.length - 1,
                            },
                          ]"
                        >
                          <el-col :span="6">
                            <span>
                              {{ dtcDto.faultCode || '-' }}
                            </span>
                          </el-col>
                          <el-col :span="18">
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
                  class="poppins-10px-regular text-neutrals-off-black row-center"
                  :gutter="16"
                >
                  <el-col :span="2" class="flex!">
                    <img
                      :src="BodyAndTrimIcon"
                      class="mx-auto h-16 w-16 object-cover"
                    />
                  </el-col>
                  <el-col :xs="18" :sm="6" class="poppins-10px-regular">
                    {{ VehicleEcuCategory.BODY_AND_TRIM }}
                  </el-col>
                  <el-col :xs="0" :sm="12" />
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
                <div
                  v-for="(item, index) in bodyAndTrimItemList"
                  :key="item.id"
                >
                  <el-row
                    class="poppins-10px-regular text-neutrals-off-black"
                    :gutter="16"
                  >
                    <el-col :span="2" />
                    <el-col :xs="0" :sm="6" />
                    <el-col
                      :xs="18"
                      :sm="12"
                      class="divider-neutral-grey-4-1px"
                    >
                      {{ item.name }}
                    </el-col>
                    <el-col :span="4" class="divider-neutral-grey-4-1px">
                      <span
                        v-if="
                          item.reportDtcItemDtcDtos &&
                          item.reportDtcItemDtcDtos.length > 0
                        "
                      >
                        {{ item.reportDtcItemDtcDtos.length }} DTC{{
                          item.reportDtcItemDtcDtos.length > 1 ? 's' : ''
                        }}
                      </span>
                      <el-image
                        v-else
                        :src="NormalStatusIcon"
                        class="h-12 w-12"
                        fit="cover"
                      />
                    </el-col>
                  </el-row>
                  <el-row
                    v-if="index !== bodyAndTrimItemList.length - 1"
                    class="no-p"
                  >
                    <el-col :span="2" />
                    <el-col :xs="0" :sm="6" />
                    <el-col :xs="22" :sm="16"><el-divider /></el-col>
                  </el-row>

                  <!-- DTC 数量 -->
                  <template
                    v-if="
                      item.reportDtcItemDtcDtos &&
                      item.reportDtcItemDtcDtos.length > 0
                    "
                  >
                    <el-row
                      class="poppins-10px-regular text-neutrals-off-black py-0! px-0!"
                      :gutter="16"
                    >
                      <el-col :span="2" />
                      <el-col :xs="0" :sm="6" />
                      <el-col :xs="22" :sm="16" class="pl-0!">
                        <el-row
                          :gutter="24"
                          class="rounded-t-8 bg-neutrals-off-white"
                        >
                          <el-col :span="6">DTC</el-col>
                          <el-col :span="18">Description</el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                    <el-row
                      v-for="(dtcDto, index) in item.reportDtcItemDtcDtos"
                      :key="dtcDto.id"
                      :class="[
                        'poppins-10px-regular',
                        'text-neutrals-off-black',
                        'px-0!',
                        index === item.reportDtcItemDtcDtos.length - 1
                          ? 'pt-1!'
                          : 'pt-1! pb-0!',
                      ]"
                      :gutter="16"
                    >
                      <el-col :span="2" />
                      <el-col :xs="0" :sm="6" />
                      <el-col :xs="22" :sm="16" class="pl-0!">
                        <el-row
                          :gutter="24"
                          :class="[
                            'bg-neutrals-off-white',
                            'items-start!',
                            {
                              'rounded-b-8':
                                index === item.reportDtcItemDtcDtos.length - 1,
                            },
                          ]"
                        >
                          <el-col :span="6">
                            <span>
                              {{ dtcDto.faultCode || '-' }}
                            </span>
                          </el-col>
                          <el-col :span="18">
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
                  class="poppins-10px-regular text-neutrals-off-black row-center"
                  :gutter="16"
                >
                  <el-col :span="2" class="flex!">
                    <img
                      :src="OthersIcon"
                      class="mx-auto h-16 w-16 object-cover"
                    />
                  </el-col>
                  <el-col :xs="18" :sm="6" class="poppins-10px-regular">
                    {{ VehicleEcuCategory.OTHERS }}
                  </el-col>
                  <el-col :xs="0" :sm="12" />
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
                    <el-col :span="2" />
                    <el-col :xs="0" :sm="6" />
                    <el-col
                      :xs="18"
                      :sm="12"
                      class="divider-neutral-grey-4-1px"
                    >
                      {{ item.name }}
                    </el-col>
                    <el-col :span="4" class="divider-neutral-grey-4-1px">
                      <span
                        v-if="
                          item.reportDtcItemDtcDtos &&
                          item.reportDtcItemDtcDtos.length > 0
                        "
                      >
                        {{ item.reportDtcItemDtcDtos.length }} DTC{{
                          item.reportDtcItemDtcDtos.length > 1 ? 's' : ''
                        }}
                      </span>
                      <el-image
                        v-else
                        :src="NormalStatusIcon"
                        class="h-12 w-12"
                        fit="cover"
                      />
                    </el-col>
                  </el-row>
                  <el-row
                    v-if="index !== otherItemList.length - 1"
                    class="no-p"
                  >
                    <el-col :span="2" />
                    <el-col :xs="0" :sm="6" />
                    <el-col :xs="22" :sm="16"><el-divider /></el-col>
                  </el-row>

                  <!-- DTC 数量 -->
                  <template
                    v-if="
                      item.reportDtcItemDtcDtos &&
                      item.reportDtcItemDtcDtos.length > 0
                    "
                  >
                    <el-row
                      class="poppins-10px-regular text-neutrals-off-black py-0! px-0!"
                      :gutter="16"
                    >
                      <el-col :span="2" />
                      <el-col :xs="0" :sm="6" />
                      <el-col :xs="22" :sm="16" class="pl-0!">
                        <el-row
                          :gutter="24"
                          class="rounded-t-8 bg-neutrals-off-white"
                        >
                          <el-col :span="6" class="pr-8!">DTC</el-col>
                          <el-col :span="18">Description</el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                    <el-row
                      v-for="(dtcDto, index) in item.reportDtcItemDtcDtos"
                      :key="dtcDto.id"
                      :class="[
                        'poppins-10px-regular',
                        'text-neutrals-off-black',
                        'px-0!',
                        index === item.reportDtcItemDtcDtos.length - 1
                          ? 'pt-1!'
                          : 'pt-1! pb-0!',
                      ]"
                      :gutter="16"
                    >
                      <el-col :span="2" />
                      <el-col :xs="0" :sm="6" />
                      <el-col :xs="22" :sm="16" class="pl-0!">
                        <el-row
                          :gutter="24"
                          :class="[
                            'bg-neutrals-off-white',
                            'items-start!',
                            {
                              'rounded-b-8':
                                index === item.reportDtcItemDtcDtos.length - 1,
                            },
                          ]"
                        >
                          <el-col :span="6">
                            <span>
                              {{ dtcDto.faultCode || '-' }}
                            </span>
                          </el-col>
                          <el-col :span="18">
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
          </section>
          <!-- Prediction -->
          <section
            class="section-container"
            v-if="
              vehicleReportInfo.reportPredictionDtos &&
              vehicleReportInfo.reportPredictionDtos.length > 0
            "
          >
            <h3 class="section-header">
              <em class="title">Prediction</em>
            </h3>
            <!-- table -->
            <div>
              <!-- theader -->
              <el-row
                class="bg-neutrals-grey-1 text- rounded-t-8 poppins-10px-semibold text-neutrals-grey-4"
                :gutter="16"
              >
                <el-col :span="3" />
                <el-col :span="15">Category</el-col>
                <el-col :span="6">Condition</el-col>
              </el-row>
              <!-- tbody -->
              <template
                v-for="predictionDto in vehicleReportInfo.reportPredictionDtos"
                :key="predictionDto.id"
              >
                <el-row class="flex items-center" :gutter="16">
                  <el-col :span="3" class="flex!">
                    <el-image
                      :src="
                        getFullFilePath(predictionDto?.predictionsToMGDto?.logo)
                      "
                      fit="cover"
                      class="mx-auto h-16 w-16"
                    >
                      <template #error>
                        <el-image
                          :src="ErrorImg"
                          fit="cover"
                          class="h-16 w-16"
                        />
                      </template>
                    </el-image>
                  </el-col>
                  <el-col
                    :span="15"
                    class="poppins-10px-regular text-neutrals-off-black"
                  >
                    {{ predictionDto.name }}
                  </el-col>
                  <el-col :span="6">
                    <span
                      :class="[
                        'poppins-10px-semibold',
                        {
                          'text-status-colours-red': predictionDto.value <= 0.3,
                          'text-neutrals-off-black':
                            predictionDto.value > 0.3 &&
                            predictionDto.value < 0.8,
                          'text-status-colours-green':
                            predictionDto.value >= 0.8,
                        },
                      ]"
                    >
                      {{ predictionDto.value * 100 }} %
                    </span>
                  </el-col>
                </el-row>
                <el-divider class="divider-neutral-grey-4-1px!" />
              </template>
            </div>
          </section>
          <!-- Expense Records -->
          <section
            class="section-container"
            v-if="
              vehicleReportInfo.reportCategoryDtos &&
              vehicleReportInfo.reportCategoryDtos.length > 0
            "
          >
            <h3 class="section-header">
              <em class="title">Expense Records</em>
            </h3>
            <!-- total cost -->
            <h4 class="text-neutrals-off-black flex items-center gap-8 px-12">
              <span class="poppins-10px-regular">Total Cost (SGD):</span>
              <strong class="poppins-16px-semibold not-italic">
                ${{ getFormatNumberString(totalCost) }}
              </strong>
            </h4>

            <!-- table module -->
            <div class="flex flex-col">
              <!-- title -->
              <h5
                class="border-b-solid poppins-12px-semibold text-neutrals-off-black mb-8 border-b border-b-[#1B1A1E] px-12 pb-4"
              >
                Module
              </h5>
              <!-- theader -->
              <el-row
                class="bg-neutrals-grey-1 rounded-t-8 poppins-10px-semibold text-neutrals-grey-4"
                :gutter="16"
              >
                <el-col :span="3"></el-col>
                <el-col :span="9">Module</el-col>
                <el-col :span="6">Expense</el-col>
                <el-col :span="6">Percentage</el-col>
              </el-row>
              <!-- tbody -->
              <template
                v-for="moduleDto in vehicleReportInfo.reportTypeDtos"
                :key="moduleDto.category"
              >
                <el-row class="flex-center flex" :gutter="16">
                  <el-col :span="3" class="flex!">
                    <img
                      :src="moduleIconMap[moduleDto.type]"
                      class="mx-auto h-16 w-16 object-cover"
                    />
                  </el-col>
                  <el-col
                    :span="9"
                    class="poppins-10px-regular text-neutrals-off-black"
                  >
                    {{ moduleDto.type }}
                  </el-col>
                  <el-col :span="6">
                    <span class="poppins-10px-semibold text-neutrals-off-black">
                      {{
                        moduleDto.amount > 0
                          ? '$' + getFormatNumberString(moduleDto.amount)
                          : '-'
                      }}
                    </span>
                  </el-col>
                  <el-col :span="6">
                    <span class="poppins-10px-semibold text-neutrals-off-black">
                      {{
                        moduleDto.percentage > 0
                          ? roundToInt(
                              Big(moduleDto.percentage).times(100).toNumber(),
                            ) + ' %'
                          : '-'
                      }}
                    </span>
                  </el-col>
                </el-row>
                <el-divider class="divider-neutral-grey-4-1px!" />
              </template>
            </div>
            <!-- table category -->
            <div class="flex flex-col">
              <!-- title -->
              <h5
                class="border-b-solid poppins-12px-semibold text-neutrals-off-black mb-8 border-b border-b-[#1B1A1E] px-12 pb-4"
              >
                Category
              </h5>
              <!-- theader -->
              <el-row
                class="bg-neutrals-grey-1 rounded-t-8 poppins-10px-semibold text-neutrals-grey-4"
                :gutter="16"
              >
                <el-col :span="3"></el-col>
                <el-col :span="9">Category</el-col>
                <el-col :span="6">Expense</el-col>
                <el-col :span="6">Percentage</el-col>
              </el-row>
              <!-- tbody -->
              <template
                v-for="categoryDto in vehicleReportInfo.reportCategoryDtos"
                :key="categoryDto.category"
              >
                <el-row class="flex-center flex" :gutter="16">
                  <el-col :span="3" class="flex!">
                    <el-image
                      :src="categoryIconMap[categoryDto.category]"
                      fit="cover"
                      class="mx-auto h-16 w-16"
                    />
                  </el-col>
                  <el-col
                    :span="9"
                    class="poppins-10px-regular text-neutrals-off-black"
                  >
                    {{ categoryDto.category }}
                  </el-col>
                  <el-col :span="6">
                    <span class="poppins-10px-semibold text-neutrals-off-black">
                      {{
                        categoryDto.amount > 0
                          ? '$' + getFormatNumberString(categoryDto.amount)
                          : '-'
                      }}
                    </span>
                  </el-col>
                  <el-col :span="6">
                    <span class="poppins-10px-semibold text-neutrals-off-black">
                      {{
                        categoryDto.percentage > 0
                          ? roundToInt(
                              Big(categoryDto.percentage).times(100).toNumber(),
                            ) + ' %'
                          : '-'
                      }}
                    </span>
                  </el-col>
                </el-row>
                <el-divider class="divider-neutral-grey-4-1px!" />
              </template>
            </div>
            <!-- modules records -->
            <div
              class="flex flex-col gap-8"
              v-if="vehicleReportInfo.reportExpenseDtos.length"
            >
              <!-- title -->
              <h5
                class="border-b-solid poppins-12px-semibold text-neutrals-off-black border-b border-b-[#1B1A1E] px-12 pb-4"
              >
                Records&nbsp;({{ vehicleReportInfo.reportExpenseDtos.length }})
              </h5>
              <!-- record -->
              <div
                v-for="expenseDto in vehicleReportInfo.reportExpenseDtos"
                :key="expenseDto.id"
                class="flex flex-col"
              >
                <!-- record date -->
                <div
                  class="poppins-10px-regular flex items-center gap-12 px-12 py-8"
                >
                  <p class="min-w-72">
                    {{ getDateWithDDMMMYYYY(expenseDto.date) }}
                  </p>
                  <div class="flex items-center gap-8">
                    <!-- 修理厂logo -->
                    <el-avatar
                      v-if="expenseDto.logo"
                      :src="getFullFilePath(expenseDto.logo)"
                      fit="cover"
                      :size="16"
                      @error="avatarErrorHandler"
                    />
                    <el-image
                      v-else
                      :src="RepairShopIcon"
                      class="h-16 w-16"
                      fit="cover"
                      alt="repair shop logo"
                    />
                    <span>{{ expenseDto.name || '-' }}</span>
                  </div>
                </div>
                <!-- thead -->
                <el-row
                  class="bg-neutrals-grey-1 rounded-t-8 poppins-10px-semibold text-neutrals-grey-4"
                  :gutter="12"
                >
                  <el-col :span="10">Item</el-col>
                  <el-col :span="6">Unit Price</el-col>
                  <el-col :span="2">Qty</el-col>
                  <el-col :span="6">Amount</el-col>
                </el-row>
                <!-- tbody -->
                <template
                  v-if="
                    expenseDto.reportExpenseItemDtos &&
                    expenseDto.reportExpenseItemDtos.length > 0
                  "
                  v-for="expenseItemDto in expenseDto.reportExpenseItemDtos"
                  :key="expenseItemDto.id"
                >
                  <el-row
                    class="poppins-10px-regular flex items-center"
                    :gutter="12"
                  >
                    <el-col :span="10" class="flex! flex-col gap-2">
                      <span
                        class="poppins-10px-regular text-neutrals-off-black"
                      >
                        {{ expenseItemDto.name }}
                      </span>
                      <span class="poppins-10px-regular text-neutrals-grey-4">
                        {{ expenseItemDto.category || 'Uncategorized' }}
                      </span>
                    </el-col>
                    <el-col :span="6">
                      {{
                        expenseItemDto.unitPrice !== 0
                          ? `$${getFormatNumberString(expenseItemDto.unitPrice)}`
                          : '-'
                      }}
                    </el-col>
                    <el-col :span="2">
                      {{ expenseItemDto.quantity || '-' }}
                    </el-col>
                    <el-col :span="6">
                      ${{ getFormatNumberString(expenseItemDto.amount) }}
                    </el-col>
                  </el-row>
                  <el-row
                    class="poppins-10px-regular p-0! p-lr-12 mb-8 flex items-center"
                    :gutter="12"
                    v-if="expenseItemDto.description"
                  >
                    <el-col
                      :span="24"
                      class="bg-neutrals-off-white text-neutrals-grey-4 rounded-8 py-4"
                    >
                      {{ expenseItemDto.description }}
                    </el-col>
                  </el-row>
                  <el-divider class="divider-neutral-grey-4-1px!" />
                </template>
                <!-- 账单小计 -->
                <el-row
                  class="rounded-b-8 poppins-10px-semibold text-neutrals-grey-4"
                  :gutter="12"
                  v-if="expenseDto.gst === '0' && expenseDto.discount === '0'"
                >
                  <el-col :span="10"></el-col>
                  <el-col :span="6" class="flex! flex-end">
                    <span class="poppins-10px-regular text-neutrals-grey-4">
                      Subtotal
                    </span>
                  </el-col>
                  <el-col :span="2"></el-col>
                  <el-col :span="6">
                    <span class="poppins-10px-regular text-neutrals-off-black">
                      {{
                        (expenseDto.reportExpenseItemDtos.reduce(
                          (sum, item) => Big(sum).plus(Number(item.amount)),
                          0,
                        ) || 0) === 0
                          ? '-'
                          : '$' +
                            getFormatNumberString(
                              expenseDto.reportExpenseItemDtos.reduce(
                                (sum, item) =>
                                  Big(sum).plus(Number(item.amount)),
                                0,
                              ),
                            )
                      }}
                    </span>
                  </el-col>
                </el-row>
                <el-row
                  class="rounded-b-8 poppins-10px-semibold text-neutrals-grey-4 no-pt"
                  :gutter="12"
                  v-if="expenseDto.gst === '0'"
                >
                  <el-col :span="10"></el-col>
                  <el-col :span="6" class="flex! flex-end">
                    <span class="poppins-10px-regular text-neutrals-grey-4">
                      Tax
                    </span>
                  </el-col>
                  <el-col :span="2"></el-col>
                  <el-col :span="6">
                    <span class="poppins-10px-regular text-neutrals-off-black">
                      {{
                        expenseDto.gst !== '0'
                          ? `$${getFormatNumberString(expenseDto.gst)}`
                          : '-'
                      }}
                    </span>
                  </el-col>
                </el-row>
                <el-row
                  class="rounded-b-8 poppins-10px-semibold text-neutrals-grey-4 no-pt"
                  :gutter="12"
                  v-if="expenseDto.discount === '0'"
                >
                  <el-col :span="10"></el-col>
                  <el-col :span="6" class="flex! flex-end">
                    <span class="poppins-10px-regular text-neutrals-grey-4">
                      Discount
                    </span>
                  </el-col>
                  <el-col :span="2"></el-col>
                  <el-col :span="6">
                    <span class="poppins-10px-regular text-neutrals-off-black">
                      {{
                        expenseDto.discount !== '0'
                          ? `$${getFormatNumberString(expenseDto.discount)}`
                          : '-'
                      }}
                    </span>
                  </el-col>
                </el-row>
                <el-row
                  class="p-0! rounded-b-8 poppins-10px-semibold text-neutrals-grey-4"
                  :gutter="12"
                  v-if="expenseDto.gst === '0' && expenseDto.discount === '0'"
                >
                  <el-col :span="10"></el-col>
                  <el-col :span="14">
                    <el-divider class="divider-neutral-grey-4-1px!" />
                  </el-col>
                </el-row>
                <el-row
                  class="rounded-b-8 poppins-10px-semibold text-neutrals-grey-4"
                  :gutter="12"
                >
                  <el-col :span="10"></el-col>
                  <el-col :span="6" class="flex! flex-end">
                    <span class="poppins-12px-regular text-neutrals-off-black">
                      Total Cost
                    </span>
                  </el-col>
                  <el-col :span="2"></el-col>
                  <el-col :span="6">
                    <span class="poppins-12px-semibold text-neutrals-off-black">
                      {{
                        expenseDto.amount !== '0'
                          ? `$${getFormatNumberString(expenseDto.amount)}`
                          : '-'
                      }}
                    </span>
                  </el-col>
                </el-row>
                <el-divider class="divider-neutral-grey-4-4px!" />
              </div>
            </div>
          </section>
        </div>
      </article>
      <!-- 导出 PDF 按钮 -->
      <el-button
        type="primary"
        class="button-style"
        @click="generatePdf"
        :loading="isGeneratingPdf"
        v-if="$route.query.type !== 'print'"
      >
        Download PDF
      </el-button>
    </main>
  </div>
</template>

<style scoped lang="scss">
// 重置 label 样式
label {
  @apply text-neutrals-grey-4 poppins-10px-regular;
}

// 重置 el-text 样式
:deep(.el-text) {
  @apply text-neutrals-off-black poppins-10px-regular;
}

.section-container {
  @apply flex flex-col gap-16;

  .section-header {
    @apply bg-branding-light-blue rounded-8 row-center leading-18 px-12 py-8;

    .title {
      @apply text-neutrals-off-black poppins-12px-semibold h-18 not-italic;
    }
  }
}

.report-container :deep(.el-row) {
  @apply m-0! row-center px-12 py-8;

  &.md-model {
    @apply pl-17!;
  }

  &.no-p {
    @apply p-0!;
  }

  &.p-lr-12 {
    & > .el-col:first-child {
      @apply pl-12!;
    }

    & > .el-col:last-child {
      @apply pr-12!;
    }
  }

  &.mb-8 {
    @apply mb-8!;
  }

  &.no-pt {
    @apply pt-0!;
  }

  & > .el-col:first-child {
    @apply pl-0!;
  }

  & > .el-col:last-child {
    @apply pr-0!;
  }
}
// 重置i标签样式, 做图标使用
i {
  @apply text-neutrals-white poppins-10px-regular rounded-full px-6 py-2;
}

.report-container :deep(.el-divider--horizontal) {
  border-top: 1px solid #eaeef4;
}

// 按钮样式
.button-style {
  @apply bg-branding-colours-primary shadow-default text-neutrals-off-white h-48! bottom-42 px-32! py-16! rounded-12! text-16! font-400! fixed inset-x-0 mx-auto inline-flex w-fit cursor-pointer border-none;
}

// 屏幕宽度大于 768px 时，修改字体大小
@media (min-width: 768px) {
  .poppins-28px-semibold {
    @apply text-30! print:text-28;
  }

  .poppins-20px-semibold {
    @apply text-22! print:text-20;
  }

  .poppins-12px-regular {
    @apply text-14! print:text-12;
  }

  .poppins-12px-medium {
    @apply text-14! print:text-12;
  }

  .poppins-12px-semibold {
    @apply text-14! print:text-12;
  }

  .poppins-10px-regular {
    @apply text-12! print:text-10;
  }

  .poppins-10px-medium {
    @apply text-12! print:text-10;
  }

  .poppins-10px-semibold {
    @apply text-12! print:text-10;
  }

  .text-10px-regular {
    @apply text-12 print:text-10;
  }

  .hanno-20px-regular {
    @apply text-22 print:text-20;
  }
}

// 打印样式
@media print {
  .poppins-28px-semibold {
    @apply text-28;
  }

  .poppins-20px-semibold {
    @apply text-20;
  }

  .poppins-12px-regular {
    @apply text-12;
  }

  .poppins-12px-medium {
    @apply text-12;
  }

  .poppins-12px-semibold {
    @apply text-12;
  }

  .poppins-10px-regular {
    @apply text-10;
  }

  .poppins-10px-medium {
    @apply text-10;
  }

  .poppins-10px-semibold {
    @apply text-10;
  }

  .text-10px-regular {
    @apply text-10;
  }

  .hanno-20px-regular {
    @apply text-20;
  }
}
</style>
