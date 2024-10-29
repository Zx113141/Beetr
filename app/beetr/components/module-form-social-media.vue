<script setup lang="ts">
import { CircleCheckFilled, Close } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { getAppConfigList } from '~~/api/widget/widget'
import { _userStore } from '@/store/user'
import { _widgetStore } from '@/store/widget'
import { _envStore } from '@/store/env'
import { WIDGET_TYPE, BROWSER_ENV, LINK_TYPE, type IAppConfigItem, type Style, type IUserAppItem } from '@beetr/constant'

interface IAppConfigItemLeftEdit extends IAppConfigItem {
    _completed: boolean
    id?: string
    nickName?: string
}

const props = defineProps(["mextType"])
const envStore = _envStore()
const widgetStore = _widgetStore()

const { deviceEnv } = storeToRefs(envStore)
const { userAppList } = storeToRefs(widgetStore)

/** 原始的app列表 */
const originConfigList = ref<IAppConfigItem[]>([])
/** 获取展示的媒体列表 */
const queryAppList = async () => {
    const { records } = await getAppConfigList({ pageNo: 1, pageSize: 12 })
    originConfigList.value = records
}

/** 左边展示的可编辑的app列表，由originConfigList和userAppList结合生成 */
const editConfigList = ref<IAppConfigItemLeftEdit[]>([])

/** 生成可编辑的app列表，由originConfigList和userAppList结合生成 */
const getEditConfigList = () => {
    const list = userAppList.value
    editConfigList.value = originConfigList.value.map((x: any) => {
        // 非临时且type是WIDGET_TYPE.link
        const resItem = list.find((k) => {
            if (k.title === x.appName && !k.temType && k.type == WIDGET_TYPE.link) {
                return k
            } else {
                return undefined
            }
        })
        return {
            ...x,
            nickName: resItem?.nickName,
            logoUrl: decodeURIComponent(x.logoUrl),
            id: resItem?.id || x.id,
            _completed: !!resItem,
            variant: LINK_TYPE.social // 补充默认社交类型
        }
    })
}

watch(userAppList, getEditConfigList, { deep: true })

const ulRef = ref<HTMLElement>()
const scrollProcess = ref(0)
onMounted(async () => {
    ulRef.value && ulRef.value!.addEventListener('scroll', () => {
        const i = ulRef.value!.scrollHeight - ulRef.value!.clientHeight
        scrollProcess.value = ulRef.value!.scrollTop / (i + 0.01)
    })
    await init()
})
//* * 获取粘贴板的内容 */
const getPaste = async (item: IAppConfigItemLeftEdit) => {
    const res = await navigator.clipboard.readText()
    if (!res) return
    item.nickName = res
    item._completed = true
    onSetComplete(item)
}

/** 设置为关闭状态 */
const onSetComplete = (item: IAppConfigItemLeftEdit) => {
    if (!item.nickName) return
    item._completed = true

    emit('add', item)
}

/** 点击差清除内容 */
const onClear = async (item: IUserAppItem) => {
    emit('remove', item)
    // await widgetStore.onDelete(item.id!)
    // getEditConfigList()
}

/** 定义触发父组件的事件 */
const emit = defineEmits<{
    (e: 'last'): void
    (e: 'next'): void
    (e: 'add', params: IAppConfigItemLeftEdit): void
    (e: 'remove', item: IUserAppItem): void
}>()

/** 初始化数据 */
const init = async () => {
    await queryAppList()
    getEditConfigList()
    console.log('init userAppList.value', userAppList.value)
}

defineExpose({
    init,
})
</script>

<template>
    <div class="flex w-full flex-col px-4 xl:mr-20 xl:flex-1 xl:px-0">
        <Transition>
            <img src="./images/arrow.png" style="width: 20px;margin-bottom: 46px;" @click="emit('last')" alt=""
                v-if="props.mextType == 1">
        </Transition>
        <Transition>
            <p class="text-3xl font-semibold mb-10 max-w-[376px]"
                v-if="props.mextType == 0 && deviceEnv == BROWSER_ENV.desktop">
                添加社交媒体账户到主页
            </p>
            <p class="text-3xl font-semibold mb-10 max-w-[376px]"
                v-else-if="props.mextType == 0 && deviceEnv == BROWSER_ENV.mobile">
                赶紧添加<br />您的社交账户到主页！
            </p>
        </Transition>
        <Transition>
            <p class="text-3xl font-semibold mb-10 max-w-[376px]" v-if="props.mextType == 1">
                {{ deviceEnv == BROWSER_ENV.desktop ? '您还可以添加图片、视频、链接以及笔记' : '你还可以尝试添加图片、视频链接、笔记！' }}
            </p>
        </Transition>
        <Transition>
            <div class="relative" v-if="props.mextType == 0">
                <ul ref="ulRef" class="max-w-[376px] no-scrollbar sctollul overflow-auto pr-4">
                    <li v-for="(item, index) in editConfigList" :key="index"
                        class="social_li flex items-center mb-4 lg:mb-3 h-11">
                        <img :src="item.logoUrl" class="w-11 rounded-xl mr-2" alt="icon" />

                        <!-- 添加状态 -->
                        <el-input v-if="!item._completed" v-model="item.nickName" class="init_input"
                            @keyup.enter="() => { onSetComplete(item) }" :placeholder="`请输入${item.appName}账户`">
                            <template #prepend>@</template>
                            <template #append>
                                <div class="social_li-action">
                                    <el-button v-show="!item.nickName" class="width-[58px]" @click="getPaste(item)">
                                        粘贴
                                    </el-button>
                                    <el-button v-show="!item._completed && item.nickName" type="success"
                                        class="width-[58px]" @click="onSetComplete(item)">
                                        添加
                                    </el-button>
                                </div>
                            </template>
                        </el-input>

                        <!-- 完工状态 -->
                        <div v-else class="complete_status pl-3"
                            :style="`${item._completed ? `background-color: ${item.widgetColor}` : ''}`">
                            <el-icon size="1rem" color="#ffffff" class="mr-1">
                                <CircleCheckFilled />
                            </el-icon>
                            <p>{{ item.nickName }}</p>
                            <div class="complete_status-close" @click="() => onClear(item)">
                                <el-icon size="1.125rem" color="#ffffff">
                                    <Close />
                                </el-icon>
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="styles_overlay-top" :style="`height: ${Math.round(72 * scrollProcess)}px`"></div>
                <div class="styles_overlay-bottom" :style="`height: ${Math.round((1 - scrollProcess) * 72)}px`"></div>
            </div>
        </Transition>
        <Transition>
            <div class="grid grid-cols-2 justify-start gap-3 xl:grid-cols-[auto,auto] mt-10" v-if="props.mextType == 0">
                <el-button type="primary" size="large" class="h-[52px] w-[190px] lg:h-[41px]" @click="emit('next')">
                    下一步
                </el-button>
                <el-button link text size="large" class="h-[52px] w-[100px] lg:h-[41px] !ml-0" @click="emit('next')">
                    跳过
                </el-button>
            </div>
        </Transition>
        <Transition>
            <div class="grid grid-cols-2 justify-start gap-3 xl:grid-cols-[auto,auto] mt-10" v-if="props.mextType == 1">
                <el-button type="primary" size="large" class="h-[52px] w-[190px] lg:h-[41px]" @click="emit('next')">
                    {{ deviceEnv == BROWSER_ENV.desktop ? '完成' : '下一步' }}
                </el-button>
                <el-button link text size="large" class="h-[52px] w-[100px] lg:h-[41px] !ml-0" @click="emit('next')">
                    跳过
                </el-button>
            </div>
        </Transition>
        <Transition>
            <div class="grid grid-cols-1 justify-start gap-3 sm:grid-cols-[auto,auto] mt-10" v-if="props.mextType == 2">
                <el-button type="primary" size="large" class="h-[52px] w-[190px] lg:h-[41px]" @click="emit('next')">
                    到个人中心
                </el-button>
            </div>
        </Transition>
    </div>
</template>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
    transition: all 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    transform: translateX(-20px);
    opacity: 0;
}

.social_li {
    .social_li-action {
        opacity: 0;
        transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &:hover {
        .social_li-action {
            opacity: 1;
        }
    }
}

.complete_status {
    display: flex;
    align-items: center;
    flex: 1;
    padding-right: 0.375rem;
    overflow: hidden;
    height: 100%;
    display: flex;
    align-items: center;
    border-radius: var(--el-border-radius-base);

    p {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #ffffff;
        font-size: 0.875rem;
    }

    .complete_status-close {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        font-weight: bold;

        &:hover {
            background-color: rgba(0, 0, 0, 0.04);
        }

        &:active {
            background-color: rgba(0, 0, 0, 0.1);
        }
    }
}

.styles_overlay-bottom,
.styles_overlay-top {
    pointer-events: none;
    position: absolute;
    left: -0.25rem;
    right: -0.25rem;
}

.styles_overlay-bottom {
    bottom: -1px;
    height: 72px;
    background: linear-gradient(180deg, hsla(0, 0%, 100%, 0), #fff);
}

.styles_overlay-top {
    top: -1px;
    height: 0;
    background: linear-gradient(180deg, #fff, hsla(0, 0%, 100%, 0));
}

.sctollul {
    max-height: calc(100vh - 250px);
}

.outgou {
    opacity: 1;
    background: rgba(78, 221, 118, 1);
    border-radius: 50%;
    margin-bottom: 14px;
    padding: 13px 11px 13px;
    box-sizing: border-box;
    width: 46px;

    img {
        width: 26px;
        height: 18px;
    }
}
</style>
