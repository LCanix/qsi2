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
    force: true,
    where: {
      id,
    },
  }).then(user => {
    logger.info(`User ${user} is deleted`);
    return user;
  });
}

export function updateUser(user) {
  return Users.update(user, { where: { id: user.id } }).then(modifiedUser => {
    logger.info(`modifiedUser ${modifiedUser}`);
    return Users.findById(user.id);
  });
}
