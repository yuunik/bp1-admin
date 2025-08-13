<template>
  <div class="content_item">
    <div class="item_avatar">
      <div class="item_avatar-img" :style="{ backgroundColor: avatarColor }">
        <div class="item_avatar-name">{{ avatarName }}</div>
      </div>
    </div>
    <div class="item_content">
      <div class="item_content-title">{{ title }}</div>
      <div class="item_content-description">{{ description }}</div>
      <div class="item_content-time">{{ time }}</div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  avatarName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  avatarColor: {
    type: String,
    default: '#EAEEF4',
  },
})
</script>

<style scoped lang="scss">
.content_item {
  display: flex;
  flex-direction: row;
  width: 256px;
  height: auto;
  border-bottom: 1px solid #eff4f9;
  padding-top: 8px;
  padding-bottom: 8px;
  gap: 12px;
  overflow: hidden;
}

.item_avatar {
  border-radius: 9999px;
  display: flex;
  align-items: center;
}

.item_avatar-name {
  font-family: Inter;
  font-weight: 500;
  font-style: medium;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0;
  color: #1b1a1e;
}

.item_avatar-img {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #eaeff4;
}

.item_content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-width: 0;
  width: 212px;
  height: fit-content;
  gap: 8px;
}

.item_content-title {
  width: 68px;
  height: 9px;
  font-family: Inter;
  font-weight: 500;
  font-style: medium;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0;
  color: #1b1a1e;
}

.item_content-description {
  width: 100%;
  font-family: Inter;
  font-weight: 400;
  font-style: regular;
  font-size: 10px;
  line-height: 15px;
  letter-spacing: 0;
  color: #6f7788;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.item_content-time {
  width: 100%;
  font-family: Inter;
  font-weight: 400;
  font-style: regular;
  font-size: 10px;
  line-height: 15px;
  letter-spacing: 0;
  color: #99a0ae;
}
</style>
