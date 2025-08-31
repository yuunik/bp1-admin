<script setup>
import { CircleCheckFilled } from '@element-plus/icons-vue'

const activeName = ref('Details')

const reporterList = ref([
  {
    id: 1,
    name: 'Jenny Wilson',
    avatar:
      'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    reason: 'Spam or Misleading',
  },
  {
    id: 2,
    name: 'Jacob Jones',
    avatar:
      'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    reason: 'Spam or Misleading',
  },
])

const urls = ref([
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
  'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
  'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
  'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
  'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
  'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
  'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
])

const articleRef = ref(null)

const postRef = ref(null)

const commentsRef = ref(null)

watch(activeName, (val) => {
  if (val === 'Post') {
    postRef.value.scrollIntoView({ behavior: 'smooth' })
  } else if (val === 'Comments') {
    commentsRef.value.scrollIntoView({ behavior: 'smooth' })
  } else if (val === 'Details') {
    postRef.value.scrollIntoView({ behavior: 'smooth' })
  }
})
</script>

<template>
  <div ref="articleRef" class="flex flex-col overflow-auto">
    <div
      class="heading-h2-20px-medium text-neutrals-off-black flex-between mx-32 mb-16 h-32"
    >
      <h3>Post Details</h3>
      <el-button>Delete</el-button>
    </div>
    <el-divider />
    <el-tabs v-model="activeName" class="mx-32">
      <el-tab-pane label="Details" name="Details" />
      <el-tab-pane label="Post" name="Post" />
      <el-tab-pane label="Comments" name="Comments" />
    </el-tabs>
    <el-divider />
    <!-- 贴文详情 -->
    <article class="mx-32 mb-24 mt-16 flex-1 overflow-auto">
      <!-- Post Header -->
      <section class="flex flex-col gap-8" ref="postRef">
        <!-- 发帖人信息 -->
        <div class="h-76 row-center gap-16">
          <el-avatar
            :size="40"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
          <span class="heading-body-large-body-14px-medium text-strong-950">
            Bessie Cooper
          </span>
        </div>
        <!-- 发帖时间 -->
        <dl class="mt-12 grid h-32 grid-cols-[112px_1fr_112px_1fr] gap-4">
          <dt class="row-center h-32">Date</dt>
          <dd class="row-center h-32">2022-01-01</dd>
          <dt class="row-center h-32">Status</dt>
          <dd class="row-center h-32">
            <el-tag type="danger">Reported</el-tag>
          </dd>
        </dl>
      </section>
      <!-- 被举报的信息 -->
      <section class="flex flex-col gap-8">
        <div class="heading-body-large-body-14px-medium row-center h-24 gap-2">
          <h4 class="text-neutrals-off-black">Reports</h4>
          <span class="text-neutrals-grey-3">3</span>
        </div>
        <!-- divider -->
        <el-divider />
        <div class="mx-32">
          <el-table :data="reporterList">
            <el-table-column prop="name" label="Name">
              <template #default="{ row }">
                <div class="row-center h-24">
                  <el-avatar
                    src="https://randomuser.me/api/portraits/women/45.jpg"
                    fit="cover"
                    class="mr-8 h-20 w-20"
                    alt="brand icon"
                    shape="circle"
                    :size="20"
                  >
                    <template #error>
                      <i class="i-ep:picture" />
                    </template>
                  </el-avatar>
                  <el-text>{{ row.name }}</el-text>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="reason" label="Reason" />
          </el-table>
        </div>
      </section>
      <!-- 贴文信息 -->
      <section class="mt-24 flex flex-col gap-8">
        <!-- 标题 -->
        <h4
          class="row-center heading-body-large-body-14px-medium text-neutrals-off-black h-24"
        >
          Post
        </h4>
        <!-- divider -->
        <el-divider />
        <!-- 贴文 -->
        <div class="flex flex-col gap-16">
          <h5 class="heading-h3-16px-medium text-neutrals-off-black">
            Car fault light, please help me to diagnose !
          </h5>
          <p
            class="text-neutrals-off-black heading-body-large-body-14px-regular"
          >
            Fellow riders, I have encountered a disturbing thing these days.
            When I was driving, I suddenly found that there was a fault light on
            the dashboard, which was a yellow light like an engine shape (the
            specific look I can not describe it accurately). I do not understand
            the knowledge of car diagnosis, so I want to ask the big gods in the
            community, does anyone know what this is probably?
          </p>
          <!-- 图片 -->
          <ul class="[&>li]:h-168 grid grid-cols-3 gap-8">
            <li v-for="url in urls" :key="url">
              <el-image
                :src="url"
                fit="cover"
                class="h-168 rounded-8 w-full"
                lazy
              />
            </li>
          </ul>
        </div>
      </section>
      <!-- 评论区 -->
      <section class="mt-24 flex flex-col gap-8" ref="commentsRef">
        <!-- 标题 -->
        <div class="heading-body-large-body-14px-medium row-center h-24 gap-2">
          <h4 class="text-neutrals-off-black">Comments</h4>
          <span class="text-neutrals-grey-3">5</span>
        </div>
        <!-- divider -->
        <el-divider />
        <!-- 评论列表 -->
        <div class="mt-8 flex flex-col gap-8">
          <div>
            <!-- 评论信息 -->
            <div class="flex gap-8">
              <!-- 评论人头像 -->
              <el-avatar
                src="https://randomuser.me/api/portraits/men/42.jpg"
                fit="cover"
                shape="circle"
                :size="40"
              />
              <!-- 评论内容 -->
              <div class="flex flex-1 flex-col gap-10">
                <!-- 评论人信息 -->
                <div class="flex-between">
                  <div class="flex gap-8">
                    <!-- 评论人昵称 -->
                    <span
                      class="heading-body-large-body-14px-regular text-neutrals-grey-4"
                    >
                      Devon Lane
                    </span>
                    <!-- 被采纳 -->
                    <div
                      class="row-center bg-status-colours-light-green text-status-colours-green rounded-36 gap-4 px-6 py-2"
                    >
                      <el-icon><CircleCheckFilled /></el-icon>
                      <span class="heading-body-body-12px-regular">
                        Accepted
                      </span>
                    </div>
                  </div>
                  <el-dropdown trigger="click">
                    <i class="i-ep:more-filled h-16 w-16 cursor-pointer" />
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item>
                          <i class="i-ep:delete mr-5 h-16 w-16" />
                          Delete
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
                <!-- 评论内容 -->
                <p
                  class="heading-body-large-body-14px-regular text-neutrals-off-black"
                >
                  I have also encountered similar engine failure lights before,
                  and my car was caused by dirty throttle. You can recall
                  whether you have been driving a lot in some bad road
                  conditions recently, such as dusty places or stop-and-go
                  traffic jams. This may also cause a fault light. I suggest
                  that if you have time, go to clean the throttle, maybe the
                  light will be off, I wish you good luck
                </p>
                <!-- 评论图片 -->
                <ul class="flex flex-wrap gap-8">
                  <li v-for="url in urls" :key="url">
                    <el-image
                      :src="url"
                      fit="cover"
                      class="w-120 h-120 rounded-8 w-full"
                      lazy
                    />
                  </li>
                </ul>
                <!-- 发帖时间 -->
                <span
                  class="text-neutrals-grey-3 heading-body-body-12px-regular"
                >
                  Yesterday
                </span>
              </div>
            </div>
            <!-- 回复信息 -->
            <div class="flex gap-8 pt-8">
              <div class="h-40 w-40"></div>
              <!-- 回复内容 -->
              <div class="flex gap-8">
                <!-- 评论人头像 -->
                <el-avatar
                  src="https://randomuser.me/api/portraits/men/50.jpg"
                  fit="cover"
                  shape="circle"
                  :size="24"
                />
                <!-- 评论内容 -->
                <div class="flex flex-1 flex-col gap-10">
                  <!-- 评论人信息 -->
                  <div class="row-center gap-8">
                    <!-- 评论人昵称 -->
                    <span
                      class="heading-body-large-body-14px-regular text-neutrals-grey-4"
                    >
                      Devon Lane
                    </span>
                    <!-- 被采纳 -->
                    <i
                      class="heading-body-body-12px-regular block rounded-full bg-[#E5F0FE] px-6 py-2 text-[#006BF7]"
                    >
                      Author
                    </i>
                  </div>
                  <!-- 评论内容 -->
                  <p
                    class="heading-body-large-body-14px-regular text-neutrals-off-black"
                  >
                    I have also encountered similar engine failure lights
                    before, and my car was caused by dirty throttle. You can
                    recall whether you have been driving a lot in some bad road
                    conditions recently, such as dusty places or stop-and-go
                    traffic jams. This may also cause a fault light. I suggest
                    that if you have time, go to clean the throttle, maybe the
                    light will be off, I wish you good luck
                  </p>
                  <!-- 发帖时间 -->
                  <span
                    class="text-neutrals-grey-3 heading-body-body-12px-regular"
                  >
                    Yesterday
                  </span>
                </div>
              </div>
            </div>
            <!-- 更多回复内容 -->
            <el-button text class="ml-48 mt-8">
              <span class="heading-body-body-12px-regular text-neutrals-grey-4">
                ----View 2 replies----
              </span>
            </el-button>
          </div>
          <div>
            <!-- 评论信息 -->
            <div class="flex gap-8">
              <!-- 评论人头像 -->
              <el-avatar
                src="https://randomuser.me/api/portraits/men/42.jpg"
                fit="cover"
                shape="circle"
                :size="40"
              />
              <!-- 评论内容 -->
              <div class="flex flex-1 flex-col gap-10">
                <!-- 评论人信息 -->
                <div class="flex-between">
                  <div class="flex gap-8">
                    <!-- 评论人昵称 -->
                    <span
                      class="heading-body-large-body-14px-regular text-neutrals-grey-4"
                    >
                      Devon Lane
                    </span>
                    <!-- 被采纳 -->
                    <div
                      class="row-center bg-status-colours-light-green text-status-colours-green rounded-36 gap-4 px-6 py-2"
                    >
                      <el-icon><CircleCheckFilled /></el-icon>
                      <span class="heading-body-body-12px-regular">
                        Accepted
                      </span>
                    </div>
                  </div>
                  <el-dropdown trigger="click">
                    <i class="i-ep:more-filled h-16 w-16 cursor-pointer" />
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item>
                          <i class="i-ep:delete mr-5 h-16 w-16" />
                          Delete
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
                <!-- 评论内容 -->
                <p
                  class="heading-body-large-body-14px-regular text-neutrals-off-black"
                >
                  I have also encountered similar engine failure lights before,
                  and my car was caused by dirty throttle. You can recall
                  whether you have been driving a lot in some bad road
                  conditions recently, such as dusty places or stop-and-go
                  traffic jams. This may also cause a fault light. I suggest
                  that if you have time, go to clean the throttle, maybe the
                  light will be off, I wish you good luck
                </p>
                <!-- 评论图片 -->
                <ul class="flex flex-wrap gap-8">
                  <li v-for="url in urls" :key="url">
                    <el-image
                      :src="url"
                      fit="cover"
                      class="w-120 h-120 rounded-8 w-full"
                      lazy
                    />
                  </li>
                </ul>
                <!-- 发帖时间 -->
                <span
                  class="text-neutrals-grey-3 heading-body-body-12px-regular"
                >
                  Yesterday
                </span>
              </div>
            </div>
            <!-- 回复信息 -->
            <div class="flex gap-8 pt-8">
              <div class="h-40 w-40"></div>
              <!-- 回复内容 -->
              <div class="flex gap-8">
                <!-- 评论人头像 -->
                <el-avatar
                  src="https://randomuser.me/api/portraits/men/50.jpg"
                  fit="cover"
                  shape="circle"
                  :size="24"
                />
                <!-- 评论内容 -->
                <div class="flex flex-1 flex-col gap-10">
                  <!-- 评论人信息 -->
                  <div class="row-center gap-8">
                    <!-- 评论人昵称 -->
                    <span
                      class="heading-body-large-body-14px-regular text-neutrals-grey-4"
                    >
                      Devon Lane
                    </span>
                    <!-- 被采纳 -->
                    <i
                      class="heading-body-body-12px-regular block rounded-full bg-[#E5F0FE] px-6 py-2 text-[#006BF7]"
                    >
                      Author
                    </i>
                  </div>
                  <!-- 评论内容 -->
                  <p
                    class="heading-body-large-body-14px-regular text-neutrals-off-black"
                  >
                    I have also encountered similar engine failure lights
                    before, and my car was caused by dirty throttle. You can
                    recall whether you have been driving a lot in some bad road
                    conditions recently, such as dusty places or stop-and-go
                    traffic jams. This may also cause a fault light. I suggest
                    that if you have time, go to clean the throttle, maybe the
                    light will be off, I wish you good luck
                  </p>
                  <!-- 发帖时间 -->
                  <span
                    class="text-neutrals-grey-3 heading-body-body-12px-regular"
                  >
                    Yesterday
                  </span>
                </div>
              </div>
            </div>
            <!-- 更多回复内容 -->
            <el-button text class="ml-48 mt-8">
              <span class="heading-body-body-12px-regular text-neutrals-grey-4">
                ----View 2 replies----
              </span>
            </el-button>
          </div>
          <div>
            <!-- 评论信息 -->
            <div class="flex gap-8">
              <!-- 评论人头像 -->
              <el-avatar
                src="https://randomuser.me/api/portraits/men/42.jpg"
                fit="cover"
                shape="circle"
                :size="40"
              />
              <!-- 评论内容 -->
              <div class="flex flex-1 flex-col gap-10">
                <!-- 评论人信息 -->
                <div class="flex-between">
                  <div class="flex gap-8">
                    <!-- 评论人昵称 -->
                    <span
                      class="heading-body-large-body-14px-regular text-neutrals-grey-4"
                    >
                      Devon Lane
                    </span>
                    <!-- 被采纳 -->
                    <div
                      class="row-center bg-status-colours-light-green text-status-colours-green rounded-36 gap-4 px-6 py-2"
                    >
                      <el-icon><CircleCheckFilled /></el-icon>
                      <span class="heading-body-body-12px-regular">
                        Accepted
                      </span>
                    </div>
                  </div>
                  <el-dropdown trigger="click">
                    <i class="i-ep:more-filled h-16 w-16 cursor-pointer" />
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item>
                          <i class="i-ep:delete mr-5 h-16 w-16" />
                          Delete
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
                <!-- 评论内容 -->
                <p
                  class="heading-body-large-body-14px-regular text-neutrals-off-black"
                >
                  I have also encountered similar engine failure lights before,
                  and my car was caused by dirty throttle. You can recall
                  whether you have been driving a lot in some bad road
                  conditions recently, such as dusty places or stop-and-go
                  traffic jams. This may also cause a fault light. I suggest
                  that if you have time, go to clean the throttle, maybe the
                  light will be off, I wish you good luck
                </p>
                <!-- 评论图片 -->
                <ul class="flex flex-wrap gap-8">
                  <li v-for="url in urls" :key="url">
                    <el-image
                      :src="url"
                      fit="cover"
                      class="w-120 h-120 rounded-8 w-full"
                      lazy
                    />
                  </li>
                </ul>
                <!-- 发帖时间 -->
                <span
                  class="text-neutrals-grey-3 heading-body-body-12px-regular"
                >
                  Yesterday
                </span>
              </div>
            </div>
            <!-- 回复信息 -->
            <div class="flex gap-8 pt-8">
              <div class="h-40 w-40"></div>
              <!-- 回复内容 -->
              <div class="flex gap-8">
                <!-- 评论人头像 -->
                <el-avatar
                  src="https://randomuser.me/api/portraits/men/50.jpg"
                  fit="cover"
                  shape="circle"
                  :size="24"
                />
                <!-- 评论内容 -->
                <div class="flex flex-1 flex-col gap-10">
                  <!-- 评论人信息 -->
                  <div class="row-center gap-8">
                    <!-- 评论人昵称 -->
                    <span
                      class="heading-body-large-body-14px-regular text-neutrals-grey-4"
                    >
                      Devon Lane
                    </span>
                    <!-- 被采纳 -->
                    <i
                      class="heading-body-body-12px-regular block rounded-full bg-[#E5F0FE] px-6 py-2 text-[#006BF7]"
                    >
                      Author
                    </i>
                  </div>
                  <!-- 评论内容 -->
                  <p
                    class="heading-body-large-body-14px-regular text-neutrals-off-black"
                  >
                    I have also encountered similar engine failure lights
                    before, and my car was caused by dirty throttle. You can
                    recall whether you have been driving a lot in some bad road
                    conditions recently, such as dusty places or stop-and-go
                    traffic jams. This may also cause a fault light. I suggest
                    that if you have time, go to clean the throttle, maybe the
                    light will be off, I wish you good luck
                  </p>
                  <!-- 发帖时间 -->
                  <span
                    class="text-neutrals-grey-3 heading-body-body-12px-regular"
                  >
                    Yesterday
                  </span>
                </div>
              </div>
            </div>
            <!-- 更多回复内容 -->
            <el-button text class="ml-48 mt-8">
              <span class="heading-body-body-12px-regular text-neutrals-grey-4">
                ----View 2 replies----
              </span>
            </el-button>
          </div>
          <div>
            <!-- 评论信息 -->
            <div class="flex gap-8">
              <!-- 评论人头像 -->
              <el-avatar
                src="https://randomuser.me/api/portraits/men/42.jpg"
                fit="cover"
                shape="circle"
                :size="40"
              />
              <!-- 评论内容 -->
              <div class="flex flex-1 flex-col gap-10">
                <!-- 评论人信息 -->
                <div class="flex-between">
                  <div class="flex gap-8">
                    <!-- 评论人昵称 -->
                    <span
                      class="heading-body-large-body-14px-regular text-neutrals-grey-4"
                    >
                      Devon Lane
                    </span>
                    <!-- 被采纳 -->
                    <div
                      class="row-center bg-status-colours-light-green text-status-colours-green rounded-36 gap-4 px-6 py-2"
                    >
                      <el-icon><CircleCheckFilled /></el-icon>
                      <span class="heading-body-body-12px-regular">
                        Accepted
                      </span>
                    </div>
                  </div>
                  <el-dropdown trigger="click">
                    <i class="i-ep:more-filled h-16 w-16 cursor-pointer" />
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item>
                          <i class="i-ep:delete mr-5 h-16 w-16" />
                          Delete
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
                <!-- 评论内容 -->
                <p
                  class="heading-body-large-body-14px-regular text-neutrals-off-black"
                >
                  I have also encountered similar engine failure lights before,
                  and my car was caused by dirty throttle. You can recall
                  whether you have been driving a lot in some bad road
                  conditions recently, such as dusty places or stop-and-go
                  traffic jams. This may also cause a fault light. I suggest
                  that if you have time, go to clean the throttle, maybe the
                  light will be off, I wish you good luck
                </p>
                <!-- 评论图片 -->
                <ul class="flex flex-wrap gap-8">
                  <li v-for="url in urls" :key="url">
                    <el-image
                      :src="url"
                      fit="cover"
                      class="w-120 h-120 rounded-8 w-full"
                      lazy
                    />
                  </li>
                </ul>
                <!-- 发帖时间 -->
                <span
                  class="text-neutrals-grey-3 heading-body-body-12px-regular"
                >
                  Yesterday
                </span>
              </div>
            </div>
            <!-- 回复信息 -->
            <div class="flex gap-8 pt-8">
              <div class="h-40 w-40"></div>
              <!-- 回复内容 -->
              <div class="flex gap-8">
                <!-- 评论人头像 -->
                <el-avatar
                  src="https://randomuser.me/api/portraits/men/50.jpg"
                  fit="cover"
                  shape="circle"
                  :size="24"
                />
                <!-- 评论内容 -->
                <div class="flex flex-1 flex-col gap-10">
                  <!-- 评论人信息 -->
                  <div class="row-center gap-8">
                    <!-- 评论人昵称 -->
                    <span
                      class="heading-body-large-body-14px-regular text-neutrals-grey-4"
                    >
                      Devon Lane
                    </span>
                    <!-- 被采纳 -->
                    <i
                      class="heading-body-body-12px-regular block rounded-full bg-[#E5F0FE] px-6 py-2 text-[#006BF7]"
                    >
                      Author
                    </i>
                  </div>
                  <!-- 评论内容 -->
                  <p
                    class="heading-body-large-body-14px-regular text-neutrals-off-black"
                  >
                    I have also encountered similar engine failure lights
                    before, and my car was caused by dirty throttle. You can
                    recall whether you have been driving a lot in some bad road
                    conditions recently, such as dusty places or stop-and-go
                    traffic jams. This may also cause a fault light. I suggest
                    that if you have time, go to clean the throttle, maybe the
                    light will be off, I wish you good luck
                  </p>
                  <!-- 发帖时间 -->
                  <span
                    class="text-neutrals-grey-3 heading-body-body-12px-regular"
                  >
                    Yesterday
                  </span>
                </div>
              </div>
            </div>
            <!-- 更多回复内容 -->
            <el-button text class="ml-48 mt-8">
              <span class="heading-body-body-12px-regular text-neutrals-grey-4">
                ----View 2 replies----
              </span>
            </el-button>
          </div>
          <div>
            <!-- 评论信息 -->
            <div class="flex gap-8">
              <!-- 评论人头像 -->
              <el-avatar
                src="https://randomuser.me/api/portraits/men/42.jpg"
                fit="cover"
                shape="circle"
                :size="40"
              />
              <!-- 评论内容 -->
              <div class="flex flex-1 flex-col gap-10">
                <!-- 评论人信息 -->
                <div class="flex-between">
                  <div class="flex gap-8">
                    <!-- 评论人昵称 -->
                    <span
                      class="heading-body-large-body-14px-regular text-neutrals-grey-4"
                    >
                      Devon Lane
                    </span>
                    <!-- 被采纳 -->
                    <div
                      class="row-center bg-status-colours-light-green text-status-colours-green rounded-36 gap-4 px-6 py-2"
                    >
                      <el-icon><CircleCheckFilled /></el-icon>
                      <span class="heading-body-body-12px-regular">
                        Accepted
                      </span>
                    </div>
                  </div>
                  <el-dropdown trigger="click">
                    <i class="i-ep:more-filled h-16 w-16 cursor-pointer" />
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item>
                          <i class="i-ep:delete mr-5 h-16 w-16" />
                          Delete
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
                <!-- 评论内容 -->
                <p
                  class="heading-body-large-body-14px-regular text-neutrals-off-black"
                >
                  I have also encountered similar engine failure lights before,
                  and my car was caused by dirty throttle. You can recall
                  whether you have been driving a lot in some bad road
                  conditions recently, such as dusty places or stop-and-go
                  traffic jams. This may also cause a fault light. I suggest
                  that if you have time, go to clean the throttle, maybe the
                  light will be off, I wish you good luck
                </p>
                <!-- 评论图片 -->
                <ul class="flex flex-wrap gap-8">
                  <li v-for="url in urls" :key="url">
                    <el-image
                      :src="url"
                      fit="cover"
                      class="w-120 h-120 rounded-8 w-full"
                      lazy
                    />
                  </li>
                </ul>
                <!-- 发帖时间 -->
                <span
                  class="text-neutrals-grey-3 heading-body-body-12px-regular"
                >
                  Yesterday
                </span>
              </div>
            </div>
            <!-- 回复信息 -->
            <div class="flex gap-8 pt-8">
              <div class="h-40 w-40"></div>
              <!-- 回复内容 -->
              <div class="flex gap-8">
                <!-- 评论人头像 -->
                <el-avatar
                  src="https://randomuser.me/api/portraits/men/50.jpg"
                  fit="cover"
                  shape="circle"
                  :size="24"
                />
                <!-- 评论内容 -->
                <div class="flex flex-1 flex-col gap-10">
                  <!-- 评论人信息 -->
                  <div class="row-center gap-8">
                    <!-- 评论人昵称 -->
                    <span
                      class="heading-body-large-body-14px-regular text-neutrals-grey-4"
                    >
                      Devon Lane
                    </span>
                    <!-- 被采纳 -->
                    <i
                      class="heading-body-body-12px-regular block rounded-full bg-[#E5F0FE] px-6 py-2 text-[#006BF7]"
                    >
                      Author
                    </i>
                  </div>
                  <!-- 评论内容 -->
                  <p
                    class="heading-body-large-body-14px-regular text-neutrals-off-black"
                  >
                    I have also encountered similar engine failure lights
                    before, and my car was caused by dirty throttle. You can
                    recall whether you have been driving a lot in some bad road
                    conditions recently, such as dusty places or stop-and-go
                    traffic jams. This may also cause a fault light. I suggest
                    that if you have time, go to clean the throttle, maybe the
                    light will be off, I wish you good luck
                  </p>
                  <!-- 发帖时间 -->
                  <span
                    class="text-neutrals-grey-3 heading-body-body-12px-regular"
                  >
                    Yesterday
                  </span>
                </div>
              </div>
            </div>
            <!-- 更多回复内容 -->
            <el-button text class="ml-48 mt-8">
              <span class="heading-body-body-12px-regular text-neutrals-grey-4">
                ----View 2 replies----
              </span>
            </el-button>
          </div>
          <div>
            <!-- 评论信息 -->
            <div class="flex gap-8">
              <!-- 评论人头像 -->
              <el-avatar
                src="https://randomuser.me/api/portraits/men/42.jpg"
                fit="cover"
                shape="circle"
                :size="40"
              />
              <!-- 评论内容 -->
              <div class="flex flex-1 flex-col gap-10">
                <!-- 评论人信息 -->
                <div class="flex-between">
                  <div class="flex gap-8">
                    <!-- 评论人昵称 -->
                    <span
                      class="heading-body-large-body-14px-regular text-neutrals-grey-4"
                    >
                      Devon Lane
                    </span>
                    <!-- 被采纳 -->
                    <div
                      class="row-center bg-status-colours-light-green text-status-colours-green rounded-36 gap-4 px-6 py-2"
                    >
                      <el-icon><CircleCheckFilled /></el-icon>
                      <span class="heading-body-body-12px-regular">
                        Accepted
                      </span>
                    </div>
                  </div>
                  <el-dropdown trigger="click">
                    <i class="i-ep:more-filled h-16 w-16 cursor-pointer" />
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item>
                          <i class="i-ep:delete mr-5 h-16 w-16" />
                          Delete
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
                <!-- 评论内容 -->
                <p
                  class="heading-body-large-body-14px-regular text-neutrals-off-black"
                >
                  I have also encountered similar engine failure lights before,
                  and my car was caused by dirty throttle. You can recall
                  whether you have been driving a lot in some bad road
                  conditions recently, such as dusty places or stop-and-go
                  traffic jams. This may also cause a fault light. I suggest
                  that if you have time, go to clean the throttle, maybe the
                  light will be off, I wish you good luck
                </p>
                <!-- 评论图片 -->
                <ul class="flex flex-wrap gap-8">
                  <li v-for="url in urls" :key="url">
                    <el-image
                      :src="url"
                      fit="cover"
                      class="w-120 h-120 rounded-8 w-full"
                      lazy
                    />
                  </li>
                </ul>
                <!-- 发帖时间 -->
                <span
                  class="text-neutrals-grey-3 heading-body-body-12px-regular"
                >
                  Yesterday
                </span>
              </div>
            </div>
            <!-- 回复信息 -->
            <div class="flex gap-8 pt-8">
              <div class="h-40 w-40"></div>
              <!-- 回复内容 -->
              <div class="flex gap-8">
                <!-- 评论人头像 -->
                <el-avatar
                  src="https://randomuser.me/api/portraits/men/50.jpg"
                  fit="cover"
                  shape="circle"
                  :size="24"
                />
                <!-- 评论内容 -->
                <div class="flex flex-1 flex-col gap-10">
                  <!-- 评论人信息 -->
                  <div class="row-center gap-8">
                    <!-- 评论人昵称 -->
                    <span
                      class="heading-body-large-body-14px-regular text-neutrals-grey-4"
                    >
                      Devon Lane
                    </span>
                    <!-- 被采纳 -->
                    <i
                      class="heading-body-body-12px-regular block rounded-full bg-[#E5F0FE] px-6 py-2 text-[#006BF7]"
                    >
                      Author
                    </i>
                  </div>
                  <!-- 评论内容 -->
                  <p
                    class="heading-body-large-body-14px-regular text-neutrals-off-black"
                  >
                    I have also encountered similar engine failure lights
                    before, and my car was caused by dirty throttle. You can
                    recall whether you have been driving a lot in some bad road
                    conditions recently, such as dusty places or stop-and-go
                    traffic jams. This may also cause a fault light. I suggest
                    that if you have time, go to clean the throttle, maybe the
                    light will be off, I wish you good luck
                  </p>
                  <!-- 发帖时间 -->
                  <span
                    class="text-neutrals-grey-3 heading-body-body-12px-regular"
                  >
                    Yesterday
                  </span>
                </div>
              </div>
            </div>
            <!-- 更多回复内容 -->
            <el-button text class="ml-48 mt-8">
              <span class="heading-body-body-12px-regular text-neutrals-grey-4">
                ----View 2 replies----
              </span>
            </el-button>
          </div>
        </div>
      </section>
    </article>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-tabs) {
  @apply my-0;
}
</style>
