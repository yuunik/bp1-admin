<script setup>
import { Pie } from 'vue-chartjs'
import Big from 'big.js'

import {
  CategoryColorMap,
  CategoryIconMap,
  ModuleColorMap,
  ModuleIconMap,
} from '@/utils/constantsUtil.js'
import BaseSvgIcon from '@/components/BaseSvgIcon.vue'
import { getFormatNumberString } from '../utils/dataFormattedUtil.js'

// 分类列表数据
const { chartData } = defineProps({
  chartData: {
    type: Array,
    required: true,
  },
})

// 饼图数据
const pieData = computed(() => ({
  labels: chartData.map((item) => item.name),
  datasets: [
    {
      data: chartData.map((item) => item.amount),
      backgroundColor: chartData.map((item) => item.color), // 黑色 + 蓝色
      borderWidth: 0,
      cutout: '70%', // 控制环的粗细
    },
  ],
}))

// 费用总价
const totalExpense = computed(() =>
  chartData.reduce((pre, cur) => Big(pre).plus(cur.amount), Big(0)),
)

// 饼图配置
const pieOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      display: false, // 右侧图例可关掉，自己写 legend
    },
  },
})

// 自定义插件：在中心绘制文字
const centerTextPlugin = ref({
  id: 'centerText',
  beforeDraw(chart) {
    const { ctx, width, height } = chart
    ctx.save()

    const text1 = 'Total Expense'
    const text2 = totalExpense.value
      ? `$${getFormatNumberString(totalExpense.value)}`
      : '-'

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // 第一行
    ctx.fillStyle = '#6F7788'
    ctx.font = '14px sans-serif'
    ctx.fillText(text1, width / 2, height / 2 - 10)

    // 第二行
    ctx.fillStyle = '#1B1A1E'
    ctx.font = 'bold 16px sans-serif'
    ctx.fillText(text2, width / 2, height / 2 + 15)

    ctx.restore()
  },
})
</script>

<template>
  <div class="min-h-312 flex gap-24">
    <!-- 饼图 -->
    <div class="min-h-282 flex w-[25%] flex-col items-center gap-24 py-8">
      <div class="w-200 h-200">
        <Pie
          :data="pieData"
          :options="pieOptions"
          :plugins="[centerTextPlugin]"
        />
      </div>
      <ul class="w-226 grid h-96 grid-cols-2 gap-8">
        <li
          v-for="item in chartData"
          :key="item.name"
          class="h-18 row-center gap-4"
        >
          <i
            class="inline-block h-8 w-8 rounded-full"
            :style="{ backgroundColor: item.color }"
          />
          <span
            class="heading-caption-caption-10px-regular text-neutrals-grey-4"
          >
            {{ item.name }}
          </span>
        </li>
      </ul>
    </div>
    <!-- 表格 -->
    <div class="flex-1">
      <el-table :data="chartData">
        <!-- 第一列：Module 名称 + 图标 -->
        <el-table-column prop="name" label="Module" min-width="50%">
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <i
                :class="[
                  'mr-8',
                  'block',
                  'flex',
                  'h-24',
                  'w-24',
                  'rounded-full',
                ]"
                :style="{ backgroundColor: row.color }"
              >
                <base-svg-icon
                  :name="row.icon"
                  color="#202834"
                  size="16"
                  class="m-auto"
                />
              </i>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>

        <!-- 第二列：Total Expense（带排序） -->
        <el-table-column
          prop="amount"
          label="Total Expense"
          sortable
          align="right"
          min-width="50%"
        >
          <template #default="{ row }">
            <span>
              {{
                getFormatNumberString(row.amount)
                  ? `$${getFormatNumberString(row.amount)}`
                  : '-'
              }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
