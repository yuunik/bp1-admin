<script setup>
import { useRoute } from 'vue-router'
import { ArrowDown, Plus } from '@element-plus/icons-vue'

const route = useRoute()

const form = ref({
  orderType: '',
  date: '2025-04-04',
  category: 'Purchase',
  model: 'PD-1',
  serialRange: 'A000001 - A00200',
  status: 'In Stock',
  quantity: 200,
  rhode: '',
})

const originalOrderList = ref([
  {
    no: '',
    model: 'PD-1',
    sn: '-',
    quantity: '-',
    isClick: false,
  },
])

const orderList = ref([
  {
    orderNo: 'ORD-00017',
    obd: 2,
    customer: 'Ralph Edwards',
    status: 'Refunded',
    isChecked: true,
    isActive: false,
  },
  {
    orderNo: 'ORD-00016',
    obd: 2,
    customer: 'Kristin Watson',
    status: 'Completed',
    isChecked: true,
    isActive: true,
  },
  {
    orderNo: 'ORD-00015',
    obd: 3,
    customer: 'Guy Hawkins',
    status: 'Completed',
    isChecked: false,
    isActive: false,
  },
  {
    orderNo: 'ORD-00014',
    obd: 5,
    customer: 'Bessie Cooper',
    status: 'Refunded',
    isChecked: false,
    isActive: false,
  },
  {
    orderNo: 'ORD-00013',
    obd: 1,
    customer: 'Brooklyn Simmons',
    status: 'Refunded',
    isChecked: false,
    isActive: false,
  },
])

const orderTypeCategoryOptionList = computed(() => {
  if (form.value.orderType === 'inbound') {
    return [
      {
        label: 'Purchase',
        value: 'Purchase',
      },
      {
        label: 'Return',
        value: 'Return',
      },
      {
        label: 'Manual Adjust',
        value: 'Manual Adjust',
      },
    ]
  } else if (form.value.orderType === 'outbound') {
    return [
      {
        label: 'Sale',
        value: 'Sale',
      },
      {
        label: 'Replace',
        value: 'Replace',
      },
      {
        label: 'Manual Adjust',
        value: 'Manual Adjust',
      },
      {
        label: 'Scarp',
        value: 'Scarp',
      },
    ]
  }
})

const openSelectOriginalOrderDropdown = (row) => {
  row.isClick = true
}

const {
  query: { type },
} = route

if (type) {
  form.value.orderType = type
}

const formRef = ref(null)

const handleOrderTypeChange = (val) => {
  form.value = {
    orderType: val,
    date: '',
    category: '',
    model: '',
    serialRange: '',
    status: '',
    quantity: 0,
    rhode: '',
  }
}

const replaceItemList = ref([
  {
    from: '',
    modelFrom: 'PD-1',
    snFrom: '',
    to: '',
    modelTo: 'PD-1',
    snTo: '',
    isClick: false,
  },
])

const openSelectReplaceItemDropdown = (row) => (row.isClick = true)

const snList = ref([
  {
    model: 'PD-1',
    sn: 'A000001',
    amount: 87.2,
  },
  {
    model: 'PD-1',
    sn: 'A000001',
    amount: 87.2,
  },
])
</script>

<template>
  <section class="flex flex-col gap-16">
    <div class="flex-between mx-32 h-32">
      <h3 class="heading-h2-20px-medium text-neutrals-off-black">
        Create Stock Order
      </h3>
      <div class="flex gap-8">
        <el-button>Cancel</el-button>
        <el-button type="primary">Create</el-button>
      </div>
    </div>
    <el-divider />
    <div class="row-center mx-32 h-32 gap-8">
      <span class="w-112">Order Type</span>
      <el-radio-group v-model="form.orderType" @change="handleOrderTypeChange">
        <el-radio label="Inbound" value="inbound" />
        <el-radio label="Outbound" value="outbound" />
      </el-radio-group>
    </div>
    <el-divider />
    <el-form
      :model="form"
      label-width="120px"
      class="form-container mx-32"
      ref="formRef"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Inbound Date">
            <el-date-picker
              v-model="form.date"
              type="date"
              placeholder="Select date"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Category">
            <el-select
              v-model="form.category"
              placeholder="Select category"
              style="width: 100%"
            >
              <el-option
                v-for="category in orderTypeCategoryOptionList"
                :key="category.label"
                :label="category.label"
                :value="category.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col
          :span="12"
          v-if="form.category !== 'Return' && form.category !== 'Sale'"
        >
          <el-form-item label="Model">
            <el-input v-model="form.model" placeholder="Enter model" />
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="form.category !== 'Return' && form.category !== 'Sale'"
        >
          <el-form-item label="Serial Number">
            <el-input
              v-model="form.serialRange"
              placeholder="e.g. A000001 - A00200"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="Status">
            <el-select
              v-model="form.status"
              placeholder="Select status"
              style="width: 100%"
              clearable
            >
              <template #label="{ value }">
                <el-tag
                  type="success"
                  class="bg-status-colours-light-green text-status-colours-green rounded-4! p-8"
                >
                  {{ value }}
                </el-tag>
              </template>
              <el-option label="In Stock" value="In Stock" />
              <el-option label="Waiting inbound" value="Waiting inbound" />
              <el-option label="Cancelled" value="Cancelled" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="form.category !== 'Return' && form.category !== 'Sale'"
        >
          <el-form-item label="Quantity">
            <el-input v-model="form.quantity" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.category === 'Replace'">
          <el-form-item label="Original Order">
            <el-select
              v-model="form.originalOrder"
              placeholder="Select category"
              style="width: 100%"
            >
              <el-option
                v-for="(originalOrderNo, index) in 10"
                :key="originalOrderNo"
                :label="originalOrderNo"
                :value="originalOrderNo"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- Replace Item -->
    <div class="mt-8 flex flex-col gap-8" v-if="form.category === 'Replace'">
      <h4 class="heading-body-large-body-14px-medium mx-32 h-24">
        Replace Item
      </h4>
      <el-divider />
      <div class="mx-32">
        <el-table
          :data="replaceItemList"
          width="100%"
          class="replace-item-container"
        >
          <el-table-column type="selection" />
          <el-table-column prop="from" label="From" />
          <el-table-column prop="modelFrom" label="Model" />
          <el-table-column prop="snFrom" label="SN">
            <template #default="{ row }">
              <el-dropdown trigger="click">
                <div
                  :class="[
                    'w-200 rounded-8 border-1 flex-between h-32 cursor-pointer border-solid px-8',
                    row.isClick ? 'border-[#006BF7]' : 'border-[#EAEEF4]',
                  ]"
                  @click="openSelectReplaceItemDropdown(row)"
                >
                  <span>Select -</span>
                  <el-icon class="h-16 w-16">
                    <arrow-down />
                  </el-icon>
                </div>
                <template #dropdown>
                  <aside class="w-480 h-400 rounded-12 flex flex-col gap-8">
                    <div class="mx-16 my-8 h-24">
                      <!-- 搜索栏 -->
                      <el-input placeholder="Search...">
                        <template #prefix>
                          <!-- 前置搜索图标 -->
                          <i class="icon-mail-send-line-1 text-16" />
                        </template>
                      </el-input>
                    </div>
                    <el-divider />
                    <div class="mx-16 my-8 overflow-auto">
                      <div class="flex-between h-42 flex">
                        <span
                          class="heading-body-body-12px-regular text-neutrals-off-black"
                        >
                          3 selected
                        </span>
                        <el-button
                          class="rounded-full! bg-status-colours-light-blue! border-none!"
                        >
                          <div class="flex items-center gap-4">
                            <el-icon class="h-16 w-16">
                              <Plus />
                            </el-icon>
                            <span>Add</span>
                          </div>
                        </el-button>
                      </div>
                      <el-table :data="snList">
                        <el-table-column type="selection" />
                        <el-table-column prop="model" label="Model" />
                        <el-table-column prop="sn" label="SN" />
                        <el-table-column prop="amount" label="Amount (SGD)" />
                      </el-table>
                    </div>
                  </aside>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column prop="to" label="To" />
          <el-table-column prop="modelTo" label="Model" />
          <el-table-column prop="snTo" label="SN">
            <template #default="{ row }">
              <el-input placeholder="Enter" v-model="row.snTo" />
            </template>
          </el-table-column>
          <el-table-column prop="actions" width="100">
            <template #default="{ row }">
              <!-- 删除 -->
              <i class="icon-delete-bin-line h-16 w-16 cursor-pointer" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- Original Order -->
    <div
      class="mt-8 flex flex-col gap-8"
      v-if="form.category === 'Return' || form.category === 'Sale'"
    >
      <h4 class="heading-body-large-body-14px-medium mx-32 h-24">
        Original Order
      </h4>
      <el-divider />
      <div class="mx-32">
        <el-table :data="originalOrderList" width="100%">
          <el-table-column type="selection" />
          <el-table-column prop="no" label="Order No.">
            <template #default="{ row }">
              <el-dropdown trigger="click">
                <div
                  :class="[
                    'w-200 rounded-8 border-1 flex-between h-32 cursor-pointer border-solid px-8',
                    row.isClick ? 'border-[#006BF7]' : 'border-[#EAEEF4]',
                  ]"
                  @click="openSelectOriginalOrderDropdown(row)"
                >
                  <span>Select -</span>
                  <el-icon class="h-16 w-16">
                    <arrow-down />
                  </el-icon>
                </div>
                <template #dropdown>
                  <aside class="w-480 h-400 rounded-12 flex flex-col gap-8">
                    <div class="mx-16 my-8 h-24">
                      <!-- 搜索栏 -->
                      <el-input placeholder="Search...">
                        <template #prefix>
                          <!-- 前置搜索图标 -->
                          <i class="icon-mail-send-line-1 text-16" />
                        </template>
                      </el-input>
                    </div>
                    <el-divider />
                    <div class="mx-16 my-8 overflow-auto">
                      <div class="flex-between h-42 flex">
                        <span
                          class="heading-body-body-12px-regular text-neutrals-off-black"
                        >
                          3 selected
                        </span>
                        <el-button
                          class="rounded-full! bg-status-colours-light-blue! border-none!"
                        >
                          <div class="flex items-center gap-4">
                            <el-icon class="h-16 w-16">
                              <Plus />
                            </el-icon>
                            <span>Add</span>
                          </div>
                        </el-button>
                      </div>
                      <el-table :data="orderList">
                        <el-table-column type="selection" />
                        <el-table-column
                          prop="orderNo"
                          label="Order No."
                          sortable
                        />
                        <el-table-column prop="obd" label="OBD" sortable />
                        <el-table-column
                          prop="customer"
                          label="Customer"
                          sortable
                        />
                        <el-table-column
                          prop="status"
                          label="Status"
                          sortable
                        />
                      </el-table>
                    </div>
                  </aside>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column prop="model" label="Model" />
          <el-table-column prop="sn" label="SN" />
          <el-table-column prop="quantity" label="Quantity" />
          <el-table-column prop="actions" width="100">
            <template #default="{ row }">
              <!-- 删除 -->
              <i class="icon-delete-bin-line h-16 w-16 cursor-pointer" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="mt-8 flex flex-col gap-8">
      <h4 class="heading-body-large-body-14px-medium mx-32 h-24">Note</h4>
      <el-divider />
      <div class="rhode-container mx-32 flex items-center gap-8">
        <span class="heading-body-body-12px-medium text-neutrals-off-black">
          Rhode
        </span>
        <el-input
          type="textarea"
          :rows="10"
          v-model="form.rhode"
          placeholder="Type Here"
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.form-container :deep(.el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
}

.form-container :deep(.el-input__wrapper::after) {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background-color: var(--el-input-border-color, var(--el-border-color));
  pointer-events: none;
}

.form-container :deep(.el-select__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
}

.form-container :deep(.el-select__wrapper::after) {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background-color: var(--el-input-border-color, var(--el-border-color));
  pointer-events: none;
}

.rhode-container :deep(.el-textarea) {
  @apply rounded-12 h-32;

  .el-textarea__inner {
    @apply rounded-12 bg-[#EAEEF4] shadow-none;

    .el-input__inner {
      @apply placeholder:text-14 placeholder:font-normal placeholder:text-[#99A0AE];
    }
  }
}

.replace-item-container :deep(.el-input) {
  @apply rounded-12 h-32;

  .el-input__wrapper {
    @apply rounded-12 bg-[#EAEEF480];
  }
}
</style>
