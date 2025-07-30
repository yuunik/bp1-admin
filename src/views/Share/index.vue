<script setup lang="ts">

</script>

<template>
  <main class="px-20 pt-8">
    <div class="flex-col-between gap-24">
      <div class="flex gap-12">
        <!--<Avatar-->
        <!--    size={40}-->
        <!--    src={getFullFilePath(forumInfo?.userDto?.logo || '')}-->
        <!--/>-->
        <div class="flex-col gap-4">
          <span>Username</span>
          <span>09/09/2025</span>
        </div>
      </div>
      <article>
        <section>
          <h1>Title</h1>
        </section>
        <section>
          <p>Content</p>
        </section>
        <section class="w-full flex flex-col gap-12 mt-16">
          <div
              class="w-full h-257 bg-cover bg-center bg-no-repeat rounded-8"
              :style="{'background-image': ''}"
          />
        </section>
      </article>
    </div>
  </main>
  <el-button
      class="fixed right-112 left-112 bottom-68 btn-12 bg-[#006BF7] h-48"
      type="primary"
  >
    Open in App
  </el-button>
  <footer
      class="fixed bottom-0 left-0 w-full h-52 bg-[#F4F7FA] px-16 py-8 box-border flex items-center gap-16 border-t border-t-[1px] border-t-[#EAEEF4] border-t-solid"
  >
    <el-input
        placeholder="Say something..."
        class="bg-[#EAEEF4] h-36 rounded-12 border-none placeholder:text-14 placeholder:text-[#99A0AE] placeholder:font-normal"
    />
    <div class="row-items-center gap-4">
      <el-image width={24} height={24} src={Like} preview={false} />
      <span>1111</span>
    </div>
    <div class="row-items-center gap-4">
      <el-image  width={24} height={24} src={Favourite} preview={false} />
      <span>
            2222
          </span>
    </div>
    <div class="row-items-center gap-4">
      <el-image width={24} height={24} src={Comment} preview={false} />
      <span>
            3333
          </span>
    </div>
  </footer>
</template>

<style scoped lang="scss">

</style>