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
import { SvgWeixin, SvgControl, WIDGET_TYPE, type Style, randomList, TOKEN_CREDENTIALS } from '@beetr/constant';
import ModuleContainer from '~/components/module-container.vue';
import ModuleNavbar from '~/components/module-navbar.vue';
import { BeetrModules, type IModule } from '@beetr/materials';
import { useMessage } from '@beetr/hooks'
import GridContainer from '~/components/module-container.vue';

interface WidgetRandomAdd {
    name: WIDGET_TYPE,
    randomAdd: boolean
}

// import { onSetDraw } from '~/store/isLoading'

const widgetStore = _widgetStore()
const userStore = _userStore()
const envStore = _envStore()
const route = useRoute()
const { postMessage } = useMessage()

// refs reactive here
const { userInfo, urlInfo, currentStep, isScreenLock, isEdit } = storeToRefs(userStore)
const { browserEnv, deviceEnv } = storeToRefs(envStore)
const { appConfigList, userAppList } = storeToRefs(widgetStore)
const mextType = ref<number>(0)
const Loading = ref(false)
// const skeltonLoading = ref(false)
const containerRef = ref<InstanceType<typeof GridContainer> | null>(null);

// const uploadRef = ref<any>(null)
// const triggerRef = ref<HTMLDivElement | null>(null)

const framePostMessagx = <T extends keyof typeof MESSAGE_EVENT_TYPE, K,>(e: T, params?: K) => {
    postMessage(window.parent.window, e, JSON.stringify(params))
}

// hooks
onMounted(async () => {
    // skeltonLoading.value = true
    await widgetStore.getSocialPreConfig()
    await queryUserInfo()
    try {
        await userStore.queryUserInfo()
    } catch (error) { }
    window.addEventListener('message', handleMessage)

    framePostMessagx(MESSAGE_EVENT_TYPE.iframeLoaded,)

    framePostMessagx(MESSAGE_EVENT_TYPE.info, {
        urlInfo: urlInfo.value!,
        userInfo: userInfo.value!,
    })
    framePostMessagx(MESSAGE_EVENT_TYPE.appConfigList, appConfigList.value)
    // skeltonLoading.value = false
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
        case MESSAGE_EVENT_TYPE.edit:
            handleWidgetEdit(query)
            break;
        case MESSAGE_EVENT_TYPE.logout:
            hanldeLogout()
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
    data: string
}) => {

    const { name, data } = query
    const config = JSON.parse(data as string)
    // TODO 可以处理query config

    containerRef.value!.onGrdiAddWidget(config)
}

const handleWidgetEdit = (query: {
    name: string,
    data: string
}) => {
    const { name, data } = query
    const config = JSON.parse(data as string) as IUserAppItem
    containerRef.value!.onModuleEdit(config)
}

// 获取随机形状
const randomRect = (): Style => {
    let resultSeed = 0
    const random = Math.ceil(Math.random() * 100)
    randomList.forEach((item, index) => {
        if (index * 25 <= random && (index + 1) * 25 > random) {
            resultSeed = index
        }
    })
    const randomSize = randomList[resultSeed]

    const obj: Style = {
        mobile: { w: randomSize.width, h: randomSize.height },
        desktop: { w: randomSize.width, h: randomSize.height },
    }
    return obj
}
const addTempares = (nameList: WidgetRandomAdd[], interval: number = 500) => {
    const items = userAppList.value.filter((app) => app.temType).map((item) => item.temType)

    nameList.forEach((item: WidgetRandomAdd, index: number) => {
        if (!items.includes(item.name)) {
            setTimeout(() => {
                const widgetModule = BeetrModules.find((i) => item.name == i.name) as IModule
                const config = item.randomAdd ? widgetModule?.defaultEditorConfigs({
                    cusStyle: randomRect(),
                    temType: item.name,
                }) : widgetModule?.defaultEditorConfigs({
                    temType: item.name,
                })
                containerRef.value!.onGrdiAddWidget(config)
            }, index * interval)
        }
    })
}

const hanldeLogout = () => {
    const cookieToken = useCookie(TOKEN_CREDENTIALS)
    cookieToken.value = ''
    userInfo.value = null
    const sessionId = useCookie(VISIT_CREDENTIALS)
    sessionId.value = ''
}

watch(() => mextType.value, (newType) => {
    if (currentStep.value == STEP_PROCESS.socialMedia) {
        if (newType == 1) {
            addTempares([
                { name: WIDGET_TYPE.media, randomAdd: true },
                { name: WIDGET_TYPE.sectionHeader, randomAdd: false },
                { name: WIDGET_TYPE.richText, randomAdd: true },
            ])
        } else {
            containerRef.value!.removeWidgetList(userAppList.value.filter((app) => app.temType))
        }
    }

}, {
    immediate: true
})


provide('loading', Loading)

</script>
<template>
    <!-- 锁屏 -->
    <ModuleLock v-if="isScreenLock" />
    <div v-else
        :class="['relative flex min-h-screen w-full flex-1 flex-col items-center', `browser-${browserEnv || 'desktop'}`, `device-${deviceEnv || 'desktop'}`]">
        <div
            class="user-aside flex h-full w-full max-w-[428px] items-center justify-center p-6 pt-12 pb-0 xl:absolute xl:top-0 xl:max-w-[min(100vw,1728px)] xl:items-stretch xl:justify-start xl:p-16">
            <ModuleNavbar v-model:mextType="mextType" :handleAdd="handleWidgetAdd"
                :remove="containerRef?.removeWidgetList"></ModuleNavbar>
        </div>
        <!-- grid网格 - 手机端初始化的时候不显示，mextType > 0 的时候才 -->
        <div class="xl:flex h-full w-full max-w-[428px] flex-1 flex-col pt-0 xl:max-w-[1728px] xl:flex-row xl:p-16 xl:overflow-hidden"
            v-if="currentStep !== STEP_PROCESS.accountLabel"
            :class="[currentStep, (currentStep == STEP_PROCESS.socialMedia || currentStep == STEP_PROCESS.linkAnything) && mextType == 0 && deviceEnv == BROWSER_ENV.mobile ? 'hidden' : 'flex']">
            <div class="mb-10 flex flex-col px-4 xl:mb-0 xl:mr-20 xl:flex-1 xl:px-0"></div>

            <!-- 右边可拖动的网格布局 -->
            <ModuleContainer :currentStep="currentStep" v-if="deviceEnv" :deviceEnv="deviceEnv" :editStatus="isEdit"
                :browserEnv="browserEnv!" ref="containerRef"
                @postMessage="(e: IUserAppItem, messageType) => framePostMessagx(messageType, e)">
                <!-- :isLoading="isLoading" ref="moduleGridRef" :current-step="currentStep"
                @changeShow="changeShow" @onGridEdit="onGridEdit" @gridTouched="gridTouched" -->
            </ModuleContainer>
            <!-- skelton? -->

            <div class="browser-mobile-action w-full p-[20px_25px] h-[130px]"
                v-if="currentStep == STEP_PROCESS.userInfo && isEdit && browserEnv == BROWSER_ENV.mobile">
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
            <ModuleLeftActionOffline from="main" v-if="!isEdit" :path="userInfo?.url">
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