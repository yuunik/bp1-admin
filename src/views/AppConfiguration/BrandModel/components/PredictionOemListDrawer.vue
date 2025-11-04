<script setup>
import { getDateWithDDMMMYYYYhhmma } from '@/utils/dateUtil.js'
import BaseTag from '@/components/BaseTag.vue'
import { getFormatNumber, getFullFilePath } from '@/utils/dataFormattedUtil.js'
import DefaultLogo from '@/assets/specialIcons/maintenance-logo.svg'

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

// logo加载失败的回退行为
const onErrorImage = () => true
</script>

<template>
  <el-drawer
    v-model="drawerPredictionOemVisible"
    size="67%"
    :show-close="false"
  >
    <!-- leading -->
    <i class="icon-mail-send-line text-20 row-center ml-32 mt-24 h-24" />
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
        <el-table :data="predictOemList">
          <el-table-column type="selection" />
          <el-table-column type="index" label="No." />
          <!-- OEM 名称 -->
          <el-table-column prop=" " label="Icon" min-width="19%">
            <template #default="{ row }">
              <el-avatar
                :src="
                  row?.localLogo ? row.localLogo : getFullFilePath(row.logo)
                "
                :size="20"
                class="prediction logo"
                fit="cover"
                @error="onErrorImage"
              >
                <el-image :src="DefaultLogo" fit="cover" class="h-20 w-20" />
              </el-avatar>
              <!-- 编辑模式下, 可更换 logo -->
              <!--<el-upload-->
              <!--  class="row-center"-->
              <!--  :on-change="-->
              <!--    (uploadFile, _) =>-->
              <!--      handlePredictionIconChange(uploadFile, row)-->
              <!--  "-->
              <!--  :auto-upload="false"-->
              <!--  :show-file-list="false"-->
              <!--  v-show="row.isEdit"-->
              <!--&gt;-->
              <!--  <el-button type="primary" text>-->
              <!--    <template #icon>-->
              <!--      <i class="icon-upload-2-line branding-colours-primary" />-->
              <!--    </template>-->
              <!--    <template #default>Upload</template>-->
              <!--  </el-button>-->
              <!--</el-upload>-->
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column prop="name" label="Item Name" min-width="27%">
            <template #default="{ row }">
              <el-select
                v-if="row.isNew"
                v-model="row.name"
                class="select--bg-neutrals-grey-1"
                @change="(val) => handlePredictionItemNameChange(val, row)"
              >
                <el-option
                  v-for="predictionItem in predictBrandChildNameList"
                  :label="predictionItem.name"
                  :value="predictionItem.name"
                />
              </el-select>
              <span v-else>{{ row.name }}</span>
            </template>
          </el-table-column>
          <!-- Range -->
          <el-table-column prop="mileage" label="Range" min-width="18%">
            <template #default="{ row }">
              <el-input
                v-if="row.isEdit || row.isNew"
                v-model.number="row.mileage"
                placeholder="Type Here"
                class="input--bg-neutrals-grey-1"
              >
                <template #suffix>km</template>
              </el-input>
              <span v-else>{{ getFormatNumber(row.mileage) }} km</span>
            </template>
          </el-table-column>
          <!-- Time -->
          <el-table-column prop="day" label="Time" min-width="18%">
            <template #default="{ row }">
              <el-input
                v-if="row.isEdit || row.isNew"
                v-model.number="row.day"
                placeholder="Type Here"
                class="input--bg-neutrals-grey-1"
              >
                <template #suffix>day</template>
              </el-input>
              <span v-else>
                {{ getFormatNumber(row.day) }} day{{ row.day > 1 ? 's' : '' }}
              </span>
            </template>
          </el-table-column>
          <!-- Strings -->
          <el-table-column label="Strings" min-width="14%">
            <template #default="{ row }">
              {{ row.predictionOemDtos.length || '-' }}
            </template>
          </el-table-column>
          <!-- Actions -->
          <el-table-column min-width="4%">
            <template #default="{ row }">
              <template v-if="!row.isEdit && !row.isNew">
                <!-- 编辑 -->
                <i
                  class="icon-edit-line mr-8 cursor-pointer"
                  @click="handleSwitchToEditMode(row)"
                />
                <!-- 删除 -->
                <i class="icon-delete-bin-line cursor-pointer" />
              </template>
              <template v-else>
                <el-button
                  type="primary"
                  size="small"
                  @click="handlePredictionItemManage(row)"
                >
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
          @click="handleAddPredictBrand"
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
