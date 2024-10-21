import ModuleNote from './module-richText/index.vue'
import ModuleNoteHandler from './module-richText/handler.vue'


const BeetrModules = [
    {
        name: 'rich-text',
        module: ModuleNote,
        Handler: ModuleNoteHandler,
        drawer: null
    }

]

export {
    BeetrModules
}