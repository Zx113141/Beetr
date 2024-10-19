import { get, post, getWithHtml, baseUrl, Delete } from '..'
import { type Position, type Style } from '@beetr/constant'

/** 分页查询-请求参数
 * @pageNo 查询第几页
 * @pageSize 可选，默认10.
 */
export interface IPageReq {
  pageNo: number
  pageSize: number
}

/** 分页查询-响应参数 */
interface IPageRes<Records> {
  records: Records[]
  total: number
  size: number
  current: number
  orders: any[]
  optimizeCountSql: boolean
  hitCount: boolean
  searchCount: boolean
  pages: number
}

/** 网站配置列表 */
export interface IAppConfigItem {
  widgetColor?: string
  bgColor?: string
  useFlag?: number
  widgetColorHover?: string
  appName?: string
  id?: string
  url: string
  logoUrl?: string
  widgetColorActive?: string
}
/** 平台列表-分页列表查询 */
export const getAppConfigList = (data: IPageReq) =>
  get<IPageRes<IAppConfigItem>>('/jeecg-boot/blind_box/beAppConfig/list', data)

/**
 * 添加平台接口
 * @configId 预置小组件的id
 * @type 小组件类型 link, media
 * @type 是type=media的细分，①image-图片模式；②video-视频模式；
 * @nickName 第三方网站-用户账号
 * @position 所在位置，传入形式是{mobile: {x: 0, y: 10}, desktop: {x: 0, y: 4}
 * @cusStyle 宽高信息，传入形式{mobile: {w: 0, h: 10}, desktop: {w: 0, h: 4}
 * @url 第三方网站地址
 * @widgetColor 小组件中按钮的颜色
 * @widgetColorActive 小组件修改标题时显示的
 * @widgetColorHover 小组件鼠标移入时的背景色
 * @halign ？ 水平方向定位
 * @valign ？ 垂直方向定位
 * @bgColor ? 背景色
 */
export interface IAddAppConfig {
  configId?: string
  position: Position
  cusStyle: Style
  url?: string
  nickName?: string
  bgColor?: string
  widgetColor?: string
  widgetColorActive?: string
  widgetColorHover?: string
  type: string
  variant?: string
  halign?: {
    desktop?: string
    mobile?: string
  }
  valign?: {
    desktop?: string
    mobile?: string
  }
}

/**
 * 用户的第三方网站
 * @param {string} _tempId 新增组件块时，在未写入数据时用的临时id (deprecated)
 * @configId 前端新增块时会存在该参数，在插入到数据后则不会再有
 * @id 真实数据库id，_tempId存在时优先使用_tempId
 * @halign ？ 水平方向定位
 * @valign ？ 垂直方向定位
 * @caption ？media组件中输入的富文本
 * @content ？ 富文本
 * @_percent ？ number 上传文件时的进度，仅用于本地交互，不存在云端
 * @_tempUrl ？ number 本地视频连接，仅用于本地交互，不存在云端
 * @type 小组件类型 link, media
 * @variant 是type=media的细分，①image-图片模式；②video-视频模式；
 * @nickName 第三方网站-用户账号
 * @appColor 第三方网站主题色
 * @bgColor 背景色
 * @description 第三方网站描述
 * @logoUrl 第三方网站url
 * @faviconUrl logo
 * @position 所在位置对象，{mobile: {x: 0, y: 10}, desktop: {x: 0, y: 4}
 * @cusStyle 宽高信息对象，{mobile: {w: 0, h: 10}, desktop: {w: 0, h: 4}
 * @screenshotUrl 封面图
 * @siteName 站点名称
 * @siteVideoUrl siteVideoUrl
 * @title 第三方网站标题
 * @url 第三方网站地址
 * @userId 所属用户
 * @videoUrl 视频地址
 * @widgetColor 小组件中按钮的颜色
 * @widgetColorActive 小组件修改标题时显示的
 * @widgetColorHover 小组件鼠标移入时的背景色
 */
export interface IUserAppItem {
  halign?: {
    desktop?: string
    mobile?: string
  }
  position2?: Position,
  valign?: {
    desktop?: string
    mobile?: string
  }
  id: string
  _tempId?: string | number
  configId?: string
  type: string
  variant?: string
  temType?: string,
  _percent: number | string
  _tempUrl?: string
  caption?: any
  content?: any
  position: Position
  cusStyle: Style
  nickName?: string
  title?: string
  url?: string
  description?: string
  appColor?: string
  faviconUrl?: string
  screenshotUrl?: any
  siteName?: string
  siteVideoUrl?: any
  videoUrl?: any
  userId?: string
  bgColor?: string
  widgetColor?: string
  widgetColorHover?: string
  widgetColorActive?: string
  x?: number
  y?: number
  h: number
  w: number
  btnCus?: string
  follow?: string
  processing?: boolean
  zoom?: number
  longitude?: number
  latitude?: number,
  cropStatus?: boolean,
  // 图片裁剪
  cut: {
    desktop: {
      x: number,
      y: number
    },
    mobile: {
      x: number,
      y: number
    }
  }
}
/** 平台列表-添加 */
export const addAppConfig = (data: IAddAppConfig) =>
  post<IUserAppItem[]>('/jeecg-boot/app/seUsers/insertUserApps', data)

/** 上传接口 */
export const uploadFileUrl = baseUrl + '/jeecg-boot/app/utils/aliOssUpload'

/** 删除用户的第三方网站 */
export const deleteUserApp = (data: { id: string }) =>
  Delete<any[]>('/jeecg-boot/app/seUsers/deleteUserApp', data)

/** 批量修改用户的第三方网站 */
export const updateBatchUserApp = (data: IUserAppItem[]) =>
  post<IUserAppItem[]>('/jeecg-boot/app/seUsers/bathUpdateUserApps', data)

/** 用户模块-获取用户的第三方网站 */
export const getUserAppsList = () => get<IUserAppItem[]>('/jeecg-boot/app/seUsers/getUserApps')

/** 用户模块-获取用户的第三方网站-通过url查询 */
export const getUserAppsListByUrl = (url: string) =>
  get<IUserAppItem[]>(`/jeecg-boot/app/seUsers/userDetailByUrl/${url}`)

/** 获取html */
export const getMainHtml = (data: { path: string }) => getWithHtml<string>('/main', data)
