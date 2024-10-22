<template>
    <div>
        <div class="header">
            <div class="left">
                <img :src="backL" loading="lazy" class="back" @click="back" width="30" height="30" />
                <!-- <span v-if="false">添加社交账号</span> -->
            </div>
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
    </div>
</template>

<script setup lang="ts">
import { toRefs, watch, ref } from 'vue'
import { BROWSER_ENV, Style, LINK_TYPE } from '@beetr/constant'
import backL from './back2.png'
const props = defineProps<{
    prop: any,
    browserEnv: keyof typeof BROWSER_ENV | undefined,
    data: any,
}>()
const emit = defineEmits(['finish', 'close'])
const { prop, browserEnv, } = toRefs(props)
const nowEditData = ref<any>(null)

const addNEwLink = () => {

    if (!nowEditData.value.nickName) return
    const INIT_STYLE: Style = {
        mobile: { w: 1, h: 2 },
        desktop: { w: 1, h: 2 },
    }
    emit('finish', {
        ...nowEditData.value,
        variant: LINK_TYPE.social,// 固定类型
        ...INIT_STYLE
    })
}

const closeDrawer = () => {
    emit('close')
}

const back = () => {
    if (nowEditData.value) {
        nowEditData.value = null
        return
    } else {
        closeDrawer()
    }
}

const activeLinkData = (v: any) => {
    nowEditData.value = v
}



watch(() => props.data, (newVal) => {
    nowEditData.value = newVal
},
    {
        immediate: true,
        deep: true
    }
)

</script>

<style lang="scss" scoped>
.editdrawer {
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

            span {
                /** 文本1 */
                font-size: 20px;
                font-weight: 500;
                letter-spacing: 0.83px;
                // color: rgba(0, 0, 0, 1);
                margin-left: 14px;
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

    .content {
        padding: 20px 30px 0 27px !important;
        // @include font_color('drawerBodyColor');


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
    }
}

.lists {
    display: flex;
    flex-wrap: wrap;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 0 21px;
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