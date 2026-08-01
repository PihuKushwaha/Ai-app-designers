/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        blueprint: {
          950: '#0B1E33',
          900: '#0F2A47',
          800: '#153A5E',
          700: '#1D4E7A',
          600: '#2D6494',
          500: '#4C86B5',
          line: '#BFD9EC',
          paper: '#F4F8FB'
        },
        redline: {
          DEFAULT: '#E85D3D',
          dark: '#C8492C',
          light: '#F0876E'
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      backgroundImage: {
        'grid-lines':
          'linear-gradient(rgba(191,217,236,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(191,217,236,0.08) 1px, transparent 1px)',
        'grid-lines-major':
          'linear-gradient(rgba(191,217,236,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(191,217,236,0.14) 1px, transparent 1px)'
      },
      backgroundSize: {
        grid: '24px 24px',
        'grid-major': '120px 120px'
      }
    }
  },
  plugins: []
}
