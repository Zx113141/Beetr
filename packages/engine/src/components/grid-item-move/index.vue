<script setup lang="ts">
import { SvgMove, type IUserAppItem } from '@beetr/constant'
import { ElButton } from 'element-plus';


</script>

<template>
    <transition name="fade">
        <div class="widget_move absolute left-1/2 transform -translate-x-1/2 bottom-0 translate-y-1/2 z-30">
            <el-button type="success" circle class="relative blackBtn no-pointer-events">
                <SvgMove />
            </el-button>
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
