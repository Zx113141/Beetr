<script setup lang="ts">
import confetti from 'canvas-confetti'
import { updateUserInfo } from '~~/api/user/user'
import { _userStore } from '@/store/user'

const userStore = _userStore()

onMounted(() => {
    confetti({
        angle: 45,
        spread: 100,
        particleCount: 200,
        origin: { y: 0.6, x: 0.08 },
    })
    updateOnboarded()
})

/** 更新onload 1-已设置完成 0-未设置完成 */
const updateOnboarded = async () => {
    userStore.userInfo!.onboarded = 1
    await userStore.updateUser(userStore.userInfo!)
}
/** 定义触发父组件的事件 */
const emit = defineEmits<{
    (e: 'next'): void
}>()
</script>

<template>
    <div class="flex w-full flex-col px-4 xl:mr-20 xl:flex-1 xl:px-0">
        <div class="max-w-[376px]" style="opacity: 1; pointer-events: auto; transform: none">
            <svg-success style="color: rgb(78 221 118)" class="w-10 h-10"></svg-success>

            <div class="flex">
                <h1 class="text-3xl mb-10 mt-6">太棒了！</h1>
            </div>
            <div class="text-xl">快！继续自定义您的主页<br />资料，与全世界的人<br />一起分享！</div>
            <el-button type="primary" size="large" class="mt-10 h-[52px] w-[190px] lg:h-[41px]"
                @click="emit('next')">到个人中心</el-button>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
