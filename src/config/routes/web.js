import { Router } from './Router.js';
import { indexController } from '../../app/controllers/IndexController.js';

Router.GET('/', [indexController, 'home']);

Router.dispatch();