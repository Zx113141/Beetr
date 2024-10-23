<script setup lang="ts">
import { type UploadFile, type UploadProgressEvent, type UploadRawFile, ElNotification } from 'element-plus'
import { UPLOAD_TYPE, IMG_ACCEPT_FILES, VIDEO_ACCEPT_FILES, MEDIA_TYPE, TOKEN_CREDENTIALS } from '@beetr/constant'
// import { uploadFileUrl } from '~/api/widget/widget'
import { ref, computed } from 'vue'

const blobUrl = ref('')
const props = defineProps({
    /** 禁止上传 */
    disabled: {
        type: Boolean,
    },
    /** 接收的类型 */
    type: {
        type: String as () => UPLOAD_TYPE,
        default: UPLOAD_TYPE.img,
    },
    item: {
        type: Object,
        default: {}
    },
    autoUpload: {
        type: Boolean,
        default: true
    },
    action: {
        type: String,
        default: ''
    },
    auth: {
        type: String,
        default: ''
    }
})

/** 当前模式下的文件类型 */
const currentAcceptFiles = computed(() =>
    props.type === UPLOAD_TYPE.img ? IMG_ACCEPT_FILES : props.type === UPLOAD_TYPE.video ? VIDEO_ACCEPT_FILES : [...IMG_ACCEPT_FILES, ...VIDEO_ACCEPT_FILES]
)

/** 当前上传文件的类型 */
const currentMediaType = ref<keyof typeof MEDIA_TYPE>(MEDIA_TYPE.image)

const bytesToSize = (bytes: any) => {
    if (bytes === 0) return true;
    var k = 1000, // or 1024
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    let bol = true
    if (i > 2) {
        bol = false
    } else if (i == 2) {
        if (Number((bytes / Math.pow(k, i)).toPrecision(3)) > 50) {
            bol = false
        } else {
            bol = true
        }
    } else {
        bol = true
    }
    return bol
}
const uploadRef = ref<any>('')
const cancelUpload = () => {
    console.log(uploadRef.value)
    uploadRef.value.abort()
}

const check = (file: UploadRawFile) => {
    const typeTipMap = {
        [UPLOAD_TYPE.img]: '仅支持上传图片',
        [UPLOAD_TYPE.media]: '仅支持上传视频和图片',
        [UPLOAD_TYPE.video]: '仅支持上传视频',
    }
    if (!currentAcceptFiles.value.includes(file.type)) {
        ElNotification({
            title: '提示',
            message: typeTipMap[props.type],
            type: 'warning',
        })
        cancelUpload()
        return false
    }
    // console.log(file.size)
    let sizelimit = bytesToSize(file.size)
    if (!sizelimit) {
        ElNotification({
            title: '提示',
            message: "嘿，最多可上传50M的文件，你可以选择删除其他再上传！",
        })
        cancelUpload()
        return false
    }

    let limitSize = 5
    let fileType = '图片'
    if (VIDEO_ACCEPT_FILES.includes(file.type)) {
        limitSize = 100
        fileType = '视频'
        currentMediaType.value = MEDIA_TYPE.video
    } else if (IMG_ACCEPT_FILES.includes(file.type)) {
        limitSize = 5
        fileType = '图片'
        currentMediaType.value = MEDIA_TYPE.image
    }

    if (props.item && props.item.variant && props.item.variant != currentMediaType.value) {
        cancelUpload()
        ElNotification({
            title: '提示',
            message: '类型不匹配',
            type: 'warning',
        })
        return false
    }
    return true
}
/** 上传文件之前的钩子，参数为上传的文件， 若返回false或者返回 Promise 且被 reject，则停止上传。 */
const onBeforeUpload = (file: UploadRawFile) => {
    blobUrl.value = URL.createObjectURL(file)
    if (check(file)) {
        emit(
            'onBefore',
            VIDEO_ACCEPT_FILES.includes(file!.type) ? MEDIA_TYPE.video : MEDIA_TYPE.image,
            blobUrl.value
        )
        return true
    } else {
        return false
    }
}

/** 上传文件成功 */
const onSuccess = (response: any, uploadFile: UploadFile) => {
    if (response.code != 1) {
        ElNotification({
            title: '提示',
            message: response.message,
        })
    }
    URL.revokeObjectURL(blobUrl.value);
    emit('onSuccess', response, uploadFile, currentMediaType.value)
}

const onError = (res: any) => {
    URL.revokeObjectURL(blobUrl.value);
    emit('onError')

}

/** 上传进度 */
const onProgress = (evt: UploadProgressEvent, uploadFile: UploadFile) => {
    console.log(blobUrl.value);
    emit('onProgress', evt, blobUrl.value)
}

const submit = () => {
    uploadRef.value.submit()
}

const change = (uploadFile: UploadFile,) => {
    console.log('change', uploadFile);
    // 文件类型
    let variant = VIDEO_ACCEPT_FILES.includes(uploadFile.raw!.type) ? MEDIA_TYPE.video : MEDIA_TYPE.image
    // 如果不自动上传，则直接触发
    if (!props.autoUpload && uploadFile.status == 'ready') {

        return check(uploadFile.raw as UploadRawFile) && emit('onStart', variant)
    }
    // 自动上传预览
    if (bytesToSize(uploadFile.size) && (VIDEO_ACCEPT_FILES.includes(uploadFile.raw!.type) || IMG_ACCEPT_FILES.includes(uploadFile.raw!.type)) && uploadFile.status == 'ready') {
        // 创建一个FileReader实例
        emit('onStart', variant)
        const reader = new FileReader();

        // 当文件读取完毕后，reader.result将包含文件的数据URL
        reader.onload = function (event) {

            // 使用reader.result，也就是数据URL创建一个Blob对象
            const blob = new Blob([event.target!.result as BlobPart], { type: uploadFile.raw!.type });

            // 处理blob对象，例如可以用来创建一个新的URL指向这个Blob对象
            blobUrl.value = URL.createObjectURL(blob);

            emit('onPreview', blobUrl.value)
            // 使用blobUrl，例如下载或者作为图片源等
            // 注意：不要忘记在不需要的时候释放这个创建的URL
        };
        reader.readAsArrayBuffer(uploadFile.raw as File);
    }

}

const emit = defineEmits<{
    /** 主要对视频本地预览有用 */
    (e: 'onBefore', variant: keyof typeof MEDIA_TYPE, fileUrl: string): void
    (e: 'onStart', variant: keyof typeof MEDIA_TYPE): void
    (e: 'onSuccess', response: any, uploadFile: UploadFile, mediaType: keyof typeof MEDIA_TYPE): void
    (e: 'onProgress', evt: UploadProgressEvent, blobUrl: string): void
    (e: 'onPreview', blobUrl: string): void
    (e: 'onError'): void
    // (e: 'handleStart', mediaType: keyof typeof MEDIA_TYPE): void
}>()
defineExpose({ cancelUpload, submit })
</script>

<template>
    <el-upload :auto-upload="autoUpload" ref="uploadRef" class="init_upload" :accept="String(currentAcceptFiles)"
        :show-file-list="false" :disabled="props.disabled" :headers="{ 'X-Access-Token': auth }" :action="action"
        :before-upload="onBeforeUpload" :on-success="onSuccess" :on-error="onError" @change="change"
        :on-progress="onProgress">
        <slot>子组件插槽</slot>
    </el-upload>
    <!-- <video :src="currentFile" style="width: 200px; height: 200px" controls="controls" loop></video> -->
</template>
<style lang="scss" scoped>
.init_upload {
    :deep(.el-upload) {
        width: 100%;
        height: 100%;


    }
}
</style>
