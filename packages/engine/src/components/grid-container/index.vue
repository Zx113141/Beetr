<template>
  <div class="relative flex-1 xl:w-[840px] xl:flex-none dragUploadArea" id="dragUpload">
    <!-- <div class="flex items-center toptotle" style="opacity: 1; height: 44px; margin-bottom: 32px">
            <div class="h-[2px] flex-1 bg-[#F8F8F8]"></div>
            <div class="typography-title-3 mx-4">您的主页</div>
            <div class="h-[2px] flex-1 bg-[#F8F8F8]"></div>
        </div> -->

    <!-- 用于渲染动画 -->
    <div :class="['grid-stack-layout', 'xl:w-[840px]']" id="layoutAddani" ref="layoutAddani">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import "gridstack/dist/gridstack.min.css";
import "gridstack/dist/gridstack-extra.min.css";
import {
  type GridItemHTMLElement,
  GridStack,
  type GridStackNode,
  type GridStackWidget,
} from "gridstack";
import useDrag from "../../../service/grid";
import "../../assets/style/grid-item.scss";
import {
  BROWSER_ENV_GRID_COLUMN,
  ENV_ENUM,
  GridMargin,
  BROWSER_ENV,
} from "@beetr/constant";
import { onMounted, ref, provide, inject, nextTick } from "vue";

const emits = defineEmits(["update"]);
const [drag, dragstart, dragstop, isMovingWidget] = useDrag();


provide("movingWidgetId", isMovingWidget);

const deviceEnv = inject<keyof typeof BROWSER_ENV>("deviceEnv")!;

/** 必须先初始化好数据，才能初始化grid.否则样式会出问题 */
let grid = ref<GridStack | null>(null);
const init = () => {

  const width = document.documentElement.clientWidth;
  grid.value = GridStack.init(
    {
      animate: true,
      disableDrag: false,
      cellHeight: deviceEnv === ENV_ENUM.mobile ? width / 4 + "px" : "105px",
      column: BROWSER_ENV_GRID_COLUMN[deviceEnv],
      margin: GridMargin[deviceEnv],
      disableResize: true,
      float: false,
      // disableOneColumnMode: true,
      acceptWidgets: true,
      alwaysShowResizeHandle: "mobile",
    },
    ".grid-stack-layout"
  );
  /** 小组件-移动开始 */
  grid.value.on("dragstart", dragstart);
  //拖动时增加阻尼动画
  grid.value.on("drag", drag);
  // debugger
  /** 小组件-移动结束 */
  grid.value.on("dragstop", dragstop);
  /** 当小部件由于约束或直接更改而更改其位置/大小时发生 */
  grid.value.on("change", updateGridLayout);
};

/** 布局改变，更新数据 */
const updateGridLayout = async (_event: Event, layoutList: GridStackNode[]) => {
  emits("update", layoutList);

  // do interface
};

const updateWidget = (params: any) => {
  const { el, width, height, id } = params;
  grid.value &&
    grid.value.update(el, {
      id: `w_${id}`,
      w: width,
      h: height,
      // x: allWidth,
      // y: y,
    });
  // do animate scale TODO scale from direction
  updateAnimateByClassNames(el, "scaleY");
  // auto do updateGridLayout
};

const updateAnimateByClassNames = (
  el: HTMLElement,
  name: string,
  delay = 800
) => {
  el.classList.add(name);
  setTimeout(() => {
    el.classList.remove(name);
  }, delay);
};

const disable = () => {
  grid.value && grid.value.disable();
};

const dispose = () => {
  if (grid.value) {
    grid.value.off("dragstart");
    grid.value.off("drag");
    grid.value.off("dragstop");
    grid.value.off("change");
    grid.value.destroy();
  }
};

const add = (id: string) => {
  nextTick(() => {
    grid.value && grid.value.makeWidget("w_" + id);
    const el = document.getElementById("w_" + id)!;
    updateAnimateByClassNames(el, "scaleSpring", 600);
  });
};

const remove = (id: string, flag = true) => {
  grid.value && grid.value.removeWidget("w_" + id, flag);
};


defineExpose({
  updateWidget,
  init,
  grid,
  dispose,
  disable,
  add,
  remove,
});
</script>

<style lang="scss" scoped></style>