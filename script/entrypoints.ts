const workerEntryPoints = [
    'vs/language/json/json.worker.js',
    'vs/editor/editor.worker.js'
]

const mainFiles: Bun.BuildConfig = {
    entrypoints: [
        'src/index.ts',
        'src/index.css',
    ],
    external: [
        'monaco-editor',
    ],
    format: 'esm',
    outdir: 'dist'
}

const monacoFiles: Bun.BuildConfig = {
    entrypoints: ['node_modules/monaco-editor/esm/vs/editor/editor.main.js'],
    format: 'esm',
    loader: {
        '.ttf': 'file'
    },
    naming: '[dir]/monaco-editor.[ext]',
    outdir: 'dist'
}

const monacoWorkers: Bun.BuildConfig = {
    entrypoints: workerEntryPoints.map((entry) => `node_modules/monaco-editor/esm/${entry}`),
    format: 'iife',
    outdir: 'dist/vs'
}

export {
    mainFiles,
    monacoFiles,
    monacoWorkers
}
