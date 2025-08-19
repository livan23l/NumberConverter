import path from 'node:path';
import fs from 'node:fs/promises';
import { BASE, notFound } from '../../config/utils.js';
import { ErrorsEnum } from '../enums/ErrorsEnum.js';

export class Controller {
    _params;
    #res;
    #req;

    /**
     * Make all the validations for a current object with data.
     * The validations follows the structure:
     * { 'key' => 'validation1|validation2|validation3' }
     * 
     * @param {object} data - The data to be validated
     * @param {object} validations - The object with the validations
     * @returns {object} - The object with all the errors
     * 
     * The possible validations are:
     * - 'condition:...' -> Sets a condition to validate the field.
     * - 'required' -> If the field can be undefined or not.
     * - 'nullable' -> If the field can be null or not.
     * - 'str' -> Check if the field contains a valid string.
     * - 'obj' -> Check if the field contains a valid object.
     * - 'strnumber' -> Check if the field contains a valid string or number.
     * - 'in:[]' -> Check if the value is in the provided array.
     * - 'inLower:[]' -> Transform value to lower case and check if is in the
     *                   provided array.
     * 
     */
    _validate(data, validations) {
        /**
         * Gets the current element in the data based on the element key.
         * If the element doesn't exists it will return undefined.
         * 
         * @param {string} elementKey - The key of the element to search.
         * @returns {*} - The element value or undefined if it doesn't exists.
         */
        const getElement = (elementKey) => {
            const keys = elementKey.split('.');
            let element = data;

            for (const k of keys) {
                // Check the element is an object
                if (typeof element != 'object' || element == null) {
                    element = undefined;
                    break;
                }

                element = element[k];
            }

            return element;
        };

        // Define the validations
        //--Simple
        const simpValidations = {
            'obj': value => typeof value === 'object' && value !== null,
            'str': value => typeof value === 'string',
            'strnumber': value => typeof value === 'string' ||
                                  typeof value === 'number',
        };

        //--Comparisons
        const compValidations = {
            'in': (value, array) => JSON.parse(array).includes(value),
            'inLower': (value, array) => JSON.parse(array).includes(
                value.toLowerCase()
            ),
        };

        /**
         * Validates one field of the data depending on the validations.
         * It checks if the value is undefined or null and returns the error
         * if the validations fail.
         * 
         * @param {string} field - The field name.
         * @param {*} value - The current value.
         * @param {string} validations - The validation for the current value.
         * @returns {string|null} - The first error in the validation.
         */
        const validate = (field, value, validations) => {
            const validationsArray = validations.split('|');
            let error = null;

            // Check the 'condition' rule
            const hasCondition = validationsArray[0].match(/condition/);
            if (hasCondition) {
                // Check the condition
                try {
                    const condition = validationsArray[0].split(':')[1];
                    if (!eval(condition)) return error;

                    validationsArray.shift();
                } catch {
                    return ErrorsEnum.UNKWOUN(field);
                }
            }

            // Check the 'required' rule
            const isRequired = validationsArray[0].match(/required/);
            if (value === undefined) {
                // Check if the field is not required
                if (!isRequired) return error;

                // Return the corresponding error
                return ErrorsEnum.REQUIRED(field);
            }
            if (isRequired) validationsArray.shift();

            // Check if the value is null
            const isNullable = validationsArray[0].match(/nullable/);
            if (value === null) {
                if (isNullable) return error;

                error = ErrorsEnum.NULLABLE(field);
                return error;
            }
            if (isNullable) validationsArray.shift();

            // Check the rest of the validations
            for (const curValidation of validationsArray) {
                // Check if the current validation has a comparasion
                const isComparison = curValidation.includes(':');

                // Get the current validation and set the params
                const validation = { obj: simpValidations, key: curValidation };
                const params = [value];
                const errorParams = [field];

                //--Check if is a comparison validation
                if (isComparison) {
                    const [compType, compVal] = curValidation.split(':');
                    validation.obj = compValidations;
                    validation.key = compType;
                    params.push(compVal);
                    errorParams.push([value, compVal])
                }

                // Check the result of the validation
                const result = validation.obj[validation.key](...params);

                if (!result) {
                    const errorKey = validation.key.toUpperCase();
                    error = ErrorsEnum[errorKey](...errorParams);
                    break;
                }
            }

            return error;
        };

        const errors = {};
        for (const elementKey in validations) {
            // Get the current element
            const element = getElement(elementKey);

            // Make the validations
            const currentValidations = validations[elementKey];
            const error = validate(elementKey, element, currentValidations);

            // Check if there is an error
            if (error != null) {
                errors[elementKey] = error;
            }
        }

        return errors;
    }

    /**
     * Gets the body of the HTTP POST petition.
     * 
     * @returns {Promise<object>} - The parsed body.
     */
    _getRequest() {
        return new Promise((resolve, reject) => {
            let request = '';

            this.#req.on('data', chunk => {
                request += chunk.toString();
            });

            this.#req.on('end', () => {
                try {
                    const requestParsed = JSON.parse(request);
                    resolve(requestParsed);
                } catch (e) {
                    reject({error: e.message});
                }
            });

            this.#req.on('error', () => reject({error: 'Error in the data transfer'}));
        });
    }

    /**
     * Response the HTTP petition with one object (JSON).
     * 
     * @param {object} response - The object to response
     * @returns {void}
     */
    _object(response) {
        this.#res.statusCode = 200;
        this.#res.setHeader('Content-Type', 'application/json; charset=utf-8');
        this.#res.end(JSON.stringify(response));
    }

    /**
     * 
     * @param {string} view - The name of the view without the '.html' with the
     * structure 'directory.filename'.
     * @param {object} variables - Optional. The used variables inside the view.
     * @returns {void}
     */
    _view(view, variables = {}) {
        const file = path.join(
            BASE, 'public', 'views', view.replace(/\./g, path.sep) + '.html'
        );

        fs.readFile(file)
            .then((input) => {
                // Replace the variables with type {{ variable }}
                let output = input.toString();
                for (const [key, value] of Object.entries(variables)) {
                    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
                    output = output.replace(regex, value);
                }

                // Response with the output
                this.#res.statusCode = 200;
                this.#res.setHeader('Content-Type', 'text/html; charset=utf-8');
                this.#res.end(output);
            })
            .catch(() => {
                notFound(this.#res);
            });
    }

    /**
     * Initializes the Controller
     * 
     * @param {http.IncomingMessage} req - The server request
     * @param {http.ServerResponse} res - The server response
     * @param {object} params - The URI params
     */
    constructor(req, res, params) {
        this.#req = req;
        this.#res = res;
        this._params = params;
    }
}