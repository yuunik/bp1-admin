<script setup>
const internalUserForm = ref({
  email: '',
  name: '',
  password: '',
  role: 'Admin',
  confirmPassword: '',
})
</script>

<template>
  <section class="flex flex-col gap-16">
    <div class="flex-between mx-32 h-32">
      <h3 class="heading-h2-20px-medium text-neutrals-off-black">
        Create Internal User
      </h3>
      <div class="flex h-32 gap-8">
        <el-button>Cancel</el-button>
        <el-button type="primary">Create</el-button>
      </div>
    </div>
    <el-divider />
    <el-form
      :model="internalUserForm"
      label-width="140px"
      label-position="left"
      class="form-container mx-32"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Email">
            <el-input
              v-model="internalUserForm.email"
              placeholder="Enter name"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Name">
            <el-input v-model="internalUserForm.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Password">
            <el-input v-model="internalUserForm.password" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Role">
            <el-select
              v-model="internalUserForm.role"
              placeholder="Select role"
              style="width: 100%"
            >
              <el-option label="Admin" value="Admin" />
              <el-option label="User" value="User" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Confirm Password">
            <el-input v-model="internalUserForm.confirmPassword" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
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
</style>
