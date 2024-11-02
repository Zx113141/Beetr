
import { IUserAppItem, WIDGET_TYPE, type Style, BROWSER_ENV, } from '@beetr/constant'

interface IController {
    browserEnv: BROWSER_ENV,
    deviceEnv: BROWSER_ENV,
    userInfo: any,
    urlInfo: any
}

export const defaultTitleConfigs = (props: any): Partial<IUserAppItem> => {
    const INIT_POSITION = {
        mobile: { x: 0, y: 0 },
        desktop: { x: 0, y: 0 },
    }
    const cusStyle: Style = {
        mobile: { w: 2, h: 1 },
        desktop: { w: 4, h: 1 },
    }

    const item: Partial<IUserAppItem> = {
        cusStyle,
        type: WIDGET_TYPE.sectionHeader,
        position: INIT_POSITION,
        ...props
    }
    return {
        ...item
    }
}

export const controlEditor = (controller: any) => {

    const editor = controller()

    return
}