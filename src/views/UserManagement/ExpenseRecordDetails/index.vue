<script setup>
import { ref } from 'vue'

import BaseSvgIcon from '@/components/BaseSvgIcon.vue'

// 静态资源
import ExpandIcon from '@/assets/specialIcons/arrow-down-s-line.svg'
import CollapseIcon from '@/assets/specialIcons/arrow-right-s-line.svg'
import UpIcon from '@/assets/specialIcons/fi_trending-up.svg'
import DownIcon from '@/assets/specialIcons/fi_trending-down.svg'
import PDFIcon from '@/assets/specialIcons/icon_pdf.svg'

const activeTab = ref('Expense Details')

const engineItemIsExpand = ref(false)
</script>

<template>
  <section class="h-full">
    <div class="flex-between mx-32 mb-16">
      <!-- header -->
      <h2
        class="heading-h2-20px-medium text-neutrals-off-black leading-30 row-center h-32"
      >
        Expense Records Details
      </h2>
      <el-button type="primary">Edit</el-button>
    </div>
    <!-- tabs -->
    <el-tabs v-model="activeTab" class="has-top mb-16">
      <el-tab-pane label="Expense Details" name="Expense Details" />
      <el-tab-pane label="Bills" name="Bills " />
      <el-tab-pane label="Attachments" name="Attachments" />
      <el-tab-pane label="Logs & Note" name="Logs & Note" />
    </el-tabs>
    <!-- details -->
    <dl
      class="[&>dt]:leading-32 [&>dd]:leading-32 mx-32 mb-24 grid grid-cols-[112px_1fr_112px_1fr] gap-x-8 gap-y-20 [&>dd]:h-32 [&>dt]:h-32"
    >
      <dt>Workshop</dt>
      <dd>BMW</dd>
      <dt>Mileage</dt>
      <dd>11,000 km</dd>
      <dt>Date</dt>
      <dd>04 Apr 2025 4:23pm</dd>
      <dt>Note</dt>
      <dd>xxxxx</dd>
    </dl>
    <!-- items table -->
    <div class="mb-24">
      <!-- header -->
      <div class="row-center mx-32 h-24">
        <h3
          class="heading-body-large-body-14px-medium text-neutrals-off-black leading-20 row-center h-24"
        >
          Items
        </h3>
        <span
          class="heading-body-large-body-14px-medium text-neutrals-grey-3 ml-8"
        >
          3
        </span>
      </div>
      <!-- divider -->
      <el-divider class="mt-8!" />
      <!-- table -->
      <div class="items-table-container mx-32">
        <!-- header -->
        <el-row>
          <el-col :span="1" />
          <el-col :span="6">Item</el-col>
          <el-col :span="3">Category</el-col>
          <el-col :span="3">Unit Price</el-col>
          <el-col :span="2">Qty</el-col>
          <el-col :span="3">Discount</el-col>
          <el-col :span="3">Tax Rate</el-col>
          <el-col :span="3">Total Amount</el-col>
        </el-row>
        <!-- body -->
        <el-row :class="{ 'bg-status-colours-light-blue': engineItemIsExpand }">
          <el-col :span="1">
            <el-image
              :src="engineItemIsExpand ? ExpandIcon : CollapseIcon"
              class="h-16 w-16 cursor-pointer"
              fit="cover"
              @click.stop="engineItemIsExpand = !engineItemIsExpand"
            />
          </el-col>
          <el-col :span="6">General Maintenance Check</el-col>
          <el-col :span="3">Maintenance</el-col>
          <el-col :span="3">500.00</el-col>
          <el-col :span="2">2</el-col>
          <el-col :span="3">10.00</el-col>
          <el-col :span="3">10.00</el-col>
          <el-col :span="3" class="row-center">
            <el-image :src="UpIcon" class="mr-8 h-16 w-16" fit="cover" />
            <span>$1,000.00</span>
          </el-col>
        </el-row>
        <!-- expand row -->
        <el-row
          v-if="engineItemIsExpand"
          :class="[
            'is-expand',
            { 'bg-neutrals-off-white': engineItemIsExpand },
          ]"
        >
          <el-col :span="1" />
          <el-col :span="23">
            <!-- cost analysis header -->
            <div class="row-center flex gap-8">
              <h4
                class="heading-body-body-12px-medium text-neutrals-grey-4 leading-16"
              >
                Cost Analysis
              </h4>
              <i class="icon-edit-line text-16 text-neutrals-grey-3" />
            </div>
            <div>
              <el-image :src="UpIcon" class="mr-8 h-16 w-16" fit="cover" />
              <span class="text-status-colours-red">30 %</span>
              <p class="heading-body-body-12px-medium text-neutrals-off-black">
                Market Average: $350 · Your Price: $500 Price is slightly
                higher, consider checking alternative workshops.
              </p>
            </div>
          </el-col>
        </el-row>
        <!-- billing summary row -->
        <el-row class="billing-summary">
          <el-col :span="12" />
          <el-col :span="12">
            <div class="mb-12 flex w-full flex-col gap-16">
              <!-- item -->
              <dl class="grid grid-cols-[1fr_auto] gap-x-8 gap-y-16 px-8 pt-12">
                <dt>Subtotal (Excluding Tax)</dt>
                <dd>
                  <span class="text-neutrals-off-black">3,000.00</span>
                </dd>
                <dt>Discount Amount</dt>
                <dd>
                  <span class="text-neutrals-off-black">30.00</span>
                </dd>
                <dt>Subtotal with Discount Applied</dt>
                <dd>
                  <span class="text-neutrals-off-black">2,970.00</span>
                </dd>
                <dt>Tax</dt>
                <dd>
                  <span class="text-neutrals-off-black">30.00</span>
                </dd>
              </dl>
              <el-divider />
              <!-- Total Amount (SGD) -->
              <div class="flex-between text-neutrals-off-black px-8">
                <p class="heading-body-large-body-14px-medium">
                  Total Amount (SGD)
                </p>
                <span class="heading-body-large-body-14px-medium">
                  $2,990.00
                </span>
              </div>
              <!-- total amount convert -->
              <div class="rounded-8 flex flex-col gap-16 bg-[#EAEEF480] p-8">
                <!-- Currency Rate -->
                <div class="flex-between text-neutrals-off-black">
                  <p
                    class="heading-body-large-body-14px-medium text-neutrals-grey-4"
                  >
                    Currency Rate
                  </p>
                  <div class="row-center gap-4">
                    <span
                      class="heading-body-body-12px-medium text-neutrals-off-black"
                    >
                      1 SGD = 3.3049 MYR
                    </span>
                    <i class="icon-edit-line text-16 text-neutrals-grey-3" />
                  </div>
                </div>
                <div class="flex-between text-neutrals-off-black">
                  <p class="heading-body-large-body-14px-medium">
                    Total Amount (SGD)
                  </p>
                  <span class="heading-body-large-body-14px-medium">
                    $2,990.00
                  </span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- bills -->
    <div class="mb-24">
      <!-- header -->
      <div class="flex-between mx-32 h-24">
        <div class="row-center flex gap-8">
          <h3
            class="heading-body-large-body-14px-medium text-neutrals-off-black leading-20 row-center h-24"
          >
            Bills
          </h3>
          <span
            class="heading-body-large-body-14px-medium text-neutrals-grey-3"
          >
            6
          </span>
        </div>
        <!-- 上传按钮 -->
        <el-button type="primary" text>
          <template #icon>
            <i class="icon-upload-2-line text-neutrals-blue text-16" />
          </template>
          <template #default>Upload</template>
        </el-button>
      </div>
      <!-- divider -->
      <el-divider class="mt-8! mb-12!" />
      <!-- attachment grid view -->
      <div class="mx-32 grid grid-cols-2 gap-12">
        <div
          v-for="item in 6"
          :key="item"
          class="rounded-12 border-[1px]-[#EAEEF4] row-center h-64 gap-8 p-12"
        >
          <el-image :src="PDFIcon" class="h-40 w-40" fit="cover" />
          <div class="text-neutrals-grey-4 flex flex-col gap-8">
            <p class="heading-body-body-12px-regular text-neutrals-off-black">
              document 1.pdf
            </p>
            <div class="row-center gap-4">
              <el-avatar
                :size="20"
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              />
              <span class="heading-caption-caption-10px-regular">
                Bessie Cooper
              </span>
              <span class="heading-caption-caption-10px-regular">∙</span>
              <span class="heading-caption-caption-10px-regular">120 KB</span>
              <span class="heading-caption-caption-10px-regular">∙</span>
              <span class="heading-caption-caption-10px-regular">
                28/04/2024 3:30pm
              </span>
            </div>
          </div>
          <div class="flex gap-8">
            <base-svg-icon name="down_line" color="#6F7788" size="16" />
            <base-svg-icon name="delete-2" color="#6F7788" size="16" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.items-table-container :deep(.el-row) {
  @apply text-14 leading-16 text-neutrals-grey-4 default-transition h-32 font-medium;
  border-bottom: 1px solid $neutrals-grey-1;

  // columns 样式
  .el-col {
    @apply row-center;

    // 首列的样式
    &:first-child {
      @apply justify-center;
    }

    // 列间间距
    &:not(:first-child):not(:last-child) {
      @apply pl-8;
    }

    // 最后一列的样式
    &:last-child {
      @apply flex justify-end pr-8;
    }
  }

  // 非首行的样式
  &:not(:first-child) {
    @apply hover:bg-status-colours-light-blue cursor-pointer;
  }

  // 展开行的样式
  &.is-expand {
    @apply h-auto leading-normal;

    .el-col {
      // 最后一列的样式
      &:last-child {
        @apply flex flex-col items-start justify-start gap-8 py-16 pl-8;
      }
    }
  }

  // 账单总结所在行的样式
  &.billing-summary {
    @apply h-auto cursor-default border-none leading-normal hover:bg-transparent;

    .el-col {
      // 最后一列的样式
      &:last-child {
        @apply flex flex-col items-start justify-start pr-0;
      }
    }
  }
}
</style>
