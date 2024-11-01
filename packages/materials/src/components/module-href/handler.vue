<template>
    <ModuleHander :item="item" v-if="browserEnv === BROWSER_ENV.desktop">
        <template #content>
            <ModuleResize @onResize="onEdit" :item="item"></ModuleResize>
            <el-divider direction="vertical" class="!mx-2" />
            <ModuleAddLink :item="item" @on-edit="onEdit"></ModuleAddLink>
        </template>
    </ModuleHander>
    <ModuleHander :item="item" v-if="browserEnv === BROWSER_ENV.mobile">
        <template #content>
            <MoudleMobileBase @onOk="(type: EDIT_TYPE.select) => onEdit(item, type)">
                <ModuleResize @onResize="onEdit" :item="item"></ModuleResize>
            </MoudleMobileBase>
        </template>
    </ModuleHander>

</template>

<script setup lang="ts">
import { ElDivider } from 'element-plus'
import ModuleHander from '../module-handler/index.vue'
import ModuleResize from '../module-handler/resize/index.vue'
import ModuleAddLink from '../module-handler/add-link/index.vue'
import MoudleMobileBase from '../module-handler/mobile-base/index.vue'
import { PropType, inject } from 'vue'
import { type IUserAppItem, EDIT_TYPE, BROWSER_ENV } from '@beetr/constant'

const browserEnv = inject('browserEnv',) as keyof typeof BROWSER_ENV

defineProps({
    /** 当前激活的item */
    item: {
        type: Object as PropType<IUserAppItem>,
        required: true,
    },
    /** 当前激活的id */

})

const emit = defineEmits<{
    (e: 'onEdit', item: IUserAppItem, type: keyof typeof EDIT_TYPE): void
}>()



const onEdit = (item: IUserAppItem, type: keyof typeof EDIT_TYPE) => {
    emit('onEdit', item, type,)
}




</script>