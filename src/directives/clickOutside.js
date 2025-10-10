const clickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event) // 执行传入的方法
      }
    }
    // 延迟到下一个事件循环再绑定，避免初次点击触发
    // setTimeout(() => {
    //   document.addEventListener('click', el.clickOutsideEvent)
    // })
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  },
}

export default clickOutside
