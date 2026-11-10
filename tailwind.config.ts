import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/blocks/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/(frontend)/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      xs: '360px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
    },
    extend: {
      colors: {
        canvas: {
          DEFAULT: 'rgb(var(--rgb-canvas, 247 243 235) / <alpha-value>)',
          sand: 'rgb(var(--rgb-canvas-sand, 239 233 220) / <alpha-value>)',
        },
        surface: {
          DEFAULT: 'rgb(var(--rgb-surface, 255 255 255) / <alpha-value>)',
        },
        navy: {
          DEFAULT: 'rgb(var(--rgb-navy, 13 34 53) / <alpha-value>)',
          elevated: 'rgb(var(--rgb-navy-elevated, 22 50 75) / <alpha-value>)',
          najd: '#12233F',
        },
        oasis: {
          DEFAULT: 'rgb(var(--rgb-oasis, 19 111 99) / <alpha-value>)',
          classic: '#1F7A5C',
        },
        accent: {
          DEFAULT: 'rgb(var(--rgb-accent, 242 165 65) / <alpha-value>)',
          terracotta: '#C7441F',
        },
        'on-accent': 'rgb(var(--rgb-on-accent, 13 34 53) / <alpha-value>)',
        whatsapp: {
          DEFAULT: 'rgb(var(--rgb-whatsapp, 14 122 109) / <alpha-value>)',
          bright: '#25D366',
        },
        ink: {
          DEFAULT: 'rgb(var(--rgb-ink, 20 26 33) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgb(var(--rgb-muted, 74 85 104) / <alpha-value>)',
        },
        subtle: 'rgb(var(--rgb-border-subtle, 223 214 199) / <alpha-value>)',
        input: 'rgb(var(--rgb-border-input, 122 134 154) / <alpha-value>)',
        success: 'rgb(var(--rgb-success, 21 128 61) / <alpha-value>)',
        warning: 'rgb(var(--rgb-warning, 180 83 9) / <alpha-value>)',
        danger: 'rgb(var(--rgb-danger, 185 28 28) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'var(--font-arabic)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        main: 'var(--container-main, 1240px)',
        narrow: 'var(--container-narrow, 820px)',
      },
      borderRadius: {
        card: 'var(--radius-card, 1rem)',
        button: 'var(--radius-button, 0.75rem)',
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgb(13 34 53 / 0.04)',
        xs: '0 1px 3px 0 rgb(13 34 53 / 0.06), 0 1px 2px -1px rgb(13 34 53 / 0.04)',
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionTimingFunction: {
        'out-cubic': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
        'out-quart': 'cubic-bezier(0.165, 0.84, 0.44, 1)',
        'out-quint': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'out-smooth': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'in-out-cubic': 'cubic-bezier(0.645, 0.045, 0.355, 1)',
      },
      transitionDuration: {
        micro: 'var(--duration-micro, 150ms)',
        standard: 'var(--duration-standard, 220ms)',
        ui: 'var(--duration-standard, 220ms)',
        panel: '240ms',
        section: 'var(--duration-section, 360ms)',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.82', transform: 'scale(1.04)' },
        },
      },
      animation: {
        'float-slow': 'float-slow 4.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite',
        'pulse-soft': 'pulse-soft 2.8s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite',
      },
    },
  },
  plugins: [],
}

export default config
