import Container from 'typedi';
import { Action } from 'routing-controllers';
import { UserService } from '../services/UserService';

function parseBearerTokenIfPresent(action: Action) {
  const authorization: string = action.request.headers['authorization'];

  if (!authorization) {
    return null;
  }

  return authorization.replace('Bearer', '').trim();
}

export async function currentUserChecker(action: Action) {
  const userService = Container.get(UserService);

  return await userService.getByBearerToken(parseBearerTokenIfPresent(action));
}

export async function authorizationChecker(action: Action, roles: string[]) {
  const userService = Container.get(UserService);

  const user = await userService.getByBearerToken(parseBearerTokenIfPresent(action));

  if(!user){
      return false;
  }

  return roles.length == 0 || roles.includes(user.role);
}

export default {
  currentUserChecker,
  authorizationChecker,
};
