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
        <ModuleLeftActionOffline v-if="!isEdit && browserEnv == BROWSER_ENV.desktop" :path="url">
        </ModuleLeftActionOffline>
        <!-- <themeDraw @closeLoading="closeLoading" @openLoading="openLoading"></themeDraw> -->
        <ModuleWidgetAddDrawer @on-select="onAddGrid">
        </ModuleWidgetAddDrawer>
        <el-drawer :scoped="false" v-model="widgetDrawerData.show" :direction="direction" modal-class=""
            @close="() => back(widgetDrawerData.data?.id ? false : true)" :with-header="false" size="323">
            <template #default>
                <component ref="dynamicRef" :is="widgetDrawer" :prop="widgetDrawerData.prop" :browserEnv="browserEnv"
                    :key="widgetDrawerData.data?.id" :deviceEnv="deviceEnv" :data="widgetDrawerData.data"
                    @finish="finish" @close="back">
                </component>
            </template>
        </el-drawer>

    </client-only>

</template>

<script setup lang="ts">
import { BROWSER_ENV, STEP_PROCESS, type IUserAppItem } from '@beetr/constant';
import { _userStore } from '~/store/user';
import { widgetDrawerData, addDrawData } from '~~/store/isLoading'
import type { IModule } from '@beetr/materials';
import { computed, toRefs, ref, triggerRef, inject, isRef } from 'vue'

let widgetDrawer: any = null
const userStore = _userStore()
let _tempFn: Function | undefined = void 0
const dynamicRef = ref(null)

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
    url
} = toRefs(userStore)
const props = defineProps<{
    isEditorRef: boolean,
    browserEnv: keyof typeof BROWSER_ENV,
    deviceEnv: keyof typeof BROWSER_ENV,
}>()
const direction = computed(() => {
    return props.browserEnv == BROWSER_ENV.mobile ? 'btt' : 'rtl'
})
const loading = inject('loading', false)

const onAddGrid = (params: IModule, data?: IUserAppItem, fn?: Function) => {
    _tempFn = fn
    if (!params.Drawer[props.browserEnv]) {
        emits('onAdd', params)
    } else {
        emits('onPrepare', params)

        widgetDrawer = params.Drawer[props.browserEnv]
        if (widgetDrawer) {
            widgetDrawerData.data = params.defaultEditorConfigs(data)
            widgetDrawerData.params = params
            widgetDrawerData.show = true
        }

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
    emits('onAdd', widgetDrawerData.params, isRef<Partial<IUserAppItem>>(data) ? data.value : data)
    _tempFn && _tempFn(data)
}



const back = (openAdd: boolean) => {
    widgetDrawerData.show = false
    widgetDrawer = null
    widgetDrawerData.data = null
    widgetDrawerData.params = null
    if (openAdd) {
        addDrawData.show = true
    }

    _tempFn && _tempFn()
}

defineExpose({
    onAddGrid
})

</script>

<style lang="scss" scoped></style>