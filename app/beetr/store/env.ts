import { defineStore } from 'pinia';
import { BROWSER_ENV } from '@beetr/constant';

export const _envStore = defineStore('env', () => {
  /** 网站位于电脑端还是移动端 设备mobile desktop **/
  const browserEnv = ref<keyof typeof BROWSER_ENV>('desktop')
  /** 当前设备端 根据分辨率判断的端 浏览器中的mobile 或者 deskoop **/
  const deviceEnv = ref<keyof typeof BROWSER_ENV>('desktop')
  return {
    browserEnv,
    deviceEnv
  }
})
