<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useDebounceFn } from '@vueuse/core'
import { storeToRefs } from 'pinia'

import { useUserStore } from '@/store'

import ContentItem from '@/views/Dashboard/components/ContentItem.vue';

// 静态资源
import Logo from '@/assets/icons/company-logo.svg'
import GreetingIcon from '@/assets/icons/waving-hand.svg'
</script>

<template>
  <div class="dashboard-container">
    <div class="container-left">
      <div class="greeting">
        <div class="greeting-left">
          <p class="greeting-left_welcome">Welcome back!</p>
          <div class="greeting-left_name">
            <h2 class="greeting-left_name_text">Jonathan Wong</h2>
            <div class="h-24 w-24">
              <img :src="GreetingIcon" alt="Waving Hand">
            </div>
          </div>
        </div>
        <p class="greeting-right">Tuesday,20 Aug</p>
      </div>
      <div class="order">
        <div class="order_1">
          <div class="order_1_left">
            <div class="order_1_left-text">
              Order
            </div>
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
            <div class="order_2_new">新增</div>
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
            <div class="type-1">活跃用户</div>
            <div class="type-2">80</div>
          </div>
          <div class="user_box">
            <div class="type-1">使用OBD用户</div>
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
            <div class="type-1">订阅率</div>
            <div class="type-2">40%</div>
          </div>
        </div>
        <div class="container-card2">
          <div class="container-card2-left">
            <div class="card2-left_1">
              New Subscription
            </div>
            <div class="card2-left_2">
              <div class="card2-left_2-1">5</div>
              <div class="card2-left_2-2-1">
                <div class="card2-left_2-2-2">-2%</div>
              </div>
            </div>
            <div class="card2-left_3">
              Compared to last month
            </div>
          </div>
          <div class="container-card2-right">
            图表
          </div>
        </div>
        <div class="container-card3">
          <div class="container-card3-left">

          </div>
          <div class="container-card3-right">
            <div class="card3-right_1">
              Order from
            </div>
            <div class="card3-right_2">
              <div class="card3-right_2-left">
                <div class="card3-right_2-icon">

                </div>
                <div class="card3-right_2-text">
                  App
                </div>
              </div>
              <div class="card3-right_2-num">
                20
              </div>
            </div>
            <div class="card3-right_3">
              <div class="card3-right_3-left">
                <div class="card3-right_3-icon">

                </div>
                <div class="card3-right_3-text">
                  Web
                </div>
              </div>
              <div class="card3-right_3-num">
                80
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container-right_2">
        <div class="notification-title">
          <div class="notification-title-left">
            Notifications
          </div>
          <div class="notification-title-right">
            <i class="icon-typesarrow-right"></i>
          </div>
        </div>
        <div class="notification-content">
          <ContentItem avatarName="JW" title="Title" description="Description" time="1 mins ago"></ContentItem>
          <ContentItem avatarName="JW" title="Title" description="Description" time="1 mins ago"></ContentItem>
          <ContentItem avatarName="JW" title="Title" description="Description" time="1 mins ago"></ContentItem>
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
  min-height: 750px;
  padding: 8px;
  gap: 8px;
  box-sizing: border-box;
  flex-wrap: nowrap;
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
  min-width: 300px;
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
  color: #6F7788;
}

.greeting-left_welcome {
  width: 100%;
  max-width: none;
  font-family: Inter;
  font-weight: 400;
  font-style: regular;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0%;
  color: #6F7788;
}

.greeting-left_name {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: none;
  gap: 4px;
}

.greeting-left_name_text {
  width: 150px;
  height: 15px;
  content: "Jonathan Wong";
  font-family: Inter;
  font-weight: 500;
  font-style: medium;
  font-size: 20px;
  line-height: 30px;
  letter-spacing: 0%;
  color: #1B1A1E;
}

.order {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: none;
  border-radius: 8px;
  gap: 8px;
  min-height: 226px;
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
  width: 100%;
  max-width: none;
  max-height: 85px;
  gap: 16px;
}

.order_3 {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: none;
  max-height: 93px;
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
  font-style: Medium;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0%;
  color: #1B1A1E;
}

.order_1_right-vector {
  width: 6.11px;
  height: 10px;
  fill: #99A0AE;
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
  background-color: #EAEFF4;
}

.order_2_allorders {
  width: 66px;
  height: 10px;
  font-weight: 400;
  font-style: Regular;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0%;
  vertical-align: middle;
  color: #6F7788;
}


.order_2_allorders-data {
  width: 220px;
  height: 19px;
  font-weight: 500;
  font-style: Medium;
  font-size: 26px;
  line-height: 34px;
  letter-spacing: 0%;
  vertical-align: middle;
  color: #1B1A1E;
}

.order_2_new {
  width: 28px;
  height: 10px;
  font-weight: 400;
  font-style: Regular;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0%;
  vertical-align: middle;
  color: #6F7788;
}

.order_2_new-data {
  width: 220px;
  height: 19px;
  font-weight: 500;
  font-style: Medium;
  font-size: 26px;
  line-height: 34px;
  letter-spacing: 0%;
  vertical-align: middle;
  color: #1B1A1E;
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
  background-color: #EAEFF4;
}

.order_3_pending {
  width: 54px;
  height: 10px;
  font-weight: 400;
  font-style: Regular;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0%;
  vertical-align: middle;
  color: #6F7788;
}

.order_3_pending-data {
  width: 130.67px;
  height: 19px;
  font-weight: 500;
  font-style: Medium;
  font-size: 26px;
  line-height: 34px;
  letter-spacing: 0%;
  vertical-align: middle;
  color: #F6B51E;
}

.order_3_shipped {
  width: 55px;
  height: 10px;
  font-family: Inter;
  font-weight: 400;
  font-style: Regular;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0%;
  vertical-align: middle;
  color: #6F7788;
}

.order_3_shipped-data {
  width: 130.67px;
  height: 19px;
  font-family: Inter;
  font-weight: 500;
  font-style: Medium;
  font-size: 26px;
  line-height: 34px;
  letter-spacing: 0%;
  vertical-align: middle;
  color: #FF6D1A;
}

.order_3_refund {
  width: 48px;
  height: 10px;
  font-family: Inter;
  font-weight: 400;
  font-style: Regular;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0%;
  vertical-align: middle;
  color: #6F7788;
}

.order_3_refund-data {
  width: 130.67px;
  height: 19px;
  font-family: Inter;
  font-weight: 500;
  font-style: Medium;
  font-size: 26px;
  line-height: 34px;
  letter-spacing: 0%;
  vertical-align: middle;
  color: #6B07EC;
}

.obd {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: none;
  min-height: 135px;
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
  fill: #99A0AE;
}

.obd_content {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: none;
  max-height: 85px;
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
  background-color: #E6F7F5;
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
  background-color: #EBF0F8;
}

.type-1 {
  width: 86px;
  height: 10px;
  font-family: Inter;
  font-weight: 400;
  font-style: Regular;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0%;
  vertical-align: middle;
  color: #6F7788;
}

.obd_box-data1 {
  width: 216px;
  height: 19px;
  font-family: Inter;
  font-weight: 500;
  font-style: Medium;
  font-size: 26px;
  line-height: 34px;
  letter-spacing: 0%;
  vertical-align: middle;
  color: #05AD9D;
}

.obd_box-data2 {
  width: 216px;
  height: 19px;
  font-family: Inter;
  font-weight: 500;
  font-style: Medium;
  font-size: 26px;
  line-height: 34px;
  letter-spacing: 0%;
  vertical-align: middle;
  color: #3288F8;
}

.user {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  min-height: 135px;
  gap: 8px;
}

.user_content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  max-width: none;
  max-height: 85px;
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
  background-color: #EAEFF4;
}

.type-2 {
  width: 130.67px;
  height: 19px;
  font-weight: 500;
  font-style: Medium;
  font-size: 26px;
  line-height: 34px;
  letter-spacing: 0%;
  vertical-align: middle;
  color: #1B1A1E;
}

.container-right {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  flex: 1;
  width: auto;
  height: 100%;
  min-width: 300px;
  max-height: 734px;
  max-width: none;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-left: 1px solid #EAEFF4;
  padding-top: 16px;
  padding-bottom: 16px;
  gap: 32px;
  background-color: #FCFCFC;
  overflow: hidden;
}

.container-right_1 {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: none;
  box-sizing: border-box;
  height: fit-content;
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
  flex-direction: row;
  box-sizing: border-box;
  width: 100%;
  height: 120px;
  border-radius: 8px;
  border: 1px solid #EAEFF4;
  padding: 16px;
  gap: 16px;
  box-shadow: 0 1px 2px 0 rgba(10, 173, 212, 0.03);
}

.container-card2 {
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  width: 100%;
  height: 130px;
  border-radius: 8px;
  padding: 24px 16px;
  gap: 24px;
  background: radial-gradient(#0A1C34, #1B1A1E);
  box-shadow: 0 1px 2px 0 rgba(10, 173, 212, 0.03);
}

.container-card3 {
  display: flex;
  flex-direction: row;
  width: 100%;
  box-sizing: border-box;
  height: 130px;
  border-radius: 8px;
  border: 1px solid #EAEFF4;
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
  font-family: Inter;
  font-weight: 400;
  font-style: regular;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0;
  color: #CACFDB;
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
  font-family: Inter;
  font-weight: 500;
  font-style: medium;
  font-size: 26px;
  line-height: 34px;
  color: #FCFCFC;
}

.card2-left_2-2-1 {
  width: 23px;
  height: 9px;
  font-family: Inter;
  font-weight: 500;
  font-style: medium;
  font-size: 12px;
  line-height: 16px;
  color: #EF3C30;
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
  font-family: Inter;
  font-weight: 400;
  font-style: regular;
  font-size: 10px;
  line-height: 15px;
  letter-spacing: 0;
  color: #99AAAE;
  vertical-align: middle;
}

.container-card3-left {
  width: 96px;
  height: 96px;
  border: 2px solid #FCFCFC;
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
  font-family: Inter;
  font-weight: 400;
  font-style: normal;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0%;
  color: #6F7788;
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
  min-width: 35px;
  min-height: 8px;
}

.card3-right_2-icon {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: radial-gradient(circle, #0A1C34, #1B1A1E);
}

.card3-right_2-text {
  font-family: Inter;
  font-weight: 400;
  font-style: Regular;
  font-size: 10px;
  line-height: 15px;
  letter-spacing: 0%;
  color: #6F7788;
}

.card3-right_2-num {
  font-family: Inter;
  font-weight: 500;
  font-style: normal;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0%;
  color: #1B1A1E;
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
  min-width: 38px;
  min-height: 8px;
}

.card3-right_3-icon {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #006BF7;
}

.card3-right_3-text {
  font-family: Inter;
  font-weight: 400;
  font-style: normal;
  font-size: 10px;
  line-height: 15px;
  letter-spacing: 0%;
  color: #6F7788;
}

.card3-right_3-num {
  font-family: Inter;
  font-weight: 500;
  font-style: Medium;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0%;
  color: #1B1A1E;
}

.notification-content {
  width: 100%;
  flex: 1;
  overflow: hidden;
  overflow-y: auto;
  max-height: calc(100% - 40px);
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
  flex-direction: horizontal;
  width: 100%;
  height: 32px;
  justify-content: space-between;
  padding-top: 8px;
  padding-bottom: 8px;
}

.notification-title-left {
  font-family: Inter;
  font-weight: 500;
  font-style: Medium;
  font-size: 14px;
  line-height: 20px;
  color: #1B1A1E;
}

.notification-title-right {
  width: 6.11px;
  height: 10px;
}
</style>
