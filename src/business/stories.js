import _ from 'lodash'; // https://lodash.com/docs/
import { Stories } from '../model';

export function createStories(stories) {
  return Stories.create({
    title: stories.title,
    shortText: stories.shortText,
    fullText: stories.fullText,
    metaDatas: stories.metaDatas,
    UserId: stories.userId,
  }).then(story =>
    _.omit(
      story.get({
        plain: true,
      }),
      Stories.excludeAttributes
    )
  );
}

export function getStories() {
  return Stories.findAll().then(stories => stories);
}
