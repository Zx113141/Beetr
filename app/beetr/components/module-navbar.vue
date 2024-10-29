<template>
    <transition :name="animationDirection" mode="out-in">
        <ModuleAccountLabel v-if="currentStep === STEP_PROCESS.accountLabel && isEdit"
            @next="onNext(STEP_PROCESS.socialMedia)"></ModuleAccountLabel>

        <!-- 添加社媒表单 -->
        <ModuleFormSocialMedia v-else-if="currentStep === STEP_PROCESS.socialMedia && userStore.isEdit"
            ref="ModuleFormSocialMediaRef" @remove="remove" @add="onAddLink"
            @next="onNext(STEP_PROCESS.congratulations)" @last="onLast" :mextType="mextType"></ModuleFormSocialMedia>
        <!-- 添加其他重要的链接 -->
        <!-- 添加完成，注册页 -->
        <ModuleCongratulations v-else-if="currentStep === STEP_PROCESS.congratulations && userStore.isEdit"
            @next="onNext(STEP_PROCESS.userInfo)"></ModuleCongratulations>
        <!-- 个人信息展示 -->
        <ModuleUserInfo v-else></ModuleUserInfo>
    </transition>
</template>

<script setup lang="ts">
import {
    ANIMATION_DIRECTION,
    STEP_PROCESS,
    WIDGET_TYPE,
    type IUserAppItem,
    type Style,
    type IAppConfigItemLeftEdit
} from '@beetr/constant'
import { BeetrModules, type IModule } from '@beetr/materials';

import { _userStore } from '~/store/user'
const userStore = _userStore()
const props = defineProps<{
    mextType: number
    handleAdd: (query: {
        name: string,
        data: string
    }) => void
    remove?: (query: IUserAppItem[]) => void
}>()

const { currentStep, isEdit } = toRefs(userStore)

/** 左右切换动画执行方向 */
const animationDirection = ref<`${ANIMATION_DIRECTION}`>(ANIMATION_DIRECTION.sliderLeft)


const emits = defineEmits<{
    (e: 'update:mextType', mextType: number): void
    (e: 'remove', id: string): void
}>()

const onNext = (value: STEP_PROCESS) => {
    // 从标签页过来设置为媒体添加页
    if (currentStep.value == STEP_PROCESS[STEP_PROCESS.socialMedia] && props.mextType == 0) {
        currentStep.value = STEP_PROCESS[STEP_PROCESS.socialMedia]
        emits('update:mextType', props.mextType + 1)
        return
    }
    animationDirection.value = ANIMATION_DIRECTION.sliderRight
    currentStep.value = STEP_PROCESS[value]
}
const onLast = () => {
    animationDirection.value = ANIMATION_DIRECTION.sliderLeft
    currentStep.value = STEP_PROCESS.socialMedia
    emits('update:mextType', props.mextType - 1)
}

const onAddLink = (item: IAppConfigItemLeftEdit,) => {
    const module = BeetrModules.find((widget) => widget.name == WIDGET_TYPE.social) as IModule
    const baseConfig = {
        configId: item.id,
        faviconUrl: item.logoUrl,
        ...item,
    }
    const config = module?.defaultEditorConfigs(baseConfig)
    props.handleAdd({
        name: WIDGET_TYPE.social,
        data: JSON.stringify(config)
    })
}

const remove = (item: IUserAppItem) => {
    props.remove && props.remove([item])
}



</script>

<style lang="scss" scoped></style>