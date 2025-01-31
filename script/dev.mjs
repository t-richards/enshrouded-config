// @ts-check

import { context } from 'esbuild'

const workerEntryPoints = [
    'vs/language/json/json.worker.js',
    'vs/editor/editor.worker.js'
]

async function buildMain() {
    let ctx = await context({
        entryPoints: [
            'src/index.ts',
            'src/index.css',
        ],
        bundle: true,
        minify: true,
        external: [
            'monaco-editor',
        ],
        sourcemap: 'linked',
        legalComments: 'none',
        format: 'esm',
        outdir: 'dist'
    })
    const opts = {
        port: 4000,
        servedir: 'dist'
    } 
    await ctx.serve(opts)
    console.log('Running server on http://localhost:4000/')
}

async function buildMonaco() {
    let ctx = await context({
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

    await ctx.watch()
    console.log('Building monaco editor...')
}

async function buildWorkers() {
    let ctx = await context({
        entryPoints: workerEntryPoints.map((entry) => `node_modules/monaco-editor/esm/${entry}`),
        bundle: true,
        minify: true,
        legalComments: 'none',
        format: 'iife',
        outdir: 'dist/vs',
    })

    await ctx.watch()
    console.log('Building monaco workers...')
}

// Run builds in the background.
buildMain()
buildMonaco()
buildWorkers()
