/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#6366f1',
                    dark: '#4f46e5',
                    light: '#818cf8',
                },
                secondary: {
                    DEFAULT: '#10B981',
                    dark: '#059669',
                },
                danger: '#ef4444',
                warning: '#f59e0b',
                success: '#10b981',
                accent: '#f97316',
            },
        },
    },
    plugins: [],
}