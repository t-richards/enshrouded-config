import { readFile, writeFile } from 'fs/promises'
import { mainFiles, monacoFiles, monacoWorkers } from './entrypoints'

console.log('Building main files...')
await Bun.build({ ...mainFiles, minify: true })

console.log('Building monaco files...')
await Bun.build({ ...monacoFiles, minify: true })

console.log('Building monaco workers...')
await Bun.build({ ...monacoWorkers, minify: true })

console.log('Building schema file...')
const rawFile = await readFile('src/enshrouded_server.schema.json')
const schema = JSON.parse(rawFile.toString())
const minifiedSchema = JSON.stringify(schema)
await writeFile('dist/enshrouded_server.schema.json', minifiedSchema)
