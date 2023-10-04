/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				slate: {
					950: '#070B18'
				}
			},
			screens: {
				'3xl': '1600px'
			}
		}
	},
	plugins: []
};
