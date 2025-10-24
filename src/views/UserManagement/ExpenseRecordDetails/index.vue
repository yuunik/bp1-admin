<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import Big from 'big.js'

import BaseSvgIcon from '@/components/BaseSvgIcon.vue'

// 静态资源
import ExpandIcon from '@/assets/specialIcons/arrow-down-s-line.svg'
import CollapseIcon from '@/assets/specialIcons/arrow-right-s-line.svg'
import UpIcon from '@/assets/specialIcons/fi_trending-up.svg'
import DownIcon from '@/assets/specialIcons/fi_trending-down.svg'
import PDFIcon from '@/assets/specialIcons/icon_pdf.svg'
import BaseDialog from '@/components/BaseDialog.vue'
import {
  getRepairRecordDetailApi,
  updateExpenseItemCostAnalysisApi,
} from '@/apis/userApi.js'
import BaseInfoCard from '@/components/BaseInfoCard.vue'
import { getDateWithDDMMMYYYYhhmma } from '@/utils/dateUtil.js'
import { useCloned } from '@vueuse/core'
import { getFormatNumberString } from '@/utils/dataFormattedUtil.js'
import { AI_COST_LEVEL } from '@/utils/constantsUtil.js'
import FileInfoCard from '@/views/UserManagement/ExpenseRecordDetails/components/FileInfoCard.vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('Expense Details')

const engineItemIsExpand = ref(false)

const route = useRoute()

// 维修记录详情
const repairRecordDetail = ref({})

// 操作日志列表
const logList = ref([
  {
    date: '15 May 2023',
    time: '9:30 am',
    user: 'Kristin Watson',
    action: 'Login',
    detail: { ip: '123.45.6', device: 'iPhone 14' },
  },
  {
    date: '15 May 2023',
    time: '9:00 am',
    user: 'Kristin Watson',
    action: 'Create Order',
    detail: { orderNo: 'ORD-00020' },
  },
])

//  编辑预估成本的弹窗
const dialogEditEstimatedCostVisible = ref(false)

// 预估成本表单
const editEstimatedCostForm = reactive({
  cost: '',
  description: '',
})

// 表单校验规则
const editEstimatedCostFormRules = reactive({
  cost: [{ required: true, message: '请输入预估成本', trigger: 'blur' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
})

// 预估成本表单引用
const editEstimatedCostFormRef = ref(null)

// 选择的预估成本
const selectedEstimatedCost = ref({})

// 税前小计
const subtotal = computed(() => {
  const totalCost = Big(repairRecordDetail.value.totalCost || 0)
  const gst = Big(repairRecordDetail.value.gst || 0)
  const discount = Big(repairRecordDetail.value.discount || 0)

  // 使用 minus / plus 保证精度
  return totalCost.minus(gst).plus(discount).toFixed(2)
})

// 税前小计(含折扣)
const subtotalWithDiscount = computed(() => {
  const totalCost = Big(repairRecordDetail.value.totalCost || 0)
  const gst = Big(repairRecordDetail.value.gst || 0)

  // 使用 minus / plus 保证精度
  return totalCost.minus(gst).toFixed(2)
})

// 转换汇率后的总价
const totalCostWithExchangeRate = computed(() => {
  const totalCost = Big(repairRecordDetail.value.totalCost || 0)
  const rate = Big(repairRecordDetail.value.rate || 0)

  return (totalCost * rate).toFixed(2)
})

// 关闭编辑预估成本的弹窗
const handleCloseEditEstimatedCostDialog = () => {
  editEstimatedCostForm.cost = ''
  editEstimatedCostForm.description = ''
  dialogEditEstimatedCostVisible.value = false
}

// 提交编辑预估成本表单
const handleEditEstimatedCostForm = async () => {
  try {
    // 验证表单
    await editEstimatedCostFormRef.value.validate()
    await updateExpenseItemCostAnalysisApi({
      id: selectedEstimatedCost.value.id,
      avg: editEstimatedCostForm.cost,
      remark: editEstimatedCostForm.description,
    })
    // 提示
    ElMessage.success('Edit success')
    // 刷新
    getRepairRecordInfo(route.params.id)
  } finally {
    dialogEditEstimatedCostVisible.value = false
  }
}

// 获取维修记录详情
const getRepairRecordInfo = async (id) => {
  const { data } = await getRepairRecordDetailApi(id)
  // 深拷贝一份，避免直接改接口原始对象
  const { cloned } = useCloned(data)
  // 给每个 expenseItemDtos 元素加上 isExpand
  if (cloned.expenseItemDtos && cloned.expenseItemDtos.length) {
    cloned.expenseItemDtos = cloned.expenseItemDtos.map((item) => ({
      ...item,
      isExpand: false,
    }))
  }
  repairRecordDetail.value = cloned.value
}

const handleOpenEditEstimatedCostDialog = (record) => {
  const { cloned } = useCloned(record)
  selectedEstimatedCost.value = cloned.value
  dialogEditEstimatedCostVisible.value = true
}

// 组件创建后, 发起请求
const {
  params: { id },
} = route

getRepairRecordInfo(id)
</script>

<template>
  <section class="h-full overflow-auto pb-32">
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
      <dd>
        <base-info-card
          :logo="repairRecordDetail.merchantDto?.logo"
          :name="repairRecordDetail.merchantDto?.name"
        />
      </dd>
      <dt>Mileage</dt>
      <dd>{{ repairRecordDetail.mileage }} km</dd>
      <dt>Date</dt>
      <dd>{{ getDateWithDDMMMYYYYhhmma(repairRecordDetail.date) }}</dd>
      <dt>Note</dt>
      <dd>{{ repairRecordDetail.note || '-' }}</dd>
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
          {{ repairRecordDetail.expenseItemDtos?.length || '0' }}
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
        <template v-if="repairRecordDetail.expenseItemDtos?.length">
          <template
            v-for="record in repairRecordDetail.expenseItemDtos"
            :key="record.id"
          >
            <!-- body -->
            <el-row
              :class="{ 'bg-status-colours-light-blue': record.isExpand }"
              @click.stop="record.isExpand = !record.isExpand"
            >
              <el-col :span="1">
                <el-image
                  v-if="record.aiRepairItemDto.id"
                  :src="record.isExpand ? ExpandIcon : CollapseIcon"
                  class="h-16 w-16 cursor-pointer"
                  fit="cover"
                  @click.stop="record.isExpand = !record.isExpand"
                />
              </el-col>
              <el-col :span="6">{{ record.name }}</el-col>
              <el-col :span="3">{{ record.category }}</el-col>
              <el-col :span="3">
                {{ getFormatNumberString(record.unitPrice) }}
              </el-col>
              <el-col :span="2">{{ record.quantity }}</el-col>
              <el-col :span="3">
                {{ getFormatNumberString(record.discount) }}
              </el-col>
              <el-col :span="3">{{ getFormatNumberString(record.gst) }}</el-col>
              <el-col :span="3" class="row-center">
                <el-image
                  v-if="record.aiRepairItemDto.level === AI_COST_LEVEL.HIGH"
                  :src="UpIcon"
                  class="mr-8 h-16 w-16"
                  fit="cover"
                />
                <el-image
                  v-else-if="record.aiRepairItemDto.level === AI_COST_LEVEL.LOW"
                  :src="DownIcon"
                  class="mr-8 h-16 w-16"
                  fit="cover"
                />
                <span>${{ getFormatNumberString(record.totalAmount) }}</span>
              </el-col>
            </el-row>
            <!-- expand row -->
            <el-row
              v-if="record.aiRepairItemDto.id && record.isExpand"
              :class="[
                'is-expand',
                { 'bg-neutrals-off-white': record.isExpand },
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
                  <i
                    class="icon-edit-line text-16 text-neutrals-grey-3"
                    @click="handleOpenEditEstimatedCostDialog(record)"
                  />
                </div>
                <div>
                  <el-image
                    v-if="record.aiRepairItemDto.level === AI_COST_LEVEL.HIGH"
                    :src="UpIcon"
                    class="mr-8 h-16 w-16"
                    fit="cover"
                  />
                  <el-image
                    v-else-if="
                      record.aiRepairItemDto.level === AI_COST_LEVEL.LOW
                    "
                    :src="DownIcon"
                    class="mr-8 h-16 w-16"
                    fit="cover"
                  />
                  <span
                    :class="{
                      'text-status-colours-red':
                        record.aiRepairItemDto.level === -1,
                      'text-status-colours-green':
                        record.aiRepairItemDto.level === 2,
                    }"
                  >
                    {{ record.aiRepairItemDto.ratio }} %
                  </span>
                  <p
                    class="heading-body-body-12px-medium text-neutrals-off-black"
                  >
                    {{ record.aiRepairItemDto.remark }}
                  </p>
                </div>
              </el-col>
            </el-row>
          </template>
          <!-- billing summary row -->
          <el-row class="billing-summary">
            <el-col :span="12" />
            <el-col :span="12">
              <div class="mb-12 flex w-full flex-col gap-16">
                <!-- item -->
                <dl
                  class="grid grid-cols-[1fr_auto] gap-x-8 gap-y-16 px-8 pt-12"
                >
                  <dt>Subtotal (Excluding Tax)</dt>
                  <dd>
                    <span class="text-neutrals-off-black">
                      {{ getFormatNumberString(subtotal) }}
                    </span>
                  </dd>
                  <dt>Discount Amount</dt>
                  <dd>
                    <span class="text-neutrals-off-black">
                      {{ getFormatNumberString(repairRecordDetail.discount) }}
                    </span>
                  </dd>
                  <dt>Subtotal with Discount Applied</dt>
                  <dd>
                    <span class="text-neutrals-off-black">
                      {{ subtotalWithDiscount }}
                    </span>
                  </dd>
                  <dt>Tax</dt>
                  <dd>
                    <span class="text-neutrals-off-black">
                      {{ getFormatNumberString(repairRecordDetail.gst) }}
                    </span>
                  </dd>
                </dl>
                <el-divider />
                <!-- Total Amount (SGD) -->
                <div class="flex-between text-neutrals-off-black px-8">
                  <p class="heading-body-large-body-14px-medium">
                    Total Amount (SGD)
                  </p>
                  <span class="heading-body-large-body-14px-medium">
                    ${{ getFormatNumberString(repairRecordDetail.totalCost) }}
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
                        1 SGD = {{ repairRecordDetail.rate }}
                        {{ repairRecordDetail.currency }}
                      </span>
                      <!-- TODO 10/24, 月姐说暂时没有修改汇率的功能 -->
                      <!--<i class="icon-edit-line text-16 text-neutrals-grey-3" />-->
                    </div>
                  </div>
                  <div class="flex-between text-neutrals-off-black">
                    <p class="heading-body-large-body-14px-medium">
                      Total Amount ({{ repairRecordDetail.currency }})
                    </p>
                    <span class="heading-body-large-body-14px-medium">
                      ${{ totalCostWithExchangeRate }}
                    </span>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </template>
        <el-empty v-else description="No expense record data" />
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
            {{ repairRecordDetail.ticketDtos?.length || '-' }}
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
      <!-- bills grid view -->
      <div
        class="mx-32 grid grid-cols-2 gap-12"
        v-if="repairRecordDetail.ticketDtos?.length"
      >
        <file-info-card
          v-for="item in repairRecordDetail.ticketDtos"
          :key="item.id"
          :info="item"
        />
      </div>
      <el-empty v-else description="No bill data" />
    </div>
    <!-- Attachments -->
    <div class="mb-24">
      <!-- header -->
      <div class="flex-between mx-32 h-24">
        <div class="row-center flex gap-8">
          <h3
            class="heading-body-large-body-14px-medium text-neutrals-off-black leading-20 row-center h-24"
          >
            Attachments
          </h3>
          <span
            class="heading-body-large-body-14px-medium text-neutrals-grey-3"
          >
            {{ repairRecordDetail.attachmentDtos?.length || 0 }}
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
      <div
        class="mx-32 grid grid-cols-2 gap-12"
        v-if="repairRecordDetail.attachmentDtos?.length"
      >
        <div
          class="mx-32 grid grid-cols-2 gap-12"
          v-if="repairRecordDetail.attachmentDtos?.length"
        >
          <file-info-card
            v-for="item in repairRecordDetail.attachmentDtos"
            :key="item.id"
            :info="item"
          />
        </div>
      </div>
      <el-empty v-else description="No attachment data" />
    </div>
    <!-- Logs & Note -->
    <div class="flex flex-col gap-8">
      <!-- header -->
      <h3
        class="heading-body-large-body-14px-medium text-neutrals-off-black row-center mx-32 h-24"
      >
        Logs & Note
      </h3>
      <!-- divider -->
      <el-divider />
      <!-- table -->
      <div class="mx-32">
        <el-table :data="logList" class="log-table-container">
          <el-table-column prop="date" label="Date" min-width="160" />
          <el-table-column prop="time" label="Time" min-width="120" />
          <el-table-column prop="user" label="User" min-width="160" />
          <el-table-column prop="action" label="Action" min-width="140" />
          <el-table-column label="Detail" min-width="220">
            <template #default="{ row }">
              <div v-if="row.action === 'Login'">
                <span>IP:</span>
                {{ row.detail.ip }}
                <span class="mx-8">|</span>
                <span>Device:</span>
                {{ row.detail.device }}
              </div>
              <div v-else-if="row.action === 'Create Order'">
                <span>Order No.</span>
                {{ row.detail.orderNo }}
              </div>
              <div v-else>
                {{ row.detailText ?? '' }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </section>
  <!-- 编辑预估成本的弹窗  -->
  <base-dialog
    v-model="dialogEditEstimatedCostVisible"
    title="Edit Cost Analysis"
    confirm-text="Save"
    @cancel="handleCloseEditEstimatedCostDialog"
    @confirm="handleEditEstimatedCostForm"
    :show-close-button="true"
  >
    <template #content>
      <el-form
        :model="editEstimatedCostForm"
        ref="editEstimatedCostFormRef"
        :rules="editEstimatedCostFormRules"
        label-position="top"
        class="input--underline el-form-item--inline"
        hide-required-asterisk
      >
        <!-- Title -->
        <el-form-item label="Market Average ($)" prop="cost">
          <el-input
            v-model="editEstimatedCostForm.cost"
            placeholder="Enter title"
          />
        </el-form-item>

        <!-- Content -->
        <el-form-item label="Description" prop="description">
          <el-input
            v-model="editEstimatedCostForm.description"
            placeholder="Enter content"
          />
        </el-form-item>
      </el-form>
    </template>
  </base-dialog>
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

/* TODO 无日志数据, 文字暂时置灰 */
.log-table-container {
  :deep(.el-table__row) {
    @apply text-neutrals-grey-2;
  }
}
</style>
