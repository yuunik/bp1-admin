<script setup>
import { Search } from '@element-plus/icons-vue'

const { sectionList, conditionText } = defineProps({
  // 搜索条件列表
  sectionList: {
    type: Array,
    default: () => [
      {
        label: 'With User',
        value: '2',
      },
      {
        label: 'Without User',
        value: '1',
      },
    ],
  },
  // 搜索条件文字
  conditionText: {
    type: String,
    default: 'Status',
  },
  // 是否需要输入筛选
  isNeedInput: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['search'])

// 条件查询数组
const searchKeyList = defineModel({
  type: Array,
  required: true,
})

// 搜索条件值
const keywords = defineModel('keywords')

// 条件查询字符串
const searchKeys = computed(() => searchKeyList.value.join(','))

// 筛选文本
const conditionTotalText = computed(() => {
  const conditions = []

  // 拼接文本
  for (const section of sectionList) {
    if (searchKeyList.value.includes(section.value)) {
      conditions.push(section.label)
    }
  }

  if (conditions.length > 0) {
    return `${conditionText}: ${conditions[0]} ${conditions.length > 1 ? ` +${conditions.length - 1}` : ''}`
  }

  return conditionText
})

// 提交查找
watch(searchKeys, () => {
  emit('search', searchKeys.value)
})
</script>

<template>
  <!-- 触发框 -->
  <el-dropdown trigger="click" placement="bottom-start">
    <div
      class="border-1 neutrals-grey-3 default-transition row-center box-border h-24 w-fit cursor-pointer gap-5 rounded-full border-solid px-8 py-4"
      :class="
        searchKeyList.length
          ? 'border-[#006BF7] text-[#006BF7]'
          : 'text-neutrals-grey-3 border-[#CACFD8]'
      "
    >
      <span class="heading-body-body-12px-regular whitespace-nowrap">
        {{ conditionTotalText }}
      </span>
      <i
        class="icon-typesdropdown"
        :class="
          searchKeyList.length ? 'text-[#006BF7]' : 'text-neutrals-grey-3'
        "
      />
    </div>
    <template #dropdown>
      <div class="w-190 h-93 h-fit! flex flex-col gap-8 px-16 py-12">
        <div class="flex-between">
          <p class="heading-body-body-12px-medium text-neutrals-grey-3">
            {{ conditionText }}
          </p>
          <span
            @click="searchKeyList.length && (searchKeyList = [])"
            class="heading-body-body-12px-medium"
            :class="
              searchKeyList.length
                ? 'cursor-pointer text-[#006BF7]'
                : 'cursor-not-allowed text-[#E8F0F8]'
            "
          >
            Clear
          </span>
        </div>
        <!-- 输入筛选 -->
        <el-input
          v-if="isNeedInput"
          placeholder="Enter..."
          :prefix-icon="Search"
          v-model="keywords"
          clearable
        />
        <!-- 勾选框筛选 -->
        <el-checkbox-group v-model="searchKeyList" class="flex flex-col gap-4">
          <el-checkbox
            v-for="section in sectionList"
            :key="section.label"
            :value="section.value"
            v-show="!keywords || section.label.includes(keywords)"
          >
            <span
              :class="[
                'heading-body-body-12px-regular',
                searchKeyList.includes(section.label)
                  ? 'text-neutrals-blue'
                  : 'text-neutrals-grey-3',
              ]"
            >
              {{ section.label }}
            </span>
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </template>
  </el-dropdown>
</template>

<style scoped lang="scss">
// 重置输入框样式
:deep(.el-input__wrapper) {
  @apply rounded-8 bg-input h-24 shadow-none;
}

// 重置勾选框样式
:deep(.el-checkbox__inner) {
  @apply rounded-4;
}
</style>
