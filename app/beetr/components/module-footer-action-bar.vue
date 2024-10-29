<script setup lang="ts">
import confetti from 'canvas-confetti'
import pc from './images/pc.png'
import mobile from './images/mobile.png'
import pc2 from './images/pc2.png'
import mobile2 from './images/mobile2.png'
import { type Style, BROWSER_ENV, SvgTheme, SvgAdd } from '@beetr/constant'
import { _widgetStore } from '~~/store/widget'
import { copyToClipboard } from '@beetr/hooks'
import { storeToRefs } from "pinia"
import { drawData, addDrawData } from '~~/store/isLoading'
import { _userStore } from '~~/store/user'
import { _envStore } from '~/store/env'


const envStore = _envStore()
const { browserEnv, deviceEnv } = storeToRefs(envStore)

const props = defineProps<{
    loadingRef: boolean
    isEditorRef: boolean
}>()

const deviceCompute = computed(() => {
    return (icon1: string, icon2: string, active: boolean) => {
        return drawData.nowColor == 'dark' ? icon1 : active ? icon1 : icon2
    }
})
/** 定义触发父组件的事件 */
const emit = defineEmits<{
    (e: 'openTheme'): void
    (e: 'onSetEnv', env: keyof typeof BROWSER_ENV): void
}>()


/** 分享 */
const onShare = () => {
    confetti({
        angle: browserEnv.value == BROWSER_ENV.desktop ? 90 : 90,
        spread: browserEnv.value == BROWSER_ENV.desktop ? 100 : 50,
        particleCount: 200,
        origin: browserEnv.value == BROWSER_ENV.desktop ? { y: 0.9, x: 0.4 } : { y: 1, x: 0.3 },
    })
    ElNotification({
        title: '成功',
        message: '链接已复制，快分享给朋友！',
        type: 'success',
    })
    const URL = window.location.href
    copyToClipboard(URL)
}
</script>

<template>
    <div :class="['action_bar', browserEnv == BROWSER_ENV.mobile ? 'mobile' : 'desktop', isEditorRef ? 'editor' : '']">
        <el-button type="success" :disabled="props.loadingRef" style="width:127px" class="relative greenBtn "
            @click="onShare">
            <span v-if="!props.loadingRef">发给朋友</span>
            <div class="animation__shine" style="animation-duration: 4000ms"></div>
            <el-icon class="is-loading" v-if="props.loadingRef">
                <img src="./images/loading.png" alt="">
            </el-icon>
        </el-button>
 
        <template v-if="browserEnv == BROWSER_ENV.mobile">
            <el-button type="success" style="width:89px;" class="relative blackBtn" @click="addDrawData.show = true">
                <span>
                    <SvgAdd></SvgAdd>
                    <!-- <img src="./add.svg" style="width: 11px;height: 11px;margin-right: 16px;" alt=""> -->
                </span>
                <span>添加</span>
                <!-- <div class="animation__shine" style="animation-duration: 4000ms"></div> -->
            </el-button>
            <el-button type="success" style="width:89px;" class="relative blackBtn" @click="drawData.show = true">
                <span>
                    <!-- <img src="./theme.svg" style="width: 11px;height: 11px;margin-right: 16px;" alt=""> -->
                    <SvgTheme></SvgTheme>
                </span>
                <span>主题</span>
                <!-- <div class="animation__shine" style="animation-duration: 4000ms"></div> -->
            </el-button>
        </template>
        <template v-else>
            <el-divider direction="vertical" class="!mx-4" />
            <div class="flex items-center space-x-1">
                <el-button type="success" style="width:89px;" class="relative blackBtn"
                    @click="addDrawData.show = true">
                    <span>
                        <SvgAdd></SvgAdd>
                        <!-- <img src="./add.svg" style="width: 11px;height: 11px;margin-right: 16px;" alt=""> -->
                    </span>
                    <span>添加</span>
                    <!-- <div class="animation__shine" style="animation-duration: 4000ms"></div> -->
                </el-button>
                <el-button type="success" style="width:89px;" class="relative blackBtn" @click="drawData.show = true">
                    <span>
                        <SvgTheme></SvgTheme>
                        <!-- <img src="./theme.svg" style="width: 11px;height: 11px;margin-right: 16px;" alt=""> -->
                    </span>
                    <span>主题</span>
                    <!-- <div class="animation__shine" style="animation-duration: 4000ms"></div> -->
                </el-button>
            </div>

            <el-divider direction="vertical" class="!mx-4" />

            <!-- 切换预览，尽在browerEnv == BROWSER_ENV.desktop -->
            <div class="flex items-center space-x-1" v-if="browserEnv == BROWSER_ENV.desktop">
                <el-tooltip content="编辑便当在电脑端上的样式" effect="light" placement="top" :show-after="300" :offset="7"
                    popper-class="custom-tooltip-animation bg-white w-[120px] p-[10px]">
                    <el-button
                        :class="'h-[33px] w-[50px] !rounded-[6px]  ' + (deviceEnv === BROWSER_ENV.desktop ? 'activeBtn' : 'primaryBtn')"
                        @click="emit('onSetEnv', BROWSER_ENV.desktop)">
                        <img :src="deviceCompute(pc, pc2, deviceEnv === BROWSER_ENV.desktop)" width="15" height="15">
                        <!-- <SvgDesktop v-if="props.env === BROWSER_ENV.desktop" />
            <SvgDesktop2 v-else /> -->
                    </el-button>
                </el-tooltip>
                <el-tooltip content="编辑便当在手机端上的样式" effect="light" placement="top" :show-after="300" :offset="7"
                    popper-class="custom-tooltip-animation bg-white w-[120px] p-[10px]">
                    <el-button
                        :class="'h-[33px] w-[50px] !rounded-[6px]  ' + (deviceEnv === BROWSER_ENV.mobile ? 'activeBtn' : 'primaryBtn')"
                        @click="emit('onSetEnv', BROWSER_ENV.mobile)">
                        <img :src="deviceCompute(mobile, mobile2, deviceEnv === BROWSER_ENV.mobile)" width="15"
                            height="15">
                        <!-- <SvgMobile2 v-if="props.env === BROWSER_ENV.mobile" />
            <SvgMobile v-else /> -->
                    </el-button>
                </el-tooltip>
                <!-- <el-tooltip content="Edit how your Bento looks onphones" effect="light" placement="top" :show-after="300"
          :offset="7" popper-class="custom-tooltip-animation">
        
        </el-tooltip> -->
            </div>
        </template>
    </div>
</template>

<style lang="scss" scoped>
.action_bar {
    position: fixed;
    bottom: 2.5rem;
    z-index: 49;
    display: flex;
    align-items: center;
    border-radius: 16px;
    border: 1px solid;
    // @include border_color('actionBarBorderColor');
    // @include background_color('actionBarBgColor');
    padding: 0.75rem;
    backdrop-filter: blur(24px) saturate(30);
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.04), 0 27px 54px rgba(0, 0, 0, 0.04),
        0 17.5px 31.625px rgba(0, 0, 0, 0.03), 0 10.4px 17.2px rgba(0, 0, 0, 0.024),
        0 5.4px 8.775px rgba(0, 0, 0, 0.02), 0 2.2px 4.4px rgba(0, 0, 0, 0.016),
        0 0.5px 2.125px rgba(0, 0, 0, 0.01);

    &.desktop {
        left: 50%;
        transform: translateX(-50%);
        animation: styles_enter-transform__C24Wv 1s cubic-bezier(0.2, 1.18, 0.47, 1) 0.9s backwards;
    }

    @keyframes styles_enter-transform__C24Wv {
        0% {
            transform: translate(-50%, 100px);
            filter: blur(8px);
        }

        to {
            transform: translate(-50%);
            filter: blur(0);
        }
    }

    .action_button {
        padding: 4px !important;

        .action_button-wrap {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            border-radius: 7px;
            background-color: rgb(255 255 255);
            width: 24px;
            height: 24px;
            box-shadow: 0 0.6px 2px rgba(0, 0, 0, 0.06);

            &::before {
                content: '';
                display: block;
                pointer-events: none;
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                border-radius: 7px;
                border: 1px solid rgba(0, 0, 0, 0.12);
                background: linear-gradient(180deg,
                        rgba(0, 0, 0, 0.06),
                        rgba(0, 0, 0, 0.059) 11.97%,
                        rgba(0, 0, 0, 0.056) 21.3%,
                        rgba(0, 0, 0, 0.051) 28.56%,
                        rgba(0, 0, 0, 0.044) 34.37%,
                        rgba(0, 0, 0, 0.037) 39.32%,
                        rgba(0, 0, 0, 0.03) 44%,
                        rgba(0, 0, 0, 0.023) 49.02%,
                        rgba(0, 0, 0, 0.016) 54.96%,
                        rgba(0, 0, 0, 0.009) 62.44%,
                        rgba(0, 0, 0, 0.004) 72.04%,
                        rgba(0, 0, 0, 0.001) 84.36%,
                        transparent);
            }
        }
    }

    .action_add-link {
        position: fixed;
        bottom: 106px;
        left: calc(50% - 60px);
        z-index: 48;
        display: flex;
        width: 290px;
        align-items: center;
        border-radius: 14px;
        background-color: hsla(0, 0%, 100%, 0.88);
        backdrop-filter: blur(24px) saturate(30);
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.04), 0 22px 33px rgba(0, 0, 0, 0.03),
            0 14.2593px 19.3264px rgba(0, 0, 0, 0.023), 0 8.47407px 10.5111px rgba(0, 0, 0, 0.018),
            0 4.4px 5.3625px rgba(0, 0, 0, 0.015), 0 1.79259px 2.68889px rgba(0, 0, 0, 0.012),
            0 0.407407px 1.29861px rgba(0, 0, 0, 0.007);
        transform-origin: bottom center;
        transform-style: preserve-3d;
        transform: translateX(-50%) rotateX(70deg) scale3d(0.94, 0.94, 1);
        opacity: 0;
        transition: transform 0.5s cubic-bezier(0.468, -0.016, 0.094, 1.001),
            opacity 0.3s cubic-bezier(0.468, -0.016, 0.094, 1.001);
    }

    .activeBtn {
        // @include background_color('actionBarBtnBgColor');
    }

    .primaryBtn {
        // @include background_color('actionBarBgColor');
    }

}
</style>
<style></style>
