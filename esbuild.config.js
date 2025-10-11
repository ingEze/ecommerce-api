import { build } from 'esbuild'
import glob from 'glob'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function runBuild() {
  try {
    // Buscar todos los archivos .ts en src/
    const files = glob.sync('./src/**/*.ts')

    await build({
      entryPoints: files,
      outdir: './dist',
      bundle: false, // true in prod
      platform: 'node',
      target: 'node18',
      format: 'esm',
      sourcemap: true,
      outbase: './src'
    })

    console.log('Build completed')
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

runBuild()
