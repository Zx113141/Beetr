<script setup lang="ts">
import '@amap/amap-jsapi-types';
declare let AMap: any;
import { storeToRefs } from 'pinia'
import { shallowRef } from '@vue/reactivity';
import { EditorContent, useEditor } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { BROWSER_ENV, BeijingLocation } from '~/utils/constant'
import SvgArrow from '../svg/avg-arrow.vue'
import type { IUserAppItem } from '~/api/widget'
import { _widgetStore } from '~~/store/widget'
import { _userStore } from '~~/store/user'
import { _envStore } from '~/store/env'
import { colorList } from '~~/utils/constant'
import { debounce } from '@/utils'
import { drawData } from "~/store/isLoading";
import { Ref } from "vue";

const envStore = _envStore()
const userStore = _userStore()
const { browserEnv } = storeToRefs(envStore)
const widgetStore = _widgetStore()

// const { env } = storeToRefs(widgetStore)
const props = defineProps<{
    item: IUserAppItem,
    edit: Boolean,
    /** 当前激活的id */
    visibleActionId: String,
    /** 正在移动的widget */
    isMovingWidget: string,
    env: keyof typeof BROWSER_ENV
}>()
const { item, visibleActionId } = toRefs(props)
const emits = defineEmits(["addTemp"])
const showRichText = ref(false)

/** 用户名称 🎉 */
const caption = useEditor({
    content: item.value?.caption,
    editable: !!userStore.isEdit,
    extensions: [
        StarterKit,
        Placeholder.configure({
            placeholder: '标题',
        }),
    ],
    // 监听编辑器任何变化
    onUpdate: debounce(({ editor }: any) => {
        const caption = editor.getHTML()
        console.log('caption.onUpdate', caption, item.value?.caption);
        if (caption === item.value?.caption) return
        item.value.caption = caption
        if (!editor.getText()) {
            item.value.caption = ''
        }
        widgetStore.onUpdate([item.value])
    }, 500),
    onFocus() {
        onUpdate.value = true
    },
    onBlur() {
        onUpdate.value = false
    }
})

const onUpdate = ref(false)

// 监听更新
watch(
    () => item.value.caption,
    (val) => {
        // 更新中或者当前不是当前激活的不处理
        if (onUpdate.value || visibleActionId.value !== item.value?.id) return
        console.log('监听更新 - 需要做来源空值', val);
        // 清理内容
        caption.value!.commands.clearContent()
        caption.value!.commands.setContent(val || '')
        caption.value!.commands.blur()
    }
)

const visitJump = () => {
    if (userStore.isEdit || (!item.value.longitude && !item.value.latitude)) return
    window.open(`https://uri.amap.com/marker?position=${item.value.longitude},${item.value.latitude}&name=${(item.value.caption || '').replace(/<[^>]*>/g, '')}`)
}

const styleCompute = computed(() => {
    return function (item: IUserAppItem) {
        return drawData.nowColor == 'dark' ? '' : `--widget-color: ${item.widgetColor || '#000'}; --widget-color-hover: ${item.widgetColorHover};--widget-color-active: ${item.widgetColorActive};border:${item.temType ? '0' : ''};background-color:${item.bgColor} !important;`
    }
})

// 地图实例
const map = shallowRef()
const amapId = computed(() => {
    return `amap_${item.value!.id || Date.now()}`
})

/** 地图事件变动更新 **/
const mapEventChange = debounce(() => {
    const zoom = map.value!.getZoom() // 获取当前地图级别
    const center = map.value!.getCenter() // 获取当前地图级别
    console.log('mapEventChange', zoom, center.lng, center.lat)
    item.value!.zoom = zoom
    item.value!.longitude = center.lng
    item.value!.latitude = center.lat
    widgetStore.onUpdate([item.value])
}, 1e3)

// 更新地图状态
const updateMapStatus = (value: boolean) => {
    const status = {
        dragEnable: value,
        keyboardEnable: value,
        doubleClickZoom: value,
        zoomEnable: value,
        rotateEnable: value
    }
    // 设置地图状态
    map.value!.setStatus(status);
}

const initMap = async () => {
    await nextTick()
    // 地图初始化
    map.value = new AMap.Map(amapId.value, {
        dragEnable: !!userStore.isEdit && props.edit,
        zoomEnable: !!userStore.isEdit && props.edit,
        keyboardEnable: !!userStore.isEdit && props.edit,
        doubleClickZoom: !!userStore.isEdit && props.edit,
        rotateEnable: !!userStore.isEdit && props.edit,
        zoom: item.value?.zoom || 14,
        center: [item.value?.longitude || 116.397389, item.value?.latitude || 39.909466],
        mapStyle: 'amap://styles/macaron',
    })
    // 地图事件绑定
    map.value!.on('moveend', mapEventChange)
    map.value!.on('zoomend', mapEventChange)

    await nextTick()
    // 动画 - 已经渲染的不做处理
    if (item.value!.variant == 'animation') return;
    // 老板说要自动定位当前
    loadAMapGeolocation()
    setTimeout(() => {
        // 初始化
        const cloudHeight = (widgetBaseMap.value.clientHeight / 2) - (cloudRef.value.clientHeight / 2)
        cloudAnimation.startX = -cloudRef.value.clientWidth
        cloudAnimation.startY = cloudHeight; // 起始Y坐标（底部）
        cloudAnimation.endX = widgetBaseMap.value.clientWidth + cloudRef.value.clientWidth; // 终点X坐标（右侧）
        cloudAnimation.endY = cloudHeight; // 终点Y坐标（顶部）
        requestMapAnimation(cloudRef, cloudAnimation)
        // 初始化
        planeAnimation.startX = -planeRef.value.clientWidth
        planeAnimation.startY = widgetBaseMap.value.clientHeight; // 起始Y坐标（底部）
        planeAnimation.endX = widgetBaseMap.value.clientWidth; // 终点X坐标（右侧）
        planeAnimation.endY = -planeRef.value.clientHeight; // 终点Y坐标（顶部）
        setTimeout(() => {
            requestMapAnimation(planeRef, planeAnimation)
        }, cloudAnimation.duration)
        // 标记动画已经执行过了 - 先用这个字段吧，后面有其他需求再说
        widgetStore.onUpdate([{
            ...item.value,
            variant: 'animation'
        }])
    }, 5e3)
}
// loadAMapGeolocation
const loadAMapGeolocation = () => {
    AMap.plugin('AMap.Geolocation', () => {
        const geolocation = new AMap.Geolocation({
            timeout: 10e3,
        });
        geolocation.getCurrentPosition((status: string, result: any) => {
            if (status == 'complete' && result.position) {
                // 移动中心点
                panTo([result.position.lng, result.position.lat])
            }
            console.log('getCurrentPosition', result, status)
        });
    })
}
// 放大地图
const zoomIn = () => {
    const zoom = map.value!.getZoom() // 获取当前地图缩放级别
    map.value!.setZoom(zoom + 1) // 放大
}

// 缩小地图
const zoomOut = () => {
    const zoom = map.value!.getZoom() // 获取当前地图缩放级别
    map.value!.setZoom(zoom - 1) // 缩小
}

// 转到中心的
const panTo = (lngLat: [number, number], zoom?: number) => {
    console.log('panTo', lngLat, zoom)
    map.value!.setZoomAndCenter(zoom || item.value?.zoom || 14, lngLat, false, 500)
}
// 转移坐标带缩放
const panToWidthZoom = ({ lngLat, zoom }: { lngLat: [number, number], zoom?: number }) => {
    panTo(lngLat, zoom)
}

// 动画相关
const widgetBaseMap = ref()
const cloudRef = ref()
const planeRef = ref()
const cloudAnimation = reactive({
    duration: 12000,
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
})
const planeAnimation = reactive({
    duration: 15000,
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
})

// 动画
const requestMapAnimation = (animationRef: Ref, animationConf: any) => {
    console.log('requestMapAnimation.animationConf', animationConf);
    let startTime = 0;
    const fn = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / animationConf.duration, 1); // 计算进度（确保不超过1）

        // 根据当前进度计算图片位置
        const currentX = animationConf.startX + (animationConf.endX - animationConf.startX) * progress;
        const currentY = animationConf.startY - (animationConf.startY - animationConf.endY) * progress;

        animationRef.value.style.left = currentX + "px";
        animationRef.value.style.top = currentY + "px";

        if (progress < 1) {
            requestAnimationFrame(fn); // 继续移动图片
        } else {
            // 如果是飞机则标记动画完成
            item.value!.variant = animationRef.value == planeRef.value ? 'animation' : ''
        }
    }
    requestAnimationFrame(fn)
}

onMounted(() => {
    if (process.client) {
        initMap()
    }
})

onUnmounted(() => {
    map.value?.destroy()
})

watch(
    () => visibleActionId.value,
    (val, oldVal) => {
        // 上一个操作是地图，可能某些原因被变动了，要把地图锁起来
        if (!val && oldVal && oldVal == item.value?.id) {
            updateMapStatus(false)
        }
    }
)

watch(
    () => props.edit,
    (value) => {
        // 无地图或者非选中不处理
        if (!map.value || visibleActionId.value !== item.value?.id) return
        updateMapStatus(value as boolean)
    },
    {
        immediate: true
    }
)

const pointerClass = computed(() => {
    return browserEnv.value == BROWSER_ENV.desktop ? userStore.isEdit && 'pointer-events-none' : ''
})

defineExpose({ zoomIn, zoomOut, panTo, panToWidthZoom })
</script>

<template>
    <div class="widget_base-map" :class="[`widget_base-${item.cusStyle[env].w}x${item.cusStyle[env].h}`]"
        :style="styleCompute" @mouseover="showRichText = true" ref="widgetBaseMap">
        <!-- 覆盖   -->
        <div class="prevent" @click.stop="visitJump" :class="[pointerClass]" v-if="!props.edit" @drag.stop
            @touchstart.stop @mousedown.stop>

        </div>
        <!-- 地图 -->
        <div class="map-container object-cover min-h-full min-w-full" :class="[userStore.isEdit ? '' : 'not-Editor']">
            <client-only>
                <div :id="amapId" class="min-h-full min-w-full"></div>
            </client-only>
            <!-- 局中动效 -->
            <div class="amap-center !h-[28px] !w-[28px]">
                <div class=" relative h-full w-full">
                    <div
                        class="absolute left-1/2 top-1/2 rounded-full bg-[#679BFF] opacity-20 w-3 h-3 z-50 styles_marker-pulse__BxsPp">
                    </div>
                    <div
                        class="relative flex h-full w-full items-center justify-center rounded-full bg-white styles_marker__Mzm27">
                        <div class="absolute inset-[3px] rounded-full bg-[#679BFF]"></div>
                        <div class="absolute inset-[3px] rounded-full styles_marker-border__fxi6v"></div>
                        <div class="absolute inset-[5px] rounded-full bg-[#679BFF]"></div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 动画 - 初始加载   -->
        <div v-if="item!.variant != 'animation'" class="amap-animation absolute top-0 left-0 z-30  w-full h-full">
            <img ref="cloudRef" src="@/assets/images/cloud.png" loading="eager" alt=""
                class="absolute top-1/3  image-cloud" />
            <img ref="planeRef" src="@/assets/images/plane.png" loading="eager" alt="" class="absolute image-plane" />
        </div>
        <!-- 富文本 - 手机端禁止编辑 -->
        <!-- (userStore.isEdit && !item.caption) && !item.temType -->
        <div v-if="showRichText || item.caption" class="caption_container"
            :class="[item.caption ? '!opacity-100' : '', browserEnv == BROWSER_ENV.mobile && 'pointer-events-none']">
            <div class="bg-white px-2 py-1.5 text-[14px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06)] rounded-[8px]">
                <div class="caption_container-wrap">
                    <editor-content :editor="caption" class="line-clamp-2 text-black min-w-[55px]" />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.widget_base-map {
    --widget-color: #000;
    --widget-color-bg: #fff;
    --widget-color-hover: #fbfbfb;
    --widget-color-active: #efefef;
    --widget-color-bg-current: var(--widget-color-bg);
    position: relative;
    display: flex;
    width: 100%;
    overflow: hidden;
    height: 100%;
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
    border-radius: 20px;
    background-color: var(--widget-color-bg);
    white-space: break-spaces;


    .prevent {
        background-color: transparent;
        border-radius: 20px;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        display: flex;
        justify-content: center;
        align-items: center;

        &.pointer-events {
            pointer-events: auto;
        }
    }

    .map-container {
        position: relative;

        &.not-Editor {
            &:before {
                content: '';
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: 99;
                background: transparent;
                pointer-events: none;
            }
        }

        .amap-center {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: auto;
        }
    }

    .caption_container {
        position: absolute;
        left: 0;
        bottom: 0;
        max-width: 100%;
        padding: 1rem;
        transition-property: opacity;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 0.2s;
        opacity: 0;

        &:hover {
            opacity: 1;
        }

        .caption_container-wrap {
            position: relative;
            z-index: 20;
            margin: -0.5rem;
            cursor: text !important;
            padding: 0.5rem;

            .line-clamp-2 {
                -webkit-line-clamp: 2;
            }

            .line-clamp-1,
            .line-clamp-2 {
                overflow: hidden;
                display: -webkit-box;
                -webkit-box-orient: vertical;
            }
        }
    }
}

:deep(.ProseMirror) {
    outline: 2px solid transparent;
    outline-offset: 2px;

    .is-empty {
        position: relative;
    }

    .is-empty:before {
        content: attr(data-placeholder);
        pointer-events: none;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        white-space: nowrap;
        opacity: 0.3;
    }
}

.rela {
    position: relative;
}

.amap-animation {
    .image-cloud {
        position: absolute;
        width: 442px;
        height: 456px;
        left: -442px;
    }

    .image-plane {
        position: absolute;
        width: 85px;
        height: 85px;
        left: -85px;
        bottom: -85px;
    }
}
</style>
<style>
/* 隐藏版权 */
.amap-logo,
.amap-copyright {
    display: none !important;
}

@keyframes styles_marker-pulse__BxsPp {
    0% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1
    }

    35% {
        transform: translate(-50%, -50%) scale(8);
        opacity: 0
    }

    to {
        transform: translate(-50%, -50%) scale(8);
        opacity: 0
    }
}

.styles_marker__Mzm27 {
    box-shadow: 0 16px 31px rgba(0, 0, 0, .13), 0 10.3704px 18.1551px rgba(0, 0, 0, .099), 0 6.16296px 9.87407px rgba(0, 0, 0, .079), 0 3.2px 5.0375px rgba(0, 0, 0, .065), 0 1.3037px 2.52593px rgba(0, 0, 0, .051), 0 .296296px 1.21991px rgba(0, 0, 0, .031)
}

.styles_marker-pulse__BxsPp {
    animation: styles_marker-pulse__BxsPp 4s ease-out infinite
}

.styles_marker-border__fxi6v {
    background: linear-gradient(0deg, hsla(0, 0%, 100%, 0), hsla(0, 0%, 100%, .12))
}
</style>
