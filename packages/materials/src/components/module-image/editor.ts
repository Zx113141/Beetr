import { IUserAppItem, WIDGET_TYPE, type Style } from '@beetr/constant'

export const defaultImageConfigs = (props: any): Partial<IUserAppItem> => {
    const INIT_POSITION = {
        mobile: { x: 0, y: 0 },
        desktop: { x: 0, y: 0 },
    }
    const cusStyle: Style = {
        mobile: { w: 1, h: 2 },
        desktop: { w: 1, h: 2 },
    }
    const item: IUserAppItem = {
        variant: 'image',
        type: WIDGET_TYPE.media,
        position: INIT_POSITION,
        cusStyle,
        ...props,
    }
    return {
        ...item
    }
}