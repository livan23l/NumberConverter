import { Controller } from './Controller.js';

export class MainController extends Controller {
    home() {
        return this._view('home');
    }
}