<script setup lang="ts">
import { SvgEdit, SvgSuccess, type IUserAppItem } from '@beetr/constant'
import { type PropType } from 'vue'

const props = defineProps({
    /** 编辑图标 */
    edit: {
        type: Boolean,
        default: false,
    },
    /** 对应的对象 */
    item: {
        type: Object as PropType<IUserAppItem>,
        required: true,
    },

})
const { item, } = toRefs<any>(props)

const emit = defineEmits<{
    (e: 'edit', item: any): void
}>()
</script>

<template>
    <transition name="fade">
        <div>
            <div class="widget_edit absolute -right-2.5 -top-2.5 z-30">
                <el-button type="success" circle class="relative" :class="[edit ? 'greenBtn' : 'blackBtn']"
                    @click.stop="emit('edit', item)">
                    <SvgSuccess v-if="edit" />
                    <SvgEdit v-else />
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
</style>
