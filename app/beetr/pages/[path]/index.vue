<script setup lang="ts">
import { BROWSER_ENV } from "@beetr/constant";
import { debounce } from "@beetr/hooks";
const route = useRoute();

const browserEnv = ref<keyof typeof BROWSER_ENV>("desktop");
const deviceEnv = ref<any>("desktop");
const iframeRef = ref<HTMLIFrameElement | null>(null);
// hooks
onMounted(() => {
    window.addEventListener("message", handleFrameMessage);
    if (!checkBrowserEnv()) {
        window.addEventListener("resize", debounce(handleWindowResize, 300));
    }
    // 主动触发一次
    handleWindowResize(null);
});

// function
const handleFrameMessage = (e: MessageEvent) => {
    if (e.data.eventType == "iframeLoaded") {
        postEnv();
    }
};

const checkBrowserEnv = () => {
    return /iPhone|Android/.test(window.navigator.userAgent);
};

const handleWindowResize = (e: UIEvent | null) => {
    if (!e) {
        browserEnv.value = checkBrowserEnv()
            ? BROWSER_ENV.mobile
            : BROWSER_ENV.desktop;
        deviceEnv.value =
            window.innerWidth > 1280 ? BROWSER_ENV.desktop : BROWSER_ENV.mobile;
        postEnv();
        return;
    }
    if ((e.target as Window).innerWidth > 1280) {
        browserEnv.value = BROWSER_ENV.desktop;
        deviceEnv.value = BROWSER_ENV.desktop;
    } else {
        browserEnv.value = BROWSER_ENV.desktop;
        deviceEnv.value = BROWSER_ENV.mobile;
    }
    postEnv();
};
const postEnv = () => {
    iframeRef.value?.contentWindow?.postMessage(
        {
            eventType: "env",
            query: {
                browserEnv: browserEnv.value,
                deviceEnv: deviceEnv.value,
            },
        },
        "*"
    );
};
</script>

<template>
    <div :class="[
        'min-h-screen flex flex-col items-center bg-[#F8F8F8]',
        $device.isMobile
            ? 'browser-mobile justify-between'
            : 'browser-desktop justify-center',
    ]">
        <div class="frame_container flex" :class="[
            $device.isMobile ? 'realmobile' : '',
            deviceEnv == BROWSER_ENV.mobile ? 'frame_container-mobile' : '',
        ]">
            <iframe ref="iframeRef" :data-editor-iframe="true" class="frame_container-iframe backgroundColor"
                :style="'visibility: visible'" :src="`/main?path=${route.params.path}`">
            </iframe>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.frame_container {
    height: 100vh;
    width: 100%;
    position: relative;
    border-width: 0;
    border-color: transparent;
    --tw-bg-opacity: 1;
    background-color: rgb(255 255 255 / var(--tw-bg-opacity));
    transition: all 0.25s cubic-bezier(0.427, 0.073, 0.105, 0.997) 0.1s;

    //   @include background_color('backgroundColor');

    &.frame_container-mobile {
        height: min(80vh, 900px);
        width: 452px;
        border: 12px solid #fff;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.04), 0 25px 31px rgba(0, 0, 0, 0.02),
            0 16.2037px 18.1551px rgba(0, 0, 0, 0.015),
            0 9.62963px 9.87407px rgba(0, 0, 0, 0.012),
            0 5px 5.0375px rgba(0, 0, 0, 0.01),
            0 2.03704px 2.52593px rgba(0, 0, 0, 0.008),
            0 0.462963px 1.21991px rgba(0, 0, 0, 0.005);
        border-radius: 64px;
        margin-bottom: 5rem;

        .frame_container-iframe {
            border-radius: 52px;
        }
    }

    .frame_container-iframe {
        margin-bottom: 0;
        height: 100%;
        width: 100%;
    }
}
</style>
