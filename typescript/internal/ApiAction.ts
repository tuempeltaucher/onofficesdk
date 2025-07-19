declare function require(name: string): any;
const crypto = require('crypto');

export interface ApiParameters {
  [key: string]: any;
}

export class ApiAction {
  private actionParameters: Record<string, any>;

  constructor(
    actionId: string,
    resourceType: string,
    parameters: ApiParameters,
    resourceId: string = '',
    identifier: string = '',
    timestamp?: number
  ) {
    const sortedParams = Object.keys(parameters)
      .sort()
      .reduce((acc: any, key) => {
        acc[key] = parameters[key];
        return acc;
      }, {} as ApiParameters);
    this.actionParameters = {
      actionid: actionId,
      identifier,
      parameters: sortedParams,
      resourceid: resourceId,
      resourcetype: resourceType,
      timestamp,
    };
  }

  getActionParameters() {
    return this.actionParameters;
  }

  getIdentifier() {
    return crypto
      .createHash('md5')
      .update(JSON.stringify(this.actionParameters))
      .digest('hex');
  }
}
