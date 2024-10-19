import type { Config } from "tailwindcss";

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
    // ... 其他配置
};

export default config;
