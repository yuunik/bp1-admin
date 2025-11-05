<script setup>
import { nextTick } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { getBrandOemRealTimeInfoApi } from '@/apis/appApi.js'
import { TimingPreset } from '@/utils/constantsUtil.js'

const drawerPredictionOemVisible = defineModel({
  required: true,
})

const { predictionItem } = defineProps({
  predictionItem: {
    type: Object,
    required: true,
  },
})

const predictOemList = computed(() =>
  predictionItem.predictionOemDtos &&
  predictionItem.predictionOemDtos.length > 0
    ? predictionItem.predictionOemDtos
    : [],
)

// 品牌的OEM实时信息列表
const oemList = ref([])

// 搜索关键字
const searchKey = ref('')

// oem 数据框实例
const oemDataRef = ref(null)

// logo加载失败的回退行为
const onErrorImage = () => true

// 处理跨行
const handleTableSpan = ({ row, columnIndex }) => {
  if (row.isDraft) {
    // 新增状态下,
    if (columnIndex === 3) {
      return [1, 2]
    }
    if (columnIndex === 4) {
      return [0, 0]
    }
  } else if (row.isEdit) {
    // 编辑状态下,
    if (columnIndex === 3) {
      return [1, 2]
    }
    if (columnIndex === 4) {
      return [0, 0]
    }
  }
}

// 新增一行, 并默认设置为草稿
const handleAddOEMItem = async () =>
  predictOemList.value.push({
    string: '',
    oemEcu: '',
    isDraft: true,
  })

// 获取品牌的OEM实时信息列表
const getOemList = useDebounceFn(async () => {
  const { data } = await getBrandOemRealTimeInfoApi({
    brand: predictionItem.brand,
    searchKey: searchKey.value,
  })
  oemList.value = data
}, TimingPreset.DEBOUNCE)

// 添加待添加的oem子项
const handleAddPendingOemSubitem = (row, oemRow) => {
  row.ecuName = oemRow.ecuName
  row.dataName = oemRow.labelName
  // 添加成功后, 关闭数据框
  nextTick(() => oemDataRef.value?.handleClose())
}

// 组件挂载后, 获取OEM实时信息列表
getOemList()
</script>

<template>
  <el-drawer
    v-model="drawerPredictionOemVisible"
    size="67%"
    :show-close="false"
    class="custom-drawer"
    :close-on-click-modal="false"
  >
    <!-- leading -->
    <i
      class="icon-mail-send-line text-20 row-center ml-32 mt-24 h-24 cursor-pointer"
      @click="drawerPredictionOemVisible = false"
    />
    <!-- header -->
    <h2
      class="row-center heading-h2-20px-medium text-neutrals-off-black mx-32 h-32"
    >
      {{ predictionItem.name }}
    </h2>
    <!-- divider -->
    <el-divider />
    <!-- Strings table -->
    <div>
      <!-- Strings -->
      <div class="items-center-safe mx-32 flex h-24 gap-8">
        <h3 class="heading-body-large-body-14px-medium text-neutrals-off-black">
          Strings
        </h3>
        <!-- Strings 数量 -->
        <span class="heading-body-large-body-14px-medium text-neutrals-grey-3">
          {{ predictOemList.length }}
        </span>
      </div>
      <!-- 分割线 -->
      <el-divider class="mt-8" />
      <!-- 预测数据列表 -->
      <div class="table-container mx-32">
        <el-table
          :data="predictOemList"
          :span-method="handleTableSpan"
          class="bg-transparent"
        >
          <!-- 选择框 -->
          <el-table-column type="selection" min-width="7%" />
          <!-- 序号 -->
          <el-table-column type="index" label="No." min-width="6%" />
          <!-- OEM Strings -->
          <el-table-column prop="remark" label="Strings" min-width="25%">
            <template #default="{ row }">
              <!-- 编辑模式 -->
              <el-input
                v-if="row.isEdit || row.isDraft"
                v-model="row.remark"
                class="input--bg-neutrals-grey-1 rounded-12"
                placeholder="Type here"
              />
              <!-- 非编辑模式 -->
              <span v-else>{{ row.remark || '-' }}</span>
            </template>
          </el-table-column>
          <!-- ECU Name -->
          <el-table-column prop="ecuName" label="ECU Name" min-width="25%">
            <template #default="{ row }">
              <el-dropdown
                trigger="click"
                v-if="row.isEdit || row.isDraft"
                placement="bottom-start"
                class="w-full"
                ref="oemDataRef"
              >
                <el-input
                  v-model="row.ecuName"
                  class="input--bg-neutrals-grey-1 rounded-12 cursor-pointer!"
                  readonly
                  placeholder="Select OEM/ECU"
                >
                  <template #suffix>
                    <i class="icon-typesdropdown" />
                  </template>
                </el-input>
                <template #dropdown>
                  <div class="w-600 max-h-336">
                    <el-input
                      class="input--without-border h-39 input--no-padding px-16 py-8"
                      placeholder="Enter"
                      v-model="searchKey"
                      @input="getOemList"
                    >
                      <template #prefix>
                        <i class="icon-mail-send-line-1" />
                      </template>
                    </el-input>
                    <el-divider />
                    <div class="px-16 py-8">
                      <el-table :data="oemList" class="bg-transparent">
                        <!-- ECU Name -->
                        <el-table-column
                          prop="ecuName"
                          label="ECU Name"
                          min-width="35%"
                        >
                          <template #default="{ row }">
                            <span class="wrap-text">
                              {{ row.ecuName || '-' }}
                            </span>
                          </template>
                        </el-table-column>

                        <!-- DATA Name -->
                        <el-table-column
                          prop="labelName"
                          label="DATA Name"
                          min-width="35%"
                        >
                          <template #default="{ row }">
                            <span class="wrap-text">
                              {{ row.labelName || '-' }}
                            </span>
                          </template>
                        </el-table-column>

                        <!-- Unit -->
                        <el-table-column
                          prop="unit"
                          label="Unit"
                          min-width="18%"
                        >
                          <template #default="{ row }">
                            <span class="wrap-text">
                              {{ row.unit || '-' }}
                            </span>
                          </template>
                        </el-table-column>

                        <!-- 操作列 -->
                        <el-table-column label="" min-width="12%">
                          <template #default="scope">
                            <el-button
                              type="primary"
                              size="small"
                              @click="
                                handleAddPendingOemSubitem(row, scope.row)
                              "
                            >
                              Add
                            </el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </div>
                </template>
              </el-dropdown>
              <span v-else>{{ row.ecuName }}</span>
            </template>
          </el-table-column>
          <!-- ECU Name -->
          <el-table-column prop="dataName" label="DATA Name" min-width="25%" />
          <!-- Actions -->
          <el-table-column min-width="12%">
            <template #default="{ row }">
              <template v-if="!row.isEdit && !row.isDraft">
                <!-- 编辑 -->
                <i
                  class="icon-edit-line mr-8 cursor-pointer"
                  @click="row.isEdit = true"
                />
                <!-- 删除 -->
                <i class="icon-delete-bin-line cursor-pointer" />
              </template>
              <template v-else>
                <el-button type="primary" size="small">
                  {{ row.id ? 'Save' : 'Add' }}
                </el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <!-- 新增按钮 -->
        <el-button
          type="primary"
          text
          class="my-8 w-fit"
          @click="handleAddOEMItem"
        >
          <template #icon>
            <i class="icon-typesadd branding-colours-primary" />
          </template>
          <template #default>New Item</template>
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<style scoped lang="scss"></style>
