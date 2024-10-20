import { defineStore } from 'pinia'
import { BROWSER_ENV } from '@beetr/constant'
import { drawData } from "./isLoading"
import {
  addAppConfig,
  deleteUserApp,
  getUserAppsListByUrl,
  updateBatchUserApp,
  type ,

} from '@/api/widget/widget'
import { IUserAppItem, IAddAppConfig } from '@beetr/constant'
// import { Promise as Promise2 } from 'canvas-confetti'
import service from '@/api/request2'
export const _widgetStore = defineStore('widget', () => {
  /** 时间戳-用户触发缓存更新 */
  const timestamp = ref(0)

  /** 用户搜索记录 **/
  const userMapSearchHistory = ref<{ name: string; center: [number, number] }[]>([])

  /** 用户主题设置 */
  const userTheme = ref<string>('light')

  /** 用户已设置的app列表 */
  const userAppList = ref<IUserAppItem[]>([])

  /** 查询用户已设置的app列表 */
  const queryUserAppList = async (path: string) => {
    try {
      const data: any = await getUserAppsListByUrl(path)
      // // userAppList.value = data
      // userAppList.value = data.data.map((x: any) => {
      //   return {
      //     ...x,
      //     w: x.cusStyle?.[env.value].w / 2,
      //     h: x.cusStyle?.[env.value].h,
      //     ...x.position?.[env.value],
      //   }
      // })
      //
      console.log(data.data)
      userTheme.value = data.theme
      userAppList.value = data.data
      return data
    } catch (err) {
      return Promise.reject(err)
    }
  }

  /** 更新列表，当env改变时，需要手动刷新 */
  const updateUserAppList = () => {
    // console.log(userAppList.value)
    // userAppList.value = userAppList.value.map((x) => {

    //   return {
    //     ...x,
    //     w: x.cusStyle?.[env.value].w / 2,
    //     h: x.cusStyle?.[env.value].h,
    //     ...x.position?.[env.value],
    //   }
    // })
  }

  /** widget-修改 */
  const onUpdate = async (list: IUserAppItem[]) => {

    /** 数据格式化 */
    const updateList = list
    // switch () {

    // }
    // console.log(list);
    await updateBatchUserApp(updateList)
    // const arr: IUserAppItem[] = []
    // userAppList.value.forEach((i: IUserAppItem) => {
    //   const item = updateList.find(k => k.id == i.id)
    //   if (item) {
    //     arr.push(reactive(item))
    //   } else {
    //     arr.push(i)
    //   }
    // })
    // userAppList.value = arr
    // console.log(userAppList);
  }

  /** widget-新增 */
  const onAdd = async (item: IAddAppConfig): Promise<IUserAppItem> => {
    return service(
      {
        url: "/jeecg-boot/app/seUsers/insertUserApps",
        method: "POST",
        data: item
      })
  }

  // const onAdd = (item: IAddAppConfig)=>{
  //   return service(
  //     {
  //         url: "/jeecg-boot/app/seUsers/insertUserApps",
  //         method: "POST",
  //         data: {
  //             ...item
  //         }
  //     })
  // }

  /** 删除 */
  const onDelete = async (id: string) => {
    const index = userAppList.value.findIndex((x) => x.id === id)!
    userAppList.value.splice(index, 1)
    if (id) {
      await deleteUserApp({ id })

    } else {
      //@ts-ignore
      return Promise.resolve()
    }
  }

  const setUserMapSearchHistory = (searchData: any[]) => {
    // 保留前3个元素
    userMapSearchHistory.value = searchData.slice(0, 3)
  }

  return {
    queryUserAppList,
    userTheme,
    userAppList,
    onUpdate,
    onAdd,
    onDelete,
    // env,
    timestamp,
    updateUserAppList,
    userMapSearchHistory,
    setUserMapSearchHistory,
  }
})
