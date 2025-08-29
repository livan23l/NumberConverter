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
    { input: '0.1', expected: '0.5' },
    { input: '0.101', expected: '0.625' },
    { input: '0.001', expected: '0.125' },
    { input: '10.011', expected: '2.375' },
    { input: '110.1101', expected: '6.8125' },

    // Negative decimals
    { input: '-0.01', expected: '-0.25' },
    { input: '-10.011', expected: '-2.375' },
    { input: '-1100.011', expected: '-12.375' },

    // Rare cases
    { input: '.1', expected: '0.5' },
    { input: '1.', expected: '1.0' },
    { input: '-.1', expected: '-0.5' },
    { input: '-', expected: '0' },
    { input: '.', expected: '0.0' },
    { input: '-.', expected: '0.0' },
    { input: '-0', expected: '0' },
    { input: '0001.011', expected: '1.375' },
    { input: '*', expected: null },
    { input: '1001101*', expected: null },
    { input: '+10001', expected: null },
    { input: '--1001', expected: null },
    { input: '10.100.1', expected: null },

    // Big integers
    { input: '11110001001000000', expected: '123456' },
    { input: '11110001001000000110', expected: '987654' },
    { input: '11111111111111111111', expected: '1048575' },
    { input: '100000000000000000000', expected: '1048576' },

    // Big decimals
    { input: '11000000111001.1010110111001100011000111', expected: '12345.6788999736309051513671875' },
    { input: '11000000111001101.0110111010011110000110110', expected: '98765.432099997997283935546875' },
    { input: '-.0000001100101001000101100', expected: '-0.01234567165374755859375' },

    // Big negatives
    { input: '-1111001010001010000001100', expected: '-31790092' },
    { input: '-11100000000001001010100001010101010', expected: '-30067212970' },
    { input: '-1111101010101010110101', expected: '-4106933' },
    { input: '-1010101010101010101010101', expected: '-22369621' },

    // Big decimals positives and negatives
    { input: '10000011000100100110111.0100101110000101000111101', expected: '4294967.2949999868869781494140625' },
    { input: '-11101010110101001001100.1001011110001101010011111', expected: '-7694924.5919999778270721435546875' },
    {
        input: '-11101010110101001001101101010101010111111111000000011011011010111101011.1100000001111010101010111010011001010101010010110011010010110101010110010101011101010010101101010101101010101010000001110',
        expected: '-2165929022838002267627.751871803387342672991756718610547919571722653796761298050828758283199181031478640357956777506842627190053462982177734375'
    },
];