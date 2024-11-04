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
                rose: colors.rose,
                neutral: colors.neutral
            },
            borderColor: {
                primary1: 'var(--br-color-primary1)',
                primary2: 'var(--br-color-primary2)',
                primary3: 'var(--br-color-primary3)',
                primary4: 'var(--br-color-primary4)',
                primary5: 'var(--br-color-primary5)',
            },
            textColor: {
                primary1: 'var(--br-color-primary1)',
                primary2: 'var(--br-color-primary2)',
                primary3: 'var(--br-color-primary3)',
                primary4: 'var(--br-color-primary4)',
                primary5: 'var(--br-color-primary5)',
            },
            backgroundColor: {
                container1: 'var(--br-color-container1)',
                container2: 'var(--br-color-container2)',
                primary1: 'var(--br-color-primary1)',
                primary2: 'var(--br-color-primary2)',
                primary3: 'var(--br-color-primary3)',
                primary4: 'var(--br-color-primary4)',
                primary5: 'var(--br-color-primary5)',
            },
            // textColor: {
            //     //like `text-base` and `text-primary`
            //     base: 'var(--br-color-text-base)',
            //     muted: 'var(--br-color-text-muted)',
            //     'muted-hover': 'var(--br-color-text-muted-hover)',
            //     primary: 'var(--br-color-primary)',
            //     secondary: 'var(--br-color-secondary)',
            // },
        }
    }
}

const config: Pick<Config, 'presets'> = {
    presets: [sharedConfig, appConfig, configs],
};

export default config;
