import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [tailwindcss()],
	base: "./",
	build: {
		target: "esnext", //browsers can handle the latest ES features,
		rolldownOptions: {
			output: {
				entryFileNames: "assets/[name].js",
				assetFileNames: "assets/[name].[ext]",
				chunkFileNames: "assets/[name].js",
				codeSplitting: {
					groups: [
						{
							name: "deps/vendor",
							test: /node_modules/,
							priority: 20,
						},
						{
							name: (moduleId) => {
								const module = path
									.relative(process.cwd(), moduleId)
									.replace(".ts", "");

								return module;
							},
							test: /src\/*/,
						},
						{
							name: "deps/polyfill",
							test: /vite(\/*)?/,
						},
					],
				},
				minifyInternalExports: false,
			},
		},
		cssCodeSplit: true,
		minify: false,
	},
});
