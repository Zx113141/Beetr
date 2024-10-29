
// 匹配以1开头的11位数字
// export const REG_EMAIL_NUMBER = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
// @2024-06-06 优化 - 注册或登录时候的邮箱校验，只校验是否有@
export const REG_EMAIL_NUMBER = /^[^@]+@[^@]+$/



export const SVG_LOADING = `
  <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="#000000" d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0zm-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"></path></svg>
  `
// :element-loading-spinner="SVG_LOADING"

/** 动画执行方向 */
export enum ANIMATION_DIRECTION {
    sliderLeft = 'slide-left',
    sliderRight = 'slide-right',
}

/** 登录凭证 */
export const TOKEN_CREDENTIALS = 'TOKEN_CREDENTIALS'

/** 访问凭证 */
export const VISIT_CREDENTIALS = 'VISIT_CREDENTIALS'


/** 针对这2个色值，设置黑色边框 */
export const WHITE_COLOR = ['rgb(255, 255, 255)', 'rgb(250, 250, 250)']

/** 校验rgb、rgba、和#开头的10进制颜色 */
export const EXG_COLOR =
    /^(rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)|rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),([01]|0?\.\d+|\.\d+)\)|#[A-Fa-f0-9]{6}|#[A-Fa-f0-9]{3})$/

/** 上传-支持的图片类型 */
export const IMG_ACCEPT_FILES = [
    'image/png',
    'image/jpeg',
    'image/x-png',
    'image/gif',
    'image/bmp',
    'image/jpeg',
    'image/webp',
    'image/heic',
]

/** media模式支持上传的类型 */
export const VIDEO_ACCEPT_FILES = [
    'video/mp4',
    'video/x-m4v',
    'video/quicktime',
    'video/mpeg',
    'video/ogg',
    'video/x-msvideo',
]

/** 从iframe发出的点击的事件 */
// export const EVENT_CLICK_FROM_CHILD = 'EVENT_CLICK_FROM_CHILD'

/** 当前所有步骤对应的form */
export enum STEP_PROCESS {
    accountLabel = 'accountLabel',
    socialMedia = 'socialMedia',
    linkAnything = 'linkAnything',
    congratulations = 'congratulations',
    userInfo = 'userInfo',
}


/** 可选的颜色列表 */
export const colorList = [
    {
        bgColor: '#FFFFFF',
        color: '#000000',
    },
    {
        bgColor: '#FAFAFA',
        color: '#000000',
    },
    {
        bgColor: '#5AB2E6',
        color: '#ffffff',
    },
    {
        bgColor: '#2292E2',
        color: '#ffffff',
    },
    {
        bgColor: '#2268B1',
        color: '#ffffff',
    },
    {
        bgColor: '#F6C823',
        color: '#000000',
    },
    {
        bgColor: '#F96F20',
        color: '#ffffff',
    },
    {
        bgColor: '#494949',
        color: '#ffffff',
    },
    /////
    {
        bgColor: '#494949',
        color: '#ffffff',
    },
    {
        bgColor: '#000000',
        color: '#ffffff',
    },
    {
        bgColor: '#E6B1F3',
        color: '#000000',
    },
    {
        bgColor: '#E487D7',
        color: '#ffffff',
    }, {
        bgColor: '#DD5ABB',
        color: '#ffffff',
    },
    {
        bgColor: '#A6F9E8',
        color: '#000000',
    },
    {
        bgColor: '#3EB59D',
        color: '#ffffff',
    },
    {
        bgColor: '#1B7865',
        color: '#ffffff',
    }
]

export const BeijingLocation = {
    latitude: 39.909466,
    longitude: 116.397389,
    zoom: 14
}

// 最大上传大小
export const UPLOAD_MAX_SIZE = 10

/**
 * 设置访问密码表单
 * {"visitorType":"访问类型 0公开，1密码，2私密 ","pwd":"密码，如果visitorType是1则改字段必传"}
 */
export const VIEW_PWD_TYPE_LIST = [
    {
        type: 0,
        name: '公开访问',
        tips: '伙伴们都能访问到你的主页'
    },
    {
        type: 1,
        name: '使用密码访问',
        tips: '输入你设置的密码可访问'
    },
    {
        type: 2,
        name: '不允许任何人访问',
        tips: '只有你能访问'
    }
]

export enum GridMargin {
    desktop = '15px',
    mobile = '10px'
}

export const randomList = [
    {

        width: 1,
        height: 2,

    },
    {

        width: 2,
        height: 2,
    },
    {

        width: 1,
        height: 4,
    },
    {
        width: 2,
        height: 4,
    },
]