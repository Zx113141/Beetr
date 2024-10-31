<template>
    <div :id="`w_${item.id}`" :key="`w_${item.id}`" :gs-id="`w_${item.id}`" :gs-w="item.cusStyle[browserEnv].w"
        :gs-h="item.cusStyle[browserEnv].h" :gs-x="item.position[browserEnv].x" :gs-y="item.position[browserEnv].y"
        :class="{
            'grid-stack-item': true,
            'pointer-events-none': id == item.id
        }" :style="item.temType == 'addLink' ? 'z-index:11111' : ''">
        <div :class="{
            'grid-stack-item-content': true,
            active: isEdit && visibleActionId == item.id && browserEnv == BROWSER_ENV.mobile,
        }" @mouseenter="() => onMouseEnter(item)" @mouseleave="onMouseleave"
            @touchstart.capture="($event: TouchEvent) => onTouchStart($event, item)" @touchmove.capture="onTouchMove"
            @touchend.capture="($event: TouchEvent) => onTouchEnd(item)">
            <div class="thisarea" :id="`m_${item.id}`">
                <slot name="default"></slot>
                <div class="grid-item-action" v-if="showHanlder" :key="browserEnv">
                    <template>
                        <div v-if="browserEnv == BROWSER_ENV.desktop">
                            <GridItemRemove :item="props.item" :visibleActionId="visibleActionId" />
                            <teleport :to="teleportId">
                                <slot name="handler"></slot>
                            </teleport>
                        </div>
                    </template>
                    <template>
                        <div v-if="browserEnv == BROWSER_ENV.mobile">
                            <GridItemRemove :item="props.item" />
                            <teleport :to="teleportId">
                                <slot name="handler" :c="12"></slot>
                            </teleport>
                            <GridItemEdit :item="props.item" @edit="handleEdit" :edit="edit" />
                        </div>
                    </template>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, inject, reactive, computed, watch } from 'vue'
import { type IUserAppItem, BROWSER_ENV, EDIT_TYPE } from '@beetr/constant';
import GridItemEdit from '../grid-item-edit/index.vue'
import { BeetrModules, type IModule } from '@beetr/materials';
import GridItemRemove from '../grid-item-remove/index.vue'


const props = defineProps<{
    item: IUserAppItem,
    showHanlder: boolean
    handlerEditing: boolean
    // isWidgetEdit: boolean
}>()

const emits = defineEmits(['hover', 'handlerEdit', 'select'])
const id = inject('movingWidgetId')
const isEdit = inject('editStatus')
const browserEnv = inject('browserEnv')! as keyof typeof BROWSER_ENV
const onEmit = inject('onEmit') as (path: string, query: any) => void



const teleportId = computed(() => {
    return browserEnv == BROWSER_ENV.mobile ? '#dragUpload' : '#m_' + props.item.id
})
const edit = ref<boolean>(false)
const handleEdit = () => {
    edit.value = !edit.value
    const handler = BeetrModules.find((it: IModule) => it.name == props.item.type)
    if (handler && handler.drawer) {
        emits('handlerEdit', props.item, EDIT_TYPE.edit)
        return
    }


}

// 操作前检查
const touchState = reactive({
    startX: 0,
    startY: 0,
    isMoving: false
})


/** 是否显示操作栏 */
const visibleActionId = ref('')
/** 鼠标移入，仅触发一次 */
const onMouseEnter = (item: any) => {
    // 编辑的时候不重置
    if (props.handlerEditing) {
        return
    }
    // if (browserEnv.value == BROWSER_ENV.mobile || widgetEditor.value) return;
    visibleActionId.value = item.id
}
/** 鼠标移除，仅触发一次 */
const onMouseleave = () => {
    // 编辑的时候不取消
    if (props.handlerEditing) {
        return
    }
    // if (browserEnv.value == BROWSER_ENV.mobile || widgetEditor.value) return;
    visibleActionId.value = ''
}


const onTouchStart = (event: any, item: any) => {
    if (event.target.classList.contains('widget_move')) {
        // 记录触摸起始位置
        touchState.startX = event.touches[0].clientX;
        touchState.startY = event.touches[0].clientY;
        // 存在激活id且相等的时候激活移动
        onEmit('enableMove', visibleActionId.value != '' && visibleActionId.value == item.id)
        // grid.enableMove(visibleActionId.value != '' && visibleActionId.value == item.id)
        if (event.preventDefault) event.preventDefault()
        return false
    } else {
        // grid.enableMove(false)
        onEmit('enableMove', false)
    }
}

const onTouchMove = (event: any) => {
    // 如果触摸移动距离超过一定阈值，则认为是滑动
    const threshold = 10; // 阈值，根据实际需求调整
    const deltaX = Math.abs(event.touches[0].clientX - touchState.startX);
    const deltaY = Math.abs(event.touches[0].clientY - touchState.startY);
    if (deltaX > threshold || deltaY > threshold) {
        touchState.isMoving = true;
        // 移动中说明没变动
        if (visibleActionId.value != '') {

            // grid.enableMove(true)
            onEmit('enableMove', true)
        }
    }
}

const onTouchEnd = (item: any) => {
    // 根据 isSwiping 变量来判断用户是滑动还是点击
    if (!touchState.isMoving) {
        visibleActionId.value = item.id
        // 执行点击操作
        emits('select', item, EDIT_TYPE.select)
    }
    // 重置 isMoving 变量
    touchState.isMoving = false;
}

watch(() => visibleActionId.value, (newValue) => {

    emits('hover', newValue)
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

.pointer-events-none {
    pointer-events: none;
}

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