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
                // Response with the file
                this._res.statusCode = 200;
                this._res.setHeader('Content-Type', 'text/html; charset=utf-8');
                this._res.end(input);
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