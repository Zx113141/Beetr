<template>
    <div>
        <div class="header">
            <div class="left" v-if="browserEnv == BROWSER_ENV.desktop">
                <img :src="backStyle" loading="lazy" class="back" @click="back" width="30" height="30" />
                <span v-if="false">添加链接</span>
            </div>
            <div v-else class="left"></div>
            <!-- <div v-if="false" class="close blackBtn" @click=" addLinkData.show = false">
                <img :src="iconStyle" loading="lazy" width="20" height="20" />
            </div> -->
            <el-button type="success" style="width:90px" class="relative greenBtn"
                @click="() => nowEditData.url ? addNEwLink() : back()">
                <span>{{ browserEnv == BROWSER_ENV.desktop ? '完成' : '保存' }}</span>
            </el-button>
        </div>

        <div class="content">
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
                    <upload-media class="relative w-full h-full" ref="uploadImg" :auto-upload="true"
                        :type="UPLOAD_TYPE.img" @on-success="onSuccess" @on-progress="onProgress">
                        <div class="cursor-pointer bg-[#F7F7F7] w-full flex items-center justify-between p-[13px_10px]">
                            <div class="flex-1 flex items-center text-left">
                                <!-- 上传图片 -->
                                <img class="mr-4 rounded-[4px] bg-white shadow-[0_1px_2px_rgba(0, 0, 0, 0.1)]"
                                    :src="nowEditData.faviconUrl || '/favicon.png'"
                                    :width="direction === 'btt' ? 40 : 48" :height="direction === 'btt' ? 40 : 48">
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
        </div>
    </div>
</template>
<script setup lang="ts">
// import { storeToRefs } from 'pinia'
// import { addLinkData, addDrawData } from '~~/store/isLoading'
import backL from './back2.png'
import { BROWSER_ENV, LINK_TYPE, UPLOAD_TYPE, Style } from "@beetr/constant";
import type { UploadFile, UploadProgressEvent } from "element-plus";
import { computed, reactive, ref, watch } from 'vue'
import { ElNotification } from 'element-plus'

const direction = computed(() => {
    return props.browserEnv == BROWSER_ENV.mobile ? 'btt' : 'rtl'
})
const backStyle = computed(() => {
    return backL
});

const emit = defineEmits(['finish', 'close'])
const props = defineProps<{
    prop: any,
    browserEnv: keyof typeof BROWSER_ENV,
    deviceEnv: keyof typeof BROWSER_ENV,
    data: any,
}>()

const nowEditData = reactive<any>({
    url: '',
    faviconUrl: ''
})
const back = () => {
    nowEditData.url = ''
    nowEditData.faviconUrl = ''
    emit('close')
}

const addNEwLink = () => {
    if (!nowEditData.url) {
        ElNotification({
            title: '提示',
            message: "无效的URL，需包含：https://、http://",
        })
        return
    }
    if (nowEditData.url.indexOf('https://') != 0 && nowEditData.url.value.indexOf('http://') != 0) {
        ElNotification({
            title: '提示',
            message: "无效的URL，需包含：https://、http://",
        })
        return
    }
    const INIT_STYLE: Style = {
        mobile: { w: 1, h: 2 },
        desktop: { w: 1, h: 2 },
    }
    emit('finish', {
        ...nowEditData,
        variant: LINK_TYPE.normal,// 固定类型
        ...INIT_STYLE
    })
    // const params = {
    //     url: url.value,
    //     faviconUrl: faviconUrl.value,
    //     _completed: true,
    //     variant: LINK_TYPE.normal, // 固定类型
    // }
    // emit('add', params, INIT_STYLE)
    // addLinkData.show = false
}
// 上传

/** 上传进度 */
const onProgress = (evt: UploadProgressEvent, blobUrl: string) => {
    nowEditData.faviconUrl = blobUrl
}
/** 上传成功 */
const onSuccess = (response: { code: number; message: string }, uploadFile: UploadFile) => {
    if (response?.code !== 1) {
        nowEditData.faviconUrl = ''
    } else {
        nowEditData.faviconUrl = response.message
    }
}


watch(() => props.data, (newVal) => {
    nowEditData.value = newVal
},
    {
        immediate: true,
        deep: true
    }
)

</script>
<style lang="scss" scoped>
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
                width: 20px;
                height: 12px;
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
        padding: 20px 30px 0 27px !important;
        // @include font_color('drawerBodyColor');

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
    }
}

.lists {
    display: flex;
    flex-wrap: wrap;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    padding: 0 21px;
    box-sizing: border-box;

    // justify-content: ;
    .items {
        width: 92px;
        height: 94px;
        opacity: 1;
        border-radius: 8px;
        margin-top: 12px;
        display: flex;
        cursor: pointer;
        align-items: center;
        justify-content: center;

        &:hover {
            background: rgba(250, 250, 250, 1);
        }

        .con {
            border-radius: 8px;
            width: 48px;
            height: 48px;
            position: relative;
            margin: 0 auto;

            .img {
                width: 100%;
            }
        }

        .word {
            font-size: 14px;
            font-weight: 500;
            letter-spacing: 1px;
            line-height: 20.27px;
            // color: rgba(0, 0, 0, 1);
            margin-top: 2px;
            text-align: center;
        }
    }
}
</style>