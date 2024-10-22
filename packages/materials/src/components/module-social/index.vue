<template>
    <ModuleHref :item="item" :env="env" :is-edit="true">

    </ModuleHref>
</template>

<script lang="ts" setup>
import ModuleHref from '../module-href/index.vue'
import { IUserAppItem, ENV_ENUM } from '@beetr/constant'

const props = defineProps<{
    item: IUserAppItem,
    env: keyof typeof ENV_ENUM,
    isEdit: boolean
}>()
</script>