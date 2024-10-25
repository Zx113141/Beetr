<script setup lang="ts">
import { BROWSER_ENV, STEP_PROCESS, MESSAGE_EVENT_TYPE, type IUserAppItem } from "@beetr/constant";
import { debounce } from "@beetr/hooks";
import ModuleActionBar from '~/components/module-action-bar.vue'
import { _userStore } from "~/store/user";
import { storeToRefs } from 'pinia'
import { useMessage } from "@beetr/hooks";
import { _envStore } from '~/store/env'
import { widgetDrawerData } from '~~/store/isLoading'
import { type IModule, BeetrModules } from "@beetr/materials";
const route = useRoute();

const iframeRef = ref<HTMLIFrameElement | null>(null);
const actionRef = ref<InstanceType<typeof ModuleActionBar> | null>(null)
const userStore = _userStore()
const env = _envStore()
const { browserEnv, deviceEnv } = storeToRefs(env)
const { postMessage } = useMessage()
// hooks
onMounted(() => {
    window.addEventListener("message", handleFrameMessage);
    if (!checkBrowserEnv()) {
        window.addEventListener("resize", debounce(handleWindowResize, 300));
    }
    // 主动触发一次
    handleWindowResize(null);
});

// function

// 环境处理
const handleFrameMessage = (e: MessageEvent) => {
    const { query, eventType } = e.data;
    switch (eventType) {
        case MESSAGE_EVENT_TYPE.iframeLoaded:
            postEnv();
            break;
        case MESSAGE_EVENT_TYPE.info:
            const user = JSON.parse(query.userInfo)
            const url = JSON.parse(query.urlInfo)
            userStore.setInfo({
                url,
                user
            })
            break;
        case MESSAGE_EVENT_TYPE.addWidget:
            break;
        case MESSAGE_EVENT_TYPE.appConfigList:
            widgetDrawerData.prop.appConfigList = JSON.parse(query)
            break;
        case MESSAGE_EVENT_TYPE.edit:
            const data = JSON.parse(query)
            const drawer = BeetrModules.find(i => i.type == data.type)
            const m = {
                drawer,
            }
            actionRef.value!.onAddGrid(JSON.parse(query))
        // case MESSAGE_EVENT_TYPE.widgetStatus:
        //     console.log(query);
        //     break
    }
};

const checkBrowserEnv = () => {
    return /iPhone|Android/.test(window.navigator.userAgent);
};

const handleWindowResize = (e: UIEvent | null) => {
    if (!e) {
        browserEnv.value = checkBrowserEnv()
            ? BROWSER_ENV.mobile
            : BROWSER_ENV.desktop;
        deviceEnv.value =
            window.innerWidth > 1280 ? BROWSER_ENV.desktop : BROWSER_ENV.mobile;
        postEnv();
        return;
    }
    if ((e.target as Window).innerWidth > 1280) {
        browserEnv.value = BROWSER_ENV.desktop;
        deviceEnv.value = BROWSER_ENV.desktop;
    } else {
        browserEnv.value = BROWSER_ENV.desktop;
        deviceEnv.value = BROWSER_ENV.mobile;
    }
    postEnv();
};
const postEnv = () => {
    postMessage(iframeRef.value!.contentWindow!, MESSAGE_EVENT_TYPE.env, {
        browserEnv: browserEnv.value,
        deviceEnv: deviceEnv.value,
    })
};

// 物料处理

const addItem = (param: any, lastParams?: Partial<IUserAppItem>) => {
    const { name } = param
    postMessage(iframeRef.value!.contentWindow!, MESSAGE_EVENT_TYPE.addWidget, {
        name,
        data: JSON.stringify(param.defaultEditorConfigs(lastParams)),
    })
}

const prepareDrawData = (widget: IModule) => {
    // widgetDrawerData.prop.widget = widget
    // widgetDrawerData.show = true
}

const logout = () => {
    // userStore.logout()
}
</script>

<template>
    <div :class="[
        'min-h-screen flex flex-col items-center bg-[#F8F8F8]',
        $device.isMobile
            ? 'browser-mobile justify-between'
            : 'browser-desktop justify-center',
    ]">
        <div class="frame_container flex" :class="[
            $device.isMobile ? 'realmobile' : '',
            deviceEnv == BROWSER_ENV.mobile ? 'frame_container-mobile' : '',
        ]">
            <iframe ref="iframeRef" :data-editor-iframe="true" class="frame_container-iframe backgroundColor"
                :style="'visibility: visible'" :src="`/main?path=${route.params.path}`">
            </iframe>
            <ModuleActionBar ref="actionRef" :deviceEnv="deviceEnv!" :browserEnv="browserEnv!" :isEditorRef="false"
                @on-add="addItem" @on-prepare="prepareDrawData" @on-logout="logout">
            </ModuleActionBar>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.frame_container {
    height: 100vh;
    width: 100%;
    position: relative;
    border-width: 0;
    border-color: transparent;
    --tw-bg-opacity: 1;
    background-color: rgb(255 255 255 / var(--tw-bg-opacity));
    transition: all 0.25s cubic-bezier(0.427, 0.073, 0.105, 0.997) 0.1s;

    //   @include background_color('backgroundColor');

    &.frame_container-mobile {
        height: min(80vh, 900px);
        width: 452px;
        border: 12px solid #fff;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.04), 0 25px 31px rgba(0, 0, 0, 0.02),
            0 16.2037px 18.1551px rgba(0, 0, 0, 0.015),
            0 9.62963px 9.87407px rgba(0, 0, 0, 0.012),
            0 5px 5.0375px rgba(0, 0, 0, 0.01),
            0 2.03704px 2.52593px rgba(0, 0, 0, 0.008),
            0 0.462963px 1.21991px rgba(0, 0, 0, 0.005);
        border-radius: 64px;
        margin-bottom: 5rem;

        .frame_container-iframe {
            border-radius: 52px;
        }
    }

    .frame_container-iframe {
        margin-bottom: 0;
        height: 100%;
        width: 100%;
    }
}
</style>
