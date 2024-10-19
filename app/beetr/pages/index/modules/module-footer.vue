<script setup lang="ts">
import { TOKEN_CREDENTIALS } from '@beetr/constant'
const isLogin = ref(useCookie(TOKEN_CREDENTIALS))
const date = new Date().getFullYear()
</script>

<template>
  <div class="foooter">
    <img src="@/assets/images/logo_1.png" draggable="false" loading="eager" width="44" alt="" />
    <div class="link-container-area">
      <nuxt-link to="/login" target="_blank" class="link-3" v-if="!isLogin">登录</nuxt-link>
      <a class="link-3" href="/about" target="_blank">关于我们</a>
      <a class="link-3" href="/update" target="_blank">更新日志</a>
      <!-- <a class="link-3">发现</a> -->
    </div>
    <div class="link-container-area-puton">
      <a class="link-3 bottom_ip" href="https://beian.miit.gov.cn">Copyright @ 2021 - {{ date }} 黔ICP备2020009864号-3</a>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.bottom_ip {
  margin-top: 64px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
  line-height: 20.27px;
  color: rgba(170, 170, 170, 1);
}
</style>
