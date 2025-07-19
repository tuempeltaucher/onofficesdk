import { Request } from './Request';
import { ApiAction } from './ApiAction';
import { Response } from './Response';

export class ApiCall {
  private requestQueue: Map<number, Request> = new Map();
  private responses: Map<number, Response> = new Map();
  private errors: Map<number, any> = new Map();
  private apiVersion = 'stable';
  private server = 'https://api.onoffice.de/api/';

  callByRawData(
    actionId: string,
    resourceId: string,
    identifier: string,
    resourceType: string,
    parameters: Record<string, any> = {}
  ) {
    const action = new ApiAction(actionId, resourceType, parameters, resourceId, identifier);
    const request = new Request(action);
    const requestId = request.getRequestId();
    this.requestQueue.set(requestId, request);
    return requestId;
  }

  async sendRequests(token: string, secret: string) {
    const actionParameters: any[] = [];
    const actionOrder: Request[] = [];

    for (const [id, request] of this.requestQueue) {
      const params = request.createRequest(token, secret);
      actionParameters.push(params);
      actionOrder.push(request);
    }

    if (actionParameters.length === 0) {
      return;
    }

    const requestBody = {
      token,
      request: {
        actions: actionParameters,
      },
    };

    const url = `${this.server}${encodeURIComponent(this.apiVersion)}/api.php`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    const json = await res.json();
    if (!json.response || !json.response.results) {
      throw new Error('No result from API');
    }
    json.response.results.forEach((result: any, index: number) => {
      const req = actionOrder[index];
      const id = req.getRequestId();
      if (result.status && result.status.errorcode === 0) {
        this.responses.set(id, new Response(req, result));
      } else {
        this.errors.set(id, result);
      }
    });
    this.requestQueue.clear();
  }

  getResponse(handle: number) {
    const resp = this.responses.get(handle);
    if (resp) {
      this.responses.delete(handle);
      return resp.getResponseData();
    }
    return undefined;
  }

  setApiVersion(version: string) {
    this.apiVersion = version;
  }

  setServer(server: string) {
    this.server = server;
  }

  getErrors() {
    return Array.from(this.errors.values());
  }
}
