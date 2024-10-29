<script setup lang="ts">
import { storeToRefs } from "pinia";
import { _userStore } from '~~/store/user'
import { getTagList, userSelectTag } from "~/api/user/user";
import { LOAD_STATUS } from "@beetr/constant";

/** 定义触发父组件的事件 */
const emit = defineEmits<{
    (e: 'last'): void
    (e: 'next'): void
}>()

// 加载标签列表
const tagList = ref<any[]>(await getTagList())

const userStore = _userStore()
const { userInfo, urlInfo } = storeToRefs(userStore)

onMounted(async () => {
    tagList.value = await getTagList()
    activatedIds.value = JSON.parse(<string>userInfo.value?.tags || '[]')
})

// 选中id
const activatedIds = ref<string[]>(JSON.parse(<string>userInfo.value?.tags || '[]'))
/** 选中效果 **/
const inActivatedIds = computed(() => {
    return function (id: any) {
        return activatedIds.value!.includes(id)
    }
})
/** 按钮禁用状态 */
const statusButton = computed(() => {
    return activatedIds.value!.length <= 0
})
/** 选中效果 **/
const handleClickActivate = (id: string) => {
    if (activatedIds.value!.find((item) => item === id)) {
        activatedIds.value = activatedIds.value!.filter((item) => item !== id)
    } else {
        activatedIds.value!.push(id)
    }
}

const loadStatus = ref<keyof typeof LOAD_STATUS>()

/** 更新密码 */
const updateUserSelectTag = async () => {
    try {
        loadStatus.value = LOAD_STATUS.loading
        const params = {
            url: urlInfo.value?.url || '',
            tags: `[${activatedIds.value?.join(',')}]`
        }
        await userSelectTag(params)
        loadStatus.value = LOAD_STATUS.success
        // todo 继续下一步
        emit('next')
    } catch (error) {
        loadStatus.value = LOAD_STATUS.error
    }
}
</script>

<template>
    <div class="flex w-full flex-col justify-between px-4 xl:flex-1 xl:px-0">
        <!--  logo  -->
        <div class="nav w-full max-w-[1100px] pb-5 xs:pb-10">
            <a href="#" class="home-link-area w-inline-block flex items-center">
                <img class="w-[42px] h-[42px]" src="@/assets/images/logo.png" draggable="false" />
                <span class="font-semibold text-[16px] w-inline-block ml-[10px]">beetr.cc</span>
            </a>
        </div>
        <div class="h-full max-w-[960px] mx-auto flex flex-col justify-between">
            <div class="module-title">
                <Transition>
                    <p class="text-3xl font-semibold mb-5">
                        让朋友更了解你
                    </p>
                </Transition>
                <Transition>
                    <p class="text-[16px] font-normal mb-5 text-[#1C1C1C]">
                        请选择最适合描述你便当的类别（单选或多选）
                    </p>
                </Transition>
            </div>
            <Transition>
                <!--   滚动列表     -->
                <div class="relative scrollfull no-scrollbar overflow-auto">
                    <ul class="label-scroll max-w-[488px]">
                        <li class="label-scroll-item" :class="{ activated: inActivatedIds(item.id) }"
                            v-for="(item, index) in tagList" :key="item.id" @click="handleClickActivate(item.id)">
                            <div class="label-icon" v-if="item.icon">
                                <img :src="item.icon || '/favicon.png'" alt="icon">
                            </div>
                            <div class="label-name">{{ item.name }}</div>
                        </li>
                    </ul>
                </div>
            </Transition>
            <Transition>
                <div class="grid grid-cols-1 justify-start mt-5">
                    <el-button :disabled="statusButton" :loading="loadStatus === LOAD_STATUS.loading" type="primary"
                        class="!h-[58px] sm:!h-[48px] w-full" @click="updateUserSelectTag">
                        继续
                    </el-button>
                </div>
            </Transition>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.label-scroll {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 10px;

    .label-scroll-item {
        position: relative;
        background: #f5f5f5;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        border-radius: 24px;
        padding: 5px 14px;

        &.activated {
            background: #000000;

            .label-name {
                color: #ffffff;
            }
        }

        &:hover {
            box-shadow: 0 0 3px 1px #f5f5f5;
        }

        .label-icon {
            width: 24px;
            height: 24px;

            img {
                width: 100%;
                height: 100%;
                vertical-align: middle;
            }
        }

        .label-name {
            font-size: 14px;
            color: #000000;
        }
    }
}

.scrollfull {
    height: calc(100vh - 356px);
}
</style>
