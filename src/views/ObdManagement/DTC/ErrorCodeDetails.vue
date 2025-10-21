<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useCloned, useSessionStorage } from '@vueuse/core'
import { ElMessage } from 'element-plus'

import BaseTag from '@/components/BaseTag.vue'
import { editFaultCodeInfoApi, getFaultCodeInfoApi } from '@/apis/obdApi.js'
import { getDateWithDDMMMYYYYhhmma } from '@/utils/dateUtil.js'

defineProps({
  vehicleId: {
    type: String,
    required: true,
  },
  faultCode: {
    type: String,
    required: true,
  },
  ecuName: {
    type: String,
    required: true,
  },
  faultCodeInfo: {
    type: Object,
    required: true,
  },
})

// 错误码
const faultCode = ref('')

// 错误码名称
const faultCodeName = ref('')

// 车辆id
const vehicleId = ref('')

// edu 名称
const ecuName = ref('')

// 修改预估成本表单
const errorCodeForm = reactive({
  description: '',
  symptoms: '',
  levelDescription: '',
  part: '',
  labour: '',
  total: '',
  level: '',
  partMin: '',
  partMax: '',
  labourMin: '',
  labourMax: '',
  totalMin: '',
  totalMax: '',
})

// 错误码详情
const errorCodeInfo = ref({})

// 加载状态
const loading = ref(false)

// 错误码详情参数
const faultCodeData = useSessionStorage('faultData', {
  code: '',
  title: '',
  vehicleId: '',
  dtcName: '',
})

// 描述修改状态
const isDescriptionModified = ref(false)

// 预计状态的修改状态
const isPossibleSymptomsModified = ref(false)

// 维修重要性等级的修改状态
const isRepairImportanceLevelModified = ref(false)

// 预计成本的修改状态
const isEstimatedCostModified = ref(false)

// 修改AI故障信息
const handleModifyAIFaultInfo = async () => {
  await editFaultCodeInfoApi({
    faultCodeId: errorCodeInfo.value.id,
    code: faultCode.value,
    title: faultCodeName.value,
    dtcName: ecuName.value,
    description: errorCodeForm.description,
    symptoms: errorCodeForm.symptoms,
    levelDescription: errorCodeForm.levelDescription,
    part: `${errorCodeForm.partMin}-${errorCodeForm.partMax}`,
    labour: `${errorCodeForm.labourMin}-${errorCodeForm.labourMax}`,
    total: `${errorCodeForm.totalMin}-${errorCodeForm.totalMax}`,
    level: errorCodeForm.level,
  })
  // 修改成功
  ElMessage.success('Saved successfully')
  // 刷新
  getErrorCodeDescription()
  // 重置修改状态
  isDescriptionModified.value && (isDescriptionModified.value = false)
  isPossibleSymptomsModified.value && (isPossibleSymptomsModified.value = false)
  isRepairImportanceLevelModified.value &&
    (isRepairImportanceLevelModified.value = false)
  isEstimatedCostModified.value && (isEstimatedCostModified.value = false)
}

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
    // 回显详情
    const { cloned } = useCloned(data)
    Object.assign(errorCodeForm, cloned.value)
    // 回显part
    const partArray = errorCodeInfo.value.part.split('-')
    errorCodeForm.partMin = partArray[0]
    errorCodeForm.partMax = partArray[1]
    // 回显labour
    const labourArray = errorCodeInfo.value.labour.split('-')
    errorCodeForm.labourMin = labourArray[0]
    errorCodeForm.labourMax = labourArray[1]
    // 回显total
    const totalArray = errorCodeInfo.value.total.split('-')
    errorCodeForm.totalMin = totalArray[0]
    errorCodeForm.totalMax = totalArray[1]
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  faultCode.value = faultCodeData.value.code
  faultCodeName.value = faultCodeData.value.title
  vehicleId.value = faultCodeData.value.vehicleId
  ecuName.value = faultCodeData.value.dtcName
  // 获取DTC描述
  getErrorCodeDescription()
})

onBeforeUnmount(() => {
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
      <div class="info-container mx-32 flex flex-col gap-4">
        <dl
          class="grid h-32 grid-cols-[112px_1fr_112px_1fr] items-center gap-8"
        >
          <dt>
            <span class="heading-body-body-12px-medium text-neutrals-grey-3">
              Code Name
            </span>
          </dt>
          <dd>{{ errorCodeInfo.title }}</dd>
          <dt>
            <span class="heading-body-body-12px-medium text-neutrals-grey-3">
              Date
            </span>
          </dt>
          <dd>{{ getDateWithDDMMMYYYYhhmma(errorCodeInfo.createTime) }}</dd>
        </dl>
        <!-- description -->
        <div
          class="min-h-49 grid grid-cols-[112px_1fr_16px] items-center gap-4"
        >
          <span class="heading-body-body-12px-medium text-neutrals-grey-3">
            Description
          </span>
          <span
            class="leading-16 heading-body-body-12px-regular text-neutrals-off-black"
            v-if="!isDescriptionModified"
          >
            {{ errorCodeInfo.description }}
          </span>
          <el-input
            v-else
            v-model="errorCodeForm.description"
            type="textarea"
            rows="3"
            placeholder="Type Here"
            class="w-full"
          />
          <i
            class="icon-edit-line text-16 cursor-pointer"
            @click="isDescriptionModified = true"
            v-show="!isDescriptionModified"
          />
        </div>
        <!-- description confirm button-->
        <div class="flex-end flex h-24" v-show="isDescriptionModified">
          <el-button @click="isDescriptionModified = false" size="small">
            Cancel
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="handleModifyAIFaultInfo"
          >
            Save
          </el-button>
        </div>
        <!-- Possible Symptoms -->
        <div
          class="min-h-49 grid grid-cols-[112px_1fr_16px] items-center gap-4"
        >
          <span class="heading-body-body-12px-medium text-neutrals-grey-3">
            Possible Symptoms
          </span>
          <span
            class="leading-16 heading-body-body-12px-regular text-neutrals-off-black"
            v-if="!isPossibleSymptomsModified"
          >
            {{ errorCodeInfo.symptoms }}
          </span>
          <el-input
            v-else
            v-model="errorCodeForm.symptoms"
            type="textarea"
            rows="3"
            placeholder="Type Here"
            class="w-full"
          />
          <i
            class="icon-edit-line text-16 cursor-pointer"
            @click="isPossibleSymptomsModified = true"
            v-show="!isPossibleSymptomsModified"
          />
        </div>
        <!-- Possible Symptoms confirm button-->
        <div class="flex-end flex h-24" v-show="isPossibleSymptomsModified">
          <el-button @click="isPossibleSymptomsModified = false" size="small">
            Cancel
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="handleModifyAIFaultInfo"
          >
            Save
          </el-button>
        </div>
      </div>
      <!-- Repair Importance Level -->
      <div class="repair-importanceLevel-form flex flex-col gap-8">
        <!-- header -->
        <div class="flex-between mx-32 h-24">
          <h3
            class="heading-body-large-body-14px-medium text-neutrals-off-black"
          >
            Repair Importance Level
          </h3>
          <i
            class="icon-edit-line text-16 cursor-pointer"
            @click="isRepairImportanceLevelModified = true"
            v-if="!isRepairImportanceLevelModified"
          />
          <div class="flex gap-8" v-else>
            <el-button
              @click="isRepairImportanceLevelModified = false"
              size="small"
              v-if="isRepairImportanceLevelModified"
            >
              Cancel
            </el-button>
            <el-button
              size="small"
              type="primary"
              @click="handleModifyAIFaultInfo"
            >
              Save
            </el-button>
          </div>
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
              v-if="!isRepairImportanceLevelModified"
            />
            <div class="flex-1" v-else>
              <el-radio-group
                v-model="errorCodeForm.level"
                class="w-full gap-8"
              >
                <el-radio :value="0" class="flex-1">
                  <base-tag text="Low" color="green" />
                </el-radio>
                <el-radio :value="1" class="flex-1">
                  <base-tag text="Medium" color="orange" />
                </el-radio>
                <el-radio :value="2" class="flex-1">
                  <base-tag text="High" color="red" />
                </el-radio>
              </el-radio-group>
            </div>
          </div>
          <!-- description -->
          <div class="row-center min-h-49 gap-8">
            <span
              class="heading-body-body-12px-medium text-neutrals-grey-3 w-112"
            >
              Description
            </span>
            <p
              class="heading-body-body-12px-regular text-neutrals-off-black"
              v-if="!isRepairImportanceLevelModified"
            >
              {{ errorCodeInfo.levelDescription }}
            </p>
            <el-input
              v-else
              v-model="errorCodeForm.levelDescription"
              type="textarea"
              rows="3"
              placeholder="Type Here"
              class="w-full"
            />
          </div>
        </div>
      </div>
      <!-- Estimated Cost -->
      <div class="estimated-cost-form flex flex-col gap-8">
        <!-- header -->
        <div class="flex-between mx-32 h-24">
          <h3
            class="heading-body-large-body-14px-medium text-neutrals-off-black"
          >
            Estimated Cost
          </h3>
          <i
            class="icon-edit-line text-16 cursor-pointer"
            @click="isEstimatedCostModified = true"
            v-if="!isEstimatedCostModified"
          />
          <!-- Possible Symptoms confirm button-->
          <div class="flex-end flex h-24" v-else>
            <el-button @click="isEstimatedCostModified = false" size="small">
              Cancel
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="handleModifyAIFaultInfo"
            >
              Save
            </el-button>
          </div>
        </div>
        <!-- divider -->
        <el-divider />
        <!-- content -->
        <dl
          class="mx-32 grid grid-cols-[112px_1fr_112px_1fr] items-center gap-8"
        >
          <dt>Estimated Cost</dt>
          <dd>
            <span v-if="!isEstimatedCostModified">
              {{ errorCodeInfo.part }}
            </span>
            <div class="flex items-center gap-16" v-else>
              <el-input v-model="errorCodeForm.partMin" placeholder="Min" />
              <span class="heading-body-body-12px-medium text-neutrals-grey-3">
                to
              </span>
              <el-input v-model="errorCodeForm.partMax" placeholder="Max" />
            </div>
          </dd>

          <dt>Labour</dt>
          <dd>
            <span v-if="!isEstimatedCostModified">
              {{ errorCodeInfo.labour }}
            </span>
            <div class="flex items-center gap-16" v-else>
              <el-input v-model="errorCodeForm.labourMin" placeholder="Min" />
              <span class="heading-body-body-12px-medium text-neutrals-grey-3">
                to
              </span>
              <el-input v-model="errorCodeForm.labourMax" placeholder="Max" />
            </div>
          </dd>

          <dt>Total</dt>
          <dd>
            <span v-if="!isEstimatedCostModified">
              {{ errorCodeInfo.total }}
            </span>
            <div class="flex items-center gap-16" v-else>
              <el-input v-model="errorCodeForm.totalMin" placeholder="Min" />
              <span class="heading-body-body-12px-medium text-neutrals-grey-3">
                to
              </span>
              <el-input v-model="errorCodeForm.totalMax" placeholder="Max" />
            </div>
          </dd>
        </dl>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.repair-importanceLevel-form :deep(.el-textarea__inner) {
  background-color: transparent !important;
  border: none; /* 去掉默认边框 */
  border-bottom: 1px solid #dcdfe6; /* 只保留底部边框 */
  border-radius: 0; /* 去掉圆角 */
  box-shadow: none;
}

// 重置 el-textarea 的样式
.info-container :deep(.el-textarea) {
  .el-textarea__inner {
    @apply rounded-12 bg-[#EAEEF480];
  }
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
