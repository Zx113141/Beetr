import type { Config } from 'tailwindcss';
import sharedConfig from 'tailwind-config';
import colors from 'tailwindcss/colors'
const moduleConifg: Config = {
    content: [
        './src/**/*.{vue,js,ts,jsx,tsx,mdx}',
        'node_modules/@beetr/**/*.{vue,jsx,tsx}',
        './pages/**/*.{vue,jsx,tsx}',
        './components/*.{vue,jsx,tsx}',
        './components/**/*.{vue,jsx,tsx}',],
    theme: {
        extend: {
            colors: {
                douyin: {
                    100: '#FE2C55',
                    200: '#D21B46',
                },
            },
            textColor: {
                module: 'var(--color-module-base)',
            }

        }
    }
}

const configs: Pick<Config, 'presets'> = {
    presets: [sharedConfig,],
};

export default moduleConifg;
