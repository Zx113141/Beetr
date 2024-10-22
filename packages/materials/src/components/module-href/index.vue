<script setup lang="ts">
import { InputInstance, ElNotification } from 'element-plus'
import { Link } from '@element-plus/icons-vue'
import { BROWSER_ENV, LINK_TYPE, IUserAppItem, SvgCopyLink, ENV_ENUM } from '@beetr/constant'
import { copyToClipboard } from '@beetr/hooks'
import { toRefs, ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'
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
    showPoper.value = false
    emits('addTemp', addUrl.value)
}
const showPoper = ref(false)
const morenImg = new URL(`./moren.png`, import.meta.url).href

const styleCompute = computed(() => {
    return function (item: IUserAppItem) {
        return `--widget-color: ${item.widgetColor || '#000'}; --widget-color-hover: ${item.widgetColorHover
            };--widget-color-active: ${item.widgetColorActive};border:${item.temType ? '0' : ''
            };${hover.value ? `background-color:${item.widgetColorActive} !important;` : `background-color:${item.bgColor} !important;`}`
    }
})

const copyAccount = (text?: string) => {
    if (!text) return

    // let x: number = 0
    // let y: number = 0
    // if (browserprops.env== BROWSER_ENV.desktop) {
    //   x += 0.5
    // }
    // x = x + (item.value.position[props.env].x + 1) / 8
    // y = x + (item.value.position[props.env].y + 1) / 8
    // confetti({
    //   // angle: browserprops.env== BROWSER_ENV.desktop ? 90 : 90,
    //   // spread: 30,
    //   particleCount: 100,
    //   origin: { x, y },
    //   shapes: ['circle', 'square', 'star'],
    // })
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
    <!-- <img v-if="item.screenshotUrl" :src="item.screenshotUrl" style="position: absolute;z-index: -1;width: 0;height: 0;"
    crossorigin="anonymous" /> -->

    <div @mouseover="onHover" @mouseleave="onLeave" class="widget_base-link" :class="`${item.temType ? 'temStyle' : ''} widget_base-${item.cusStyle[env].w * 2}x${item.cusStyle[env].h
        }`" :style="styleCompute(item)">
        <div class="widget_base-description" v-if="!item.temType" @click="visitJump">
            <!-- styles_follow-button 这个按钮组件的位置根据不同组件属性，展示在不同的位置 -->
            <div v-if="`${item.cusStyle[env].w * 2}x${item.cusStyle[env].h}` === '4x4'" class="flex items-start w-full">
                <div class="description_icon">
                    <img v-if="item.faviconUrl" :src="decodeURIComponent(item.faviconUrl)" alt="" srcset="" />
                    <el-icon v-else size="2rem" class="!w-full !h-full">
                        <Link />
                    </el-icon>
                </div>
                <div class="flex-1"></div>
                <div v-if="item.follow" class="styles_follow-button" :class="item.btnCus">
                    {{ item.follow }}
                </div>
            </div>
            <div v-else class="description_icon">
                <!-- <img src="https://i0.hdslb.com/bfs/static/jinkela/long/images/512.png" alt=""> -->
                <img v-if="item.faviconUrl" :src="decodeURIComponent(item.faviconUrl)" alt="" srcset="" />
                <el-icon v-else size="2rem" class="!w-full !h-full">
                    <Link />
                </el-icon>
            </div>
            <div class="description_container" :class="{
                active: showInput,
                is2x1: item.cusStyle[env].w + 'x' + item.cusStyle[env].h == '2x1',
            }">
                <!-- 网站名称 -->
                <div class="description_container-wrap"
                    v-if="!(item.cusStyle[env].w + 'x' + item.cusStyle[env].h == '2x1')">
                    <div class="description_container-p" @click="onToggleInput">
                        {{ item.title }}
                    </div>
                </div>
                <!-- 域名 - 这个地方link不显示 -->
                <div v-if="!showInput && item.variant === LINK_TYPE.social" :class="`description_container-host ${props.isEdit ? 'description_container-unedit' : ''
                    } description_container-${item.cusStyle[env].w}x${item.cusStyle[env].h}`" @click="onToggleInput">
                    @{{ item.nickName }}
                </div>

                <el-input v-if="showInput" ref="inputRef" v-model="item.nickName" type="textarea"
                    class="description_container-title" :autosize="true" @blur="showInput = false"
                    @change="updateWidget"></el-input>
            </div>
            <div v-if="(`${item.cusStyle[env].w * 2}x${item.cusStyle[env].h}` === '2x2' ||
                `${item.cusStyle[env].w * 2}x${item.cusStyle[env].h}` === '4x2') &&
                item.follow &&
                item.btnCus
            " class="styles_follow-button" :class="item.btnCus">
                {{ item.follow }}
            </div>
        </div>
        <!-- 图片显示 -->
        <div class="widget_base-frame">
            <el-image v-if="item.screenshotUrl" class="h-full w-full rounded-[inherit]"
                :src="decodeURIComponent(item.screenshotUrl)" fit="cover"></el-image>
            <el-image v-else class="h-full w-full rounded-[inherit]" :src="morenImg" fit="cover"></el-image>
            <!-- <div v-if="props.isEdit" class="widget_base-frame--menu" style="display: none;"> -->
            <div class="widget_base-frame--menu" style="display: none">
                <div class="menu_image-edit-bar">
                    <!-- 上传图片 -->
                    <upload-media @on-success="onUploadSuccess">
                        <el-tooltip placement="top-start" effect="light">
                            <template #content>上传自定义图片<br />(最好1200×630)</template>
                            <button class="menu_image-btn">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M11.6 2H6.4C5.24689 2 4.50235 2.00156 3.93567 2.04785C3.39235 2.09225 3.19091 2.1676 3.09202 2.21799C2.71569 2.40973 2.40973 2.71569 2.21799 3.09202C2.1676 3.19091 2.09225 3.39235 2.04785 3.93567C2.00156 4.50235 2 5.24689 2 6.4V11.2961L4.34151 9.24724C4.70597 8.92834 5.24655 8.91642 5.62471 9.21895L7.4258 10.6598L11.7929 6.29271C12.1673 5.91831 12.7686 5.90064 13.1644 6.25241L16 8.77296V6.4C16 5.24689 15.9984 4.50235 15.9521 3.93567C15.9078 3.39235 15.8324 3.19091 15.782 3.09202C15.5903 2.71569 15.2843 2.40973 14.908 2.21799C14.8091 2.1676 14.6077 2.09225 14.0643 2.04785C13.4977 2.00156 12.7531 2 11.6 2ZM0.0240504 13.7186C-0.00338973 13.5957 -0.00725765 13.469 0.0119773 13.3454C0 12.8499 0 12.276 0 11.6V6.4C0 4.15979 0 3.03969 0.435974 2.18404C0.819467 1.43139 1.43139 0.819467 2.18404 0.435974C3.03969 0 4.15979 0 6.4 0H11.6C13.8402 0 14.9603 0 15.816 0.435974C16.5686 0.819467 17.1805 1.43139 17.564 2.18404C18 3.03969 18 4.15979 18 6.4V10.9933V11.0071V11.6C18 13.8402 18 14.9603 17.564 15.816C17.1805 16.5686 16.5686 17.1805 15.816 17.564C14.9603 18 13.8402 18 11.6 18H6.4C4.15979 18 3.03969 18 2.18404 17.564C1.43139 17.1805 0.819467 16.5686 0.435974 15.816C0.165964 15.286 0.0631784 14.6547 0.0240504 13.7186ZM16 11.6V11.4489L12.5404 8.37366L8.20712 12.7069C7.84682 13.0672 7.27321 13.099 6.87532 12.7807L5.02876 11.3034L2.03733 13.9209C2.04055 13.97 2.04405 14.0178 2.04785 14.0643C2.09225 14.6077 2.1676 14.8091 2.21799 14.908C2.40973 15.2843 2.71569 15.5903 3.09202 15.782C3.19091 15.8324 3.39235 15.9078 3.93567 15.9521C4.50235 15.9984 5.24689 16 6.4 16H11.6C12.7531 16 13.4977 15.9984 14.0643 15.9521C14.6077 15.9078 14.8091 15.8324 14.908 15.782C15.2843 15.5903 15.5903 15.2843 15.782 14.908C15.8324 14.8091 15.9078 14.6077 15.9521 14.0643C15.9984 13.4977 16 12.7531 16 11.6ZM5.5 7C6.32843 7 7 6.32843 7 5.5C7 4.67157 6.32843 4 5.5 4C4.67157 4 4 4.67157 4 5.5C4 6.32843 4.67157 7 5.5 7Z"
                                        fill="currentColor"></path>
                                </svg>
                            </button>
                        </el-tooltip>
                    </upload-media>

                    <el-tooltip content="使用网站图片" placement="top" effect="light">
                        <button class="menu_image-btn" data-state="closed">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M2.18394 0.435873C2.98707 0.0266559 4.0232 0.00154138 5.9999 0V2.00004C5.06969 2.00093 4.43386 2.00704 3.93557 2.04775C3.39224 2.09215 3.19081 2.1675 3.09192 2.21789C2.71559 2.40963 2.40963 2.71559 2.21789 3.09192C2.1675 3.19081 2.09215 3.39224 2.04775 3.93557C2.00704 4.43386 2.00093 5.06969 2.00004 5.9999H0C0.00154138 4.0232 0.0266559 2.98707 0.435873 2.18394C0.819367 1.43129 1.43129 0.819367 2.18394 0.435873ZM11.9999 0V2.00004C12.9301 2.00093 13.5659 2.00704 14.0642 2.04775C14.6076 2.09215 14.809 2.1675 14.9079 2.21789C15.2842 2.40963 15.5902 2.71559 15.7819 3.09192C15.8323 3.19081 15.9077 3.39224 15.952 3.93557C15.9928 4.43386 15.9989 5.06969 15.9998 5.9999H17.9998C17.9983 4.0232 17.9731 2.98707 17.5639 2.18394C17.1804 1.43129 16.5685 0.819367 15.8159 0.435873C15.0127 0.0266559 13.9766 0.00154138 11.9999 0ZM14.0642 15.952C13.5659 15.9928 12.9301 15.9989 11.9999 15.9998V17.9998C13.9766 17.9983 15.0127 17.9731 15.8159 17.5639C16.5685 17.1804 17.1804 16.5685 17.5639 15.8159C17.9731 15.0127 17.9983 13.9766 17.9998 11.9999H15.9998C15.9989 12.9301 15.9928 13.5659 15.952 14.0642C15.9077 14.6076 15.8323 14.809 15.7819 14.9079C15.5902 15.2842 15.2842 15.5902 14.9079 15.7819C14.809 15.8323 14.6076 15.9077 14.0642 15.952ZM2.04775 14.0642C2.00704 13.5659 2.00093 12.9301 2.00004 11.9999H0C0.00154138 13.9766 0.0266559 15.0127 0.435873 15.8159C0.819367 16.5685 1.43129 17.1804 2.18394 17.5639C2.98707 17.9731 4.0232 17.9983 5.9999 17.9998V15.9998C5.06969 15.9989 4.43386 15.9928 3.93557 15.952C3.39224 15.9077 3.19081 15.8323 3.09192 15.7819C2.71559 15.5902 2.40963 15.2842 2.21789 14.9079C2.1675 14.809 2.09215 14.6076 2.04775 14.0642ZM13.2425 10.414C14.8046 8.8519 14.8046 6.31923 13.2425 4.75714C11.6804 3.19504 9.14773 3.19504 7.58564 4.75714C7.19511 5.14766 7.19511 5.78083 7.58564 6.17135C7.97616 6.56188 8.60932 6.56188 8.99985 6.17135C9.7809 5.3903 11.0472 5.3903 11.8283 6.17135C12.6093 6.9524 12.6093 8.21873 11.8283 8.99978C11.4378 9.3903 11.4378 10.0235 11.8283 10.414C12.2188 10.8045 12.852 10.8045 13.2425 10.414ZM8.99985 11.8282C8.2188 12.6093 6.95247 12.6093 6.17142 11.8282C5.39037 11.0472 5.39037 9.78083 6.17142 8.99978C6.56195 8.60925 6.56195 7.97609 6.17142 7.58557C5.7809 7.19504 5.14773 7.19504 4.75721 7.58557C3.19511 9.14766 3.19511 11.6803 4.75721 13.2424C6.31931 14.8045 8.85197 14.8045 10.4141 13.2424C10.8046 12.8519 10.8046 12.2187 10.4141 11.8282C10.0235 11.4377 9.39037 11.4377 8.99985 11.8282ZM8.99985 7.58557C9.39037 7.19504 10.0235 7.19504 10.4141 7.58557C10.8046 7.97609 10.8046 8.60925 10.4141 8.99978L8.99985 10.414C8.60932 10.8045 7.97616 10.8045 7.58564 10.414C7.19511 10.0235 7.19511 9.3903 7.58564 8.99978L8.99985 7.58557Z"
                                    fill="currentColor"></path>
                            </svg>
                        </button>
                    </el-tooltip>
                    <div class="h-3 w-[2px] rounded-full bg-white/[0.18]"></div>
                    <button v-if="item.screenshotUrl" class="menu_image-btn" data-state="closed" @click="onDeleteImg">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M6 1C5.44772 1 5 1.44772 5 2C5 2.55228 5.44772 3 6 3H12C12.5523 3 13 2.55228 13 2C13 1.44772 12.5523 1 12 1H6ZM2 4C1.44772 4 1 4.44772 1 5C1 5.55228 1.44772 6 2 6H3V14C3 15.6569 4.34315 17 6 17H12C13.6569 17 15 15.6569 15 14V6H16C16.5523 6 17 5.55228 17 5C17 4.44772 16.5523 4 16 4H2ZM5 14V6H13V14C13 14.5523 12.5523 15 12 15H6C5.44772 15 5 14.5523 5 14Z"
                                fill="currentColor"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <template v-if="`${item.cusStyle[env].w * 2}x${item.cusStyle[env].h}` === '2x4'">
            <div class="flex-1"></div>
            <div v-if="item.follow" class="styles_follow-button" :class="item.btnCus">
                {{ item.follow }}
            </div>
        </template>
        <div :class="showPoper ? 'preventBox prevent' : 'prevent'" @click="showPoper = !showPoper" v-if="item.temType"
            @drag.stop @touchstart.stop @mousedown.stop>
            <div>
                <div class="icon">
                    <Link color="#ffffff" />
                </div>
                <div class="words">添加链接</div>
            </div>
            <img src="./add.png" class="addpng" alt="" />
        </div>
        <div class="addDialog" v-if="showPoper">
            <div class="flex items-center h-11">
                <!-- 添加状态 -->
                <el-input v-model="addUrl" class="init_input !bg-white" placeholder="输入链接"
                    @keyup.enter="onSetComplete()">
                    <template #append>
                        <div>
                            <el-button v-show="!addUrl" size="small" @click="getPaste()"> 粘贴 </el-button>
                            <el-button v-show="addUrl" type="success" size="small" @click="onSetComplete()">
                                添加
                            </el-button>
                        </div>
                    </template>
                </el-input>
            </div>
        </div>
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
