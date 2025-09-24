<script setup>
import { useRoute } from 'vue-router'

import {
  getImgUrlToBase64,
  getVehicleReportInfoApi,
  getPdfApi,
} from '@/apis/shareApi.js'
import {
  getDateWithDDMMMYYYY,
  getGeneratedDateWithDDMMMYYYYhhmma,
} from '@/utils/dateUtil.js'
import { getFormatNumber, getFullFilePath } from '@/utils/dataFormattedUtil.js'
import { VehicleEcuCategory } from '@/utils/constantsUtil.js'

import DefaultCardImg from '@/assets/specialIcons/default-car-img.svg'
import RepairIcon from '@/assets/icons/fi_tool.svg'
import MaintenanceIcon from '@/assets/icons/fi_file-minus.svg'
import FuelIcon from '@/assets/icons/fuel-level.svg'
import ModificationIcon from '@/assets/icons/modification.svg'
import EngineIcon from '@/assets/icons/engine-load.svg'
import TransmissionIcon from '@/assets/icons/tranmission.svg'
import BrakesIcon from '@/assets/icons/brakes.svg'
import ElectricalIcon from '@/assets/icons/electronic-central-electric.svg'
import ChassisIcon from '@/assets/icons/chassis.svg'
import BodyAndTrimIcon from '@/assets/icons/services-icon.svg'
import OthersIcon from '@/assets/icons/others-icon.svg'
import BaseSvgIcon from '@/components/BaseSvgIcon.vue'
import RepairShopIcon from '@/assets/icons/Repair Shop.svg'

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
})

// 生成 pdf
const generatePdf = async () => {
  try {
    isGeneratingPdf.value = true
    showExportButton.value = false
    const { data } = await getPdfApi({
      id: vehicleReportInfo.id,
      url: window.location.href,
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
  <div class="report-container flex flex-col px-40 py-32" v-loading="isLoading">
    <header class="flex flex-col gap-4">
      <h1 class="poppins-28px-semibold text-neutrals-off-black">
        Vehicle Report
      </h1>
      <h2 class="poppins-12px-medium text-neutrals-grey-4">
        {{ getGeneratedDateWithDDMMMYYYYhhmma(vehicleReportInfo.createTime) }}
      </h2>
    </header>
    <main class="relative">
      <!-- 报告 -->
      <article>
        <!-- 车辆信息 -->
        <section class="my-16 flex items-center gap-32">
          <el-image
            :src="getFullFilePath(vehicleReportInfo.vehicleDto?.cover)"
            alt="user vehicle image"
            class="w-200 rounded-16"
            fit="cover"
          >
            <template #error>
              <!-- 车辆图片加载失败的默认 -->
              <el-image
                :src="DefaultCardImg"
                alt="user vehicle image"
                class="w-200"
                fit="cover"
              />
            </template>
          </el-image>
          <div class="flex flex-1 flex-col gap-8">
            <h2>
              <em
                class="poppins-20px-semibold text-neutrals-blue h-30 row-center not-italic"
              >
                {{
                  `${vehicleReportInfo.brand} ${vehicleReportInfo.model} ${vehicleReportInfo.year}` ||
                  '-'
                }}
              </em>
            </h2>
            <ul
              class="[&>li]:h-15 flex flex-col gap-4 [&>li]:flex [&>li]:gap-8"
            >
              <li class="flex items-center">
                <label class="poppins-10px-regular flex-[1_1_92px]">VIN</label>
                <el-text
                  class="poppins-10px-regular text-truncate flex-[1_1_189px]"
                >
                  {{ vehicleReportInfo.vin || '-' }}
                </el-text>
              </li>
              <li class="flex items-center">
                <label class="poppins-10px-regular flex-[1_1_92px]">
                  License Plate
                </label>
                <el-text
                  class="poppins-10px-regular text-truncate flex-[1_1_189px]"
                >
                  {{ vehicleReportInfo.licensePlate || '-' }}
                </el-text>
              </li>
              <li class="flex items-center">
                <label class="poppins-10px-regular flex-[1_1_92px]">
                  Mileage
                </label>
                <el-text
                  class="poppins-10px-regular text-truncate flex-[1_1_189px]"
                >
                  {{ getFormatNumber(vehicleReportInfo.mileage) || '-' }} km
                </el-text>
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
            <h2 class="flex flex-col gap-4">
              <em class="hanno-20px-regular h-24 not-italic">
                {{ vehicleReportInfo.modificationCount }}
              </em>
              <span class="text-10px-regular">out of 10</span>
            </h2>
            <!-- 分割线 -->
            <el-divider direction="vertical" class="bg-neutrals-grey-4!" />
            <!-- 车辆评分等级 -->
            <div class="flex flex-1 flex-col gap-8">
              <span class="roboto-12px-semibold h-14">Evaluation Level</span>
              <p class="text-neutrals-grey-2 text-10px-regular">
                {{ vehicleReportInfo.explain || '-' }}
              </p>
            </div>
          </section>
          <!-- 总览 -->
          <section class="section-container">
            <h3 class="section-header">
              <em class="title h-18">Overview</em>
            </h3>
            <!-- Issues -->
            <div class="flex flex-col gap-8">
              <h4 class="ml-8">
                <span class="poppins-10px-medium h-14">Issues</span>
              </h4>
              <div class="flex gap-8">
                <div
                  class="bg-neutrals-off-white rounded-8 text-truncate flex flex-1 flex-col items-center gap-8 p-12"
                >
                  <base-svg-icon
                    name="prediction-icon"
                    size="24px"
                    :color="
                      vehicleReportInfo.faultCodeCount > 0
                        ? '#EF3C30'
                        : '#6F7788'
                    "
                  ></base-svg-icon>
                  <p
                    :class="[
                      'poppins-10px-semibold',
                      vehicleReportInfo.faultCodeCount > 0
                        ? 'text-status-colours-red'
                        : 'text-neutrals-off-black',
                    ]"
                  >
                    {{
                      `${vehicleReportInfo.reportPredictionDtos?.length} Prediction`
                    }}
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
              <h4 class="ml-8">
                <span class="poppins-10px-medium">Expense Records</span>
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
                  <p class="poppins-10px-semibold h-15 text-truncate w-full">
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
                  <p class="poppins-10px-semibold h-15 text-truncate w-full">
                    {{ vehicleReportInfo.maintenanceCount ?? '-' }}
                    Maintenance
                  </p>
                </div>
                <!-- Fuel -->
                <div
                  class="bg-neutrals-off-white rounded-8 text-truncate box-border flex flex-1 flex-col items-center gap-8 p-12"
                >
                  <base-svg-icon
                    name="fuel-level"
                    size="24px"
                    color="#6F7788"
                  ></base-svg-icon>
                  <p class="poppins-10px-semibold text-truncate h-15 w-full">
                    {{ vehicleReportInfo.fuelCount ?? '-' }} Fuel
                  </p>
                </div>
                <!-- Services -->
                <div
                  class="bg-neutrals-off-white text-truncate rounded-8 box-border flex flex-1 flex-col items-center gap-8 whitespace-nowrap p-12"
                >
                  <base-svg-icon
                    name="services-icon"
                    size="24px"
                    color="#6F7788"
                  ></base-svg-icon>
                  <p class="poppins-10px-semibold h-15 text-truncate w-full">
                    {{ vehicleReportInfo.seiviceCount ?? '-' }} Services
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
                  <p class="poppins-10px-semibold h-15 text-truncate w-full">
                    {{ vehicleReportInfo.modificationCount ?? '-' }}
                    Modification
                  </p>
                </div>
              </div>
            </div>
          </section>
          <!-- Vehicle Information -->
          <section class="section-container">
            <h3 class="section-header">
              <em class="title">Vehicle Information</em>
            </h3>
            <ul
              class="[&_label]:w-100 [&>li]:h-15 grid grid-cols-2 gap-8 [&>li]:flex [&>li]:gap-8"
            >
              <li>
                <label>Vehicle Type</label>
                <el-text class="text-truncate">
                  {{ vehicleReportInfo.vehicleDto?.vehicleType || '-' }}
                </el-text>
              </li>
              <li>
                <label>Primary Colour</label>
                <el-text class="text-truncate">
                  {{ vehicleReportInfo.vehicleDto?.primaryColour || '-' }}
                </el-text>
              </li>
              <li>
                <label>Manufacturing Year</label>
                <el-text class="text-truncate">
                  {{ vehicleReportInfo.vehicleDto?.year || '-' }}
                </el-text>
              </li>
              <li>
                <label>Chassis No.</label>
                <el-text class="text-truncate">
                  {{ vehicleReportInfo.vehicleDto?.vin || '-' }}
                </el-text>
              </li>
              <li>
                <label>Original Reg. Date</label>
                <el-text class="text-truncate">
                  {{
                    getDateWithDDMMMYYYY(
                      vehicleReportInfo.vehicleDto?.createTime,
                    ) || '-'
                  }}
                </el-text>
              </li>
              <li>
                <label>Transfer Count</label>
                <el-text>
                  {{ vehicleReportInfo.vehicleDto?.transferCount || '-' }}
                </el-text>
              </li>
              <li>
                <label>COE Category</label>
                <el-text>
                  {{ vehicleReportInfo.vehicleDto?.coeCategory || '-' }}
                </el-text>
              </li>
              <li>
                <label>Engine Capacity</label>
                <el-text>
                  {{ vehicleReportInfo.vehicleDto?.engineCapacity || '-' }}
                </el-text>
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
            <h3 class="section-header">
              <em class="title">Fault Codes</em>
            </h3>
            <!-- table -->
            <div>
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
                    <el-image :src="EngineIcon" class="h-16 w-16" fit="cover" />
                  </el-col>
                  <el-col :span="6" class="poppins-10px-regular">
                    {{ VehicleEcuCategory.ENGINE }}
                  </el-col>
                  <el-col :span="12"></el-col>
                  <el-col :span="4">
                    <i
                      :class="[
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
                <div v-for="item in engineItemList" :key="item.id">
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
                <el-divider />
              </template>
              <!-- Transmission -->
              <template v-if="transmissionItemList.length > 0">
                <el-row
                  class="poppins-10px-regular text-neutrals-off-black"
                  :gutter="16"
                >
                  <el-col :span="2">
                    <el-image
                      :src="TransmissionIcon"
                      class="h-16 w-16"
                      fit="cover"
                    />
                  </el-col>
                  <el-col :span="6" class="poppins-10px-regular">
                    {{ VehicleEcuCategory.TRANSMISSION }}
                  </el-col>
                  <el-col :span="12"></el-col>
                  <el-col :span="4">
                    <i
                      :class="[
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
                <div v-for="item in transmissionItemList" :key="item.id">
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
                <el-divider />
              </template>
              <!-- Brakes -->
              <template v-if="brakesItemList.length > 0">
                <el-row
                  class="poppins-10px-regular text-neutrals-off-black"
                  :gutter="16"
                >
                  <el-col :span="2">
                    <el-image :src="BrakesIcon" class="h-16 w-16" fit="cover" />
                  </el-col>
                  <el-col :span="6" class="poppins-10px-regular">
                    {{ VehicleEcuCategory.BRAKES }}
                  </el-col>
                  <el-col :span="12"></el-col>
                  <el-col :span="4">
                    <i
                      :class="[
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
                <div v-for="item in brakesItemList" :key="item.id">
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
                <el-divider />
              </template>
              <!-- Electrical -->
              <template v-if="electricalItemList.length > 0">
                <el-row
                  class="poppins-10px-regular text-neutrals-off-black"
                  :gutter="16"
                >
                  <el-col :span="2">
                    <el-image
                      :src="ElectricalIcon"
                      class="h-16 w-16"
                      fit="cover"
                    />
                  </el-col>
                  <el-col :span="6" class="poppins-10px-regular">
                    {{ VehicleEcuCategory.ELECTRICAL }}
                  </el-col>
                  <el-col :span="12"></el-col>
                  <el-col :span="4">
                    <i
                      :class="[
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
                <div v-for="item in electricalItemList" :key="item.id">
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
                <el-divider />
              </template>
              <!-- Chassis -->
              <template v-if="chassisItemList.length > 0">
                <el-row
                  class="poppins-10px-regular text-neutrals-off-black"
                  :gutter="16"
                >
                  <el-col :span="2">
                    <el-image
                      :src="ChassisIcon"
                      class="h-16 w-16"
                      fit="cover"
                    />
                  </el-col>
                  <el-col :span="6" class="poppins-10px-regular">
                    {{ VehicleEcuCategory.CHASSIS }}
                  </el-col>
                  <el-col :span="12"></el-col>
                  <el-col :span="4">
                    <i
                      :class="[
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
                <div v-for="item in chassisItemList" :key="item.id">
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
                <el-divider />
              </template>
              <!-- Body and Trim -->
              <template v-if="bodyAndTrimItemList.length > 0">
                <el-row
                  class="poppins-10px-regular text-neutrals-off-black"
                  :gutter="16"
                >
                  <el-col :span="2">
                    <el-image
                      :src="BodyAndTrimIcon"
                      class="h-16 w-16"
                      fit="cover"
                    />
                  </el-col>
                  <el-col :span="6" class="poppins-10px-regular">
                    {{ VehicleEcuCategory.BODY_AND_TRIM }}
                  </el-col>
                  <el-col :span="12"></el-col>
                  <el-col :span="4">
                    <i
                      :class="[
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
                <div v-for="item in bodyAndTrimItemList" :key="item.id">
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
                <el-divider />
              </template>
              <!-- Others -->
              <template v-if="otherItemList.length > 0">
                <el-row
                  class="poppins-10px-regular text-neutrals-off-black"
                  :gutter="16"
                >
                  <el-col :span="2">
                    <el-image :src="OthersIcon" class="h-16 w-16" fit="cover" />
                  </el-col>
                  <el-col :span="6" class="poppins-10px-regular">
                    {{ VehicleEcuCategory.OTHERS }}
                  </el-col>
                  <el-col :span="12"></el-col>
                  <el-col :span="4">
                    <i
                      :class="[
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
                <div v-for="item in otherItemList" :key="item.id">
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
                <el-divider />
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
                class="bg-neutrals-grey-1 rounded-t-8 poppins-10px-semibold"
                :gutter="16"
              >
                <el-col :span="2"></el-col>
                <el-col :span="11">Category</el-col>
                <el-col :span="11">Condition</el-col>
              </el-row>
              <!-- tbody -->
              <template
                v-for="predictionDto in vehicleReportInfo.reportPredictionDtos"
                :key="predictionDto.id"
              >
                <el-row class="flex items-center" :gutter="16">
                  <el-col :span="2">
                    <el-image
                      :src="
                        getFullFilePath(predictionDto?.predictionsToMGDto?.logo)
                      "
                      fit="cover"
                      class="h-16 w-16"
                    >
                      <template #error>
                        <el-image
                          src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
                          fit="cover"
                          class="h-16 w-16"
                        />
                      </template>
                    </el-image>
                  </el-col>
                  <el-col
                    :span="11"
                    class="poppins-10px-regular text-neutrals-off-black"
                  >
                    {{ predictionDto.name }}
                  </el-col>
                  <el-col :span="11">
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
            <h4 class="text-neutrals-off-black flex items-center gap-8">
              <span class="poppins-10px-regular">Total Cost (SGD):</span>
              <strong class="poppins-16px-semibold not-italic">
                $
                {{
                  vehicleReportInfo.reportCategoryDtos?.reduce(
                    (acc, cur) => acc + parseFloat(cur.amount),
                    0,
                  )
                }}
              </strong>
            </h4>
            <!-- table category -->
            <div class="flex flex-col gap-8">
              <!-- title -->
              <h5
                class="border-b-solid poppins-12px-semibold text-neutrals-off-black border-b border-b-[#1B1A1E] px-12 pb-4"
              >
                Category
              </h5>
              <!-- theader -->
              <el-row
                class="bg-neutrals-grey-1 rounded-t-8 poppins-10px-semibold"
                :gutter="16"
              >
                <el-col :span="3"></el-col>
                <el-col :span="7">Category</el-col>
                <el-col :span="7">Expense (SGD)</el-col>
                <el-col :span="7">Percentage</el-col>
              </el-row>
              <!-- tbody -->
              <template
                v-for="categoryDto in vehicleReportInfo.reportCategoryDtos"
                :key="categoryDto.category"
              >
                <el-row class="flex-center flex" :gutter="16">
                  <el-col :span="3">
                    <el-image
                      :src="categoryIconMap[categoryDto.category]"
                      fit="cover"
                      class="h-16 w-16"
                    />
                  </el-col>
                  <el-col
                    :span="7"
                    class="poppins-10px-regular text-neutrals-off-black"
                  >
                    {{ categoryDto.category }}
                  </el-col>
                  <el-col :span="7">
                    <span class="poppins-10px-semibold text-neutrals-off-black">
                      $ {{ categoryDto.amount }}
                    </span>
                  </el-col>
                  <el-col :span="7">
                    <span class="poppins-10px-semibold text-neutrals-off-black">
                      {{ categoryDto.percentage * 100 }} %
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
                Records({{ vehicleReportInfo.reportExpenseDtos.length }})
              </h5>
              <!-- record -->
              <div
                v-for="expenseDto in vehicleReportInfo.reportExpenseDtos"
                :key="expenseDto.id"
                class="flex flex-col gap-8"
              >
                <!-- record date -->
                <div class="poppins-10px-regular flex items-center gap-12 py-8">
                  <p>05 Feb 2025</p>
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
                      class="h-24 w-24"
                      fit="cover"
                      alt="repair shop logo"
                    />
                    <span>{{ expenseDto.name || '-' }}</span>
                  </div>
                </div>
                <!-- thead -->
                <el-row
                  class="bg-neutrals-grey-1 rounded-t-8 poppins-10px-semibold"
                  :gutter="16"
                >
                  <el-col :span="10">Item</el-col>
                  <el-col :span="7">Quantity</el-col>
                  <el-col :span="7">Amount (SGD)</el-col>
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
                    :gutter="16"
                  >
                    <el-col :span="10" class="flex flex-col">
                      <span>
                        {{ expenseItemDto.name }}
                        <br />
                        {{ expenseItemDto.category || 'Uncategorized' }}
                      </span>
                    </el-col>
                    <el-col :span="7">
                      {{ expenseItemDto.quantity }}
                    </el-col>
                    <el-col :span="7">${{ expenseItemDto.amount }}</el-col>
                  </el-row>
                  <el-divider class="divider-neutral-grey-4-1px!" />
                </template>
              </div>
            </div>
          </section>
        </div>
      </article>
      <!-- 导出 PDF 按钮 -->
      <el-button
        type="primary"
        class="bg-branding-colours-primary shadow-default text-neutrals-off-white bottom-68 fixed inset-x-0 mx-auto inline-flex w-fit cursor-pointer rounded-full border-none px-20 py-10"
        @click="generatePdf"
        :loading="isGeneratingPdf"
        v-if="showExportButton"
      >
        Export as PDF
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
    @apply bg-branding-light-blue rounded-8 px-12 py-8;

    .title {
      @apply text-neutrals-off-black poppins-12px-semibold not-italic;
    }
  }
}

:deep(.el-row) {
  @apply m-0! px-8 py-12;

  & > .el-col:first-child {
    @apply pl-0!;
  }

  & > .el-col:last-child {
    @apply pr-0!;
  }
}

:deep(.el-divider) {
  @apply divider-neutral-grey-4-4px;
}

// 重置i标签样式, 做图标使用
i {
  @apply text-neutrals-white poppins-10px-regular rounded-full px-6 py-2;
}
</style>
