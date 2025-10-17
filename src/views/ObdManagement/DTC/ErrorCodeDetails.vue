<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useSessionStorage } from '@vueuse/core'

import BaseTag from '@/components/BaseTag.vue'
import BaseDialog from '@/components/BaseDialog.vue'
import emitter from '@/utils/emitterUtil.js'
import { EmitterEvent } from '@/utils/constantsUtil.js'
import { getFaultCodeInfoApi } from '@/apis/obdApi.js'

// 错误码
const faultCode = ref('')

// 错误码名称
const faultCodeName = ref('')

// 车辆id
const vehicleId = ref('')

// edu 名称
const ecuName = ref('')

// 修改维修重要性等级弹窗
const dialogRepairImportanceLevelVisible = ref(false)

// 修改预估成本弹窗
const dialogEstimatedCostVisible = ref(false)

// 重要性等级表单
const repairImportanceLevelForm = reactive({
  level: '',
  description: '',
})

// 修改预估成本表单
const estimatedCostForm = reactive({
  currency: '',
  partMin: '',
  partMax: '',
  labourMin: '',
  labourMax: '',
  totalMin: '',
  totalMax: '',
})

// 错误码详情
const errorCodeInfo = ref({})

// part 数组
const partArray = computed(() => errorCodeInfo.value.part.split('-'))

// labour 数组
const labourArray = computed(() => errorCodeInfo.value.labour.split('-'))

// total 数组
const totalArray = computed(() => errorCodeInfo.value.total.split('-'))

// 加载状态
const loading = ref(false)

// 错误码详情参数
const faultCodeData = useSessionStorage('faultData', {
  code: '',
  title: '',
  vehicleId: '',
  dtcName: '',
})

// 修改维修重要性等级
const handleModifyRepairImportanceLevel = async () => {}

// 修改预估成本
const handleModifyEstimatedCost = async () => {}

// 获取DTC描述
const getErrorCodeDescription = async () => {
  loading.value = true
  try {
    const { data } = await getFaultCodeInfoApi({
      vehicleId: vehicleId.value,
      code: faultCode.value,
      title: faultCodeName.value,
      dtcName: ecuName.value,
    })
    // 错误码详情
    errorCodeInfo.value = data
    // 回显part
    const partArray = errorCodeInfo.value.part.split('-')
    estimatedCostForm.partMin = partArray[0]
    estimatedCostForm.partMax = partArray[1]
    errorCodeInfo.value.partMin = partArray[0]
    errorCodeInfo.value.partMax = partArray[1]
    // 回显labour
    const labourArray = errorCodeInfo.value.labour.split('-')
    estimatedCostForm.labourMin = labourArray[0]
    estimatedCostForm.labourMax = labourArray[1]
    errorCodeInfo.value.labourMin = labourArray[0]
    errorCodeInfo.value.labourMax = labourArray[1]
    // 回显total
    const totalArray = errorCodeInfo.value.total.split('-')
    estimatedCostForm.totalMin = totalArray[0]
    estimatedCostForm.totalMax = totalArray[1]
    errorCodeInfo.value.totalMin = totalArray[0]
    errorCodeInfo.value.totalMax = totalArray[1]
    // 回显 repair importance
    repairImportanceLevelForm.level = errorCodeInfo.value.level
    repairImportanceLevelForm.description = errorCodeInfo.value.levelDescription
  } finally {
    loading.value = false
  }
}

// 监听事件
emitter.on(EmitterEvent.GET_ERROR_CODE_INITIAL_DATA, (data) => {
  faultCode.value = data.code
  faultCodeName.value = data.title
  vehicleId.value = data.vehicleId
  ecuName.value = data.dtcName
  // 获取DTC描述
  getErrorCodeDescription()
})

onMounted(() => {
  faultCode.value = faultCodeData.value.code
  faultCodeName.value = faultCodeData.value.title
  vehicleId.value = faultCodeData.value.vehicleId
  ecuName.value = faultCodeData.value.dtcName
  // 获取DTC描述
  getErrorCodeDescription()
})

onBeforeUnmount(() => {
  emitter.off(EmitterEvent.GET_ERROR_CODE_INITIAL_DATA)
  // 清空faultData
  faultCodeData.value = {}
})
</script>

<template>
  <section class="flex flex-col gap-16" v-loading="loading">
    <h2
      class="row-center heading-h2-20px-medium text-neutrals-off-black mx-32 h-32"
    >
      {{ errorCodeInfo.code }}
    </h2>
    <el-divider />
    <div class="flex flex-col gap-24">
      <!-- info -->
      <div class="mx-32 flex flex-col gap-4">
        <!-- description -->
        <div class="h-49 grid grid-cols-[112px_1fr_16px] items-center gap-4">
          <span class="heading-body-body-12px-medium text-neutrals-grey-3">
            Description
          </span>
          <span
            class="leading-16 heading-body-body-12px-regular text-neutrals-off-black"
          >
            {{ errorCodeInfo.description }}
          </span>
          <i class="icon-edit-line text-16" />
        </div>
        <!-- Possible Symptoms -->
        <div class="h-49 grid grid-cols-[112px_1fr_16px] items-center gap-4">
          <span class="heading-body-body-12px-medium text-neutrals-grey-3">
            Possible Symptoms
          </span>
          <span
            class="leading-16 heading-body-body-12px-regular text-neutrals-off-black"
          >
            {{ errorCodeInfo.symptoms }}
          </span>
          <i class="icon-edit-line text-16" />
        </div>
      </div>
      <!-- Repair Importance Level -->
      <div class="flex flex-col gap-8">
        <!-- header -->
        <div class="flex-between mx-32 h-24">
          <h3
            class="heading-body-large-body-14px-medium text-neutrals-off-black"
          >
            Repair Importance Level
          </h3>
          <i
            class="icon-edit-line text-16 cursor-pointer"
            @click="dialogRepairImportanceLevelVisible = true"
          />
        </div>
        <!-- divider -->
        <el-divider />
        <!-- content -->
        <div class="mx-32 flex flex-col gap-4">
          <!-- level -->
          <div class="row-center h-32 gap-8">
            <span
              class="heading-body-body-12px-medium text-neutrals-grey-3 w-112"
            >
              Level
            </span>
            <base-tag
              :text="
                errorCodeInfo.level === 0
                  ? 'Low'
                  : errorCodeInfo.level === 1
                    ? 'Medium'
                    : 'High'
              "
              :color="
                errorCodeInfo.level === 0
                  ? 'green'
                  : errorCodeInfo.level === 1
                    ? 'orange'
                    : 'red'
              "
            />
          </div>
          <!-- description -->
          <div class="row-center h-49 gap-8">
            <span
              class="heading-body-body-12px-medium text-neutrals-grey-3 w-112"
            >
              Description
            </span>
            <p class="heading-body-body-12px-regular text-neutrals-off-black">
              {{ errorCodeInfo.levelDescription }}
            </p>
          </div>
        </div>
      </div>
      <!-- Estimated Cost -->
      <div class="flex flex-col gap-8">
        <!-- header -->
        <div class="flex-between mx-32 h-24">
          <h3
            class="heading-body-large-body-14px-medium text-neutrals-off-black"
          >
            Estimated Cost
          </h3>
          <i
            class="icon-edit-line text-16 cursor-pointer"
            @click="dialogEstimatedCostVisible = true"
          />
        </div>
        <!-- divider -->
        <el-divider />
        <!-- content -->
        <dl class="mx-32 grid grid-cols-[112px_1fr_112px_1fr] gap-8">
          <dt>Estimated Cost</dt>
          <dd>{{ errorCodeInfo.part }}</dd>
          <dt>Labour</dt>
          <dd>{{ errorCodeInfo.labour }}</dd>
          <dt>Total</dt>
          <dd>{{ errorCodeInfo.total }}</dd>
        </dl>
      </div>
    </div>
  </section>
  <!-- 修改维修重要性等级弹窗 -->
  <base-dialog
    v-model="dialogRepairImportanceLevelVisible"
    title="Edit Repair Importance Level"
    @cancel="dialogRepairImportanceLevelVisible = false"
    @confirm="handleModifyRepairImportanceLevel"
    confirm-text="Save"
  >
    <template #content>
      <el-form
        :model="repairImportanceLevelForm"
        label-width="112px"
        label-position="left"
        class="repair-importanceLevel-form"
      >
        <el-form-item label="Level">
          <el-radio-group v-model="repairImportanceLevelForm.level">
            <el-radio :value="0">
              <base-tag text="Low" color="green" />
            </el-radio>
            <el-radio :value="1">
              <base-tag text="Medium" color="orange" />
            </el-radio>
            <el-radio :value="2">
              <base-tag text="High" color="red" />
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Description">
          <el-input
            placeholder="Enter description"
            v-model="repairImportanceLevelForm.description"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
      </el-form>
    </template>
  </base-dialog>
  <!-- 编辑预估成本弹窗 -->
  <base-dialog
    v-model="dialogEstimatedCostVisible"
    title="Edit Estimated Cost"
    @cancel="dialogEstimatedCostVisible = false"
    @confirm="handleModifyEstimatedCost"
    confirm-text="Save"
  >
    <template #content>
      <el-form
        :model="repairImportanceLevelForm"
        label-width="112px"
        label-position="left"
        class="estimated-cost-form"
      >
        <el-form-item label="Currency">
          <el-select
            v-model="estimatedCostForm.currency"
            placeholder="Select currency"
          >
            <el-option label="SGD ($)" value="SGD" />
            <el-option label="MYR (RM)" value="MYR" />
            <el-option label="THB (฿)" value="THB" />
            <el-option label="IDR (Rp)" value="IDR" />
            <el-option label="CNY (¥)" value="CNY" />
          </el-select>
        </el-form-item>
        <el-form-item label="Part">
          <div class="flex items-center gap-16">
            <el-input v-model="estimatedCostForm.partMin" placeholder="Min" />
            <span class="heading-body-body-12px-medium text-neutrals-grey-3">
              to
            </span>
            <el-input v-model="estimatedCostForm.partMax" placeholder="Max" />
          </div>
        </el-form-item>
        <el-form-item label="Labour">
          <div class="flex items-center gap-16">
            <el-input v-model="estimatedCostForm.labourMin" placeholder="Min" />
            <span class="heading-body-body-12px-medium text-neutrals-grey-3">
              to
            </span>
            <el-input v-model="estimatedCostForm.labourMax" placeholder="Max" />
          </div>
        </el-form-item>
        <el-form-item label="Total">
          <div class="flex items-center gap-16">
            <el-input v-model="estimatedCostForm.totalMin" placeholder="Min" />
            <span class="heading-body-body-12px-medium text-neutrals-grey-3">
              to
            </span>
            <el-input v-model="estimatedCostForm.totalMax" placeholder="Max" />
          </div>
        </el-form-item>
      </el-form>
    </template>
  </base-dialog>
</template>

<style scoped lang="scss">
.repair-importanceLevel-form :deep(.el-textarea__inner) {
  border: none; /* 去掉默认边框 */
  border-bottom: 1px solid #dcdfe6; /* 只保留底部边框 */
  border-radius: 0; /* 去掉圆角 */
  box-shadow: none;
}

.estimated-cost-form :deep(.el-select__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
}

.estimated-cost-form :deep(.el-select__wrapper::after) {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background-color: var(--el-input-border-color, var(--el-border-color));
  pointer-events: none;
}

.estimated-cost-form :deep(.el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
}

.estimated-cost-form :deep(.el-input__wrapper::after) {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background-color: var(--el-input-border-color, var(--el-border-color));
  pointer-events: none;
}
</style>
