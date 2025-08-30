<template>
  <div class="base-dropdown">
    <el-dropdown
      trigger="click"
      :disabled="disabled"
      :hide-on-click="hideOnClick"
      :popper-class="popperClass"
      :placement="placement"
      @visible-change="onVisibleChange"
      ref="baseDropdown"
      :teleported="teleported"
    >
      <div class="el-dropdown-link" v-if="imageUrl">
        <img :src="'/assets/icons/' + imageUrl" alt="" :width="imageSize" />
      </div>
      <slot name="header" v-else></slot>
      <template #dropdown>
        <slot>
          <el-dropdown-menu v-if="list" :style="{ width: width }">
            <slot name="firstLine"></slot>
            <template v-for="item in list" :key="item.id">
              <el-dropdown-item
                :divided="item.isDivided"
                @click="dropdownItemClick(item)"
                :disabled="item.disabled"
              >
                <img
                  v-if="item.imgUrl"
                  :src="'/assets/icons/' + item.imgUrl"
                  alt=""
                  :width="item.imgSize ? item.imgSize : '14px'"
                  style="margin-right: 5px"
                />
                <slot :name="item.slot" v-if="item.slot"></slot>
                <template v-else>
                  <div
                    v-if="item.showLike"
                    class="show-like"
                    :title="item.name"
                  >
                    <span class="like-name">{{ item.name }}</span>
                    <span class="like-icon">
                      <base-svg-hover
                        image="bookmark-filled.svg"
                        size="16px"
                        v-if="item.selected == 1"
                      />
                      <base-svg-hover
                        image="bookmark-outline.svg"
                        size="17px"
                        v-else
                      />
                    </span>
                  </div>
                </template>
              </el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </slot>
      </template>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  emits: ['dropdownItemClick', 'onVisibleChange'],
  name: 'BaseDropdown',
  props: {
    imageUrl: {
      type: String,
    },
    hideOnClick: {
      type: Boolean,
      default: true,
    },
    imageSize: {
      type: String,
      default: '25',
    },
    popperClass: {
      type: String,
    },
    placement: {
      type: String,
      default: 'bottom-start',
    },
    item: {
      type: Object,
    },
    list: {
      type: Array,
    },
    width: {
      type: String,
      default: 'auto',
    },
    radius: {
      type: String,
      default: '50px',
    },
    downUp: {
      type: Boolean,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    teleported: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {}
  },
  created() {},
  methods: {
    close() {
      this.$refs.baseDropdown.handleClose()
    },
    show() {
      this.$refs.baseDropdown.handleOpen()
    },
    dropdownItemClick(item) {
      this.$emit('dropdownItemClick', item, this.item)
    },
    onVisibleChange(val) {
      this.$emit('onVisibleChange', val)
    },
  },
}
</script>
<style lang="scss">
.el-popper {
  border-radius: 10px;
}
</style>
<style lang="scss" scoped>
.el-dropdown-link {
  cursor: pointer;
}
.base-dropdown {
  display: flex;
}
:deep {
  .el-dropdown-menu__item {
    --el-font-size-base: 14px;
    font-size: var(--el-font-size-base);
    &.is-disabled {
      color: rgb(153, 153, 153) !important;
      cursor: default !important;
    }
    .show-like {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      .like-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: calc(100% - 30px);
      }
    }
  }
  .el-dropdown__popper .el-dropdown-menu {
    padding: 10px 0 !important;
  }
  .el-popper.is-pure,
  .el-dropdown__popper .el-dropdown-menu {
    border-radius: 10px !important;
  }

  .el-popper[data-popper-placement^='bottom'] > .el-popper__arrow {
    display: none !important;
  }
}
</style>
