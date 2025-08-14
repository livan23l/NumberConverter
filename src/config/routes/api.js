import { Router } from './Router.js';
import { ApiController } from '../../app/controllers/ApiController.js';

Router.POST('/api/converter', [ApiController, 'converter']);