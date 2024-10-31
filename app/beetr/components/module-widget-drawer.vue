<template>
    <client-only>
        <el-drawer :scoped="false" v-model="widgetDrawerData.show" :direction="direction" modal-class="editdrawer"
            title="编辑" @close="close" :with-header="false" size="323">
            <template #default>
                <slot name="content">

                </slot>
            </template>
        </el-drawer>
    </client-only>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { widgetDrawerData } from '~~/store/isLoading'
import { BROWSER_ENV, LINK_TYPE, type Style } from '@beetr/constant'
import { _userStore } from '~~/store/user'
import { _envStore } from '~/store/env'
const envStore = _envStore()
const { browserEnv } = storeToRefs(envStore)

const emit = defineEmits(['close'])
const direction = computed(() => {
    return browserEnv.value == BROWSER_ENV.mobile ? 'btt' : 'rtl'
})


const close = () => {
    emit('close')
    widgetDrawerData.show = false
}

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
