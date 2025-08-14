/**
 * unoss config file
 */
// 预设 rem 转 px
import presetRemToPx from '@unocss/preset-rem-to-px'
// transformerDirectives 可以使用 @apply @screen theme 函数
import transformerDirectives from '@unocss/transformer-directives'
import {
  defineConfig,
  presetAttributify,
  presetUno,
  transformerVariantGroup,
  presetIcons,
} from 'unocss'

export default defineConfig({
  presets: [
    presetAttributify(),
    presetUno(),
    presetRemToPx({
      baseFontSize: 4,
    }),
    // 自动引入图标配置
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  transformers: [transformerVariantGroup(), transformerDirectives()],
  // 自定义配置
  rules: [
    [/^hp([\.\d]+)$/, ([_, num]) => ({ height: `${num}%` })],
    // calc 函数写法
    [/^hc([\.\d]+)$/, ([_, num]) => ({ height: `calc(100% - ${num}px)` })],
    [/^wc([\.\d]+)$/, ([_, num]) => ({ width: `calc(100% - ${num}px)` })],
    // 菜单栏未折叠宽度
    ['wb-menu-width', { width: '184px' }],
    // 菜单栏未折叠宽度
    ['wf-menu-width', { width: '64px' }],
    // 默认盒子阴影
    ['shadow-default', { 'box-shadow': '0 0 12px rgba(0, 0, 0, 0.12)' }],
    [
      // flex 伸缩基准
      /^flex-(\d+)-(\d+)$/,
      ([, grow, basis]) => ({
        flexGrow: +grow,
        flexShrink: +grow, // grow 和 shrink 设为相同，保持对称
        flexBasis: `${basis}px`,
      }),
    ],
  ],
  // 自定义属性 一个属性可以对应多个 unocss 类值
  shortcuts: [
    {
      // 垂直水平居中
      'flex-center': 'flex items-center justify-center',
      // 放在最后
      'flex-end': 'flex items-center justify-end',
      // 垂直居中
      'flex-middle': 'flex items-center',
      // 分开两边
      'flex-between': 'flex items-center justify-between',
      // 竖着居中
      'flex-col-center': 'flex flex-col items-center',
      // 图标大小
      'icon-style': 'inline-block w-25 h-25 cursor-pointer',
      // 菜单栏子项
      'menu-item-style': 'm-4 rounded-8 bg-[#35496E]',
      // 边框
      'border-solid-1': 'border-1 border-solid border-[#409eff]',
      // 渐变效果
      'transition-default': 'transition-[all] duration-250 ease-linear',
      // 绝对定位靠右
      'absolute-right': 'absolute right-20 bottom-10',
      // 垂直分开两边
      'flex-col-between': 'flex flex-col justify-between',
      // 垂直居中
      'row-items-center': 'flex items-center',
      'bg-neutrals-white': 'bg-[#FFFFFF]',
      'bg-neutrals-off-white': 'bg-[#EFF4F9]',
      'bg-branding-primary': 'bg-[#202834]',
      'bg-neutrals-grey-1': 'bg-[#EAEEF4]',
      'bg-neutrals-grey-4': 'text-[#6F7788]',
      'bg-branding-light-blue': 'bg-[#E5F0FE]',
      'bg-branding-colours-primary': 'bg-[#006BF7]',
      'bg-status-colours-green': 'bg-[#05AD9D]',
      'bg-status-colours-red': 'bg-[#EF3C30]',
      'text-status-colours-green': 'text-[#05AD9D]',
      'text-status-colours-red': 'text-[#EF3C30]',
      'text-neutrals-blue': 'text-[#006BF7]',
      'text-neutrals-off-white': 'text-[#EFF4F9]',
      'text-neutrals-white': 'text-[#FFFFFF]',
      'text-neutrals-off-black': 'text-[#1B1A1E]',
      'text-neutrals-grey-4': 'text-[#6F7788]',
      'text-neutrals-grey-2': 'text-[#CACFD8]',
      'text-branding-light-blue': 'text-[#E5F0FE]',
      'poppins-28px-semibold': 'text-28/32 font-semibold',
      'poppins-16px-semibold': 'text-16 font-semibold',
      'poppins-12px-semibold': 'text-12 font-semibold',
      'poppins-12px-medium': 'text-12/16 font-medium',
      'poppins-20px-semibold': 'text-20 font-semibold',
      'poppins-10px-semibold': 'text-10 font-semibold',
      'poppins-10px-medium': 'text-10/14 font-medium',
      'poppins-10px-regular': 'text-10 font-400',
      'hanno-20px-regular': 'text-20 font-400',
      'text-10px-regular': 'text-10 font-400',
      'roboto-12px-semibold': 'text-12 font-semibold',
      // 文字溢出
      'text-truncate': 'text-ellipsis overflow-hidden whitespace-nowrap',
      // 间隔线
      'divider-neutral-grey-4-1px': 'border-t-[#EAEEF4] border-t border-t-1',
      'divider-neutral-grey-4-4px': 'border-t-[#EAEEF4] border-t border-t-4',
    },
  ],
  theme: {
    colors: {
      menuColor: '#001529',
      primaryColor: '#409eff',
    },
    extend: {
      // 自定义配置
      menuWidth: '250px',
    },
  },
})
