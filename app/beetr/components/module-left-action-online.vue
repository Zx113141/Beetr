<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { type FormInstance } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import {
    SvgChecked, SvgSetting,
    SvgExplore, SvgCommunity,
    TOKEN_CREDENTIALS,
    VISIT_CREDENTIALS,
    SvgWeixin, LOAD_STATUS, BROWSER_ENV, VIEW_PWD_TYPE_LIST
} from '@beetr/constant'
import { debounce } from '@beetr/hooks'
// import ModulePopWrap from './module-pop-wrap.vue'
import { _userStore } from '~/store/user'
import { _envStore } from '~/store/env'
import { exitUrlFlag, updateUserInfo, resetPasswordByLogin, getVisitSet, SaveVisitorSet } from '~~/api/user/user'
import { setDrawData } from '~~/store/isLoading'
// import ModuleNumberScroll from './module-number-scroll.vue'
const userStore = _userStore()
const envStore = _envStore()
const { browserEnv } = storeToRefs(envStore)
const { userInfo, urlInfo } = storeToRefs(userStore)

const Router = useRouter()
const emit = defineEmits(['logout'])
const popover = ref<any>(null)


defineProps<{
    isEditorRef: boolean
}>()

/**
 * 修改url表单
 * 主链接校验状态
 * true-已被占用
 * false-可以使用
 * null-未进行校验
 */
const urlForm = reactive<{
    visible: boolean
    url: string
    isRepeat: null | Boolean
    loadStatus: keyof typeof LOAD_STATUS
}>({
    visible: false,
    url: '',
    isRepeat: null,
    loadStatus: LOAD_STATUS.none,
})

/** 检验唯一性 */
const checkAvailability = debounce(async function () {
    try {
        await exitUrlFlag(urlForm.url)
        urlForm.isRepeat = false
        urlForm.loadStatus = LOAD_STATUS.none
    } catch (error: any) {
        if (error.code === 402) {
            urlForm.isRepeat = true
            urlForm.loadStatus = LOAD_STATUS.none
        } else {
            urlForm.loadStatus = LOAD_STATUS.error
        }
    }
}, 500)
/** 展开url表单 */
const showUrlForm = () => {
    passwordForm.visible = false
    viewPasswordForm.visible = false
    urlForm.visible = !urlForm.visible
    urlForm.url = userInfo.value!.url
}
const onKeyDown = () => {
    // 只允许输入 数字 字母 中华线
    if (!urlForm.url) {
        urlForm.loadStatus = LOAD_STATUS.none
    } else {
        urlForm.loadStatus = LOAD_STATUS.loading
        checkAvailability()
    }
}
const onUrlClear = () => {
    urlForm.isRepeat = null
    urlForm.url = ''
}
/** 更新账号的url */
const updateUrl = async () => {
    const params = { ...userInfo.value!, url: urlForm.url }
    await updateUserInfo(params)
    userInfo.value!.url = urlForm.url
    urlForm.visible = false
    Router.push(`/${urlForm.url}`)
}

/**
 * 修改密码表单
 */
const passwordForm = reactive<{
    visible: boolean
    password: string
    loadStatus: keyof typeof LOAD_STATUS
}>({
    visible: false,
    password: '',
    loadStatus: LOAD_STATUS.none,
})

/** 展开密码表单 */
const showPasswordForm = () => {
    urlForm.visible = false
    viewPasswordForm.visible = false
    passwordForm.loadStatus = LOAD_STATUS.none
    passwordForm.visible = !passwordForm.visible
    passwordForm.password = ''
}

/** form实例 */
const passwordFormRef = ref<FormInstance>()

/** 更新密码 */
const updatePassword = async () => {
    try {
        passwordForm.loadStatus = LOAD_STATUS.loading
        await passwordFormRef.value!.validate()
        const params = {
            password: passwordForm.password,
            phone: userInfo.value!.phone,
        }
        await resetPasswordByLogin(params)
        passwordForm.loadStatus = LOAD_STATUS.success
    } catch (error) {
        passwordForm.loadStatus = LOAD_STATUS.error
    }
}


/** form实例 */
const viewPasswordFormRef = ref<FormInstance>()

const viewPasswordForm = reactive<{
    visible: boolean
    type: number
    password: string
    loadStatus: keyof typeof LOAD_STATUS
}>({
    visible: false,
    type: 0,
    password: '',
    loadStatus: LOAD_STATUS.none,
})

/** 更新密码 */
const updateViewPassword = async () => {
    try {
        viewPasswordForm.loadStatus = LOAD_STATUS.loading
        if (viewPasswordForm.type === 1) {
            await viewPasswordFormRef.value!.validate()
        }
        const params = {
            visitorType: viewPasswordForm.type,
            pwd: viewPasswordForm.password,
        }
        await SaveVisitorSet(params)
        userInfo.value!.visitorType = viewPasswordForm.type
        urlInfo.value!.visitorType = viewPasswordForm.type
        viewPasswordForm.loadStatus = LOAD_STATUS.success
    } catch (error) {
        viewPasswordForm.loadStatus = LOAD_STATUS.error
    }
}

/** 展开密码表单 */
const showViewPasswordForm = async () => {
    urlForm.visible = false
    passwordForm.visible = false
    viewPasswordForm.loadStatus = LOAD_STATUS.none
    viewPasswordForm.visible = !viewPasswordForm.visible
    const result = await getVisitSet()
    viewPasswordForm.type = result.visitorType || 0
    viewPasswordForm.password = ''
}
const changeViewPasswordType = (type: number) => {
    viewPasswordForm.type = type
    viewPasswordForm.password = ''
}

onMounted(() => {
    window.addEventListener('click', handleClose)
})

onUnmounted(() => {
    window.removeEventListener('click', () => { })
})
/** 弹窗全部关闭 */
const onPopoverHide = () => {
    urlForm.visible = false
    passwordForm.visible = false
}

/** 退出登录 */
const onLogout = () => {
    const cookieToken = useCookie(TOKEN_CREDENTIALS)
    cookieToken.value = ''
    userInfo.value = null
    const sessionId = useCookie(VISIT_CREDENTIALS)
    sessionId.value = ''
    emit('logout')
}
const handleClose = (e: any) => {
    if (e.target.closest('svg')) return;
    const { srcElement } = e
    if (popover.value && !popover.value.contains(srcElement) && isShowPopover.value) {
        console.log(srcElement, popover.value);
        viewPasswordForm.visible = false
        passwordForm.visible = false
        urlForm.visible = false
        urlForm.url = userInfo.value!.url
        isShowPopover.value = false
    }
}

const aboutUs = () => {
    window.location.href = '/about'
}

const count = computed(() => {
    return userInfo.value?.visitCount || urlInfo.value?.visitCount || 0
})
/** true 正在显示设置弹窗 false 关闭状态 */
const isShowPopover = ref(false)
</script>

<template>
    <div class="fixed_mask" v-if="isShowPopover"></div>
    <div id="online" v-if="browserEnv == BROWSER_ENV.desktop"
        class="left-action-online fixed left-16 bottom-[52px] -m-1 hidden items-center space-x-1 rounded-[12px] p-1 transition-colors xl:flex sm:flex 2xl:space-x-2 duration-400 delay-500"
        :class="[isEditorRef ? 'editor' : '']" style="opacity: 1" ref="popover">
        <el-popover v-model:visible="isShowPopover" :width="210" trigger="click" placement="top-start"
            :teleported="false" @hide="onPopoverHide">
            <div>
                <!-- 修改url表单 -->
                <div class="relative">
                    <el-button link text class="w-full !justify-start " @click="showUrlForm">
                        <div class="flex flex-col font-normal text-left">
                            <div class="text-sm xl:text-xs popover-btn">修改用户名</div>
                            <div class="text-sm text-neutral-400 xl:text-xs">/{{ userInfo?.url }}</div>
                        </div>
                    </el-button>
                    <ModulePopWrap v-if="urlForm.visible">
                        <div class="flex flex-col gap-3 w-full">
                            <div class="mb-[2px]">
                                <h3 class="text-2xl font-semibold xl:text-sm">修改用户名</h3>
                                <p class="text-xs text-neutral-grey30">修改一个独一无二的名称</p>
                            </div>

                            <el-input v-model="urlForm.url" class="init_input w-full" @keyup="onKeyDown" @input="(val: string) => {
                                urlForm.url = val.replace(/[^a-zA-Z0-9-]/g, '')
                            }
                                ">
                                <template #prepend>beetr.cc/</template>
                                <template #suffix>
                                    <svg-success v-if="urlForm.url &&
                                        urlForm.loadStatus === LOAD_STATUS.none &&
                                        urlForm.isRepeat === false
                                    " style="color: rgb(78 221 118)"></svg-success>
                                    <el-icon v-if="urlForm.url && urlForm.loadStatus === LOAD_STATUS.loading"
                                        class="is-loading" color="#000000">
                                        <Loading />
                                    </el-icon>
                                    <el-icon v-if="urlForm.url &&
                                        urlForm.loadStatus === LOAD_STATUS.none &&
                                        urlForm.isRepeat === true
                                    " class="cursor-pointer" @click="onUrlClear">
                                        <Close color="#000000" />
                                    </el-icon>
                                </template>
                            </el-input>

                            <p v-show="urlForm.url &&
                                urlForm.isRepeat === true &&
                                urlForm.loadStatus === LOAD_STATUS.none
                                " class="text-red-500 text-xs">
                                *这个用户名已被注册，请更多其他更好的！
                            </p>

                            <el-button :loading="urlForm.loadStatus === LOAD_STATUS.loading" :disabled="!urlForm.url ||
                                urlForm.isRepeat !== false ||
                                urlForm.loadStatus === LOAD_STATUS.loading
                                " type="info" class="w-full" size="large" @click="updateUrl">更新</el-button>
                        </div>
                    </ModulePopWrap>
                </div>
                <!-- 修改密码表单 -->
                <div class="relative">
                    <el-button link text class="w-full !justify-start" @click="showPasswordForm">
                        <div class="flex flex-col font-normal text-left">
                            <div class="text-sm xl:text-xs popover-btn">修改密码</div>
                            <div class="text-sm text-neutral-400 xl:text-xs tracking-widest">· · · · · · ·</div>
                        </div>
                    </el-button>
                    <ModulePopWrap v-if="passwordForm.visible">
                        <div v-if="passwordForm.loadStatus !== LOAD_STATUS.success" class="flex flex-col gap-3 w-full">
                            <div class="mb-[2px]">
                                <h3 class="text-2xl font-semibold xl:text-sm ">修改密码</h3>
                                <p class="text-xs text-neutral-grey30">更改登录beetr上的密码</p>
                            </div>

                            <el-form ref="passwordFormRef" class="mb-4" :model="passwordForm" :label-width="0">
                                <el-form-item style="margin-bottom: 0" prop="password" :rules="[
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
                                ]">
                                    <el-input v-model="passwordForm.password" placeholder="新密码" class="init_input"
                                        type="password" show-password>
                                    </el-input>
                                </el-form-item>
                            </el-form>

                            <el-button :loading="passwordForm.loadStatus === LOAD_STATUS.loading" :disabled="!passwordForm.password || passwordForm.loadStatus === LOAD_STATUS.loading
                                " type="info" class="w-full !h-11" size="large" @click="updatePassword">保存</el-button>
                        </div>

                        <div v-else class="flex flex-col gap-3 w-full items-center py-4">
                            <div class="rounded-full shadow-[0px_1px_2px_rgba(0,0,0,0.12)]">
                                <svg-success style="color: rgb(78 221 118)" class="w-[48px] h-[48px]"></svg-success>
                            </div>
                            <p class="text-sm font-semibold">密码修改成功</p>
                        </div>
                    </ModulePopWrap>
                </div>
                <!-- 访问密码表单 -->
                <div class="relative">
                    <el-button link text class="w-full !justify-start" @click="showViewPasswordForm">
                        <div class="flex flex-col font-normal text-left">
                            <div class="text-sm xl:text-xs popover-btn">设置访问密码</div>
                            <div class="text-sm text-neutral-400 xl:text-xs tracking-widest"
                                v-if="urlInfo?.visitorType === 1">· · · ·
                                · · ·
                            </div>
                        </div>
                    </el-button>
                    <ModulePopWrap :popStyles="{ top: '-150px' }" v-if="viewPasswordForm.visible">
                        <div v-if="viewPasswordForm.loadStatus !== LOAD_STATUS.success"
                            class="flex flex-col gap-3 w-full">
                            <div class="flex flex-col w-full">
                                <div v-for="item in VIEW_PWD_TYPE_LIST" :key="item.type"
                                    class="cursor-pointer w-full flex items-center justify-between text-left p-[12px]"
                                    @click="changeViewPasswordType(item.type)">
                                    <div class="flex-1">
                                        <div class="text-[14px]">{{ item.name }}</div>
                                        <div class="text-[12px] text-[#6C6C6C]">{{ item.tips }}</div>
                                    </div>
                                    <div v-if="viewPasswordForm.type === item.type"
                                        class="check-icon rounded-full shadow-[0px_1px_2px_rgba(0,0,0,0.12)]">
                                        <svg-checked style="color: rgb(78 221 118)" class="w-[14px] h-[14px]" />
                                    </div>
                                </div>
                            </div>

                            <el-form v-if="viewPasswordForm.type === 1" ref="viewPasswordFormRef" class="mb-4"
                                :model="viewPasswordForm" :label-width="0">
                                <el-form-item style="margin-bottom: 0" prop="password" :rules="[
                                    {
                                        message: '请输入访问密码',
                                        required: true,
                                        trigger: 'blur',
                                    },
                                    {
                                        message: '*密码长度至少为3个字符，不超过16个',
                                        min: 3,
                                        max: 16,
                                        trigger: 'blur',
                                    },
                                ]">
                                    <el-input v-model="viewPasswordForm.password" placeholder="请输入访问密码"
                                        class="init_input" type="password" show-password>
                                    </el-input>
                                </el-form-item>
                            </el-form>

                            <el-button :loading="viewPasswordForm.loadStatus === LOAD_STATUS.loading"
                                :disabled="(!viewPasswordForm.password && viewPasswordForm.type == 1) || passwordForm.loadStatus === LOAD_STATUS.loading"
                                type="info" class="w-full !h-11" size="large" @click="updateViewPassword">
                                保存
                            </el-button>
                        </div>

                        <div v-else class="flex flex-col gap-3 w-full items-center py-4">
                            <div class="rounded-full shadow-[0px_1px_2px_rgba(0,0,0,0.12)]">
                                <svg-success style="color: rgb(78 221 118)" class="w-[48px] h-[48px]"></svg-success>
                            </div>
                            <p class="text-sm font-semibold">设置成功</p>
                        </div>
                    </ModulePopWrap>
                </div>

                <el-divider style="margin: 0.5rem 0" />

                <!-- 登出 -->
                <div class="relative">
                    <el-button link text class="w-full !justify-start" @click="onLogout">
                        <div class="flex flex-col font-normal text-left">
                            <div class="text-sm xl:text-xs popover-btn">退出登录</div>
                        </div>
                    </el-button>
                </div>
            </div>

            <template #reference>
                <div>
                    <el-tooltip content="设置" effect="light" placement="top" :show-after="300" :offset="7"
                        popper-class="custom-tooltip-animation">
                        <el-button class="!rounded-full !p-2 !shadow-none relative settingBtn"
                            :class="isShowPopover ? '!text-block' : '!text-[#8E8E8E]'">
                            <SvgSetting />
                        </el-button>
                    </el-tooltip>
                </div>
            </template>
        </el-popover>
        <!-- <el-tooltip
      content="探索"
      effect="light"
      placement="top"
      :show-after="300"
      :offset="7"
      popper-class="custom-tooltip-animation"
    >
      <el-button class="!rounded-full !text-[#8E8E8E] !p-2 !shadow-none">
        <SvgExplore />
      </el-button>
    </el-tooltip>
    <el-tooltip content="关于我们" effect="light" placement="top" :show-after="300" :offset="7"
      popper-class="custom-tooltip-animation">
      <el-button class="!rounded-full !text-[#8E8E8E] !p-2 !shadow-none settingBtn" @click="aboutUs">
        <SvgCommunity />
      </el-button>
    </el-tooltip>  -->
        <el-tooltip content="关注我们" effect="light" placement="top" :show-after="300" :offset="7"
            popper-class="custom-tooltip-animation">
            <el-button class="!rounded-full !p-2 !shadow-none settingBtn" @click="aboutUs">
                <SvgWeixin class="wx-icon" />
            </el-button>
        </el-tooltip>
        <div class="px-2 styles_foot-traffic-divider__EKk6W">
            <div class="h-[14px] w-[2px] rounded-[2px] bg-[#EBEBEB]"></div>
        </div>
        <div class="w-[150px]">
            <div class="text-[#6C6C6C] text-[12px] flex">
                今日访问量：

                <ModuleNumberScroll v-if="count > 0" :numm="count" :numLen="String(count).length" :noneDivide="true" />
                <span v-else>{{ count }}</span>
            </div>

        </div>
    </div>
</template>


<style lang="scss" scope>
.popover-btn {
    @include font_color('popoverColor');
}

.fixed_mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, .1);
    z-index: inherit;
}

.settingBtn {
    @include background_color('actionBarBorderColor')
}

.settingBtn:hover {

    @include background_color('hoverBackgroundColor')
}

.settingBtn:focus {
    @include font_color('drawerBodyColor');
    @include background_color('hoverBackgroundColor')
}

.wx-icon {
    @include font_color('mobileActionBarWXColor')
}
</style>
