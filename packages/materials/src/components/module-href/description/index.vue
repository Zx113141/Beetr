<template>
    <div>
        <div v-if="`${item.cusStyle[env].w * 2}x${item.cusStyle[env].h}` === '4x4'" class="flex items-start w-full">
            <div class="description_icon">
                <img v-if="item.faviconUrl" :src="decodeURIComponent(item.faviconUrl)" alt="" srcset="" />
                <el-icon v-else size="2rem" class="!w-full !h-full">
                    <Link />
                </el-icon>
            </div>
            <div class="flex-1"></div>
            <div v-if="item.follow" class="styles_follow-button" :class="item.btnCus">
                {{ item.follow }}
            </div>
        </div>
        <div v-else class="description_icon">
            <!-- <img src="https://i0.hdslb.com/bfs/static/jinkela/long/images/512.png" alt=""> -->
            <img v-if="item.faviconUrl" :src="decodeURIComponent(item.faviconUrl)" alt="" srcset="" />
            <el-icon v-else size="2rem" class="!w-full !h-full">
                <Link />
            </el-icon>
        </div>
        <div class="description_container" :class="{
            active: showInput,
            is2x1: item.cusStyle[env].w + 'x' + item.cusStyle[env].h == '2x1',
        }">
            <!-- 网站名称 -->
            <div class="description_container-wrap"
                v-if="!(item.cusStyle[env].w + 'x' + item.cusStyle[env].h == '2x1')">
                <div class="description_container-p" @click="onToggleInput">
                    {{ item.title }}
                </div>
            </div>
            <!-- 域名 - 这个地方link不显示 -->
            <div v-if="!showInput && item.variant === LINK_TYPE.social" :class="`description_container-host ${props.isEdit ? 'description_container-unedit' : ''
                } description_container-${item.cusStyle[env].w}x${item.cusStyle[env].h}`" @click="onToggleInput">
                @{{ item.nickName }}
            </div>

            <el-input v-if="showInput" ref="inputRef" v-model="item.nickName" type="textarea"
                class="description_container-title" :autosize="true" @blur="showInput = false"
                @change="updateWidget"></el-input>
        </div>
        <div v-if="(`${item.cusStyle[env].w * 2}x${item.cusStyle[env].h}` === '2x2' ||
            `${item.cusStyle[env].w * 2}x${item.cusStyle[env].h}` === '4x2') &&
            item.follow &&
            item.btnCus
        " class="styles_follow-button" :class="item.btnCus">
            {{ item.follow }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import { BROWSER_ENV, IUserAppItem, LINK_TYPE } from '@beetr/constant';
import { toRefs, ref } from 'vue'

const emits = defineEmits(['finish'])
const props = defineProps<{
    item: IUserAppItem,
    env: keyof typeof BROWSER_ENV
    isEdit:boolean
}>()

const { item } = toRefs(props)
const showInput = ref<boolean>(false)

const onToggleInput = () => {
    showInput.value = !showInput.value
}
const updateWidget = () => {
    emits('finish', item.value)
}
</script>


<style scoped lang="scss" </style>