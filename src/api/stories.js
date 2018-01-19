import _ from 'lodash'; // https://lodash.com/docs/
import express from 'express';
import logger from '../logger';
import {
  createStories,
  getStories,
  getStoryById,
  deleteStory,
  updateStory,
} from '../business/stories';

export const apiStories = express.Router();
apiStories.get('/', (req, res) =>
  getStories().then(stories => {
    const ommitedStories = _.map(stories, story =>
      _.omit(
        story.get({
          plain: true,
        }),
        ['UserId', 'User.id']
      )
    );
    res.status(200).send({
      success: true,
      profile: ommitedStories,
    });
  })
);

apiStories.get('/:id', (req, res) =>
  getStoryById(req.params.id).then(story => {
    const ommitedStory = _.omit(story, ['UserId', 'User.id']);
    res.status(200).send({
      success: true,
      profile: ommitedStory,
    });
  })
);

export const apiStoriesProtected = express.Router();

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
        profile: _.omit(story, ['UserId']),
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

apiStoriesProtected.put('/:id', (req, res) =>
  updateStory({
    id: req.params.id,
    title: req.body.title,
    shortText: req.body.shortText,
    fullText: req.body.fullText,
    metaDatas: req.body.metaDatas,
  })
    .then(story => {
      const ommitedStory = _.omit(story, ['UserId', 'User.id']);
      res.status(200).send({
        success: true,
        profile: ommitedStory,
        message: 'Story updated',
      });
    })
    .catch(err => {
      logger.error(`💥 Failed to update story : ${err.stack}`);
      return res.status(500).send({
        success: false,
        message: `${err.name} : ${err.message}`,
      });
    })
);

apiStoriesProtected.delete('/:id', (req, res) =>
  deleteStory(req.params.id)
    .then(story => {
      const ommitedStory = _.omit(story, ['UserId', 'User.id']);
      logger.info(ommitedStory);
      res.status(200).send({
        success: true,
        message: 'Story deleted',
      });
    })
    .catch(err => {
      logger.error(`💥 Failed to delete story : ${err.stack}`);
      return res.status(500).send({
        success: false,
        message: `${err.name} : ${err.message}`,
      });
    })
);
