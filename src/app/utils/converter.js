class Base {
    static _validChars = [];

    /**
     * Check whether the value is valid or not.
     * 
     * @param {string} value - The string with the current value
     * @returns {boolean} - The result of the validation
     */
    static validate(value) {
        let isValid = true;

        for (let i = 0; i < value.length; i++) {
            const character = value[i];

            if (!this._validChars.includes(character)) {
                isValid = false;
                break;
            }
        }

        return isValid;
    }
}

export class Decimal extends Base {
    static _validChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
}