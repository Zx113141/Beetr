<template>
    <ModuleHrefDescription :item="item"></ModuleHrefDescription>
    <ModuleHrefFrame :item="item"></ModuleHrefFrame>
</template>

<script lang="ts" setup>
import { IUserAppItem, } from '@beetr/constant'
import ModuleHrefDescription from '../module-href/description/index.vue'
import ModuleHrefFrame from '../module-href/frame-container/index.vue'
defineProps<{
    item: IUserAppItem,

}>()
</script>