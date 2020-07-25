export class NotAllowedError extends Error {
  constructor(action: any) {
    super();

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, NotAllowedError);
    this.name = new.target.name;

    this.action = action;
  }

  action: any;
}
