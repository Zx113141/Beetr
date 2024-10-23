<script setup lang="ts">
import { LINK_TYPE, IUserAppItem, BROWSER_ENV } from '@beetr/constant'

import { toRefs, ref, inject, onBeforeUnmount, computed } from 'vue'
import ModuleLink from '../module-link/index.vue'
import ModuleSocial from '../module-social/index.vue'

const deviceEnv = inject<keyof typeof BROWSER_ENV>('deviceEnv',)!
const isEdit = inject<boolean>('editStatus')
const props = defineProps<{
    item: IUserAppItem,
}>()
const { item } = toRefs(props)
const hover = ref(false)



const emits = defineEmits(['addTemp', 'onEdit'])

const styleCompute = computed(() => {
    return function (item: IUserAppItem) {
        return `--widget-color: ${item.widgetColor || '#000'}; --widget-color-hover: ${item.widgetColorHover
            };--widget-color-active: ${item.widgetColorActive};border:${item.temType ? '0' : ''
            };${hover.value ? `background-color:${item.widgetColorActive} !important;` : `background-color:${item.bgColor} !important;`}`
    }
})


const onHover = () => {
    if (!isEdit) {
        hover.value = true
    }
}
const onLeave = () => {
    hover.value = false
}
// let timer: any = null
// onMounted(() => {
//     const type = item.value.variant
//     const status = item.value.fetchStatus
//     if (type == 'normal' && status == 1) {
//         timer = setInterval(() => {
//             widgetStore.onUpdateCrawler(item.value.id).then(res => {
//                 if (!res.fetchStatus) {
//                     clearInterval(timer)
//                 }
//             })

//         }, 3000)
//     }

// })
// onBeforeUnmount(() => {
//     if (timer) {
//         clearInterval(timer)
//     }
// });

const finish = () => {
    emits('onEdit', item.value)
}
</script>

<template>

    <div @mouseover="onHover" @mouseleave="onLeave" class="widget_base-link" :class="`${item.temType ? 'temStyle' : ''} widget_base-${item.cusStyle[deviceEnv].w * 2}x${item.cusStyle[deviceEnv].h
        }`" :style="styleCompute(item)">
        <ModuleLink v-if="item.variant == LINK_TYPE.normal" :item="item"></ModuleLink>
        <ModuleSocial @finish="finish" v-if="item.variant == LINK_TYPE.social" :item="item"></ModuleSocial>
    </div>
</template>

<style lang="scss" scoped>
.widget_base-link {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    padding: 1.5rem;
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
    border-radius: 20px;
    // background-color: var(--widget-color-bg);
    // @include background_color('moduleBlockBackgrouundColor');
    // @include font_color('moduleBlockColor');
    overflow: hidden;
    // backdrop-filter: blur(10px);

    &.widget_base-2x4,
    &.widget_base-4x4 {
        flex-direction: column;
        align-items: flex-start;
    }

    .widget_base-frame {
        position: relative;
        display: flex;
        min-height: 0;
        flex-direction: column;
        border-radius: 10px;


    }


}


.temStyle {
    width: 100%;

    height: 100%;

    box-sizing: border-box;
    position: relative;
    overflow: inherit;
}

// 媒介查询适配 *************************
.widget_base-1x4 {
    padding: 0.875rem 1.5rem;
}

@media (min-width: 350px) {
    .widget_base-1x4 {
        padding-top: 18px;
        padding-bottom: 18px;
    }

    .widget_base-2x4 {
        .description_container-p {
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 6;
        }
    }
}

@media screen and (max-width: 374px) {
    .description_container-host {
        display: none !important;
    }
}

@media (min-width: 375px) {
    .widget_base-1x4 {
        padding-top: 1.25rem;
        padding-bottom: 1.25rem;
    }
}

@media screen and (max-width: 400px) {
    .widget_base {
        padding: 1.25rem;
    }

    .widget_base-1x4 {
        padding: 0.875rem 1.25rem;
    }
}
</style>
