const inError = (field, comparison, additionalMsg = '') => {
    const [value, array] = comparison;
    const arrayStr = "'" + JSON.parse(array).join("', '") + "'";
    return `'${value}' is not a valid \`${field}\` value. Accepted ` + 
            `values are: ${arrayStr}.${additionalMsg}`;
};

export const ErrorsEnum = {
    UNKWOUN: field => 'There was an unknown error while trying to validate ' +
                      `the \`${field}\` element.`,
    REQUIRED: field => `The \`${field}\` element is required.`,
    NULLABLE: field => `The \`${field}\` element cannot be null.`,
    OBJ: field => `The \`${field}\` element must contain a valid object.`,
    STR: field => `The \`${field}\` element must contain a valid string.`,
    STRNUMBER: field => `The \`${field}\` element must contain a valid ` +
                        'string or a valid number.',
    MINLEN: (field, value) => {
        const plural = (value > 1) ? 's' : '';

        return `The \`${field}\` element must contain at least ${value} ` +
               `character${plural}.`;
    },
    IN: (field, comparison) => inError(field, comparison),
    INLOWER: (field, comparison) => inError(
        field,
        comparison,
        ' The comparison is not case sensitive.'
    ),
}