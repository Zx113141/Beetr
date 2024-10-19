<script setup lang="ts">
const props = defineProps({
    // 区分来源
    from: {
        default: 'path',
        type: String
    },
    path: {
        default: '',
        type: String
    }
})
const router = useRouter()

/** 跳转注册 */
const linkRegisterPage = (path: string) => {
    // main来源需要通知回去
    if (props.from === 'main') {
        window.parent.location.replace(path || 'register')
    } else {
        if (path) {
            router.push(`/${path}`)
        } else {
            router.push('/register')
        }
    }
}

/** 跳转注册 */
const linkLoginPage = () => {
    // main来源需要通知回去
    if (props.from === 'main') {
        window.parent.location.replace('login')
    } else {
        router.push('/login')
    }
}
</script>

<template>
    <div class="items-center space-x-1 rounded-[12px] p-1 transition-colors 2xl:space-x-2 duration-400 bg-white delay-500"
        :class="[$device.isMobile ? 'relative bottom-0 p-10 w-full bg-transparent flex flex-col justify-center gap-2' : 'fixed hidden bottom-[52px] -m-1 left-16 xl:flex']">
        <el-button type="info" class="relative mr-3" @click="() => linkRegisterPage(path)">
            <img src="@/assets/images/logo_1.png" draggable="false" alt="" class="mr-2" style="width: 16px;">
            <span>{{ path ? '返回我的页面' : '注册专属便当' }}</span>
            <div class="animation__shine" style="animation-duration: 4000ms"></div>
        </el-button>
        <!-- <el-button v-if="!path" link text :class="[$device.isMobile ? '!text-[#6C6C6C]' : '!text-[#8E8E8E]']"
      @click="linkLoginPage"></el-button> -->
        <!-- <el-button link text class="!rounded-full !text-[#8E8E8E]"><SvgExplore></SvgExplore></el-button> -->
    </div>
</template>
