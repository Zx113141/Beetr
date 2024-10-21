<template>
    <transition name="fade" v-if="visibleActionId == item.id">
        <div class="widget_resize cursor-default">
            <slot name="content"></slot>

            <!-- <module-reize @onResize="onEdit" :item="item"></module-reize> -->

            <!-- 富文本 -->
            <!-- <template v-if="item.type == WIDGET_TYPE.richText">
                <el-divider direction="vertical" class="!mx-2" />
                <module-font-style @onEditing="onEditing" :item="item"></module-font-style>
                <el-divider direction="vertical" class="!mx-2" />
                <module-link :item="item" @onEditing="onEditing"></module-link>
            </template> -->
            <!-- 链接 -->
            <!-- <template v-if="item.type == WIDGET_TYPE.link">
                <el-divider direction="vertical" class="!mx-2" />
                <module-link :item="item" @onLinkEdit="protoToFrame"></module-link>
            </template> -->
            <!-- 媒体 -->
            <!-- <template v-if="item.type == WIDGET_TYPE.media">
                <module-font-style @onEditing="onEditing" :item="item"></module-font-style>
            </template> -->
        </div>
    </transition>
</template>

<script setup lang="ts">


import { PropType, provide, } from 'vue'
import { type IUserAppItem, } from '@beetr/constant'
const props = defineProps({
    /** 当前激活的item */
    item: {
        type: Object as PropType<IUserAppItem>,
        required: true,
    },
    /** 当前激活的id */
    visibleActionId: {
        type: String,
        required: true,
    },
})

</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.widget_resize {
    position: absolute;
    left: 50%;
    bottom: -1.75rem;
    transform: translate(-50%, 0);
    display: flex;
    align-items: center;
    border-radius: 10px;
    background-color: rgb(0 0 0);
    padding: 0.375rem;
    pointer-events: auto;
    box-shadow: inset 0 0 0 1px hsla(0, 0%, 100%, 0.2), 0 9px 13px rgba(0, 0, 0, 0.05),
        0 5.83333px 7.61343px rgba(0, 0, 0, 0.038), 0 3.46667px 4.14074px rgba(0, 0, 0, 0.03),
        0 1.8px 2.1125px rgba(0, 0, 0, 0.025), 0 0.733333px 1.05926px rgba(0, 0, 0, 0.02),
        0 0.166667px 0.511574px rgba(0, 0, 0, 0.012);


    button {
        padding: 0.25rem !important;
        transition: transform 0.1s cubic-bezier(0.427, 0.073, 0.105, 0.997),
            color 0.1s cubic-bezier(0.427, 0.073, 0.105, 0.997);

        &+button {
            margin-left: 0.375rem;
        }
    }
}
</style>