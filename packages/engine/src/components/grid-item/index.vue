<template>
    <div :id="`w_${item.id}`" :key="`w_${item.id}`" :gs-id="`w_${item.id}`" :gs-w="item.cusStyle[env].w"
        :gs-h="item.cusStyle[env].h" :gs-x="item.position[env].x" :gs-y="item.position[env].y" :class="{
            'grid-stack-item': true,
            'pointer-events-none': id == item.id
        }" :style="item.temType == 'addLink' ? 'z-index:11111' : ''">
        <div class="grid-stack-item-content" @mouseenter="onMouseEnter(item)" @mouseleave="onMouseleave()">
            <div class="thisarea">
                <slot></slot>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { type IUserAppItem, type ENV_ENUM } from '@beetr/constant';


const props = defineProps<{
    item: IUserAppItem,
    env: keyof typeof ENV_ENUM,
    isWidgetEdit: boolean
}>()
const emits = defineEmits(['mouseHover'])
/** 是否显示操作栏 */
const visibleActionId = ref('')
/** 鼠标移入，仅触发一次 */
const onMouseEnter = (item: any) => {
    // 编辑的时候不重置
    if (props.isWidgetEdit) {
        return
    }
    // if (browserEnv.value == BROWSER_ENV.mobile || widgetEditor.value) return;
    visibleActionId.value = item.id
    emits('mouseHover', item.id)
}
/** 鼠标移除，仅触发一次 */
const onMouseleave = () => {
    // 编辑的时候不取消
    // console.log(props.isWidgetEdit);
    if (props.isWidgetEdit) {
        return
    }
    // if (browserEnv.value == BROWSER_ENV.mobile || widgetEditor.value) return;
    visibleActionId.value = ''
    emits('mouseHover', '')
}

const id = inject('movingWidgetId')

</script>

<style lang="scss" scoped>
.grid-stack-item {

    .thisarea {
        height: 100%;
    }

    .grid-stack-item-content {
        overflow: unset;
        border: 1px solid #eee;
        border-radius: 20px;

    }

}
</style>