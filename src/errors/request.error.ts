export class RequestError extends Error {
    status: number;
  
    constructor(message: string, status: number) {
      super(message);
      this.status = status;
      Object.setPrototypeOf(this, RequestError.prototype);
    }
  }
  