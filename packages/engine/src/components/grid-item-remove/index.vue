<script setup lang="ts">
import { SvgDelete, type IUserAppItem } from '@beetr/constant'
import { PropType, toRefs } from 'vue'

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

})
const { item, visibleActionId, } = toRefs<any>(props)

const emit = defineEmits<{
    (e: 'remove', id: string): void
}>()
</script>

<template>
    <div class="widget_delete absolute -left-2.5 -top-2.5 z-30">
        <el-button circle class="el-button--delete" @click="emit('remove', item.id)">
            <SvgDelete />
        </el-button>
    </div>
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

.widget_delete {
    z-index: 999;
}
</style>
