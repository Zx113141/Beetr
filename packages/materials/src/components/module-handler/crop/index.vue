<template>
    <el-tooltip :visible="visible" effect="dark" content="Fits perfectly already" placement="bottom">
        <button
            class="styles_style-button__5wkxt rounded-[4px] outline-none disabled:text-white/40 not-disabled:active:scale-90 bg-action-green text-white"
            @click="switchCropStatus" :class="{
                active: item.cropStatus ? true : false,
                disabledBtn: disabled,
            }" @mouseenter="mouseEnter" @mouseleave="visible = false" style="padding: 0.25rem;">
            <SvgCrop></SvgCrop>
        </button>
    </el-tooltip>

</template>

<script lang="ts" setup>
import { type IUserAppItem, SvgCrop, BROWSER_ENV } from '@beetr/constant'
import { ref, reactive, PropType, onMounted, watchEffect, inject } from 'vue'
const visible = ref(false)
const disabled = ref(false)
const imgRect = reactive({
    width: 0,
    height: 0
})
const deviceEnv = inject<keyof typeof BROWSER_ENV>('deviceEnv')!

const props = defineProps({
    item: {
        type: Object as PropType<IUserAppItem>,
        required: true,
    },
     
})
const getImageDimensions = (url: string): Promise<{ width: number, height: number }> => {
    return new Promise((resolve, reject) => {
        let el = null
        if (props.item.variant == 'image') {
            el = new Image();
        } else {
            el = document.createElement('video')
        }
        if (el.tagName == 'VIDEO') {
            el.onloadedmetadata = function () {
                resolve({ width: el.videoWidth, height: el.videoHeight });
                el.remove()
            }
        } else {
            el.onload = function () {
                resolve({ width: el.naturalWidth, height: el.naturalHeight });
                el.remove()
            }
        }
        el.onerror = function () {
            reject(new Error(el.tagName + ' load failed'));
        };
        el.src = url; // 设置图片源以便开始加载
    });
}

onMounted(async () => {
    const { width, height } = await getImageDimensions(props.item.screenshotUrl)
    imgRect.width = width
    imgRect.height = height
})

watchEffect(() => {
    const w = props.item.cusStyle[deviceEnv].w
    const h = props.item.cusStyle[deviceEnv].h / 2
    disabled.value = w / h == imgRect.width / imgRect.height
    if (disabled.value) {
        emit('onCrop', false)
    }
});



const mouseEnter = () => {
    if (disabled.value) {
        visible.value = true
    }
}

const switchCropStatus = () => {
    if (disabled.value) {
        return
    }

    emit('onCrop', !Boolean(props.item.cropStatus))
}
const emit = defineEmits(['onCrop'])
</script>

<style lang="scss" scoped>
.active {
    background: #4edd76 !important;
    color: white !important;
}

.disabledBtn {
    color: hsla(0, 0%, 100%, .4) !important;
}
</style>