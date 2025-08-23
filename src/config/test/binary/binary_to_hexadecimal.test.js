export const tests = [
    // Positive integers
    { input: '0', expected: '0' },
    { input: '1', expected: '1' },
    { input: '10', expected: '2' },
    { input: '111', expected: '7' },
    { input: '1000', expected: '8' },

    // Negative integers
    { input: '-1', expected: '-1' },
    { input: '-10', expected: '-2' },
    { input: '-1001', expected: '-9' },

    // Positive decimals
    { input: '0.1', expected: '0.8' },
    { input: '0.101', expected: '0.A' },
    { input: '0.001', expected: '0.2' },
    { input: '10.011', expected: '2.6' },
    { input: '110.1101', expected: '6.D' },

    // Negative decimals
    { input: '-0.01', expected: '-0.4' },
    { input: '-10.011', expected: '-2.6' },
    { input: '-1100.011', expected: '-C.6' },

    // Rare cases
    { input: '.1', expected: '0.8' },
    { input: '1.', expected: '1.0' },
    { input: '-.1', expected: '-0.8' },
    { input: '-', expected: '0' },
    { input: '.', expected: '0.0' },
    { input: '-.', expected: '0.0' },
    { input: '-0', expected: '0' },
    { input: '0001.011', expected: '1.6' },
    { input: '*', expected: null },
    { input: '1001101*', expected: null },
    { input: '+10001', expected: null },
    { input: '--1001', expected: null },
    { input: '10.100.1', expected: null },

    // Big integers
    { input: '11110001001000000', expected: '1E240' },
    { input: '11110001001000000110', expected: 'F1206' },
    { input: '11111111111111111111', expected: 'FFFFF' },
    { input: '100000000000000000000', expected: '100000' },

    // Big decimals
    { input: '11000000111001.1010110111001100011000111', expected: '3039.ADCC638' },
    { input: '11000000111001101.0110111010011110000110110', expected: '181CD.6E9E1B' },
    { input: '-.0000001100101001000101100', expected: '-0.032916' },

    // Big negatives
    { input: '-1111001010001010000001100', expected: '-1E5140C' },
    { input: '-11100000000001001010100001010101010', expected: '-7002542AA' },
    { input: '-1111101010101010110101', expected: '-3EAAB5' },
    { input: '-1010101010101010101010101', expected: '-1555555' },

    // Big decimals positives and negatives
    { input: '10000011000100100110111.0100101110000101000111101', expected: '418937.4B851E8' },
    { input: '-11101010110101001001100.1001011110001101010011111', expected: '-756A4C.978D4F8' },
];