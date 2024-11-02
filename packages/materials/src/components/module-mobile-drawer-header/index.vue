<template>
    <div class="header">
        <div class="left">
            <!-- <img :src="backL" loading="lazy" class="back" @click="back" width="30" height="30" v-if="!data.id" /> -->
            <slot>
                <el-button style="width:90px" class="relative grayBtn" @click="back">
                    <span>取消</span>
                </el-button>
            </slot>
        </div>
        <el-button type="success" style="width:90px" class="relative greenBtn" @click="beforeClose">
            <span>{{ browserEnv == BROWSER_ENV.desktop ? '完成' : '保存' }}</span>
        </el-button>
    </div>
</template>

<script setup lang="ts">

import { BROWSER_ENV, } from '@beetr/constant'
// import backL from './back2.png'
const props = defineProps<{
    browserEnv: keyof typeof BROWSER_ENV | undefined,
}>()
const emit = defineEmits(['finish', 'close'])

const beforeClose = () => {

    emit('finish')
}

const back = () => {
    emit('close',)
}



</script>

<style lang="scss" scoped>
.header {
    width: 100%;
    height: 82px;
    display: flex;
    justify-content: space-between;
    padding: 0 30px 0 27px;
    box-sizing: border-box;
    border-bottom: 1px solid rgba(216, 216, 216, 1);
    align-items: center;

    .left {
        display: flex;
        align-items: center;
        // @include font_color('drawerTitleColor');

        .back {
            width: 20px;
            height: 12px;
        }
    }

    .close {
        width: 30px;
        height: 30px;
        opacity: 1;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;



    }
}
</style>