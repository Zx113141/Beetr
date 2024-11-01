<template>
    <div :item="item" v-if="browserEnv === BROWSER_ENV.desktop">

    </div>
    <ModuleHander :item="item" v-if="browserEnv === BROWSER_ENV.mobile">
        <template #content>
            <MoudleMobileBase @onOk="(type: EDIT_TYPE.select) => onEdit(item, type)">
                <div class=" flex-1 flex items-center">
                    <p class="ml-4 text-base text-white">分组标题</p>
                </div>
            </MoudleMobileBase>
        </template>
    </ModuleHander>

</template>

<script setup lang="ts">
import ModuleHander from '../module-handler/index.vue'
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