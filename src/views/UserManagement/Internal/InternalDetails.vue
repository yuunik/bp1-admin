<script setup>
const logAndNoteDataList = ref([
  {
    date: '15 May 2025 9:00 am',
    user: 'Rhode',
    action: 'Add Note',
    detail: 'Replenished 10 OBDs missing after stocktaking.',
  },
  {
    date: '15 May 2025 9:00 am',
    user: 'Rhode',
    action: 'Edit',
    detail: 'Change quantity from 12 to 10.',
  },
  {
    date: '15 May 2025 9:00 am',
    user: 'Rhode',
    action: 'Create Inbound Order',
    detail: 'Inbound order #IN-00017 created, added 10 OBDs to inventory.',
  },
])

const dataDetails = ref({
  name: 'Theresa Webb',
  email: 'tim.jennings@example.com',
  role: 'Support',
  phone: '+65 9876 5432',
  status: 'Active',
  isEditing: false,
})

const form = ref({
  name: 'Theresa Webb',
  email: 'tim.jennings@example.com',
  role: 'Support',
  phone: '+65 9876 5432',
  status: 'Active',
  isEditing: false,
})
</script>

<template>
  <section class="flex flex-col gap-16">
    <div class="flex-between mx-32 h-32">
      <h3 class="heading-h2-20px-medium text-neutrals-off-black">
        Theresa Webb
      </h3>
      <div class="flex gap-8">
        <template v-if="!dataDetails.isEditing">
          <el-button>Disable</el-button>
          <el-button>Reset Password</el-button>
          <el-button type="primary" @click="dataDetails.isEditing = true">
            Edit
          </el-button>
        </template>
        <template v-else>
          <el-button type="primary" @click="dataDetails.isEditing = true">
            Save
          </el-button>
        </template>
      </div>
    </div>
    <el-divider />
    <dl
      class="[&>dd]:leading-32 [&>dt]:leading-32 mx-32 grid grid-cols-[112px_1fr_112px_1fr] items-center gap-x-8 gap-y-4 [&>dd]:h-32 [&>dt]:h-32"
      v-if="!dataDetails.isEditing"
    >
      <dt>Name</dt>
      <dd>{{ dataDetails.name }}</dd>

      <dt>Email</dt>
      <dd>{{ dataDetails.email }}</dd>
      <dt>Role</dt>
      <dd>{{ dataDetails.role }}</dd>
      <dt>Phone</dt>
      <dd>{{ dataDetails.phone }}</dd>

      <dt>Status</dt>
      <dd>
        <el-tag type="success">{{ dataDetails.status }}</el-tag>
      </dd>
    </dl>
    <el-form
      :model="form"
      label-width="112px"
      label-position="left"
      class="form-container mx-32"
      v-else
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Name">
            <el-input v-model="form.name" placeholder="Enter name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Email">
            <el-input v-model="form.email" readonly />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="Role">
            <el-select
              v-model="form.role"
              placeholder="Select role"
              style="width: 100%"
            >
              <el-option label="In Stock" value="In Stock" />
              <el-option label="Waiting inbound" value="Waiting inbound" />
              <el-option label="Cancelled" value="Cancelled" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Phone">
            <el-input v-model="form.phone" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Status*">
            <el-select
              v-model="form.status"
              placeholder="Select category"
              style="width: 100%"
            >
              <template #label="{ value }">
                <el-tag
                  type="success"
                  class="bg-status-colours-light-green text-status-colours-green rounded-4! p-8"
                >
                  {{ value }}
                </el-tag>
              </template>
              <el-option label="Active" value="Active" />
              <el-option label="Unbound" value="Unbound" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- logs & note -->
    <div class="flex flex-col gap-8" v-if="logAndNoteDataList.length">
      <!-- header -->
      <div class="flex-between mx-32 h-24">
        <h4>Logs & Note</h4>
        <!-- 新增按钮 -->
        <el-button
          type="primary"
          text
          class="my-8 w-fit"
          @click="addNewMaintenanceItem"
        >
          <template #icon>
            <i class="icon-typesadd branding-colours-primary" />
          </template>
          <template #default>New Note</template>
        </el-button>
      </div>
      <el-divider />
      <!-- table -->
      <div class="mx-32">
        <el-table :data="logAndNoteDataList">
          <el-table-column prop="date" label="Date" />
          <el-table-column prop="user" label="User" />
          <el-table-column prop="action" label="Action" />
          <el-table-column prop="detail" label="Detail" />
        </el-table>
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
</style>
