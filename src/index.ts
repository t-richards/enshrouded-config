import * as monaco from 'monaco-editor'

import schema from './enshrouded_server.schema.json'
import sampleConfig from './enshrouded_server.json'

self.MonacoEnvironment = {
    getWorkerUrl: function (_moduleId, label) {
        if (label === 'json') {
            return './vs/language/json/json.worker.js'
        }
        return './vs/editor/editor.worker.js'
    }
}

monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    enableSchemaRequest: false,
    schemaValidation: 'error',
    schemas: [
        {
            uri: 'https://enshrouded-config.tomrichards.dev/enshrouded_server.schema.json',
            fileMatch: ['*'],
            schema,
        },
    ],
})

class ContainerNotFoundError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'ContainerNotFoundError'
    }
}

const startMonaco = () => {
    const container = document.getElementById('editor')
    if (!container) {
        throw new ContainerNotFoundError('Cannot start editor.')
    }

    monaco.editor.create(container, {
        value: JSON.stringify(sampleConfig, null, 4),
        language: 'json',
        automaticLayout: true,
        theme: 'vs-dark',
        fontSize: 18
    })
}

startMonaco()
