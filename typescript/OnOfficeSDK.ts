import { ApiCall } from './internal/ApiCall';

export class OnOfficeSDK {
  static ACTION_ID_READ = 'urn:onoffice-de-ns:smart:2.5:smartml:action:read';
  static ACTION_ID_CREATE = 'urn:onoffice-de-ns:smart:2.5:smartml:action:create';
  static ACTION_ID_MODIFY = 'urn:onoffice-de-ns:smart:2.5:smartml:action:modify';
  static ACTION_ID_GET = 'urn:onoffice-de-ns:smart:2.5:smartml:action:get';
  static ACTION_ID_DO = 'urn:onoffice-de-ns:smart:2.5:smartml:action:do';
  static ACTION_ID_DELETE = 'urn:onoffice-de-ns:smart:2.5:smartml:action:delete';

  private apiCall: ApiCall;

  constructor(apiCall?: ApiCall) {
    this.apiCall = apiCall ?? new ApiCall();
  }

  setApiVersion(version: string) {
    this.apiCall.setApiVersion(version);
  }

  setApiServer(server: string) {
    this.apiCall.setServer(server);
  }

  callGeneric(actionId: string, resourceType: string, parameters: any) {
    return this.apiCall.callByRawData(actionId, '', '', resourceType, parameters);
  }

  call(
    actionId: string,
    resourceId: string,
    identifier: string,
    resourceType: string,
    parameters: any
  ) {
    return this.apiCall.callByRawData(actionId, resourceId, identifier, resourceType, parameters);
  }

  async sendRequests(token: string, secret: string) {
    await this.apiCall.sendRequests(token, secret);
  }

  getResponseArray(number: number) {
    return this.apiCall.getResponse(number);
  }

  getErrors() {
    return this.apiCall.getErrors();
  }
}

export default OnOfficeSDK;
