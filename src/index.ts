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

// Saves the current editor value as a file when the user presses Ctrl+S.
const handleSave = (event: KeyboardEvent) => {
    if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 's') {
        return
    }

    event.preventDefault()

    // Warn the user when their current file contains errors.
    const markers = monaco.editor.getModelMarkers({})
    if (markers.length > 0) {
        const message = 'Your current file contains errors. Are you sure you want to save?'
        if (!window.confirm(message)) {
            return
        }
    }

    // Export the current editor value as a file.
    const editor = monaco.editor.getModels()[0]
    const value = editor.getValue()
    const blob = new Blob([value], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'enshrouded_server.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}


startMonaco()
document.addEventListener('keydown', handleSave)