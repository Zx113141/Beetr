<template>
    <grid-item v-for="item in list" :item="item" :key="item.id" :showHandler="true"></grid-item>
</template>

<script setup lang="ts">
import { IUserAppItem } from '@beetr/constant';
import { GridItem } from '..';
import { inject } from 'vue';

const props = defineProps<{
    list: IUserAppItem[]
}>()


const gridContext = inject('gridContext')

</script>

<style lang="scss" scoped></style>