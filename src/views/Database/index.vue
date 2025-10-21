<script setup>
import DTCList from './DTCList.vue'
import PIDLiveData from './PIDLiveData.vue'
import DataAnalysis from './DataAnalysis.vue'

// 搜索表单
const searchForm = reactive({
  brandName: '',
  modelName: '',
  year: '',
  trim: '',
  engineTrans: '',
})

// 当前 tab 页
const activeTabName = ref('DTC List')

// tab 数组
const tabTabObj = Object.freeze({
  'DTC List': DTCList,
  'PID Live Data ': PIDLiveData,
  'Data Analysis ': DataAnalysis,
})
</script>

<template>
  <section class="database-container flex flex-col gap-16">
    <!-- 标题 -->
    <h3
      class="heading-h2-20px-medium text-neutrals-off-black row-center mx-32 h-32"
    >
      Database
    </h3>
    <!-- 搜索表单 -->
    <div class="mx-32 flex flex-col gap-8">
      <el-form
        :model="searchForm"
        inline
        label-width="100px"
        label-position="left"
        class="grid grid-cols-3 gap-x-24 gap-y-4"
      >
        <el-form-item label="Brand">
          <el-select v-model="searchForm.brandName">
            <el-option label="All" value=""></el-option>
            <el-option label="Audi" value="Audi"></el-option>
            <el-option label="BMW" value="BMW"></el-option>
            <el-option label="Mercedes" value="Mercedes"></el-option>
            <el-option label="Volkswagen" value="Volkswagen"></el-option>
            <el-option label="Volvo" value="Volvo"></el-option>
            <el-option label="Other" value="Other"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Model">
          <el-select v-model="searchForm.modelName">
            <el-option label="All" value=""></el-option>
            <el-option label="A1" value="A1"></el-option>
            <el-option label="A2" value="A2"></el-option>
            <el-option label="A3" value="A3"></el-option>
            <el-option label="A4" value="A4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Year">
          <el-select v-model="searchForm.year">
            <el-option label="All" value=""></el-option>
            <el-option label="2015" value="2015"></el-option>
            <el-option label="2016" value="2016"></el-option>
            <el-option label="2017" value="2017"></el-option>
            <el-option label="2018" value="2018"></el-option>
            <el-option label="2019" value="2019"></el-option>
            <el-option label="2020" value="2020"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Trim">
          <el-select v-model="searchForm.trim">
            <el-option label="All" value=""></el-option>
            <el-option label="Sedan" value="Sedan"></el-option>
            <el-option label="Hatchback" value="Hatchback"></el-option>
            <el-option label="Coupe" value="Coupe"></el-option>
            <el-option label="Convertible" value="Convertible"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Engine/Trans">
          <el-select v-model="searchForm.engineTrans">
            <el-option label="All" value=""></el-option>
            <el-option label="Manual" value="Manual"></el-option>
            <el-option label="Automatic" value="Automatic"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="flex h-32 justify-end gap-8">
        <el-button>Clear</el-button>
        <el-button type="primary">Search</el-button>
      </div>
    </div>
    <!-- tabs -->
    <el-tabs v-model="activeTabName" class="mt-8">
      <el-tab-pane label="DTC List" name="DTC List" />
      <el-tab-pane label="PID Live Data " name="PID Live Data " />
      <el-tab-pane label="Data Analysis " name="Data Analysis " />
    </el-tabs>
    <!-- content -->
    <div
      class="box-border flex flex-1 flex-col gap-16 overflow-auto px-32 pb-32"
    >
      <keep-alive>
        <component :is="tabTabObj[activeTabName]" />
      </keep-alive>
    </div>
  </section>
</template>

<style scoped lang="scss">
.database-container {
  // 重置下拉框样式
  :deep(.el-select__wrapper) {
    background-color: $neutrals-off-white;
    box-shadow: none !important;
    border: none !important;
    padding: 0 !important;
  }

  :deep(.el-select__wrapper::after) {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background-color: var(--el-input-border-color, var(--el-border-color));
    pointer-events: none;
  }

  // 重置 tab 的下划线
  :deep(.el-tabs__header) {
    border: none;
  }

  & > * {
    color: #ccc;
  }

  :deep(.el-table) {
    @apply text-[#ccc];
  }
}
</style>
