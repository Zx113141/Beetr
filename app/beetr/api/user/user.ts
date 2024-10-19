import { post, get, put } from '..'

/** 接口-注册请求参数 */
interface IRegisterReq {
  password: string
  email: string
  url: string
}
/** 注册接口 */
export const register = (data: IRegisterReq) => post('/jeecg-boot/app/seUsers/userRegister', data)

/**
 * 账号登录请求参数
 * @phone 手机号
 * @captcha 验证码
 */
export interface IOnLoginByPhoneReq {
  code?: number
  email: string
}
/** 登录-手机号+验证阿妈 */
export const onLoginByPhone = (data: IOnLoginByPhoneReq) =>
  post<string>('/jeecg-boot/app/seUsers/userLoginCode', data)

/**
 * 链接登录请求参数
 * @url 个人链接
 * @password 密码
 */
export interface IOnLoginByUrlReq {
  password: string
  email: string

}
/** 登录-链接+密码 */
export const onLoginByUrl = (data: IOnLoginByUrlReq) =>
  post<{
    token: string,
    url: string
  }>('/jeecg-boot/app/seUsers/userLogin', data, true)

/**
 * 验证码请求参数
 * @mode mode='2'忘记密码
 * @phone 手机号
 */
export interface ISendCaptchaReq {
  mode: '2'
  email: string
}
/** 发送验证码 */
export const sendCaptcha = (data: ISendCaptchaReq) => post('/jeecg-boot/app/seUsers/sms', data)

/** 判断链接是否可用 */
export const exitUrlFlag = (url: string) =>
  get<Boolean>(`/jeecg-boot/app/seUsers/exitUrlFlag/${url}`, undefined, false)

// /** 判断手机号是否存在 */
// export const exitPhoneFlag = (phone: string) =>
//   get<Boolean>(`/jeecg-boot/app/seUsers/exitPhoneFlag/${phone}`)

/** 判断邮箱是否存在 */
export const exitEmailFlag = (email: string) =>
  get<Boolean>(`/jeecg-boot/app/seUsers/exitEmailFlag/${email}`, undefined, false)

/**
 * 用户信息
 * @onboarded 1-已设置完成 0-未设置完成
 */
export interface IUserInfoRes {
  id: string
  avatarUrl: string
  nickName?: any
  phone: string
  sex?: any
  password: string
  createTime: string
  delFlag: number
  expreTime?: any
  cardName?: any
  orderId?: any
  cardId?: any
  followNum: number
  descript?: any
  salt: string
  countNum?: any
  bgImg?: any
  followFlag?: any
  type: number
  tags: string
  tagNameMap: any
  url: string
  onboarded?: number
  onlock?: number
  visitCount?: number
  visitType?: number
  visitorType?: number
}

/** 用户模块-通过token查询用户信息 */
export const getUserInfoByToKen = () =>
  get<IUserInfoRes>(`/jeecg-boot/app/seUsers/queryById`, undefined, false)

/** 用户模块-通过url查询 */
export const getUserInfoByUrl = (url: string) =>
  get<IUserInfoRes>(`/jeecg-boot/app/seUsers/userDetail/${url}`, undefined, false)

/** 忘记密码-请求参数 */
export interface IResetPasswordReq {
  code?: number
  password: string
  phone: string
}
/** 用户模块-重置密码 */
export const resetPassword = (data: IResetPasswordReq) =>
  post(`/jeecg-boot/app/seUsers/resetPassword`, data)

/** 用户模块-编辑 */
export const updateUserInfo = (data: IUserInfoRes) =>
  put<IUserInfoRes>(`/jeecg-boot/app/seUsers/edit`, data)

/** 忘记密码-请求参数 */
export interface IResetPasswordByLoginReq {
  password: string
  phone: string
}
/** 用户模块-重置密码 */
export const resetPasswordByLogin = (data: IResetPasswordByLoginReq) =>
  post(`/jeecg-boot/app/seUsers/resetPasswordByLogin`, data)

/** 用户模块-获取Tag列表 */
export const getTagList = () =>
  get<{ id: string; name: string; icon: string; }[]>(`/jeecg-boot/app/tag/list`)

/** 绑定标签-请求参数 */
export interface IUserSelectTagReq {
  url: string
  tags: string
}
/** 用户模块-绑定标签 */
export const userSelectTag = (data: IUserSelectTagReq) =>
  post(`/jeecg-boot/app/seUsers/userSelectTag`, data)

/** 用户模块-访问配置信息保存 */
export interface IUserVisitorSetReq {
  visitorType: number
  pwd: string
}

/** 用户模块-访问密码配置 */
export const getVisitSet = () =>
  get<IUserVisitorSetReq>(`/jeecg-boot/app/visitorSet/getVisitSet`, undefined, false)

// {"visitorType":"访问类型 0公开，1密码，2私密 ","pwd":"密码，如果visitorType是1则改字段必传"}

/** 用户模块-访问配置信息保存 */
export const SaveVisitorSet = (data: IUserVisitorSetReq) =>
  post(`/jeecg-boot/app/visitorSet/save`, data)

/** 用户模块-访问配置信息保存 */
export interface IUserVisitorPwdReq {
  url: string
  pwd: string
}

/** 用户模块-密码登录访问的url */
export const visitByPwd = (data: IUserVisitorPwdReq) =>
  post(`/jeecg-boot/app/visitorSet/visitByPwd`, data, true)
