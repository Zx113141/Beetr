<template>
    <div class="w-full widget_base-description">
        <div v-if="`${item.cusStyle[deviceEnv].w * 2}x${item.cusStyle[deviceEnv].h}` === '4x4'"
            class="flex items-start w-full">
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
            is2x1: item.cusStyle[deviceEnv].w + 'x' + item.cusStyle[deviceEnv].h == '2x1',
        }">
            <!-- 网站名称 -->
            <div class="description_container-wrap"
                v-if="!(item.cusStyle[deviceEnv].w + 'x' + item.cusStyle[deviceEnv].h == '2x1')">
                <div class="description_container-p" @click="onToggleInput">
                    {{ item.title }}
                </div>
            </div>
            <!-- 域名 - 这个地方link不显示 -->
            <div v-if="!showInput && item.variant === LINK_TYPE.social" :class="`description_container-host ${isEdit ? 'description_container-unedit' : ''
                } description_container-${item.cusStyle[deviceEnv].w}x${item.cusStyle[deviceEnv].h}`"
                @click="onToggleInput">
                @{{ item.nickName }}
            </div>

            <el-input v-if="showInput" ref="inputRef" v-model="item.nickName" type="textarea"
                class="description_container-title" :autosize="true" @blur="showInput = false"
                @change="updateWidget"></el-input>
        </div>
        <div v-if="(`${item.cusStyle[deviceEnv].w * 2}x${item.cusStyle[deviceEnv].h}` === '2x2' ||
            `${item.cusStyle[deviceEnv].w * 2}x${item.cusStyle[deviceEnv].h}` === '4x2') &&
            item.follow &&
            item.btnCus
        " class="styles_follow-button" :class="item.btnCus">
            {{ item.follow }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import { BROWSER_ENV, IUserAppItem, LINK_TYPE } from '@beetr/constant';
import { toRefs, ref, inject, nextTick } from 'vue'
import { Link } from '@element-plus/icons-vue'

const emits = defineEmits(['finish'])
const deviceEnv = inject<keyof typeof BROWSER_ENV>('deviceEnv',)!
const isEdit = inject<boolean>('editStatus')
const props = defineProps<{
    item: IUserAppItem,
}>()

const { item } = toRefs(props)
const showInput = ref<boolean>(false)
const inputRef = ref<HTMLInputElement | null>(null)

const onToggleInput = async () => {
    if (!isEdit || deviceEnv == BROWSER_ENV.mobile) return
    showInput.value = true
    await nextTick()
    inputRef.value!.focus()
}
const updateWidget = () => {
    emits('finish', item.value)
}
</script>


<style scoped lang="scss">
.widget_base-description {
    display: flex;
    max-height: 100%;
    width: 100%;
    max-width: 100%;
    flex: 1 1 0%;
    flex-direction: column;
    align-items: flex-start;
}

.description_container {
    margin-top: 9px;
    display: flex;
    width: 100%;
    flex-direction: column;
    word-break: break-all;

    @media (min-width: 320px) {
        .description_container-p {
            margin-top: 0;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
        }
    }

    @media screen and (min-width: 410px) {
        .description_container-p {
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
        }
    }
}

.styles_follow-button {
    display: none;
    padding: 7px 11px;
    font-size: 0.75rem;
    line-height: 1rem;
    width: 70px;
    letter-spacing: 2px;
    text-align: center; // margin-top: 16px;
    // // @include background_color('moduleBlockBackgroundColor');
    // // @include font_color('moduleBlockColor');
}

@media screen and (min-width: 388px) {
    .styles_follow-button {
        display: block;
    }
}

@media screen and (min-width: 410px) {
    .styles_follow-button {
        padding: 7px 14px;
    }
}

.description_icon {
    position: relative;
    display: flex;
    align-items: flex-start;
    aspect-ratio: 1/1;
    overflow: hidden;
    border-radius: 10px;
    width: 40px;
    height: 40px;
    min-height: 40px;
    min-width: 40px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

    &::before {
        content: '';
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
        border-radius: inherit;
    }

    img {
        width: 100%;
        height: 100%;
    }
}

.is2x1 {
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 10px;
}

.description_container-wrap {
    position: relative;
    z-index: 5;
    cursor: text !important;
    border-radius: var(--el-border-radius-base);
    background-color: transparent;
    border-radius: var(--el-border-radius-base);
}

.description_container-p {
    margin-top: -2px;
    font-size: 0.875rem;
    line-height: 1.2;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.description_container-title {
    z-index: 20;
    // // @include background_color('moduleBlockBackgrouundColor');
    // @include font_color('moduleTitleColor');
    vertical-align: top;
    margin-top: 0.25rem;

    :deep(.el-textarea__inner) {
        box-shadow: none;
        // padding: 0;
        // // @include font_color('moduleBlockColor');
        // // @include background_color('moduleBlockBackgrouundColor');
        font-size: 14px;
        color: rgba(0, 0, 0, 0.6);
        line-height: 16px;
        font-weight: 400;
    }
}

.description_container-unedit {
    &:hover {
        background-color: var(--widget-color-hover);
    }

    &:focus {
        background-color: var(--widget-color-active);
    }

    .active {
        background-color: var(--widget-color-active);
    }
}

.description_container-1x2 {
    -webkit-line-clamp: 1;
}

.description_container-2x1 {
    -webkit-line-clamp: 1;
}

.description_container-2x2 {
    -webkit-line-clamp: 1;
}

.description_container-1x4 {
    -webkit-line-clamp: 6;
}

.description_container-2x4 {
    -webkit-line-clamp: 3;
}

.description_container-host {
    border-radius: 5px;
    padding: 0.25rem 0.25rem 0.25rem 0;
    font-size: 13px;

    font-weight: 400;
    margin-top: 0.25rem;
    // @include font_color('moduleInputColor');
    cursor: text !important;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}

// 按界面操作顺序
.widget_base-2x2 {
    .widget_base-description {
        .description_container {
            flex: 1 1 0%;
        }
    }

    .widget_base-frame {
        display: none;
    }
}

.widget_base-4x1 {
    .widget_base-description {
        display: flex;
        flex-direction: row;
        align-items: center;

        .description_icon {
            border-radius: 7px;
            width: 28px;
            height: 28px;
            min-height: 28px;
            min-width: 28px;
        }

        .description_container {
            margin-left: 0.75rem;
            margin-top: 0;

            .description_container-p {
                overflow: hidden;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
            }

            // .description_container-host {
            //   display: none;
            // }
        }
    }

    .widget_base-frame {
        display: none;
    }
}

.widget_base-4x2 {
    .widget_base-description {
        .description_container {
            flex: 1 1 0%;
        }
    }

    .widget_base-frame {
        margin-left: 1.5rem;
        aspect-ratio: 1.4;
        height: 100%;
    }
}

.widget_base-2x4 {
    .widget_base-description {
        .description_container {
            margin-bottom: 0.75rem;

            .description_container-p {
                font-size: 0.875rem;
                line-height: 1.25rem;
                line-height: 1.2;
                overflow: hidden;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 6;
            }
        }
    }

    .widget_base-frame {
        margin-top: 0.5rem;
        aspect-ratio: 1.91;
        width: 100%;
    }
}

.widget_base-4x4 {
    .widget_base-description {
        .description_container {
            margin-bottom: 0.75rem;
        }
    }

    .widget_base-frame {
        margin-top: 0.5rem;
        aspect-ratio: 1.91;
        width: 100%;
    }

    .styles_follow-button {
        display: block;
    }
}
</style>