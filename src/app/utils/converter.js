class CBase {
    static validChars = [];
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
     * - `validChars`: Set the characters that are considered valid.
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
            if (!this.validChars.includes(character)) return false;
        }

        return true;
    }

    /**
     * Performs a sum between two integers numbers in string format. This method
     * uses numbers of any size, which is why they must be in string format.
     * 
     * @static
     * @param {string} number1 - The first number in string format.
     * @param {string} number2 - The second number in string format.
     * @returns {string} - The sum of both numbers.
     */
    static _strIntAddition(number1, number2) {
        // Get the maximum and minimum number according on their dimensions
        const [maxN, minN] = (number1.length > number2.length)
            ? [number1, number2]
            : [number2, number1];

        // Invert both numbers
        const maxNRev = maxN.split('').reverse();
        const minNRev = minN.split('').reverse();

        let result = '';

        // Make the addition
        let remainder = 0;
        for (let i = 0; i < maxN.length; i++) {
            const num1 = Number(maxNRev[i]);
            const num2 = Number(minNRev[i] ?? 0);

            // Make the current addition and set the remainder
            const curRes = (remainder + num1 + num2).toString();
            const has2digits = (curRes.length == 2);
            remainder = (has2digits) ? Number(curRes[0]) : 0;

            // Add the last digit to the final result
            result = curRes.at(-1) + result;
        };

        // Add the remainder
        if (remainder != 0) result = remainder.toString() + result;

        // Return the addition
        return result;
    }

    /**
     * Performs a multiplication between a value in string format and an
     * integer. The value can contain a decimal part. This method will return
     * an object with the integer part and the decimal part.
     * 
     * @static
     * @param {string} value - The integer number in string format.
     * @param {number} multiplier - The int number to multiply the value.
     * @returns {object} - The multiplication result with the integer and
     * decimal parts.
     */
    static _strMultiplication(value, multiplier) {
        const result = {
            intPart: '',
            decimalPart: ''
        };

        // Make the multiplication from back to from
        let isDecimal = value.includes('.');
        let remainder = 0;
        for (let i = value.length - 1; i >= 0; i--) {
            // Check if the current digit is the period
            if (value[i] == '.') {
                isDecimal = false;
                continue;
            }

            // Get the curreng digit
            const dig = Number(value[i]);

            // Make the current multiplication
            const mult = ((dig * multiplier) + remainder).toString();

            // Check if the multiplication result has more than one digit
            const hasMoreDigits = (mult.length > 1);

            // Set the new remainder
            remainder = (hasMoreDigits)
                ? Number(mult.slice(0, mult.length - 1))
                : 0;

            // Get the last digit
            const lastDig = mult.at(-1).toString();

            // Add the last digit to the corresponding part
            if (isDecimal) result.decimalPart = lastDig + result.decimalPart;
            else result.intPart = lastDig + result.intPart;
        }

        // Add the remainder
        if (remainder > 0) {
            result.intPart = remainder.toString() + result.intPart;
        }

        // Check if the decimal part is empty
        if (result.decimalPart == '') result.decimalPart = '0';

        return result;
    }

    /**
     * This method is a template to perform one division at a time for the
     * methods `_strIntDivision` and `strFullDivision`. This returns an object
     * with the result and the remainder.
     * 
     * @private
     * @param {number} divisor - The divisor number.
     * @param {number} lastRemainder - The remainder of the previous divisions.
     * @param {number} currentValue - The current value of the current division.
     * @returns {{result: string, remainder: number}} The division result and
     * the remainder.
     */
    static __divisionTemplate(divisor, lastRemainder, currentValue) {
        const division = {
            result: '',
            remainder: 0,
        };

        // Make the mathematical evaluations
        const value = (lastRemainder * 10) + currentValue;
        division.result = Math.floor(value / divisor).toString();
        division.remainder = value % divisor;

        return division;
    }

    /**
     * Performs a division between an integer dividend (no decimal part) in
     * string format and an integer divisor. This method will return the integer
     * division result and the remainder as an object.
     * 
     * @static
     * @param {string} dividend - The integer number in string format to divide.
     * @param {number} divisor - The int number that will divide the dividend.
     * @returns {object} - The division with the result and the remainder.
    */
    static _strIntDivision(dividend, divisor) {
        const division = {
            result: '',
            remainder: 0
        };

        for (const d of dividend) {
            const { result, remainder } = this.__divisionTemplate(
                divisor,
                division.remainder,
                Number(d)
            );

            // Update the current values of the division
            if (result != '0' || division.result != '') {
                division.result += result;
            }
            division.remainder = remainder;
        }

        if (division.result == '') division.result = '0';
        return division;
    }

    /**
     * Performs full division between a string (which may contain a decimal) and
     * an integer. Returns the final division result in string format. If the
     * division enters a loop (such as when dividing 1/3), it will perform a
     * maximum of 25 iterations.
     * 
     * @static
     * @param {string} dividend - The dividend number in string format.
     * @param {number} divisor - The integer number to divide the dividend.
     * @returns {string} - The division result.
     */
    static _strFullDivision(dividend, divisor) {
        let result = '';

        // Make the division for all the digits in the dividend
        let isDecimalPart = false;
        let remainder = 0;
        for (const dig of dividend) {
            // Check if the current digit is the '.'
            if (dig == '.') {
                isDecimalPart = true;
                result += '.';
                continue;
            }

            // Make the current division
            const div = this.__divisionTemplate(divisor, remainder, Number(dig));

            // Update the result and the remainder
            if (div.result != '0' || result != '') result += div.result;
            remainder = div.remainder;
        }

        // Add the final remainder
        if (remainder != 0) {
            const maxDecimals = 25;

            // Check if the result has the decimal part to add '.' to the result
            if (!isDecimalPart) result += '.';

            for (let i = 0; i < maxDecimals; i++) {
                const div = this.__divisionTemplate(divisor, remainder, 0);

                result += div.result;
                remainder = div.remainder;

                if (remainder == 0) break;
            }
        }

        // Fix the result if is empty or starts with '.'
        if (result == '') result = '0';
        else if (result.startsWith('.')) result = '0' + result;

        return result;
    }

    /**
     * This method provides the basic structure for generating a conversion from
     * one number to another base. Here all the conversion classes will pass the
     * static methods to generate the decimal and integer parts in the new base.
     * This method will return the new number as a string depending on the valid
     * characters of the new base.
     * 
     * @static
     * @param {string} number - The decimal number to convert into another base.
     * @param {number} base - The new base for the decimal number.
     * @param {string[]} baseChars - The valid characters in the new base.
     * @param {function} decMethod - The static method to get the decimal part.
     * @param {function} intMethod - The static method to get the integer part.
     * @returns {string} - The new value in the specified base.
     */
    static _conversion(number, base, baseChars, decMethod, intMethod) {
        // Define the number characteristics
        const isNegative = number.startsWith('-');
        const isDecimal = number.includes('.');

        const result = [];  // The result with the integer and decimal parts.

        // Divide the integer and decimal parts from the number
        let [intPart, decimalPart] = number.split('.');

        // Add the new decimal digits to the final result
        if (isDecimal) {
            result.push('.');
            result.push(decMethod.call(this, decimalPart, base, baseChars));
        }

        // Check if the integer part is basically zero to return the result
        if (intPart == '0' || intPart == '-0') {
            // Set the corresponding zero in the final value
            const cur0 = baseChars[0];
            const joinedNumber = cur0 + result.join('');
            const finalNumber = ((isNegative) ? '-' : '') + joinedNumber;

            // Return the final number with one correction for '-0.0'
            if (finalNumber == `-${cur0}.${cur0}`) return `${cur0}.${cur0}`;
            else return finalNumber;
        }

        // Remove the '-' from the integer part if it's a negative number
        if (isNegative) intPart = intPart.slice(1);

        // Generate the integer part and add it to the result
        result.unshift(intMethod.call(this, intPart, base, baseChars));

        // Add the negative sign if it's negative
        if (isNegative) result.unshift('-');

        return result.join('');
    }
}

export class CHexadecimal extends CBase {
    static validChars = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D',
        'E', 'F'
    ];
}

export class CDecimal extends CBase {
    static validChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    /**
     * Gets the numbers from the decimal part in one conversion from one decimal
     * number to another base depending on the valid characters in the new base.
     * 
     * Returns the new decimal part with up to 25 digits. If the conversion
     * reaches the maximum number of digits and has not yet completed, this
     * method appends a '...' to the end.
     * 
     * @static
     * @param {string} decimal - The decimal part to be converted.
     * @param {number} base - The new base for the decimal part.
     * @param {string[]} baseChars - The valid characters in the new base.
     * @returns {string}
     */
    static #getDecimals(decimal, base, baseChars) {
        const maxDecimals = 25;
        let finalVal = '';

        // Generate the new decimal value
        let isComplete = false;
        for (let decimals = 0; decimals < maxDecimals; decimals++) {
            // Multiply the current decimal part by the new base value
            const mult = this._strMultiplication(`0.${decimal}`, base);

            // Update the new decimal part with the resulting decimal part
            decimal = mult.decimalPart;

            // Push the corresponding int part to the final value
            finalVal += baseChars[mult.intPart];

            // Chekc if the conversion has ended
            if (Number(decimal) == 0) {
                isComplete = true;
                break;
            }
        }

        // Check if the number could complete the decimal conversion
        if (!isComplete) finalVal += '...';

        return finalVal;
    }

    /**
     * Gets the numbers from the integer part in one conversion from one decimal
     * number to another base depending on the valid characters in the new
     * base. Returns the final value reached until get zero in the divisions.
     * 
     * @static
     * @param {string} number - The decimal number to be converted.
     * @param {number} base - The new base for the decimal number.
     * @param {string[]} baseChars - The valid characters in the new base.
     * @returns {string}
     */
    static #getIntegers(number, base, baseChars) {
        // Generate the integer part until reach the expected coefficient
        const expectedCoefficient = '0';
        let finalValue = '';
        while (number != expectedCoefficient) {
            // Divide the number into the new base value
            const division = this._strIntDivision(number, base);

            // Update the new number with the division result
            number = division.result;

            // Append the corresponding value to the final value
            finalValue = baseChars[division.remainder] + finalValue;
        }

        return finalValue;
    }

    /**
     * Makes the conversion from one decimal number to the corresponding number
     * in base62. The decimal number can be negative and can contain a decimal
     * part. In this method it's possible to send one custom order in the valid
     * characters.
     * 
     * @static
     * @param {string} number - The decimal number to convert in base62.
     * @param {string[]} customChars - A custom character order. 
     * @returns {string} - The number in base62 format.
     */
    static tobase62(number, customChars) {
        const validChars = (customChars.length > 0)
            ? customChars
            : CBase62.validChars;

        return this._conversion(
            number,
            62,
            validChars,
            this.#getDecimals,
            this.#getIntegers,
        );
    }

    /**
     * Makes the conversion from one decimal number to the corresponding number
     * in hexadecimal. The decimal number can be negative and can contain a
     * decimal part.
     * 
     * @static
     * @param {string} number - The decimal number to convert in hexadecimal.
     * @returns {string} - The number in hexadecimal format.
     */
    static tohexadecimal(number) {
        return this._conversion(
            number,
            16,
            CHexadecimal.validChars,
            this.#getDecimals,
            this.#getIntegers,
        );
    }

    /**
     * Makes the conversion from one decimal number to the corresponding number
     * in octal. The decimal number can be negative and can contain a decimal
     * part.
     * 
     * @static
     * @param {string} number - The decimal number to convert in octal.
     * @returns {string} - The number in octal format.
     */
    static tooctal(number) {
        return this._conversion(
            number,
            8,
            COctal.validChars,
            this.#getDecimals,
            this.#getIntegers,
        );
    }

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
        return this._conversion(
            number,
            2,
            CBinary.validChars,
            this.#getDecimals,
            this.#getIntegers,
        );
    }
}

export class COctal extends CBase {
    static validChars = ['0', '1', '2', '3', '4', '5', '6', '7'];
}

export class CBinary extends CBase {
    static validChars = ['0', '1'];

    /**
     * This method is a template to get the decimal part and the integer part
     * when the new base is an exponent of two (4, 8, 16, 32...). This works
     * with the 'append' param because the generation is backward when the
     * result is the integer part and forward when it's the decimal part.
     * 
     * @static
     * @param {string} number - The binary number to be converted.
     * @param {number} base - The new base of the number (4, 8, 16, 32...).
     * @param {string[]} baseChars - The corresponding chars in the new base.
     * @param {boolean} append - If the generation will be backward or forward.
     * @returns {string} - The resulting number in the new base.
     */
    static #getBase2Template(number, base, baseChars, append = true) {
        // Get the cycles depending on the current base
        const cyclesPerBase = {
            8: 3,
            16: 4
        };
        const cycles = cyclesPerBase[base];

        // Define the variables to generate the integer part of the value
        let result = '';
        let value = 0;
        let exp = (append) ? 0 : cycles - 1;

        // Define if the value will be append or pushed
        const addToResult = (append)
            ? (val) => { result = baseChars[val] + result; }
            : (val) => { result += baseChars[val] };

        // Make the conversion
        const numberOrder = (append) ? number.split('').reverse() : number;
        for (const dig of numberOrder) {
            // Check if it's the end of the current cycle
            if (exp >= cycles || exp < 0) {
                addToResult(value);
                value = 0;
                exp = (append) ? 0 : cycles - 1;
            }

            // Check if the current value will be added
            if (dig == '1') value += (2 ** exp);

            if (append) exp++; else exp--;
        }

        // Check if the cycle was not finish to add the remaining
        if (value != 0) addToResult(value);

        // Set '0' if the result is empty
        if (result == '') result = '0';

        return result;
    }

    /**
     * Generates the decimal part of one binary number that will be converted
     * into another base. This method is This method is only for bases that are
     * exponents of two (4, 8, 16, 32...).
     * 
     * @static
     * @param {string} decimals - The decimals that will be converted.
     * @param {number} base - The new base of the decimals.
     * @param {string[]} baseChars - The corresponding chars in the new base.
     * @returns {string} - The converted decimals in the new base.
     */
    static #getBase2Decimals(decimals, base, baseChars) {
        return this.#getBase2Template(decimals, base, baseChars, false);
    }

    /**
     * Generates the integer part of one binary number that will be converted
     * into another base. This method is This method is only for bases that are
     * exponents of two (4, 8, 16, 32...).
     * 
     * @static
     * @param {string} number - The number that will be converted.
     * @param {number} base - The new base of the decimals.
     * @param {string[]} baseChars - The corresponding chars in the new base.
     * @returns {string} - The converted number in the new base.
     */
    static #getBase2Integers(number, base, baseChars) {
        return this.#getBase2Template(number, base, baseChars);
    }

    /**
     * Generates the decimal part of one binary number that will be converted
     * into a decimal number.
     * 
     * @param {string} number - The decimal part of a binary number.
     * @returns {string} - The decimal part in decimal base.
     */
    static #getBase10Decimals(number) {
        let result = '0';

        // Make the conversion from back to from
        let currentValue = '0.5';
        for (const dig of number) {
            // Add the current value to the result if the digit is '1'
            if (dig == '1') {
                // Get the decimal part of the current value
                const decimalPart = currentValue.split('.').at(-1);

                // Fill the current value with zeros
                let resultWithZeros = result;
                for (let i = result.length; i < decimalPart.length; i++) {
                    resultWithZeros += '0';
                }

                // Add the sum to the result
                result = this._strIntAddition(resultWithZeros, decimalPart);
            }

            // Generate the next value
            currentValue = this._strFullDivision(currentValue, 2);
        }

        return result;
    }

    /**
     * Generates the integer part of one binary number that will be converted
     * into a decimal number.
     * 
     * @param {string} number - The integer part of a binary number.
     * @returns {string} - The integer part in decimal base.
     */
    static #getBase10Integers(number) {
        let result = '0';

        // Make the conversion from back to from
        let currentValue = '1';
        for (const dig of number.split('').reverse()) {
            // Add the current value to the result if the digit is '1'
            if (dig == '1') {
                result = this._strIntAddition(currentValue, result);
            }
            
            // Generate the next value
            const nextValue = this._strMultiplication(currentValue, 2);
            currentValue = nextValue.intPart;
        }

        return result;
    }

    /**
     * Makes the conversion from one binary number to the corresponding number
     * in base62. The binary number can be negative and can contain a decimal
     * part. In this method it's possible to send one custom order in the valid
     * characters. This method will make two conversions, one from binary to
     * decimal and the second one from decimal to base62.
     * 
     * @static
     * @param {string} number - The binary number to convert in base62.
     * @param {string[]} customChars - A custom character order. 
     * @returns {string} - The number in base62 format.
     */
    static tobase62(number, customChars) {
        const decimalNumber = this.todecimal(number);
        return CDecimal.tobase62(decimalNumber, customChars);
    }

    /**
     * Makes the conversion from one binary number to the corresponding number
     * in hexadecimal. The binary number can be negative and can contain a
     * decimal part.
     * 
     * @static
     * @param {string} number - The binary number to convert in hexadecimal.
     * @returns {string} - The number in hexadecimal format.
     */
    static tohexadecimal(number) {
        return this._conversion(
            number,
            16,
            CHexadecimal.validChars,
            this.#getBase2Decimals,
            this.#getBase2Integers
        );
    }

    /**
     * Makes the conversion from one binary number to the corresponding number
     * in decimal. The binary number can be negative and can contain a decimal
     * part.
     * 
     * @static
     * @param {string} number - The binary number to convert in decimal.
     * @returns {string} - The number in decimal format.
     */
    static todecimal(number) {
        return this._conversion(
            number,
            10,
            CDecimal.validChars,
            this.#getBase10Decimals,
            this.#getBase10Integers
        )
    }

    /**
     * Makes the conversion from one binary number to the corresponding number
     * in octal. The binary number can be negative and can contain a decimal
     * part.
     * 
     * @static
     * @param {string} number - The binary number to convert in octal.
     * @returns {string} - The number in octal format.
     */
    static tooctal(number) {
        return this._conversion(
            number,
            8,
            COctal.validChars,
            this.#getBase2Decimals,
            this.#getBase2Integers
        );
    }
}

export class CBase62 extends CBase {
    static validChars = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D',
        'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
        'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
        'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
        'u', 'v', 'w', 'x', 'y', 'z'
    ];
    static validNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    static validUppers = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
        'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ];
    static validLowers = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
    ];
}

export class CText extends CBase {
    static validChars = [
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