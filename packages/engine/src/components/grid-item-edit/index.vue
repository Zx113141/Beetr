<script setup lang="ts">
import { SvgEdit, SvgSuccess, type IUserAppItem } from '@beetr/constant'
import { type PropType } from 'vue'

const props = defineProps({
    /** 编辑图标 */
    edit: {
        type: Boolean,
        default: false,
    },


})

const emit = defineEmits<{
    (e: 'edit',): void
}>()

const touchEnd = (e) => {
    emit('edit',)
}
</script>

<template>
    <transition name="fade">
        <div>
            <div class="widget_edit absolute -right-2.5 -top-2.5 z-30 w-[35px] h-[35px]" @click.stop="touchEnd">
                <el-button circle class="relative" :class="[edit ? 'greenBtn' : 'blackBtn']">
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
