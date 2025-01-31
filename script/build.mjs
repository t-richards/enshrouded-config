// @ts-check

import { build } from 'esbuild'
import { readFile, writeFile } from 'fs/promises'

const workerEntryPoints = [
    'vs/language/json/json.worker.js',
    'vs/editor/editor.worker.js'
]

console.log('Building main files...')
await build({
    entryPoints: [
        'src/index.ts',
        'src/index.css',
    ],
    bundle: true,
    minify: true,
    external: [
        'monaco-editor',
    ],
    legalComments: 'none',
    format: 'esm',
    outdir: 'dist'
})

console.log('Building monaco files...')
await build({
    entryPoints: ['node_modules/monaco-editor/esm/vs/editor/editor.main.js'],
    bundle: true,
    minify: true,
    legalComments: 'none',
    format: 'esm',
    outfile: 'dist/monaco-editor.js',
    loader: {
        '.ttf': 'file'
    },
})

console.log('Building monaco workers...')
await build({
    entryPoints: workerEntryPoints.map((entry) => `node_modules/monaco-editor/esm/${entry}`),
    bundle: true,
    minify: true,
    legalComments: 'none',
    format: 'iife',
    outdir: 'dist/vs'
})

console.log('Building schema file...')
const rawFile = await readFile('src/enshrouded_server.schema.json')
const schema = JSON.parse(rawFile.toString())
const minifiedSchema = JSON.stringify(schema)
await writeFile('dist/enshrouded_server.schema.json', minifiedSchema)
