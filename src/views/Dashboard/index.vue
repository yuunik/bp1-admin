<script setup>
import { Line } from 'vue-chartjs'

import ContentItem from '@/views/Dashboard/components/ContentItem.vue'

// 静态资源
import GreetingIcon from '@/assets/images/Waving Hand.png'
import { useUserStore } from '@/store/index.js'
import { storeToRefs } from 'pinia'
import { getTodayWithWeekday } from '@/utils/dateUtil.js'

const chartData = ref({
  labels: [
    '2025-07-18',
    '2025-07-19',
    '2025-07-20',
    '2025-07-21',
    '2025-07-22',
  ],
  datasets: [
    {
      label: 'My Data',
      data: [3, 4, 5, 2, 6],
      borderColor: '#3b82f6',
      backgroundColor: '#3b82f6',
      pointBackgroundColor: '#3b82f6',
      pointRadius: 4,
      tension: 0.3,
      fill: false,
    },
  ],
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      backgroundColor: '#1f2937',
      titleColor: '#fff',
      bodyColor: '#fff',
      callbacks: {
        title: ([ctx]) => {
          const date = new Date(ctx.label)
          return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
          }) // e.g. "20 July"
        },
        label: (ctx) => `${ctx.dataset.data[ctx.dataIndex]}`,
      },
    },
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      time: {
        unit: 'day',
        tooltipFormat: 'dd MMMM',
      },
      ticks: {
        display: false, // 隐藏x轴标签
      },
      grid: {
        display: false, // 隐藏x轴网格线
      },
    },
    y: {
      ticks: {
        display: false, // 隐藏y轴标签
      },
      grid: {
        display: false, // 隐藏y轴网格线
      },
    },
  },
})

const userStore = useUserStore()

// 获取用户相关信息
const { username } = storeToRefs(userStore)
</script>

<template>
  <div class="dashboard-container">
    <div class="container-left">
      <div class="greeting">
        <div class="greeting-left">
          <p class="greeting-left_welcome">Welcome back!</p>
          <div class="greeting-left_name">
            <h2 class="greeting-left_name_text">{{ username }}</h2>
            <div class="h-24 w-24">
              <img :src="GreetingIcon" alt="Waving Hand" />
            </div>
          </div>
        </div>
        <p class="greeting-right">{{ getTodayWithWeekday() }}</p>
      </div>
      <div class="order">
        <div class="order_1">
          <div class="order_1_left">
            <div class="order_1_left-text">Order</div>
          </div>
          <div class="order_1_right-vector">
            <i class="icon-typesarrow-right"></i>
          </div>
        </div>
        <div class="order_2">
          <div class="order_2_box1">
            <div class="order_2_allorders">All Orders</div>
            <div class="order_2_allorders-data">100</div>
          </div>
          <div class="order_2_box1">
            <div class="order_2_new text-nowrap">Add New</div>
            <div class="order_2_new-data">20</div>
          </div>
        </div>
        <div class="order_3">
          <div class="order_3_box3">
            <div class="order_3_pending">Pending</div>
            <div class="order_3_pending-data">20</div>
          </div>
          <div class="order_3_box3">
            <div class="order_3_shipped">Shipped</div>
            <div class="order_3_shipped-data">20</div>
          </div>
          <div class="order_3_box3">
            <div class="order_3_refund">Refund</div>
            <div class="order_3_refund-data">10</div>
          </div>
        </div>
      </div>
      <div class="obd">
        <div class="layout-1">
          <div class="layout-1-text">OBD</div>
          <div class="layout-1-vector">
            <i class="icon-typesarrow-right"></i>
          </div>
        </div>
        <div class="obd_content">
          <div class="obd_box_1">
            <div class="type-1">In Stock</div>
            <div class="obd_box-data1">500</div>
          </div>
          <div class="obd_box_2">
            <div class="type-1">In Use</div>
            <div class="obd_box-data2">500</div>
          </div>
        </div>
      </div>
      <div class="user">
        <div class="layout-1">
          <div class="layout-1-text">User</div>
          <div class="layout-1-vector">
            <i class="icon-typesarrow-right"></i>
          </div>
        </div>
        <div class="user_content">
          <div class="user_box">
            <div class="type-1">All User</div>
            <div class="type-2">200</div>
          </div>
          <div class="user_box">
            <div class="type-1">Active Users</div>
            <div class="type-2">80</div>
          </div>
          <div class="user_box">
            <div class="type-1">OBD Users</div>
            <div class="type-2">60</div>
          </div>
        </div>
      </div>
    </div>

    <div class="container-right">
      <div class="container-right_1">
        <div class="container-card1">
          <div class="container-card1-left">
            <div class="type-1">Subcription</div>
            <div class="type-2">50</div>
          </div>
          <div class="container-card1-right">
            <div class="type-1 text-nowrap">Subscription Rate</div>
            <div class="type-2">40%</div>
          </div>
        </div>
        <div class="container-card2 w-full">
          <div class="container-card2-left">
            <div class="card2-left_1">New Subscription</div>
            <div class="card2-left_2">
              <div class="card2-left_2-1">5</div>
              <div class="card2-left_2-2-1">
                <div class="card2-left_2-2-2">-2%</div>
              </div>
            </div>
            <div class="card2-left_3">Compared to last month</div>
          </div>
          <div class="container-card2-right">
            <!--<Line :data="chartData" :options="chartOptions" />-->
          </div>
        </div>
        <div class="container-card3">
          <div class="container-card3-left"></div>
          <div class="container-card3-right">
            <div class="card3-right_1">Order from</div>
            <div class="card3-right_2">
              <div class="card3-right_2-left">
                <div class="card3-right_2-icon"></div>
                <div class="card3-right_2-text">App</div>
              </div>
              <div class="card3-right_2-num">20</div>
            </div>
            <div class="card3-right_3">
              <div class="card3-right_3-left">
                <div class="card3-right_3-icon"></div>
                <div class="card3-right_3-text">Web</div>
              </div>
              <div class="card3-right_3-num">80</div>
            </div>
          </div>
        </div>
      </div>
      <div class="container-right_2">
        <div class="notification-title">
          <div class="notification-title-left">Notifications</div>
          <div class="notification-title-right">
            <i class="icon-typesarrow-right"></i>
          </div>
        </div>
        <div class="notification-content">
          <ContentItem
            v-for="item in 100"
            :key="item"
            avatarName="JW"
            title="Title"
            description="Description"
            time="1 mins ago"
          ></ContentItem>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  padding: 8px;
  gap: 8px;
  box-sizing: border-box;
  overflow: hidden;
}

.container-left {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  flex: 0 0 76%;
  padding: 32px;
  gap: 32px;
  overflow: hidden;
}

.greeting {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: none;
  gap: 32px;
  min-height: 60px;
}

.greeting-left {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  max-width: none;
  gap: 8px;
}

.greeting-right {
  display: flex;
  justify-content: end;
  align-items: center;
  width: 100%;
  max-width: none;
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0;
  color: #6f7788;
}

.greeting-left_welcome {
  width: 100%;
  max-width: none;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0;
  color: #6f7788;
}

.greeting-left_name {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: none;
  gap: 4px;
}

.greeting-left_name_text {
  width: fit-content;
  height: 15px;
  content: 'Jonathan Wong';
  font-weight: 500;
  font-size: 20px;
  line-height: 30px;
  letter-spacing: 0;
  color: #1b1a1e;
}

.order {
  display: flex;
  flex-direction: column;
  flex: 2;
  width: 100%;
  max-width: none;
  border-radius: 8px;
  gap: 8px;
}

.order_1 {
  display: flex;
  width: 100%;
  max-width: none;
  justify-content: space-between;
  padding-top: 8px;
  padding-bottom: 16px;
}

.order_2 {
  display: flex;
  flex-direction: row;
  flex: 1;
  width: 100%;
  max-width: none;
  gap: 16px;
}

.order_3 {
  display: flex;
  flex-direction: row;
  flex: 1;
  width: 100%;
  max-width: none;
  padding-top: 8px;
  gap: 16px;
}

.order_1_left {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: none;
  max-width: 72px;
  max-height: 10px;
  gap: 8px;
}

.order_1_left-text {
  width: 100%;
  max-width: none;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0;
  color: #1b1a1e;
}

.order_1_right-vector {
  width: 6.11px;
  height: 10px;
  fill: #99a0ae;
}

.order_2_box1 {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  max-width: none;
  height: 100%;
  border-radius: 8px;
  padding: 16px;
  gap: 16px;
  background-color: #eaeff4;
}

.order_2_allorders {
  width: 66px;
  height: 10px;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0;
  vertical-align: middle;
  color: #6f7788;
}

.order_2_allorders-data {
  width: 220px;
  height: 19px;
  font-weight: 500;
  font-size: 26px;
  line-height: 34px;
  letter-spacing: 0;
  vertical-align: middle;
  color: #1b1a1e;
}

.order_2_new {
  width: 28px;
  height: 10px;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0;
  vertical-align: middle;
  color: #6f7788;
}

.order_2_new-data {
  width: 220px;
  height: 19px;
  font-weight: 500;
  font-size: 26px;
  line-height: 34px;
  letter-spacing: 0;
  vertical-align: middle;
  color: #1b1a1e;
}

.order_3_box3 {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  max-width: none;
  border-radius: 8px;
  padding: 16px;
  gap: 16px;
  background-color: #eaeff4;
}

.order_3_pending {
  width: 54px;
  height: 10px;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0;
  vertical-align: middle;
  color: #6f7788;
}

.order_3_pending-data {
  width: 130.67px;
  height: 19px;
  font-weight: 500;
  font-size: 26px;
  line-height: 34px;
  letter-spacing: 0;
  vertical-align: middle;
  color: #f6b51e;
}

.order_3_shipped {
  width: 55px;
  height: 10px;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0;
  vertical-align: middle;
  color: #6f7788;
}

.order_3_shipped-data {
  width: 130.67px;
  height: 19px;
  font-weight: 500;
  font-size: 26px;
  line-height: 34px;
  letter-spacing: 0;
  vertical-align: middle;
  color: #ff6d1a;
}

.order_3_refund {
  width: 48px;
  height: 10px;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0;
  vertical-align: middle;
  color: #6f7788;
}

.order_3_refund-data {
  width: 130.67px;
  height: 19px;
  font-weight: 500;
  font-size: 26px;
  line-height: 34px;
  letter-spacing: 0;
  vertical-align: middle;
  color: #6b07ec;
}

.obd {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  max-width: none;
  border-radius: 8px;
  gap: 8px;
}

.layout-1 {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: none;
  justify-content: space-between;
  padding-top: 8px;
  padding-bottom: 16px;
}

.layout-1-text {
  display: flex;
  flex-direction: row;
  max-width: 64px;
  max-height: 10px;
  gap: 8px;
}

.layout-1-vector {
  width: 6.11px;
  height: 10px;
  fill: #99a0ae;
}

.obd_content {
  display: flex;
  flex-direction: row;
  flex: 1;
  width: 100%;
  max-width: none;
  gap: 24px;
}

.obd_box_1 {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  max-width: none;
  border-radius: 8px;
  padding: 16px;
  gap: 16px;
  background-color: #e6f7f5;
}

.obd_box_2 {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  max-width: none;
  border-radius: 8px;
  padding: 16px;
  gap: 16px;
  background-color: #ebf0f8;
}

.type-1 {
  width: 86px;
  height: 10px;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0;
  vertical-align: middle;
  color: #6f7788;
}

.obd_box-data1 {
  width: 216px;
  height: 19px;
  font-weight: 500;
  font-size: 26px;
  line-height: 34px;
  vertical-align: middle;
  color: #05ad9d;
}

.obd_box-data2 {
  width: 216px;
  height: 19px;
  font-weight: 500;
  font-size: 26px;
  line-height: 34px;
  vertical-align: middle;
  color: #3288f8;
}

.user {
  display: flex;
  flex-direction: column;
  flex: 1;
  border-radius: 8px;
  gap: 8px;
}

.user_content {
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
  width: 100%;
  max-width: none;
  gap: 8px;
}

.user_box {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  max-width: none;
  border-radius: 8px;
  padding: 16px;
  gap: 16px;
  background-color: #eaeff4;
}

.type-2 {
  width: 130.67px;
  height: 19px;
  font-weight: 500;
  font-size: 26px;
  line-height: 34px;
  letter-spacing: 0;
  vertical-align: middle;
  color: #1b1a1e;
}

.container-right {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  flex: 1;
  width: auto;
  height: 100%;
  max-width: none;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-left: 1px solid #eaeff4;
  padding-top: 16px;
  padding-bottom: 16px;
  gap: 32px;
  background-color: #fcfcfc;
  overflow: hidden;
}

.container-right_1 {
  display: flex;
  flex-direction: column;
  flex: 1.3;
  width: 100%;
  max-width: none;
  box-sizing: border-box;
  padding-right: 16px;
  padding-left: 16px;
  gap: 16px;
}

.container-right_2 {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  max-width: none;
  border-radius: 8px;
  padding-right: 16px;
  padding-left: 16px;
  flex: 1;
  min-height: 0;
}

.container-card1 {
  display: flex;
  flex: 1;
  box-sizing: border-box;
  width: 100%;
  height: auto;
  border-radius: 8px;
  border: 1px solid #eaeff4;
  padding: 16px;
  gap: 16px;
  box-shadow: 0 1px 2px 0 rgba(10, 173, 212, 0.03);
}

.container-card2 {
  display: flex;
  flex-direction: row;
  flex: 1;
  box-sizing: border-box;
  width: 100%;
  height: auto;
  border-radius: 8px;
  padding: 24px 16px;
  gap: 24px;
  background: radial-gradient(#0a1c34, #1b1a1e);
  box-shadow: 0 1px 2px 0 rgba(10, 173, 212, 0.03);
}

.container-card3 {
  display: flex;
  flex-direction: row;
  flex: 1;
  width: 100%;
  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid #eaeff4;
  padding: 16px;
  gap: 16px;
  box-shadow: 0 1px 2px 0 rgba(10, 173, 212, 0.03);
}

.container-card1-left {
  display: flex;
  flex-direction: column;
  width: 50%;
  height: fit-content;
  max-height: 45px;
  gap: 16px;
}

.container-card1-right {
  display: flex;
  flex-direction: column;
  width: 50%;
  height: fit-content;
  max-height: 45px;
  gap: 16px;
}

.container-card2-left {
  display: flex;
  flex-direction: column;
  height: fit-content;
  flex: 1;
  gap: 16px;
}

.card2-left_1 {
  width: 101px;
  height: 9px;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0;
  color: #cacfdb;
}

.card2-left_2 {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: fit-content;
  gap: 8px;
}

.card2-left_2-1 {
  width: 17px;
  height: 19px;
  font-weight: 500;
  font-size: 26px;
  line-height: 34px;
  color: #fcfcfc;
}

.card2-left_2-2-1 {
  width: 23px;
  height: 9px;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: #ef3c30;
}

.card2-left_2-2-2 {
  display: flex;
  flex-direction: row;
  width: fit-content;
  height: fit-content;
  border-radius: 100px;
  padding: 4px;
  gap: 8px;
  background-color: rgba(239, 60, 48, 0.2);
}

.card2-left_3 {
  width: 157px;
  height: 7px;
  font-weight: 400;
  font-size: 10px;
  line-height: 15px;
  letter-spacing: 0;
  color: #99aaae;
  vertical-align: middle;
}

.container-card3-left {
  width: 96px;
  height: 96px;
  border: 2px solid #fcfcfc;
  background-color: $branding-colours-primary;
  border-radius: 50%;
}

.container-card3-right {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: fit-content;
  max-height: 59px;
  gap: 16px;
}

.card3-right_1 {
  font-weight: 400;
  font-style: normal;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0;
  color: #6f7788;
}

.card3-right_2 {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: fit-content;
  justify-content: space-between;
}

.card3-right_2-left {
  display: flex;
  flex-direction: row;
  width: fit-content;
  height: fit-content;
  gap: 8px;
  min-height: 8px;
}

.card3-right_2-icon {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: radial-gradient(circle, #0a1c34, #1b1a1e);
}

.card3-right_2-text {
  font-weight: 400;
  font-size: 10px;
  line-height: 15px;
  letter-spacing: 0;
  color: #6f7788;
}

.card3-right_2-num {
  font-weight: 500;
  font-style: normal;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0;
  color: #1b1a1e;
}

.card3-right_3 {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: fit-content;
  justify-content: space-between;
}

.card3-right_3-left {
  display: flex;
  flex-direction: row;
  width: fit-content;
  height: fit-content;
  gap: 8px;
  min-height: 8px;
}

.card3-right_3-icon {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #006bf7;
}

.card3-right_3-text {
  font-weight: 400;
  font-style: normal;
  font-size: 10px;
  line-height: 15px;
  letter-spacing: 0;
  color: #6f7788;
}

.card3-right_3-num {
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0;
  color: #1b1a1e;
}

.notification-content {
  width: 100%;
  flex: 1;
  overflow: hidden;
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  box-sizing: border-box;
}

.notification-content::-webkit-scrollbar {
  display: none;
}

.notification-title {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 32px;
  justify-content: space-between;
  padding-top: 8px;
  padding-bottom: 8px;
}

.notification-title-left {
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #1b1a1e;
}

.notification-title-right {
  width: 6.11px;
  height: 10px;
}
</style>
