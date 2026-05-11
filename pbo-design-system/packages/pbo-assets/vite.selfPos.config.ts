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
      include: ['src/output/icon/selfPos/**/*', 'src/selfPos.ts', 'src/types/**/*'],
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/selfPos.ts'),
      name: 'PboAssetSselfPos',
      formats: ['es', 'cjs'],
      fileName: (format) => `selfPos.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    outDir: path.resolve(__dirname, 'dist/selfPos'),
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
