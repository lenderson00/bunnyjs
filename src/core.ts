import { createHash } from "crypto";
import axios from "axios";

import { RequestError } from "@bunnyjs/errors";

export const readEnv = (envName: string): string | undefined => {
  if (typeof process === "undefined" || typeof process.env === "undefined") {
    return undefined;
  }

  const env = process.env[envName];

  if (typeof env === "undefined") {
    return undefined;
  }

  return env;
};

export class APIClient {
  private baseUrl: string;
  private accessKey: string;

  constructor(params: APIClient.Params) {
    this.baseUrl = params.baseUrl;
    this.accessKey = params.accessKey;

    if (!this.baseUrl) {
      throw new Error("No BASE_URL was provided");
    }

    if (!this.accessKey) {
      throw new Error("No ACCESS_KEY was provided");
    }
  }

  async get(
    endpoint: string,
    input?: APIClient.Request
  ): Promise<APIClient.Response> {
    return this.makeRequest(endpoint, "GET", input);
  }

  async post(
    endpoint: string,
    input?: APIClient.Request
  ): Promise<APIClient.Response> {
    return this.makeRequest(endpoint, "POST", input);
  }

  async put(
    endpoint: string,
    input?: APIClient.Request
  ): Promise<APIClient.Response> {
    return this.makeRequest(endpoint, "PUT", input);
  }

  async delete(
    endpoint: string,
    input?: APIClient.Request
  ): Promise<APIClient.Response> {
    return this.makeRequest(endpoint, "DELETE", input);
  }

  private async makeRequest(
    endpoint: string,
    method: APIClient.Methods,
    input?: APIClient.Request
  ): Promise<APIClient.Response> {
    const url = this.buildURL(endpoint);
    const options = this.buildOptions(input);

    try {
      const response = await axios.request({
        url,
        method,
        ...options,
      });

      if (response.status >= 400) {
        const errorMessage =
          response.data.title ?? response.data.Message ?? "Request failed";
        const error = new RequestError(errorMessage, response.status);
        throw error;
      }

      return {
        status: "success",
        statusCode: response.status,
        data: response.data,
      };
    } catch (error: any) {
      const status = error.status ?? 400;
      const errorMessage = error.message ?? "Request failed";

      return {
        status: "failure",
        statusCode: status,
        data: {
          error: errorMessage,
        },
      };
    }
  }
  private buildURL(endpoint: string) {
    return `${this.baseUrl}${endpoint}`;
  }

  private buildOptions(input?: APIClient.Request) {
    const options = {
      body: input?.body,
      headers: {
        ...input?.headers,
        AccessKey: this.accessKey,
      },
    };

    return options;
  }

  createSignature(input: APIClient.CreateSignatureParams): string {
    const timestamp = input.expireTime ?? 60 * 60 * 24 * 1000;
    const date = new Date(new Date().getTime() + timestamp);

    const stringToSign = `${input.libraryId}${this.accessKey}${date.getTime()}${
      input.videoId
    }`;

    const signature = createHash("sha256").update(stringToSign).digest("hex");

    return signature;
  }
}

export namespace APIClient {
  export type Params = {
    baseUrl: string;
    accessKey: string;
  };

  export type Request = {
    body?: any;
    headers?: any;
  };

  export type Response = {
    status: "success" | "failure";
    statusCode: number;
    data: any;
  };

  export type Methods = "GET" | "POST" | "PUT" | "DELETE";

  export type CreateSignatureParams = {
    libraryId: number;
    videoId: string;
    expireTime?: number;
  };
}
