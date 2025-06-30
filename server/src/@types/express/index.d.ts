import { User } from '../../entities/User';

declare global {
  namespace Express {
    // Extend the Request interface to include our custom properties
    export interface Request {
      user?: User;
      requestTime?: string;
    }
  }
}

// This export is needed to make this file a module
export {};
