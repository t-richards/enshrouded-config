#!/usr/bin/env node

// @ts-check

/**
 * Generates the `allOf` section of the JSON schema to enforce that when any
 * gameSettings property differs from its default value, the gameSettingsPreset
 * must be set to "Custom".
 */

import { readFile, writeFile } from 'fs/promises'

const SCHEMA_PATH = 'src/enshrouded_server.schema.json'
const EXAMPLE_PATH = 'src/enshrouded_server.json'

/**
 * Reads and parses a JSON file.
 * 
 * @param {string} path - The file path to read.
 */
async function readJSON(path) {
    const content = await readFile(path, 'utf-8')
    return JSON.parse(content)
}

/**
 * Generates an if/then rule for a single property.
 * 
 * @param {string} propertyName - The name of the property.
 * @param {*} defaultValue - The default value to compare against.
 */
function generateRule(propertyName, defaultValue) {
    return {
        if: {
            properties: {
                gameSettings: {
                    properties: {
                        [propertyName]: {
                            not: {
                                const: defaultValue
                            }
                        }
                    }
                }
            }
        },
        then: {
            properties: {
                gameSettingsPreset: {
                    const: "Custom"
                }
            }
        }
    }
}

/**
 * Main function
 */
async function main() {
    const schema = await readJSON(SCHEMA_PATH)
    const example = await readJSON(EXAMPLE_PATH)

    const gameSettingsSchema = schema.properties.gameSettings.properties
    const gameSettingsExample = example.gameSettings

    if (!gameSettingsExample) {
        console.error('FATAL: No gameSettings found in example file')
        process.exit(1)
    }

    const rules = []

    // Process each property in gameSettings
    for (const [propName, propSchema] of Object.entries(gameSettingsSchema)) {
        const exampleValue = gameSettingsExample[propName]

        if (exampleValue === undefined) {
            console.error(`FATAL: Property ${propName} missing from example file`)
            process.exit(1)
        }

        // Update schema default to match example if different
        if (propSchema.default !== exampleValue) {
            propSchema.default = exampleValue
        }

        // Generate the rule using example value as default
        rules.push(generateRule(propName, exampleValue))
    }

    // Update the schema
    schema.allOf = rules

    // Write the updated schema
    const schemaJSON = JSON.stringify(schema, null, 4)
    await writeFile(SCHEMA_PATH, schemaJSON + '\n', 'utf-8')

    console.log(`Generated ${rules.length} rules`)
}

main().catch(error => {
    console.error('FATAL:', error.message)
    process.exit(1)
})
