<script setup lang="ts">
import { type FormInstance, type FormRules } from 'element-plus'
import { Back, Loading } from '@element-plus/icons-vue'
import { type InternalRuleItem } from 'async-validator'
import { LOAD_STATUS, REG_EMAIL_NUMBER, TOKEN_CREDENTIALS, SvgSuccess } from '@beetr/constant'
import {
  exitEmailFlag, register, onLoginByUrl,

  type IUserInfoRes,
} from '@/api/user/user'

import { _userStore } from '@/store/user'
const Router = useRouter()
const store = _userStore()

/** 接口加载状态 */
const checkEmailStatus = ref<keyof typeof LOAD_STATUS>(LOAD_STATUS.none)
/** form实例 */
const formRef = ref<FormInstance>()

const validateEmailNumber = (
  _rule: InternalRuleItem,
  value: any,
  callback: (error?: string | Error | undefined) => void
) => {
  if (!value) callback(new Error('请输入邮箱号'))
  else if (!REG_EMAIL_NUMBER.test(value)) callback(new Error('邮箱格式不正确，请修改'))
  else {
    exitEmailFlag(value)
      .then(() => {
        checkEmailStatus.value = LOAD_STATUS.success
        callback()
      })
      .catch((error: any) => {
        if (error.code === 0 && error.message == '已存在该邮箱') {
          checkEmailStatus.value = LOAD_STATUS.none
          callback(new Error('邮箱号被注册，请更换'))
        } else {
          checkEmailStatus.value = LOAD_STATUS.error
          callback(new Error('网络出现了点问题'))
        }
      })
  }
}
/** 表单校验规则 */
const rules = reactive<FormRules>({
  email: {
    required: true,
    trigger: 'blur',
    validator: validateEmailNumber,
  },
  password: [
    {
      message: '请输入密码',
      required: true,
      trigger: 'blur',
    },
    {
      message: '*密码长度至少为3个字符，不超过16个',
      min: 3,
      max: 16,
      trigger: 'blur',
    },
  ],
})
/** 表单-对象 */
const form = reactive({
  /** 手机号 */
  email: '',
  /** 密码 */
  password: '',
  /** 用户注册的链接 */
  url: '',
})

/** 接口提交状态 */
const confirmLoadStatus = ref<keyof typeof LOAD_STATUS>(LOAD_STATUS.none)

/** 表单提交 */
const onSubmit = async () => {
  try {
    confirmLoadStatus.value = LOAD_STATUS.loading
    await formRef.value!.validate()
    await register(form)
    ElNotification({
      title: '成功',
      message: '注册成功',
      type: 'success',
    })
    confirmLoadStatus.value = LOAD_STATUS.none
    const res = await onLoginByUrl({
      email: form.email,
      password: form.password
    })

    const cookieToken = useCookie(TOKEN_CREDENTIALS)
    cookieToken.value = res.token
    /** 这里有个bug，直接跳转页 获取不到token,固这里这个nextTick */
    await nextTick()
    const userInfo: IUserInfoRes = await store.queryUserInfo()
    Router.push(userInfo.url)
    // Router.push(`/login?email=${form.email}`)
  } catch (error) {
    console.log(error)
    confirmLoadStatus.value = LOAD_STATUS.error
  }
}
const emit = defineEmits<{
  (event: 'toggleModule', baseUrl: string): void
}>()

/** 切换表单时，初始表单值 */
const init = (baseurl: string) => {
  form.url = baseurl
}

defineExpose({
  init,
})
</script>

<template>
  <div class="absolute inset-0 flex flex-col items-center justify-center styles_bold-step__0h8ZD">
    <div class="absolute top-0 left-0 sm:hidden" @click="emit('toggleModule', form.url)">
      <button class="active:scale-90">
        <el-icon size="1.25rem" color="#000000">
          <Back />
        </el-icon>
      </button>
    </div>
    <div class="relative flex w-full flex-col">
      <div class="absolute -top-10 left-0 hidden sm:block" @click="emit('toggleModule', form.url)">
        <button class="active:scale-90">
          <el-icon size="1.25rem" color="#000000">
            <Back />
          </el-icon>
        </button>
      </div>
      <div class="text-base text-black">
        <span class="underline mr-4">beetr.cc/{{ form.url }}</span> 这个专属链接是你的了！
        <SvgIcon icon-name="icon-loading"></SvgIcon>
      </div>
      <h1 class="mt-2 text-3xl text-black">现在, 输入账号信息</h1>
      <el-form ref="formRef" class="init_form mt-20" :model="form" :label-width="0" :rules="rules">
        <el-form-item prop="email" style="margin-bottom: 36px">
          <el-input v-model="form.email" autofocus placeholder="邮箱号">
            <template #suffix>
              <svg-success v-show="REG_EMAIL_NUMBER.test(form.email) && checkEmailStatus === LOAD_STATUS.success
                " style="color: rgb(78 221 118)"></svg-success>
              <el-icon v-show="checkEmailStatus === LOAD_STATUS.loading" class="is-loading" color="#000000">
                <Loading />
              </el-icon> </template></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 0" prop="password">
          <el-input v-model="form.password" placeholder="密码" type="password" show-password>
          </el-input>
        </el-form-item>
      </el-form>

      <el-button v-show="form.email && form.password" type="primary" class="mt-8 !h-[58px] sm:!h-[48px]"
        :loading="confirmLoadStatus === LOAD_STATUS.loading" @click="onSubmit">完成注册</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.form_url {
  color: #000000;
  font-size: 16px;
}

:deep(.init_form) {
  .el-input__wrapper {
    background: #f7f7f7;
    @apply rounded-xl;
    box-shadow: none !important;

    .el-input__inner {
      box-shadow: none !important;
      background-color: transparent;
      padding: 7px 11px;
      height: 44px;
    }

    svg {
      @apply text-black;
    }
  }
}
</style>
