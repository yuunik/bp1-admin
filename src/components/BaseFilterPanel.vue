<script setup>
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
})

const emit = defineEmits(['search'])

// 条件查询数组
const searchKeyList = defineModel({
  type: Array,
  required: true,
})

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
    return `${conditionText}: ${conditions.join(',')}`
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
      <div class="w-190 h-93 flex flex-col gap-8 px-6 py-12">
        <div class="flex-between">
          <p class="heading-body-body-12px-medium text-neutrals-grey-3">
            {{ conditionText }}
          </p>
          <span
            @click="searchKeyList = []"
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
        <el-checkbox-group v-model="searchKeyList" class="flex flex-col">
          <el-checkbox
            v-for="section in sectionList"
            :key="section.label"
            :value="section.value"
          >
            <span class="heading-body-body-12px-regular text-neutrals-grey-3">
              {{ section.label }}
            </span>
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </template>
  </el-dropdown>
</template>

<style scoped lang="scss"></style>
