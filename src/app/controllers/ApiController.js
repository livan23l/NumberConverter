import { Controller } from './Controller.js';
import { CHexadecimal, CDecimal, COctal, CBinary, CBase62, CText } from '../utils/converter.js';
import { WarningsEnum } from '../enums/WarningsEnum.js';
import { ErrorsEnum } from '../enums/ErrorsEnum.js';

export class ApiController extends Controller {
    /**
     * Returns the correspongin class depending on the type of value.
     * 
     * @param {string} typeClass - The type of the value.
     * @returns {CHexadecimal|CDecimal|COctal|CBinary|CBase62|CText}
     */
    #getClassByType(typeClass) {
        switch (typeClass) {
            case 'hexadecimal': return CHexadecimal;
            case 'decimal': return CDecimal;
            case 'octal': return COctal;
            case 'binary': return CBinary;
            case 'base62': return CBase62;
            case 'text': return CText;
        }
    }

    /**
     * Make the conversion of `from.value` in `from.type` to `to.type`.
     * 
     * @param {Object} from - The `from` object with the value and the type.
     * @param {Object} to - The `to` object with the type and formats.
     * @returns {string} - The converted value.
     */
    #makeConversion(from, to) {
        const currentClass = this.#getClassByType(from.type);

        switch(to.type) {
            case 'base62': {
                // Check if 'to.format.order' is defined
                const order = to.format?.order;
                const newValidChars = [];

                // Create the new valid chars in the sended order
                const orderList = order ? order.split('-') : [];
                for (const ord of orderList) {
                    switch(ord) {
                        case 'int':
                            newValidChars.push(...CBase62.validNumbers);
                            break;
                        case 'upper':
                            newValidChars.push(...CBase62.validUppers);
                            break;
                        case 'lower':
                            newValidChars.push(...CBase62.validLowers);
                            break;
                    }
                }

                return currentClass.tobase62(from.value, newValidChars);
            }
            default: {
                return currentClass[`to${to.type}`](from.value);
            }
        }
    }

    /**
     * Validate and standardize `from.value` depending on `from.type` and return
     * the final value with warnings if there are some.
     * 
     * @param {Object} from - The from object with the type and the value.
     * @returns {Object} - The resulting value and warnings if any.
     */
    #validateFrom(from) {
        // Get the current class depending on the type
        const currentClass = this.#getClassByType(from.type)

        // Get the standardized value
        const value = currentClass.standardizeValue(from.value);

        // Make the validation
        const validation = {
            warning: {},
            value
        };
        if (currentClass.validate(value)) return validation;

        const key = `${currentClass.name.toUpperCase()}VAL`;
        validation.warning = WarningsEnum[key](from.value);
        validation.value = null;
        return validation;
    }

    /**
     * Handles the conversion by performing validations and returning the
     * expected result
     * 
     * @param {Object} data - The request data
     */
    #handleConversion(data) {
        // Validate the data
        const errors = this._validate(data, {
            'from':            'required|obj',
            'from.type':       'required|str|in:["hexadecimal", "decimal", ' +
                               '"octal", "binary", "base62", "text"]',
            'from.value':      'required|strnumber',
            'from.lang':       'condition:data.from.type=="text"|required|' +
                               'str|in:["en", "es"]',
            'to':              'required|obj',
            'to.type':         'required|str|in:["hexadecimal", "decimal", ' +
                               '"octal", "binary", "base62", "text"]',
            'to.format.lang':  'condition:data.to.type=="text"|nullable|str|' +
                               'in:["en", "es"]',
            'to.format.order': 'condition:data.to.type=="base62"|nullable|' +
                               'str|in:["int-lower-upper", "int-upper-lower"' +
                               ', "lower-int-upper", "lower-upper-int", ' +
                               '"upper-int-lower", "upper-lower-int"]',
            'to.format.separation': 'condition:data.to.type!="text"|nullable|' +
                                    'str|in:["commas", "periods"]'
        });

        // Check if there is at least one error
        if (Object.keys(errors).length > 0) {
            return this._object({ errors });
        }

        // Put the warnings
        const warnings = {};
        if (typeof data.from.value == 'number') {
            data.from.value = data.from.value.toString();
            warnings['from.value'] = WarningsEnum.USESTRING(data.from.value);
        }

        // Check if the value has at least one character
        if (data.from.value == '') {
            return this._object({ errors: {
                'from.value': ErrorsEnum.MINLEN('from.value', 1) 
            }});
        }

        // Validate the `from.value` depending on `from.type`
        const validation = this.#validateFrom(data.from);
        const result = { data: validation.value };
        data.from.value = validation.value;

        if (validation.value == null) {
            warnings['validation'] = validation.warning;
        }
        // Make the conversion if the types of from and to are different
        else if (data.from.type != data.to.type) {
            result.data = this.#makeConversion(data.from, data.to);

            // Check if the data has '...' and add a warning
            if (result.data.endsWith('...')) {
                warnings['data'] = WarningsEnum.TOOMANYDECIMALS();
                result.data = result.data.replace(/\.\.\.$/, '');
            }
        }


        // Define the response
        const response = (Object.keys(warnings).length > 0)
            ? { warnings, data: result.data }
            : { data: result.data };

        return this._object(response);
    }

    /**
     * Starts the conversion process
     */
    converter() {
        this._getRequest()
            .then((data) => {
                return this.#handleConversion(data);
            })
            .catch((error) => {
                return this._object(error);
            });
    }
}