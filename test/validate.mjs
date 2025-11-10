#!/usr/bin/env node

// @ts-check

// As a quick sanity check, we validate the example configuration file against our custom schema.
// This test uses a separate JSON schema validator because the monaco-editor package does
// not expose the API for validating JSON schemas.

import { Validator } from '@cfworker/json-schema'
import { readFile } from 'fs/promises'

const schema = JSON.parse(await readFile('src/enshrouded_server.schema.json', 'utf8'))
const example = JSON.parse(await readFile('src/enshrouded_server.json', 'utf8'))

const shortCircuit = false
const draft = '2020-12'
const validator = new Validator(schema, draft, shortCircuit)

const result = validator.validate(example)
if (!result.valid) {
    console.error('Validation failed:', result.errors)
    process.exit(1)
}
