import { defineStore } from 'pinia'
import { reactive } from 'vue'

const useSettingsStore = defineStore('settings', () => {
  const currentRoute = reactive([])

  const updateRoute = (title) => {
    const route = currentRoute.find((item) => item.name === meta.name)
    route.meta.title = title
  }

  return {
    currentRoute,
    updateRoute,
  }
})
