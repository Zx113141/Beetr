
import { IUserAppItem } from '@beetr/constant'
import { ModuleNote, richText, ModuleNoteHandler, defaultEditorConfigs as noteConfigs } from './module-richText'
import { ModuleLink, link, ModuleLinkHandler, defaultEditorConfigs as linkConfigs } from './module-link'
import { ModuleSocial, social, ModuleSocialHandler, defaultEditorConfigs as socialConfigs } from './module-social'
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
        module: ModuleLink,
        Handler: ModuleLinkHandler,
        drawer: null,
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
        module: ModuleSocial,
        Handler: ModuleSocialHandler,
        drawer: null,
        icon: social,
        title: '社交',
        type: 'module',
        isComponent: true,
        props: {
        },
        defaultEditorConfigs: socialConfigs,
    }

]

export {
    BeetrModules,
    type IModule
}