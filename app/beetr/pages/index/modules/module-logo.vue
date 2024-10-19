<script setup lang="ts">
const props = defineProps<{
  scrollTop: number
}>()

const { scrollTop } = toRefs(props)
const opacityStyle = computed(() => {
  const START = 500
  const END = 1400
  const opacity =
    scrollTop.value < START ? 0 : Math.min((scrollTop.value - START) / (END - START), 1)
  return `opacity: ${opacity};will-change: opacity`
})
</script>

<template>
  <div class="navbar" :style="opacityStyle">
    <a href="#" class="home-link-area w-inline-block"
      ><img src="@/assets/images/logo.png" loading="eager" width="36" alt="" class="image-104"
    /></a>
  </div>
</template>
