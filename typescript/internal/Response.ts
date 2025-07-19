import { Request } from './Request';

export class Response {
  constructor(private request: Request, private responseData: any) {}

  isValid() {
    return (
      this.responseData &&
      typeof this.responseData === 'object' &&
      'actionid' in this.responseData &&
      'resourcetype' in this.responseData &&
      'data' in this.responseData
    );
  }

  getRequest() {
    return this.request;
  }

  getResponseData() {
    return this.responseData;
  }
}
