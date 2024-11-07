<template>
    <ModuleHander :item="item" v-if="browserEnv === BROWSER_ENV.desktop">
        <template #content>
            <ModuleResize @onResize="onEdit" :item="item"></ModuleResize>
            <el-divider direction="vertical" class="!mx-2" />
            <module-font-style :item="item" @onEdit="onEdit"></module-font-style>
            <el-divider direction="vertical" class="!mx-2" />
            <ModuleAddLink :item="item" @onEdit="onEdit"></ModuleAddLink>
        </template>
    </ModuleHander>
    <ModuleHander :item="item" v-if="browserEnv === BROWSER_ENV.mobile">
        <template #content v-if="!touchEdit">
            <MoudleMobileBase @onOk="(type: EDIT_TYPE.select) => onEdit(item, type)">
                <ModuleResize @onResize="onEdit" :item="item"></ModuleResize>
            </MoudleMobileBase>
        </template>
        <template #content v-else>
            <module-font-style :item="item" @onEdit="onEdit"></module-font-style>
        </template>
    </ModuleHander>

</template>

<script setup lang="ts">
import { ElDivider } from 'element-plus'
import ModuleHander from '../module-handler/index.vue'
import ModuleResize from '../module-handler/resize/index.vue'
import ModuleFontStyle from '../module-handler/font-style/index.vue'
import ModuleAddLink from '../module-handler/add-link/index.vue'
import MoudleMobileBase from '../module-handler/mobile-base/index.vue'
import { PropType, inject } from 'vue'
import { type IUserAppItem, BROWSER_ENV, EDIT_TYPE } from '@beetr/constant'

const browserEnv = inject('browserEnv',) as keyof typeof BROWSER_ENV
console.log(browserEnv);
defineProps({
    /** 当前激活的item */
    item: {
        type: Object as PropType<IUserAppItem>,
        required: true,
    },
    touchEdit: {
        type: Boolean,
        default: false
    }

})

const emit = defineEmits<{
    (e: 'onEdit', item: IUserAppItem, type: keyof typeof EDIT_TYPE): void
}>()



const onEdit = (item: IUserAppItem, type: keyof typeof EDIT_TYPE) => {
    emit('onEdit', item, type)
}


</script>