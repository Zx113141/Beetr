import type { Config } from 'tailwindcss';
import sharedConfig from 'tailwind-config';
import colors from 'tailwindcss/colors'
import configs from '@beetr/materials/tailwind.config'
// import * as Materials from '@beetr/materials'
// console.log(Materials);

const appConfig: Config = {
    content: [
        "./src/**/*.{vue,js,ts,jsx,tsx,mdx}",
        // "node_modules/@beetr/**/*.{vue,jsx,tsx}",
        "./pages/**/*.{vue,jsx,tsx}",
        "./components/*.{vue,jsx,tsx}",
        "./components/**/*.{vue,jsx,tsx}",
        './layouts/**/*.vue',
        './plugins/**/*.{js,ts}',
        './nuxt.config.{js,ts}',
    ],
    theme: {
        extend: {
            colors: {
                rose: colors.rose
            },
            backgroundColor: {
                containerBgColor: 'var(--color-container-bgColor)',
            },
            textColor: {
                //like `text-base` and `text-primary`
                base: 'var(--color-text-base)',
                muted: 'var(--color-text-muted)',
                'muted-hover': 'var(--color-text-muted-hover)',
                primary: 'var(--color-primary)',
                secondary: 'var(--color-secondary)',
            },
        }
    }
}

const config: Pick<Config, 'presets'> = {
    presets: [sharedConfig, appConfig, configs],
};

export default config;
