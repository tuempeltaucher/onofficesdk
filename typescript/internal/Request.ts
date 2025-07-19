import { ApiAction } from './ApiAction';
declare function require(name: string): any;
const crypto = require('crypto');

export class Request {
  private apiAction: ApiAction;
  private requestId: number;
  private static requestIdStatic = 0;

  constructor(apiAction: ApiAction) {
    this.apiAction = apiAction;
    this.requestId = Request.requestIdStatic++;
  }

  createRequest(token: string, secret: string) {
    const params = { ...this.apiAction.getActionParameters() };
    params.timestamp = params.timestamp ?? Math.floor(Date.now() / 1000);
    params.hmac_version = 2;
    const fields = {
      timestamp: params.timestamp,
      token,
      resourcetype: params.resourcetype,
      actionid: params.actionid,
    };
    const hmac = crypto
      .createHmac('sha256', secret)
      .update(Object.values(fields).join(''))
      .digest();
    params.hmac = hmac.toString('base64');
    return params;
  }

  getRequestId() {
    return this.requestId;
  }

  getApiAction() {
    return this.apiAction;
  }
}
