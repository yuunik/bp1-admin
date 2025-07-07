<script setup>

</script>

<template>
  <el-menu-item index="1">
    <i class="icon-dashboard"/>
    <span>Dashboard</span>
  </el-menu-item>
  <el-menu-item index="2">
    <i class="icon-order-management"/>
    <span>Order Management</span>
  </el-menu-item>
  <el-sub-menu index="3">
    <template #title>
      <i class="icon-obd-management"/>
      <span>OBD Management</span>
    </template>
    <el-menu-item index="3-1">
      <span>OBD 1</span>
    </el-menu-item>
    <el-menu-item index="3-2">
      <span>OBD 2</span>
    </el-menu-item>
  </el-sub-menu>
  <el-sub-menu index="4">
    <template #title>
      <i class="icon-user-management"/>
      <span>User Management</span>
    </template>
    <el-menu-item index="4-1">
      <span>User 1</span>
    </el-menu-item>
    <el-menu-item index="4-2">
      <span>User 2</span>
    </el-menu-item>
  </el-sub-menu>
  <el-menu-item index="5">
    <i class="icon-database"/>
    <span>Database</span>
  </el-menu-item>
  <el-sub-menu index="6">
    <template #title>
      <i class="icon-app-configuration" />
      <span>App Configuration</span>
    </template>
    <el-menu-item index="6-1">
      <span>Version Control</span>
    </el-menu-item>
    <el-menu-item index="6-2">
      <span>Brand & Model</span>
    </el-menu-item>
  </el-sub-menu>
</template>

<style scoped lang="scss">

</style>