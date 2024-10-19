<script setup lang="ts">
import { getTagList } from "@/api/user/user";

const labelList = ref<{ name: string; icon: string; }[]>(await getTagList())

</script>

<template>
  <div class="label-list">
    <ul :class="['label-carousel', labelList.length > 10 ? 'carousel-slide' : '']">
      <li class="label-item" v-for="(item, index) in labelList" :key="index">
        <div class="label-icon" v-if="item.icon">
          <img :src="item.icon" alt="icon">
        </div>
        <div class="label-name">{{ item.name }}</div>
      </li>
      <!-- Repeat items to create seamless effect -->
      <li v-if="labelList.length > 10" class="label-item" v-for="(item, index) in labelList" :key="index">
        <div class="label-icon" v-if="item.icon">
          <img :src="item.icon" alt="icon">
        </div>
        <div class="label-name">{{ item.name }}</div>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
$box-height: 60px;
$box-shadow-width: 200px;
$box-shadow-color: #ffffff;

.label-list {
  position: relative;
  width: 100%;
  white-space: nowrap;
  box-sizing: border-box;
  padding: 12px 36px;
  overflow: hidden;
  margin-top: 100px;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    height: $box-height;
    width: $box-shadow-width;
    background: linear-gradient(to right, $box-shadow-color, transparent);
    z-index: 1;
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    height: $box-height;
    width: $box-shadow-width;
    background: linear-gradient(to left, $box-shadow-color, transparent);
    z-index: 1;
  }

  .label-carousel {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .label-item {
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 8px;
    padding: 6px 12px;
    background: #f3f5f6;
    border-radius: 20px;
    margin-right: 15px;

    .label-icon {
      width: 24px;
      height: 24px;

      img {
        width: 100%;
        height: 100%;
        vertical-align: middle;
      }
    }

    .label-icon {
      color: #333333;
      font-size: 22px;
      font-weight: 500;
    }
  }
}

.carousel-slide {
  justify-content: flex-start;
  animation: loop 24000ms linear infinite;

  &::-webkit-scrollbar {
    display: none;
  }


  @keyframes loop {
    0% {
      transform: translateX(0);
    }

    100% {
      transform: translateX(-50%);
    }
  }
}


@media screen and (max-width: 479px) {
  .label-list {
    margin-top: 50px;

    &:before,
    &:after {
      width: 100px;
    }
  }

  .carousel-slide {
    animation: loop 10000ms linear infinite;
  }
}
</style>
