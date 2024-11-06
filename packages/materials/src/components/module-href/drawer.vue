<template>
    <div class=" bg-container2 text-primary5">
        <ModuleMobileDrawerHeader :browserEnv="browserEnv" @close="back" @finish="beforeClose">
            <img :src="backL" loading="lazy" class="back" @click="back" width="30" height="30" v-if="!data.id" />
        </ModuleMobileDrawerHeader>
        <div class="content">
            <component ref="dynamicRef" :is="customComp[data.variant as LINK_TYPE]" :data="data" :prop="prop"
                @finish="(params) => emit('finish', params)" :browserEnv="browserEnv" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { toRefs, watch, ref } from 'vue'
import { BROWSER_ENV, Style, LINK_TYPE, IUserAppItem } from '@beetr/constant'
import ModuleLinkDrawer from '../module-link/drawer.vue';
import ModuleSocialDrawer from '../module-social/drawer.vue';
import backL from './back2.png'
import ModuleMobileDrawerHeader from '../module-mobile-drawer-header/index.vue'
const props = defineProps<{
    prop: any,
    browserEnv: keyof typeof BROWSER_ENV | undefined,
    data: IUserAppItem,
}>()
const emit = defineEmits(['finish', 'close'])
// const { prop, browserEnv, data } = toRefs(props)
const dynamicRef = ref<InstanceType<typeof ModuleLinkDrawer | typeof ModuleSocialDrawer> | null>(null)

const customComp = {
    [LINK_TYPE.normal]: ModuleLinkDrawer,
    [LINK_TYPE.social]: ModuleSocialDrawer,
}

const beforeClose = () => {
    const { data: params } = dynamicRef.value
    emit('finish', params)
}

const back = () => {
    emit('close', props.data.id ? false : true)
}



</script>

<style lang="scss" scoped>
.content {
    padding: 20px 30px 0 27px !important;
    // @include font_color('drawerBodyColor');
}
</style>