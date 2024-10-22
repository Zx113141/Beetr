<script setup lang="ts">
import { InputInstance, ElNotification } from 'element-plus'
import { Link } from '@element-plus/icons-vue'
import { BROWSER_ENV, LINK_TYPE, IUserAppItem, SvgCopyLink, ENV_ENUM } from '@beetr/constant'
import { copyToClipboard } from '@beetr/hooks'
import { toRefs, ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'
import ModuleHrefDescription from './description/index.vue'
const props = defineProps<{
    item: IUserAppItem,
    env: keyof typeof ENV_ENUM,
    isEdit: Boolean
}>()
const { item } = toRefs(props)

/** 切换显示input输入框 */
const showInput = ref(false)
const hover = ref(false)
/** 输入框ref */
const inputRef = ref<InputInstance | null>(null)

/** 切换为输入模式 */
const onToggleInput = async () => {
    if (!props.isEdit || props.env == BROWSER_ENV.mobile) return
    showInput.value = true
    await nextTick()
    inputRef.value!.focus()
}

const visitJump = () => {
    if (props.isEdit || !item.value.url) return
    window.open(item.value.url)
}

/** 上传文件成功 */
const onUploadSuccess = async (response: any) => {
    const row = { ...item.value, screenshotUrl: response.message }
    emits('onEdit', [row])
    // await widgetStore.onUpdate()
    item.value.screenshotUrl = response.message
}

/** 删除图片 */
const onDeleteImg = async () => {
    const row = { ...item.value, screenshotUrl: null }

    // await widgetStore.onUpdate([row])
    emits('onEdit', [row])
    item.value.screenshotUrl = null
}
/** 更新title */
const updateWidget = () => {
    // widgetStore.onUpdate([item.value])
    emits('onEdit', [item.value])
}
const addUrl = ref('')
const getPaste = async () => {
    const res = await navigator.clipboard.readText()
    addUrl.value = res
}
const emits = defineEmits(['addTemp', 'onEdit'])
const onSetComplete = () => {
    if (!addUrl.value) return
    if (addUrl.value.indexOf('https://') != 0 && addUrl.value.indexOf('http://') != 0) {
        ElNotification({
            title: '提示',
            message: '无效的URL，需包含：https://、http://',
        })
        return
    }
    // showPoper.value = false
    emits('addTemp', addUrl.value)
}
 

const styleCompute = computed(() => {
    return function (item: IUserAppItem) {
        return `--widget-color: ${item.widgetColor || '#000'}; --widget-color-hover: ${item.widgetColorHover
            };--widget-color-active: ${item.widgetColorActive};border:${item.temType ? '0' : ''
            };${hover.value ? `background-color:${item.widgetColorActive} !important;` : `background-color:${item.bgColor} !important;`}`
    }
})

const copyAccount = (text?: string) => {
    if (!text) return
    try {
        copyToClipboard(text)
        ElNotification({
            title: '成功',
            message: '复制账号成功！',
            type: 'success',
        })
    } catch (err) {
        ElNotification({
            title: '失败',
            message: '复制失败',
            type: 'error',
        })
    }
}
const onHover = () => {
    if (!props.isEdit) {
        hover.value = true
    }
}
const onLeave = () => {
    hover.value = false
}
let timer: any = null
// onMounted(() => {
//     const type = item.value.variant
//     const status = item.value.fetchStatus
//     if (type == 'normal' && status == 1) {
//         timer = setInterval(() => {
//             widgetStore.onUpdateCrawler(item.value.id).then(res => {
//                 if (!res.fetchStatus) {
//                     clearInterval(timer)
//                 }
//             })

//         }, 3000)
//     }

// })
// onBeforeUnmount(() => {
//     if (timer) {
//         clearInterval(timer)
//     }
// });

</script>

<template>
    
    <div @mouseover="onHover" @mouseleave="onLeave" class="widget_base-link" :class="`${item.temType ? 'temStyle' : ''} widget_base-${item.cusStyle[env].w * 2}x${item.cusStyle[env].h
        }`" :style="styleCompute(item)">
        <div class="widget_base-description" v-if="!item.temType" @click="visitJump">
            <!-- styles_follow-button 这个按钮组件的位置根据不同组件属性，展示在不同的位置 -->
            <ModuleHrefDescription :is-edit="isEdit" :item="item" :env="env"></ModuleHrefDescription>
        </div>
        <!-- 图片显示 -->
        <div class="widget_base-frame">
            <el-image v-if="item.screenshotUrl" class="h-full w-full rounded-[inherit]"
                :src="decodeURIComponent(item.screenshotUrl)" fit="cover"></el-image>
            <!-- <el-image v-else class="h-full w-full rounded-[inherit]" :src="morenImg" fit="cover"></el-image> -->
        </div>
        <template v-if="`${item.cusStyle[env].w * 2}x${item.cusStyle[env].h}` === '2x4'">
            <div class="flex-1"></div>
            <div v-if="item.follow" class="styles_follow-button" :class="item.btnCus">
                {{ item.follow }}
            </div>
        </template>
        <div v-if="item.nickName && !props.isEdit" @click="() => copyAccount(item.nickName)"
            class="absolute top-[14px] right-[14px] flex items-center justify-center rounded-full bg-black/20 backdrop-blur-[8px] w-[22px] h-[22px]">
            <SvgCopyLink></SvgCopyLink>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.prevent {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(253, 253, 253);
    border-radius: 20px;
    border: 2px dashed rgba(0, 0, 0, 0.08);
    transition: all 0.3s;
    transform: scale(1);

    .icon {
        width: 24px;
        height: 24px;
        opacity: 1;
        border-radius: 8px;
        margin: 0 auto;
        background: rgba(88, 86, 214, 1);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .words {
        font-size: 14px;
        font-weight: 500;
        letter-spacing: 1px;
        line-height: 20.27px;
        color: rgba(0, 0, 0, 1);
        margin-top: 3px;
    }

    .addpng {
        position: absolute;
        top: 22px;
        right: 22px;
        width: 14px;
    }
}

.preventBox {
    box-shadow: 0 25px 31px rgba(0, 0, 0, 0.06), 0 16.2037px 18.1551px rgba(0, 0, 0, 0.046),
        0 9.62963px 9.87407px rgba(0, 0, 0, 0.036), 0 5px 5.0375px rgba(0, 0, 0, 0.03),
        0 2.03704px 2.52593px rgba(0, 0, 0, 0.024), 0 0.462963px 1.21991px rgba(0, 0, 0, 0.014);
    border: 2px solid #000000;
    transform: scale(1.05);
}

.widget_base-link {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    padding: 1.5rem;
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
    border-radius: 20px;
    // background-color: var(--widget-color-bg);
    // @include background_color('moduleBlockBackgrouundColor');
    // @include font_color('moduleBlockColor');
    overflow: hidden;
    // backdrop-filter: blur(10px);

    &.widget_base-maps {
        padding: 0;
    }

    &.widget_base-2x4,
    &.widget_base-4x4 {
        flex-direction: column;
        align-items: flex-start;
    }

    .widget_base-frame {
        position: relative;
        display: flex;
        min-height: 0;
        flex-direction: column;
        border-radius: 10px;

        &:hover .widget_base-frame--menu {
            opacity: 1;
        }
    }

    .menu_image-edit-bar {
        display: flex;
        align-items: center;
        background-color: #000000;
        color: #ffffff;
        border-radius: 10px;
        padding: 0.375rem;
        box-shadow: 0 9px 13px rgba(0, 0, 0, 0.05), 0 5.83333px 7.61343px rgba(0, 0, 0, 0.038),
            0 3.46667px 4.14074px rgba(0, 0, 0, 0.03), 0 1.8px 2.1125px rgba(0, 0, 0, 0.025),
            0 0.733333px 1.05926px rgba(0, 0, 0, 0.02), 0 0.166667px 0.511574px rgba(0, 0, 0, 0.012);

        &> :not([hidden])~ :not([hidden]) {
            --tw-space-x-reverse: 0;
            margin-right: calc(0.375rem * var(--tw-space-x-reverse));
            margin-left: calc(0.375rem * calc(1 - var(--tw-space-x-reverse)));
        }
    }

    .menu_image-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        width: 24px;
        height: 24px;
        background-color: #000000;
        color: #ffffff;
        box-shadow: 0 9px 13px rgba(0, 0, 0, 0.05), 0 5.83333px 7.61343px rgba(0, 0, 0, 0.038),
            0 3.46667px 4.14074px rgba(0, 0, 0, 0.03), 0 1.8px 2.1125px rgba(0, 0, 0, 0.025),
            0 0.733333px 1.05926px rgba(0, 0, 0, 0.02), 0 0.166667px 0.511574px rgba(0, 0, 0, 0.012);
    }

    .widget_base-frame--menu {
        position: absolute;
        left: -10px;
        top: -10px;
        opacity: 0;
        transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .widget_base-description {
        display: flex;
        max-height: 100%;
        width: 100%;
        max-width: 100%;
        flex: 1 1 0%;
        flex-direction: column;
        align-items: flex-start;
    }

    .description_container {
        margin-top: 9px;
        display: flex;
        width: 100%;
        flex-direction: column;
        word-break: break-all;

        @media (min-width: 320px) {
            .description_container-p {
                margin-top: 0;
                overflow: hidden;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
            }
        }

        @media screen and (min-width: 410px) {
            .description_container-p {
                overflow: hidden;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
            }
        }
    }

    .styles_follow-button {
        display: none;
        padding: 7px 11px;
        font-size: 0.75rem;
        line-height: 1rem;
        width: 70px;
        letter-spacing: 2px;
        text-align: center; // margin-top: 16px;
        // // @include background_color('moduleBlockBackgroundColor');
        // // @include font_color('moduleBlockColor');
    }

    @media screen and (min-width: 388px) {
        .styles_follow-button {
            display: block;
        }
    }

    @media screen and (min-width: 410px) {
        .styles_follow-button {
            padding: 7px 14px;
        }
    }

    .description_icon {
        position: relative;
        display: flex;
        align-items: flex-start;
        aspect-ratio: 1/1;
        overflow: hidden;
        border-radius: 10px;
        width: 40px;
        height: 40px;
        min-height: 40px;
        min-width: 40px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

        &::before {
            content: '';
            display: block;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
            border-radius: inherit;
        }

        img {
            width: 100%;
            height: 100%;
        }
    }

    .is2x1 {
        display: flex;
        flex-direction: row;
        align-items: center;
        column-gap: 10px;
    }

    .description_container-wrap {
        position: relative;
        z-index: 5;
        cursor: text !important;
        border-radius: var(--el-border-radius-base);
        background-color: transparent;
        border-radius: var(--el-border-radius-base);
    }

    .description_container-p {
        margin-top: -2px;
        font-size: 0.875rem;
        line-height: 1.2;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
    }

    .description_container-title {
        z-index: 20;
        // // @include background_color('moduleBlockBackgrouundColor');
        // @include font_color('moduleTitleColor');
        vertical-align: top;
        margin-top: 0.25rem;

        :deep(.el-textarea__inner) {
            box-shadow: none;
            // padding: 0;
            // // @include font_color('moduleBlockColor');
            // // @include background_color('moduleBlockBackgrouundColor');
            font-size: 14px;
            color: rgba(0, 0, 0, 0.6);
            line-height: 16px;
            font-weight: 400;
        }
    }

    .description_container-unedit {
        &:hover {
            background-color: var(--widget-color-hover);
        }

        &:focus {
            background-color: var(--widget-color-active);
        }

        &.active {
            background-color: var(--widget-color-active);
        }
    }

    .description_container-1x2 {
        -webkit-line-clamp: 1;
    }

    .description_container-2x1 {
        -webkit-line-clamp: 1;
    }

    .description_container-2x2 {
        -webkit-line-clamp: 1;
    }

    .description_container-1x4 {
        -webkit-line-clamp: 6;
    }

    .description_container-2x4 {
        -webkit-line-clamp: 3;
    }

    .description_container-host {
        border-radius: 5px;
        padding: 0.25rem 0.25rem 0.25rem 0;
        font-size: 13px;

        font-weight: 400;
        margin-top: 0.25rem;
        // @include font_color('moduleInputColor');
        cursor: text !important;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
    }

    // 按界面操作顺序
    &.widget_base-2x2 {
        .widget_base-description {
            .description_container {
                flex: 1 1 0%;
            }
        }

        .widget_base-frame {
            display: none;
        }
    }

    &.widget_base-4x1 {
        .widget_base-description {
            display: flex;
            flex-direction: row;
            align-items: center;

            .description_icon {
                border-radius: 7px;
                width: 28px;
                height: 28px;
                min-height: 28px;
                min-width: 28px;
            }

            .description_container {
                margin-left: 0.75rem;
                margin-top: 0;

                .description_container-p {
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 1;
                }

                // .description_container-host {
                //   display: none;
                // }
            }
        }

        .widget_base-frame {
            display: none;
        }
    }

    &.widget_base-4x2 {
        .widget_base-description {
            .description_container {
                flex: 1 1 0%;
            }
        }

        .widget_base-frame {
            margin-left: 1.5rem;
            aspect-ratio: 1.4;
            height: 100%;
        }
    }

    &.widget_base-2x4 {
        .widget_base-description {
            .description_container {
                margin-bottom: 0.75rem;

                .description_container-p {
                    font-size: 0.875rem;
                    line-height: 1.25rem;
                    line-height: 1.2;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 6;
                }
            }
        }

        .widget_base-frame {
            margin-top: 0.5rem;
            aspect-ratio: 1.91;
            width: 100%;
        }
    }

    &.widget_base-4x4 {
        .widget_base-description {
            .description_container {
                margin-bottom: 0.75rem;
            }
        }

        .widget_base-frame {
            margin-top: 0.5rem;
            aspect-ratio: 1.91;
            width: 100%;
        }

        .styles_follow-button {
            display: block;
        }
    }
}

.addDialog {
    position: absolute;
    top: calc(100% + 0px);
    left: 50%;
    transform: translateX(-50%);
    border-radius: 18px;
    background-color: #ffffff;
    width: 290px;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
}

.temStyle {
    width: 100%;

    height: 100%;

    box-sizing: border-box;
    position: relative;
    overflow: inherit;
}

// 媒介查询适配 *************************
.widget_base-1x4 {
    padding: 0.875rem 1.5rem;
}

@media (min-width: 350px) {
    .widget_base-1x4 {
        padding-top: 18px;
        padding-bottom: 18px;
    }

    .widget_base-2x4 {
        .description_container-p {
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 6;
        }
    }
}

@media screen and (max-width: 374px) {
    .description_container-host {
        display: none !important;
    }
}

@media (min-width: 375px) {
    .widget_base-1x4 {
        padding-top: 1.25rem;
        padding-bottom: 1.25rem;
    }
}

@media screen and (max-width: 400px) {
    .widget_base {
        padding: 1.25rem;
    }

    .widget_base-1x4 {
        padding: 0.875rem 1.25rem;
    }
}

.widget_base-unEdit:hover {
    background-color: var(--widget-color-hover) !important;
}

// 媒介查询适配 *************************</style>
