<script setup lang="ts">
import { InputInstance, ElNotification } from 'element-plus'

import { BROWSER_ENV, LINK_TYPE, IUserAppItem, ENV_ENUM } from '@beetr/constant'

import { toRefs, ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'
import ModuleLink from '../module-link/index.vue'
import ModuleSocial from '../module-social/index.vue'

const props = defineProps<{
    item: IUserAppItem,
    env: keyof typeof ENV_ENUM,
    isEdit: boolean
}>()
const { item } = toRefs(props)

/** 切换显示input输入框 */
const showInput = ref(false)
const hover = ref(false)
/** 输入框ref */
const inputRef = ref<InputInstance | null>(null)

/** 切换为输入模式 */
const onToggleInput = async () => {
    if (!props.isEdit || props.env == BROWSER_ENV.mobile) return
    showInput.value = true
    await nextTick()
    inputRef.value!.focus()
}

const visitJump = () => {
    if (props.isEdit || !item.value.url) return
    window.open(item.value.url)
}



/** 更新title */
const updateWidget = () => {
    // widgetStore.onUpdate([item.value])
    emits('onEdit', [item.value])
}
const addUrl = ref('')
const getPaste = async () => {
    const res = await navigator.clipboard.readText()
    addUrl.value = res
}
const emits = defineEmits(['addTemp', 'onEdit'])
const onSetComplete = () => {
    if (!addUrl.value) return
    if (addUrl.value.indexOf('https://') != 0 && addUrl.value.indexOf('http://') != 0) {
        ElNotification({
            title: '提示',
            message: '无效的URL，需包含：https://、http://',
        })
        return
    }
    // showPoper.value = false
    emits('addTemp', addUrl.value)
}


const styleCompute = computed(() => {
    return function (item: IUserAppItem) {
        return `--widget-color: ${item.widgetColor || '#000'}; --widget-color-hover: ${item.widgetColorHover
            };--widget-color-active: ${item.widgetColorActive};border:${item.temType ? '0' : ''
            };${hover.value ? `background-color:${item.widgetColorActive} !important;` : `background-color:${item.bgColor} !important;`}`
    }
})


const onHover = () => {
    if (!props.isEdit) {
        hover.value = true
    }
}
const onLeave = () => {
    hover.value = false
}
let timer: any = null
onMounted(() => {
    const type = item.value.variant
    const status = item.value.fetchStatus
    if (type == 'normal' && status == 1) {
        timer = setInterval(() => {
            widgetStore.onUpdateCrawler(item.value.id).then(res => {
                if (!res.fetchStatus) {
                    clearInterval(timer)
                }
            })

        }, 3000)
    }

})
onBeforeUnmount(() => {
    if (timer) {
        clearInterval(timer)
    }
});

const finish = () => {
    emits('onEdit', item.value)
}
</script>

<template>

    <div @mouseover="onHover" @mouseleave="onLeave" class="widget_base-link" :class="`${item.temType ? 'temStyle' : ''} widget_base-${item.cusStyle[env].w * 2}x${item.cusStyle[env].h
        }`" :style="styleCompute(item)">
        <ModuleLink v-if="item.variant == LINK_TYPE.normal" :item="item" :env="env" :is-edit="isEdit"></ModuleLink>
        <ModuleSocial @finish="finish" v-if="item.variant == LINK_TYPE.social" :item="item" :env="env"
            :is-edit="isEdit"></ModuleSocial>
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
