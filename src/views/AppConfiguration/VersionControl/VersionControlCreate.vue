<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import { RouteName } from '@/utils/constantsUtil.js'
import { addAppVersionApi } from '@/apis/appApi.js'

const appVersionInfo = reactive({
  type: '',
  version: '',
  state: 0,
  url: '',
  content: '',
})

const router = useRouter()

const handleAddAppVersionInfo = async () => {
  await addAppVersionApi(appVersionInfo)
  // 提示
  ElMessage.success('Added successfully')
  router.push({ name: RouteName.VERSION_CONTROL })
}
</script>

<template>
  <section class="flex flex-col gap-16">
    <!-- header -->
    <div class="flex-between mx-32 h-32 gap-20">
      <h3 class="heading-h2-20px-medium text-neutrals-off-black">New Config</h3>
      <div class="flex items-center gap-8">
        <el-button @click="$router.push({ name: RouteName.VERSION_CONTROL })">
          Cancel
        </el-button>
        <el-button type="primary" @click="handleAddAppVersionInfo">
          Save
        </el-button>
      </div>
    </div>
    <!-- divider -->
    <el-divider />
    <dl
      class="[&>dd]:leading-32 [&>dt]:leading-32 mx-32 grid grid-cols-[112px_1fr] items-center gap-x-8 gap-y-4 [&>dd]:h-32 [&>dt]:h-32"
    >
      <dt>Platform</dt>
      <dd>
        <el-radio-group v-model="appVersionInfo.type">
          <el-radio value="iOS">iOS</el-radio>
          <el-radio value="Android">Android</el-radio>
        </el-radio-group>
      </dd>
      <dt>Latest Version</dt>
      <dd>
        <el-input v-model="appVersionInfo.version" />
      </dd>
      <dt>Force Update</dt>
      <dd>
        <el-select v-model="appVersionInfo.state" class="w-200!">
          <el-option label="No prompt" :value="0" />
          <el-option label="Prompt to update" :value="1" />
          <el-option label="Force update" :value="2" />
          <el-option label="Under review" :value="3" />
        </el-select>
      </dd>
      <dt>Update URL</dt>
      <dd>
        <el-input v-model="appVersionInfo.url" />
      </dd>
      <dt>Update Prompt</dt>
      <dd>
        <el-input v-model="appVersionInfo.content" />
      </dd>
    </dl>
  </section>
</template>

<style scoped lang="scss">
:deep(.el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
}

:deep(.el-input__wrapper::after) {
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
