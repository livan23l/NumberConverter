export const tests = [
    // Positive integers
    { input: '0', expected: '0' },
    { input: '1', expected: '1' },
    { input: '10', expected: '2' },
    { input: '111', expected: '7' },
    { input: '1000', expected: '10' },

    // Negative integers
    { input: '-1', expected: '-1' },
    { input: '-10', expected: '-2' },
    { input: '-1001', expected: '-11' },

    // Positive decimals
    { input: '0.1', expected: '0.4' },
    { input: '0.101', expected: '0.5' },
    { input: '0.001', expected: '0.1' },
    { input: '10.011', expected: '2.3' },
    { input: '110.1101', expected: '6.64' },

    // Negative decimals
    { input: '-0.01', expected: '-0.2' },
    { input: '-10.011', expected: '-2.3' },
    { input: '-1100.011', expected: '-14.3' },

    // Rare cases
    { input: '.1', expected: '0.4' },
    { input: '1.', expected: '1.0' },
    { input: '-.1', expected: '-0.4' },
    { input: '-', expected: '0' },
    { input: '.', expected: '0.0' },
    { input: '-.', expected: '0.0' },
    { input: '-0', expected: '0' },
    { input: '0001.011', expected: '1.3' },
    { input: '*', expected: null },
    { input: '1001101*', expected: null },
    { input: '+10001', expected: null },
    { input: '--1001', expected: null },
    { input: '10.100.1', expected: null },

    // Big integers
    { input: '11110001001000000', expected: '361100' },
    { input: '11110001001000000110', expected: '3611006' },
    { input: '11111111111111111111', expected: '3777777' },
    { input: '100000000000000000000', expected: '4000000' },

    // Big decimals
    { input: '11000000111001.1010110111001100011000111', expected: '30071.533461434' },
    { input: '11000000111001101.0110111010011110000110110', expected: '300715.33517033' },
    { input: '-.0000001100101001000101100', expected: '-0.00624426' },

    // Big negatives
    { input: '-1111001010001010000001100', expected: '-171212014' },
    { input: '-11100000000001001010100001010101010', expected: '-340011241252' },
    { input: '-1111101010101010110101', expected: '-17525265' },
    { input: '-1010101010101010101010101', expected: '-125252525' },

    // Big decimals positives and negatives
    { input: '10000011000100100110111.0100101110000101000111101', expected: '20304467.227024364' },
    { input: '-11101010110101001001100.1001011110001101010011111', expected: '-35265114.457065174' },
    {
        input: '-11101010110101001001101101010101010111111111000000011011011010111101011.1100000001111010101010111010011001010101010010110011010010110101010110010101011101010010101101010101101010101010000001110',
        expected: '-352651155252777003332753.6007525351452513151325312565126526525007'
    },
];