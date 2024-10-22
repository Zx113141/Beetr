<template>
    <div>
        <div class="header">
            <el-button type="success" style="width:90px" class="relative greenBtn"
                @click="() => nowEditData ? addNEwLink() : closeDrawer()">
                <span>{{ browserEnv == BROWSER_ENV.desktop ? '完成' : '保存' }}</span>
            </el-button>
        </div>

        <div class="content" v-if="nowEditData">
            <div class="title">
                账号
            </div>
            <div class="inpArea">
                <input type="text" v-model="nowEditData.nickName" placeholder="@">
            </div>
            <div class="title">
                主页链接
            </div>
            <div class="inpArea">
                <input type="text" v-model="nowEditData.url" placeholder="请输入或复制主页链接">
            </div>
            <div class="btn" v-if="browserEnv == BROWSER_ENV.desktop">
                <el-button type="primary" class="purpleBtn" :disabled="!nowEditData.nickName" @click="addNEwLink">
                    <div class="img" v-if="false">
                        <img src="@/assets/images/btnadd.svg" loading="lazy" />
                    </div>
                    <span>
                        保存链接
                    </span>
                </el-button>
            </div>
        </div>
        <div class="lists" v-else>
            <div class="items" v-for="(v, i) in list" :key="i" @click="activeLinkData(v)">
                <div>
                    <div class="con" :style="'background:' + v.bgColor">
                        <img :src="v.logoUrl" alt="" class="img">
                    </div>
                    <div class="word">
                        {{ v.appName }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { BROWSER_ENV } from '@beetr/constant'
const props = defineProps<{
    query: any,
}>()
const emit = defineEmits(['finish',])
const { prop: list, browserEnv, data: nowEditData } = toRefs(props.query)

const addNEwLink = () => {
    emit('finish')
}

const closeDrawer = () => {

}

const activeLinkData = (v: any) => {
    nowEditData.value = v
}

</script>

<style lang="scss" scoped></style>