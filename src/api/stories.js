import _ from 'lodash'; // https://lodash.com/docs/
import express from 'express';
import logger from '../logger';
import { createStories } from '../business/stories';

const apiStoriesProtected = express.Router();

apiStoriesProtected.post('/', (req, res) =>
  createStories({
    title: req.body.title,
    shortText: req.body.shortText,
    fullText: req.body.fullText,
    metaDatas: req.body.metaDatas,
    userId: req.user.id,
  })
    .then(story =>
      res.status(201).send({
        success: true,
        profile: _.omit(story, ['UserId', 'id']),
        message: 'Story created',
      })
    )
    .catch(err => {
      logger.error(`💥 Failed to create story : ${err.stack}`);
      return res.status(500).send({
        success: false,
        message: `${err.name} : ${err.message}`,
      });
    })
);

export default apiStoriesProtected;
