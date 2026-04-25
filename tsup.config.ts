import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['components/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  external: ['react', 'react-dom'],
  tsconfig: 'tsconfig.build.json',
});
