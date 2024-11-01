
import UploadMedia from './module-media-upload/index.vue'

import { IUserAppItem, WIDGET_TYPE } from '@beetr/constant'
import { ModuleNote, richText, ModuleNoteHandler, defaultEditorConfigs as noteConfigs } from './module-richText'
import { link, defaultEditorConfigs as linkConfigs, } from './module-link'
import { ModuleHref, ModuleHrefHandler, ModuleHrefDrawer } from './module-href'
import { social, defaultEditorConfigs as socialConfigs, } from './module-social'

import { ModuleMedia, ModuleMediaHandler } from './module-media'
import { image, defaultImageConfigs } from './module-image'
import { video, defaultVideoConfigs } from './module-video'

import { defaultTitleConfigs, sectionTitle, ModuleSectionTitle, ModuleSectionTitleHandler } from './module-title'

interface IModule {
    name: WIDGET_TYPE
    module: any;
    Handler: any;
    Drawer: {
        desktop?: any;
        mobile: any
    };
    icon: any
    title: string
    type: string
    isComponent: boolean
    props: IModulePropsPath | null
    defaultEditorConfigs: (props?: Partial<IUserAppItem>) => Partial<IUserAppItem>
}
type ModulePathRules = string | boolean | string[]

interface IModulePropsPath {
    drawer?: {
        [key: string]: ModulePathRules
    },
    props?: {

    }
}

const BeetrModules: IModule[] = [
    {
        name: WIDGET_TYPE.richText,
        module: ModuleNote,
        Handler: ModuleNoteHandler,
        Drawer: {
            desktop: null,
            mobile: null,
        },
        icon: richText,
        title: '笔记',
        type: 'module',
        isComponent: true,
        props: null,
        defaultEditorConfigs: noteConfigs,
    },
    {
        name: WIDGET_TYPE.link,
        module: ModuleHref,
        Handler: ModuleHrefHandler,
        Drawer: {
            desktop: ModuleHrefDrawer,
            mobile: ModuleHrefDrawer,
        },
        icon: link,
        title: '链接',
        type: 'module',
        isComponent: true,
        props: {
            drawer: {
                deviceEnv: 'envStore.deviceEnv',
                browserEnv: 'envStore.browserEnv',
                data: true,
            }
        },
        defaultEditorConfigs: linkConfigs,
    },
    {
        name: WIDGET_TYPE.social,
        module: ModuleHref,
        Handler: ModuleHrefHandler,
        Drawer: {
            desktop: ModuleHrefDrawer,
            mobile: ModuleHrefDrawer,
        },
        icon: social,
        title: '社交',
        type: 'module',
        isComponent: true,
        props: {
            drawer: {
                deviceEnv: '$pinia.state.value',
                browserEnv: 'envStore.browserEnv',
                data: true,
            }
        },
        defaultEditorConfigs: socialConfigs,
    },
    {
        name: WIDGET_TYPE.media,
        module: ModuleMedia,
        Handler: ModuleMediaHandler,
        Drawer: {
            desktop: null,
            mobile: null,
        },
        icon: image,
        title: '图片',
        type: 'module',
        isComponent: true,
        props: null,
        defaultEditorConfigs: defaultImageConfigs,
    },
    {
        name: WIDGET_TYPE.media,
        module: ModuleMedia,
        Handler: ModuleMediaHandler,
        Drawer: {
            desktop: null,
            mobile: null,
        },
        icon: video,
        title: '视频',
        type: 'module',
        isComponent: true,
        props: null,
        defaultEditorConfigs: defaultVideoConfigs,
    },
    {
        name: WIDGET_TYPE.sectionHeader,
        module: ModuleSectionTitle,
        Handler: ModuleSectionTitleHandler,
        Drawer: {
            desktop: null, mobile: null,
        },
        icon: sectionTitle,
        title: '标题',
        type: 'module',
        isComponent: true,
        props: null,
        defaultEditorConfigs: defaultTitleConfigs,
    }

]

export {
    BeetrModules,
    type IModule,
    UploadMedia
}