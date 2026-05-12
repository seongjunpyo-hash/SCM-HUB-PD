import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'desktop/index': 'src/desktop.ts',
    'mobile/index': 'src/mobile.ts',
  },
  format: ['cjs', 'esm'],
  clean: true,
  sourcemap: true,
  dts: true,
  minify: true,
  minifyWhitespace: true,
  treeshake: true,
  outDir: 'dist',
});
