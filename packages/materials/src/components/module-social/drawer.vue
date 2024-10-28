<template>
    <div v-if="nowEditData.title">
        <div class="title">
            {{ nowEditData.title }}账号
        </div>
        <div class="inpArea">
            <input type="text" v-model="nowEditData.nickName" placeholder="@">
        </div>
        <div class="title">
            {{ nowEditData.title }}主页链接
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
        <div class="items" v-for="(v, i) in prop.appConfigList" :key="i" @click="activeLinkData(v)">
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
</template>

<script setup lang="ts">
import { toRefs, watch, ref } from 'vue'
import { BROWSER_ENV, Style, LINK_TYPE } from '@beetr/constant'
const props = defineProps<{
    prop: any,
    browserEnv: keyof typeof BROWSER_ENV | undefined,
    data: any,
}>()
const emit = defineEmits(['finish', 'close'])
const { prop, browserEnv, data } = toRefs(props)
const nowEditData = ref(data.value)

const addNEwLink = () => {

    if (!nowEditData.value.nickName) return
    const params = {
        configId: nowEditData.value.id,
        faviconUrl: nowEditData.value.logoUrl,
        ...nowEditData.value,
    }

    emit('finish', params)
}

const activeLinkData = (v: any) => {
    nowEditData.value = v
}

</script>

<style lang="scss" scoped>
.title {
    font-weight: 500;
    letter-spacing: 1px;
    line-height: 28.96px;
    // color: rgba(0, 0, 0, 1);
    margin-bottom: 10px;
    font-size: 14px;
    color: rgba(108, 108, 108, 1) !important;
}

.inpArea {
    width: 100%;
    height: 50px;
    border-radius: 10px;
    background: rgba(247, 247, 247, 1);
    margin-bottom: 11px;
    padding-left: 12px;
    display: flex;
    align-items: center;
    box-sizing: border-box;

    input {
        font-size: 14px;
        outline: none;
        width: 100%;
        background-color: transparent;
    }
}

.btn {
    width: 100%;
    margin-top: 17px;

    .el-button {
        width: 100%;
        background: rgba(108, 108, 108, 1);
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.12);
        height: 42px;

        .img {
            width: 20px;
            height: 20px;
            opacity: 1;
            background: rgba(247, 247, 247, 1);
            border-radius: 3px;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            margin-right: 6px;

            img {
                width: 12px;
            }
        }

        span {
            font-size: 14px;


        }
    }
}

.lists {
    display: flex;
    flex-wrap: wrap;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    // padding: 0 21px;
    box-sizing: border-box;

    // justify-content: ;
    .items {
        //width: 92px;
        width: auto;
        height: 94px;
        opacity: 1;
        border-radius: 8px;
        margin-top: 12px;
        display: flex;
        cursor: pointer;
        align-items: center;
        justify-content: center;

        &:hover {
            // @include background_color('hoverBackgroundColor');
        }

        .con {
            border-radius: 8px;
            width: 48px;
            height: 48px;
            position: relative;
            margin: 0 auto;

            .img {
                width: 100%;
            }
        }

        .word {
            font-size: 14px;
            font-weight: 500;
            letter-spacing: 1px;
            line-height: 20.27px;
            // @include font_color('drawerBodyColor');
            margin-top: 2px;
            text-align: center;
        }
    }
}
</style>