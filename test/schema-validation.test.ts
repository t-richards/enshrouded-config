// As a quick sanity check, we validate the example configuration file against our custom schema.
// This test uses a separate JSON schema validator because the monaco-editor package does
// not expose the API for validating JSON schemas.

import { Validator } from '@cfworker/json-schema'
import { readFile } from 'node:fs/promises'

import { describe, it, expect } from 'bun:test'

const schema = JSON.parse(await readFile('src/enshrouded_server.schema.json', 'utf8'))
const example = JSON.parse(await readFile('src/enshrouded_server.json', 'utf8'))

const shortCircuit = false
const draft = '2020-12'

describe('json schema', () => {
    it('validates the example configuration', () => {
        const validator = new Validator(schema, draft, shortCircuit)

        const result = validator.validate(example)
        expect(result.errors).toEqual([])
        expect(result.valid).toBe(true)
    })
})
