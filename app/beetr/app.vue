<template>
  <div>
    <ModuleFullscreenLoading v-if="isFullLoading" />
    <NuxtPage />
  </div>

</template>
<script setup lang="ts">
import ModuleFullscreenLoading from './components/module-fullscreen-loading.vue';
const nuxtApp = useNuxtApp()

const isFullLoading = ref(true)

// nuxtApp.hook('app:created', () => {
//   console.log('app:created');
//   isFullLoading.value = true
// })

nuxtApp.hook('page:finish', () => {
  setTimeout(() => {
    console.log('page:finish');
    isFullLoading.value = false
  }, 2000)
})
// const resizeWrapHeight = () => {
//   let vh = window.innerHeight * 0.01
//   document.documentElement.style.setProperty('--vh', `${vh}px`)
// }
// onMounted(() => {
//   window.addEventListener('resize', resizeWrapHeight)
//   resizeWrapHeight()
// })
</script>
<style lang="scss">
// @import './assets/theme/minxin/minxin.scss';

/* 禁用点击高亮 */
* {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  /* 设置为透明色 */
  outline: none;
  /* 去除可能的轮廓线 */
}
</style>
