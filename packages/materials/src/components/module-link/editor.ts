import { IUserAppItem, WIDGET_TYPE, type Style, LINK_TYPE } from '@beetr/constant'

export const defaultEditorConfigs = (props: any): Partial<IUserAppItem> => {
    const INIT_POSITION = {
        mobile: { x: 0, y: 0 },
        desktop: { x: 0, y: 0 },
    }
    const cusStyle: Style = {
        mobile: { w: 1, h: 2 },
        desktop: { w: 1, h: 2 },
    }
    const item = {
        type: WIDGET_TYPE.link,
        variant: LINK_TYPE.normal,
        position: INIT_POSITION,
        cusStyle,
        ...props,
    }
    console.log(props, 'props', item);
    return {
        ...item
    }
}