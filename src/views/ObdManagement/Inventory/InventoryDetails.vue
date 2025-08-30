<script setup>
const orderDetail = ref({
  status: 'Outbound',
})

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

const originalOrderList = ref([
  {
    no: 1,
    orderNo: 'ORD-00017',
    model: 'PD-1',
    sn: ['A000001', 'A000002'],
    quantity: 2,
  },
  {
    no: 2,
    orderNo: 'ORD-00016',
    model: 'PD-1',
    sn: ['A000003'],
    quantity: 1,
  },
  {
    no: 3,
    orderNo: 'ORD-00015',
    model: 'PD-1',
    sn: ['A000005', 'A000006'],
    quantity: 2,
  },
])

const productList = ref([
  {
    from: '',
    modelFrom: 'PD-1',
    snFrom: 'A000001',
    to: '',
    modelTo: 'PD-1',
    snTo: 'A000002',
  },
])
</script>

<template>
  <section class="flex flex-col gap-16">
    <div class="flex-between mx-32 h-32">
      <h3 class="heading-h2-20px-medium text-neutrals-off-black">
        Inbound Order #IN-00017
      </h3>
      <div class="flex gap-8">
        <el-button>Print PDF</el-button>
        <el-button type="primary">Edit</el-button>
      </div>
    </div>
    <el-divider />
    <dl
      class="[&>dd]:leading-32 [&>dt]:leading-32 mx-32 grid grid-cols-[112px_1fr_112px_1fr] items-center gap-x-8 gap-y-4 [&>dd]:h-32 [&>dt]:h-32"
    >
      <dt>Inbound Date</dt>
      <dd>04 Apr 2025</dd>

      <dt>Warranty Start</dt>
      <dd>Purchase</dd>

      <template v-if="!['Return', 'Outbound'].includes(orderDetail.status)">
        <dt>Model</dt>
        <dd>PD-1</dd>
        <dt>Serial Number</dt>
        <dd>A000001 - A00200</dd>
      </template>

      <dt>Status</dt>
      <dd>
        <el-tag type="success">In Stock</el-tag>
      </dd>

      <template v-if="!['Return', 'Outbound'].includes(orderDetail.status)">
        <dt>Quantity</dt>
        <dd>200</dd>
      </template>
    </dl>
    <!-- produt  -->
    <div
      class="flex flex-col gap-8"
      v-if="['Outbound'].includes(orderDetail.status) && productList.length > 0"
    >
      <!-- header -->
      <div class="row-center mx-32 h-24 gap-8">
        <h4>Product</h4>
        <span class="heading-body-large-body-14px-medium">
          {{ productList.length }}
        </span>
      </div>
      <el-divider />
      <!-- table -->
      <div class="mx-32">
        <el-table :data="productList" style="width: 100%">
          <el-table-column type="index" label="No." width="60" />
          <el-table-column prop="from" label="From" />
          <el-table-column prop="modelFrom" label="Model" />
          <el-table-column prop="snFrom" label="SN" />
          <el-table-column prop="to" label="From" />
          <el-table-column prop="modelTo" label="Model" />
          <el-table-column prop="snTo" label="SN" />
        </el-table>
      </div>
    </div>
    <!-- original order -->
    <div
      class="flex flex-col gap-8"
      v-if="
        ['Outbound', 'Return'].includes(orderDetail.status) &&
        originalOrderList.length > 0
      "
    >
      <!-- header -->
      <div class="row-center mx-32 h-24 gap-8">
        <h4>Original Order</h4>
        <span class="heading-body-large-body-14px-medium">
          {{ originalOrderList.length }}
        </span>
      </div>
      <el-divider />
      <!-- table -->
      <div class="mx-32">
        <el-table :data="originalOrderList" style="width: 100%">
          <el-table-column prop="no" label="No." width="60" />
          <el-table-column prop="orderNo" label="Order No." />
          <el-table-column prop="model" label="Model" />
          <el-table-column
            prop="sn"
            label="SN"
            :formatter="(row) => row.sn.join(', ')"
          />
          <el-table-column prop="quantity" label="Quantity" width="100" />
        </el-table>
      </div>
    </div>
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

<style scoped lang="scss"></style>
