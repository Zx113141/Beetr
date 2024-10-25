<script setup lang="ts">
import { storeToRefs } from 'pinia'
import ModuleLock from '~/components/module-lock.vue';
import {
    STEP_PROCESS,
    BROWSER_ENV,
    VISIT_CREDENTIALS,
    MESSAGE_EVENT_TYPE,
    type IUserAppItem
} from '@beetr/constant'
import { _widgetStore } from '~/store/widget';
import { _userStore } from '~/store/user';
import { _envStore } from '~/store/env';
import { SvgWeixin, MEDIA_TYPE, TOKEN_CREDENTIALS } from '@beetr/constant';
import moduleContainer from '~/components/module-container.vue';
import ModuleNavbar from '~/components/module-navbar.vue';
import { useMessage } from '@beetr/hooks'
import GridContainer from '~/components/module-container.vue';



// import { onSetDraw } from '~/store/isLoading'

const widgetStore = _widgetStore()
const userStore = _userStore()
const envStore = _envStore()
const route = useRoute()
const { postMessage } = useMessage()

// refs reactive here
const { userInfo, urlInfo, currentStep, isScreenLock, isEdit } = storeToRefs(userStore)
const { browserEnv, deviceEnv } = storeToRefs(envStore)
const { appConfigList } = storeToRefs(widgetStore)
const mextType = ref<number>(0)
const Loading = ref(false)
const skeltonLoading = ref(false)
const containerRef = ref<InstanceType<typeof GridContainer> | null>(null);

// const uploadRef = ref<any>(null)
// const triggerRef = ref<HTMLDivElement | null>(null)

const framePostMessagx = <T extends keyof typeof MESSAGE_EVENT_TYPE, K,>(e: T, params?: K) => {
    postMessage(window.parent.window, e, JSON.stringify(appConfigList.value))
}

// hooks
onMounted(async () => {
    skeltonLoading.value = true
    await widgetStore.getSocialPreConfig()
    await queryUserInfo()
    try {
        await userStore.queryUserInfo()
    } catch (error) { }
    window.addEventListener('message', handleMessage)

    framePostMessagx(MESSAGE_EVENT_TYPE.iframeLoaded,)
    framePostMessagx(MESSAGE_EVENT_TYPE.info, {
        urlInfo: JSON.stringify(urlInfo.value!),
        userInfo: JSON.stringify(userInfo.value!),
    })
    framePostMessagx(MESSAGE_EVENT_TYPE.appConfigList, JSON.stringify(appConfigList.value))
    skeltonLoading.value = false
})



// funcion
const onSetDraw = () => {

}

const aboutUs = () => {

}

const handleMessage = (event: MessageEvent) => {
    const { data } = event
    const { eventType, query } = data

    switch (eventType) {
        case MESSAGE_EVENT_TYPE.env:
            browserEnv.value = query.browserEnv
            deviceEnv.value = query.deviceEnv
            break;
        case MESSAGE_EVENT_TYPE.addWidget:
            handleWidgetAdd(query)
            break;
        case MESSAGE_EVENT_TYPE.logout:
            break;
    }
}

const queryUserInfo = async () => {
    // 刷新重置
    const sessionId = useCookie(VISIT_CREDENTIALS)
    sessionId.value = ''
    /** 如果存在url，则通过url查询用户信息 */
    route.query.path && await userStore.queryUserInfoByUrl(route.query.path as string)
    if (!isScreenLock.value && route.query.path) {
        await widgetStore.queryUserAppList(route.query.path as string)
    }
}

const handleWidgetAdd = (query: {
    name: string,
    data: Partial<IUserAppItem>
}) => {
    console.log(query);
    const { name, data } = query
    const config = JSON.parse(data as string)
    // TODO 可以处理query config

    containerRef.value!.onGrdiAddWidget(config)
}




provide('loading', Loading)

</script>
<template>
    <!-- 锁屏 -->
    <ModuleLock v-if="isScreenLock" />
    <div v-else
        :class="['relative flex min-h-screen w-full flex-1 flex-col items-center', `browser-${browserEnv || 'desktop'}`, `device-${deviceEnv || 'desktop'}`]">
        <div
            class="user-aside flex h-full w-full max-w-[428px] items-center justify-center p-6 pt-12 pb-0 xl:absolute xl:top-0 xl:max-w-[min(100vw,1728px)] xl:items-stretch xl:justify-start xl:p-16">
            <ModuleNavbar :skeltonLoading="skeltonLoading"></ModuleNavbar>
        </div>
        <!-- grid网格 - 手机端初始化的时候不显示，mextType > 0 的时候才 -->
        <div class="xl:flex h-full w-full max-w-[428px] flex-1 flex-col pt-0 xl:max-w-[1728px] xl:flex-row xl:p-16 xl:overflow-hidden"
            v-if="currentStep !== STEP_PROCESS.accountLabel"
            :class="[currentStep, (currentStep == STEP_PROCESS.socialMedia || currentStep == STEP_PROCESS.linkAnything) && mextType == 0 && deviceEnv == BROWSER_ENV.mobile ? 'hidden' : 'flex']">
            <div class="mb-10 flex flex-col px-4 xl:mb-0 xl:mr-20 xl:flex-1 xl:px-0"></div>

            <!-- 右边可拖动的网格布局 -->
            <moduleContainer :currentStep="currentStep" v-if="deviceEnv" :deviceEnv="deviceEnv" :editStatus="isEdit"
                :browserEnv="browserEnv!" ref="containerRef"
                @postMessage="(e: IUserAppItem, messageType) => framePostMessagx(messageType, e)">
                <!-- :isLoading="isLoading" ref="moduleGridRef" :current-step="currentStep"
                @changeShow="changeShow" @onGridEdit="onGridEdit" @gridTouched="gridTouched" -->
            </moduleContainer>
            <!-- skelton? -->

            <div class="browser-mobile-action w-full p-[20px_25px] h-[130px]"
                v-if="currentStep == STEP_PROCESS.userInfo && userStore.isEdit && browserEnv == BROWSER_ENV.mobile">
                <div class="flex items-center justify-start">
                    <el-button @click="onSetDraw" class="!p-2 !shadow-none relative !text-block !bg-[transparent]">
                        <SvgControl class="ctrl-icon" />
                    </el-button>
                    <el-button class="ml-5 !p-2 !shadow-none relative !text-block !bg-[transparent]" @click="aboutUs">
                        <SvgWeixin class="wx-icon" />
                    </el-button>
                    <div class="ml-5 px-2 styles_foot-traffic-divider__EKk6W">
                        <div class="h-[14px] w-[2px] rounded-[2px] bg-[#EBEBEB]"></div>
                    </div>
                    <div class="w-[150px] ml-5">
                        <span class="text-[12px]">今日访问量：{{ userInfo?.visitCount || urlInfo?.visitCount || 0 }}</span>
                    </div>
                </div>
            </div>
            <!-- 非登录状态下的操作栏，登录、创建个人链接 -->
            <ModuleLeftActionOffline from="main" v-if="!userStore.isEdit" :path="userInfo?.url">
            </ModuleLeftActionOffline>
        </div>




    </div>
</template>



<style lang="scss" scoped>
.browser-mobile-action {
    width: 100%;
    //   @include font_color('mobileActionBarColor');
    //   @include background_color('mobileActionBarBgColor');

    //   .ctrl-icon {
    //     @include font_color('mobileActionBarCTRLColor');
    //   }

    //   .wx-icon {
    //     @include font_color('mobileActionBarWXColor');
    //   }
}

.device-mobile,
.browser-mobile {

    // 显示到user-aside
    .user-aside {
        position: relative;
        box-sizing: border-box;

    }
}
</style>