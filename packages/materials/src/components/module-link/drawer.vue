<template>
    <div class="title">
        {{ browserEnv == BROWSER_ENV.desktop ? '链接' : '新增URL链接' }}
        <span v-if="browserEnv == BROWSER_ENV.mobile">（<span class="text-[#ff2222]">需以
                https://或http://开头</span>）</span>
    </div>
    <div class="inpArea">
        <input type="text" v-model="nowEditData.url" placeholder="输入或复制任意连接">
    </div>
    <!-- <span v-if="!checkIsLink" class="text-[#ff2222]">请在开头添加 https:// 或 http://</span> -->
    <div class="w-full mt-3">
        <h3 class="title font-normal xl:text-sm mb-[10px]">图标</h3>
        <div class="w-full flex flex-col gap-2">
            <upload-media class="relative w-full h-full" ref="uploadImg" :auto-upload="true" :type="UPLOAD_TYPE.img"
                @on-success="onSuccess" @on-progress="onProgress" :auth="auth" :action="action">
                <div class="cursor-pointer bg-[#F7F7F7] w-full flex items-center justify-between p-[13px_10px]">
                    <div class="flex-1 flex items-center text-left">
                        <!-- 上传图片 -->
                        <img class="mr-4 rounded-[4px] bg-white shadow-[0_1px_2px_rgba(0, 0, 0, 0.1)]"
                            :src="nowEditData.faviconUrl || '/favicon.png'" :width="direction === 'btt' ? 40 : 48"
                            :height="direction === 'btt' ? 40 : 48">
                        <div class="text-[16px] text-[#6C6C6C]">{{ nowEditData.faviconUrl == '' ? '原始图标' : '已上传'
                            }}</div>
                    </div>
                    <div class="text-[14px] text-[#BFBFBF]">点击上传</div>
                </div>
            </upload-media>
        </div>
    </div>
    <div class="btn" v-if="browserEnv == BROWSER_ENV.desktop">
        <el-button @click="addNEwLink" :disabled="!nowEditData.url" type="primary" class="purpleBtn">
            <span>完成</span>
        </el-button>
    </div>
</template>
<script setup lang="ts">
// import { storeToRefs } from 'pinia'
// import { addLinkData, addDrawData } from '~~/store/isLoading'
import { BROWSER_ENV, LINK_TYPE, UPLOAD_TYPE, Style, TOKEN_CREDENTIALS, IUserAppItem } from "@beetr/constant";
import type { UploadFile, UploadProgressEvent } from "element-plus";
import { computed, reactive, ref, toRefs, watch } from 'vue'
import { ElNotification } from 'element-plus'
import UploadMedia from '../module-media-upload/index.vue'
const auth = useCookie(TOKEN_CREDENTIALS)
const action = import.meta.env.VITE_API_URL + '/jeecg-boot/app/utils/aliOssUpload'

const direction = computed(() => {
    return props.browserEnv == BROWSER_ENV.mobile ? 'btt' : 'rtl'
})

const emit = defineEmits(['finish', 'close'])
const props = defineProps<{
    browserEnv: keyof typeof BROWSER_ENV,
    data: IUserAppItem,
}>()

const { data: nowEditData } = toRefs(props)

const addNEwLink = () => {
    if (!nowEditData.value.url) {
        ElNotification({
            title: '提示',
            message: "无效的URL，需包含：https://、http://",
        })
        return
    }
    if (nowEditData.value.url.indexOf('https://') != 0 && nowEditData.value.url.indexOf('http://') != 0) {
        ElNotification({
            title: '提示',
            message: "无效的URL，需包含：https://、http://",
        })
        return
    }
    emit('finish', {
        ...nowEditData.value,
    })
}
// 上传

/** 上传进度 */
const onProgress = (evt: UploadProgressEvent, blobUrl: string) => {
    nowEditData.value.faviconUrl = blobUrl
}
/** 上传成功 */
const onSuccess = (response: { code: number; message: string }, uploadFile: UploadFile) => {
    if (response?.code !== 1) {
        nowEditData.value.faviconUrl = ''
    } else {
        nowEditData.value.faviconUrl = response.message
    }
}


</script>
<style lang="scss" scoped>
.title {
    font-size: 14px;
    color: rgba(108, 108, 108, 1) !important;
    font-weight: 500;
    letter-spacing: 1px;
    line-height: 28.96px;
    // color: rgba(0, 0, 0, 1);
    margin-bottom: 10px;
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

    input {
        font-size: 14px;
        outline: none;
        width: 100%;
        background-color: transparent;
    }
}

.btn {
    width: 100%;
    margin-top: 17px;
    font-size: 14px;

    .el-button {
        width: 100%;
        background: rgba(108, 108, 108, 1);
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.12);
        height: 42px;

        .img {
            width: 20px;
            height: 20px;
            opacity: 1;
            background: rgba(247, 247, 247, 1);
            border-radius: 3px;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            margin-right: 6px;

            img {
                width: 12px;
            }
        }

        span {
            font-size: 14px;
            color: rgba(255, 255, 255, 1);
        }

    }
}
</style>