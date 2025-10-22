import { build } from 'esbuild'
import glob from 'glob'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function runBuild() {
  try {
    const files = glob.sync('./src/**/*.ts')

    await build({
      entryPoints: files,
      outdir: './dist',
      bundle: false,
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
