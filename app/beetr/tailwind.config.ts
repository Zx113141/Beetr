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
                container1: 'var(--br-bg-container1)',
                container2: 'var(--br-bg-container2)',
                btnPrimary1: 'var(--br-btn-primary1)',
                btnPrimary2: 'var(--br-btn-primary2)',
                btnPrimary3: 'var(--br-btn-primary3)',
                btnPrimary4: 'var(--br-btn-primary4)',
            },
            backgroundColor: {
                container1: 'var(--br-bg-container1)',
                container2: 'var(--br-bg-container2)',
                container3: 'var(--br-bg-container3)',
                container4: 'var(--br-bg-container4)',
                btnPrimary1: 'var(--br-btn-primary1)',
                btnPrimary2: 'var(--br-btn-primary2)',
                btnPrimary3: 'var(--br-btn-primary3)',
                btnPrimary4: 'var(--br-btn-primary4)',
                inputPrimary1: 'var(--br-input-primary1)',
                inputPrimary2: 'var(--br-input-primary2)',
            },
            textColor: {
                color1: 'var(--br-text-color1)',
                color2: 'var(--br-text-color2)',
                color3: 'var(--br-text-color3)',
                color4: 'var(--br-text-color4)',
            }
        }
    }
}

const config: Pick<Config, 'presets'> = {
    presets: [sharedConfig, configs],
};

export default config;
