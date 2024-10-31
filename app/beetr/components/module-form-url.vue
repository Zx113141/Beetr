<script setup lang="ts">
import { type FormInstance, type FormRules } from 'element-plus'
import { Close, Loading } from '@element-plus/icons-vue'
import { debounce } from '@beetr/hooks'
import { LOAD_STATUS, SvgSuccess } from '@beetr/constant'
import { exitUrlFlag } from '@/api/user/user'

/** 接口加载状态 */
const loadStatus = ref<keyof typeof LOAD_STATUS>(LOAD_STATUS.none)

/** form实例 */
const formRef = ref<FormInstance>()

/** 表单校验规则 */
const rules = reactive<FormRules>({
  base_uri: {
    message: '请输入云服务连接地址',
    required: true,
  },
  entity_id: {
    message: '请输入设备归属ID',
    required: true,
  },
})
/** 表单-对象 */
const form = reactive({
  /** 主链接 */
  baseUrl: '',
})

/**
 * 主链接校验状态
 * true-已被占用
 * false-可以使用
 * null-未进行校验
 */
const isRepeat = ref<null | Boolean>(null)

/** 检验唯一性 */
const checkAvailability = debounce(async function () {
  if (!form.baseUrl) {
    return
  }
  try {
    await exitUrlFlag(form.baseUrl)
    isRepeat.value = false
    loadStatus.value = LOAD_STATUS.none
  } catch (error: any) {
    loadStatus.value = LOAD_STATUS.error
  }
}, 500)

const onKeyDown = () => {
  // 只允许输入 数字 字母 中华线
  if (!form.baseUrl) {
    loadStatus.value = LOAD_STATUS.none
  } else {
    loadStatus.value = LOAD_STATUS.loading
    checkAvailability()
  }
}

/** 切换表单时，初始表单值 */
const init = (baseurl: string) => {
  form.baseUrl = baseurl
}

const onClear = () => {
  isRepeat.value = null
  form.baseUrl = ''
}

const emit = defineEmits<{
  (event: 'toggleModule', baseUrl: string): void
}>()

defineExpose({
  init,
})
</script>

<template>
  <div class="absolute inset-0 flex flex-col items-center justify-center styles_bold-step__0h8ZD">
    <div class="flex w-full flex-col">
      <h1 class="text-title-1">首先, 注册账号信息</h1>
      <p class="typography-paragraph mt-4">抓住我的链接！</p>
      <el-form ref="formRef" :model="form" :label-width="0" class="mt-20" :rules="rules">
        <el-form-item style="margin-bottom: 0">
          <el-input v-model="form.baseUrl" autofocus class="init_input" placeholder="your-name" @keyup="onKeyDown"
            @input="(val) => {
              form.baseUrl = val.replace(/[^a-zA-Z0-9-]/g, '')
            }
              ">
            <template #prepend>beetr.cc/</template>
            <template #suffix>
              <svg-success v-if="form.baseUrl && loadStatus === LOAD_STATUS.none"
                style="color: rgb(78 221 118)"></svg-success>
              <el-icon v-if="form.baseUrl && loadStatus === LOAD_STATUS.loading" class="is-loading" color="#000000">
                <Loading />
              </el-icon>
              <el-icon v-if="form.baseUrl && loadStatus === LOAD_STATUS.error" class="cursor-pointer" @click="onClear">
                <Close color="#000000" />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-form>

      <div class="mt-4 h-[58px] sm:h-[48px]">
        <el-button v-show="form.baseUrl || loadStatus === LOAD_STATUS.loading"
          :loading="loadStatus === LOAD_STATUS.loading" type="primary" class="mt-4 !h-[58px] sm:!h-[48px] w-full"
          @click="form.baseUrl && emit('toggleModule', form.baseUrl)">创建账号</el-button>

        <p v-show="form.baseUrl && loadStatus === LOAD_STATUS.error" class="text-red-500 text-xs mt-2">
          *该用户名已被占用，请尝试其他名称
        </p>
      </div>
      <a class="text-xs mt-12 self-start" href="/login">或登录？</a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.text-title-1 {
  font-size: 32px;
  line-height: 40px;
}

.typography-description,
.typography-paragraph {
  font-family: var(--inter-font), sans-serif;
  font-weight: 400;
}

.typography-paragraph {
  font-size: 20px;
  line-height: 36px;
}

.init_input {
  :deep(.el-input__wrapper) {
    box-shadow: none;
    background-color: transparent;
    padding: 7px 11px 7px 3px;
  }
}

.text-xs {
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
}
</style>
