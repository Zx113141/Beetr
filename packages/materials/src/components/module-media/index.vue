<script setup lang="ts">
import type { UploadFile, UploadProgressEvent } from 'element-plus'
import { ElNotification, ElProgress } from 'element-plus'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { SvgArrow, BROWSER_ENV, MEDIA_TYPE, UPLOAD_TYPE, IUserAppItem, TOKEN_CREDENTIALS, EDIT_TYPE } from '@beetr/constant'
import { debounce } from '@beetr/hooks'
import UploadMedia from '../module-media-upload/index.vue'
// import type { IUserAppItem } from '~/api/widget'
// import { _widgetStore } from '~~/store/widget'
// import { _userStore } from '~~/store/user'
// import { _envStore } from '~/store/env'
import { toRefs, reactive, ref, computed, watch, inject, onMounted } from 'vue'
// import service from '~/utils/request2'
// import baseUrl from '~~/utils/env'
import ModuleWidgetCrop from './module-crop/index.vue'
import { uploadFileUrl } from '~/api/widget/widget'
const deviceEnv = inject<keyof typeof BROWSER_ENV>('deviceEnv',)!
// const browserEnv = inject<keyof typeof BROWSER_ENV>('browserEnv',)!
const isEdit = inject<boolean>('editStatus')
const isMovingWidget = inject("movingWidgetId");
const props = defineProps<{
    item: IUserAppItem
    isLoading: boolean
}>()
let { item } = toRefs(props)

const progress = reactive({
    show: false,
    percent: 0,
})
const showRichText = ref(false)
const triggerRef = ref<HTMLDivElement | null>(null)
const auth = useCookie(TOKEN_CREDENTIALS)
const allowCrop = computed(() => {
    return item.value?.screenshotUrl !== 'undefined' && progress.show == false
})


// TODO optim

/** 用户名称 🎉 */
const caption = useEditor({
    content: item.value?.caption,
    editable: !!isEdit,
    extensions: [
        StarterKit,
        Placeholder.configure({
            placeholder: '标题',
        }),
    ],
    // 监听编辑器任何变化
    onUpdate: debounce(({ editor }: any) => {
        const caption = editor.getHTML()
        console.log('caption.onUpdate', caption, item.value?.caption)
        if (caption === item.value?.caption) return
        item.value.caption = caption
        if (!editor.getText()) {
            item.value.caption = ''
        }
        emits('onEdit', item.value)
    }, 500),
    onFocus() {
        onUpdate.value = true
    },
    onBlur() {
        onUpdate.value = false
    },
})

const onUpdate = ref(false)

const showMessage = () => {
    ElNotification({
        title: '提示',
        message: '嘿，请排排队，前面还有没上传完的媒体文件😄',
        type: 'warning',
    })
}
/**
 * onStart
 * @uid 临时文件的idMEDIA_TYPE
 * @fileUrl 临时文件的路径
 */
const uploadMediaRef = ref<any>(null)
const emits = defineEmits(['onEdit'])
// 这个只是用于预览
const onBefore = (variant: keyof typeof MEDIA_TYPE, fileUrl: string) => {
    // item.value._tempUrl = fileUrl
    // item.value.variant = variant
}
const onStart = (variant: keyof typeof MEDIA_TYPE) => {
    console.log('onStart', variant)
    // progress show
    progress.show = true
    if (item.value.temType) {
        // 老板说先去掉，不显示默认图片了
        item.value.screenshotUrl = ''
        item.value.variant = variant
        return
    }
    if (variant !== item.value.variant) {
        ElNotification({
            title: '提示',
            message: '类型不匹配',
            type: 'warning',
        })
        uploadMediaRef.value.cancelUpload()
        progress.show = false
        return
    }
    if (item.value.screenshotUrl) {
        // service({
        //     url: baseUrl + '/jeecg-boot/app/utils/aliOssDelete',
        //     method: 'post',
        //     data: {
        //         fileUrl: item.value.screenshotUrl,
        //     },
        // })
    }
}

/** 上传进度 */
const onProgress = (evt: UploadProgressEvent, _uploadFile: UploadFile) => {
    progress.percent = evt.percent

}
const onError = () => {
    emits('onEdit', item.value, EDIT_TYPE.remove)
}
/** 上传成功 */
const onSuccess = (
    response: { code: number; message: string },
    _uploadFile: UploadFile,
    variant: keyof typeof MEDIA_TYPE
) => {
    // emits('closeLoading')
    progress.show = false
    // item.value.processing = false
    // item.value._percent = 0
    progress.percent = 0
    if (response?.code !== 1) {
        // emits('delete', item.value)
    } else {
        item.value.screenshotUrl = response.message
        item.value._tempUrl = ''
        item.value.variant = variant
        if (item.value.temType) {
            emits('onEdit', {
                ...item.value,
                temType: ''
            })
            return
        }
        emits('onEdit', item.value)
    }
}
const visitJump = () => {
    if (isEdit || !item.value.url) return
    window.open(item.value.url)
}

const uploadMediaType = computed(() => {
    // todo 临时块怎么处理
    if (item.value!.temType) {
        return UPLOAD_TYPE.media
    }
    return item.value!.variant === MEDIA_TYPE.image ? UPLOAD_TYPE.img : UPLOAD_TYPE.video
})


onMounted(() => {
    if (!allowCrop.value && !item.value.temType) {
        // console.log(triggerRef.value!);
        triggerRef.value!.click()
    }
})

// 监听更新
watch(
    () => item.value.caption,
    (val) => {
        if (onUpdate.value) return
        console.log('监听更新 - 需要做来源空值', val)
        // 清理内容
        caption.value!.commands.clearContent()
        caption.value!.commands.setContent(val || '')
        caption.value!.commands.blur()
    }
)
watch(
    () => props.item._percent,
    (percent) => {
        if (+percent) {
            progress.show = true
            progress.percent = +percent
        } else if (percent == 'done:ok') {
            progress.show = false
            progress.percent = 0
        }
    },
    {
        deep: true,
    }
)

</script>

<template>
    <div class="widget_base-media" :class="[
        `widget_base-${item.cusStyle[deviceEnv].w}x${item.cusStyle[deviceEnv].h}`,
        isMovingWidget === `w_${item.id}` ? 'pointer-events-none' : '',
    ]" :style="`
          border:${item.temType ? '0' : ''};overflow:${deviceEnv == 'desktop' ? 'none' : 'hidden'}`" @click="visitJump"
        @mouseover="showRichText = true">
        <div class="prevent" v-if="item.temType && !progress.show" @drag.stop @touchstart.stop @mousedown.stop>
            <div>
                <div class="icon">
                    <img src="@/assets/images/button_bk-1.png" class="svg" alt="" />
                </div>
                <div class="words">添加图片 & 视频</div>
            </div>
            <img src="./add.png" class="addpng" alt="" />
        </div>
        <!-- 视频、图片显示 -->
        <upload-media ref="uploadMediaRef" :type="uploadMediaType" class="w-full h-full rela"
            @on-preview="(e: string) => item.screenshotUrl = e" :auto-upload="true" :disabled="!isEdit || (deviceEnv == BROWSER_ENV.mobile && !item.temType) || item.cropStatus
                " :item="item" @on-before="onBefore" @on-success="onSuccess" @on-progress="onProgress"
            @on-start="onStart" @on-error="onError" :action="uploadFileUrl" :auth="auth">
            <div class="absolute inset-0 rounded-[inherit]" ref="triggerRef">
                <module-widget-crop :item="item" :isLoading="props.isLoading" :allowCrop="allowCrop"
                    @onFinish="(item) => emits('onEdit', item)"></module-widget-crop>
            </div>
        </upload-media>

        <!-- 进度条 -->
        <el-progress v-if="progress.show" class="init_progress !absolute left-6 top-6" :show-text="false" :width="18"
            :stroke-width="2" color="#ffffff" type="circle" :percentage="progress.percent" />
        <!-- 富文本 - 手机端禁止编辑 -->
        <!-- (isEdit && !item.caption) && !item.temType -->
        <div v-if="(showRichText && isEdit) || item.caption" class="caption_container" :class="[
            item.caption ? '!opacity-100' : '',
            deviceEnv == BROWSER_ENV.mobile && 'pointer-events-none',
        ]">
            <div class="bg-white px-2 py-1.5 text-[14px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06)] rounded-[8px]">
                <div class="caption_container-wrap">
                    <editor-content :editor="caption" class="line-clamp-2 text-black min-w-[55px]" />
                </div>
            </div>
        </div>
        <!-- 存在链接时显示箭头 -->
        <div v-if="item.url"
            class="absolute top-[14px] right-[14px] flex items-center justify-center rounded-full bg-black/20 backdrop-blur-[8px] w-[22px] h-[22px]">
            <SvgArrow></SvgArrow>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.widget_base-media {
    --widget-color: #000;
    --widget-color-bg: #fff;
    --widget-color-hover: #fbfbfb;
    --widget-color-active: #efefef;
    --widget-color-bg-current: var(--widget-color-bg);
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    // border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
    border-radius: 24px;
    background-color: var(--widget-color-bg);
    white-space: break-spaces;

    // transition: box-shadow 0.2s ease-in-out, transform 0.24s cubic-bezier(0.43, 0.01, 0.29, 1),
    //   background 0.2s cubic-bezier(0.43, 0.01, 0.29, 1), opacity 0.24s ease-in-out,
    //   filter 0.24s ease-in-out;

    .init_progress {
        :deep(.el-progress-circle__track) {
            stroke: #000;
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

.prevent {
    // @include background_color('moduleBlockBackgrouundColor');

    border-radius: 20px;
    border: 2px dashed rgba(0, 0, 0, 0.08);
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    //z-index: 99;

    .icon {
        width: 24px;
        height: 24px;
        opacity: 1;
        border-radius: 8px;
        margin: 0 auto;
        background: rgba(0, 199, 151, 1);
        display: flex;
        align-items: center;
        justify-content: center;

        .svg {
            border-radius: 8px;
            width: 100%;
            height: 100%;
        }
    }

    .words {
        font-size: 14px;
        font-weight: 500;
        letter-spacing: 1px;
        line-height: 20.27px;
        // @include font_color('moduleBlockColor');
        margin-top: 3px;
    }

    .addpng {
        position: absolute;
        top: 22px;
        right: 22px;
        width: 14px;
    }
}


// 媒介查询适配 *************************
// 媒介查询适配 *************************</style>
