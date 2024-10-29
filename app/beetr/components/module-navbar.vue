<template>
    <transition :name="animationDirection" mode="out-in">
        <ModuleAccountLabel v-if="currentStep === STEP_PROCESS.accountLabel && isEdit"
            @next="onNext(STEP_PROCESS.socialMedia)"></ModuleAccountLabel>

        <!-- 添加社媒表单 -->
        <ModuleFormSocialMedia v-else-if="currentStep === STEP_PROCESS.socialMedia && userStore.isEdit"
            ref="ModuleFormSocialMediaRef" @add="onAddLink" @next="onNext(STEP_PROCESS.congratulations)" @last="onLast"
            :mextType="mextType"></ModuleFormSocialMedia>
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
    STEP_PROCESS
} from '@beetr/constant'

import { _userStore } from '~/store/user'
const userStore = _userStore()
const props = defineProps<{
    mextType: number
}>()

const { currentStep, isEdit } = toRefs(userStore)
const emits = defineEmits<{
    (e: 'update:mextType', mextType: number): void
}>()

const onNext = (value: STEP_PROCESS) => {
    // 从标签页过来设置为媒体添加页
    if (currentStep.value == STEP_PROCESS[STEP_PROCESS.socialMedia] && props.mextType == 0) {
        currentStep.value == STEP_PROCESS[STEP_PROCESS.socialMedia]
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

const onAddLink = () => {

}


/** 左右切换动画执行方向 */
const animationDirection = ref<`${ANIMATION_DIRECTION}`>(ANIMATION_DIRECTION.sliderLeft)


</script>

<style lang="scss" scoped></style>