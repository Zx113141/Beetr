<script setup lang="ts">
import { SvgDelete, type IUserAppItem } from '@beetr/constant'
import { PropType, toRefs } from 'vue'


const emit = defineEmits<{
    (e: 'remove',): void
}>()
</script>

<template>
    <div class="widget_delete absolute -left-2.5 -top-2.5 z-30" @click.stop="emit('remove',)">
        <el-button circle class="el-button--delete">
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
