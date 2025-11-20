import { buildSchema, mainFiles, monacoFiles, monacoWorkers } from './entrypoints'

console.log('Building files...')
await Promise.all([
    Bun.build({ ...mainFiles, minify: true, throw: true }),
    Bun.build({ ...monacoFiles, minify: true, throw: true }),
    Bun.build({ ...monacoWorkers, minify: true, throw: true }),
    buildSchema()
])
