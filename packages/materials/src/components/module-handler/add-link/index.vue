<!-- v-if="item.type === WIDGET_TYPE.link" -->
<template>
    <button v-if="item.type === WIDGET_TYPE.link"
        class="rounded-[4px] outline-none disabled:text-white disabled:text-opacity-40 active:scale-90"
        @click="() => updateUrl(EDIT_TYPE.edit)">
        <SvgEdit></SvgEdit>
    </button>
    <el-popover v-else v-model:visible="activeLink" trigger="click" placement="bottom" popper-class="!p-[6px] !bg-black"
        :width="240" popper-style="background-color:#000 !important;" :teleported="false">
        <el-input v-model="item.url" size="small" class="init_link-input" placeholder="输入链接"
            @change="() => updateUrl(EDIT_TYPE.normal)" @keyup.enter="() => updateUrl(EDIT_TYPE.normal)"></el-input>
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
import { SvgEdit, SvgLinkCompleted, SvgLink, WIDGET_TYPE, type IUserAppItem, EDIT_TYPE } from '@beetr/constant'
import { toRefs, ref, watch } from 'vue'


const emit = defineEmits<{
    (e: 'onEdit', item: IUserAppItem, type: keyof typeof EDIT_TYPE): void
}>()
const props = defineProps<{
    item: IUserAppItem,

}>()
/** 是否激活显示输入link */
const activeLink = ref(false)
const { item } = toRefs(props)

/** 更新链接 */
const updateUrl = (type: keyof typeof EDIT_TYPE) => {
    emit('onEdit', item.value, type)
}





</script>

<style lang="scss" scoped></style>