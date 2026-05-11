import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'desktop/index': 'src/desktop.ts',
    'pda/index': 'src/pda.ts',
    'pos/index': 'src/pos.ts',
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
