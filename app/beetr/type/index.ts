/** 当前所有步骤对应的form */
export enum STEP_PROCESS {
    accountLabel = 'accountLabel',
    socialMedia = 'socialMedia',
    linkAnything = 'linkAnything',
    congratulations = 'congratulations',
    userInfo = 'userInfo',
}


/**
 * 消息发出的来源
 * @USER_STORE_TOP 来源顶级窗口中userStore改变
 * @USER_STORE_CHILD 来源iframe窗口中userStore改变
 * @WIDGET_STORE_TOP 来源顶级窗口中widgetStore改变
 * @WIDGET_STORE_CHILD 来源iframe窗口中widgetStore改变
 * @child 从iframe窗口发出的消息
 */
export enum STORAGE_FROM_KEY {
    USER_STORE_TOP = 'USER_STORE_TOP',
    USER_STORE_CHILD = 'USER_STORE_CHILD',
    WIDGET_STORE_TOP = 'WIDGET_STORE_TOP',
    WIDGET_STORE_CHILD = 'WIDGET_STORE_CHILD',
}
