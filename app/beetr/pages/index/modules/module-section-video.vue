<script setup lang="ts">
const props = defineProps<{
  getTransitionStyle: Function
}>()

const { getTransitionStyle } = toRefs(props)
</script>

<template>
  <div data-w-id="d1410ccc-6e26-8b02-510e-f658d9e448ee"
    :style="getTransitionStyle('d1410ccc-6e26-8b02-510e-f658d9e448ee')" class="video-section">
    <div class="desktop-video">
      <div data-poster-url="https://beetr.oss-cn-chengdu.aliyuncs.com/admin/object/20240511/pc.jpeg"
        data-video-urls="https://beetr.oss-cn-chengdu.aliyuncs.com/admin/object/20240511/pc_video.mp4"
        data-autoplay="true" data-loop="true" data-wf-ignore="true"
        class="desktopvideo w-background-video w-background-video-atom">
        <video id="5361fad7-d974-b635-d6ab-1988351b15a3-video" autoplay loop muted playsinline style="
            /* background-image: url('https://beetr.oss-cn-chengdu.aliyuncs.com/admin/object/20240511/pc.jpeg'); */
            width: 100%;
            height: 100%;
          " data-wf-ignore="true" data-object-fit="cover">
          <source src="https://beetr.oss-cn-chengdu.aliyuncs.com/admin/object/20240511/pc_video.mp4" data-wf-ignore="true" />
          <!-- <source
            src="https://media.beetr.cc/admin/object/20240511/pc_video.mp4"
            data-wf-ignore="true" /> -->
        </video>
      </div>
      <div data-poster-url="https://beetr.oss-cn-chengdu.aliyuncs.com/admin/object/20240511/m.png"
        data-video-urls="https://media.beetr.cc/admin/object/20240511/m_video.mp4" data-autoplay="true" data-loop="true"
        data-wf-ignore="true" class="desktopvideomobile w-background-video w-background-video-atom">
        <video id="3609dc64-27a8-2546-10c8-87e9fcd41a84-video" autoplay loop muted playsinline style="
            /* background-image: url('https://beetr.oss-cn-chengdu.aliyuncs.com/admin/object/20240511/m.png'); */
            width: 100%;
            height: 100%;
          " data-wf-ignore="true" data-object-fit="cover">
          <source src="https://beetr.oss-cn-chengdu.aliyuncs.com/admin/object/20240511/m_video.mp4" data-wf-ignore="true" />
          <!-- <source
            src="https://media.beetr.cc/admin/object/20240511/m_video.mp4"
            data-wf-ignore="true" /> -->
        </video>
      </div>
    </div>
  </div>
</template>
