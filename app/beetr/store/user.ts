import { defineStore } from 'pinia'
import { type IUserInfoRes, getUserInfoByToKen, getUserInfoByUrl } from '@/api/user/user'
import { STEP_PROCESS, BROWSER_ENV } from '@beetr/constant'
export const _userStore = defineStore('user', () => {
  /** 用户信息 */
  const userInfo = ref<IUserInfoRes | null>(null)
  /** 信息 */
  const urlInfo = ref<IUserInfoRes | null>(null)

  /** 时间戳-用户触发缓存更新 */
  const timestamp = ref(0)
  /**
   * true 已完成步骤设置， false-未完成
   * @onboarded — 1-已设置完成 0-未设置完成
   */
  const isOnboared = computed(() => userInfo.value?.onboarded === 1)

  /** true-可编辑状态（登录且url等于个人信息中url） */
  const isEdit = computed(() => {
    return Boolean(userInfo.value?.url && userInfo.value.url === urlInfo.value?.url)
  })
  // const isEdit = true

  /** 是否锁屏 **/
  const isScreenLock = computed(() => {
    if (userInfo.value) {
      return Boolean(userInfo.value?.url !== urlInfo.value?.url && urlInfo.value?.onlock === 1)
    }
    return Boolean(urlInfo.value?.url && urlInfo.value?.onlock === 1)
  })

  /** Grid编辑模式 **/
  const isGridEdit = ref(false)
  /**
   * 当前所对应显示在页面的表单
   * @onboarded — 1-已设置完成 0-未设置完成
   */

  const currentStep = ref<keyof typeof STEP_PROCESS>(STEP_PROCESS.userInfo)


  /** 查询用户信息 */
  const queryUserInfo = async () => {
    try {
      const result = await getUserInfoByToKen()
      userInfo.value = result
      currentStep.value = userInfo.value.onboarded === 0 ? STEP_PROCESS.accountLabel : STEP_PROCESS.userInfo
      return result
    } catch (error) {
      console.error(error);
      return Promise.reject(error)
    }
  }

  /** 查询url-用户信息 */
  const queryUserInfoByUrl = async (url: string) => {
    try {
      const result = await getUserInfoByUrl(url)
      urlInfo.value = result
      return result
    } catch (error) {
      return Promise.reject(error)
    }
  }
  const setInfo = ({ url, user }: {
    url: IUserInfoRes | null,
    user: IUserInfoRes | null
  }) => {
    userInfo.value = user
    urlInfo.value = url
  }

  return {
    userInfo,
    urlInfo,
    queryUserInfo,
    isOnboared,
    queryUserInfoByUrl,
    isEdit,
    isGridEdit,
    timestamp,
    currentStep,
    isScreenLock,
    setInfo
  }
}, {
  // persist: {
  //   storage: persistedState.localStorage,
  //   paths: ['browserEnv', 'deviceEnv']
  // },
})
export const isLoading = defineStore('loading', () => {
  const show = ref(false)
  const changeShow = (bol: boolean) => {
    show.value = bol
  }
  return {
    show,
    changeShow
  }
})
