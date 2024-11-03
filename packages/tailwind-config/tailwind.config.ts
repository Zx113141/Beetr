import type { Config } from "tailwindcss";
import colors from 'tailwindcss/colors'
const config: Config = {
    mode: 'jit',
    purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', "node_modules/@beetr/**/*.{vue,jsx,tsx}", "./pages/**/*.{vue,jsx,tsx}",
        "./components/*.{vue,jsx,tsx}",
        "./components/**/*.{vue,jsx,tsx}",
        './layouts/**/*.vue',
        './plugins/**/*.{js,ts}',
        './nuxt.config.{js,ts}',],
    content: [
        "./src/**/*.{vue,js,ts,jsx,tsx,mdx}",
        "node_modules/@beetr/**/*.{vue,jsx,tsx}",
        "./pages/**/*.{vue,jsx,tsx}",
        "./components/*.{vue,jsx,tsx}",
        "./components/**/*.{vue,jsx,tsx}",
        './layouts/**/*.vue',
        './plugins/**/*.{js,ts}',
        './nuxt.config.{js,ts}',
    ],
    safelist: [
        { pattern: /^(text|bg|rounded)-[\w-]+$/, variants: ['lg', 'hover', 'focus', 'lg:hover'] },
    ],
    theme: {
        extend: {
            colors: {
                douyin: {
                    100: '#FE2C55',
                    200: '#D21B46',
                },
                kuaishou: {
                    100: '#FE3667',
                    200: '#D43159',
                },
                weibo: {
                    100: '#FF8201',
                    200: '#D66D04',
                },
                bilbili: {
                    100: '#FB7299',
                    200: '#D66383',
                },
                xiaohongshu: {
                    100: '#FF0035',
                    200: '#DB022E',
                },
                zhihu: {
                    100: '#056DE8',
                    200: '#045FCF',
                },
                instagram: {
                    100: '#4093EF',
                    200: '#2875CA',
                },
                twitter: {
                    100: '#55ACEE',
                    200: '#4698D7',
                },
                youTube: {
                    100: '#FF0000',
                    200: '#EB0404',
                },
                behance: {
                    100: '#2F65EE',
                    200: '#003ECB',
                },
                dribble: {
                    100: '#D95888',
                    200: '#D45182',
                },
                linkedin: {
                    100: '#006699',
                    200: '#004D73',
                },
                figma: {
                    100: '#4497F7',
                    200: '#007BE5',
                },
                github: {
                    100: '#F6F8FA',
                    200: '#F3F4F6',
                },
                amber: colors.amber,
                lime: colors.lime,
                rose: colors.rose,
                orange: colors.orange,
            },
        },
        backgroundColor:{

        },
        textColor:{

        },
        
    },
    // ... 其他配置
};

export default config;
