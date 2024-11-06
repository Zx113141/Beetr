<script setup lang="ts">
import { useEditor, EditorContent, type Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { type IUserAppItem, BROWSER_ENV, SvgSectionTitle } from '@beetr/constant'
import { debounce } from '@beetr/hooks'
import { inject, toRefs, ref, computed, watch, reactive } from 'vue'
const deviceEnv = inject<keyof typeof BROWSER_ENV>('deviceEnv',)!
const browserEnv = inject<keyof typeof BROWSER_ENV>('browserEnv',)!
const isEdit = inject<boolean>('editStatus')

const props = defineProps<{ item: IUserAppItem, }>()
const { item } = toRefs(props)
const emits = defineEmits(["onEdit",])
/** 用户名称 🎉 */
var timer: any = null
let heightRatio = 1
const content = useEditor({
    content: item.value?.content,
    editable: !!isEdit,
    extensions: [
        StarterKit,
        Placeholder.configure({
            placeholder: '添加标题...',
        }),
    ],
    // 监听编辑器任何变化
    onUpdate: debounce(({ editor }: any) => {
        const content = editor.getHTML()
        console.log('onUpdate', content, item.value?.content);
        if (content === item.value?.content) return
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            item.value.content = content
            if (item.value.temType) {
                return
            }
            onResize(editor)
        }, 600);

    }, 500),
    onFocus() {
        onUpdate.value = true
    },
    onBlur() {
        onUpdate.value = false
    }
})

const onUpdate = ref(false)

const onResize = (editor: any) => {
    // const { height } = editor.view.dom.getBoundingClientRect()
    // const stackItem = document.getElementById(`title_${props.item.id}`) as HTMLDivElement
    // const { height: stackHeight } = stackItem.getBoundingClientRect()
    // const padding = parseFloat(getComputedStyle(stackItem).paddingTop)
    // const ratio = Math.ceil(height / (stackHeight - padding * 2))

    // if (!editor.getText()) {
    //     heightRatio = 1
    //     emits('onResize', heightRatio)
    // }
    // if (ratio == 2) {
    //     heightRatio += 1
    //     emits('onResize', heightRatio)
    // } else if (ratio > 2) {
    //     heightRatio += ratio
    //     emits('onResize', heightRatio)
    // } else {
    //     heightRatio = 1
    //     emits('onResize', heightRatio)
    // }
    emits('onEdit', item.value)
    // widgetStore.onUpdate([item.value])
}
// 加入防抖
const preventMethod = debounce(() => {
    if (!isEdit) return
    // 根据 isSwiping 变量来判断用户是滑动还是点击
    if (!touchState.isMoving) {
        // 执行点击操作
        emits("onEdit", item.value)
    }
    // 重置 isMoving 变量
    touchState.isMoving = false;
}, 50)
const visitJump = () => {
    if (isEdit || !item.value.url) return
    window.open(item.value.url)
}
// 监听更新
watch(
    () => item.value.content,
    (val) => {
        if (onUpdate.value) return
        console.log('监听更新 - 需要做来源空值', val);
        // 清理内容
        content.value!.commands.clearContent()
        content.value!.commands.setContent(val || '')
        content.value!.commands.blur()
        //
        onResize(content.value)
    }
)

// 操作前检查
const touchState = reactive({
    startX: 0,
    startY: 0,
    isMoving: false
})
// const onTouchStart = (event: any) => {
//     // 记录触摸起始位置
//     touchState.startX = event.touches[0].clientX;
//     touchState.startY = event.touches[0].clientY;
// }
// const onTouchMove = (event: any) => {
//     // 如果触摸移动距离超过一定阈值，则认为是滑动
//     const threshold = 10; // 阈值，根据实际需求调整
//     const deltaX = Math.abs(event.touches[0].clientX - touchState.startX);
//     const deltaY = Math.abs(event.touches[0].clientY - touchState.startY);
//     if (deltaX > threshold || deltaY > threshold) {
//         touchState.isMoving = true;
//     }
// }
</script>

<template>
    <div :class="{
        section: true,
        temStyle: item.temType || !isEdit ? true : false,
        mobile: browserEnv == BROWSER_ENV.mobile,
        hover: isEdit
    }" @click="visitJump" :id="`title_${item.id}`">
        <!-- 在桌面浏览器才允许编辑 -->
        <div
            :class="isEdit && browserEnv == BROWSER_ENV.desktop ? 'section_container' : 'section_container noedit_section_container'">
            <editor-content :editor="content" />
        </div>
        <Transition name="slide-fade">
            <div class="prevent" v-if="item.temType" @drag.stop @touchstart.stop @mousedown.stop @click="preventMethod">
                <div>
                    <div class="icon">
                        <el-icon color="#000">
                            <SvgSectionTitle />
                        </el-icon>
                    </div>
                    <div class="words">
                        添加标题
                    </div>
                </div>
                <img src="./add.png" class="addpng" alt="">
            </div>
        </Transition>
    </div>
</template>

<style lang="scss" scoped>
.slide-fade-enter-active {
    transition: all 0s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.5s linear;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: scale(0.1);
    opacity: 0;
}

.prevent {
    width: 100%;
    height: 100%;
    border-radius: 20px;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    // @include background_color('moduleBlockBackgrouundColor');
    z-index: 99;
    border: 2px dashed rgba(0, 0, 0, .08);

    .icon {
        width: 24px;
        height: 24px;
        opacity: 1;
        border-radius: 8px;
        margin: 0 auto;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .words {
        font-size: 14px;
        font-weight: 500;
        letter-spacing: 1px;
        line-height: 20.27px;
        // @include font_color('moduleBlockColor');
        margin-top: 3px;
    }

    .addpng {
        position: absolute;
        top: 22px;
        right: 22px;
        width: 14px;
    }
}

.hover:hover {
    z-index: 20;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
    border: 2px solid rgba(0, 0, 0, 0.08);

}

.section {
    // border: 2px solid rgba(0, 0, 0, 0.08);
    // @include font_color('moduleTitleColor');
    // @include background_color('moduleBlockBackgrouundColor');
    border-radius: 20px;
    --radius-unit: 1;
    --widget-color: #000;
    --widget-color-bg: #fff;
    height: 100%;
    --widget-color-hover: #fbfbfb;
    --widget-color-active: #efefef;
    --widget-color-bg-current: var(--widget-color-bg);
    position: relative;
    display: flex;
    width: 100%;
    // flex: 1 1 0%;
    background-color: var(--widget-color-bg);
    border-radius: var(--widget-radius);
    white-space: break-spaces;
    -webkit-tap-highlight-color: transparent;
    // transition: box-shadow 0.2s ease-in-out, transform 0.24s cubic-bezier(0.43, 0.01, 0.29, 1),
    //   background 0.2s cubic-bezier(0.43, 0.01, 0.29, 1), opacity 0.24s ease-in-out,
    //   filter 0.24s ease-in-out;
    padding: 1rem;
    font-size: 1.125rem;
    line-height: 1.75rem;
    font-weight: 600;
    border-radius: 16px;


    &.mobile {
        .section_container {
            width: 100%;
        }

        &:hover {
            background: none !important;
        }
    }

    .section_container {
        min-width: 150px;
        border-radius: 10px;
        overflow: hidden;
        position: relative;
        z-index: 5;
        margin: -0.5rem;
        cursor: text !important;
        padding: 0.5rem;

        &:hover {
            // @include background_color('hoverBackgroundColor');
        }
    }

    .noedit_section_container {
        pointer-events: none;
        cursor: text;

        &:hover {
            background-color: #fff;
        }
    }

    @media (min-width: 1280px) {
        .section_container {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
        }
    }
}

:deep(.ProseMirror) {
    outline: 2px solid transparent;
    outline-offset: 2px;
    // max-height: 56px;
    /* 设置为您希望的最大高度 */
    // overflow: hidden;

    .is-empty {
        position: relative;
    }

    .is-empty:before {
        content: attr(data-placeholder);
        pointer-events: none;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        white-space: nowrap;
        opacity: 0.3;
    }
}

.temStyle {
    width: 100%;
    border-radius: 20px;
    height: 100%;
    box-sizing: border-box;
    position: relative;
    overflow: inherit;
    border: 0;
}
</style>
