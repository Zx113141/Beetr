<template>
    <div ref="rotateZ" class="widget_base-rich-text"
        :class="[`widget_base-${item.cusStyle[deviceEnv].w}x${item.cusStyle[deviceEnv].h}`]" :style="`
      --widget-color: ${item.widgetColor};
      --widget-color-bg: ${item.bgColor || '#ffffff'};
      --widget-color-hover: ${item.widgetColorHover};
      --widget-color-active: ${item.widgetColorActive};
      border:${item.temType ? '0' : ''}
      `" @click="visitJump">

        <!-- 富文本 -->

        <div ref="scrollRef" class="rich_wrap no-scrollbar" :class="{ isEditing: isFocusing }">

            <div class="rich_wrap-padding">
                <div class="rich_wrap-cont"
                    :class="{ mobile: deviceEnv == BROWSER_ENV.mobile, isEditing: isFocusing, noEdit: !isEdit, }"
                    :style="`justify-content: ${item.halign?.[deviceEnv]};text-align: ${TEXT_ALIGN[item.halign?.[deviceEnv] as keyof typeof TEXT_ALIGN || 'flex-start']
                        };align-items: ${item.valign?.[deviceEnv]}${computedStyle(item.bgColor)}`"
                    @click="onSetBlur(true, isFocusing)" @dragover="imgDragover($event)">
                    <editor-content :editor="content" class="w-full" />
                </div>
            </div>
        </div>

        <!-- 存在链接时显示箭头 -->
        <div v-if="item.url"
            class="absolute top-[14px] right-[14px] flex items-center justify-center rounded-full bg-black/20 backdrop-blur-[8px] w-[22px] h-[22px]">
            <SvgArrow></SvgArrow>
        </div>
        <Transition name="slide-fade">
            <div class="prevent" v-if="item.temType" @drag.stop @touchstart.stop @mousedown.stop @click="preventMethod">
                <div>
                    <div class="icon">
                        <img src="./T.svg" class="svg" alt="">
                    </div>
                    <div class="words">
                        添加文本
                    </div>
                </div>
                <img src="./add.png" class="addpng" alt="">
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, nextTick, inject, computed } from 'vue'

import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { type IUserAppItem, BROWSER_ENV, SvgArrow, colorList } from '@beetr/constant'
import { debounce } from '@beetr/hooks'
import { generate } from '@ant-design/colors'

// // init 
const rotateZ = ref<HTMLDivElement | null>(null)

const deviceEnv = inject<keyof typeof BROWSER_ENV>('deviceEnv',)!
const isEdit = inject<boolean>('editStatus')
const props = defineProps<{
    item: IUserAppItem,
    hover: boolean
}>()
const emits = defineEmits(["onFakeClick", 'onEdit'])
const { item } = toRefs(props)
/** justify-content与text-align值转换 */
const TEXT_ALIGN = {
    'flex-start': 'left',
    center: 'center',
    'flex-end': 'right',
}
console.log(props.hover);
/** 是否正在编辑 */
const isFocusing = ref(false)
var timer: any = null
/** 用户名称 🎉 */
const content = useEditor({
    content: item.value?.content,
    editable: !item.value?.content && !!isEdit,
    extensions: [
        StarterKit,
        Placeholder.configure({
            placeholder: '添加笔记...',
        }),
    ],
    // 监听编辑器任何变化
    onUpdate({ editor }) {
        const content = editor.getHTML()
        if (content == "<p></p>") {
            return
        }
        if (content == item.value.content) {
            return
        }
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            item.value.content = content
            if (item.value.temType) {
                return
            }
            // debugger
            emits('onEdit', item.value,);
        }, 600);
        // item.value.content = content
        // widgetStore.onUpdate([item.value])
    },
    onFocus() {
        // The editor is focused.
    },
    onBlur() {
        // 如果编辑中不做处理
        // if (browserEnv.value == BROWSER_ENV.mobile && props.edit && isFocusing.value) {
        //     // content.value!.commands.focus('end')
        //     return
        // }
        // The editor isn’t focused anymore.
        content.value!.commands.blur()
        const fn = () => {
            const { scrollTop } = scrollRef.value!
            const DISTANCE = 15
            if (scrollTop > DISTANCE) {
                scrollRef.value!.scrollTop = scrollTop - DISTANCE
                requestAnimationFrame(fn)
            } else {
                scrollRef.value!.scrollTop = 0
                isEdit && content.value!.setEditable(true)
                isFocusing.value = false
            }
        }
        requestAnimationFrame(fn)
    },
})

/** 手动设置焦点 */
const onSetBlur = async (focusing: boolean, force = false) => {
    // 手机端不设置焦点
    if (deviceEnv == BROWSER_ENV.mobile && !force) return
    isFocusing.value = focusing
    await nextTick()
    const fn = () => {
        const { scrollTop, scrollHeight, offsetHeight } = scrollRef.value!
        const DISTANCE = 15
        if (scrollTop + DISTANCE <= scrollHeight - offsetHeight) {
            scrollRef.value!.scrollTop = scrollTop + DISTANCE
            requestAnimationFrame(fn)
        } else {
            scrollRef.value!.scrollTop = scrollHeight - offsetHeight
            isEdit && content.value!.setEditable(isFocusing.value)
            isEdit && content.value!.commands.focus('end')
        }
    }
    requestAnimationFrame(fn)
}

/** 滚动的钩子 */
const scrollRef = ref<HTMLElement>()

const imgDragover = (event: Event) => {
    event.preventDefault()
}
const preventMethod = debounce(() => {
    if (!isEdit) return
    rotateZ.value?.classList.add('rotateZ')
    emits("onFakeClick", item.value)
}, 50)
const visitJump = () => {

    if (isEdit || !item.value.url) return
    window.open(item.value.url)
}

const computedStyle = computed(() => {
    return (colo?: string) => {
        const primaryColor = colorList.find(col => col.bgColor == colo)
        let bgColor: string = ''
        if (!colo) [
            colo = '#FFFFFF'
        ]
        if (colo == '#FFFFFF') {
            bgColor = '#F0f0f0'
        } else {
            bgColor = generate(colo)[4]
        }

        // console.log(color)
        let str = primaryColor ? `color: ${primaryColor?.color} !important;` : ''
        if (props.hover) {
            // console.log(str + `background-color:${color?.bgColor}33 !important;`);
            return str + `background-color:${bgColor} !important;`
        }
        return str
    }
})

</script>

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


    border-radius: 20px;
    border: 2px dashed rgba(0, 0, 0, .08);
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    .icon {
        width: 24px;
        height: 24px;
        opacity: 1;
        border-radius: 8px;
        margin: 0 auto;
        background: rgba(0, 199, 151, 1);
        display: flex;
        align-items: center;
        justify-content: center;

        .svg {
            width: 11.44px;
            height: 13.2px;
        }
    }

    .words {
        font-size: 14px;
        font-weight: 500;
        letter-spacing: 1px;
        line-height: 20.27px;

        margin-top: 3px;
    }

    .addpng {
        position: absolute;
        top: 22px;
        right: 22px;
        width: 14px;
    }
}

.widget_base-rich-text {
    --widget-color: #000;
    --widget-color-bg: #fff;
    --widget-color-hover: #fbfbfb;
    --widget-color-active: #efefef;
    --widget-color-bg-current: var(--widget-color-bg);
    position: relative;
    display: flex;
    width: 100%;
    overflow: hidden;
    height: 100%;

    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
    border-radius: 20px;
    // background-color: var(--widget-color-bg);
    background-color: transparent;
    white-space: break-spaces;
    // transition: box-shadow 0.2s ease-in-out, transform 0.24s cubic-bezier(0.43, 0.01, 0.29, 1),
    //   background 0.2s cubic-bezier(0.43, 0.01, 0.29, 1), opacity 0.24s ease-in-out,
    //   filter 0.24s ease-in-out;

    .init_progress {
        :deep(.el-progress-circle__track) {
            stroke: #000;
        }
    }

    .rich_wrap {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        border-radius: inherit;
        overflow: hidden;
        font-weight: 400;
        --widget-unit-w: 1;
        --widget-unit-h: 1;
        font-size: calc(var(--widget-unit-h) * 20px);
        line-height: calc(var(--widget-unit-h) * 26px);


        &.isEditing {
            overflow: auto;
        }

        .rich_wrap-padding {
            position: relative;
            display: flex;
            min-height: 100%;
            flex-direction: column;
            position: relative;
            padding: calc(var(--widget-unit-h) * 12px) calc(var(--widget-unit-w) * 12px);
            background-color: var(--widget-color-bg);

            .rich_wrap-cont {
                --bg: #f0f0f0;
                --text: #000;
                position: relative;
                display: flex;
                flex: 1 1 0%;
                transition: background-color 0.3s, opacity 0ms;
                padding: calc(var(--widget-unit-h) * 12px) calc(var(--widget-unit-w) * 12px);
                text-align: left;
                // align-items: center;
                cursor: text;
                border-radius: 12px;

                &.mobile {
                    pointer-events: none;
                    cursor: text;

                    .section_container {
                        width: 100%;
                    }

                    &:hover {
                        background: none !important;
                    }
                }

                &.isEditing,
                &:hover {
                    pointer-events: auto;
                    cursor: auto;
                    // @include background_color('hoverBackgroundColor');
                }
            }

            .noEdit {
                &:hover {
                    background-color: #fff;
                }
            }
        }
    }

    &.widget_base-4x1 {
        border-radius: 20px;

        .rich_wrap .rich_wrap-padding .rich_wrap-cont {
            padding: 8px 12px;
        }
    }
}

:deep(.ProseMirror) {
    outline: 2px solid transparent;
    outline-offset: 2px;
    width: 100%;

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
</style>