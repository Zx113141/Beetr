<template>
    <ModuleHrefDescription :item="item" @finish="finish"></ModuleHrefDescription>
    <ModuleHrefFrame :item="item"></ModuleHrefFrame>
</template>

<script lang="ts" setup>
import { IUserAppItem, ENV_ENUM } from '@beetr/constant'
import ModuleHrefDescription from '../module-href/description/index.vue'
import ModuleHrefFrame from '../module-href/frame-container/index.vue'

defineProps<{
    item: IUserAppItem,
}>()
const emits = defineEmits(['finish'])

const finish = (item: IUserAppItem) => {
    emits('finish', item)
}
</script>