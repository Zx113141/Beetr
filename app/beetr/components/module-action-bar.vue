<template>
    <client-only v-if="!isScreenLock">
        <ModuleFooterActionBar v-if="isEdit &&
            isOnboared &&
            STEP_PROCESS.congratulations !== currentStep" @on-set-env="onSetEnv" :isEditorRef="isEditorRef"
            :loadingRef="loading">
        </ModuleFooterActionBar>

        <!-- 用户登录状态下的操作栏，含登出、修改用户名 -->
        <ModuleLeftActionOnline :isEditorRef="isEditorRef" v-if="isEdit && isOnboared" @logout="logout">
        </ModuleLeftActionOnline>

        <!-- 手机端设置弹窗 -->
        <!-- <setDraw @closeLoading="closeLoading" @openLoading="openLoading" @logout="logout" /> -->
        <!-- 更新弹窗 -->
        <!-- <editDraw @closeLoading="closeLoading" @openLoading="openLoading" @on-edit="onUpdateGrid" /> -->
        <!-- 底部logo -->
        <!-- <ModuleFooterLogo></ModuleFooterLogo> -->

        <!-- 非登录状态下的操作栏，登录、创建个人链接 -->
        <!-- <ModuleLeftActionOffline v-if="!isEdit && browserEnv == BROWSER_ENV.desktop"
            :path="userInfo?.url"></ModuleLeftActionOffline> -->
        <!-- <themeDraw @closeLoading="closeLoading" @openLoading="openLoading"></themeDraw> -->
        <ModuleWidgetAddDrawer @on-select="onAddGrid">
        </ModuleWidgetAddDrawer>
        <ModuleWidgetDrawer>
            <template #content>
                <component :is="widgetDrawerData.data" :query="widgetDrawerData.data"></component>
            </template>
        </ModuleWidgetDrawer>
        <!-- @add="(...params: any[]) => onAddGrid('onAddLink', params)" ref="widgetDraw"
            @add-media="(...params: any[]) => onAddGrid('onAddMedia', params)"
            @add-rich-text="(...params: any[]) => onAddGrid('addRichText', params)"
            @add-section-title="(...params: any[]) => onAddGrid('addSectionTitle', params)"
            @add-map="(...params: any[]) => onAddGrid('addMap', params)"
            @delete="(...params: any[]) => onAddGrid('delete', params)" -->
        <!--  @on-progress="onProgress" @on-success="onSuccess"  @closeLoading="closeLoading"-->
        <!-- <addSocial :list="originConfigList" @add="(...params: any[]) => onAddGrid('onAddLink', params)">

        </addSocial>
        <addLink @add="(...params: any[]) => onAddGrid('onAddLink', params)"></addLink> -->
    </client-only>

</template>

<script setup lang="ts">
import { BROWSER_ENV, STEP_PROCESS } from '@beetr/constant';
import { _userStore } from '~/store/user';
import { defineAsyncComponent } from 'vue';
import { widgetDrawerData } from '~~/store/isLoading'
import type { IModule } from '@beetr/materials';
const userStore = _userStore()

const emits = defineEmits<{
    (e: 'onEdit', params: any): void,
    (e: 'onLogout',): void,
    (e: 'onSetEnv', params: any): void,
    (e: 'onAdd', params: any): void,
}>()
const {
    userInfo,
    urlInfo,
    isOnboared,
    isEdit,
    currentStep,
    isScreenLock,
} = toRefs(userStore)
defineProps<{
    isEditorRef: boolean,
}>()

const loading = inject('loading', false)

const onAddGrid = (params: IModule) => {
    if (!params.drawer) {
        emits('onAdd', params)
    } else {
        widgetDrawerData.show = true
        widgetDrawerData.drawer = params.drawer
    }
}

const onSetEnv = (env: keyof typeof BROWSER_ENV) => {
    // 发送消息给父窗口
    emits('onSetEnv', env)
}

const logout = () => {
    emits('onLogout',)
    // window.parent.postMessage({
    //     eventType: 'logout',
    // }, '*')
}



</script>

<style lang="scss" scoped></style>