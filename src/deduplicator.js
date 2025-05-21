import { Transform } from 'stream';

export function deduplicateString(str) {
    if (!str) return '';
    return str.toLowerCase()
        .replace(/\s+/g, '')
        .replace(/(.)\1+/g, '$1');
}

export class DeduplicationTransform extends Transform {
    constructor() {
        super({
            objectMode: true,
            encoding: 'utf8'
        });
    }

    _transform(chunk, encoding, callback) {
        try {
            const lines = chunk.toString().split('\n').filter(line => line.trim());
            const processedLines = lines.map(deduplicateString);

            this.push(processedLines.join('\n') + '\n');
            callback();
        } catch (error) {
            callback(error);
        }
    }
} 