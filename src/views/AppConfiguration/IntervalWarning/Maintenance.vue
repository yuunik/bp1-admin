<script setup>
import { reactive } from 'vue'

import {
  getMaintenanceListApi,
  modifyMaintenanceDataApi,
} from '@/apis/appApi.js'
import { getFormatNumber, getFullFilePath } from '@/utils/dataFormattedUtil.js'
import useFileUpload from '@/composables/useFileUpload.js'
import { useSort } from '@/composables/useSort.js'

// 保养数据默认图标
import DefaultLogo from '@/assets/specialIcons/maintenance-logo.svg'

// 保养数据
const maintenanceList = ref([])

// 条件搜索参数
const conditionParams = reactive({
  searchKey: '',
  sortBy: '',
  sort: '',
})

// 分页参数
const paginationParams = reactive({
  page: 0,
  total: 0,
  pageSize: 15,
})

// 获取保养数据列表
const getMaintenanceList = async () => {
  const { data } = await getMaintenanceListApi({
    ...conditionParams,
    ...paginationParams,
  })
  maintenanceList.value = data.map((item) => ({
    ...item,
    editing: false,
  }))
}

// logo加载失败的回退行为
const onErrorImage = () => true

// 新增待添加的保养项目
const addNewMaintenanceItem = () => {
  maintenanceList.push({
    name: '',
    mileage: '',
    date: '',
    editing: true,
  })
}

// 文件上传
const fileUpload = useFileUpload()

// 编辑保养数据
const handleEditMaintenanceData = async (row) => {
  // 如果有本地预览图片文件, 则保存
  if (row.localLogo) {
    row.logo = row.localLogo
  }
  await modifyMaintenanceDataApi(row)
  row.editing = false
}

// 保养数据图标上传
const handleMaintenanceIconChange = async (file, row) => {
  // 文件上传, 本地预览
  await fileUpload.handleValidateImageUpload(file)
  // 保存logo
  row.localLogo = fileUpload.localFilePath.value
}

// 排序函数
const sort = useSort(conditionParams, () => getMaintenanceList())

// 网络请求
getMaintenanceList()
</script>

<template>
  <div class="flex flex-col px-32">
    <!-- 保养数据表格 -->
    <el-table :data="maintenanceList" class="flex-1" @sort-change="sort">
      <!-- 序号 -->
      <el-table-column type="index" label="No." sortable="custom" />
      <!-- 图标 -->
      <el-table-column label="Icon">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-avatar
              :src="
                row?.localLogo ? row?.localLogo : getFullFilePath(row?.logo)
              "
              fit="cover"
              :size="20"
              @error="onErrorImage"
            >
              <el-image :src="DefaultLogo" fit="cover" class="h-20 w-20" />
            </el-avatar>
            <el-upload
              :on-change="
                (uploadFile, _) => handleMaintenanceIconChange(uploadFile, row)
              "
              :auto-upload="false"
              :show-file-list="false"
            >
              <el-button text v-if="row?.editing">
                <template #icon>
                  <i
                    class="icon-upload-2-line branding-colours-primary h-16 w-16"
                  />
                </template>
                <span class="branding-colours-primary">Upload</span>
              </el-button>
            </el-upload>
          </div>
        </template>
      </el-table-column>
      <!-- 保养数据名称 -->
      <el-table-column prop="name" label="Maintenance Item" sortable="custom">
        <template #default="{ row }">
          <template v-if="row?.editing">
            <el-input
              v-model="row.name"
              placeholder="Type Here"
              class="w-full"
            />
          </template>
          <template v-else>
            <span class="neutrals-off-black">{{ row.name }}</span>
          </template>
        </template>
      </el-table-column>
      <!-- 建议保养公里数 -->
      <el-table-column
        prop="mileage"
        label="Mileage Interval"
        sortable="custom"
      >
        <template #default="{ row }">
          <template v-if="row?.editing">
            <el-input
              v-model="row.mileage"
              placeholder="Type Here"
              class="w-full"
            >
              <template #suffix>
                <el-text type="info">km</el-text>
              </template>
            </el-input>
          </template>
          <template v-else>
            <span class="neutrals-off-black">
              {{ getFormatNumber(row?.mileage) }} km
            </span>
          </template>
        </template>
      </el-table-column>
      <!-- 保养时间 -->
      <el-table-column prop="date" label="Time Interval" :sortable="true">
        <template #default="{ row }">
          <template v-if="row?.editing">
            <el-input v-model="row.date" placeholder="Type Here" class="w-full">
              <template #suffix>
                <el-text type="info">day</el-text>
              </template>
            </el-input>
          </template>
          <template v-else>
            <span class="neutrals-off-black">{{ row.date }} days</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column>
        <template #default="{ row }">
          <template v-if="row?.editing">
            <el-button type="primary" @click="handleEditMaintenanceData(row)">
              Save
            </el-button>
          </template>
          <template v-else>
            <!-- 编辑 -->
            <i
              class="icon-edit-line mr-8 h-16 w-16 cursor-pointer"
              @click="row.editing = true"
            />
            <!-- 删除 -->
            <i class="icon-delete-bin-line h-16 w-16 cursor-pointer" />
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增按钮 -->
    <!--<el-button-->
    <!--  type="primary"-->
    <!--  text-->
    <!--  class="my-8 w-fit"-->
    <!--  @click="addNewMaintenanceItem"-->
    <!--&gt;-->
    <!--  <template #icon>-->
    <!--    <i class="icon-typesadd branding-colours-primary" />-->
    <!--  </template>-->
    <!--  <template #default>New Item</template>-->
    <!--</el-button>-->
  </div>
</template>

<style scoped lang="scss"></style>
