import { User } from '../app/domains/users/types';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
