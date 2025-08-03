import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs/promises';
import { BASE, fmt, notFound } from '../utils.js';

/**
 * Router class for defining and handling GET and POST routes.
 * 
 * @class
 */
export class Router {
    static #GET = {};
    static #POST = {};

    /**
     * Define a new GET URI.
     * 
     * @param {string} uri - The GET URI to add.
     * @param {Array} callback - The array with the structure [Controller,
     * 'method']
     * @returns {void}
     */
    static GET(uri, callback) {
        this.#GET[uri.replace(/^\/|\/$/g, '')] = callback;
    }

    /**
     * Define a new POST URI.
     * 
     * @param {string} uri - The POST URI to add.
     * @param {Function} callback - The array with the structure [Controller,
     * 'method']
     * @returns {void}
     */
    static POST(uri, callback) {
        this.#POST[uri.replace(/^\/|\/$/g, '')] = callback;
    }

    static #processFile(uri, res) {
        // Check the file extension
        const extension = path.extname(uri);
        if (!(extension in fmt)) return notFound(res);

        // Check if the file exists in '/public/' and return it
        const file = path.join(BASE, 'public', uri);

        fs.readFile(file)
            .then((input) => {
                // Get the file mime type
                const mime = fmt[extension];

                // Response with the file
                res.statusCode = 200;
                res.setHeader('Content-Type', mime);
                res.end(input);
            })
            .catch(() => {
                notFound(res);
            })
    }

    static dispatch() {
        const getAction = (uri, method) => {
            const action = {
                callback: null,
                variables: {},
            };

            // Get the current routes
            const routes = (method == 'GET') ? this.#GET : this.#POST;

            // Remove the query strings and the '/' from the uri
            uri = uri.replace(/^\/|\/$/g, '').split('?')[0];

            // Check if the URI is in the current routes
            const varsRE = /(:[a-zA-Z0-9\_]+)/g;
            for (const route in routes) {
                // Check if the current route has variables
                const vars = route.match(varsRE);
                if (vars) {
                    const routeRE = new RegExp(
                        route.replace(varsRE, '([a-zA-Z0-9\-]+)')
                    );

                    // Check if the URI match with the route RE
                    const values = uri.match(routeRE)
                    if (values) {
                        action.callback = routes[route];
                        for (let i = 0; i < vars.length; i++) {
                            action.variables[vars[i].replace(/^:/, '')] = values[i + 1];
                        }
                        break;
                    }
                    continue;
                }

                // Check the route directly
                if (route == uri) {
                    action.callback = routes[route];
                    break;
                }
            }

            return action;
        }

        const processRequest = (req, res) => {
            // Check if the URI is a file
            if (path.extname(req.url)) return this.#processFile(req.url, res);

            // Continue handling the request
            const { callback, variables } = getAction(req.url, req.method);

            // Execute the callback if exists
            if (callback) {
                const [Controller, method] = callback;
                const instance = new Controller(res, variables);
                return instance[method]();
            }

            return notFound(res);
        }

        const server = http.createServer(processRequest);
        const port = process.env.PORT ?? 3300;
        server.listen(port, () => {
            console.log('Server up on port:', port);
        });
    }
}