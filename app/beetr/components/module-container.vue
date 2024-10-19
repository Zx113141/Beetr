<template>

    <div class="relative flex min-h-screen w-full flex-1 flex-col items-center browser-desktop">
        <!-- 左边栏 -->
        <div
            class="flex h-full w-full max-w-[428px] items-center justify-center p-6 pt-12 pb-0 xl:absolute xl:top-0 xl:max-w-[min(100vw,1728px)] xl:items-stretch xl:justify-start xl:p-16">
        </div>
        <!-- grid网格 - 手机端初始化的时候不显示，mextType > 0 的时候才 -->
        <div
            class="xl:flex flex h-full w-full max-w-[428px] flex-1 flex-col pt-0 xl:max-w-[1728px] xl:flex-row xl:p-16 xl:overflow-hidden">
            <div class="mb-10 flex flex-col px-4 xl:mb-0 xl:mr-20 xl:flex-1 xl:px-0"></div>
            <grid-container :env="deviceEnv" ref="gridRef">
                <grid-widget v-for="item in userAppList " :item="item" :key="item.id" :env="deviceEnv"
                    :isWidgetEdit="editObject.isEditing" @mouseHover="onHover">
                    <div class="wiget_size_item_container">
                        <component :is="components[item.type]" :item="item" @onEdit="onModuleEdit" :env="deviceEnv"
                            :isEdit="isCurrentUser"></component>
                        <grid-resize :env="deviceEnv" :visible-action-id="editObject.visibleActionId" :item="item"
                            @onEdit="onWidgetEdit" @onEditing="onEditing">
                        </grid-resize>
                        <grid-delete :visible-action-id="editObject.visibleActionId" :item="item" @remove="onRemove">
                        </grid-delete>
                    </div>
                </grid-widget>

            </grid-container>
        </div>
    </div>

</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { type IUserAppItem, type ENV_ENUM, STEP_PROCESS, BROWSER_ENV } from '@beetr/constant';
import { GridContainer, GridWidget, GridResize, GridDelete } from '@beetr/engine';
import { ModuleNote, } from '@beetr/materials'
import { _userStore } from '~/store/user';
import { _widgetStore } from '~/store/widget';
import { _envStore } from '~/store/env';

const props = defineProps<{
    deviceEnv: keyof typeof BROWSER_ENV
}>()

const userStore = _userStore()
const widgetStore = _widgetStore()
const { userAppList, } = storeToRefs(widgetStore)
const editObject = reactive({
    visibleActionId: '', // 激活widget id
    isEditing: false // 是否正在编辑
})
const isCurrentUser = ref(true)
// grid instance 
const gridRef = ref<InstanceType<typeof GridContainer> | null>(null)

const components = markRaw<any>({
    'rich-text': ModuleNote,
    // 'section-header': ModuleTitle,
    // 'video': ModuleMedia
})


// console.log(ModuleWidgetResize)


const onHover = (id: string) => {
    editObject.visibleActionId = id
}

const onModuleEdit = (item, type) => {

}

const onRemove = () => {

}
const onWidgetResize = (item: IUserAppItem) => {

    const el = document.getElementById(`w_${item.id}`)

    gridRef!.value!.updateWidget({
        el,
        width: item.cusStyle[deviceEnv.value].w,
        height: item.cusStyle[deviceEnv.value].h,
        id: item.id
    })
}
const onWidgetEdit = (item: IUserAppItem, type) => {
    switch (type) {
        case 'resize':
            onWidgetResize(item);
            break;
        case 'normal':
            onWidgetNormalEdit(item);
            break;
    }
}

const onWidgetNormalEdit = () => {

}

const onEditing = (isEdit: boolean) => {
    editObject.isEditing = isEdit
}


</script>

<style lang="scss" scoped>
.wiget_size_item_container {
    height: 100%;
    position: relative;
}
</style>