<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import { RouteName, ShareRoutePath } from '@/utils/constantsUtil.js'
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

// 监听 type,  动态填写 url
watch(
  () => appVersionInfo.type,
  (val) => {
    if (val === 'Android') {
      appVersionInfo.url = ShareRoutePath.GOOGLE_PLAY_URL
    } else {
      appVersionInfo.url = ShareRoutePath.APPLE_APP_STORE_URL
    }
  },
)
</script>

<template>
  <section class="flex h-full flex-col gap-16 overflow-auto">
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
        <el-input
          v-model="appVersionInfo.version"
          class="input--underline"
          placeholder="Enter"
        />
      </dd>
      <dt>Force Update</dt>
      <dd>
        <el-select
          v-model="appVersionInfo.state"
          class="w-200! select--underline"
        >
          <el-option label="No prompt" :value="0" />
          <el-option label="Prompt to update" :value="1" />
          <el-option label="Force update" :value="2" />
          <el-option label="Under review" :value="3" />
        </el-select>
      </dd>
      <dt>Update URL</dt>
      <dd>
        <el-input
          v-model="appVersionInfo.url"
          class="input--underline"
          placeholder="Enter"
        />
      </dd>
      <dt>Update Prompt</dt>
      <dd>
        <el-input
          v-model="appVersionInfo.content"
          type="textarea"
          :rows="15"
          placeholder="Enter"
        />
      </dd>
    </dl>
  </section>
</template>

<style scoped lang="scss">
// 重置文本框样式
:deep(.el-textarea__inner) {
  background-color: $neutrals-off-white;
}
</style>
