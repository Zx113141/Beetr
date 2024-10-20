<script setup lang="ts">
// import '@amap/amap-jsapi-types'
declare let AMap: any

import { Svg2M2, Svg2M4, Svg4M1, Svg4M2, Svg4M4 } from '@beetr/constant'

import { type IUserAppItem, ENV_ENUM, WIDGET_TYPE } from '@beetr/constant'
import { toRefs, computed, inject } from 'vue'

const props = defineProps<{
    item: IUserAppItem,
}>()

const { item, } = toRefs(props)
const emit = defineEmits<{
    (e: 'onResize', item: IUserAppItem, type: 'resize'): void
}>()
const env = inject<keyof typeof ENV_ENUM>('env') as keyof typeof ENV_ENUM

const linkResizeList = [
    {
        component: Svg2M2,
        width: 1,
        height: 2,
    },
    {
        component: Svg4M1,
        width: 2,
        height: 1,
    },
    {
        component: Svg4M2,
        width: 2,
        height: 2,
    },
    {
        component: Svg2M4,
        width: 1,
        height: 4,
    },
    {
        component: Svg4M4,
        width: 2,
        height: 4,
    },
]

const mediaResizeList = [
    {
        component: Svg2M2,
        width: 1,
        height: 2,
        active: true,
    },
    {
        component: Svg4M2,
        width: 2,
        height: 2,
    },
    {
        component: Svg2M4,
        width: 1,
        height: 4,
    },
    {
        component: Svg4M4,
        width: 2,
        height: 4,
    },
]

const resizeList = computed(() => {
    if (item.value.type === WIDGET_TYPE.media) return mediaResizeList
    else return linkResizeList
})


const resize = (item: IUserAppItem, width: number, height: number) => {
    const newItem = { ...item, }
    newItem.cusStyle[env].w = width
    newItem.cusStyle[env].h = height
    emit('onResize', newItem, 'resize')
}
</script>

<template>
    <button v-for="(child, index) in resizeList" :key="index"
        class="rounded-[4px] outline-none disabled:text-white disabled:text-opacity-40 active:scale-90" :class="`${item.cusStyle[env].w}×${item.cusStyle[env].h}` ===
            `${child.width}×${child.height}`
            ? `active`
            : ``
            " @click="() => resize(item, child.width, child.height)">
        <component :is="child.component"></component>
    </button>

</template>

<style lang="scss" scoped>
.init_link-input {
    background-color: hsla(0, 0%, 100%, 0.2);
    border-radius: 4px;

    :deep(.el-input__wrapper) {
        background-color: transparent;
        box-shadow: none;
    }

    :deep(input) {
        background-color: transparent;
        color: #fff;
    }
}

button {
    padding: 0.25rem !important;
    transition: transform 0.1s cubic-bezier(0.427, 0.073, 0.105, 0.997),
        color 0.1scubic-bezier(0.427, 0.073, 0.105, 0.997);
    @apply text-white active:bg-white active:bg-opacity-30 active:text-white;

    &.active {
        @apply bg-white text-black hover:bg-white active:bg-white active:opacity-80;
    }

    &+button {
        margin-left: 0.375rem;
    }
}
</style>