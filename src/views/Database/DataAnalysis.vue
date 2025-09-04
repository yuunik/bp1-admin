<script setup>
import BaseFilterInput from '@/components/BaseFilterInput.vue'

const dataAnalysisList = [
  { id: '01', name: 'Engine Control Module 1' },
  { id: '02', name: 'Transmission electronics' },
  { id: '03', name: 'Brakes 1' },
  { id: '04', name: 'Access/start authorization' },
  { id: '05', name: 'Air Conditioning' },
  { id: '06', name: 'Electronic central electric' },
  { id: '07', name: 'Media Player Position 1' },
  { id: '08', name: 'Parallel parking 2' },
  { id: '09', name: 'Airbag' },
  { id: '10', name: 'Steering column electronics' },
  { id: '11', name: 'Instrument cluster' },
  { id: '12', name: 'Gateway' },
  { id: '13', name: 'Parking Brake' },
  { id: '14', name: 'Seat adjustment, driver side' },
  { id: '15', name: 'Brakes 2' },
  { id: '16', name: 'Parking Brake' },
  { id: '17', name: 'Sound system' },
  { id: '18', name: "Passenger's door electronics" },
  { id: '19', name: 'Radio' },
  { id: '20', name: 'Information electronics 1' },
  { id: '21', name: 'Comfort System Central Control Module' },
]

// 条件搜索
const conditionParams = reactive({
  searchKey: '',
})

// 输入搜索
const handleSearchByInput = () => {}
</script>

<template>
  <!-- 条件搜索 -->
  <base-filter-input
    v-model="conditionParams.searchKey"
    @input-change="handleSearchByInput"
    class="h-24"
  />
  <div class="grid grid-cols-3 gap-16">
    <i
      class="bg-neutrals-grey-1 rounded-8 p-16"
      v-for="data in dataAnalysisList"
      :key="data.id"
    >
      <span class="text-neutrals-grey-4">{{ data.id }} - {{ data.name }}</span>
    </i>
  </div>
</template>

<style scoped lang="scss"></style>
