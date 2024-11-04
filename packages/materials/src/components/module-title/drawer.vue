<template>
    <div class=" bg-container2 text-primary5">
        <ModuleMobileDrawerHeader :browserEnv="browserEnv" @close="back" @finish="beforeClose">
        </ModuleMobileDrawerHeader>
        <div class="content">
            <div class="title">标题</div>
            <div class="inpArea section w-full min-h-[44px] h-auto">
                <!-- <input v-model="editDrawData.data.content" type="text" placeholder="输入需要修改的标题" /> -->
                <div class="section_container">
                    <editor-content :editor="content" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { toRefs, watch, ref } from 'vue'
import { BROWSER_ENV, IUserAppItem } from '@beetr/constant'
import ModuleMobileDrawerHeader from '../module-mobile-drawer-header/index.vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { debounce } from '@beetr/hooks'
const props = defineProps<{
    prop: any,
    browserEnv: keyof typeof BROWSER_ENV | undefined,
    data: IUserAppItem,
}>()
const emit = defineEmits(['finish', 'close'])
const editData = ref(props.data)
/** 编辑器 **/
const content = useEditor({
    content: props.data.content,
    editable: true,
    extensions: [
        StarterKit,
        Placeholder.configure({
            placeholder: '添加标题...',
        }),
    ],
    onUpdate: debounce(({ editor }: any) => {
        const content = editor.getHTML()
        editData.value.content = content
    }, 500)
})

const beforeClose = () => {

    emit('finish', editData.value)
}

const back = () => {
    emit('close', false)
}



</script>

<style lang="scss" scoped>
.inpArea {
    width: 100%;
    height: 50px;
    border-radius: 10px;
    background: rgba(247, 247, 247, 1);
    margin-bottom: 11px;
    padding-left: 12px;
    display: flex;
    align-items: center;
    box-sizing: border-box;

    &.h-auto {
        height: auto;
    }

    input {
        font-size: 14px;
        outline: none;
        width: 100%;
        background-color: transparent;
    }
}

.content {
    padding: 20px 30px 0 27px !important;
    // @include font_color('drawerBodyColor');
}

.section {
    position: relative;
    display: flex;
    width: 100%;
    white-space: break-spaces;
    -webkit-tap-highlight-color: transparent;
    // transition: box-shadow 0.2s ease-in-out, transform 0.24s cubic-bezier(0.43, 0.01, 0.29, 1),
    //   background 0.2s cubic-bezier(0.43, 0.01, 0.29, 1), opacity 0.24s ease-in-out,
    //   filter 0.24s ease-in-out;
    padding: 1rem;
    font-size: 1.125rem;
    line-height: 1.75rem;

    .section_container {
        border-radius: 10px;
        width: 100%;
        position: relative;
        z-index: 20;
        cursor: text !important;
        font-size: 14px;

        &:hover {
            //@include background_color('hoverBackgroundColor');
            background-color: transparent;
        }
    }

    .noedit_section_container {
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
</style>