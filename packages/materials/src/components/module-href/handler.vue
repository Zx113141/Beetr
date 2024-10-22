<template>
    <ModuleHander :item="item" :visible-action-id="visibleActionId">
        <template #content>
            <ModuleResize @onResize="onEdit" :item="item"></ModuleResize>
        </template>
    </ModuleHander>

</template>

<script setup lang="ts">
import ModuleHander from '../module-handler/index.vue'
import ModuleResize from '../module-handler/resize/index.vue'
import { PropType } from 'vue'
import { type IUserAppItem, EDIT_TYPE } from '@beetr/constant'
defineProps({
    /** 当前激活的item */
    item: {
        type: Object as PropType<IUserAppItem>,
        required: true,
    },
    /** 当前激活的id */
    visibleActionId: {
        type: String,
        required: true,
    },
})

const emit = defineEmits<{
    (e: 'onEdit', item: IUserAppItem, type: keyof typeof EDIT_TYPE): void
    (e: 'onEditing', isEditing: boolean): void
}>()



const onEdit = (item: IUserAppItem, type: keyof typeof EDIT_TYPE) => {
    emit('onEdit', item, type)
}

const onEditing = (isEditing: boolean) => {
    emit('onEditing', isEditing)
}


</script>