import { Command } from 'commander';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { DeduplicationTransform } from './deduplicator.js';

const program = new Command();

program
    .name('string-deduplicator')
    .description('CLI tool for removing consecutive duplicate letters from strings')
    .version('1.0.0')
    .requiredOption('-t, --task <task>', 'Task to perform (currently only "deduplicate" is supported)')
    .option('-i, --input <file>', 'Input file (if not specified, reads from stdin)')
    .option('-o, --output <file>', 'Output file (if not specified, writes to stdout)')
    .parse(process.argv);

const options = program.opts();

if (options.task !== 'deduplicate') {
    console.error('Error: Only "deduplicate" task is currently supported');
    process.exit(1);
}

async function processStreams() {
    try {
        const inputStream = options.input
            ? createReadStream(options.input)
            : process.stdin;

        const outputStream = options.output
            ? createWriteStream(options.output)
            : process.stdout;

        const transformStream = new DeduplicationTransform();

        inputStream.on('error', (error) => {
            console.error(`Error reading input: ${error.message}`);
            process.exit(1);
        });

        outputStream.on('error', (error) => {
            console.error(`Error writing output: ${error.message}`);
            process.exit(1);
        });

        await pipeline(
            inputStream,
            transformStream,
            outputStream
        );

        if (!options.input) {
            console.log('\nEnter more strings (Ctrl+C to exit):');
        } else {
            process.exit(0);
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

processStreams(); 