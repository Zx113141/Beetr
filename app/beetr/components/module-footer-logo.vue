<script setup lang="ts">
</script>

<template>
    <div class="footer_logo">
        <img src="@/assets/images/logo.png" draggable="false" />
        <span>beetr.cc</span>
    </div>
</template>

<style lang="scss" scoped>
.footer_logo {
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
        width: 44px;
    }

    span {
        margin-top: 12px;
        font-size: 14px;
        font-weight: 500;
        letter-spacing: 1px;
        line-height: 20.27px;
    }
}
</style>
