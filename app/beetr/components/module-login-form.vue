<script setup lang="ts">
import { type FormInstance, type FormRules } from 'element-plus'
import { _userStore } from '@/store/user'
import { LOAD_STATUS, ANIMATION_DIRECTION, REG_EMAIL_NUMBER, TOKEN_CREDENTIALS } from '@beetr/constant'
import {
  sendCaptcha,
  onLoginByUrl,
  onLoginByPhone,
  type IOnLoginByPhoneReq,
  type IOnLoginByUrlReq,
  type IUserInfoRes,
} from '@/api/user/user'

const Route = useRoute()
const Router = useRouter()
const store = _userStore()
/**
 * 登录模式
 * @account 账号密码登录
 * @phone 邮箱登录
 */
enum CURRENT_FORM {
  url = 'url',
  email = 'email',
}

/** 邮箱 密码登录表单 */
const emailFormRef = ref<FormInstance>()

/** 邮箱登录表单 */
const emailForm = reactive<IOnLoginByPhoneReq>({
  email: '',
  code: undefined,
})
/** 链接登录表单 */
const urlForm = reactive<IOnLoginByUrlReq>({

  password: '',
  email: ''
})
/** 表单校验规则 */
const emailRule = reactive<FormRules>({
  phone: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入邮箱',
    },
    {
      pattern: REG_EMAIL_NUMBER,
      trigger: 'blur',
      message: '邮箱格式不正确，请修改',
    },
  ],
})
/** 当前的登录模式 */
const currentForm = ref<keyof typeof CURRENT_FORM>(CURRENT_FORM.url)

/** 切换表单登录 */
const toggleForm = () => {
  currentForm.value = currentForm.value === CURRENT_FORM.url ? CURRENT_FORM.email : CURRENT_FORM.url
}

/** 按钮禁用状态 */
const statusButton = computed(() => {
  return currentForm.value === CURRENT_FORM.url
    ? !(urlForm.email && urlForm.password)
    : !(emailForm.email && emailForm.code)
})

/** 接口提交状态 */
const confirmLoadStatus = ref<keyof typeof LOAD_STATUS>(LOAD_STATUS.none)

/** 倒计时 */
const countdown = ref<'验证码' | number>('验证码')

/** 倒计时开始 */
const onStartCountdown = async () => {
  if (typeof countdown.value === 'number') return
  await emailFormRef.value!.validate()
  await sendCaptcha({ mode: '2', email: emailForm.email })
  countdown.value = 60
  const timeInter = setInterval(() => {
    countdown.value = (countdown.value as number) - 1
    if (countdown.value <= 0) {
      clearTimeout(timeInter)
      countdown.value = '验证码'
    }
  }, 1000)
}
/** 表单提交 */
const onSubmit = async () => {
  try {
    confirmLoadStatus.value = LOAD_STATUS.loading
    currentForm.value === CURRENT_FORM.email && (await emailFormRef.value!.validate())
    const res = await onLoginByUrl(urlForm)
    // currentForm.value === CURRENT_FORM.url
    //   ?
    //   : await onLoginByPhone(emailForm)

    const cookieToken = useCookie(TOKEN_CREDENTIALS)
    cookieToken.value = res.token
    /** 这里有个bug，直接跳转页 获取不到token,固这里这个nextTick */
    await nextTick()
    const userInfo: IUserInfoRes = await store.queryUserInfo()
    Router.push(userInfo.url)
    confirmLoadStatus.value = LOAD_STATUS.none
  } catch (error) {
    confirmLoadStatus.value = LOAD_STATUS.error
  }
}
</script>

<template>
  <div class="relative flex flex-1 flex-col items-center justify-center">
    <div class="flex w-full max-w-[448px] flex-col">
      <h1 class="mt-2 text-3xl">登录你的Beetr</h1>
      <p class="typography-paragraph mt-4">美好的一天即将开始！</p>
      <transition :name="currentForm === CURRENT_FORM.url
        ? ANIMATION_DIRECTION.sliderLeft
        : ANIMATION_DIRECTION.sliderRight
        " mode="out-in" appear>
        <!-- 账号密码登录表单 -->
        <el-form v-if="currentForm === CURRENT_FORM.url" :inline="true"
          class="mt-20 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          <el-form-item class="!m-0">
            <el-input v-model="urlForm.email" class="init_input" autofocus placeholder="email">
              <!-- <template #prepend>beetr.cc/</template> -->
            </el-input>
          </el-form-item>
          <el-form-item class="!m-0">
            <el-input v-model="urlForm.password" class="init_input" placeholder="Password" type="password"
              show-password />
          </el-form-item>
        </el-form>

        <!-- 手机验证码登录 -->
        <!-- <el-form v-else ref="emailFormRef" :inline="true" class="mt-20 grid w-full grid-cols-1 gap-3 sm:grid-cols-2"
          :rules="emailRule" :model="emailForm">
          <el-form-item class="!m-0" prop="phone">
            <el-input v-model="emailForm.email" class="init_input" autofocus placeholder="email">
            </el-input>
          </el-form-item>
          <el-form-item class="!m-0">
            <el-input v-model="emailForm.code" class="init_input" placeholder="code">
              <template #append>
                <span class="w-16 text-center h-4 text-sm leading-4 border-l border-solid border-black cursor-pointer"
                  @click="onStartCountdown">{{ countdown }}</span>
              </template>
            </el-input>
          </el-form-item>
        </el-form> -->
      </transition>
      <!-- <div class="mt-10 ml-0.5">
        <a class="text-xs cursor-pointer" @click="toggleForm">
          切换为
          <em v-show="currentForm === CURRENT_FORM.url" class="underline">邮箱登录</em>
          <em v-show="currentForm === CURRENT_FORM.email" class="underline">账号密码登录</em>
        </a>
      </div> -->
      <el-button :loading="confirmLoadStatus === LOAD_STATUS.loading" :disabled="statusButton"
        class="!h-[58px] sm:!h-[45px] mt-8" type="primary" @click="onSubmit">
        立即登录
      </el-button>
      <!-- <NuxtLink class="text-xs mt-8 mx-auto underline text-black" to="/forget">忘记密码？</NuxtLink> -->
      <div class="text-xs mt-8 mx-auto">
        <span class="text-gray-600">还没账号？</span>
        <NuxtLink class="underline text-black" to="/register">点我注册</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-form-item__error) {
  padding: 10px 0 0 0px !important;
}
</style>
