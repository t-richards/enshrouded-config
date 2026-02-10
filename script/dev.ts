import { join } from 'node:path'
import { buildSchema, mainFiles, monacoFiles, monacoWorkers } from './entrypoints'

const build = Promise.all([
    Bun.build({ ...mainFiles, sourcemap: 'linked' }),
    Bun.build({ ...monacoFiles, sourcemap: 'linked' }),
    Bun.build({ ...monacoWorkers, sourcemap: 'linked' }),
    buildSchema()
])

await build

console.log('Starting dev server on http://localhost:4000/')
Bun.serve({
    port: 4000,
    routes: {
        '/': async () => {
            await build
            return new Response(Bun.file('dist/index.html'))
        },
        '/*': async (req) => {
            const reqPath = new URL(req.url).pathname
            const filePath = join('dist', reqPath)
            return new Response(Bun.file(filePath))
        }
    }
})
