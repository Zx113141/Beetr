<script setup lang="ts">
import { SvgMove, type IUserAppItem } from '@beetr/constant'
import { toRefs, type PropType, } from 'vue'

const props = defineProps({
    /** 对应的对象 */
    item: {
        type: Object as PropType<IUserAppItem>,
        required: true,
    },
    /** 当前激活的id */
    visibleActionId: {
        type: String,
        required: true,
    },
    /** 正在移动的widget */
    isMovingWidget: {
        type: String,
        required: true,
    },
})
const { item, visibleActionId, isMovingWidget } = toRefs<any>(props)
const emits = defineEmits<{
    (e: 'on-start', event: any, item: any): void
    (e: 'on-move', event: any, item: any): void
    (e: 'on-end', event: any, item: any): void
}>()
</script>

<template>
    <transition name="fade">
        <div v-if="visibleActionId === item.id && isMovingWidget !== item.id">
            <div class="widget_move absolute left-1/2 transform -translate-x-1/2 bottom-0 translate-y-1/2 z-30">
                <el-button type="success" circle class="relative blackBtn no-pointer-events"
                    @touchstart.stop="emits('on-start', $event, item)" @touchmove.stop="emits('on-move', $event, item)"
                    @touchend.stop="emits('on-end', $event, item)">
                    <SvgMove />
                </el-button>
            </div>
        </div>
    </transition>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.no-pointer-events {
    cursor: move;
    pointer-events: none !important;
}
</style>
