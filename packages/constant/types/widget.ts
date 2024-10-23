/**
 * 上传文件类型
 * @img 图片
 * @media 视频+图片
 */
export enum UPLOAD_TYPE {
    img = 'img',
    video = 'video',
    media = 'media', // 包含img和video
}

/**
 * media的类型
 * @image 图片
 * @video 视频
 */
export enum MEDIA_TYPE {
    image = 'image',
    video = 'video',
}

/**
 * link的类型
 * @normal 通用连接
 * @social 社交连接
 */
export enum LINK_TYPE {
    normal = 'normal',
    social = 'social',
}

export interface Position {
    mobile: {
        x: number,
        y: number
    },
    desktop: {
        x: number,
        y: number
    }
}

export interface Style {
    mobile: {
        w: number,
        h: number
    },
    desktop: {
        w: number,
        h: number
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
    latitude?: number
    fetchStatus?: number,
    cut: Position,
    cropStatus?: boolean
}

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
export interface IAppConfigItemLeftEdit extends IAppConfigItem {
    _completed: boolean
    nickName?: string
}

/**
 * 添加媒体组件
 * @_tempId 新增时临时用的id,用于后续跟踪上传进度
 * @_tempUrl 临时展示的路径
 * @variant 类型
 */
export interface IAddMediaItem {
    // _tempId: number,
    processing?: boolean,
    // _tempUrl: string,
    variant: keyof typeof MEDIA_TYPE,
}

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