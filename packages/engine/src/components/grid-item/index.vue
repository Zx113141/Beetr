<template>
    <div v-for="item in list" :key="item.id" :id="`w_${item.id}`" :gs-id="`w_${item.id}`"
        :gs-w="item.cusStyle[browserEnv].w" :gs-h="item.cusStyle[browserEnv].h" :gs-x="item.position[browserEnv].x"
        :gs-y="item.position[browserEnv].y" :class="{
            'grid-stack-item': true,
            'pointer-events-none': movingWidgetId == item.id
        }" :style="item.temType == 'addLink' ? 'z-index:11111' : ''">
        <div :class="{
            'grid-stack-item-content': true,
            active: showHandler(item) && browserEnv == BROWSER_ENV.mobile,
        }" @mouseenter="() => onMouseEnter(item)"
            @touchstart.capture="($event: TouchEvent) => onTouchStart($event, item)" @touchmove.capture="onTouchMove"
            @touchend.capture="($event: TouchEvent) => onTouchEnd(item)" id="grid-stack-item-content">
            <div class="thisarea" :id="`m_${item.id}`">
                <div class="wiget_size_item_container">
                    <component :is="ComponentsReflect[item.type].module" :item="item"
                        @onEdit="(item: IUserAppItem) => onWidgetEdit(item, EDIT_TYPE.normal)" :key="item.id"
                        :hover="activeWidgetId == item.id">
                    </component>
                </div>

                <div class="grid-item-action" v-if="showHandler(item)" :key="browserEnv">
                    <template v-if="browserEnv == BROWSER_ENV.desktop">
                        <GridItemRemove :item="item" @remove="() => remove(item)" />
                        <teleport :to="teleportId(item)">
                            <component :is="ComponentsReflect[item.type].Handler" :key="item.id" :item="item"
                                @onEdit="onWidgetEdit">
                            </component>
                        </teleport>
                    </template>
                    <template v-if="browserEnv == BROWSER_ENV.mobile">
                        <GridItemRemove :item="item" @remove="() => remove(item)" />
                        <teleport :to="teleportId(item)">
                            <component :is="ComponentsReflect[item.type].Handler" :key="item.id" :item="item"
                                @onEdit="onWidgetEdit">
                            </component>
                        </teleport>
                        <GridItemEdit :item="item" @edit="() => handleEdit(item)" :edit="edit" />
                    </template>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, inject, reactive, computed, watch, onMounted, Fragment } from 'vue'
import { type IUserAppItem, BROWSER_ENV, EDIT_TYPE } from '@beetr/constant';
import GridItemEdit from '../grid-item-edit/index.vue'
import { BeetrModules, type IModule } from '@beetr/materials';
import GridItemRemove from '../grid-item-remove/index.vue'
const ComponentsReflect: {
    [key: string]: IModule
} = {}
BeetrModules.forEach((item: any) => {
    ComponentsReflect[item.name] = item
    // ComponentsReflect.Handler = item.switchHandler(props.browserEnv)
});

const props = defineProps<{
    list: IUserAppItem[],
    activeWidgetId: string
    editStatus: boolean
    edit: boolean
}>()

const showHandler = computed(() => {
    return (item: IUserAppItem) => props.editStatus && item.id == props.activeWidgetId
})




const emits = defineEmits(['hover', 'widget-edit', 'select', 'editing', 'switch-edit'])
const movingWidgetId = inject('movingWidgetId')
const isEdit = inject('editStatus')
const browserEnv = inject('browserEnv')! as keyof typeof BROWSER_ENV
const onEmit = inject('onEmit') as (path: string, query: any) => void

// const edit = ref<boolean>(false)


const teleportId = computed(() => {
    return (item: IUserAppItem) => browserEnv == BROWSER_ENV.mobile ? '#layoutAddani' : '#m_' + item.id
})

const handleEdit = (item) => {
    // edit.value = !edit.value
    emits('switch-edit', !props.edit)
    const handler = BeetrModules.find((it: IModule) => it.name == item.type)
    if (handler && handler.drawer) {
        emits('widget-edit', item, EDIT_TYPE.edit)
        return
    }
}

// 操作前检查
const touchState = reactive({
    startX: 0,
    startY: 0,
    isMoving: false
})



/** 鼠标移入，仅触发一次 */
const onMouseEnter = (item: any) => {
    if (browserEnv == BROWSER_ENV.mobile) return;
    // 编辑的时候不重置
    emits('hover', item.id)
}


const onTouchStart = (event: any, item: any) => {
    emits('hover', item.id)
    if (event.target.classList.contains('widget_move')) {
        // 记录触摸起始位置
        touchState.startX = event.touches[0].clientX;
        touchState.startY = event.touches[0].clientY;
        // 存在激活id且相等的时候激活移动
        onEmit('enableMove', props.activeWidgetId != '' && props.activeWidgetId == item.id)
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
        if (props.activeWidgetId != '') {

            // grid.enableMove(true)
            onEmit('enableMove', true)
        }
    }
}

const onTouchEnd = (item: any) => {
    // 根据 isSwiping 变量来判断用户是滑动还是点击
    if (!touchState.isMoving) {
        // 执行点击操作
        emits('select', true, EDIT_TYPE.select)
    }
    // 重置 isMoving 变量
    touchState.isMoving = false;
}

const remove = (item) => {
    emits('widget-edit', item, EDIT_TYPE.remove)
}

const onWidgetEdit = (item, type) => {
    emits('widget-edit', item, type)
}




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

    .wiget_size_item_container {
        height: 100%;
    }

}
</style>