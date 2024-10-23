<template>
    <div class="box" :key="item.id" :class="{ isCrop: item.cropStatus }" :id="`w_img${item.id}`" ref="mediaContent">
        <video @touchstart="touchStart" @mousedown="startDrag"
            v-if="(item._tempUrl || item.screenshotUrl) && item.variant === MEDIA_TYPE.video"
            :src="item._tempUrl || item.screenshotUrl" loop autoplay muted playsinline
            class="box_img rounded-[inherit] object-cover min-h-full min-w-full" :style="{
                transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
                maxWidth: 'unset',
                maxHeight: 'unset',
                minWidth: '100%',
                minHeight: '100%',
                width: getImageWH?.w + 'px',
                height: getImageWH?.h + 'px',
                touchAction: item.cropStatus ? 'none' : 'auto'
            }" ref="clipImage" draggable="false"></video>
        <img @touchstart="touchStart" @mousedown="startDrag"
            v-if="(item._tempUrl || item.screenshotUrl) && item.variant === MEDIA_TYPE.image"
            :src="item._tempUrl || item.screenshotUrl"
            class="box_img rounded-[inherit] object-cover min-h-full min-w-full" draggable="false" ref="clipImage"
            :style="{
                transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
                maxWidth: 'unset',
                maxHeight: 'unset',
                minWidth: '100%',
                minHeight: '100%',
                width: getImageWH?.w + 'px',
                height: getImageWH?.h + 'px',
                touchAction: item.cropStatus ? 'none' : 'auto'
            }" />
        <!-- transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
          width: '100%', -->
        <div v-show="item.cropStatus" class="box_mask" data-positioning-container="true" :style="{
            width: getImageWH?.w + 'px',
            height: getImageWH?.h + 'px',
            top: '50%',
            left: '50%',
            zIndex: 10,
            transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
        }">
            <canvas :id="`w_ctx${item.id}`" :style="{
                width: getImageWH?.w + 'px',
                height: getImageWH?.h + 'px',
            }" class="myCanvas" :width="getImageWH?.w" :height="getImageWH?.h"></canvas>
        </div>

        <div class="box_border" v-if="item.cropStatus"></div>

        <div class="pc_content_mask" v-if="item.cropStatus && env == 'desktop'" @click="onFinish"></div>
        <div class="mobile_content_mask" v-if="item.cropStatus && env == 'mobile' && browserEnv == 'desktop'"
            @click="onFinish"></div>
    </div>
</template>

<script setup lang="ts">
// import { _widgetStore } from '~~/store/widget'
import { MEDIA_TYPE, type IUserAppItem, BROWSER_ENV } from '@beetr/constant'
import { ref, reactive, watch, computed, toRefs, onMounted, nextTick } from 'vue'
// import { _envStore } from '~/store/env'
const emit = defineEmits(['isCrop', 'onFinish'])

const props = defineProps<{
    item: IUserAppItem
    browserEnv: keyof typeof BROWSER_ENV,
    env: keyof typeof BROWSER_ENV,
}>()
const imgRect = reactive({
    width: 0,
    height: 0
})
const position = reactive({
    x: 0,
    y: 0
})

let { item } = toRefs(props)


let isDragging = false
const initialMouseX = ref(0)
const initialMouseY = ref(0)

const clipImage = ref<HTMLImageElement | null>(null)

const getImageDimensions = (): Promise<{ width: number, height: number }> => {
    return new Promise((resolve, reject) => {
        const el = clipImage.value as any
        if (el.tagName == 'VIDEO') {
            el.onloadedmetadata = function () {
                resolve({ width: el.videoWidth, height: el.videoHeight });
            }
        } else {
            el.onload = function () {
                resolve({ width: el.naturalWidth, height: el.naturalHeight });
            }
        }
        el.onerror = function () {
            reject(new Error(el.tagName + ' load failed'));
        };
    });
}

onMounted(async () => {
    if (!clipImage.value) return
    const { width, height } = await getImageDimensions()
    imgRect.width = width
    imgRect.height = height
    const w = item.value.cusStyle[props.env].w
    const h = item.value.cusStyle[props.env].h / 2
    emit('isCrop', !(w / h == imgRect.width / imgRect.height))
    preDrawMask()
})


const mediaContent = ref<HTMLDivElement | null>(null)

const getBoxContent = () => {


    if (props.browserEnv == BROWSER_ENV.desktop) {
        const margin = (props.env === BROWSER_ENV.mobile ? 10 : 15)
        const { w, h } = item.value.cusStyle[props.env]
        const base_px = props.env == BROWSER_ENV.desktop ? 105 : 428 / 4
        return {
            width: (base_px * w) * 2 - margin * 2,
            height: (base_px * h) - margin * 2
        }
    }

    if (mediaContent.value) {
        const { width, height } = mediaContent.value.getBoundingClientRect()
        return {
            width,
            height,
        }
    }
    return {
        width: 0,
        height: 0,
    }
}
const touchStart = (event: TouchEvent) => {
    if (!item.value.cropStatus) return
    const payload = event.touches[0]
    isDragging = true
    initialMouseX.value = payload.clientX - position.x
    initialMouseY.value = payload.clientY - position.y
    addEventListener('touchmove', touchMove)
    addEventListener('touchend', touchEnd)
}
const touchMove = ($event: TouchEvent) => {
    const event = $event.touches[0]

    onDrag(event)
}

const touchEnd = ($event: TouchEvent) => {
    isDragging = false
}

const onDrag = (event: MouseEvent | Touch) => {
    if (!isDragging) return
    const rect = clipImage.value?.getBoundingClientRect()!

    /** 当宽度小于高度时，进行Y轴移动 */
    const { width, height } = getBoxContent()

    if (rect.width == width && height < rect.height) {
        let offsetY = event.clientY - initialMouseY.value
        const maxY = (rect!.height - height) / 2
        if (offsetY > maxY) {
            position.y = maxY
        } else if (offsetY < -maxY) {
            position.y = -maxY
        } else {
            position.y = offsetY
        }
        /** 当宽度大于高度时，进行X轴移动 */
    } else if (rect.height == height && width < rect.width) {
        let offsetX = event.clientX - initialMouseX.value
        const maxX = (rect!.width - width) / 2
        if (offsetX > maxX) {
            position.x = maxX
        } else if (offsetX < -maxX) {
            position.x = -maxX
        } else {
            position.x = offsetX
        }
    }
    requestAnimationFrame(() => drawMask())
}

function startDrag(event: MouseEvent) {
    if (!item.value.cropStatus) return
    isDragging = true
    initialMouseX.value = event.clientX - position.x
    initialMouseY.value = event.clientY - position.y
    addEventListener('mousemove', drag)
    addEventListener('mouseup', stopDrag)
}

function drag(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    onDrag(event)
}

function stopDrag(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    isDragging = false
}

const drawMask = () => {
    const { w, h } = getImageWH.value
    if (!w || !h) return
    const cornerRadius = 24
    const canvas = document.getElementById(`w_ctx${props.item.id}`) as HTMLCanvasElement
    const ctx = canvas.getContext('2d')!
    ctx.save()

    ctx.fillStyle = 'rgba(0,0,0,0)' // 透明
    ctx.clearRect(0, 0, w, h)

    ctx.fillStyle = 'rgba(255,255,255,0.6)' // 半透明白色
    ctx.fillRect(0, 0, w, h) // 填充整个Canvas

    // // 清除中间区域的遮罩
    // // 绘制圆角矩形路径并设置为剪切路径

    const { width, height } = getBoxContent()
    // const width = 380,height = 180
    const x = (w - width) / 2 - position.x,
        y = (h - height) / 2 - position.y
    ctx.beginPath()
    ctx.moveTo(x + cornerRadius, y)
    // 左 -> 右
    ctx.lineTo(x + width - cornerRadius, y)
    ctx.arcTo(x + width, y, x + width, y + cornerRadius, cornerRadius)
    // 右 -> 下
    ctx.lineTo(x + width, y + height - cornerRadius)
    ctx.arcTo(x + width, y + height, x + width - cornerRadius, y + height, cornerRadius)

    // 下 -> 左
    ctx.lineTo(x + cornerRadius, y + height)
    ctx.arcTo(x, y + height, x, y + height - cornerRadius, cornerRadius)
    // 左 -> 上
    ctx.lineTo(x, y + cornerRadius)
    ctx.arcTo(x, y, x + cornerRadius, y, cornerRadius)

    ctx.closePath()
    ctx.clip()
    ctx.clearRect(x, y, width, height)
    ctx.restore()
}
const getImageWH = computed(() => {
    if (!clipImage.value || !mediaContent.value) {
        return {
            h: 0,
            w: 0,
        }
    }

    const naturalW = imgRect.width
    const naturalH = imgRect.height
    const w = item.value.cusStyle[props.env].w
    const h = item.value.cusStyle[props.env].h / 2

    const { width, height } = getBoxContent()
    if (w <= h) {
        return {
            h: height,
            w: height * (naturalW / naturalH),
        }
    } else {
        return {
            h: (width / naturalW) * naturalH,
            w: width,
        }
    }
})

const getXYRadio = () => {
    const { radioX, radioY } = calculateRadio()
    return {
        x: position.x / radioX || 0,
        y: position.y / radioY || 0,
    }
}

const calculateRadio = () => {
    const { w, h } = getImageWH.value
    const { width, height } = getBoxContent()
    const radioX = (w - width) / 2
    const radioY = (h - height) / 2
    return {
        radioX,
        radioY
    }
}
const getParams = () => {
    return {
        ...item.value,
        cropStatus: false,
        cut: {
            ...item.value.cut,
            [props.env]: getXYRadio()
        }
    }
}

const finishCrop = async () => {

    if (isDragging) {
        return
    }
    const params = getParams()
    // await widgetStore.onUpdate([params])

}
const onFinish = async () => {
    await finishCrop()
    emit('onFinish', getParams(), false)
}

const preDrawMask = () => {
    // await nextTick()
    const { w, h } = getImageWH?.value
    /** 当宽度小于高度时，进行Y轴移动 */
    const { width, height } = getBoxContent()

    if (!w || !width || !height || !h) return
    const { radioX, radioY } = calculateRadio()
    if (w == width && height < h) {
        position.x = 0
        position.y = item.value.cut[props.env]?.y * radioY || 0
    } else {
        position.x = item.value.cut[props.env]?.x * radioX || 0
        position.y = 0
    }
    console.log(position, item.value.cut);

}
const excuteAnimation = () => {
    let keyframes = document.getElementsByClassName('expandStyleSheet')[0]
    const ani = `@keyframes expand {
    0% {
        width:0;
        height:0;
      }
  
    }`
    const el = clipImage.value as HTMLImageElement | HTMLVideoElement
    if (!keyframes) {
        keyframes = document.createElement('style');
        keyframes.classList.add('expandStyleSheet')
    }
    keyframes.innerHTML = ani
    if (!document.getElementsByClassName('expandStyleSheet')[0]) {
        document.head.appendChild(keyframes);
    }
    el.style.animation = 'expand .5s linear '
    // el.
    setTimeout(() => {
        el.style.animation = ''
    }, 600)
}

// watchEffect(() => {
//     setTimeout(() => {
//         preDrawMask()
//         nextTick(() => {
//             drawMask()
//         })
//     })
// });


watch(
    () => props.item.cusStyle[props.env],
    async (newval, oldval) => {
        if (newval.w == oldval.w && newval.h == oldval.h) return
        // console.log(props.item.cusStyle[props.env], el.clientWidth, el.clientHeight);
        // console.log(getBoxContent());
        setTimeout(() => {
            preDrawMask()
            nextTick(() => {
                drawMask()
            })
        })

    },

)
watch(() => props.env, () => {
    setTimeout(() => {
        console.log(1);
        preDrawMask()
    }, 300)
})

watch(() => props.item.cut, () => {
    console.log(props.item);
    // setTimeout(() => {
    preDrawMask()
    // }, 300)

},
    {
        deep: true,

    }
)
watch(
    () => props.item.cropStatus,
    async (status, old) => {

        if (!status && old) {
            await onFinish()
            return
        }
        nextTick(() => {
            if (props.env != BROWSER_ENV.mobile) {
                excuteAnimation()
            }
            drawMask()
        })
    }
)


defineExpose({ getXYRadio, })
</script>

<style lang="scss" scoped>
.box {
    width: 100%;
    position: relative;

    height: 100%;
    /* clip-path: inset(0 round 24px); */
    border-radius: 24px;
    clip-path: inset(0px round 24px);
}

.box.isCrop {
    clip-path: none;
}

.box_img {
    position: absolute;
    top: 50%;
    left: 50%;

    user-select: none;
    border-radius: inherit;
    z-index: 8;
}

.isCrop .box_img {
    cursor: move;

}

.box_border {
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    border-width: 2px;
    border-style: solid;
    border-color: #000;
    opacity: 1;
    transition: border 0.2s ease-in-out, opacity 0.2s ease-in-out;
    border-radius: inherit;
    z-index: 20;
}

.box_mask {
    position: absolute;
    top: 0;
    right: 0;
    pointer-events: none;
    // animation: expand 1s ease-in-out;
    //border-radius: inherit;
}


.myCanvas {
    //  position: fixed;

    width: 100%;
    border-radius: 24px;

    //box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 0px 1px inset;
    //border-radius: inherit;
}

.pc_content_mask {
    position: fixed;
    background-color: rgba(255, 255, 255, 0.2);
    /* 半透明背景 */
    backdrop-filter: blur(10px);
    /* 背景模糊 */
    -webkit-backdrop-filter: blur(10px);
    /* 兼容老版本 Safari */
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 7;
}

.mobile_content_mask {
    position: fixed;
    background-color: rgba(255, 255, 255, 0.2);
    /* 半透明背景 */
    backdrop-filter: blur(10px);
    /* 背景模糊 */
    -webkit-backdrop-filter: blur(10px);
    /* 兼容老版本 Safari */
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 7;
}
</style>