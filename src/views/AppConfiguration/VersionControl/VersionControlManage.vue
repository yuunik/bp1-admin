<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getAppVersionInfoApi, modifyAppVersionApi } from '@/apis/appApi.js'
import { ElMessage } from 'element-plus'

// 获取路由参数
const {
  params: { id },
} = useRoute()

// 应用版本信息
const appVersionInfo = ref({})

// 编辑模式
const isEditMode = ref(false)

// 获取版本详情
const getAppVersionInfo = async (id) => {
  const { data } = await getAppVersionInfoApi(id)
  appVersionInfo.value = data
}

// 修改版本信息
const handleModifyAppVersionInfo = async () => {
  try {
    await modifyAppVersionApi(appVersionInfo.value)
    // 修改成功
    ElMessage.succsss('Modify success')
  } finally {
    // 修改编辑模式
    isEditMode.value = false
    // 刷新
    getAppVersionInfo(id)
  }
}

// 版本状态
const appVersionInfoStatus = computed(() => {
  switch (appVersionInfo.value.state) {
    case 0:
      return 'No prompt'
    case 1:
      return 'Prompt to update'
    case 2:
      return 'Force update'
    case 3:
      return 'Under review'
    default:
      return 'Unknown'
  }
})

// 组件创建后, 获取版本详情
if (id) {
  getAppVersionInfo(id)
}
</script>

<template>
  <section class="flex h-full flex-col gap-16 overflow-auto">
    <!-- header -->
    <div class="flex-between mx-32 h-32 gap-20">
      <h3 class="heading-h2-20px-medium text-neutrals-off-black">
        Version Details
      </h3>
      <el-button
        v-show="!isEditMode"
        type="primary"
        @click="isEditMode = !isEditMode"
      >
        Edit
      </el-button>
      <div class="flex items-center gap-8" v-show="isEditMode">
        <el-button @click="isEditMode = false">Cancel</el-button>
        <el-button type="primary" @click="handleModifyAppVersionInfo">
          Save
        </el-button>
      </div>
    </div>
    <!-- info -->
    <div class="flex flex-col gap-8">
      <h4
        class="heading-body-large-body-14px-medium text-neutrals-off-black mx-32"
      >
        {{ appVersionInfo.type }}
      </h4>
      <!-- divider -->
      <el-divider />
      <dl
        class="[&>dd]:leading-32 [&>dt]:leading-32 mx-32 grid grid-cols-[112px_1fr] items-center gap-x-8 gap-y-4 [&>dd]:h-32 [&>dt]:h-32"
      >
        <dt>Latest Version</dt>
        <dd v-show="!isEditMode">{{ appVersionInfo.version || '-' }}</dd>
        <dd v-show="isEditMode">
          <el-input v-model="appVersionInfo.version" />
        </dd>
        <dt>Status</dt>
        <dd v-show="!isEditMode">
          {{ appVersionInfoStatus }}
        </dd>
        <dd v-show="isEditMode">
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
        <dd v-show="!isEditMode">
          {{ appVersionInfo.url || '-' }}
        </dd>
        <dd v-show="isEditMode">
          <el-input v-model="appVersionInfo.url" />
        </dd>
        <dt>Update Prompt</dt>
        <dd v-show="!isEditMode">{{ appVersionInfo.content || '-' }}</dd>
        <dd v-show="isEditMode">
          <el-input
            v-model="appVersionInfo.content"
            type="textarea"
            :rows="15"
          />
        </dd>
      </dl>
    </div>
  </section>
</template>

<style scoped lang="scss">
// 重置输入框样式
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

// 重置文本框样式
:deep(.el-textarea__inner) {
  background-color: $neutrals-off-white;
}
</style>
