import { Controller } from './Controller.js';

export class indexController extends Controller {
    home() {
        return this._view('home');
    }
}