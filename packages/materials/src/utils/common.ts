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