import { User } from '../../entities/User';

// Extend the Express Request interface to include our custom properties
declare global {
  namespace Express {
    // Extend the Request interface to include the user property
    export interface Request {
      user?: User;
      requestTime?: string;
    }

    // Extend the Response interface if needed
    export interface Response {
      // Add any custom response methods or properties here
    }
  }
}

// This export is needed to make this file a module
export {};
