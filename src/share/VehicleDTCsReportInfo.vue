<script setup>
import { useRoute } from 'vue-router'

import {
  getImgUrlToBase64,
  getPdfApi,
  getVehicleDtcReportInfoApi,
} from '@/apis/shareApi.js'
import {
  getDateWithDDMMMYYYY,
  getGeneratedDateWithDDMMMYYYYhhmma,
} from '@/utils/dateUtil.js'
import { getFormatNumber, getFullFilePath } from '@/utils/dataFormattedUtil.js'
import { VehicleEcuCategory } from '@/utils/constantsUtil.js'

import DefaultCardImg from '@/assets/specialIcons/default-car-img.svg'
import EngineIcon from '@/assets/icons/engine-load.svg'
import NormalStatusIcon from '@/assets/specialIcons/check-one-fill.svg'

// 页面加载状态
const isLoading = ref(false)

// pdf 生成状态
const isGeneratingPdf = ref(false)

// 车辆报告详情
const vehicleDTCsReportInfo = reactive({})

// 显示导出按钮
const showExportButton = ref(true)

const route = useRoute()

const vehicleImg = ref('')

// 获取车辆 DTCs 报告详情
const getVehicleDTCsReportInfo = async (id) => {
  isLoading.value = true

  try {
    const { data } = await getVehicleDtcReportInfoApi(id)
    // 获取成功
    Object.assign(vehicleDTCsReportInfo, data)
    // 将网络图片转为本地图片
    const res = await getImgUrlToBase64(
      getFullFilePath(vehicleDTCsReportInfo.vehicleDto?.cover),
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
  getVehicleDTCsReportInfo(id)
}

// 是否有 fault code 列表
const hasFaultCodeList = computed(
  () =>
    vehicleDTCsReportInfo.reportDtcItemDtos &&
    vehicleDTCsReportInfo.reportDtcItemDtos.length > 0,
)

// 引擎分类
const engineItemList = computed(() =>
  hasFaultCodeList.value
    ? vehicleDTCsReportInfo.reportDtcItemDtos.filter(
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
    ? vehicleDTCsReportInfo.reportDtcItemDtos.filter(
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
    ? vehicleDTCsReportInfo.reportDtcItemDtos.filter(
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
    ? vehicleDTCsReportInfo.reportDtcItemDtos.filter(
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
    ? vehicleDTCsReportInfo.reportDtcItemDtos.filter(
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
    ? vehicleDTCsReportInfo.reportDtcItemDtos.filter(
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
    ? vehicleDTCsReportInfo.reportDtcItemDtos.filter(
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

// 生成 pdf
const generatePdf = async () => {
  try {
    isGeneratingPdf.value = false
    showExportButton.value = false
    const { data } = await getPdfApi({
      id: vehicleDTCsReportInfo.id,
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
</script>

<template>
  <div class="report-container flex flex-col px-40 py-32" v-loading="isLoading">
    <header class="flex flex-col gap-4">
      <h1 class="poppins-28px-semibold text-neutrals-off-black">
        Vehicle DTCs Report
      </h1>
      <h2 class="poppins-12px-medium text-neutrals-grey-4">
        {{
          getGeneratedDateWithDDMMMYYYYhhmma(vehicleDTCsReportInfo.createTime)
        }}
      </h2>
    </header>
    <main class="relative">
      <!-- 报告 -->
      <article>
        <!-- 车辆信息 -->
        <section class="my-16 flex items-center gap-16">
          <el-image
            :src="getFullFilePath(vehicleDTCsReportInfo.vehicleDto?.cover)"
            alt="user vehicle image"
            class="w-120 rounded-16 a4:(w-200 h-133) print:(w-200 h-133) row-center! h-80"
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
                  `${vehicleDTCsReportInfo.brand} ${vehicleDTCsReportInfo.model} ${vehicleDTCsReportInfo.year}` ||
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
                  {{ vehicleDTCsReportInfo.vin || '-' }}
                </span>
              </li>
              <li class="flex items-center">
                <p class="poppins-10px-regular text-neutrals-grey-4 min-w-80">
                  License Plate
                </p>
                <span
                  class="poppins-10px-regular wrap-text text-neutrals-off-black flex-1"
                >
                  {{ vehicleDTCsReportInfo.licensePlate || '-' }}
                </span>
              </li>
              <li class="flex items-center">
                <p class="poppins-10px-regular text-neutrals-grey-4 min-w-80">
                  Mileage
                </p>
                <span
                  class="poppins-10px-regular wrap-text text-neutrals-off-black flex-1"
                >
                  {{ getFormatNumber(vehicleDTCsReportInfo.mileage) || '-' }} km
                </span>
              </li>
            </ul>
          </div>
        </section>
        <div class="flex flex-col gap-24">
          <!-- Vehicle Information -->
          <section class="section-container">
            <h3 class="section-header h-18 row-center">
              <em class="title">Vehicle Information</em>
            </h3>
            <ul
              class="[&_p]:min-w-100 [&>li]:h-15 a4:grid-cols-2 grid grid-cols-1 gap-8 px-12 print:grid-cols-2 [&>li]:flex [&>li]:gap-8"
            >
              <li>
                <p class="poppins-10px-regular text-neutrals-grey-4">
                  Vehicle Type
                </p>
                <span class="poppins-10px-regular text-neutrals-off-black">
                  {{ vehicleDTCsReportInfo.vehicleDto?.vehicleType || '-' }}
                </span>
              </li>
              <li>
                <p class="poppins-10px-regular text-neutrals-grey-4">
                  Primary Colour
                </p>
                <span class="poppins-10px-regular text-neutrals-off-black">
                  {{ vehicleDTCsReportInfo.vehicleDto?.primaryColour || '-' }}
                </span>
              </li>
              <li>
                <p class="poppins-10px-regular text-neutrals-grey-4">
                  Manufacturing Year
                </p>
                <span class="poppins-10px-regular text-neutrals-off-black">
                  {{ vehicleDTCsReportInfo.vehicleDto?.year || '-' }}
                </span>
              </li>
              <li>
                <p class="poppins-10px-regular text-neutrals-grey-4">
                  Chassis No.
                </p>
                <span class="poppins-10px-regular text-neutrals-off-black">
                  {{ vehicleDTCsReportInfo.vehicleDto?.vin || '-' }}
                </span>
              </li>
              <li>
                <p class="poppins-10px-regular text-neutrals-grey-4">
                  Original Reg. Date
                </p>
                <span class="poppins-10px-regular text-neutrals-off-black">
                  {{
                    getDateWithDDMMMYYYY(
                      vehicleDTCsReportInfo.vehicleDto?.createTime,
                    ) || '-'
                  }}
                </span>
              </li>
              <li>
                <p class="poppins-10px-regular text-neutrals-grey-4">
                  Transfer Count
                </p>
                <span class="poppins-10px-regular text-neutrals-off-black">
                  {{ vehicleDTCsReportInfo.vehicleDto?.transferCount || '-' }}
                </span>
              </li>
              <li>
                <p class="poppins-10px-regular text-neutrals-grey-4">
                  COE Category
                </p>
                <span class="poppins-10px-regular text-neutrals-off-black">
                  {{ vehicleDTCsReportInfo.vehicleDto?.coeCategory || '-' }}
                </span>
              </li>
              <li>
                <p class="poppins-10px-regular text-neutrals-grey-4">
                  Engine Capacity
                </p>
                <span class="poppins-10px-regular text-neutrals-off-black">
                  {{ vehicleDTCsReportInfo.vehicleDto?.engineCapacity || '-' }}
                </span>
              </li>
            </ul>
          </section>
          <!-- Fault Codes -->
          <section
            class="section-container"
            v-if="
              vehicleDTCsReportInfo.reportDtcItemDtos &&
              vehicleDTCsReportInfo.reportDtcItemDtos.length > 0
            "
          >
            <div class="row-center h-18 leading-18 section-header gap-4">
              <h3 class="text-neutrals-off-black poppins-12px-semibold">
                Fault Codes
              </h3>
              <span class="text-neutrals-off-black poppins-12px-semibold">
                ({{ vehicleDTCsReportInfo.faultCodeCount }})
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
                <el-col :span="18" class="a4:hidden!">
                  <span class="poppins-10px-semibold">System & OEM</span>
                </el-col>
                <el-col :span="6" class="a4-no-view">
                  <span class="poppins-10px-semibold">System</span>
                </el-col>
                <el-col
                  :span="12"
                  class="hidden! a4:block! print:block! poppins-10px-semibold"
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
                  <el-col :span="18" class="poppins-10px-regular a4:hidden!">
                    {{ VehicleEcuCategory.ENGINE }}
                  </el-col>
                  <el-col :span="6" class="poppins-10px-regular a4-no-view">
                    {{ VehicleEcuCategory.ENGINE }}
                  </el-col>
                  <el-col :span="12" class="a4-no-view" />
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
                    <el-col :span="6" class="a4-no-view" />
                    <el-col
                      :span="18"
                      class="divider-neutral-grey-4-1px a4:hidden!"
                    >
                      {{ item.name }}
                    </el-col>
                    <el-col
                      :span="12"
                      class="divider-neutral-grey-4-1px a4-no-view"
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
                    <el-col :span="6" class="a4-no-view" />
                    <el-col :span="22" class="a4:hidden!">
                      <el-divider />
                    </el-col>
                    <el-col :span="16" class="a4-no-view">
                      <el-divider />
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
                      class="poppins-10px-regular text-neutrals-off-black poppins-10px-semibold py-0! px-0!"
                      :gutter="16"
                    >
                      <el-col :span="2" />
                      <el-col :span="6" class="a4-no-view" />
                      <el-col :span="22" class="pl-0! a4:hidden!">
                        <el-row
                          :gutter="24"
                          class="rounded-t-8 bg-neutrals-off-white md-model text-neutrals-grey-4"
                        >
                          <el-col :span="6">DTC</el-col>
                          <el-col :span="18">Description</el-col>
                        </el-row>
                      </el-col>
                      <el-col :span="16" class="pl-0! a4-no-view">
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
                      <el-col :span="6" class="a4-no-view" />
                      <el-col :span="22" class="pl-0! a4:hidden!">
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
                      <el-col :span="16" class="pl-0! a4-no-view">
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
                      :src="EngineIcon"
                      class="mx-auto h-16 w-16 object-cover"
                    />
                  </el-col>
                  <el-col :span="18" class="poppins-10px-regular a4:hidden!">
                    {{ VehicleEcuCategory.TRANSMISSION }}
                  </el-col>
                  <el-col :span="6" class="poppins-10px-regular a4-no-view">
                    {{ VehicleEcuCategory.TRANSMISSION }}
                  </el-col>
                  <el-col :span="12" class="a4-no-view" />
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
                    <el-col :span="6" class="a4-no-view" />
                    <el-col
                      :span="18"
                      class="divider-neutral-grey-4-1px a4:hidden!"
                    >
                      {{ item.name }}
                    </el-col>
                    <el-col
                      :span="12"
                      class="divider-neutral-grey-4-1px a4-no-view"
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
                    <el-col :span="6" class="a4-no-view" />
                    <el-col :span="22" class="a4:hidden!">
                      <el-divider />
                    </el-col>
                    <el-col :span="16" class="a4-no-view">
                      <el-divider />
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
                      class="poppins-10px-regular text-neutrals-off-black poppins-10px-semibold py-0! px-0!"
                      :gutter="16"
                    >
                      <el-col :span="2" />
                      <el-col :span="6" class="a4-no-view" />
                      <el-col :span="22" class="pl-0! a4:hidden!">
                        <el-row
                          :gutter="24"
                          class="rounded-t-8 bg-neutrals-off-white md-model text-neutrals-grey-4"
                        >
                          <el-col :span="6">DTC</el-col>
                          <el-col :span="18">Description</el-col>
                        </el-row>
                      </el-col>
                      <el-col :span="16" class="pl-0! a4-no-view">
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
                      <el-col :span="6" class="a4-no-view" />
                      <el-col :span="22" class="pl-0! a4:hidden!">
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
                      <el-col :span="16" class="pl-0! a4-no-view">
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
              <!-- Brakes -->
              <template v-if="brakesItemList.length > 0">
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
                  <el-col :span="18" class="poppins-10px-regular a4:hidden!">
                    {{ VehicleEcuCategory.BRAKES }}
                  </el-col>
                  <el-col :span="6" class="poppins-10px-regular a4-no-view">
                    {{ VehicleEcuCategory.BRAKES }}
                  </el-col>
                  <el-col :span="12" class="a4-no-view" />
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
                    <el-col :span="6" class="a4-no-view" />
                    <el-col
                      :span="18"
                      class="divider-neutral-grey-4-1px a4:hidden!"
                    >
                      {{ item.name }}
                    </el-col>
                    <el-col
                      :span="12"
                      class="divider-neutral-grey-4-1px a4-no-view"
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
                    <el-col :span="6" class="a4-no-view" />
                    <el-col :span="22" class="a4:hidden!">
                      <el-divider />
                    </el-col>
                    <el-col :span="16" class="a4-no-view">
                      <el-divider />
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
                      class="poppins-10px-regular text-neutrals-off-black poppins-10px-semibold py-0! px-0!"
                      :gutter="16"
                    >
                      <el-col :span="2" />
                      <el-col :span="6" class="a4-no-view" />
                      <el-col :span="22" class="pl-0! a4:hidden!">
                        <el-row
                          :gutter="24"
                          class="rounded-t-8 bg-neutrals-off-white md-model text-neutrals-grey-4"
                        >
                          <el-col :span="6">DTC</el-col>
                          <el-col :span="18">Description</el-col>
                        </el-row>
                      </el-col>
                      <el-col :span="16" class="pl-0! a4-no-view">
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
                      <el-col :span="6" class="a4-no-view" />
                      <el-col :span="22" class="pl-0! a4:hidden!">
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
                      <el-col :span="16" class="pl-0! a4-no-view">
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
              <!-- Electrical -->
              <template v-if="electricalItemList.length > 0">
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
                  <el-col :span="18" class="poppins-10px-regular a4:hidden!">
                    {{ VehicleEcuCategory.ELECTRICAL }}
                  </el-col>
                  <el-col :span="6" class="poppins-10px-regular a4-no-view">
                    {{ VehicleEcuCategory.ELECTRICAL }}
                  </el-col>
                  <el-col :span="12" class="a4-no-view" />
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
                    <el-col :span="6" class="a4-no-view" />
                    <el-col
                      :span="18"
                      class="divider-neutral-grey-4-1px a4:hidden!"
                    >
                      {{ item.name }}
                    </el-col>
                    <el-col
                      :span="12"
                      class="divider-neutral-grey-4-1px a4-no-view"
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
                    <el-col :span="6" class="a4-no-view" />
                    <el-col :span="22" class="a4:hidden!">
                      <el-divider />
                    </el-col>
                    <el-col :span="16" class="a4-no-view">
                      <el-divider />
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
                      class="poppins-10px-regular text-neutrals-off-black poppins-10px-semibold py-0! px-0!"
                      :gutter="16"
                    >
                      <el-col :span="2" />
                      <el-col :span="6" class="a4-no-view" />
                      <el-col :span="22" class="pl-0! a4:hidden!">
                        <el-row
                          :gutter="24"
                          class="rounded-t-8 bg-neutrals-off-white md-model text-neutrals-grey-4"
                        >
                          <el-col :span="6">DTC</el-col>
                          <el-col :span="18">Description</el-col>
                        </el-row>
                      </el-col>
                      <el-col :span="16" class="pl-0! a4-no-view">
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
                      <el-col :span="6" class="a4-no-view" />
                      <el-col :span="22" class="pl-0! a4:hidden!">
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
                      <el-col :span="16" class="pl-0! a4-no-view">
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
              <!-- Chassis -->
              <template v-if="chassisItemList.length > 0">
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
                  <el-col :span="18" class="poppins-10px-regular a4:hidden!">
                    {{ VehicleEcuCategory.CHASSIS }}
                  </el-col>
                  <el-col :span="6" class="poppins-10px-regular a4-no-view">
                    {{ VehicleEcuCategory.CHASSIS }}
                  </el-col>
                  <el-col :span="12" class="a4-no-view" />
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
                    <el-col :span="6" class="a4-no-view" />
                    <el-col
                      :span="18"
                      class="divider-neutral-grey-4-1px a4:hidden!"
                    >
                      {{ item.name }}
                    </el-col>
                    <el-col
                      :span="12"
                      class="divider-neutral-grey-4-1px a4-no-view"
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
                    <el-col :span="6" class="a4-no-view" />
                    <el-col :span="22" class="a4:hidden!">
                      <el-divider />
                    </el-col>
                    <el-col :span="16" class="a4-no-view">
                      <el-divider />
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
                      class="poppins-10px-regular text-neutrals-off-black poppins-10px-semibold py-0! px-0!"
                      :gutter="16"
                    >
                      <el-col :span="2" />
                      <el-col :span="6" class="a4-no-view" />
                      <el-col :span="22" class="pl-0! a4:hidden!">
                        <el-row
                          :gutter="24"
                          class="rounded-t-8 bg-neutrals-off-white md-model text-neutrals-grey-4"
                        >
                          <el-col :span="6">DTC</el-col>
                          <el-col :span="18">Description</el-col>
                        </el-row>
                      </el-col>
                      <el-col :span="16" class="pl-0! a4-no-view">
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
                      <el-col :span="6" class="a4-no-view" />
                      <el-col :span="22" class="pl-0! a4:hidden!">
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
                      <el-col :span="16" class="pl-0! a4-no-view">
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
              <!-- Body and Trim -->
              <template v-if="bodyAndTrimItemList.length > 0">
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
                  <el-col :span="18" class="poppins-10px-regular a4:hidden!">
                    {{ VehicleEcuCategory.BODY_AND_TRIM }}
                  </el-col>
                  <el-col :span="6" class="poppins-10px-regular a4-no-view">
                    {{ VehicleEcuCategory.BODY_AND_TRIM }}
                  </el-col>
                  <el-col :span="12" class="a4-no-view" />
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
                    <el-col :span="6" class="a4-no-view" />
                    <el-col
                      :span="18"
                      class="divider-neutral-grey-4-1px a4:hidden!"
                    >
                      {{ item.name }}
                    </el-col>
                    <el-col
                      :span="12"
                      class="divider-neutral-grey-4-1px a4-no-view"
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
                    <el-col :span="6" class="a4-no-view" />
                    <el-col :span="22" class="a4:hidden!">
                      <el-divider />
                    </el-col>
                    <el-col :span="16" class="a4-no-view">
                      <el-divider />
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
                      class="poppins-10px-regular text-neutrals-off-black poppins-10px-semibold py-0! px-0!"
                      :gutter="16"
                    >
                      <el-col :span="2" />
                      <el-col :span="6" class="a4-no-view" />
                      <el-col :span="22" class="pl-0! a4:hidden!">
                        <el-row
                          :gutter="24"
                          class="rounded-t-8 bg-neutrals-off-white md-model text-neutrals-grey-4"
                        >
                          <el-col :span="6">DTC</el-col>
                          <el-col :span="18">Description</el-col>
                        </el-row>
                      </el-col>
                      <el-col :span="16" class="pl-0! a4-no-view">
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
                      <el-col :span="6" class="a4-no-view" />
                      <el-col :span="22" class="pl-0! a4:hidden!">
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
                      <el-col :span="16" class="pl-0! a4-no-view">
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
              <!-- Others -->
              <template v-if="otherItemList.length > 0">
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
                  <el-col :span="18" class="poppins-10px-regular a4:hidden!">
                    {{ VehicleEcuCategory.OTHERS }}
                  </el-col>
                  <el-col :span="6" class="poppins-10px-regular a4-no-view">
                    {{ VehicleEcuCategory.OTHERS }}
                  </el-col>
                  <el-col :span="12" class="a4-no-view" />
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
                    <el-col :span="6" class="a4-no-view" />
                    <el-col
                      :span="18"
                      class="divider-neutral-grey-4-1px a4:hidden!"
                    >
                      {{ item.name }}
                    </el-col>
                    <el-col
                      :span="12"
                      class="divider-neutral-grey-4-1px a4-no-view"
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
                    <el-col :span="6" class="a4-no-view" />
                    <el-col :span="22" class="a4:hidden!">
                      <el-divider />
                    </el-col>
                    <el-col :span="16" class="a4-no-view">
                      <el-divider />
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
                      class="poppins-10px-regular text-neutrals-off-black poppins-10px-semibold py-0! px-0!"
                      :gutter="16"
                    >
                      <el-col :span="2" />
                      <el-col :span="6" class="a4-no-view" />
                      <el-col :span="22" class="pl-0! a4:hidden!">
                        <el-row
                          :gutter="24"
                          class="rounded-t-8 bg-neutrals-off-white md-model text-neutrals-grey-4"
                        >
                          <el-col :span="6">DTC</el-col>
                          <el-col :span="18">Description</el-col>
                        </el-row>
                      </el-col>
                      <el-col :span="16" class="pl-0! a4-no-view">
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
                      <el-col :span="6" class="a4-no-view" />
                      <el-col :span="22" class="pl-0! a4:hidden!">
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
                      <el-col :span="16" class="pl-0! a4-no-view">
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

// 手机屏幕样式
@media (max-width: 594px) {
  // h5 模式下
  :deep(.el-row) {
    // 添加 padding-left , 使得标题对齐
    &.md-model {
      @apply pl-17!;
    }

    .el-col {
      // 样式不可见
      &.a4-no-view {
        @apply hidden;
      }
    }
  }
}

// 屏幕宽度大于 768px 时，修改字体大小 (大于 768px 时，默认使用的设备为 pc)
@media (min-width: 768px) {
  .poppins-28px-semibold {
    @apply text-30;
  }

  .poppins-20px-semibold {
    @apply text-22;
  }

  .poppins-12px-regular {
    @apply text-14;
  }

  .poppins-12px-medium {
    @apply text-14;
  }

  .poppins-12px-semibold {
    @apply text-14;
  }

  .poppins-10px-regular {
    @apply text-12;
  }

  .poppins-10px-medium {
    @apply text-12;
  }

  .poppins-10px-semibold {
    @apply text-12;
  }

  .text-10px-regular {
    @apply text-12;
  }

  .hanno-20px-regular {
    @apply text-22;
  }

  .roboto-12px-semibold {
    @apply text-14;
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

  .roboto-12px-semibold {
    @apply text-12;
  }
}
/* </editor-fold> */
</style>
