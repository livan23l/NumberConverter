export const WarningsEnum = {
    USESTRING: value => 
        'To maintain precision, always try to send `from.value` in string ' +
        `format, not number format: '${value}' instead of ${value}.`
}