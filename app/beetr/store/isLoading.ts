
export const isLoading = ref(false)
export const drawData = reactive({
  show: false,
  list: [
    // {
    //     name: "默认",
    //     color: "#666"
    // },
    {
      name: '亮丽',
      color: 'light',
    },
    {
      name: '暗黑',
      color: 'dark',
    },
  ],
  nowColor: 'light',
})
export const addDrawData = reactive({
  show: false,
})
export const addSocialData = reactive({
  show: false,
})
export const addLinkData = reactive({
  show: false,
})

export const editDrawData = reactive<{ show: boolean; data: any; }>({
  show: false,
  data: {
    id: '',
    title: '',
    nickName: '',
    url: '',
    type: '',
    _percent: '',
    variant: 'image',
    h: 0,
    w: 0,
    position: {
      mobile: {
        x: 0,
        y: 0,
      },
      desktop: {
        x: 0,
        y: 0,
      },
    },
    cusStyle: {
      mobile: {
        w: 0,
        h: 0,
      },
      desktop: {
        w: 0,
        h: 0,
      },
    },
    content: '',
    faviconUrl: ''
  },
})

export const setDrawData = reactive({
  show: false,
})
