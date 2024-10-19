<script setup lang="ts">
import pngCardDouyin from '../images/widget-parent-3.png'
import pngCardWeibo from '../images/widget-parent-5.png'
import { _userStore } from '@/store/user'
import { TOKEN_CREDENTIALS } from '@beetr/constant'
import {
  sendCaptcha,
  onLoginByUrl,
  onLoginByPhone,
  type IOnLoginByPhoneReq,
  type IOnLoginByUrlReq,
  type IUserInfoRes,
} from '@/api/user/user'
const userStore = _userStore()
const router = useRouter()
const isLogin = ref(useCookie(TOKEN_CREDENTIALS))
const create = async () => {
  if (isLogin.value) {
    const userInfo: IUserInfoRes = await userStore.queryUserInfo()
    router.push(userInfo.url)
    return
  }
  router.push("/register")
}

// 链接
const uniqueLink = reactive([
  'tito',
  'selim',
  'mary',
  'valerie',
  'mugeeb',
  'silvan',
  'adeline',
  'dennis',
  'michele',
  'eike',
  'may-li',
  'clara',
])
const loadUniqueLink = () => {
}
onMounted(() => {
  // TODO 加载推荐链接
  loadUniqueLink()
})
</script>

<template>
  <div dr="" class="unique-link">
    <div class="subheading-group">
      <h1 class="subheading-2">立刻生成属于你的唯一主页链接<br /></h1>
      <h1 class="subheading-tiny">再不注册，包含你名字的链接就被人占用啦！<br /></h1>
    </div>
    <div class="container-area">
      <h1 class="subheading-1-a">beetr.cc/</h1>
      <div class="vertical-carousel">
        <div data-w-id="c5363f8d-0af7-f94c-e7ab-31948b8bb8fe" class="carousel-content">
          <h1 class="subheading-1-b" v-for="(item, key) in uniqueLink" :key="key">{{ item }}</h1>
          <h1 class="subheading-1-b" v-for="(item, key) in uniqueLink" :key="key">{{ item }}</h1>
        </div>
        <div class="fade-out-top"></div>
        <div class="fade-out-bottom"></div>
      </div>

      <div class="div-block-33-copy">
        <el-image class="image-50-copy align-top" lazy :src="pngCardDouyin"></el-image>
      </div>
      <div class="div-block-35-copy">
        <el-image class="image-51 align-top" lazy :src="pngCardWeibo"></el-image>
      </div>
    </div>
    <div class="form-block w-form">
      <form id="email-form" name="email-form" data-name="Email Form" redirect="/home/get-early-access"
        data-redirect="/home/get-early-access" method="get" class="form" aria-label="Email Form">
        <label for="Email-3" class="field-label">Email Address</label><input id="Email-3" type="email"
          class="text-field w-input" maxlength="256" name="Email" data-name="Email" placeholder="Email Address" /><input
          type="submit" value="Get Early Access" data-wait="Adding you..." class="submit-button w-button" />
      </form>
      <div class="success-message-2 w-form-done" tabindex="-1" role="region" aria-label="Email Form success">
        <div class="text-block-10">You're on the waitlist!</div>
      </div>
      <div class="w-form-fail" tabindex="-1" role="region" aria-label="Email Form failure">
        <div>Oops! Something went wrong while submitting the form.</div>
      </div>
    </div>
    <div class="main-link-container">
      <span class="link-block-340 w-inline-block cursor-pointer" @click="create">
        <div class="text-block-28">立即创建！</div>
      </span>
    </div>
  </div>
</template>
<style scoped lang="scss">
.carousel-content {
  animation: loop 24000ms linear infinite;

  @keyframes loop {
    from {
      transform: translateY(31%);
    }

    to {
      transform: translateY(-19.1%);
    }
  }
}
</style>
