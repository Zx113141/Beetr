<script setup lang="ts">
import ModuleFormUrl from './module-form-url.vue'
import ModuleFromAccount from './module-form-account.vue'
/**
 * 枚举-表单状态
 * url-校验表单
 * account-新增账号
 */
enum ENUM_MODE {
  url = 'url',
  account = 'account',
}

const baseUrl = ref('')

// 输入url校验表单
const FormUrlRef = ref<InstanceType<typeof ModuleFormUrl> | null>(null)

// 输入账号密码校验表单
const FormAccountRef = ref<InstanceType<typeof ModuleFromAccount> | null>(null)

/** 当前表单状态 url校验表单或新增账号表单 */
const currentMode = ref<keyof typeof ENUM_MODE>(ENUM_MODE.url)

/** 点击创建账号 */
const toggleModule = (key: keyof typeof ENUM_MODE, _baseUrl: string) => {
  currentMode.value = ENUM_MODE[key]
  baseUrl.value = _baseUrl
}
const onEnter = () => {
  // await nextTick()
  currentMode.value === ENUM_MODE.account
    ? FormAccountRef.value!.init(baseUrl.value)
    : FormUrlRef.value!.init(baseUrl.value)
}
</script>

<template>
  <div class="relative flex max-w-[675px] flex-1 flex-col items-center">
    <div class="absolute top-0 flex h-full w-full max-w-[448px] flex-col">
      <transition :name="currentMode === ENUM_MODE.url ? 'slide-left' : 'slide-right'" mode="out-in" appear
        @enter="onEnter">
        <ModuleFormUrl v-if="currentMode === ENUM_MODE.url" ref="FormUrlRef"
          @toggle-module="(baseUrl) => toggleModule(ENUM_MODE.account, baseUrl)"></ModuleFormUrl>
        <ModuleFromAccount v-else ref="FormAccountRef"
          @toggle-module="(baseUrl) => toggleModule(ENUM_MODE.url, baseUrl)"></ModuleFromAccount>
      </transition>
    </div>
  </div>
</template>
