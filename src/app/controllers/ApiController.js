import { Controller } from './Controller.js';
import { Decimal } from '../utils/converter.js';
import { WarningsEnum } from '../enums/WarningsEnum.js';

export class ApiController extends Controller {

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
            'from.type':       'required|str|in:["decimal", "octal", ' +
                               '"binary", "base62", "text"]',
            'from.value':      'required|strnumber',
            'from.lang':       'condition:data.from.type=="text"|required|' +
                               'str|in:["en", "es"]',
            'to':              'required|obj',
            'to.type':         'required|str|in:["decimal", "octal", ' +
                               '"binary", "base62", "text"]',
            'to.format.lang':  'condition:data.to.type=="text"|nullable|str|' +
                               'in:["en", "es"]',
            'to.format.order': 'condition:data.to.type=="base62"|nullable|' +
                               'str|in:["int-lower-upper", "int-upper-lower"' +
                               ', "lower-int-upper", "lower-upper-int", ' +
                               '"upper-int-lower", "upper-lower-int"]'
        });

        if (Object.keys(errors).length > 0) {
            return this._object({ errors });
        }

        const warnings = {};
        if (typeof data.from.value == 'number') {
            data.from.value = data.from.value.toString();
            warnings['from.value'] = WarningsEnum.USESTRING(data.from.value);
        }

        const response = (Object.keys(warnings).length > 0)
            ? { warnings, data }
            : { data };

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