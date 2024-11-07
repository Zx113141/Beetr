<template>
  <div class="relative flex-1 xl:w-[840px] xl:flex-none dragUploadArea" id="dragUpload">
    <slot name="top"></slot>

    <!-- 用于渲染动画 -->
    <div :class="['grid-stack-layout', 'xl:w-[840px]']" id="layoutAddani" ref="layoutAddani">
      <!-- @remove=""
        @handler-edit="(item, type) => emits('widgetEdit', item, type)"
        @widget-edit="(item, type) => emits('widgetEdit', item, type)" -->
      <!-- <slot name="default" @select="select"></slot> -->
      <GridItem :active-widget-id="editObject.visibleActionId" :list="list" @select="select" @hover="onHover"
        @switch-edit="switchEdit" :edit="editObject.edit" :editStatus="editStatus"
        @widget-edit="(item, type) => emits('widgetEdit', item, type)">
      </GridItem>
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
  type GridStackOptions
} from "gridstack";
import useDrag from "../../../service/grid";
import "../../assets/style/grid-item.scss";
import { EDIT_TYPE, IUserAppItem, BROWSER_ENV } from "@beetr/constant";
import { onMounted, ref, provide, nextTick, reactive, watch, createVNode, watchEffect } from "vue";
import { GridItem } from "..";
const emits = defineEmits(["update", "select", "widgetEdit"]);
const [drag, dragstart, dragstop, isMovingWidget] = useDrag();


const props = defineProps<{
  list: IUserAppItem[]
  editStatus: boolean
  browserEnv: keyof typeof BROWSER_ENV
}>()
const editObject = reactive({
  visibleActionId: "", // 激活widget id
  edit: false
});

/** 必须先初始化好数据，才能初始化grid.否则样式会出问题 */
let grid = ref<GridStack | null>(null);




const onGrdiContainerClick = (e: MouseEvent) => {
  const container = document.getElementById('layoutAddani')!
  const target = e.target! as HTMLElement
  if (target.id == 'layoutAddani' || !container.contains(target)) {
    onHover('')
    select(false, EDIT_TYPE.select)
    return true
  }
  return false
}

watchEffect(() => {
  console.log(props.browserEnv);
  window.parent.window && window.parent.window.removeEventListener('click', onGrdiContainerClick)
  if (props.browserEnv == BROWSER_ENV.mobile) {
    window.parent.window.addEventListener('click', onGrdiContainerClick)
  }
})

const select = (flag: boolean, type) => {
  editObject.edit = false

  emits("select", flag, type);
}

const onHover = (id: string) => {
  editObject.visibleActionId = id;
}


const switchEdit = () => {
  editObject.edit = !editObject.edit
}


const init = (options: GridStackOptions) => {


  grid.value = GridStack.init(options,
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
  console.log(grid.value);
};

/** 布局改变，更新数据 */
const updateGridLayout = async (_event: Event, layoutList: GridStackNode[]) => {
  if (layoutList) {
    emits("update", layoutList);
  }

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
  el: HTMLElement | string,
  name: string,
  delay = 800
) => {
  const element = typeof el === "string" ? document.getElementById(el) : el;
  if (!element) {
    return
  }
  element.classList.add(name);
  setTimeout(() => {
    element.classList.remove(name);
  }, delay);
};

const disable = (flag: boolean) => {
  grid.value && grid.value.disable(flag);
};

const dispose = () => {
  if (grid.value) {
    grid.value.off("dragstart");
    grid.value.off("drag");
    grid.value.off("dragstop");
    grid.value.off("change");
    grid.value.destroy(false);
    grid.value = null;
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

const onEmit = (path: string, ...query: any) => {
  // console.log(path, query);
  grid.value && grid.value[path](query);
  console.log(grid.value);
}

provide("movingWidgetId", isMovingWidget);
provide("onEmit", onEmit);

defineExpose({
  updateWidget,
  init,
  grid,
  dispose,
  disable,
  add,
  remove,
  updateAnimateByClassNames
});
</script>

<style lang="scss" scoped></style>