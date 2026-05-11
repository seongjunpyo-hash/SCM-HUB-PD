import path from 'path';
import { fileURLToPath } from 'url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import pkg from './package.json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      copyDtsFiles: false,
      include: ['src/output/icon/moms/**/*', 'src/moms.ts', 'src/types/**/*'],
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/moms.ts'),
      name: 'PboAssetsMoms',
      formats: ['es', 'cjs'],
      fileName: (format) => `moms.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    outDir: path.resolve(__dirname, 'dist/moms'),
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
      ],
      output: {
        exports: 'named',
      },
      treeshake: true,
    },
    minify: 'terser',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
