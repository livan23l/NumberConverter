import path from 'node:path';
import fs from 'node:fs/promises';
import { BASE, notFound } from '../../config/utils.js';

export class Controller {
    _variables;
    _request;
    _res;

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
                this._res.statusCode = 200;
                this._res.setHeader('Content-Type', 'text/html; charset=utf-8');
                this._res.end(output);
            })
            .catch(() => {
                notFound(this._res);
            })
    }

    constructor(res, variables) {
        this._res = res;
        this._variables = variables;
    }
}