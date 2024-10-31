<template>
    <client-only v-if="!isScreenLock">
        <ModuleFooterActionBar v-if="isEdit &&
            isOnboared &&
            STEP_PROCESS.congratulations !== currentStep" @on-set-env="onSetEnv" :isEditorRef="isEditorRef"
            :loadingRef="loading">
        </ModuleFooterActionBar>

        <!-- 用户登录状态下的操作栏，含登出、修改用户名 -->
        <ModuleLeftActionOnline :isEditorRef="isEditorRef" v-if="isEdit && isOnboared" @logout="logout"
            :browserEnv="browserEnv">
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
                <component :is="widgetDrawer" :prop="widgetDrawerData.prop" :browserEnv="browserEnv"
                    :key="widgetDrawerData.data.id" :deviceEnv="deviceEnv" :data="widgetDrawerData.data"
                    @finish="finish" @close="back">
                </component>
            </template>
        </ModuleWidgetDrawer>
    </client-only>

</template>

<script setup lang="ts">
import { BROWSER_ENV, STEP_PROCESS, type IUserAppItem } from '@beetr/constant';
import { _userStore } from '~/store/user';
import { widgetDrawerData, addDrawData } from '~~/store/isLoading'
import type { IModule } from '@beetr/materials';
let widgetDrawer: any = null
const userStore = _userStore()
let _tempFn: Function | undefined = void 0

const emits = defineEmits<{
    (e: 'onEdit', params: any): void,
    (e: 'onLogout',): void,
    (e: 'onSetEnv', params: any): void,
    (e: 'onAdd', params: any, lastParams?: Partial<IUserAppItem>): void,
    (e: 'onPrepare', params: IModule): void,
}>()
const {
    isOnboared,
    isEdit,
    currentStep,
    isScreenLock,
} = toRefs(userStore)
defineProps<{
    isEditorRef: boolean,
    browserEnv: keyof typeof BROWSER_ENV,
    deviceEnv: keyof typeof BROWSER_ENV,
}>()

const loading = inject('loading', false)

const onAddGrid = (params: IModule, data?: IUserAppItem, fn?: Function) => {
    _tempFn = fn
    if (!params.drawer) {
        emits('onAdd', params)
    } else {
        emits('onPrepare', params)
        widgetDrawer = params.drawer
        widgetDrawerData.data = params.defaultEditorConfigs(data)
        widgetDrawerData.params = params
        widgetDrawerData.show = true

        triggerRef(widgetDrawerData.data)
    }
}

const onSetEnv = (env: keyof typeof BROWSER_ENV) => {
    emits('onSetEnv', env)
}

const logout = () => {
    emits('onLogout',)
}

const finish = (data: Partial<IUserAppItem>) => {
    _tempFn && _tempFn(data)
    emits('onAdd', widgetDrawerData.params, data)
}

const back = () => {
    widgetDrawer = null
    widgetDrawerData.show = false
    widgetDrawerData.data = null
    widgetDrawerData.params = null

    addDrawData.show = true
}

defineExpose({
    onAddGrid
})

</script>

<style lang="scss" scoped></style>