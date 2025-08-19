class CBase {
    static _validChars = [];
    static _removeAllWhiteSpaces = true;
    static _canContainMinus = true;
    static _canContainPeriod = true;

    /**
     * Standardize the value following two rules:
     * - Removes the leading zeros.
     * - Removes all whitespace if the property is true. Otherwise, it only
     * removes leading and trailing spaces, keeping one for intermediate spaces.
     * 
     * @static
     * @param {string} value - The value to be standardized.
     * @returns {string} - The standardized value.
     */
    static standardizeValue(value) {
        // Remove the leading and trailing white spaces
        value = value.trim();

        // Check if the value will remove all the white spaces
        value = (this._removeAllWhiteSpaces)
            ? value.replaceAll(' ', '')
            : value.replaceAll(/\s+/, ' ');

        // Check if the value starts with '-' to remove the leading zeros
        const hasNegSign = value.startsWith('-');
        if (hasNegSign) value = value.slice(1);

        // Remove the leading zeros from the value
        let newValue = (hasNegSign) ? '-' : '';
        for (let i = 0; i < value.length; i++) {
            const digit = value[i];

            // Finish when the current digit is differnt from '0'
            if (digit != '0') {
                const remValue = value.slice(i);
                newValue += (digit == '.') ? '0' + remValue : remValue;
                break;
            }
        }

        // Check if the new value is emtpy
        if (['-', ''].includes(newValue)) newValue = '0';
        // Check if the value needs one final '0'
        else if (newValue.endsWith('.')) newValue += '0';

        return newValue;
    }

    /**
     * Check whether the value is valid or not depending on the following flags:
     * - `_validChars`: Set the characters that are considered valid.
     * - `_canContainMinus`: Set if the value can starts with '-'.
     * - `_canContainPeriod`: Set if the value can contian one '.'.
     * 
     * @static
     * @param {string} value - The string with the current value
     * @returns {boolean} - The result of the validation
     */
    static validate(value) {
        // Make the necessary validations if the number is negative
        if (value.startsWith('-')) {
            if (!this._canContainMinus) return false;

            // Remove the 'minus' sign
            value = value.slice(1);

            // Check if there is antoher 'minus'
            if (value.includes('-')) return false;
        }

        // Make the necessary validations if the number is decimal
        if (value.includes('.')) {
            if (!this._canContainPeriod) return false;

            // Remove the period
            const idxPeriod = value.indexOf('.');
            value = value.slice(0, idxPeriod) + value.slice(idxPeriod + 1);

            // Check if there is another period
            if (value.includes('.')) return false;
        }

        // Validate the rest of the characters
        for (let i = 0; i < value.length; i++) {
            const character = value[i];
            if (!this._validChars.includes(character)) return false;
        }

        return true;
    }

    /**
     * Performs a multiplication between a number in string format and an
     * integer. The number in string format is expected to have the structure
     * '0.XXX...'.
     * 
     * @static
     * @param {string} value - The number in string format with the structure
     * '0.XXX...'.
     * @param {number} multiplier - The int number to multiply the value.
     * @returns {object} - The result with an int part and a decimal part.
     */
    static _strMultiplication(value, multiplier) {
        const result = {
            intPart: '',
            decimalPart: ''
        };

        // Make the multiplication from back to from
        let isDecimal = true;
        let remainder = 0;
        for (let i = value.length - 1; i >= 0; i--) {
            // Check if the current digit is the period
            if (value[i] == '.') {
                isDecimal = false;
                continue;
            }

            const curVal = Number(value[i]);

            // Multiplicate and add the remainder
            const curMult = ((curVal * multiplier) + remainder).toString();
            const has2Digits = curMult.length == 2;
            const finalDigit = has2Digits ? curMult[1] : curMult[0];

            // Set the new remainder
            remainder = has2Digits ? Number(curMult[0]) : 0;

            // Add the result to the corresponding part
            if (isDecimal) result.decimalPart = finalDigit + result.decimalPart;
            else result.intPart = finalDigit + result.intPart;
        }

        return result;
    }

    /**
     * Performs a division between a number in string format and an integer. The
     * number in string format must not have a decimal part.
     * 
     * @static
     * @param {string} dividend - The number with no decimal part in string
     * format.
     * @param {number} divisor - The int number that will divide the dividend.
     * @returns {object} - The division with the result and the remainder.
     */
    static _strDivision(dividend, divisor) {
        const division = {
            res: '',
            remainder: 0
        };

        for (const d of dividend) {
            // Make the mathematical evaluations
            const dig = (division.remainder * 10) + Number(d);
            const res = Math.floor(dig / divisor);

            // Update the current values of the division
            if (res != '0' || division.res != '') {
                division.res += res.toString();
            }
            division.remainder = dig % divisor;
        }

        if (division.res == '') division.res = '0';
        return division;
    }
}

export class CHexadecimal extends CBase {
    static _validChars = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D',
        'E', 'F'
    ];
}

export class CDecimal extends CBase {
    static _validChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    /**
     * Makes the conversion from one decimal number to the corresponding number
     * in binary. The decimal number can be negative and can contain a decimal
     * part.
     * 
     * @static
     * @param {string} number - The decimal number to convert in binary.
     * @returns {string} - The number in binary format.
     */
    static tobinary(number) {
        // Check if the number has a decimal part
        const isDecimal = number.includes('.');
        let decimalPart = '';
        if (isDecimal) [number, decimalPart] = number.split('.');

        // Get the decimal part
        let binaryDigits = [];
        if (isDecimal) {
            binaryDigits.push('.');

            // Generate 20 decimals maximum
            const maxDecimals = 20;
            let isComplete = false;
            for (let decimals = 0; decimals < maxDecimals; decimals++) {
                const mult = this._strMultiplication(`0.${decimalPart}`, 2);

                decimalPart = mult.decimalPart;
                binaryDigits.push(mult.intPart);

                if (Number(decimalPart) == 0) {
                    isComplete = true;
                    break;
                }
            }

            // Check if the number could complete the decimal conversion
            if (!isComplete) binaryDigits.push('...');
        }

        // Check if the number is basically zero
        if (['0', '-0'].includes(number)) {
            let finalNumber = number + binaryDigits.join('');
            if (finalNumber == '-0.0') finalNumber = '0.0';
            return finalNumber;
        }

        // Check if it's a negative number
        const isNegative = number.startsWith('-');
        if (isNegative) number = number.slice(1);

        // Generate the binary number
        while (Number(number) > 1) {
            const division = this._strDivision(number, 2);
            number = division.res;
            binaryDigits.unshift(division.remainder);
        }

        // Complete the binary number
        if (isNegative) binaryDigits.unshift(-1);
        else binaryDigits.unshift(1);

        return binaryDigits.join('');
    }
}

export class COctal extends CBase {
    static _validChars = ['0', '1', '2', '3', '4', '5', '6', '7'];
}

export class CBinary extends CBase {
    static _validChars = ['0', '1'];
}

export class CBase62 extends CBase {
    static _validChars = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D',
        'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
        'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
        'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
        'u', 'v', 'w', 'x', 'y', 'z'
    ];
}

export class CText extends CBase {
    static _validChars = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
        'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'Á', 'É',
        'Í', 'Ó', 'Ú', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
        'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y',
        'z', 'á', 'é', 'í', 'ó', 'ú'
    ];
    static _removeAllWhiteSpaces = false;
    static _canContainMinus = false;
    static _canContainPeriod = false;
}