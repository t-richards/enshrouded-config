import { join } from 'path'
import { mainFiles, monacoFiles, monacoWorkers } from './entrypoints'

const build = async () => {
    await Bun.build({ ...mainFiles, sourcemap: 'linked' })
    await Bun.build({ ...monacoFiles, sourcemap: 'linked' })
    await Bun.build({ ...monacoWorkers, sourcemap: 'linked' })
}

await build()

console.log('Starting dev server on http://localhost:4000/')
Bun.serve({
    port: 4000,
    routes: {
        "/": async () => {
            await build()
            return new Response(Bun.file('dist/index.html'))
        },
        "/*": async (req) => {
            const reqPath = new URL(req.url).pathname
            const filePath = join('dist', reqPath)
            return new Response(Bun.file(filePath))
        }
    }
})
