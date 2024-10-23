
import UploadMedia from './module-media-upload/index.vue'

import { IUserAppItem } from '@beetr/constant'
import { ModuleNote, richText, ModuleNoteHandler, defaultEditorConfigs as noteConfigs } from './module-richText'
import { link, defaultEditorConfigs as linkConfigs, ModuleLinkDrawer } from './module-link'
import { ModuleHref, ModuleHrefHandler, } from './module-href'
import { social, defaultEditorConfigs as socialConfigs, ModuleSocialDrawer } from './module-social'

import { ModuleMedia, ModuleMediaHandler } from './module-media'
import { image, defaultImageConfigs } from './module-image'
import { video, defaultVideoConfigs } from './module-video'
// import { ModuleNote, richText, ModuleNoteHandler, defaultEditorConfigs } from './module-richText'

interface IModule {
    name: string
    module: any;
    Handler: any;
    drawer: any;
    icon: any
    title: string
    type: string
    isComponent: boolean
    props: any
    defaultEditorConfigs: (props: any) => Partial<IUserAppItem>
}

const BeetrModules: IModule[] = [
    {
        name: 'rich-text',
        module: ModuleNote,
        Handler: ModuleNoteHandler,
        drawer: null,
        icon: richText,
        title: '笔记',
        type: 'module',
        isComponent: true,
        props: {
        },
        defaultEditorConfigs: noteConfigs,
    },
    {
        name: 'link',
        module: ModuleHref,
        Handler: ModuleHrefHandler,
        drawer: ModuleLinkDrawer,
        icon: link,
        title: '链接',
        type: 'module',
        isComponent: true,
        props: {
        },
        defaultEditorConfigs: linkConfigs,
    },
    {
        name: 'social',
        module: ModuleHref,
        Handler: ModuleHrefHandler,
        drawer: ModuleSocialDrawer,
        icon: social,
        title: '社交',
        type: 'module',
        isComponent: true,
        props: {
        },
        defaultEditorConfigs: socialConfigs,
    },
    {
        name: 'media',
        module: ModuleMedia,
        Handler: ModuleMediaHandler,
        drawer: null,
        icon: image,
        title: '图片',
        type: 'module',
        isComponent: true,
        props: {
        },
        defaultEditorConfigs: defaultImageConfigs,
    },
    {
        name: 'media',
        module: ModuleMedia,
        Handler: ModuleMediaHandler,
        drawer: null,
        icon: video,
        title: '视频',
        type: 'module',
        isComponent: true,
        props: {
        },
        defaultEditorConfigs: defaultVideoConfigs,
    }

]

export {
    BeetrModules,
    type IModule,
    UploadMedia
}