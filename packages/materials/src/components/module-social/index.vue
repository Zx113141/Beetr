<template>
    <ModuleHrefDescription :is-edit="isEdit" :item="item" :env="env" @finish="finish"></ModuleHrefDescription>
    <ModuleHrefFrame :is-edit="isEdit" :item="item" :env="env"></ModuleHrefFrame>
</template>

<script lang="ts" setup>
import { IUserAppItem, ENV_ENUM } from '@beetr/constant'
import ModuleHrefDescription from '../module-href/description/index.vue'
import ModuleHrefFrame from '../module-href/frame-container/index.vue'
const props = defineProps<{
    item: IUserAppItem,
    env: keyof typeof ENV_ENUM,
    isEdit: boolean
}>()

const emits = defineEmits(['finish'])

const finish = (item: IUserAppItem) => {
    emits('finish', item)
}
</script>