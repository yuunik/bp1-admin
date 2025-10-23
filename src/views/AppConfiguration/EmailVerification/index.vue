<script setup>
import { getVerifyCodeApi } from '@/apis/shareApi.js'
import { getDateWithDDMMMYYYYhhmma } from '@/utils/dateUtil.js'
import AppScaffold from '@/components/AppScaffold.vue'
import BasePagination from '@/components/BasePagination.vue'

const codeList = ref([])

const getCode = async () => {
  const { data } = await getVerifyCodeApi()
  codeList.value = data
}

// 分页数据
const pagination = reactive({
  currentPage: 0,
  pageSize: 15,
  total: 0,
})

getCode()
</script>

<template>
  <section class="flex h-full flex-col gap-16 px-32 pb-32">
    <!-- header -->
    <h2 class="heading-h2-20px-medium text-neutrals-off-black">Email Code</h2>
    <!-- table container -->
    <div class="mt-8 flex flex-1 flex-col">
      <el-table :data="codeList" class="flex-1">
        <!-- Email 列 -->
        <el-table-column
          prop="email"
          label="Email"
          class-name="font-medium text-gray-800"
        />

        <!-- Code 列 -->
        <el-table-column prop="code" label="Code">
          <template #default="{ row }">
            <span
              class="text-status-colours-blue text-18 font-semibold tracking-wider"
            >
              {{ row.code }}
            </span>
          </template>
        </el-table-column>

        <!-- 创建时间列 -->
        <el-table-column prop="createTime" label="Created Time">
          <template #default="{ row }">
            <span class="text-neutrals-grey-4">
              {{ getDateWithDDMMMYYYYhhmma(row.createTime) }}
            </span>
          </template>
        </el-table-column>

        <template #empty>
          <el-empty description="No valid data" class="m-auto" />
        </template>
      </el-table>
      <base-pagination v-model="pagination" />
    </div>
  </section>
</template>

<style scoped lang="scss"></style>
