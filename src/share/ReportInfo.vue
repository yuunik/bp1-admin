<script setup>
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

import AudiA5 from '@/assets/images/Audi-A5.png'
import FaultCodesIcon from '@/assets/icons/fault-codes.svg'
import PredictionIcon from '@/assets/icons/prediction.svg'
import RepairIcon from '@/assets/icons/fi_tool.svg'
import MaintenanceIcon from '@/assets/icons/fi_file-minus.svg'
import FuelIcon from '@/assets/icons/fuel-level.svg'
import ServicesIcon from '@/assets/icons/services-icon.svg'
import ModificationIcon from '@/assets/icons/modification.svg'
import EngineIcon from '@/assets/icons/engine-load.svg'
import TransmissionIcon from '@/assets/icons/tranmission.svg'
import BrakesIcon from '@/assets/icons/brakes.svg'
import ElectricalIcon from '@/assets/icons/electronic-central-electric.svg'

const exportPDF = () => {
  showExportButton.value = false

  nextTick(async () => {
    // 获取导出的容器
    const element = document.querySelector('.report-container')

    // 设置导出选项
    const canvas = await html2canvas(element, {
      scale: 2, // 提高清晰度
      useCORS: true,
      allowTaint: true,
      background: '#fff', // 设置导出的背景颜色
      width: element.scrollWidth,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    })

    // 3. A4尺寸计算
    const imgWidth = 210 // A4宽度 mm
    const pageHeight = 297 // A4高度 mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    // 4. 创建PDF并自动分页
    const pdf = new jsPDF('p', 'mm', 'a4')
    let position = 0
    let pageNum = 1
    const totalPages = Math.ceil(imgHeight / pageHeight)

    // 封装添加页眉页脚的方法
    const addHeaderFooter = (pdf, pageNum, totalPages) => {
      // 页眉
      pdf.setFontSize(10)
      pdf.text('车辆检测报告', 10, 10) // 左上角标题

      // 页脚
      pdf.setFontSize(10)
      pdf.text(`第 ${pageNum} 页 / 共 ${totalPages} 页`, 105, 290, {
        align: 'center',
      })
    }

    // 添加第一页
    pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      0,
      position,
      imgWidth,
      imgHeight,
    )
    addHeaderFooter(pdf, pageNum, totalPages)

    // 添加第一页
    pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      0,
      position,
      imgWidth,
      imgHeight,
    )
    heightLeft -= pageHeight

    // 自动分页处理
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        position,
        imgWidth,
        imgHeight,
      )
      heightLeft -= pageHeight
    }

    pdf.save('vehicle-report.pdf')
    showExportButton.value = true
  })
}

// 显示导出按钮
const showExportButton = ref(true)
</script>

<template>
  <div class="bg-neutrals-off-white flex">
    <div
      class="report-container max-w-595 shadow-default bg-neutrals-white m-auto box-border px-32"
    >
      <header class="flex flex-col gap-4">
        <h1>
          <strong class="poppins-28px-semibold text-[#1B1A1E]">
            Vehicle Report
          </strong>
        </h1>
        <h2>
          <em class="poppins-12px-medium not-italic text-[#6F7788]">
            Generated: 22 Aug 2024 10:30am
          </em>
        </h2>
      </header>
      <main class="relative">
        <!-- 报告 -->
        <article>
          <!-- 车辆信息 -->
          <section class="my-16 flex items-center gap-32">
            <el-image
              :src="AudiA5"
              alt="user vehicle image"
              class="w-200"
              fit="cover"
            />
            <div class="flex flex-1 flex-col gap-8">
              <h2 class="items-centers flex">
                <em class="poppins-20px-semibold not-italic text-[#006BF7]">
                  Audi A5 2011
                </em>
              </h2>
              <ul class="flex flex-col gap-4 [&>li]:flex [&>li]:gap-8">
                <li class="flex items-center">
                  <label class="poppins-10px-regular flex-[1_1_92px]">
                    VIN
                  </label>
                  <el-text
                    class="poppins-10px-regular text-truncate flex-[1_1_189px]"
                  >
                    5YJSA1ZL0KLA03456
                  </el-text>
                </li>
                <li class="flex items-center">
                  <label class="poppins-10px-regular flex-[1_1_92px]">
                    License Plate
                  </label>
                  <el-text
                    class="poppins-10px-regular text-truncate flex-[1_1_189px]"
                  >
                    SGW222Y
                  </el-text>
                </li>
                <li class="flex items-center">
                  <label class="poppins-10px-regular flex-[1_1_92px]">
                    Mileage
                  </label>
                  <el-text
                    class="poppins-10px-regular text-truncate flex-[1_1_189px]"
                  >
                    1,200 km
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
                <em class="hanno-20px-regular">9.5</em>
                <span class="text-10px-regular">out of 10</span>
              </h2>
              <!-- 分割线 -->
              <el-divider direction="vertical" class="bg-neutrals-grey-4!" />
              <!-- 车辆评分等级 -->
              <div class="flex flex-1 flex-col gap-8">
                <span class="roboto-12px-semibold">Evaluation Level</span>
                <p class="text-neutrals-grey-2 text-10px-regular">
                  The vehicle is in good overall condition with all key
                  indicators normal! The vehicle is in good overall condition
                  with all key indicators normal!
                </p>
              </div>
            </section>
            <!-- 总览 -->
            <section class="section-container">
              <h3 class="section-header">
                <em class="title">Overview</em>
              </h3>
              <!-- Issues -->
              <div class="flex flex-col gap-8">
                <h4 class="ml-8">
                  <span class="poppins-10px-medium">Issues</span>
                </h4>
                <div class="text-status-colours-red flex gap-8">
                  <div
                    class="bg-neutrals-off-white rounded-8 text-truncate flex flex-1 flex-col items-center gap-8 p-12"
                  >
                    <el-image
                      :src="FaultCodesIcon"
                      fit="cover"
                      class="h-24 w-24"
                    />
                    <p class="poppins-10px-semibold">3 Fault Codes</p>
                  </div>
                  <div
                    class="bg-neutrals-off-white rounded-8 text-truncate flex flex-1 flex-col items-center gap-8 p-12"
                  >
                    <el-image
                      :src="PredictionIcon"
                      fit="cover"
                      class="h-24 w-24"
                    />
                    <p class="poppins-10px-semibold">3 Fault Codes</p>
                  </div>
                </div>
              </div>
              <!-- Expense Records -->
              <div class="flex flex-col gap-8">
                <h4 class="ml-8">
                  <span class="poppins-10px-medium">Expense Records</span>
                </h4>
                <div class="flex gap-8">
                  <div
                    class="bg-neutrals-off-white rounded-8 text-truncate flex flex-1 flex-col items-center gap-8 p-12"
                  >
                    <el-image :src="RepairIcon" fit="cover" class="h-24 w-24" />
                    <p class="poppins-10px-semibold">3 Repair</p>
                  </div>
                  <div
                    class="bg-neutrals-off-white rounded-8 text-truncate flex flex-1 flex-col items-center gap-8 p-12"
                  >
                    <el-image
                      :src="MaintenanceIcon"
                      fit="cover"
                      class="h-24 w-24"
                    />
                    <p class="poppins-10px-semibold">0 Maintenance</p>
                  </div>
                  <div
                    class="bg-neutrals-off-white rounded-8 text-truncate flex flex-1 flex-col items-center gap-8 p-12"
                  >
                    <el-image :src="FuelIcon" fit="cover" class="h-24 w-24" />
                    <p class="poppins-10px-semibold">0 Fuel</p>
                  </div>
                  <div
                    class="bg-neutrals-off-white rounded-8 text-truncate flex flex-1 flex-col items-center gap-8 p-12"
                  >
                    <el-image
                      :src="ServicesIcon"
                      fit="cover"
                      class="h-24 w-24"
                    />
                    <p class="poppins-10px-semibold">0 Services</p>
                  </div>
                  <div
                    class="bg-neutrals-off-white rounded-8 text-truncate flex flex-1 flex-col items-center gap-8 p-12"
                  >
                    <el-image
                      :src="ModificationIcon"
                      fit="cover"
                      class="h-24 w-24"
                    />
                    <p class="poppins-10px-semibold">2 Modification</p>
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
                class="grid grid-cols-2 gap-x-8 gap-y-8 [&>li]:flex [&>li]:gap-8"
              >
                <li>
                  <label>Vehicle Type</label>
                  <el-text>P10 - Passenger Moto Car</el-text>
                </li>
                <li>
                  <label>Primary Colour</label>
                  <el-text>Blue</el-text>
                </li>
                <li>
                  <label>Manufacturing Year</label>
                  <el-text>2011</el-text>
                </li>
                <li>
                  <label>Chassis No.</label>
                  <el-text>WAUZZZ8T9BA000000</el-text>
                </li>
                <li>
                  <label>Original Reg. Date</label>
                  <el-text>15 Aug 2011</el-text>
                </li>
                <li>
                  <label>Transfer Count</label>
                  <el-text>2</el-text>
                </li>
                <li>
                  <label>COE Category</label>
                  <el-text>Cat B</el-text>
                </li>
                <li>
                  <label>Engine Capacity</label>
                  <el-text>1984 cc</el-text>
                </li>
              </ul>
            </section>
            <!-- Fault Codes -->
            <section class="section-container">
              <h3 class="section-header">
                <em class="title">Fault Codes</em>
              </h3>
              <!-- table -->
              <div>
                <!-- theader -->
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
                <el-row class="poppins-10px-regular text-neutrals-off-black">
                  <el-col :span="2">
                    <el-image :src="EngineIcon" fit="cover" class="h-16 w-16" />
                  </el-col>
                  <el-col :span="6" class="poppins-10px-regular">Engine</el-col>
                  <el-col :span="12"></el-col>
                  <el-col :span="4">
                    <i class="bg-status-colours-green">Normal</i>
                  </el-col>
                </el-row>
                <el-row class="poppins-10px-regular text-neutrals-off-black">
                  <el-col :span="2"></el-col>
                  <el-col :span="6"></el-col>
                  <el-col :span="12" class="poppins-10px-regular">EMS</el-col>
                  <el-col :span="4">-</el-col>
                </el-row>
                <el-row class="poppins-10px-regular text-neutrals-off-black">
                  <el-col :span="2"></el-col>
                  <el-col :span="6"></el-col>
                  <el-col :span="12">Power Control Module</el-col>
                  <el-col :span="4">-</el-col>
                </el-row>
                <el-divider />
                <!-- Transmission -->
                <el-row class="poppins-10px-regular text-neutrals-off-black">
                  <el-col :span="2">
                    <el-image
                      :src="TransmissionIcon"
                      fit="cover"
                      class="h-16 w-16"
                    />
                  </el-col>
                  <el-col :span="6">Transmission</el-col>
                  <el-col :span="12"></el-col>
                  <el-col :span="4">
                    <i class="bg-status-colours-green">Normal</i>
                  </el-col>
                </el-row>
                <el-row class="poppins-10px-regular text-neutrals-off-black">
                  <el-col :span="2"></el-col>
                  <el-col :span="6"></el-col>
                  <el-col :span="12">Transmission Control Module</el-col>
                  <el-col :span="4">-</el-col>
                </el-row>
                <el-divider />
                <!-- Brakes -->
                <el-row class="poppins-10px-regular text-neutrals-off-black">
                  <el-col :span="2">
                    <el-image :src="BrakesIcon" fit="cover" class="h-16 w-16" />
                  </el-col>
                  <el-col :span="6">Brakes</el-col>
                  <el-col :span="12"></el-col>
                  <el-col :span="4">
                    <i class="bg-status-colours-red">1 DTC</i>
                  </el-col>
                </el-row>
                <el-row class="poppins-10px-regular text-neutrals-off-black">
                  <el-col :span="2"></el-col>
                  <el-col :span="6"></el-col>
                  <el-col :span="12">Anti-Lock Braking Control Module</el-col>
                  <el-col :span="4">-</el-col>
                </el-row>
                <el-row class="poppins-10px-regular text-neutrals-off-black">
                  <el-col :span="2"></el-col>
                  <el-col :span="6"></el-col>
                  <el-col :span="12">Parking Aid Control Module</el-col>
                  <el-col :span="4">1 DTC</el-col>
                </el-row>
                <el-row
                  class="poppins-10px-regular text-neutrals-off-black pb-0!"
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
                  class="pt-0! poppins-10px-regular text-neutrals-off-black"
                >
                  <el-col :span="2"></el-col>
                  <el-col :span="6"></el-col>
                  <el-col :span="16">
                    <el-row
                      :gutter="24"
                      class="rounded-b-8 bg-neutrals-off-white"
                    >
                      <el-col :span="8">C0750:39</el-col>
                      <el-col :span="16">
                        Left front tire pressure sensor
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <el-divider />
                <!-- Electrical -->
                <el-row class="poppins-10px-regular text-neutrals-off-black">
                  <el-col :span="2">
                    <el-image
                      :src="ElectricalIcon"
                      fit="cover"
                      class="h-16 w-16"
                    />
                  </el-col>
                  <el-col :span="6">Electrical</el-col>
                  <el-col :span="12"></el-col>
                  <el-col :span="4">
                    <i class="bg-status-colours-red">2 DTCs</i>
                  </el-col>
                </el-row>
                <el-row class="poppins-10px-regular text-neutrals-off-black">
                  <el-col :span="2"></el-col>
                  <el-col :span="6"></el-col>
                  <el-col :span="12">BCM</el-col>
                  <el-col :span="4">2 DTCs</el-col>
                </el-row>
                <el-row
                  class="pb-0! poppins-10px-regular text-neutrals-off-black"
                >
                  <el-col :span="2"></el-col>
                  <el-col :span="6"></el-col>
                  <el-col :span="16">
                    <el-row
                      :gutter="24"
                      class="rounded-t-8 bg-neutrals-off-white poppins-10px-medium text"
                    >
                      <el-col :span="8">DTC</el-col>
                      <el-col :span="16">
                        Invalid data received from electronic brake control
                        module
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <el-row
                  class="py-0! poppins-10px-regular text-neutrals-off-black"
                >
                  <el-col :span="2"></el-col>
                  <el-col :span="6"></el-col>
                  <el-col :span="16">
                    <el-row :gutter="24" class="bg-neutrals-off-white">
                      <el-col :span="8">U0415:71</el-col>
                      <el-col :span="16">Description</el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <el-row
                  class="pt-0! poppins-10px-regular text-neutrals-off-black"
                >
                  <el-col :span="2"></el-col>
                  <el-col :span="6"></el-col>
                  <el-col :span="16">
                    <el-row
                      :gutter="24"
                      class="rounded-b-8 bg-neutrals-off-white"
                    >
                      <el-col :span="8">U0415:71</el-col>
                      <el-col :span="16">
                        Invalid data received from electronic brake control
                        module
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <el-row class="poppins-10px-regular text-neutrals-off-black">
                  <el-col :span="2"></el-col>
                  <el-col :span="6"></el-col>
                  <el-col :span="12">
                    Remote Communication Interface Control Module
                  </el-col>
                  <el-col :span="4">-</el-col>
                </el-row>
                <el-row class="poppins-10px-regular text-neutrals-off-black">
                  <el-col :span="2"></el-col>
                  <el-col :span="6"></el-col>
                  <el-col :span="12">Central Control Panel Module</el-col>
                  <el-col :span="4">-</el-col>
                </el-row>
                <el-row class="poppins-10px-regular text-neutrals-off-black">
                  <el-col :span="2"></el-col>
                  <el-col :span="6"></el-col>
                  <el-col :span="12">Instrument Control Module</el-col>
                  <el-col :span="4">-</el-col>
                </el-row>
              </div>
            </section>
            <!-- Prediction -->
            <section class="section-container">
              <h3 class="section-header">
                <em class="title">Prediction</em>
              </h3>
              <!-- table -->
              <div>
                <!-- theader -->
                <el-row
                  class="bg-neutrals-grey-1 rounded-t-8 poppins-10px-semibold rounded"
                  :gutter="16"
                >
                  <el-col :span="2"></el-col>
                  <el-col :span="11">Category</el-col>
                  <el-col :span="11">Condition</el-col>
                </el-row>
                <!-- tbody -->
                <template v-for="item in 10" :key="item">
                  <el-row>
                    <el-col :span="2">
                      <el-image
                        :src="EngineIcon"
                        fit="cover"
                        class="h-16 w-16"
                      />
                    </el-col>
                    <el-col :span="11" class="poppins-10px-regular">
                      Brake Failure
                    </el-col>
                    <el-col :span="11" class="poppins-10px-semibold">6%</el-col>
                  </el-row>
                  <el-divider class="divider-neutral-grey-4-1px" />
                </template>
              </div>
            </section>
            <!-- Expense Records 1  -->
            <section class="section-container">
              <h3 class="section-header">
                <em class="title">Expense Records</em>
              </h3>
              <!-- table -->
              <div>
                <!-- theader -->
                <el-row
                  class="bg-neutrals-grey-1 rounded-t-8 poppins-10px-semibold rounded"
                  :gutter="16"
                >
                  <el-col :span="2"></el-col>
                  <el-col :span="6">System</el-col>
                  <el-col :span="12">ECU</el-col>
                  <el-col :span="4">DTC</el-col>
                </el-row>
                <!-- tbody -->
                <el-row>
                  <el-col :span="2"></el-col>
                  <el-col :span="6">Chassis</el-col>
                  <el-col :span="12"></el-col>
                  <el-col :span="4">
                    <i class="bg-status-colours-red">2 DTCs</i>
                  </el-col>
                </el-row>
                <el-row class="poppins-10px-regular text-neutrals-off-black">
                  <el-col :span="2"></el-col>
                  <el-col :span="6"></el-col>
                  <el-col :span="12">Power Steering Control Module</el-col>
                  <el-col :span="4">1 DTC</el-col>
                </el-row>
                <!-- 小表格 -->
                <el-row
                  class="pb-0! poppins-10px-regular text-neutrals-off-black"
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
                  class="pt-0! poppins-10px-regular text-neutrals-off-black"
                >
                  <el-col :span="2"></el-col>
                  <el-col :span="6"></el-col>
                  <el-col :span="16">
                    <el-row
                      :gutter="24"
                      class="rounded-b-8 bg-neutrals-off-white"
                    >
                      <el-col :span="8">B1325:03</el-col>
                      <el-col :span="16">Control module power circuit</el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="2"></el-col>
                  <el-col :span="6"></el-col>
                  <el-col :span="12">Steering Wheel Angle Sensor Module</el-col>
                  <el-col :span="4">-</el-col>
                </el-row>
                <el-divider />
                <el-row>
                  <el-col :span="2"></el-col>
                  <el-col :span="6">Body and Trim</el-col>
                  <el-col :span="12"></el-col>
                  <el-col :span="4">
                    <i class="bg-status-colours-green">Normal</i>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="2"></el-col>
                  <el-col :span="6"></el-col>
                  <el-col :span="12">Air Conditioning Control Module</el-col>
                  <el-col :span="4">-</el-col>
                </el-row>
                <el-row>
                  <el-col :span="2"></el-col>
                  <el-col :span="6"></el-col>
                  <el-col :span="12">Radio Control Module</el-col>
                  <el-col :span="4">-</el-col>
                </el-row>
                <el-row>
                  <el-col :span="2"></el-col>
                  <el-col :span="6"></el-col>
                  <el-col :span="12">Airbag Control Module</el-col>
                  <el-col :span="4">-</el-col>
                </el-row>
              </div>
            </section>
            <!-- Expense Records 2  -->
            <section class="section-container">
              <h3 class="section-header">
                <em class="title">Expense Records</em>
              </h3>
              <!-- table -->
              <div>
                <!-- theader -->
                <el-row
                  class="bg-neutrals-grey-1 rounded-t-8 poppins-10px-semibold rounded"
                  :gutter="16"
                >
                  <el-col :span="2"></el-col>
                  <el-col :span="6">System</el-col>
                  <el-col :span="12">ECU</el-col>
                  <el-col :span="4">DTC</el-col>
                </el-row>
                <!-- tbody -->
                <el-row>
                  <el-col :span="2"></el-col>
                  <el-col :span="6">Chassis</el-col>
                  <el-col :span="12"></el-col>
                  <el-col :span="4">
                    <i class="bg-status-colours-red">2 DTCs</i>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="2"></el-col>
                  <el-col :span="6"></el-col>
                  <el-col :span="12">Power Steering Control Module</el-col>
                  <el-col :span="4">1 DTC</el-col>
                </el-row>
                <!-- 小表格 -->
                <el-row class="pb-0!">
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
                <el-row class="pt-0!">
                  <el-col :span="2"></el-col>
                  <el-col :span="6"></el-col>
                  <el-col :span="16">
                    <el-row
                      :gutter="24"
                      class="rounded-b-8 bg-neutrals-off-white"
                    >
                      <el-col :span="8">B1325:03</el-col>
                      <el-col :span="16">Control module power circuit</el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="2"></el-col>
                  <el-col :span="6"></el-col>
                  <el-col :span="12">Steering Wheel Angle Sensor Module</el-col>
                  <el-col :span="4">-</el-col>
                </el-row>
                <el-divider />
                <el-row>
                  <el-col :span="2"></el-col>
                  <el-col :span="6">Body and Trim</el-col>
                  <el-col :span="12"></el-col>
                  <el-col :span="4">
                    <i class="bg-status-colours-green">Normal</i>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="2"></el-col>
                  <el-col :span="6"></el-col>
                  <el-col :span="12">Air Conditioning Control Module</el-col>
                  <el-col :span="4">-</el-col>
                </el-row>
                <el-row>
                  <el-col :span="2"></el-col>
                  <el-col :span="6"></el-col>
                  <el-col :span="12">Radio Control Module</el-col>
                  <el-col :span="4">-</el-col>
                </el-row>
                <el-row>
                  <el-col :span="2"></el-col>
                  <el-col :span="6"></el-col>
                  <el-col :span="12">Airbag Control Module</el-col>
                  <el-col :span="4">-</el-col>
                </el-row>
              </div>
            </section>
          </div>
        </article>
        <!-- 导出 PDF 按钮 -->
        <button
          class="bg-branding-colours-primary shadow-default text-neutrals-off-white bottom-68 fixed inset-x-0 mx-auto inline-flex w-fit cursor-pointer rounded-full border-none px-20 py-10"
          v-if="showExportButton"
          @click="exportPDF"
        >
          Export as PDF
        </button>
      </main>
    </div>
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
  @apply px-8 py-12;

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
