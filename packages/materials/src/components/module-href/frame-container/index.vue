<template>
    <!-- 图片显示 -->
    <div class="widget_base-frame" :style="widget_base_style">
        <el-image v-if="item.screenshotUrl" class="h-full w-full rounded-[inherit]"
            :src="decodeURIComponent(item.screenshotUrl)" fit="cover"></el-image>
        <!-- <el-image v-else class="h-full w-full rounded-[inherit]" :src="morenImg" fit="cover"></el-image> -->
    </div>
    <template v-if="`${item.cusStyle[env].w * 2}x${item.cusStyle[env].h}` === '2x4'">
        <div class="flex-1"></div>
        <div v-if="item.follow" class="styles_follow-button" :class="item.btnCus">
            {{ item.follow }}
        </div>
    </template>
    <div v-if="item.nickName && !props.isEdit" @click="() => copyAccount(item.nickName)"
        class="absolute top-[14px] right-[14px] flex items-center justify-center rounded-full bg-black/20 backdrop-blur-[8px] w-[22px] h-[22px]">
        <SvgCopyLink></SvgCopyLink>
    </div>
</template>

<script setup lang="ts">
import { IUserAppItem, ENV_ENUM, SvgCopyLink } from '@beetr/constant'
import { computed } from 'vue';
import { copyToClipboard } from '@beetr/hooks'
const props = defineProps<{
    item: IUserAppItem,
    env: keyof typeof ENV_ENUM,
    isEdit: boolean
}>()

const widget_base_style = computed(() => {
    const w = props.item.cusStyle[props.env].w
    const h = props.item.cusStyle[props.env].h
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