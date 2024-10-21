<template>
    <client-only v-if="!isLock">
        <ModuleFooterActionBar v-if="userStore.isEdit &&
            userStore.isOnboared &&
            STEP_PROCESS.congratulations !== userStore.currentStep" @on-set-env="onSetEnv" :isEditorRef="isEditorRef"
            :loadingRef="loading">
        </ModuleFooterActionBar>

        <!-- 用户登录状态下的操作栏，含登出、修改用户名 -->
        <ModuleLeftActionOnline :isEditorRef="isEditorRef" v-if="userStore.isEdit && userStore.isOnboared"
            @logout="logout">
        </ModuleLeftActionOnline>

        <!-- 手机端设置弹窗 -->
        <!-- <setDraw @closeLoading="closeLoading" @openLoading="openLoading" @logout="logout" /> -->
        <!-- 更新弹窗 -->
        <!-- <editDraw @closeLoading="closeLoading" @openLoading="openLoading" @on-edit="onUpdateGrid" /> -->
        <!-- 底部logo -->
        <!-- <ModuleFooterLogo></ModuleFooterLogo> -->

        <!-- 非登录状态下的操作栏，登录、创建个人链接 -->
        <!-- <ModuleLeftActionOffline v-if="!userStore.isEdit && browserEnv == BROWSER_ENV.desktop"
            :path="userStore.userInfo?.url"></ModuleLeftActionOffline> -->
        <!-- <themeDraw @closeLoading="closeLoading" @openLoading="openLoading"></themeDraw> -->
        <ModuleWidgetAddDrawer @add="(...params: any[]) => onAddGrid('onAddLink', params)" ref="widgetDraw"
            @add-media="(...params: any[]) => onAddGrid('onAddMedia', params)"
            @add-rich-text="(...params: any[]) => onAddGrid('addRichText', params)"
            @add-section-title="(...params: any[]) => onAddGrid('addSectionTitle', params)"
            @add-map="(...params: any[]) => onAddGrid('addMap', params)"
            @delete="(...params: any[]) => onAddGrid('delete', params)">
        </ModuleWidgetAddDrawer>
        <!--  @on-progress="onProgress" @on-success="onSuccess"  @closeLoading="closeLoading"-->
        <!-- <addSocial :list="originConfigList" @add="(...params: any[]) => onAddGrid('onAddLink', params)">

        </addSocial>
        <addLink @add="(...params: any[]) => onAddGrid('onAddLink', params)"></addLink> -->
    </client-only>

</template>

<script setup lang="ts">
import { BROWSER_ENV, STEP_PROCESS } from '@beetr/constant';
import { _userStore } from '~/store/user';
const userStore = _userStore()
const props = defineProps<{
    isLock: boolean,
    isEditorRef: boolean,
}>()

const loading = inject('loading', false)

const onAddGrid = (type: string, parasm: any) => {

}

const onSetEnv = (env: keyof typeof BROWSER_ENV) => {
    // 发送消息给父窗口
    window.parent.postMessage({
        eventType: 'env',
        query: {
            browserEnv: env
        }
    }, '*')
}

const logout = () => {
    window.parent.postMessage({
        eventType: 'logout',
    }, '*')
}



</script>

<style lang="scss" scoped></style>