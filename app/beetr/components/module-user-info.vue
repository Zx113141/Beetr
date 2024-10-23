<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

import { updateUserInfo } from '~/api/user/user'
import { _userStore } from '~~/store/user'
import { _envStore } from '~/store/env'
import { BROWSER_ENV, SvgDelete, TOKEN_CREDENTIALS } from '@beetr/constant'
import { debounce } from '@beetr/hooks'
// import UploadMedia from './module-upload.vue'
import { UploadMedia } from '@beetr/materials'
import { uploadFileUrl } from '~/api/widget/widget'
const auth = useCookie(TOKEN_CREDENTIALS) as unknown as string
const envStore = _envStore()
const userStore = _userStore()
const { userInfo, urlInfo } = storeToRefs(userStore)
const { deviceEnv } = storeToRefs(envStore)

/** 根据登录状态，决定用那个信息展示 */
const currentUserInfo = computed(() => {
    return userStore.isEdit ? userInfo.value : urlInfo.value
})
/** 用户名称 🎉 */
const editorName = useEditor({
    content: urlInfo.value?.nickName,
    extensions: [
        StarterKit,
        Placeholder.configure({
            placeholder: '名字',
        }),
    ],
    // 监听编辑器任何变化
    onUpdate: debounce(({ editor }: any) => {
        const nickName = editor.getHTML()
        if (nickName === currentUserInfo.value?.nickName || !userStore.isEdit) return
        try {
            const userInfo = { ...userStore.userInfo!, nickName }
            userStore.urlInfo!.nickName = nickName
            updateUserInfo(userInfo)
        } catch (err) { }
    }, 500),
})

/** 用户描述 */
const editorBio = useEditor({
    content: urlInfo.value?.descript,
    extensions: [
        StarterKit,
        Placeholder.configure({
            placeholder: '你的主页介绍',
        }),
    ],
    // 监听编辑器任何变化
    onUpdate: debounce(({ editor }: any) => {
        const descript = editor.getHTML()
        if (descript === currentUserInfo.value?.descript || !userStore.isEdit) return
        try {
            const userInfo = { ...userStore.userInfo!, descript }
            userStore.urlInfo!.descript = descript
            updateUserInfo(userInfo)
        } catch (err) { }
    }, 500),
})
onMounted(() => {
    !userStore.isEdit && editorName.value!.setEditable(false)
    !userStore.isEdit && editorBio.value!.setEditable(false)
})

/** 上传图像 */
const onUploadSuccess = async (response: any) => {
    const userInfo = { ...userStore.userInfo!, avatarUrl: response.message }
    await updateUserInfo(userInfo)
    userStore.userInfo!.avatarUrl = response.message
}
/** 删除头像 */
const onDeleteAvatar = async () => {
    const userInfo = { ...userStore.userInfo!, avatarUrl: '' }
    await updateUserInfo(userInfo)
    userStore.userInfo!.avatarUrl = ''
}
</script>

<template>
    <div class="flex w-full flex-col px-4 xl:mr-20 xl:flex-1 xl:px-0 aniTransform">
        <div class="relative xl:sticky xl:top-16 min-h-[200px]" style="opacity: 1">
            <!-- 头像上传 -->
            <div v-if="userStore.isEdit || userStore.urlInfo?.avatarUrl"
                class="w-[120px] h-[120px] xl:w-[184px] xl:h-[184px] mb-8">
                <div class="relative styles_avatar-editor-wrapper__hgyBW styles_input-mode--mouse__RMnJU w-full h-full">
                    <div class="styles_avatar-editor__xBM_4 group/avatar">
                        <!-- 上传图片 -->
                        <upload-media class="w-full h-full" :disabled="!userStore.isEdit" @on-success="onUploadSuccess"
                            :auth="auth" :action="uploadFileUrl">
                            <div v-if="!currentUserInfo?.avatarUrl && userStore.isEdit"
                                class="absolute inset-0 rounded-full border-2 border-dashed border-black/[0.08] bg-[#FAFAFA] transition-colors duration-200 ease-in-out group-hover/avatar:bg-[#F6F6F6] group-active/avatar:bg-[#F1F1F1]">
                                <div
                                    class="typography-title-5 pointer-events-none flex h-full w-full flex-col items-center justify-center rounded-[inherit] text-center text-black/60">
                                    <svg class="mb-3" width="34" height="34" viewBox="0 0 34 34" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M17 30.2222C9.69757 30.2222 3.77778 24.3024 3.77778 17C3.77778 9.69757 9.69757 3.77778 17 3.77778C24.3024 3.77778 30.2222 9.69757 30.2222 17C30.2222 24.3024 24.3024 30.2222 17 30.2222ZM0 17C0 7.61116 7.61116 0 17 0C26.3888 0 34 7.61116 34 17C34 26.3888 26.3888 34 17 34C7.61116 34 0 26.3888 0 17ZM17 9.44444C17.5316 9.44444 18.0119 9.66402 18.3551 10.0174L24.0023 15.6646C24.74 16.4023 24.74 17.5983 24.0023 18.3359C23.2647 19.0736 22.0687 19.0736 21.331 18.3359L18.8889 15.8938V22.6667C18.8889 23.7099 18.0432 24.5556 17 24.5556C15.9568 24.5556 15.1111 23.7099 15.1111 22.6667V15.8938L12.669 18.3359C11.9313 19.0736 10.7353 19.0736 9.99769 18.3359C9.26003 17.5983 9.26003 16.4023 9.99769 15.6646L15.6449 10.0174C15.9882 9.66402 16.4684 9.44444 17 9.44444Z"
                                            fill="black" fill-opacity="0.1"></path>
                                    </svg>
                                    添加头像
                                </div>
                            </div>
                            <template v-else>
                                <img :src="currentUserInfo?.avatarUrl"
                                    class="h-full w-full rounded-full object-cover transition-all duration-200 ease-in-out"
                                    alt="" />
                                <div class="pointer-events-none absolute inset-0 rounded-full"
                                    style="box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 0px 1px inset"></div>
                            </template>
                        </upload-media>
                        <!-- 悬浮时弹出的按钮操作 -->
                        <template v-if="currentUserInfo?.avatarUrl && userStore.isEdit">
                            <!-- 上传 -->
                            <div class="absolute left-3 bottom-3 hidden xl:block styles_delete-wrapper__8J1Rq">
                                <upload-media class="w-full h-full" @on-success="onUploadSuccess" :auth="auth"
                                    :action="uploadFileUrl">
                                    <el-button class="!rounded-full w-[34px] h-[34px]">
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M9 16C5.13401 16 2 12.866 2 9C2 5.13401 5.13401 2 9 2C12.866 2 16 5.13401 16 9C16 12.866 12.866 16 9 16ZM0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9ZM9 5C9.28141 5 9.53568 5.11624 9.7174 5.30333L12.7071 8.29304C13.0976 8.68357 13.0976 9.31673 12.7071 9.70726C12.3166 10.0978 11.6834 10.0978 11.2929 9.70726L10 8.41436V12C10 12.5523 9.55228 13 9 13C8.44772 13 8 12.5523 8 12V8.41436L6.70711 9.70726C6.31658 10.0978 5.68342 10.0978 5.29289 9.70726C4.90237 9.31673 4.90237 8.68357 5.29289 8.29304L8.2826 5.30333C8.46432 5.11624 8.71859 5 9 5Z"
                                                fill="currentColor"></path>
                                        </svg>
                                    </el-button>
                                </upload-media>
                            </div>
                            <!-- 删除 -->
                            <el-button v-if="deviceEnv == BROWSER_ENV.desktop"
                                class="!rounded-full w-[34px] h-[34px] absolute right-3 bottom-3 hidden xl:block styles_delete-wrapper__8J1Rq"
                                @click="onDeleteAvatar">
                                <SvgDelete></SvgDelete>
                            </el-button>
                            <!-- 删除 -->
                            <el-button v-else
                                class="!rounded-full w-[34px] h-[34px] absolute -right-1 -bottom-1 xl:!hidden styles_delete-wrapper__8J1Rq"
                                @click="onDeleteAvatar">
                                <SvgDelete></SvgDelete>
                            </el-button>
                        </template>
                    </div>
                </div>
            </div>
            <!-- 信息展示 -->
            <div class="ml-2 w-[calc(100%-8px)] max-w-[min(500px,100%-8px)] xl:max-w-[min(500px,calc(100vw_-_1000px))]">
                <div
                    class="text-[32px] font-bold leading-[120%] tracking-[-1px] xl:text-[44px] xl:tracking-[-2px] profile-name">
                    <editor-content :editor="editorName" />
                </div>
                <div class="mt-3 text-[#565656] xl:mt-3 xl:text-xl">
                    <div class="styles_bio__oMe8p">
                        <editor-content :editor="editorBio" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.profile-name {
    //   @include font_color('profileColor')
}

.aniTransform {
    animation: aniTransform .5s linear forwards;
}

@keyframes aniTransform {
    0% {
        transform: translateX(20px);
        opacity: 0;
    }

    100% {
        transform: translateX(0px);
        opacity: 1;
    }
}

.styles_bio__oMe8p p+p {
    //   @include font_color('profileLeftColor');
    margin-top: 10px;
}

.styles_avatar-editor-wrapper__hgyBW.styles_input-mode--mouse__RMnJU:hover .styles_delete-wrapper__8J1Rq,
.styles_avatar-editor-wrapper__hgyBW.styles_input-mode--touch__mE36h:not(.styles_preview__TFfzT) .styles_delete-wrapper__8J1Rq {
    pointer-events: auto;
    opacity: 1;
}

.styles_avatar-editor__xBM_4 {
    position: relative;
    height: 100%;
    width: 100%;
    cursor: pointer;
    border-radius: 9999px;
}

.styles_avatar-editor__xBM_4:active {
    --tw-scale-x: 0.99;
    --tw-scale-y: 0.99;
    transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.styles_avatar-editor__xBM_4 {
    transition: transform 0.1s cubic-bezier(0.427, 0.073, 0.105, 0.997),
        color 0.1s cubic-bezier(0.427, 0.073, 0.105, 0.997);
}

.styles_avatar-editor__xBM_4.styles_avatar-editor--has-avatar__qznO1 .styles_overlay__ndtF4 {
    background-color: rgba(0, 0, 0, 0.4);
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity));
    opacity: 0;
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 0.2s;
}

.styles_delete-wrapper__8J1Rq {
    opacity: 0;
    transition-property: opacity;
    transition-duration: 0.1s;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.styles_delete-wrapper__8J1Rq.styles_delete-wrapper--dragging__A8_m5 {
    pointer-events: none;
    opacity: 0;
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
</style>
