<script setup lang="ts">
import { animate } from 'popmotion'
import styler from 'stylefire'
const router = useRoute()
onMounted(() => {
    const childList = document.querySelector('.styles_widget-grid__pEQPA')!.childNodes
    for (let i = 0; i < childList.length; i++) {
        const styleItem = styler(childList[i] as Element)
        startAnimate(styleItem)
    }
})
const startAnimate = (styler: any, startParams = { x: 0, y: 0, rotate: 0 }) => {
    const { offsetX, offsetY, rotate, mass, damping, duration } = getRandomParams()
    animate({
        from: startParams,
        to: { x: offsetX, y: offsetY, rotate },
        mass,
        damping,
        duration: 1e3 * duration,
        stiffness: 50,
        onUpdate: (params: any) => {
            styler.set(params)
        },
        onComplete: () => {
            startAnimate(styler, { x: offsetX, y: offsetY, rotate })
        },
    })
}
// 生成一个介于-num和num之间的随机数
const random = (num: number) => Math.random() * num * 2 - num

/** 生成新的轨迹边界 */
const getRandomParams = () => {
    return {
        offsetX: random(50),
        offsetY: random(50),
        rotate: random(12),
        mass: 30 * Math.random() + 10,
        damping: 160 * Math.random() + 60,
        duration: 5 * Math.random() + 2,
    }
}

</script>

<template>
    <div class="flex-1 items-center justify-center transition-all duration-1000 lg:flex" :class="{
        hidden: router.fullPath == '/register'
    }">
        <div data-cloud-parent="true" class="relativ rounded-[40px] p-8 transition-colors duration-500">
            <div class="relative z-10 mb-6 flex flex-col"></div>
            <div class="styles_widget-grid__pEQPA styles_widget-grid--realistic__yaS74">
                <div id="photo1" class="styles_realistic-widget___IKlG">
                    <img src="./images/photo1.png" alt="" class="h-full w-full object-cover" />
                    <div
                        class="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(0,0,0,0.09)]">
                    </div>
                </div>
                <div id="behance" class="styles_realistic-widget___IKlG">
                    <img src="./images/douyin.png" alt="" class="h-full w-full object-cover" />
                    <div
                        class="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(0,0,0,0.09)]">
                    </div>
                </div>
                <div id="linkedin" class="styles_realistic-widget___IKlG">
                    <img src="./images/linkedin.png" alt="" class="h-full w-full object-cover" />
                    <div
                        class="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(0,0,0,0.09)]">
                    </div>
                </div>
                <div id="dribbble" class="styles_realistic-widget___IKlG">
                    <img src="./images/dribbble.png" alt="" class="h-full w-full object-cover" />
                    <div
                        class="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(0,0,0,0.09)]">
                    </div>
                </div>
                <div id="figma" class="styles_realistic-widget___IKlG">
                    <img src="./images/figma.png" alt="" class="h-full w-full object-cover" />
                    <div
                        class="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(0,0,0,0.09)]">
                    </div>
                </div>
                <div id="insta" class="styles_realistic-widget___IKlG">
                    <img src="./images/insta.png" alt="" class="h-full w-full object-cover" />
                    <div
                        class="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(0,0,0,0.09)]">
                    </div>
                </div>
                <div id="twitter" class="styles_realistic-widget___IKlG">
                    <img src="./images/weibo.png" alt="" class="h-full w-full object-cover" />
                    <div
                        class="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(0,0,0,0.09)]">
                    </div>
                </div>
                <div id="github" class="styles_realistic-widget___IKlG">
                    <img src="./images/github.png" alt="" class="h-full w-full object-cover" />
                    <div
                        class="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(0,0,0,0.09)]">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
