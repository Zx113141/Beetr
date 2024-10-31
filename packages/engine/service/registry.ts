import { ref, Slots } from "vue"
import { IUserAppItem } from "@beetr/constant"

const items = ref<IUserAppItem[]>([])

interface GridItemProps {
    item: IUserAppItem,
    showHandler: boolean
    handlerEditing: boolean
    activeWidgetId: string
}


interface GridItemContext {
    uid: number
    slots: Slots
    props: GridItemProps
}




const useGridItem = () => {
    const registerGridItem = (item: IUserAppItem) => {
        items.value.push(item)
    }
    return {
        registerGridItem,
        items
    }
}

export {
    useGridItem

}