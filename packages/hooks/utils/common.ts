import { type IUserAppItem, BROWSER_ENV_GRID_COLUMN, BROWSER_ENV } from "@beetr/constant"
// 节流函数 规定时间内只触发一次
export const throttle = (fn: Function, delay = 5000, immediate = false) => {
    // 利用闭包保存定时器
    let prve = Date.now()
    return (...args: any) => {
        const now = Date.now()
        if (immediate || now - prve >= delay) {
            fn.apply(this, args)
            immediate = false
            prve = Date.now()
        } else {
            // Notification({
            //   type: 'warning',
            //   title: '提示',
            //   message: `${delay / 1000}秒内只能触发一次，请勿连续提交`
            // })
        }
    }
}

// 防抖函数 连续多次触发只保证最后一次生效
export const debounce = (fn: Function, delay = 5000, immediate = false) => {
    // 利用闭包保存定时器
    let timer: number | null = null
    return (...args: any) => {
        timer && clearTimeout(timer)
        if (immediate) {
            timer = window.setTimeout(() => {
                timer = null
            }, delay)
            !timer && fn.apply(this, args)
        } else {
            timer = window.setTimeout(() => {
                fn.apply(this, args)
            }, delay)
        }
    }
}

/**
 * 函数参数位想生成的位数，以及生成的字符串包含那种类型
 * @param {*} len 生成的长度
 * @param {*} include 1(大写) 2(小写) 3(大小写) 4(数字) 5(大写及数字) 6(小写及数字) 7(大小写及数字)
 */

type Include = 1 | 2 | 3 | 4 | 5 | 6 | 7
export const randomString = (len: number, include: Include) => {
    const UPPERCASE = 1 // 包含大写字母
    const LOWERCASE = 2 // 包含小写字母
    const NUMBER = 4 // 包含数字
    len = len || 8 // 默认生成8位长度
    include = include || 7 // 默认生成大小写数字混合

    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercase = uppercase.toLowerCase()
    const number = '0123456789'

    let chars = ''
    if (include & UPPERCASE) {
        chars += uppercase
    }
    if (include & LOWERCASE) {
        chars += lowercase
    }
    if (include & NUMBER) {
        chars += number
    }

    const maxPos = chars.length

    let str = ''
    for (let i = 0; i < len; i++) {
        str += chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return str
}

// 获取获取[m，n]区间内的随机整数
export const getRamdom = (m: number, n: number) => {
    const aNumber = (n + 1 - m) * Math.random() + m
    const result = Math.floor(aNumber)
    return result
}

// 从字符串中查找根据key  查找value  str:  'filename=档案.xlsx;fileType=stream'
export const getValue = (str = '', key: string): string => {
    const list = str.split(';')
    const item = list.find((x) => x.includes(key + '='))
    return item ? item.split('=')[1] : ''
}

interface Reader {
    [propName: string]: any
}
// 二进制流文件转换为json
export const blobToJSON = (data: Blob) => {
    return new Promise((resolve) => {
        const reader: Reader = new FileReader()
        reader.readAsText(data, 'utf-8')
        reader.onload = function () {
            try {
                resolve(JSON.parse(reader.result))
            } catch (error) {
                resolve({
                    code: 200,
                    message: '获取文件信息成功',
                })
            }
        }
    })
}

// 路由中存在 /unit-registration/:id?  等路由结构，需在分割以后取第一个数组值
// 默认所有一级路由 在带一个斜杠
export const getRootUrl = (path: string) => path.split('/:')[0]

/**
 * 千分位分隔符, 并格式化两位小数
 * @param {*} input
 */
export function milliFormat(input = '0', digit = 0) {
    return parseFloat(input)
        .toFixed(digit)
        .replace(/(^|\s)\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/** 异步 延迟器 */
export const SLEEP = (time = 500) =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve(null)
        }, time)
    })

/** 复制文本到剪切板 */
export function copyToClipboard(text: string) {
    // 创建一个临时的textarea元素
    const textarea = document.createElement('textarea')
    // 设置textarea的值为要复制的文本
    textarea.value = text
    // 将textarea元素添加到DOM树中
    document.body.appendChild(textarea)
    // 选中textarea中的文本
    textarea.select()
    // 执行复制命令
    document.execCommand('copy')
    // 移除临时的textarea元素
    document.body.removeChild(textarea)
}

/** 移除html标签 **/
export function removeHtmlTags(input: string): string {
    if (!input) return ''
    return input.replace(/<\/?[^>]+(>|$)/g, '');
}



export const findEmptyPosition = (node: Partial<IUserAppItem>, nodeList: IUserAppItem[], column: number, device: keyof typeof BROWSER_ENV) => {
    const { w, h, } = node.cusStyle![device];
    const { x, y } = node.position![device];
    let found = false;

    // 从左上角开始搜索
    let startX = x,
        startY = y;

    while (!found) {
        // 检查从(startX, startY)开始的区域是否可用
        const available = isAreaAvailable(
            startX,
            startY,
            w,
            h,
            nodeList,
            column,
            device
        );

        if (available) {
            node.position![device] = { x: startX, y: startY };
            found = true;
        } else {
            // 如果当前区域不可用,则向右移动一列,如果到达最右边,则向下移动一行
            startX++;
            if (startX + w > column) {
                startX = 0;
                startY++;
            }
        }
    }

    return found;
};

const isAreaAvailable = (x: number, y: number, w: number, h: number, nodeList: IUserAppItem[], column: number, device: keyof typeof BROWSER_ENV) => {
    // 检查(x, y)开始的区域是否与已有节点重叠
    for (let i = x; i < x + w; i++) {
        for (let j = y; j < y + h; j++) {
            if (i >= column || nodeList.some((n) => overlaps(i, j, n, device))) {
                return false;
            }
        }
    }
    return true;
};

const overlaps = (x: number, y: number, node: IUserAppItem, device: keyof typeof BROWSER_ENV) => {
    const { x: nodeX, y: nodeY } = node.position[device];
    const { w: nodeW, h: nodeH } = node.cusStyle[device];
    return x >= nodeX && x < nodeX + nodeW && y >= nodeY && y < nodeY + nodeH;
};
