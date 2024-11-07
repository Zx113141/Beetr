<template>
  <!-- grid网格 - 手机端初始化的时候不显示，mextType > 0 的时候才 -->
  <grid-container ref="gridRef" @update="onGridUpdateWidgets" :list="userAppList" :editStatus="editStatus"
    @select="onWidgetEdit" @widget-edit="onWidgetEdit" :browser-env="browserEnv!">
    <template #top>
      <div v-if="(!userStore.isOnboared || STEP_PROCESS.congratulations === currentStep) &&
        userStore.isEdit
      " class="flex items-center toptotle" style="opacity: 1; height: 44px; margin-bottom: 32px">
        <div class="h-[2px] flex-1 bg-[#F8F8F8]"></div>
        <div class="typography-title-3 mx-4">您的主页</div>
        <div class="h-[2px] flex-1 bg-[#F8F8F8]"></div>
      </div>
    </template>
    <template #default>
      <!-- <grid-item v-for="item in userAppList" :item="item" :key="item.id" :showHandler="handlerShow(item)"
        @remove="onRemove" @handlerEdit="onWidgetEdit" @select="onWidgetEdit" @hover="onHover"
        :handlerEditing="editObject.isEditing"> -->
      <!-- <div class="wiget_size_item_container">
          <component :is="ComponentsReflect[item.type].module" :item="item" @onEdit="onModuleEdit" :key="item.id"
            :hover="editObject.visibleActionId == item.id">
          </component>
        </div>
        <template #handler>
          <component :is="ComponentsReflect[item.type].Handler" :key="item.id" :item="item" @onEdit="onWidgetEdit"
            @onEditing="onEditing">
          </component>
        </template> -->
      <!-- </grid-item> -->
    </template>
  </grid-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import {
  type IUserAppItem,
  GridMargin,
  STEP_PROCESS,
  BROWSER_ENV,
  EDIT_TYPE,
  BROWSER_ENV_GRID_COLUMN,
  // MESSAGE_TYPE,
  ENV_ENUM,
} from "@beetr/constant";
import {
  GridContainer,
  GridItem,
  GridDelete,
  type GridStackNode,
} from "@beetr/engine";
import { findEmptyPosition } from '@beetr/hooks'
import { _userStore } from "~/store/user";
import { _widgetStore } from "~/store/widget";
import { _envStore } from "~/store/env";
let flag = false



const props = defineProps<{
  deviceEnv: keyof typeof BROWSER_ENV;
  editStatus: boolean;
  browserEnv: keyof typeof BROWSER_ENV;
  currentStep: keyof typeof STEP_PROCESS;
}>();
const userStore = _userStore();
const widgetStore = _widgetStore();
const { userAppList } = storeToRefs(widgetStore);

const { deviceEnv, editStatus, browserEnv } = toRefs(props)


const emit = defineEmits<{
  (e: "postMessage", params: IUserAppItem, type: keyof typeof EDIT_TYPE): void
}>()

// TODO

// grid instance
const gridRef = ref<InstanceType<typeof GridContainer> | null>(null);

provide<boolean>("editStatus", props.editStatus);
provide<Ref<keyof typeof BROWSER_ENV>>("deviceEnv", deviceEnv!);
provide<Ref<keyof typeof BROWSER_ENV>>("browserEnv", browserEnv!);
provide('containerRef', gridRef);
onMounted(async () => {

  await render(userAppList.value,)


})


const render = async (newList: IUserAppItem[], id?: number) => {
  if (newList.length && gridRef.value) {
    await nextTick(() => {
      if (gridRef.value && !gridRef.value?.grid) {
        const width = document.documentElement.clientWidth;
        const options = {
          animate: true,
          disableDrag: !props.editStatus,
          cellHeight: deviceEnv.value! === ENV_ENUM.mobile ? width / 4 + "px" : "105px",
          column: BROWSER_ENV_GRID_COLUMN[deviceEnv.value!],
          margin: GridMargin[deviceEnv.value!],
          disableResize: true,
          float: false,
          // disableOneColumnMode: true,
          acceptWidgets: true,
          alwaysShowResizeHandle: 'mobile' as 'mobile',
          handle: browserEnv.value! == BROWSER_ENV.mobile ? '.widget_move' : '.grid-stack-item-content',
          handleClass: browserEnv.value! == BROWSER_ENV.mobile ? 'widget_move' : 'grid-stack-item-content',
          draggable: {
            handle: browserEnv.value! == BROWSER_ENV.mobile ? '.widget_move' : '.grid-stack-item-content',
          }
        }

        gridRef.value.init(options, id);
      }
    });
  }
};
const onRemove = async (id: string) => {
  gridRef!.value!.remove(id, false);
  await widgetStore.onDelete(id);
};
const onWidgetResize = (item: IUserAppItem) => {
  const el = document.getElementById(`w_${item.id}`);
  gridRef!.value!.updateWidget({
    el,
    width: item.cusStyle[deviceEnv.value!].w,
    height: item.cusStyle[deviceEnv.value!].h,
    id: item.id,
  });
};

const beforeAdd = (widgetConfig: Partial<IUserAppItem>): Partial<IUserAppItem> => {
  const otherEnv = deviceEnv.value! == BROWSER_ENV.desktop ? BROWSER_ENV.mobile : BROWSER_ENV.desktop
  findEmptyPosition(widgetConfig, userAppList.value, BROWSER_ENV_GRID_COLUMN[deviceEnv.value!], deviceEnv.value!)
  findEmptyPosition(widgetConfig, userAppList.value, BROWSER_ENV_GRID_COLUMN[otherEnv], otherEnv)

  return widgetConfig
}
const onGrdiAddWidget = (widgetConfig: Partial<IUserAppItem>) => {
  const config = beforeAdd(widgetConfig)
  widgetStore.onAdd(config).then((res: any) => {
    const lastItem = res.result.pop() as IUserAppItem
    userAppList.value.push(lastItem)
    gridRef!.value!.add(lastItem.id);
    if (widgetConfig.temType) {
      setTimeout(() => {
        // activeAnimation.value = false
      }, 1600)
    }
  })

}



// 物料更新
const onModuleEdit = (item: IUserAppItem) => {
  onWidgetUpdate([item]);
};
// hanlder 触发
const onWidgetEdit = (item: any, type: keyof typeof EDIT_TYPE,) => {
  switch (type) {
    case "resize":
      onWidgetResize(item);
      break;
    case "normal":
      onWidgetUpdate([item]);
      break;
    case "remove":
      onRemove(item.id);
      break;
    case 'select':
    case "edit":
      emit('postMessage', item, type)
      break
  }
};
const onWidgetUpdate = (widgets: IUserAppItem[]) => {
  widgetStore.onUpdate(widgets);
};

const onGridUpdateWidgets = async (updateList: GridStackNode[]) => {
  if (flag) return
  const newList: IUserAppItem[] = [];
  updateList.forEach((widget: GridStackNode) => {
    const item = userAppList.value.find(
      (i: IUserAppItem) => `w_${i.id}` == widget.id
    ) as IUserAppItem;
    item.cusStyle[deviceEnv.value!].w = widget.w!;
    item.cusStyle[deviceEnv.value!].h = widget.h!;
    item.position[deviceEnv.value!].x = widget.x!;
    item.position[deviceEnv.value!].y = widget.y!;
    newList.push(item);
  });
  await onWidgetUpdate(newList);
};

const columnChange = (newEnv: keyof typeof BROWSER_ENV) => {
  // 更新 marginconst gridMargin = computed(() => {
  const margin = newEnv === BROWSER_ENV.mobile ? '10px' : '15px'
  const width = window.parent.document.documentElement.clientWidth
  let cellHeight = newEnv === BROWSER_ENV.mobile ? width / 4 : 105

  if (newEnv == BROWSER_ENV.mobile && browserEnv.value! == BROWSER_ENV.desktop) {
    cellHeight = 411 / 4
  }

  flag = true
  gridRef.value && gridRef.value.grid && gridRef.value.grid.cellHeight(cellHeight)
  gridRef.value && gridRef.value.grid && gridRef.value.grid.margin(margin)
  gridRef.value && gridRef.value.grid && gridRef.value.grid.column(12, (column: number, oldColumn: number, nodes: GridStackNode[], oldNodes: GridStackNode[]) => {
    oldNodes.forEach((item, index) => {
      // 1763123482314510338
      const oldNode = userAppList.value.find((app: IUserAppItem) => 'w_' + app.id === item.id) as IUserAppItem
      item.x = oldNode.position[newEnv].x
      item.y = oldNode.position[newEnv].y
      item.w = oldNode.cusStyle[newEnv].w
      item.h = oldNode.cusStyle[newEnv].h
      nodes.push(item)

    })


    oldNodes.length = 0;

  })
  gridRef.value && gridRef.value.grid && gridRef.value.grid.column(BROWSER_ENV_GRID_COLUMN[newEnv], (column: number, oldColumn: number, nodes: GridStackNode[], oldNodes: GridStackNode[]) => {
    oldNodes.forEach((item, index) => {
      // 1763123482314510338
      const oldNode = userAppList.value.find((app: IUserAppItem) => 'w_' + app.id === item.id) as IUserAppItem
      item.x = oldNode.position[newEnv].x
      item.y = oldNode.position[newEnv].y
      item.w = oldNode.cusStyle[newEnv].w
      item.h = oldNode.cusStyle[newEnv].h
      nodes.push(item)

    })

    oldNodes.length = 0;
  })
  console.log(1123)
  flag = false

}

const removeWidgetList = (prepareDeleteList: IUserAppItem[]) => {
  prepareDeleteList.forEach(async (v) => {
    await onRemove(v.id)
  })
}

watch(() => props.editStatus, (newStatus) => {
  if (gridRef.value) {
    gridRef.value.grid && gridRef.value.grid?.enableMove(newStatus)
  }
}, {

})


watch(
  () => userAppList,
  async (newList) => {

    await render(newList.value)

  },
  {
    deep: true,
  }
);

watch(
  () => deviceEnv.value!,
  (newEnv, oldEnv) => {
    if (newEnv == browserEnv.value) {
      return
    }
    if (newEnv == oldEnv || !gridRef.value) return
    // grid.off('change', updateGridLayout)
    // 绕过gridstack 缓存机制
    nextTick(() => {
      columnChange(newEnv)
      // console.log(gridRef.value?.grid?.getColumn())
    })
  },
);
watch(() => props.currentStep, (step) => {
  if (!gridRef.value) return
  nextTick(() => {
    if (step == STEP_PROCESS.userInfo) {
      gridRef.value!.updateAnimateByClassNames('layoutAddani', 'gridAnimate', 1000)
    }
    if (step == STEP_PROCESS.congratulations) {
      const prepareDeleteList: IUserAppItem[] = userAppList.value.filter(item => item.temType)
      removeWidgetList(prepareDeleteList)
      // activeAnimation.value = true
      // setTimeout(() => {
      //   activeAnimation.value = false
      // }, 1600)
    }
  })

}, {
  immediate: true
})

watch(() => props.browserEnv, async (newEnv, oldEnv) => {
  gridRef.value!.dispose()
  const styleId = BROWSER_ENV_GRID_COLUMN[oldEnv]
  await nextTick(async () => {
    await render(userAppList.value, styleId)
  })

},)

onUnmounted(() => {
  gridRef.value!.dispose();
});



defineExpose({
  onGrdiAddWidget,
  removeWidgetList,
  onModuleEdit
})
</script>

<style lang="scss" scoped>
.wiget_size_item_container {
  height: 100%;
  position: relative;
}
</style>
