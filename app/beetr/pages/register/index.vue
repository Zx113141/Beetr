<script setup lang="ts">
import ModuleForm from '@/components/module-registry-form.vue'
import ModuleAnimation from '@/components/module-registry-animation.vue'
onMounted(() => {
  document.documentElement.setAttribute('data-theme', 'light');

  // iframeRef.value!.contentDocument!.documentElement.setAttribute('data-theme', 'light')
})
</script>

<template>
  <div class="overflow- relative flex min-h-screen w-full flex-col">
    <div class="flex min-h-screen flex-col items-center will-change-transform" style="opacity: 1">
      <div class="flex min-h-screen w-full max-w-[1728px] flex-col p-7 sm:p-16 lg:flex-row">
        <ModuleForm></ModuleForm>
        <ModuleAnimation></ModuleAnimation>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import url('./register.css');
</style>
