<script setup lang="ts">
import bezier from 'cubic-bezier'
import {
  type IAnimationItemStart,
  animationEnum,
  animationStart,
  animationEnd,
  animationScroll,
} from './animation'
import ModuleNewHero from './modules/module-new-hero.vue'
import ModuleLabel from './modules/module-label.vue'
import ModuleSectionVideo from './modules/module-section-video.vue'
import ModuleAllWidgets from './modules/module-all-widgets.vue'
import ModuleUniqueLink from './modules/module-unique-link.vue'
import ModuleFooter from './modules/module-footer.vue'
import ModuleLogo from './modules/module-logo.vue'
/** 项目初始进度时间 */
const renderInitTime = Date.now()
/** 渲染动画递进时间，会结合贝塞尔曲线 */
const renderProcessTime = ref(Date.now())
/** 滚动值 */
const scrollTop = ref(0)

onMounted(() => {
  const fn = () => {
    renderProcessTime.value = Date.now()
    const time = renderProcessTime.value - renderInitTime
    if (time < 5000) requestAnimationFrame(fn)
  }
  requestAnimationFrame(fn)

  /** 监听获取滚动值 */
  window.onscroll = () => {
    const _scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    scrollTop.value = _scrollTop
  }
})

/** 获取对应的动画 */
const getTransitionStyle = (id: string) => {
  // 动画起点
  const start = animationStart.find((x) => x.target === id)!
  // 动画终点
  const end = animationEnd.find((x) => x.target === id)
  if (id === 'd1410ccc-6e26-8b02-510e-f658d9e448ee' && end && scrollTop.value >= 300) end.delay = 0
  // 有滚动值，终点为  end - scroll
  const scroll = animationScroll.find((x) => x.target === id)
  // 700 为滚动和动画结合的时间
  const scrollPct = Math.min(scrollTop.value / 700, 1)
  // 初始页面加载时动画的执行进度 已加载时间计算
  let processPct = end
    ? (renderProcessTime.value - renderInitTime - end.delay - scrollTop.value) / end.duration
    : 0
  processPct = processPct > 1 ? 1 : processPct
  processPct = processPct < 0 ? 0 : processPct
  // 默认线性直线
  const DEFAULT_EASING = [0, 0, 1, 1]
  // bezier 贝塞尔曲线固定调用方式
  const easeInScroll = (pct: number) => {
    return scroll
      ? bezier(...(scroll.easing || DEFAULT_EASING), 1000 / 60 / scroll.duration / 4)(pct)
      : 1
  }
  const easeInInit = (pct: number) => {
    return end ? bezier(...(end.easing || DEFAULT_EASING), 1000 / 60 / end.duration / 4)(pct) : 1
  }
  const getCalcValue = (name: keyof Omit<IAnimationItemStart, 'target'>) => {
    // ①仅初始加载 start[name] - (start[name] - end[name]) * easeIn(processPct)
    // ②仅滚动  end变为滚动的动画起点 end[name] - (end[name] - scroll[name]) * easeIn(processPct
    // ③初始+滚动 起点为start, 终点为 受滚动改变)
    // 如果还在初始动画加载，则已初始的贝塞尔曲线为准
    if (scroll && end) {
      // 进入+滚动
      const SCROLL_END = end[name] - (end[name] - scroll[name]) * easeInScroll(scrollPct)
      return start[name] - (start[name] - SCROLL_END) * easeInInit(processPct)
    } else if (scroll && !end) {
      // 1956 为滚动和动画结合的时间
      const scrollPctOnly = Math.min(scrollTop.value / 1956, 1)
      // 仅滚动
      return start[name] - (start[name] - scroll[name]) * easeInScroll(scrollPctOnly)
    } else {
      // 仅进入
      return start[name] - (start[name] - end![name]) * easeInInit(processPct)
    }
  }
  const style = `
  transform: translate3d(
    ${getCalcValue(animationEnum.translateX)}px,
    ${getCalcValue(animationEnum.translateY)}px,
    ${getCalcValue(animationEnum.translateZ)}px)
    scale3d(
      ${getCalcValue(animationEnum.scaleX)},
      ${getCalcValue(animationEnum.scaleY)}, 1)
      rotateX(${getCalcValue(animationEnum.rotateX)}deg)
      rotateY(${getCalcValue(animationEnum.rotateY)}deg)
      rotateZ(${getCalcValue(animationEnum.rotateZ)}deg);
  opacity: ${getCalcValue(animationEnum.opacity)};
  filter: blur(${getCalcValue(animationEnum.filter)}px);
  transform-style: preserve-3d;`
  return style
}

useSeoMeta({
  title: 'Beetr.cc - 一个URL链接，分享你在互联网上的一切！'
})

</script>

<template>
  <div>
    <ModuleLogo :scroll-top="scrollTop"></ModuleLogo>
    <ModuleNewHero :get-transition-style="getTransitionStyle"></ModuleNewHero>
    <ModuleSectionVideo :get-transition-style="getTransitionStyle"></ModuleSectionVideo>
    <ModuleLabel></ModuleLabel>
    <ModuleAllWidgets :get-transition-style="getTransitionStyle"></ModuleAllWidgets>
    <ModuleUniqueLink></ModuleUniqueLink>
    <ModuleFooter></ModuleFooter>
  </div>
</template>

<style>
@import url('./index.css');
</style>
