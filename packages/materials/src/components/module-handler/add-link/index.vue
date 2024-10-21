<!-- v-if="item.type === WIDGET_TYPE.link" -->
<template>
    <button v-if="item.type === WIDGET_TYPE.link"
        class="rounded-[4px] outline-none disabled:text-white disabled:text-opacity-40 active:scale-90"
        @click="emit('onLinkEdit', 'onLinkEdit')">
        <component :is="SvgEdit"></component>
    </button>
    <el-popover v-else v-model:visible="activeLink" trigger="click" placement="bottom" popper-class="!p-[6px] !bg-black"
        :width="240" popper-style="background-color:#000 !important;">
        <el-input v-model="item.url" size="small" class="init_link-input" placeholder="输入链接" @change="updateUrl"
            @keyup.enter="updateUrl()"></el-input>
        <template #reference>
            <button class="rounded-[4px] outline-none disabled:text-white disabled:text-opacity-40 active:scale-90"
                :class="activeLink ? `active` : ``">
                <SvgLinkCompleted v-if="item.url"></SvgLinkCompleted>
                <SvgLink v-else></SvgLink>
            </button>
        </template>
    </el-popover>
</template>

<script setup lang="ts">
import { SvgEdit, SvgLinkCompleted, SvgLink, WIDGET_TYPE, type IUserAppItem, } from '@beetr/constant'
import { toRefs, ref, watch } from 'vue'


const emit = defineEmits(['onLinkEdit', 'onEditing'])
const props = defineProps<{
    item: IUserAppItem,

}>()
/** 是否激活显示输入link */
const activeLink = ref(false)
const { item } = toRefs(props)

/** 更新链接 */
const updateUrl = () => {
    // widgetStore.onUpdate([item.value])
}

watch(activeLink, (newval) => {
 
    emit('onEditing', newval)
}, {
    immediate: true
})



</script>

<style lang="scss" scoped></style>