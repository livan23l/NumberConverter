// Connection test
export const tests = [
    // Positive integers
    { input: '0', expected: '0' },
    { input: '1', expected: '1' },
    { input: '2', expected: '10' },
    { input: '5', expected: '101' },
    { input: '10', expected: '1010' },

    // Negative integers
    { input: '-1', expected: '-1' },
    { input: '-2', expected: '-10' },
    { input: '-5', expected: '-101' },

    // Positive decimals
    { input: '0.5', expected: '0.1' },
    { input: '0.25', expected: '0.01' },
    { input: '0.75', expected: '0.11' },
    { input: '2.5', expected: '10.1' },
    { input: '3.25', expected: '11.01' },

    // Negative decimals
    { input: '-0.5', expected: '-0.1' },
    { input: '-2.5', expected: '-10.1' },
    { input: '-3.25', expected: '-11.01' },

    // Rare cases
    { input: '.5', expected: '0.1' },
    { input: '1.', expected: '1.0' },
    { input: '-.5', expected: '-0.1' },
    { input: '-', expected: '0' },
    { input: '.', expected: '0.0' },
    { input: '-.', expected: '0.0' },
    { input: '-0', expected: '0' },
    { input: '0005.375', expected: '101.011' },
    { input: 'a', expected: null },
    { input: '12345678A', expected: null },
    { input: '+14242141', expected: null },
    { input: '--1321312312', expected: null },
    { input: '0.5.1', expected: null },

    // Big integers
    { input: '123456', expected: '11110001001000000' },
    { input: '987654', expected: '11110001001000000110' },
    { input: '1048575', expected: '11111111111111111111' },
    { input: '1048576', expected: '100000000000000000000' },

    // Big decimals
    { input: '12345.6789', expected: '11000000111001.1010110111001100011000111' },
    { input: '98765.4321', expected: '11000000111001101.0110111010011110000110110' },
    { input: '-.0123456789876543210', expected: '-0.0000001100101001000101100' },

    // Big negatives
    { input: '-123456', expected: '-11110001001000000' },
    { input: '-987654', expected: '-11110001001000000110' },
    { input: '-1048575', expected: '-11111111111111111111' },
    { input: '-1048576', expected: '-100000000000000000000' },

    // Big decimals positives and negatives
    { input: '4294967.295', expected: '10000011000100100110111.0100101110000101000111101' },
    { input: '-7694924.592', expected: '-11101010110101001001100.1001011110001101010011111' },
];