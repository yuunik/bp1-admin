import BaseSvgIcon from '@/components/BaseSvgIcon.vue'

const svgIconPlugin = {
  install(app) {
    app.component('svg-icon', BaseSvgIcon)
  },
}

export default svgIconPlugin
