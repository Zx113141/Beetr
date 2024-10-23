<template>
    <!-- 图片显示 -->
    <div class="widget_base-frame" :style="widget_base_style">
        <el-image v-if="item.screenshotUrl" class="h-full w-full rounded-[inherit]"
            :src="decodeURIComponent(item.screenshotUrl)" fit="cover"></el-image>
        <!-- <el-image v-else class="h-full w-full rounded-[inherit]" :src="morenImg" fit="cover"></el-image> -->
    </div>
    <template v-if="`${item.cusStyle[deviceEnv].w * 2}x${item.cusStyle[deviceEnv].h}` === '2x4'">
        <div class="flex-1"></div>
        <div v-if="item.follow" class="styles_follow-button" :class="item.btnCus">
            {{ item.follow }}
        </div>
    </template>
    <div v-if="item.nickName && !isEdit" @click="() => copyAccount(item.nickName)"
        class="absolute top-[14px] right-[14px] flex items-center justify-center rounded-full bg-black/20 backdrop-blur-[8px] w-[22px] h-[22px]">
        <SvgCopyLink></SvgCopyLink>
    </div>
</template>

<script setup lang="ts">
import { IUserAppItem, BROWSER_ENV, SvgCopyLink } from '@beetr/constant'
import { computed, inject } from 'vue';
import { copyToClipboard } from '@beetr/hooks'
const deviceEnv = inject<keyof typeof BROWSER_ENV>('deviceEnv',)!
const isEdit = inject<boolean>('editStatus')
const props = defineProps<{
    item: IUserAppItem,
}>()

const widget_base_style = computed(() => {
    const w = props.item.cusStyle[deviceEnv].w
    const h = props.item.cusStyle[deviceEnv].h
    return (w == 2 && h == 1) || (w == 1 && h == 2) ? 'display:none' : ''
})

const copyAccount = (text?: string) => {
    text && copyToClipboard(text)
}
</script>

<style lang="scss" scoped>
.widget_base-frame {
    position: relative;
    display: flex;
    min-height: 0;
    flex-direction: column;
    border-radius: 10px;


}
</style>