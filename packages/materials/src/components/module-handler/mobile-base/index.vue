<template>
    <div class="flex justify-between items-center w-full">
        <div>
            <slot></slot>
        </div>
        <el-button type="success"
            class="el-button relative greenBtn rounded-md w-[100px] outline-none disabled:text-white disabled:text-opacity-40 active:scale-90"
            @click.stop="() => emits('onOk', EDIT_TYPE.select)">
            <span>完成</span>
        </el-button>
    </div>
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'
import { EDIT_TYPE } from '@beetr/constant';
const emits = defineEmits(['onOk'])


</script>

<style lang="scss" scoped></style>