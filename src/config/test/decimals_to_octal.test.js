// Connection test
export const tests = [
    // Positive integers
    { input: '0', expected: '0' },
    { input: '1', expected: '1' },
    { input: '2', expected: '2' },
    { input: '5', expected: '5' },
    { input: '10', expected: '12' },

    // Negative integers
    { input: '-1', expected: '-1' },
    { input: '-2', expected: '-2' },
    { input: '-5', expected: '-5' },

    // Positive decimals
    { input: '0.5', expected: '0.4' },
    { input: '0.25', expected: '0.2' },
    { input: '0.75', expected: '0.6' },
    { input: '2.5', expected: '2.4' },
    { input: '3.25', expected: '3.2' },

    // Negative decimals
    { input: '-0.5', expected: '-0.4' },
    { input: '-2.5', expected: '-2.4' },
    { input: '-3.25', expected: '-3.2' },

    // Rare cases
    { input: '.5', expected: '0.4' },
    { input: '1.', expected: '1.0' },
    { input: '-.5', expected: '-0.4' },
    { input: '-', expected: '0' },
    { input: '.', expected: '0.0' },
    { input: '-.', expected: '0.0' },
    { input: '-0', expected: '0' },
    { input: '0005.375', expected: '5.3' },
    { input: 'a', expected: null },
    { input: '12345678A', expected: null },
    { input: '+14242141', expected: null },
    { input: '--1321312312', expected: null },
    { input: '0.5.1', expected: null },

    // Big integers
    { input: '123456', expected: '361100' },
    { input: '8526945', expected: '40416141' },
    { input: '1048575', expected: '3777777' },
    { input: '1048576', expected: '4000000' },
    { input: '986512457898756987565', expected: '152752342333044072155255' },

    // Big decimals
    { input: '12345.6789', expected: '30071.5334614374240440267400321' },
    { input: '98765.4321', expected: '300715.3351703302115002352225060' },
    { input: '-.0123456789876543210', expected: '-0.0062442607677667170312162' },

    // Big negatives
    { input: '-123456', expected: '-361100' },
    { input: '-987654', expected: '-3611006' },
    { input: '-1048575', expected: '-3777777' },
    { input: '-1048576', expected: '-4000000' },

    // Big decimals positives and negatives
    { input: '4294967.295', expected: '20304467.2270243656050753412172702' },
    { input: '-7694924.592', expected: '-35265114.4570651767635544264162540' },
];