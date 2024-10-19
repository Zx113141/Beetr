<script setup lang="ts">
import pngLinkBlock2 from '../images/link-block-2.png'
import pngCardMusic from '../images/card-music.png'
import pngCardGumroad from '../images/card-gumroad.png'
import pngCardCalendar from '../images/card-calendar.png'
import pngCardMap from '../images/card-map.png'
import pngCardWrite from '../images/card-write.png'
import pngCardSea from '../images/card-sea.png'
import pngCardGit from '../images/card-git.png'
import pngCardFigma from '../images/card-figma.png'
import pngCardWeibo from '../images/card-weibo.png'
import pngCardCamcord from '../images/card-camcord.png'
import pngCardUiKit from '../images/card-uiKit.png'
import pngCardDouyin from '../images/widget-parent-3.png'
import pngCardZCool from '../images/widget-parent-1.png'

const props = defineProps<{
  getTransitionStyle: Function
}>()

const { getTransitionStyle } = toRefs(props)
</script>

<template>
  <div class="all-the-widgets">
    <div class="div-block-105">
      <div class="div-block-109">
        <h1 class="subheading-4">你的视频、播客、音乐、照⽚、付<br />费产品、代码、简历</h1>
        <div class="fade-out"></div>
      </div>
      <h1 class="subheading-6">
        所有内容链接都聚合到个人专属的主页中<br />不再分散互联网的各个角落
      </h1>
    </div>
    <div class="div-block-104">
      <div class="column-horizontal-2">
        <div class="div-block-36-empty">
          <div class="image-20 !w-[175px] !h-[175px] bg-[#FCF4F4] rounded-3xl"></div>
        </div>
        <div class="div-block-36-empty">
          <div class="image-20 !w-[175px] !h-[175px] bg-[#FCF4F4] rounded-3xl"></div>
        </div>
        <div class="div-block-36-empty">
          <div class="image-20 !w-[175px] !h-[175px] bg-[#FCF4F4] rounded-3xl"></div>
        </div>
        <div class="div-block-36-empty">
          <div class="image-20 !w-[175px] !h-[175px] bg-[#FCF4F4] rounded-3xl"></div>
        </div>
        <div class="div-block-36-empty">
          <div class="image-20 !w-[175px] !h-[175px] bg-[#FCF4F4] rounded-3xl"></div>
        </div>
        <div class="div-block-36-empty">
          <div class="image-20 !w-[175px] !h-[175px] bg-[#FCF4F4] rounded-3xl"></div>
        </div>
        <div class="div-block-36-small">
          <div class="image-20 !w-[175px] !h-[175px] bg-[#F4FCFC] rounded-3xl"></div>
        </div>
      </div>
      <div class="column-horizontal-1">
        <div class="div-block-36-empty">
          <div class="image-20 !w-[175px] !h-[175px] bg-[#FCF4F4] rounded-3xl"></div>
        </div>
        <div class="div-block-36-empty">
          <div class="image-20 !w-[175px] !h-[175px] bg-[#FCF4F4] rounded-3xl"></div>
        </div>
        <div class="div-block-36-empty">
          <div class="image-20 !w-[175px] !h-[175px] bg-[#FCF4F4] rounded-3xl"></div>
        </div>
        <div class="div-block-36-empty">
          <div class="image-20 !w-[175px] !h-[175px] bg-[#FCF4F4] rounded-3xl"></div>
        </div>
        <div class="div-block-36-empty">
          <div class="image-20 !w-[175px] !h-[175px] bg-[#FCF4F4] rounded-3xl"></div>
        </div>
        <div class="div-block-38">
          <div
            data-w-id="68e23490-dbe8-ff04-3f35-ea5ee95e20ce"
            style="
              width: 251.703px;
              height: 251.703px;
              transform: translate3d(122.284px, -122.284px, 0px) scale3d(1, 1, 1) rotateX(0deg)
                rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
              opacity: 0.0925088;
              transform-style: preserve-3d;
              will-change: opacity, transform, width, height;
            "
            class="live-pulse"
          ></div>
          <img
            src="https://global-uploads.webflow.com/6335b33630f88833a92915fc/63863649cdd0231b56a62389_youtubewidget.png"
            loading="lazy"
            width="390"
            height="175"
            srcset="
              https://global-uploads.webflow.com/6335b33630f88833a92915fc/63863649cdd0231b56a62389_youtubewidget-p-500.png   500w,
              https://global-uploads.webflow.com/6335b33630f88833a92915fc/63863649cdd0231b56a62389_youtubewidget-p-800.png   800w,
              https://global-uploads.webflow.com/6335b33630f88833a92915fc/63863649cdd0231b56a62389_youtubewidget-p-1080.png 1080w,
              https://global-uploads.webflow.com/6335b33630f88833a92915fc/63863649cdd0231b56a62389_youtubewidget.png        1167w
            "
            sizes="100vw"
            alt=""
            class="image-20-a"
          />
        </div>
        <div class="div-block-36-small">
          <div class="image-20 !w-[175px] !h-[175px] bg-[#FCFCF4] rounded-3xl"></div>
        </div>
      </div>
      <div
        data-w-id="9fce6c82-f420-106e-015c-548de253f876"
        class="column-1"
        :style="getTransitionStyle('9fce6c82-f420-106e-015c-548de253f876')"
      >
        <a class="link-block-2 w-inline-block"> <el-image lazy :src="pngLinkBlock2"> </el-image></a>
        <div class="div-block-36-fake">
          <div class="image-20-fake !w-[175px] !h-[175px] bg-[#F4FCFC] rounded-3xl"></div>
        </div>
        <a class="link-block-2 w-inline-block">
          <el-image :src="pngCardMusic" class="image-20" lazy></el-image>

          <div data-w-id="d09984f3-357b-8e91-928a-c0a47c801b3d" class="div-block-341"></div>
          <img
            src="./svg-note.svg"
            loading="lazy"
            data-w-id="b91d16de-0798-abac-5b42-2d3e8bfc3a33"
            alt=""
            class="note1" /><img
            src="./svg-note.svg"
            loading="lazy"
            data-w-id="69b773c6-36a6-f00e-ef18-7acd55067cdb"
            alt=""
            class="note2" /><img
            src="./svg-note.svg"
            loading="lazy"
            data-w-id="746d1ee7-c008-68b3-9dea-98e1f0a52c52"
            alt=""
            class="note3"
        /></a>
      </div>
      <div
        data-w-id="d24b7f3f-f415-38ef-9e3e-6b2771df7425"
        class="column-2"
        :style="getTransitionStyle('d24b7f3f-f415-38ef-9e3e-6b2771df7425')"
      >
        <div class="small-row-right">
          <div class="div-block-36-fake">
            <div class="image-20-fake !w-[175px] !h-[175px] bg-[#FCFCF4] rounded-3xl"></div>
          </div>
        </div>
        <a class="link-block-1 w-inline-block">
          <el-image class="image-20 align-top" lazy :src="pngCardGumroad"></el-image>
        </a>
        <a class="link-block-1 w-inline-block">
          <el-image class="image-20 align-top" lazy :src="pngCardCalendar"></el-image></a
        ><a class="link-block-338 w-inline-block">
          <el-image class="image-20 align-top" lazy :src="pngCardWrite"></el-image>
        </a>

        <a
          pointer-events="none"
          data-w-id="7f1c5895-5c19-bcc5-e631-84b1c0785d3b"
          class="link-block-48-special w-inline-block"
        >
          <el-image class="image-47 align-top" lazy :src="pngCardUiKit"></el-image>
        </a>
      </div>
      <div
        data-w-id="1324e53d-7f5a-99ac-7743-a594efa01f93"
        class="column-3"
        :style="getTransitionStyle('1324e53d-7f5a-99ac-7743-a594efa01f93')"
      >
        <a class="link-block-1 w-inline-block">
          <el-image class="image-26 align-top" lazy :src="pngCardSea"></el-image></a
        ><a class="link-block-338 w-inline-block">
          <el-image class="image-20 align-top" lazy :src="pngCardGit"></el-image> </a
        ><a class="link-block-1 w-inline-block">
          <el-image class="align-top" lazy :src="pngCardFigma"></el-image> </a
        ><a class="link-block-1 w-inline-block">
          <el-image class="image-26 align-top" lazy :src="pngCardMap"></el-image>

          <div data-w-id="1324e53d-7f5a-99ac-7743-a594efa01f9d" class="location-pulse"></div>
        </a>
      </div>
      <div
        data-w-id="6b35b741-6f6e-8659-eacb-698c36580ad7"
        class="column-4"
        :style="getTransitionStyle('6b35b741-6f6e-8659-eacb-698c36580ad7')"
      >
        <div class="div-block-36-fake">
          <div class="image-20-fake !w-[175px] !h-[175px] bg-[#FCF4F4] rounded-3xl"></div>
        </div>
        <div class="div-block-36-empty">
          <div class="image-20 !w-[175px] !h-[175px] bg-[#FCF4F4] rounded-3xl"></div>
        </div>
        <a class="link-block-2 w-inline-block">
          <el-image class="image-20 align-top" lazy :src="pngCardWeibo"></el-image>
        </a>
        <div class="div-block-36-fake-2">
          <div class="image-20-fake !w-[175px] !h-[175px] bg-[#FCFCF4] rounded-3xl"></div>
        </div>
        <div class="div-block-36-empty">
          <div class="image-20 !w-[175px] !h-[175px] bg-[#FCF4F4] rounded-3xl"></div>
        </div>
        <a class="link-block-3 w-inline-block">
          <el-image class="image-20 align-top" lazy :src="pngCardCamcord"></el-image>
        </a>
      </div>
      <div class="column-5">
        <a class="div-block-37 w-inline-block">
          <el-image class="image-26 align-top" lazy :src="pngCardSea"></el-image>
        </a>
        <div class="div-block-108">
          <div class="div-block-107">
            <a class="div-block-39 w-inline-block">
              <el-image class="image-20 align-top" lazy :src="pngCardWeibo"></el-image>
            </a>
            <a class="div-block-36 w-inline-block">
              <el-image class="image-20 align-top" lazy :src="pngCardZCool"></el-image>
            </a>
          </div>
          <div class="div-block-107">
            <a class="div-block-36 w-inline-block">
              <el-image class="image-20 align-top" lazy :src="pngCardDouyin"></el-image>
            </a>
            <a class="div-block-78 w-inline-block">
              <el-image class="image-20 align-top" lazy :src="pngCardMusic"></el-image>
            </a>
          </div>
        </div>
        <a class="div-block-37 w-inline-block">
          <el-image class="image-20 align-top" lazy :src="pngCardCalendar"></el-image>
        </a>
        <a class="div-block-38 w-inline-block">
          <el-image class="image-20 align-top" lazy :src="pngCardWrite"></el-image> </a
        ><a
          pointer-events="none"
          data-w-id="2afa32b0-a7be-38da-9b4a-8eeb69ea06c9"
          class="link-block-48-special-mobile w-inline-block"
        >
          <el-image class="image-47 align-top" lazy :src="pngCardUiKit"></el-image>
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.location-pulse {
  animation: loop_map 3000ms cubic-bezier(0, 0.5, 0.497, 0.997) infinite;
  @keyframes loop_map {
    from {
      width: 26px;
      height: 26px;
      opacity: 0.3;
    }
    to {
      width: 240px;
      height: 240px;
      opacity: 0;
    }
  }
}
.div-block-341 {
  animation: loop 2400ms cubic-bezier(0, 0.512, 0.216, 0.997) infinite;
  @keyframes loop {
    from {
      transform: scale(1, 1);
      opacity: 0.5;
      filter: blur(0);
    }
    to {
      transform: scale(5, 5);
      opacity: 0;
      filter: blur(0.4);
    }
  }
}
.note1 {
  animation: loop_note1 1600ms cubic-bezier(0, 0.436, 0.298, 0.985) infinite;
  @keyframes loop_note1 {
    from {
      transform: translate(37px, 37px) rotateZ(-40deg);
      opacity: 1;
      filter: blur(0);
    }
    to {
      transform: translate(80px, 7px) rotateZ(0deg);
      opacity: 0;
      filter: blur(3);
    }
  }
}
.note2 {
  animation: loop_note2 1600ms cubic-bezier(0, 0.436, 0.298, 0.985) 300ms infinite;
  @keyframes loop_note2 {
    from {
      transform: translate(37px, 37px) rotateZ(60deg);
      opacity: 1;
      filter: blur(0);
    }
    to {
      transform: translate(5px, 73px) rotateZ(0deg);
      opacity: 0;
      filter: blur(3);
    }
  }
}
.note3 {
  animation: loop_note3 1600ms cubic-bezier(0, 0.436, 0.298, 0.985) 700ms infinite;
  @keyframes loop_note3 {
    from {
      transform: translate(37px, 37px) rotateZ(-30deg);
      opacity: 1;
      filter: blur(0);
    }
    to {
      transform: translate(11px, -11px) rotateZ(0deg);
      opacity: 0;
      filter: blur(3);
    }
  }
}
</style>
