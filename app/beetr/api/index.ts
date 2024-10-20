// import baseUrl from './baseUrl'
// import { ElMessage } from 'element-plus'
import type { NitroFetchRequest } from 'nitropack'
import type { UseFetchOptions } from 'nuxt/dist/app/composables/fetch'
import { ElNotification } from 'element-plus'
import { throttle } from '@beetr/hooks'
// import { isLoading } from '~~/store/isLoading'

import { VISIT_CREDENTIALS, TOKEN_CREDENTIALS } from '@beetr/constant'

// 指定后端返回的基本数据类型
export interface ResponseConfig {
    code: number
    status: number
    result: any
    message: string
    timestamp: number
}

export const baseUrl = import.meta.env.VITE_API_URL
console.log(import.meta.env);

// 错误提示
const toastMessage = (msg: string) =>
    ElNotification({
        type: 'error',
        message: msg,
        title: '错误提示',
    })
// 加入节流函数toast
const throttleToast = throttle(toastMessage, 2000, true)
const generateUUIDv4 = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

const fetch = (
    url: NitroFetchRequest,
    options?: UseFetchOptions<any>,
    _showToast = false,
    baseURL = baseUrl
): Promise<any> => {

    const reqUrl = baseURL + url
    const sessionId = useCookie(VISIT_CREDENTIALS)
    const cookieToken = useCookie(TOKEN_CREDENTIALS)
    // 处理sessionId
    if (!sessionId.value) {
        sessionId.value = generateUUIDv4()
    }
    options!.headers = { ...options?.headers, session_id: sessionId.value, sessionId: sessionId.value }
    return new Promise((resolve, reject) => {
        // isLoading.value = true
        const fetchOptions = {
            ...options,
            headers: cookieToken.value
                ? { ...options?.headers, 'X-Access-Token': cookieToken.value }
                : options?.headers,
        }

        useFetch(reqUrl, fetchOptions)
            .then(({ data, error }) => {

               
                // isLoading.value = false
                if (error.value) {
                    const message = error.value?.data.message || error.value?.message

                    _showToast && throttleToast(message)
                    reject(unref(error))
                    return
                }
                // 响应数据
                const response = data.value as ResponseConfig
                // 单独处理检查 code: 1001 1002
                if (response?.code === 1001 || response?.code === 1002) {
                    return reject(unref(response))
                }
                // 200成功
                // 500系统错误
                // 400参数错误
                // 401权限错误
                if (response?.code === 1 || response?.code === 200) {
                    resolve(unref(response.result))
                } else if (response?.code === -1) {
                    _showToast &&
                        ElNotification({
                            title: '提示',
                            message: response.message,
                        })
                    // window.parent.location.replace(window.parent.location.origin + '/')
                    reject(unref(response))

                } else {
                    _showToast &&
                        ElNotification({
                            title: '提示',
                            message: response.message,
                        })
                    reject(unref(response))
                }
            })
            .catch((err: any) => {
                // isLoading.value = false
                reject(err)
            })
    })
}

/**
 * get
 * @param url
 * @param params 链接传参
 * @param _showToast 仅当值为 false时，会隐藏全局的针对错误提示框
 * @returns
 */
export const get = <T>(url: string, params?: any, _showToast = true): Promise<T> =>
    fetch(url, { method: 'get', params }, _showToast)

/**
 * post
 * @param url
 * @param body body传参
 * @param _showToast 仅当值为 false时，会隐藏全局的针对错误提示框
 * @returns
 */
export const post = <T>(url: string, body?: any, _showToast = true): Promise<T> =>
    fetch(url, { method: 'post', body }, _showToast)

/**
 * put
 * @param url
 * @param body body传参
 * @param _showToast 仅当值为 false时，会隐藏全局的针对错误提示框
 * @returns
 */
export const put = <T>(url: string, body?: any, _showToast = true): Promise<T> =>
    fetch(url, { method: 'put', body }, _showToast)

/**
 * Delete
 * @param url
 * @param body body传参
 * @param _showToast 仅当值为 false时，会隐藏全局的针对错误提示框
 * @returns
 */
export const Delete = <T>(url: string, params?: any, _showToast = true): Promise<T> =>
    fetch(url, { method: 'delete', params }, _showToast)

/**
 * get 请求前端的页面
 * @param url
 * @param params 链接传参
 * @param _showToast 仅当值为 false时，会隐藏全局的针对错误提示框
 * @returns
 */
export const getWithHtml = <T>(url: string, params?: any, _showToast = true): Promise<T> =>
    fetch(url, { method: 'get', params }, _showToast, '')
