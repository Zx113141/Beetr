<template>
    <div class=" bg-container2 text-primary5">
        <ModuleMobileDrawerHeader :browserEnv="browserEnv" @close="back" @finish="beforeClose">
        </ModuleMobileDrawerHeader>
        <div class="content">
            <div class="title">预览图片</div>
            <!-- 视频、图片显示 -->
            <div class="mb-2 relative">
                <div class="relative flex flex-col items-center justify-center rounded-[12px] min-h-full min-w-full bg-[#F7F7F7] p-4 "
                    style="overflow: hidden;">
                    <div :style="{
                        width: getImageWH.width + 'px',
                        height: getImageWH.height + 'px'
                    }" ref="getImage">
                        <!-- <video v-if="(editData.screenshotUrl) && editData.variant === MEDIA_TYPE.video"
                            :src="editData.screenshotUrl" loop autoplay muted playsinline
                            class="rounded-[inherit] object-cover preview-media"></video>
                        <img v-if="(editData.screenshotUrl) && editData.variant === MEDIA_TYPE.image"
                            :src="editData.screenshotUrl" class="rounded-[inherit] object-cover preview-media"
                            draggable="false" /> -->
                        <MoudleWidgetCrop :cropStatus="cropStatus" ref="moduleCrop" :item="editData" :env="browserEnv"
                            @isCrop="(e: boolean) => isAllowCrop = e"
                            @onFinish="(item: IUserAppItem) => editData = item" :allowCrop="isAllowCrop">
                        </MoudleWidgetCrop>
                    </div>
                </div>

                <div class="btn upload-btn">

                    <upload-media v-if="!editData.cropStatus" ref="uploadMediaRef"
                        :type="editData.variant == MEDIA_TYPE.image ? UPLOAD_TYPE.img : UPLOAD_TYPE.video"
                        class="relative w-full h-full" :item="editData" @on-success="onSuccess"
                        @on-progress="onProgress" @on-start="onPreview" :auth="auth" :action="action">
                        <el-button type="success" class="relative greenBtn flex-1">
                            <span> {{ editData.variant == MEDIA_TYPE.image ? '上传图片' : '上传视频' }} </span>
                            <text class="text-xs text-white">（建议1200x630）</text>
                        </el-button>
                    </upload-media>

                    <el-button v-if="isAllowCrop" @click="handleCrop" :class="{
                        relative: true,
                        'crop-btn': true,
                        'greenBtn': editData.cropStatus ? true : false,
                        'el-button--success': editData.cropStatus ? true : false,
                    }">
                        <SvgCrop></SvgCrop>
                    </el-button>
                </div>
                <!-- 进度条 -->
                <el-progress v-if="progress.show" class="init_progress !absolute left-6 top-6" :show-text="false"
                    :width="18" :stroke-width="2" color="#ffffff" type="circle" :percentage="progress.percent" />
            </div>
            <div class="title">图片描述</div>
            <div class="inpArea section w-full min-h-[44px]">
                <!-- <input v-model="editData.caption" type="text" placeholder="请输入描述内容"/> -->
                <div class="section_container">
                    <editor-content :editor="content" />
                </div>
            </div>
            <div class="title">图片链接</div>
            <div class="inpArea">
                <input v-model="editData.url" type="text" placeholder="输入或复制链接" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { toRefs, computed, ref, reactive } from 'vue'
import { BROWSER_ENV, IUserAppItem, MEDIA_TYPE, UPLOAD_TYPE, SvgCrop, TOKEN_CREDENTIALS } from '@beetr/constant'
import ModuleMobileDrawerHeader from '../module-mobile-drawer-header/index.vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { debounce } from '@beetr/hooks'
import { UploadProgressEvent, UploadFile } from 'element-plus'
import MoudleWidgetCrop from './module-crop/index.vue'

import UploadMedia from '../module-media-upload/index.vue'
const auth = useCookie(TOKEN_CREDENTIALS)
const action = import.meta.env.VITE_API_URL + '/jeecg-boot/app/utils/aliOssUpload'
const props = defineProps<{
    prop: any,
    browserEnv: keyof typeof BROWSER_ENV | undefined,
    data: IUserAppItem,
}>()
const emit = defineEmits(['finish', 'close'])
const editData = ref(props.data)
const cropStatus = ref(!!editData.value.cropStatus)
const isAllowCrop = ref(true)
const getImageWH = computed(() => {
    const base = 160
    const { w, h } = editData.value.cusStyle[props.browserEnv!]
    return {
        width: base * w,
        height: (base * h) / 2
    }
})
const progress = reactive({
    show: false,
    percent: 0
})
/** 编辑器 **/
const content = useEditor({
    content: props.data.content,
    editable: true,
    extensions: [
        StarterKit,
        Placeholder.configure({
            placeholder: '添加标题...',
        }),
    ],
    onUpdate: debounce(({ editor }: any) => {
        const content = editor.getHTML()
        editData.value.content = content
    }, 500)
})

const beforeClose = () => {

    emit('finish', {
        ...editData.value,
        cropStatus: !editData.value.cropStatus
    })
}

const back = () => {
    emit('close', false)
}
const handleCrop = () => {
    cropStatus.value = !cropStatus.value
    // editData.value.cropStatus = !editData.value.cropStatus
}

const onProgress = (evt: UploadProgressEvent, _uploadFile: UploadFile) => {
    progress.percent = evt.percent

}
const onPreview = (_temlUrl: string) => {
    editData.value.screenshotUrl = _temlUrl
}

/** 上传成功 */
const onSuccess = (
    response: { code: number; message: string },
    _uploadFile: UploadFile,
    variant: MEDIA_TYPE
) => {
    progress.show = false
    progress.percent = 0
    if (response?.code !== 1) {
    } else {
        editData.value.screenshotUrl = response.message
        editData.value.variant = variant
        editData.value.temType = ''
    }
}


</script>

<style lang="scss" scoped>
.content {
    .upload-btn {
        margin-top: 6px;
        margin-bottom: 6px;
        display: flex;
        align-items: center;
        column-gap: 16px;
        justify-content: flex-end;

        .el-button {
            height: 42px;
        }

        span {
            font-size: 14px;
            color: rgba(255, 255, 255, 1);
        }

        .crop-btn {
            width: 50px;
            background-color: #fff;
        }

    }
}

.inpArea {
    width: 100%;
    height: 50px;
    border-radius: 10px;
    background: rgba(247, 247, 247, 1);
    margin-bottom: 11px;
    padding-left: 12px;
    display: flex;
    align-items: center;
    box-sizing: border-box;

    &.h-auto {
        height: auto;
    }

    input {
        font-size: 14px;
        outline: none;
        width: 100%;
        background-color: transparent;
    }
}

.content {
    padding: 20px 30px 0 27px !important;
    // @include font_color('drawerBodyColor');
}

.section {
    position: relative;
    display: flex;
    width: 100%;
    white-space: break-spaces;
    -webkit-tap-highlight-color: transparent;
    // transition: box-shadow 0.2s ease-in-out, transform 0.24s cubic-bezier(0.43, 0.01, 0.29, 1),
    //   background 0.2s cubic-bezier(0.43, 0.01, 0.29, 1), opacity 0.24s ease-in-out,
    //   filter 0.24s ease-in-out;
    padding: 1rem;
    font-size: 1.125rem;
    line-height: 1.75rem;

    .section_container {
        border-radius: 10px;
        width: 100%;
        position: relative;
        z-index: 20;
        cursor: text !important;
        font-size: 14px;

        &:hover {
            //@include background_color('hoverBackgroundColor');
            background-color: transparent;
        }
    }

    .noedit_section_container {
        &:hover {
            background-color: #fff;
        }
    }

    @media (min-width: 1280px) {
        .section_container {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
        }
    }
}
</style>