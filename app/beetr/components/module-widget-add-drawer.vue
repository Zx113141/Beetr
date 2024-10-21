<template>
    <client-only>
        <el-drawer :scoped="false" v-model="addDrawData.show" :direction="direction" modal-class="editdrawer" title="编辑"
            :with-header="false">
            <div class="header">
                <div class="left"></div>
                <el-button type="success" style="width:90px" class="relative greenBtn"
                    @click="addDrawData.show = false">
                    <span>完成</span>
                </el-button>
            </div>
            <div class="content">
                <div class="addItems">
                    <div class="items" @click="onSetComplete()">
                        <img src="./images/1.png" alt="">
                        <span>链接</span>
                    </div>
                </div>
                <div class="addItems" @click="showAddSocial">
                    <img src="./images/2.png" alt="">
                    <span>社交</span>
                </div>
                <div class="addItems">
                    <div class="items" @click="emitAction('addSectionTitle')">
                        <img src="./images/3.png" alt="">
                        <span>标题</span>
                    </div>
                </div>
                <div class="addItems">
                    <upload-media ref="uploadImg" :auto-upload="false" :type="UPLOAD_TYPE.img" @on-success="onSuccess"
                        @on-progress="onProgress" @on-start="handleStart">
                        <div class="items">
                            <img src="./images/4.png" alt="">
                            <span>图片</span>
                        </div>
                    </upload-media>
                </div>
                <div class="addItems">
                    <upload-media ref="upload" :auto-upload="false" :type="UPLOAD_TYPE.video" @on-success="onSuccess"
                        @on-progress="onProgress" @on-start="handleStart">
                        <div class="items">
                            <img src="./images/5.png" alt="">
                            <span>视频</span>
                        </div>
                    </upload-media>
                </div>
                <div class="addItems">
                    <div class="items" @click="emitAction('addRichText')">
                        <img src="./images/6.png" alt="">
                        <span>笔记</span>
                    </div>
                </div>
                <div class="addItems">
                    <div class="items" @click="emitAction('addMap')">
                        <img src="./images/7.png" alt="">
                        <span>地图</span>
                    </div>
                </div>

            </div>
        </el-drawer>
    </client-only>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { type UploadFile, type UploadProgressEvent, ElNotification } from 'element-plus'
import { UPLOAD_TYPE, MEDIA_TYPE, BROWSER_ENV, type Style, type IAppConfigItemLeftEdit, type IAddMediaItem } from '@beetr/constant'
import { _widgetStore } from '~~/store/widget'
import { addLinkData, addDrawData, addSocialData } from '~~/store/isLoading'
import { _userStore } from '~~/store/user'
import { _envStore } from '~/store/env'
const envStore = _envStore()
const { browserEnv } = storeToRefs(envStore)
const direction = computed(() => {
    return browserEnv.value == BROWSER_ENV.mobile ? 'btt' : 'rtl'
})


const showAddSocial = () => {
    addSocialData.show = true
    addDrawData.show = false
}
const emitAction = (action: any, params?: any) => {
    // @20240716 老板说为了以后会员制，map会员才允许
    if (action === 'addMap') {
        return ElNotification({
            type: 'warning',
            message: '暂不可使用，正在陆续开放中哦~',
            title: '提示',
        })
    }
    emit(action, params)
    // hide drawer
    addDrawData.show = false
}
// 上传组件和条件空值
const uploadVariant = ref<keyof typeof MEDIA_TYPE>()
const uploadImg = ref()
const upload = ref()
/** 定义触发父组件的事件 */
const emit = defineEmits<{
    (e: 'add', params: IAppConfigItemLeftEdit, cusStyle: Style, callback?: () => void): void
    (e: 'addMedia', params: IAddMediaItem, cusStyle: Style, callback?: () => void): void
    (e: 'delete', params: any, callback?: () => void): void
    (e: 'addRichText'): void
    (e: 'addSectionTitle'): void
    (e: 'addMap'): void
    (e: 'openTheme'): void
    (e: 'closeLoading'): void
    (e: 'onProgress', params: number, blobUrl: string): void
    (e: 'onSuccess', url: string): void


    // (e: 'onSetEnv', env: keyof typeof BROWSER_ENV): void
}>()

/** 添加链接输入的网站 */
const addUrl = ref('')



/** 设置为关闭状态 */
const onSetComplete = () => {
    addLinkData.show = true
    addDrawData.show = false
    return
}

/**
 * onStart
 * @uid 临时文件的idMEDIA_TYPE
 * @fileUrl 临时文件的路径
 */
const handleStart = (variant: keyof typeof MEDIA_TYPE) => {

    const params: IAddMediaItem = {

        // _tempId,
        // screenshotUrl: fileUrl,
        variant,
        processing: true
    }
    const INIT_STYLE: Style = {
        mobile: { w: 2, h: 2 },
        desktop: { w: 2, h: 2 },
    }
    uploadVariant.value = variant
    emit('addMedia', params, INIT_STYLE)
    addDrawData.show = false
}

/** 上传进度 */
const onProgress = (evt: UploadProgressEvent, blobUrl: string) => {
    emit('onProgress', evt.percent, blobUrl)

}

const submit = () => {
    if (uploadVariant.value == MEDIA_TYPE.image) {
        uploadImg.value.submit()
    } else {
        upload.value.submit()
    }
}

/** 上传成功 */
const onSuccess = (response: { code: number; message: string }, uploadFile: UploadFile) => {
    // emit("closeLoading")
    if (response?.code !== 1) {
        // const item: any = widgetStore.userAppList.find((x) => x?._tempId === uploadFile.uid)!
        // widgetStore.onDelete(item.id)
        // emit("delete", JSON.parse(JSON.stringify(item)))
    } else {
        // emit('onSuccess', response.message)
        emitAction('onSuccess', response.message)
        // const item = widgetStore.userAppList.find((x) => x?._tempId === uploadFile.uid)!
        // item.screenshotUrl = response.message
        // item.processing = false
        // item._percent = 0
        // widgetStore.onUpdate([item])
    }

}


defineExpose({ submit })
</script>
<style scoped lang="scss">
.editdrawer {
    .header {
        width: 100%;
        height: 82px;
        display: flex;
        justify-content: space-between;
        padding: 0 30px 0 27px;
        box-sizing: border-box;
        border-bottom: 1px solid rgba(216, 216, 216, 1);
        align-items: center;


        .left {
            display: flex;
            align-items: center;
            // @include font_color('drawerTitleColor');

            .back {
                width: 24px;
                height: 24px;
            }

            span {
                /** 文本1 */
                font-size: 20px;
                font-weight: 500;
                letter-spacing: 0.83px;
                // color: rgba(0, 0, 0, 1);
                margin-left: 14px;
            }
        }

        .close {
            width: 30px;
            height: 30px;
            opacity: 1;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;



            background: rgba(0, 0, 0, 1)
        }
    }

    .content {
        padding: 0 11px 0 11px;
        // @include font_color('drawerBodyColor');

        .addItems {
            margin-top: 27px;
            display: flex;
            align-items: center;
            padding-left: 9px;
            width: 100%;
            height: 56px;
            border-radius: 8px;
            cursor: pointer;

            div {
                width: 100%;
            }

            &:hover {
                // @include background_color('hoverBackgroundColor')
            }

            .items {
                display: flex;
                align-items: center;
                width: 100%;
                height: 56px;
            }

            img {
                width: 34px;
                height: 34px;
            }

            span {
                margin-left: 14px;
                font-size: 20px;
                font-weight: 500;
                letter-spacing: 1px;
                line-height: 28.96px;
                // color: rgba(0, 0, 0, 1);
            }

            box-sizing: border-box;
        }
    }
}
</style>
