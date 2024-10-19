// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  typescript: {
    typeCheck: false,
  },
  runtimeConfig: {
    public: {
      gtagId: 'G-0QFWYFPTMT',
    }
  },
  elementPlus: {
    icon: 'ElIcon', // icon前缀
  },
  sourcemap: {
    server: true,
    client: true,
  },
  modules: [(_inlineOptions, nuxt) => {
    const { gtagId = "" } = nuxt.options.runtimeConfig.public;
    nuxt.options.app.head.script = nuxt.options.app.head.script || [];
    nuxt.options.app.head.script.unshift({
      src: `https://www.googletagmanager.com/gtag/js?id=${gtagId}`,
      async: true,
    });
  }, '@nuxtjs/device', '@pinia/nuxt', '@nuxtjs/tailwindcss', '@element-plus/nuxt'],
  alias: {
    yup: 'yup/lib/index.js'
  },

  css: ['@/assets/style/main.scss', '@/assets/style/tailwind.css', '@/assets/animate/index.scss',],

  build: {
    transpile: [/^element-plus/]
  },

  vite: {
    server: {
      hmr: {
        overlay: false
      }
    }
  },

  devServer: {
    port: 4000,
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
      meta: [
        {
          name: 'mobile-web-app-capable',
          content: 'yes',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
        },
      ],
    },

  },

  compatibilityDate: '2024-09-19',
})