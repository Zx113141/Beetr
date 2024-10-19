<script setup lang="ts">
import { animate } from 'popmotion'
import styler from 'stylefire'

onMounted(() => {
  const childList = document.querySelector('.styles_widget-grid--stylized__t6FVj')!.childNodes
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
    rotate: random(28),
    mass: 30 * Math.random() + 10,
    damping: 140 * Math.random() + 50,
    duration: 5 * Math.random() + 2,
  }
}
</script>

<template>
  <div class="hidden flex-1 items-center justify-center lg:flex">
    <div data-cloud-parent="true" class="relativ rounded-[40px] p-8 transition-colors duration-500 max-w-[384px]">
      <div class="styles_widget-grid__pEQPA styles_widget-grid--stylized__t6FVj">
        <div id="zhihu"
          class="relative flex flex-col rounded-[22px] p-[22px] items-center justify-start styles_handle__shadow__g7pOg bg-[#056DE8]">
          <div>
            <img class="w-[51px] h-[51px]" src="./images/icon_zhihu.png" alt="icon" />
          </div>
          <div class="pointer-events-none absolute inset-0 rounded-[inherit] phantom-border"></div>
        </div>
        <div id="youtube-link"
          class="relative flex flex-col rounded-[22px] p-[22px] items-center justify-center styles_handle__shadow__g7pOg"
          style="background: rgb(255, 0, 0)">
          <div>
            <svg width="64" height="64" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="10" fill="#FF0000"></rect>
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M29.3766 12.5016C30.4093 12.7775 31.2225 13.5907 31.4986 14.6233L31.4985 14.6234C32 16.495 32 20.4001 32 20.4001C32 20.4001 32 24.305 31.4985 26.1768C31.2224 27.2094 30.4092 28.0225 29.3765 28.2986C27.505 28.8 19.9999 28.8 19.9999 28.8C19.9999 28.8 12.4949 28.8 10.6233 28.2986C9.59065 28.0224 8.77727 27.2094 8.50144 26.1767C8 24.3049 8 20.4 8 20.4C8 20.4 8 16.4949 8.50144 14.6233C8.77727 13.5907 9.59065 12.7775 10.6234 12.5016C12.495 12 20 12 20 12C20 12 27.5051 12 29.3766 12.5016ZM24.4429 20.6931L17.6001 24.5857V16.8L24.4429 20.6931Z"
                fill="white"></path>
            </svg>
          </div>
          <div class="pointer-events-none absolute inset-0 rounded-[inherit] phantom-border"></div>
        </div>
        <div id="douyin"
          class="relative flex flex-col rounded-[22px] items-center justify-center styles_handle__shadow__g7pOg bg-[#170B1A]">
          <div>
            <img src="./images/icon_douyin.png" class="w-[40px] h-[40px]" alt="icon" />
          </div>
          <div class="pointer-events-none absolute inset-0 rounded-[inherit] phantom-border"></div>
        </div>
        <div id="dribbble-link"
          class="relative flex flex-col rounded-[22px] p-[22px] items-start justify-center styles_handle__shadow__g7pOg"
          style="background: rgb(209, 85, 132)">
          <div>
            <svg width="64" height="64" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="10" fill="#D15584"></rect>
              <g clip-path="url(#clip0_920_2756)">
                <path
                  d="M8 20C8 17.824 8.53602 15.816 9.608 13.976C10.68 12.136 12.136 10.68 13.976 9.608C15.816 8.53599 17.824 8 20 8C22.176 8 24.184 8.53599 26.024 9.608C27.864 10.68 29.32 12.136 30.392 13.976C31.464 15.816 32 17.824 32 20C32 22.176 31.464 24.184 30.392 26.024C29.32 27.864 27.864 29.32 26.024 30.392C24.184 31.464 22.176 32 20 32C17.824 32 15.816 31.464 13.976 30.392C12.136 29.32 10.68 27.864 9.608 26.024C8.53602 24.184 8 22.176 8 20ZM9.992 20C9.992 22.496 10.832 24.696 12.512 26.6C13.28 25.096 14.496 23.664 16.16 22.304C17.824 20.944 19.448 20.088 21.032 19.736C20.792 19.176 20.56 18.672 20.336 18.224C17.584 19.104 14.608 19.544 11.408 19.544C10.784 19.544 10.32 19.536 10.016 19.52C10.016 19.584 10.012 19.664 10.004 19.76C9.99601 19.856 9.992 19.936 9.992 20ZM10.304 17.528C10.656 17.56 11.176 17.576 11.864 17.576C14.536 17.576 17.072 17.216 19.472 16.496C18.256 14.336 16.92 12.536 15.464 11.096C14.2 11.736 13.116 12.624 12.212 13.76C11.308 14.896 10.672 16.152 10.304 17.528ZM13.88 27.896C15.688 29.304 17.728 30.008 20 30.008C21.184 30.008 22.36 29.784 23.528 29.336C23.208 26.6 22.584 23.952 21.656 21.392C20.184 21.712 18.7 22.52 17.204 23.816C15.708 25.112 14.6 26.472 13.88 27.896ZM17.552 10.328C18.96 11.784 20.264 13.6 21.464 15.776C23.64 14.864 25.28 13.704 26.384 12.296C24.528 10.76 22.4 9.992 20 9.992C19.184 9.992 18.368 10.104 17.552 10.328ZM22.328 17.48C22.568 17.992 22.84 18.64 23.144 19.424C24.328 19.312 25.616 19.256 27.008 19.256C28 19.256 28.984 19.28 29.96 19.328C29.832 17.152 29.048 15.216 27.608 13.52C26.568 15.072 24.808 16.392 22.328 17.48ZM23.744 21.104C24.56 23.472 25.112 25.904 25.4 28.4C26.664 27.584 27.696 26.536 28.496 25.256C29.296 23.976 29.776 22.592 29.936 21.104C28.768 21.024 27.704 20.984 26.744 20.984C25.864 20.984 24.864 21.024 23.744 21.104Z"
                  fill="white"></path>
              </g>
              <defs>
                <clipPath id="clip0_920_2756">
                  <rect width="24" height="24" fill="white" transform="translate(8 8)"></rect>
                </clipPath>
              </defs>
            </svg>
          </div>
          <div class="pointer-events-none absolute inset-0 rounded-[inherit] phantom-border"></div>
        </div>
        <div id="weibo"
          class="relative flex flex-col rounded-[22px] p-[22px] items-center justify-center styles_handle__shadow__g7pOg bg-[#FFFFFF]">
          <div>
            <img src="./images/icon_weibo.png" class="w-[68px] h-[54px]" alt="icon" />
          </div>
          <div class="pointer-events-none absolute inset-0 rounded-[inherit] phantom-border"></div>
        </div>
        <div id="github-link"
          class="relative flex flex-col rounded-[22px] p-[22px] items-center justify-center styles_handle__shadow__g7pOg"
          style="background: rgb(0, 0, 0)">
          <div>
            <svg width="64" height="64" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="10" fill="black"></rect>
              <g clip-path="url(#clip0_920_2749)">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M20 8C13.37 8 8 13.37 8 20C8 25.31 11.435 29.795 16.205 31.385C16.805 31.49 17.03 31.13 17.03 30.815C17.03 30.53 17.015 29.585 17.015 28.58C14 29.135 13.22 27.845 12.98 27.17C12.845 26.825 12.26 25.76 11.75 25.475C11.33 25.25 10.73 24.695 11.735 24.68C12.68 24.665 13.355 25.55 13.58 25.91C14.66 27.725 16.385 27.215 17.075 26.9C17.18 26.12 17.495 25.595 17.84 25.295C15.17 24.995 12.38 23.96 12.38 19.37C12.38 18.065 12.845 16.985 13.61 16.145C13.49 15.845 13.07 14.615 13.73 12.965C13.73 12.965 14.735 12.65 17.03 14.195C17.99 13.925 19.01 13.79 20.03 13.79C21.05 13.79 22.07 13.925 23.03 14.195C25.325 12.635 26.33 12.965 26.33 12.965C26.99 14.615 26.57 15.845 26.45 16.145C27.215 16.985 27.68 18.05 27.68 19.37C27.68 23.975 24.875 24.995 22.205 25.295C22.64 25.67 23.015 26.39 23.015 27.515C23.015 29.12 23 30.41 23 30.815C23 31.13 23.225 31.505 23.825 31.385C28.565 29.795 32 25.295 32 20C32 13.37 26.63 8 20 8Z"
                  fill="white"></path>
              </g>
              <defs>
                <clipPath id="clip0_920_2749">
                  <rect width="24" height="24" fill="white" transform="translate(8 8)"></rect>
                </clipPath>
              </defs>
            </svg>
          </div>
          <div class="pointer-events-none absolute inset-0 rounded-[inherit] phantom-border"></div>
        </div>
        <div id="buymeacoffee-link"
          class="relative flex flex-col rounded-[22px] items-center justify-center styles_handle__shadow__g7pOg bg-[#FF6734]">
          <div>
            <img src="./images/icon_kuaishou.png" class="w-[64px] h-[64px]" alt="icon" />
          </div>
          <div class="pointer-events-none absolute inset-0 rounded-[inherit] phantom-border"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
