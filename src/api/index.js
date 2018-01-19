import express from 'express';
import { apiUsers, apiUsersProtected } from './users';
import { apiStories, apiStoriesProtected } from './stories';
import { isAuthenticated, initAuth } from '../business/auth';
import logger from '../logger';

const api = express();
const helmet = require('helmet');
const hpp = require('hpp');

initAuth();
api.use(express.json({ limit: '1mb' }));
api.use(hpp());
api.use(helmet());
logger.info(apiStories);
const apiRoutes = express.Router();
apiRoutes
  .use('/users', apiUsers)
  .use('/stories', apiStories)
  // api bellow this middelware require Authorization
  .use(isAuthenticated)
  .use('/users', apiUsersProtected)
  .use('/stories', apiStoriesProtected)
  .use((err, req, res, next) => {
    res.status(403).send({
      success: false,
      message: `${err.name} : ${err.message}`,
    });
    next();
  });

api.use('/api/v1', apiRoutes);
export default api;
