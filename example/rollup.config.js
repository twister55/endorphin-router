import endorphin from '@endorphinjs/rollup-plugin-endorphin';
import { routify } from '../rollup';
import nodeResolve from 'rollup-plugin-node-resolve';

export default [
	{
		input: './src/index.js',
		plugins: [
			routify(),
			nodeResolve(),
			endorphin({
				css: {
					// Path to store generated CSS
					bundle: './dist/app.css'
				}
			})
		],
		output: {
			file: './dist/app.js',
			format: 'iife',
			sourcemap: true
		}
	},
	// {
	// 	input: './src/app.js',
	// 	plugins: [
	// 		endorphin({
	// 			css: {
	// 				// Path to store generated CSS
	// 				name: 'app.css'
	// 			}
	// 		})
	// 	],
	// 	output: {
	// 		file: './dist/app.es.js',
	// 		format: 'es',
	// 		sourcemap: true
	// 	}
	// }
]
