import { build } from 'esbuild'

build({
  entryPoints: ['./src/main.ts'],
  outfile: './dist/main.js',
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'esm',
  sourcemap: true
}).catch(process.exit(1))
