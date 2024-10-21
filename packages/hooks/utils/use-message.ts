
import { MESSAGE_EVENT_TYPE } from '@beetr/constant'

export const useMessage = () => {

    function postMessage<E extends Window, T extends keyof typeof MESSAGE_EVENT_TYPE, K,>(target: E, e: T, params?: K) {
        target.postMessage({
            eventType: e,
            query: params
        }, '*')
    }

    return {
        postMessage
    }
}