/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		container: {
			center: true,
			padding: '1rem',
			screens: {
				'2xl': '1440px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
			},
			colors: {
				brand: {
					DEFAULT: '#FFFF00',
					dark: '#ffbf00'
				},
				bg: '#121018',
				card: '#1a1722'
			},
			boxShadow: {
				soft: '0 8px 24px rgba(0,0,0,0.35)'
			}
		}
	},
	plugins: []
};
