import { Stories } from '../model';
import logger from '../logger';

export function createStories(stories) {
  return Stories.create({
    title: stories.title,
    shortText: stories.shortText,
    fullText: stories.fullText,
    metaDatas: stories.metaDatas,
    UserId: stories.userId,
  }).then(story =>
    story.get({
      plain: true,
    })
  );
}

export function getStories() {
  // TODO ommit idUser
  return Stories.findAll({ include: [{ all: true }] }).then(stories => stories);
}

export function getStoryById(idStory) {
  return Stories.findOne({
    where: {
      id: idStory,
    },
    include: [{ all: true }],
  }).then(story =>
    story.get({
      plain: true,
    })
  );
}

export function deleteStory(idStory) {
  return Stories.destroy({
    where: {
      id: idStory,
    },
  }).then(story => story);
}

export function updateStory(story) {
  return Stories.update(story, {
    where: { id: story.id },
    returning: true,
  }).then(result =>
    result[1][0].get({
      plain: true,
    })
  );
}
