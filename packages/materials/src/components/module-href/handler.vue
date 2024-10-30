<template>
    <ModuleHander :item="item">
        <template #content>
            <ModuleResize @onResize="onEdit" :item="item"></ModuleResize>
            <el-divider direction="vertical" class="!mx-2" />
            <ModuleAddLink :item="item" @onEditing="onEditing" @on-edit="onEdit"></ModuleAddLink>
        </template>
    </ModuleHander>

</template>

<script setup lang="ts">
import { ElDivider } from 'element-plus'
import ModuleHander from '../module-handler/index.vue'
import ModuleResize from '../module-handler/resize/index.vue'
import ModuleAddLink from '../module-handler/add-link/index.vue'
import { PropType } from 'vue'
import { type IUserAppItem, EDIT_TYPE, MESSAGE_TYPE } from '@beetr/constant'
defineProps({
    /** 当前激活的item */
    item: {
        type: Object as PropType<IUserAppItem>,
        required: true,
    },
    /** 当前激活的id */

})

const emit = defineEmits<{
    (e: 'onEdit', item: IUserAppItem, type: keyof typeof EDIT_TYPE, messaggeType: MESSAGE_TYPE): void
    (e: 'onEditing', isEditing: boolean,): void
}>()



const onEdit = (item: IUserAppItem, type: keyof typeof EDIT_TYPE) => {
    emit('onEdit', item, type, MESSAGE_TYPE.edit)
}

const onEditing = (isEditing: boolean) => {
    emit('onEditing', isEditing)
}



</script>