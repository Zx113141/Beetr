<!-- v-if="item.type === WIDGET_TYPE.richText" -->
<template>
    <el-popover v-model:visible="activeRichTextOpera" trigger="click" popper-style="background-color:#000 !important;"
        popper-class="!p-[6px] !bg-black !rounded-[10px] !border-none" width="auto" @before-enter="onHideRichText"
        :teleported="false">
        <div class="flex items-center cursor-auto media_opera">
            <!-- 水平方向 -->
            <button v-for="(child, index) in xList" :key="index"
                class="rounded-[4px] outline-none disabled:text-white disabled:text-opacity-40 active:scale-90" :class="(item.halign?.[deviceEnv] || xList[0].justifyContent) ===
                    child.justifyContent
                    ? `active`
                    : ``
                    " @click="updatePositionX(child.justifyContent)">
                <component :is="child.component"></component>
            </button>
            <!-- 分割线 -->
            <el-divider direction="vertical" class="!mx-2" />
            <!-- 垂直方向 -->
            <button v-for="(child, index) in yList" :key="index"
                class="rounded-[4px] outline-none disabled:text-white disabled:text-opacity-40 active:scale-90" :class="(item.valign?.[deviceEnv] || yList[0].alignItems) === child.alignItems
                    ? `active`
                    : ``
                    " @click="updatePositionY(child.alignItems)">
                <component :is="child.component"></component>
            </button>

            <el-divider direction="vertical" class="!mx-2" />
            <!-- 颜色组件 -->
            <button class="rounded-[4px] outline-none disabled:text-white disabled:text-opacity-40 active:scale-90"
                :class="activeBgColor ? `active` : ``" @click="onShowColorPanel">
                <div class="rounded-full w-[18px] h-[18px]" :style="`background: ${item.bgColor || WHITE_COLOR[0]};
                                                      border: 1px solid ${WHITE_COLOR.includes(item.bgColor || WHITE_COLOR[0])
                        ? 'rgba(0, 0, 0, 0.12)'
                        : 'rgba(255, 255, 255, 0.2)'
                    }
    `"></div>
            </button>
        </div>
        <div v-if="activeBgColor" class="submenu-colors">
            <!-- 颜色列表 -->
            <button v-for="color in colorList" :key="color.bgColor"
                class="rounded-[4px] outline-none disabled:text-white disabled:text-opacity-40 active:scale-90"
                :class="item.bgColor === color.bgColor ? `active` : ``" @click="updateColor(color.bgColor)">
                <div class="rounded-full w-[18px] h-[18px]" :style="`background: ${color.bgColor || WHITE_COLOR[0]};
                                                      border: 1px solid ${WHITE_COLOR.includes(item.bgColor || WHITE_COLOR[0])
                        ? 'rgba(0, 0, 0, 0.12)'
                        : 'rgba(255, 255, 255, 0.2)'
                    }
    `"></div>
            </button>
        </div>
        <div v-if="activeBgColor">
            <el-input v-model="activeColor" size="small" class="init_link-input" placeholder="#768CFF"
                @change="updateColorByInput"></el-input>
        </div>

        <template #reference>
            <!-- 操作按钮 -->
            <button class="rounded-[4px] outline-none disabled:text-white disabled:text-opacity-40 active:scale-90 flex"
                :class="activeRichTextOpera ? `active` : ``">
                <el-icon :color="activeRichTextOpera ? '#000000' : '#ffffff'" size="1em">
                    <MoreFilled />
                </el-icon>
            </button>
        </template>
    </el-popover>
</template>

<script setup lang="ts">

import { ref, toRefs, watch, inject } from 'vue'

import { ElIcon } from 'element-plus'
import {
    SvgXLeft,
    SvgXCenter, SvgXRight, SvgYTop, SvgYMiddle, SvgYBottom,
    WHITE_COLOR, colorList, EXG_COLOR,
    type IUserAppItem, ENV_ENUM,
    EDIT_TYPE
} from '@beetr/constant'

import { MoreFilled } from '@element-plus/icons-vue'


const props = defineProps<{
    item: IUserAppItem,

}>()
const deviceEnv = inject<keyof typeof ENV_ENUM>('deviceEnv') as keyof typeof ENV_ENUM
const emit = defineEmits<{
    (e: 'onEdit', item: IUserAppItem, type: keyof typeof EDIT_TYPE): void
}>()

const { item } = toRefs(props)
/** 是否颜色面板 */
const activeBgColor = ref(false)
/** 颜色面板中的自定义值 */
const activeColor = ref('')
const xList = [
    {
        component: SvgXLeft,
        textAlign: 'left',
        justifyContent: 'flex-start',
    },
    {
        component: SvgXCenter,
        textAlign: 'center',
        justifyContent: 'center',
    },
    {
        component: SvgXRight,
        textAlign: 'right',
        justifyContent: 'flex-end',
    },
]

const yList = [
    {
        component: SvgYTop,
        alignItems: 'flex-start',
    },
    {
        component: SvgYMiddle,
        alignItems: 'center',
    },
    {
        component: SvgYBottom,
        alignItems: 'flex-end',
    },
]

/** 是否rich-text操作栏 */
const activeRichTextOpera = ref(false)

/** 更新x轴 */
const updatePositionX = (value: string) => {
    const halign = item.value.halign || {}
    halign[deviceEnv] = value
    item.value.halign = halign
    emit('onEdit', item.value, EDIT_TYPE.normal)
    // widgetStore.onUpdate([item.value])
}

/** 更新y轴 */
const updatePositionY = (value: string) => {
    const valign = item.value.valign || {}
    valign[deviceEnv] = value
    item.value.valign = valign
    emit('onEdit', item.value, EDIT_TYPE.normal)
    // widgetStore.onUpdate([item.value])
}

/** 更新组件颜色 */
const updateColor = (color: string) => {
    item.value.bgColor = color
    emit('onEdit', item.value, EDIT_TYPE.normal)
    // widgetStore.onUpdate([item.value])
}

/** 校验颜色值是否合法 */
const updateColorByInput = (value: string) => {
    if (EXG_COLOR.test(value)) {
        item.value.bgColor = value
        emit('onEdit', item.value, EDIT_TYPE.normal)
    }
    // widgetStore.onUpdate([item.value])
}

/** rich-text 操作弹窗关闭 */
const onHideRichText = () => {
    activeBgColor.value = false
    activeColor.value = ''
}
const onShowColorPanel = () => {

    activeBgColor.value = !activeBgColor.value
    activeColor.value = ''
}



</script>

<style lang="scss" scoped>
button {
    padding: 0.25rem !important;
    transition: transform 0.1s cubic-bezier(0.427, 0.073, 0.105, 0.997),
        color 0.1s cubic-bezier(0.427, 0.073, 0.105, 0.997);
    @apply text-white active:bg-white active:bg-opacity-30 active:text-white;

    &.active {
        @apply bg-white text-black hover:bg-white active:bg-white active:opacity-80;
    }

    &+button {
        margin-left: 0.375rem;
    }
}

.submenu-colors {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(8, minmax(0, 1fr));
    align-items: flex-start;
    justify-content: space-between;
    justify-items: center;
    gap: 0.125rem;
    padding: 0.375rem;
    pointer-events: auto;
}
</style>