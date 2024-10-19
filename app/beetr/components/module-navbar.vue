<template>
    <transition :name="animationDirection" mode="out-in">
        <!-- <ModuleAccountLabel v-if="currentStep === STEP_PROCESS.accountLabel && userStore.isEdit"
                @next="onNext(STEP_PROCESS.socialMedia)"></ModuleAccountLabel> -->

        <!-- 添加社媒表单 -->
        <!-- <ModuleFormSocialMedia v-else-if="currentStep === STEP_PROCESS.socialMedia && userStore.isEdit"
                ref="ModuleFormSocialMediaRef" @add="onAddLink" @next="onNext(STEP_PROCESS.congratulations)"
                @last="onLast" :mextType="mextType"></ModuleFormSocialMedia> -->
        <!-- 添加其他重要的链接 -->

        <!-- <ModuleFormLinkAnything ref="ModuleFormLinkAnythingRef" @add="onAddLink"
                v-else-if="currentStep === STEP_PROCESS.linkAnything && userStore.isEdit"
                @next="onNext(STEP_PROCESS.congratulations)" @previous="onPrevious(STEP_PROCESS.socialMedia)">
            </ModuleFormLinkAnything> -->
        <!-- 添加完成，注册页 -->
        <!-- <ModuleCongratulations v-else-if="currentStep === STEP_PROCESS.congratulations && userStore.isEdit"
                @next="onNext(STEP_PROCESS.userInfo)"></ModuleCongratulations> -->
        <!-- 个人信息展示 -->
        <ModuleUserInfo></ModuleUserInfo>
    </transition>
</template>

<script setup lang="ts">
import {
    ANIMATION_DIRECTION
} from '@beetr/constant'
/** 左右切换动画执行方向 */
const animationDirection = ref<`${ANIMATION_DIRECTION}`>(ANIMATION_DIRECTION.sliderLeft)

</script>
