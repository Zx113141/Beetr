<template>
    <client-only v-if="isNotScreenLock">
        <!-- 用户登录状态下，添加操作栏 -->
        <!-- @add="(...params: any[]) => onAddGrid('onAddLink', params)"
        @add-media="(...params: any[]) => onAddGrid('onAddMedia', params)"
        @add-rich-text="(...params: any[]) => onAddGrid('addRichText', params)"
        @add-section-title="(...params: any[]) => onAddGrid('addSectionTitle', params)" -->
        <ModuleActionBar v-if="userStore.isEdit &&
            userStore.isOnboared &&
            STEP_PROCESS.congratulations !== userStore.currentStep" @on-set-env="onSetEnv" :loadingRef="loadingRef"
            :isEditorRef="isEditorRef"></ModuleActionBar>

        <!-- 用户登录状态下的操作栏，含登出、修改用户名 -->
        <ModuleLeftActionOnline :isEditorRef="isEditorRef" v-if="userStore.isEdit && userStore.isOnboared"
            @logout="logout">
        </ModuleLeftActionOnline>

        <!-- 手机端设置弹窗 -->
        <setDraw @closeLoading="closeLoading" @openLoading="openLoading" @logout="logout" />
        <!-- 更新弹窗 -->
        <editDraw @closeLoading="closeLoading" @openLoading="openLoading" @on-edit="onUpdateGrid" />
        <!-- 底部logo -->
        <ModuleFooterLogo></ModuleFooterLogo>

        <!-- 非登录状态下的操作栏，登录、创建个人链接 -->
        <ModuleLeftActionOffline v-if="!userStore.isEdit && browserEnv == BROWSER_ENV.desktop"
            :path="userStore.userInfo?.url"></ModuleLeftActionOffline>
        <themeDraw @closeLoading="closeLoading" @openLoading="openLoading"></themeDraw>
        <addWidgesDraw @add="(...params: any[]) => onAddGrid('onAddLink', params)" ref="widgetDraw"
            @add-media="(...params: any[]) => onAddGrid('onAddMedia', params)"
            @add-rich-text="(...params: any[]) => onAddGrid('addRichText', params)"
            @add-section-title="(...params: any[]) => onAddGrid('addSectionTitle', params)"
            @add-map="(...params: any[]) => onAddGrid('addMap', params)"
            @delete="(...params: any[]) => onAddGrid('delete', params)" @closeLoading="closeLoading"
            @on-progress="onProgress" @on-success="onSuccess">
        </addWidgesDraw>
        <addSocial :list="originConfigList" @add="(...params: any[]) => onAddGrid('onAddLink', params)">

        </addSocial>
        <addLink @add="(...params: any[]) => onAddGrid('onAddLink', params)"></addLink>
    </client-only>

</template>

<script setup>

</script>

<style lang="scss" scoped></style>