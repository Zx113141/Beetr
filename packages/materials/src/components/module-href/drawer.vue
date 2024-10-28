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
        <div class="content">
            <component ref="dynamicRef" :is="customComp[data.variant as LINK_TYPE]" :data="data" :prop="prop"
                @finish="(params) => emit('finish', params)" :browserEnv="browserEnv" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { toRefs, watch, ref } from 'vue'
import { BROWSER_ENV, Style, LINK_TYPE, IUserAppItem } from '@beetr/constant'
import ModuleLinkDrawer from '../module-link/drawer.vue';
import ModuleSocialDrawer from '../module-social/drawer.vue';
import backL from './back2.png'
const props = defineProps<{
    prop: any,
    browserEnv: keyof typeof BROWSER_ENV | undefined,
    data: IUserAppItem,
}>()
const emit = defineEmits(['finish', 'close'])
const { prop, browserEnv, data } = toRefs(props)
const dynamicRef = ref(null)
const nowEditData = ref<any>(null)
const customComp = {
    [LINK_TYPE.normal]: ModuleLinkDrawer,
    [LINK_TYPE.social]: ModuleSocialDrawer,
}

const addNEwLink = () => {
    console.log(dynamicRef.value);
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
    }
}
</style>