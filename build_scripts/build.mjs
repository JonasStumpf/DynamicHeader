import * as esbuild from 'esbuild'
import * as inf from '../package.json' with { type: "json" };
import https from 'node:https'

let httpPlugin = {
	name: 'http',
	setup(build) {
		build.onResolve({ filter: /^https?:\/\// }, args => ({
			path: args.path,
			namespace: 'http-url',
		}));
		build.onResolve({ filter: /.*/, namespace: 'http-url' }, args => ({
			path: new URL(args.path, args.importer).toString(),
			namespace: 'http-url',
		}));
		build.onLoad({ filter: /.*/, namespace: 'http-url' }, async (args) => {
			let contents = await new Promise((resolve, reject) => {
				function fetch(url) {
					console.log(`Downloading: ${url}`)
					let req = https.get(url, res => {
						if ([301, 302, 307].includes(res.statusCode)) {
							fetch(new URL(res.headers.location, url).toString())
							req.abort()
						} else if (res.statusCode === 200) {
							let chunks = []
							res.on('data', chunk => chunks.push(chunk))
							res.on('end', () => resolve(Buffer.concat(chunks)))
						} else {
							reject(new Error(`GET ${url} failed: status ${res.statusCode}`))
						}
					}).on('error', reject)
				}
				fetch(args.path)
			})
			return { contents }
		})
	},
}

const info = inf.default;
const buildOptions = {
	entryPoints: ['src/index.js'],
	bundle: true,
	minify: true,
	keepNames: true,
	plugins: [httpPlugin],
	banner: {
		js: `/*!
* DynamicHeader.js
* Version: ${info.version}
* License: ${info.license}
* Copyright: 2024 ${info.author}
*/`}
}

await esbuild.build({
	...buildOptions,
	outfile: 'dist/DynamicHeader.iife.js',
	format: 'iife',
	globalName: 'DH'
});

await esbuild.build({
	...buildOptions,
	outfile: 'dist/DynamicHeader.esm.js',
	format: 'esm',
});