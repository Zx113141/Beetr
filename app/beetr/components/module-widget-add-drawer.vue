<template>
    <client-only>
        <el-drawer :scoped="false" v-model="addDrawData.show" :direction="direction" modal-class="editdrawer" title="编辑"
            :with-header="false">
            <div class="header">
                <div class="left"></div>
                <el-button type="success" style="width:90px" class="relative greenBtn"
                    @click="addDrawData.show = false">
                    <span>完成</span>
                </el-button>
            </div>
            <div class="content">
                <div class="addItems" :key="item.name" @click="() => onSelectItem(item)" v-for="item in BeetrModules">
                    <img :src="item.icon" alt="">
                    <span>{{ item.title }}</span>
                </div>
            </div>
        </el-drawer>
    </client-only>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { BROWSER_ENV } from '@beetr/constant'
import { _widgetStore } from '~~/store/widget'
import { addDrawData, } from '~~/store/isLoading'
import { _userStore } from '~~/store/user'
import { _envStore } from '~/store/env'
import { BeetrModules, type IModule } from '@beetr/materials'
const envStore = _envStore()
const { browserEnv } = storeToRefs(envStore)
const direction = computed(() => {
    return browserEnv.value == BROWSER_ENV.mobile ? 'btt' : 'rtl'
})

const onSelectItem = (item: IModule) => {
    emit('onSelect', item)
    addDrawData.show = false
}

/** 定义触发父组件的事件 */
const emit = defineEmits<{
    (e: 'onSelect', params: any): void
}>()


</script>
<style scoped lang="scss">
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
                width: 24px;
                height: 24px;
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



            background: rgba(0, 0, 0, 1)
        }
    }

    .content {
        padding: 0 11px 0 11px;
        // @include font_color('drawerBodyColor');

        .addItems {
            margin-top: 27px;
            display: flex;
            align-items: center;
            padding-left: 9px;
            width: 100%;
            height: 56px;
            border-radius: 8px;
            cursor: pointer;

            div {
                width: 100%;
            }

            &:hover {
                // @include background_color('hoverBackgroundColor')
            }

            .items {
                display: flex;
                align-items: center;
                width: 100%;
                height: 56px;
            }

            img {
                width: 34px;
                height: 34px;
            }

            span {
                margin-left: 14px;
                font-size: 20px;
                font-weight: 500;
                letter-spacing: 1px;
                line-height: 28.96px;
                // color: rgba(0, 0, 0, 1);
            }

            box-sizing: border-box;
        }
    }
}
</style>
