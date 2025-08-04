import { Router } from './Router.js';
import { MainController } from '../../app/controllers/MainController.js';

Router.GET('/', [MainController, 'home']);