<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Hide } from '@element-plus/icons-vue';
import ScreenlockBg from '@/assets/images/screenlock-bg.png'

import { _userStore } from '~~/store/user'
const userStore = _userStore()
const { userInfo, urlInfo } = storeToRefs(userStore)

const router = useRouter()
import FooterLogo from './module-footer-logo.vue';
import { type Style, LOAD_STATUS, TOKEN_CREDENTIALS } from "@beetr/constant";
import type { FormInstance } from "element-plus";
import { visitByPwd } from "~/api/user/user";

const isLogin = ref(useCookie(TOKEN_CREDENTIALS))
const state = reactive({
    notAllowView: urlInfo.value?.visitorType === 2,// 不允许访问
    password: ''
})

/** form实例 */
const passwordFormRef = ref<FormInstance>()
const passwordForm = reactive<{
    password: string
    loadStatus: keyof typeof LOAD_STATUS
}>({
    password: '',
    loadStatus: LOAD_STATUS.none,
})
/** 校验密码 */
const verifyPassword = async () => {
    try {
        passwordForm.loadStatus = LOAD_STATUS.loading
        await passwordFormRef.value!.validate()
        const params = {
            url: urlInfo.value?.url || '',
            pwd: passwordForm.password,
        }
        await visitByPwd(params)
        passwordForm.loadStatus = LOAD_STATUS.success
        // 加载校验
        const { onlock } = await userStore.queryUserInfoByUrl(<string>urlInfo.value?.url)
        !onlock && toLoad(urlInfo.value?.url)
    } catch (error) {
        passwordForm.loadStatus = LOAD_STATUS.error
    }
}

/** 去加载 */
const toLoad = (action: string = '') => {
    window.parent.location.replace(window.parent.location.origin + '/' + action)
}

const screenBoxStyle = computed(() => {
    return {
        background: 'linear-gradient(144.28deg, #0BAFFF 0%, #FBC316 100%)'
    }
})
</script>

<template>
    <div :style="screenBoxStyle"
        class="bg-[#f5f6f7] flex w-full h-[min(100vh)] flex-col justify-center items-center px-4 xl:flex-1 xl:px-0">
        <div class="screenlock flex flex-col items-center justify-between h-[50vh] w-[70vw]">
            <!--   提示信息     -->
            <div class="lock-info">
                <div class="eye-icon text-center">
                    <el-icon size="1.55rem">
                        <Hide />
                    </el-icon>
                </div>
                <div class="not-allow-tip text-center p-5">
                    <span class="text-3xl font-semibold">不允许查看</span>
                </div>
                <div class="not-allow-describe text-center mt5">
                    <span class="font-semibold">{{ state.notAllowView ? '嘿，可能他不想任何人查看他的社交名片' :
                        '嘿，他设置了访问密码，可能只允许他认识的人访问哦!' }}</span>
                </div>
                <!-- 登录或者输入密码  -->
                <div class="mt-10 text-center">
                    <!-- 密码输入  -->
                    <el-form ref="passwordFormRef" v-if="urlInfo?.visitorType === 1" :model="passwordForm"
                        :label-width="0">
                        <el-form-item class="input-pwd-btn" prop="password">
                            <el-input v-model="passwordForm.password" :rules="[
                                {
                                    message: '请输入密码',
                                    required: true,
                                    trigger: 'blur',
                                },
                            ]" placeholder="输入访问密码" type="password" show-password></el-input>
                        </el-form-item>
                        <div class="confirm-btn text-center mb-10">
                            <div class="cursor-pointer hover:underline" @click="verifyPassword">确认</div>
                        </div>
                    </el-form>
                    <span class="cursor-pointer hover:underline" @click="toLoad(userInfo?.url)"
                        v-if="isLogin">返回我的主页</span>
                    <span class="cursor-pointer hover:underline" @click="toLoad('login')" v-else>登录</span>
                </div>
            </div>
            <!-- logo  -->
            <div class="w-full mt-5">
                <FooterLogo />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.input-pwd-btn {
    :deep(.el-input) {
        .el-input__wrapper {
            background-color: transparent;
            color: #fff;
            padding: 0.375rem 0.75rem;
            outline: 2px solid transparent;
            outline-offset: 2px;
            border-radius: var(--el-border-radius-base);

            &:hover,
            &.is-focus {
                box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
            }
        }

        .el-input__inner {
            background: none;
            /* 取消背景 */
            border: none;
            /* 去掉边框 */
            color: #ffffff;
            text-align: center;

            /* 内容居中 */
            &::placeholder {
                color: #ffffff;
                font-size: 16px;
            }

            &:active {
                color: var(--el-button-active-text-color);
                background-color: var(--el-button-active-bg-color);
            }
        }

        .el-input__icon {
            color: #ffffff;
        }
    }
}

.screenlock {
    color: #ffffff;

}
</style>
