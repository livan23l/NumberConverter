export const WarningsEnum = {
    USESTRING: value => 
        'To maintain precision, always try to send `from.value` in string ' +
        `format, not number format: '${value}' instead of ${value}.`,
    TOOMANYDECIMALS: () =>
        'The result had too many decimals. These were truncated to only ' +
        'twenty-five characters.',

    CHEXADECIMALVAL: value =>
        `\`${value}\` is not a valid hexadecimal number.`,
    CDECIMALVAL: value =>
        `\`${value}\` is not a valid decimal number.`,
    COCTALVAL: value =>
        `\`${value}\` is not a valid octal number.`,
    CBINARYVAL: value =>
        `\`${value}\` is not a valid binary number.`,
    CBASE62VAL: value =>
        `\`${value}\` is not a valid number in base 62 format.`,
    CTEXTVAL: value =>
        `\`${value}\` is not a valid number in text format.`,
}