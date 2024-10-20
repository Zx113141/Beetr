<template>
  <div class="relative flex min-h-screen w-full flex-1 flex-col items-center browser-desktop">
    <!-- 左边栏 -->
    <div
      class="flex h-full w-full max-w-[428px] items-center justify-center p-6 pt-12 pb-0 xl:absolute xl:top-0 xl:max-w-[min(100vw,1728px)] xl:items-stretch xl:justify-start xl:p-16">
    </div>
    <!-- grid网格 - 手机端初始化的时候不显示，mextType > 0 的时候才 -->
    <div
      class="xl:flex flex h-full w-full max-w-[428px] flex-1 flex-col pt-0 xl:max-w-[1728px] xl:flex-row xl:p-16 xl:overflow-hidden">
      <div class="mb-10 flex flex-col px-4 xl:mb-0 xl:mr-20 xl:flex-1 xl:px-0"></div>
      <grid-container :env="deviceEnv" ref="gridRef" @update="onGridUpdateWidgets">
        <grid-item v-for="item in userAppList" :item="item" :key="item.id" :env="deviceEnv"
          :isWidgetEdit="editObject.isEditing" @mouseHover="onHover">
          <div class="wiget_size_item_container">
            <component :is="ComponentsReflect[item.type]" :item="item" @onEdit="onModuleEdit" :env="deviceEnv"
              :isEdit="editStatus"></component>
            <grid-resize :env="deviceEnv" :visible-action-id="editObject.visibleActionId" :item="item"
              @onEdit="onWidgetEdit" @onEditing="onEditing">
            </grid-resize>
            <grid-delete :visible-action-id="editObject.visibleActionId" :item="item" @remove="onRemove">
            </grid-delete>
          </div>
        </grid-item>
      </grid-container>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import {
  type IUserAppItem,
  type ENV_ENUM,
  STEP_PROCESS,
  BROWSER_ENV,
  EDIT_TYPE
} from "@beetr/constant";
import {
  GridContainer,
  GridItem,
  GridResize,
  GridDelete,
  type GridStackNode,
  type GridStackWidget,
} from "@beetr/engine";
import { BeetrModules } from "@beetr/materials";
import { _userStore } from "~/store/user";
import { _widgetStore } from "~/store/widget";
import { _envStore } from "~/store/env";

// 注册Component
const ComponentsReflect: any = {};
BeetrModules.forEach((item) => {
  ComponentsReflect[item.name] = item.module;
});

const props = defineProps<{
  deviceEnv: keyof typeof BROWSER_ENV;
  editStatus:boolean
}>();


const widgetStore = _widgetStore();
const { userAppList } = storeToRefs(widgetStore);

// TODO 
const editObject = reactive({
  visibleActionId: "", // 激活widget id
  isEditing: false, // 是否正在编辑
});
const onEditing = (isEdit: boolean) => {
  editObject.isEditing = isEdit;
};

const onHover = (id: string) => {
  editObject.visibleActionId = id;
};

// grid instance
const gridRef = ref<InstanceType<typeof GridContainer> | null>(null);


const onRemove =async (id:string) => { 
  gridRef!.value!.remove(`w_${id}`)
  await widgetStore.onDelete(id)
};
const onWidgetResize = (item: IUserAppItem) => {
  const el = document.getElementById(`w_${item.id}`);
  gridRef!.value!.updateWidget({
    el,
    width: item.cusStyle[props.deviceEnv].w,
    height: item.cusStyle[props.deviceEnv].h,
    id: item.id,
  });
};
// 物料更新
const onModuleEdit = (item: IUserAppItem) => {
  onWidgetUpdate([item]);
};
// hanlder 触发
const onWidgetEdit = (item: IUserAppItem, type: keyof typeof EDIT_TYPE) => {
  switch (type) {
    case "resize":
      onWidgetResize(item);
      break;
    case "normal":
      onWidgetUpdate([item]);
      break;
  }
};
const onWidgetUpdate = (widgets: IUserAppItem[]) => {
  widgetStore.onUpdate(widgets);
};

const onGridUpdateWidgets = async (updateList: GridStackNode[]) => {
  const newList: IUserAppItem[] = [];
  updateList.forEach((widget: GridStackNode) => {
    const item = userAppList.value.find((i: IUserAppItem) => `w_${i.id}` == widget.id) as IUserAppItem
    item.cusStyle[props.deviceEnv].w = widget.w!
    item.cusStyle[props.deviceEnv].h = widget.h!
    item.position[props.deviceEnv].x = widget.x!
    item.position[props.deviceEnv].y = widget.y!
    newList.push(item)
  });
  await onWidgetUpdate(newList)
};

watch(
  () => userAppList,
  async (newList) => {
    if (newList.value.length && gridRef.value) {
      await nextTick(() => {
        if (!gridRef.value?.grid) {
          gridRef.value.init();
        }
      });
    }
  },
  {
    deep: true,
  }
);

onUnmounted(() => {
  gridRef.value!.dispose();
});

// provide context here

provide<keyof typeof BROWSER_ENV>("env", props.deviceEnv);
provide<boolean>("editStatus", props.editStatus);
</script>

<style lang="scss" scoped>
.wiget_size_item_container {
  height: 100%;
  position: relative;
}
</style>
