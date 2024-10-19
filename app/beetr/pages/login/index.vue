<script setup lang="ts">
import ModuleForm from '@/components/module-login-form.vue'
import ModuleAnimation from '@/components/module-login-animation.vue'

onMounted(() => {
  document.documentElement.setAttribute('data-theme', 'light');

  // iframeRef.value!.contentDocument!.documentElement.setAttribute('data-theme', 'light')
})
</script>

<template>
  <div class="flex min-h-screen flex-col items-center">
    <div class="flex min-h-screen w-full max-w-[1728px] flex-col p-7 sm:p-16 lg:flex-row">
      <ModuleForm></ModuleForm>
      <ModuleAnimation></ModuleAnimation>
    </div>
  </div>
</template>

<style lang="scss">
@import url('./login.css');
</style>
