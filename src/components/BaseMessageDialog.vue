<script setup lang="ts">
const appMessageDialogVisible = defineModel({
  required: true,
})
</script>

<template>
  <el-dialog
    v-model="appMessageDialogVisible"
    title="Tip"
    align-center
    width="304"
    :show-close="false"
  >
    <div class="flex flex-col gap-16">
      <p>Unbind User ?</p>
      <p>
        You are about to unbind this user's OBD device. Once unbound, the device
        will no longer be linked to this account or transmit data. Are you sure
        you want to proceed?
      </p>
      <el-divider />
      <el-button-group class="flex gap-16">
        <el-button>Cancel</el-button>
        <el-button type="danger">Unbind</el-button>
      </el-button-group>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
