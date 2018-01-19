import _ from 'lodash'; // https://lodash.com/docs/
import { Users } from '../model';
import logger from '../logger';

export function createUser({ firstName, lastName, email, password }) {
  return Users.create({
    email,
    firstName: firstName || '',
    lastName: lastName || '',
    hash: password,
  }).then(user =>
    _.omit(
      user.get({
        plain: true,
      }),
      Users.excludeAttributes
    )
  );
}

export function loginUser({ email, password }) {
  return Users.findOne({
    where: {
      email,
    },
  })
    .then(
      user =>
        user && !user.deletedAt
          ? Promise.all([
              _.omit(
                user.get({
                  plain: true,
                }),
                Users.excludeAttributes
              ),
              user.comparePassword(password),
            ])
          : Promise.reject(new Error('UNKOWN OR DELETED USER'))
    )
    .then(user => user[0]);
}

export function getUser({ id }) {
  return Users.findOne({
    where: {
      id,
    },
  }).then(
    user =>
      user && !user.deletedAt
        ? _.omit(
            user.get({
              plain: true,
            }),
            Users.excludeAttributes
          )
        : Promise.reject(new Error('UNKOWN OR DELETED USER'))
  );
}

export function deleteUser({ id }) {
  return Users.destroy({
    where: {
      id,
    },
  }).then(deletedUser => {
    logger.info(`User ${deletedUser} is deleted`);
    return _.omit(
      deletedUser.get({
        plain: true,
      }),
      deletedUser.excludeAttributesForResponse
    );
  });
}

export function updateUser(user) {
  return Users.update(user, {
    where: { id: user.id },
    returning: true,
  }).then(result => {
    const modifiedUser = result[1][0];
    return _.omit(
      modifiedUser.get({
        plain: true,
      }),
      Users.excludeAttributesForResponse
    );
  });
}
