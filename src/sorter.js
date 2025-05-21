import { Transform } from 'stream';

export function sortOddNumbers(arr) {
    if (!Array.isArray(arr)) return [];

    const result = [...arr];

    const oddNumbers = arr
        .map((num, index) => ({ num, index }))
        .filter(({ num }) => num % 2 !== 0);

    const sortedOdds = oddNumbers.map(({ num }) => num).sort((a, b) => a - b);

    oddNumbers.forEach(({ index }, i) => {
        result[index] = sortedOdds[i];
    });

    return result;
}


export class SortingTransform extends Transform {
    constructor() {
        super({
            objectMode: true,
            encoding: 'utf8'
        });
    }

    _transform(chunk, encoding, callback) {
        try {
            const input = chunk.toString().trim();
            const numbers = input.split(/[\s,]+/).map(num => parseInt(num, 10));

            if (numbers.some(isNaN)) {
                throw new Error('Input must contain only numbers');
            }


            const result = sortOddNumbers(numbers);

            this.push(JSON.stringify(result) + '\n');
            callback();
        } catch (error) {
            callback(error);
        }
    }
} 