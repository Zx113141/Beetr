<script setup lang="ts">
import pngWidgetParent1 from '../images/widget-parent-1.png'
import pngWidgetParent2 from '../images/widget-parent-2.png'
import pngWidgetParent3 from '../images/widget-parent-3.png'
import pngWidgetParent4 from '../images/widget-parent-4.png'
import pngWidgetParent5 from '../images/widget-parent-5.png'
import pngWidgetParent6 from '../images/widget-parent-6.png'
import { _userStore } from '@/store/user'
import {
  sendCaptcha,
  onLoginByUrl,
  onLoginByPhone,
  type IOnLoginByPhoneReq,
  type IOnLoginByUrlReq,
  type IUserInfoRes,
} from '@/api/user/user'
import { TOKEN_CREDENTIALS } from '@beetr/constant'
const props = defineProps<{
  getTransitionStyle: Function
}>()

const isLogin = ref(useCookie(TOKEN_CREDENTIALS))
const { getTransitionStyle } = toRefs(props)

const userStore = _userStore()

const router = useRouter()

/** 去登录 */
const onLogin = async () => {
  if (isLogin.value) {
    const userInfo: IUserInfoRes = await userStore.queryUserInfo()
    router.push(userInfo.url)
    return
  }
  const url = userStore.userInfo?.url
  router.push(url || '/login')
}

/** 去登录 */
const toLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="new-hero">
    <div class="hero-content-container" data-w-id="eb247769-217a-397f-eb38-954a80936974"
      :style="getTransitionStyle('eb247769-217a-397f-eb38-954a80936974')">
      <div class="widget-parent-1" data-w-id="83a845c0-47bc-de00-f286-0c82adad98ce"
        :style="getTransitionStyle('83a845c0-47bc-de00-f286-0c82adad98ce')">
        <el-image class="image-square align-top" lazy :src="pngWidgetParent1"></el-image>
      </div>

      <div class="widget-parent-2" data-w-id="468c03c8-c19e-776f-4a11-465a0ac15831"
        :style="getTransitionStyle('468c03c8-c19e-776f-4a11-465a0ac15831')">
        <el-image class="image-wide align-top" lazy :src="pngWidgetParent2"></el-image>
      </div>

      <div class="widget-parent-3" data-w-id="ffcce45d-359e-ae0e-38aa-f1cca78af502"
        :style="getTransitionStyle('ffcce45d-359e-ae0e-38aa-f1cca78af502')">
        <el-image class="image-square align-top" :src="pngWidgetParent3"></el-image>
      </div>

      <div data-w-id="aac193d9-2d8c-1142-e67a-454lk666666"
        :style="getTransitionStyle('aac193d9-2d8c-1142-e67a-454lk666666')" class="widget-parent-6">
        <el-image class="image-square align-top" lazy :src="pngWidgetParent6"></el-image>
      </div>

      <div data-w-id="3d305a87-cbde-ab14-700d-7b9983e2c8cf"
        :style="getTransitionStyle('3d305a87-cbde-ab14-700d-7b9983e2c8cf')" class="widget-parent-4">
        <el-image class="image-tall align-top" :src="pngWidgetParent4"></el-image>
      </div>

      <div data-w-id="aac193d9-2d8c-1142-e67a-d6d27cd478ac"
        :style="getTransitionStyle('aac193d9-2d8c-1142-e67a-d6d27cd478ac')" class="widget-parent-5">
        <el-image class="image-square align-top" lazy :src="pngWidgetParent5"></el-image>
      </div>

      <img src="@/assets/images/logo.png" loading="lazy" width="120" data-w-id="83528388-c339-e879-0eb3-2960d6e942e8"
        :style="getTransitionStyle('83528388-c339-e879-0eb3-2960d6e942e8')" alt="" class="image-124" />
      <h2 data-w-id="38a4f5e0-0dba-d325-af04-8b436e1d3898"
        :style="getTransitionStyle('38a4f5e0-0dba-d325-af04-8b436e1d3898')" class="heading-12">
        便当盒
      </h2>
      <h1 data-w-id="e2a31dac-e2a6-32cb-a290-5ed289d6b50e"
        :style="getTransitionStyle('e2a31dac-e2a6-32cb-a290-5ed289d6b50e')" class="heading-13">
        上 beetr.cc!
        <br />
        重新定义你在互联网上的社交名片
      </h1>
      <h3 data-w-id="dca037c3-d3b8-6263-5cc1-9c3377544063"
        :style="getTransitionStyle('dca037c3-d3b8-6263-5cc1-9c3377544063')" class="heading-14">
        聚合你在互联网上的一切
      </h3>

      <div data-w-id="0a5d97be-e082-5516-1844-a85d33646823"
        :style="getTransitionStyle('0a5d97be-e082-5516-1844-a85d33646823')" class="main-link-container">
        <div class="link-block-340 w-inline-block cursor-pointer" @click="onLogin">
          <div class="text-block-28">现在开始</div>
        </div>
      </div>

      <span :style="getTransitionStyle('46a04392-b14d-4ba6-1efd-592fa2735286')"
        data-w-id="46a04392-b14d-4ba6-1efd-592fa2735286" href="http://bento.me/login"
        class="link-4 cursor-pointer hover:underline" @click="toLogin" v-if="!isLogin">登录</span>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.link-4 {
  color: #747474;
  margin-top: 16px;
  font-size: 12px;
  line-height: 16px;
  transition: all 0.2s cubic-bezier(0.52, 0.02, 0.25, 1);
}
</style>
