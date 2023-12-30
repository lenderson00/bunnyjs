import { createHash } from "crypto";
import axios from "axios";
import { Upload } from "tus-js-client";

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

  async upload(params: APIClient.UploadFileRequest) {
    const expireTime = params.expireTime ?? 60 * 60 * 24 * 1000;
    const signature = this.createSignature({
      libraryId: params.libraryId,
      videoId: params.videoId,
      expireTime,
    });

    const uploadTUS = new Upload(params.file, {
      endpoint: "https://video.bunnycdn.com/tusupload",
      retryDelays: params.retryDelays ?? [
        0, 3000, 5000, 10000, 20000, 60000, 60000,
      ],
      headers: {
        AuthorizationSignature: signature,
        AuthorizationExpire: `${expireTime}`,
        VideoId: params.videoId,
        LibraryId: `${params.libraryId}`,
      },
      metadata: {
        filetype: params.metadata.filetype,
        title: params.metadata.title,
        collection: params.metadata.collection ?? "",
        thumbnailTime: `${params.metadata.thumbnailTime ?? ""}`,
      },
      onError: params.onError,
      onProgress: params.onProgress,
      onSuccess: params.onSuccess,
    });
    
    uploadTUS.findPreviousUploads().then(function (previousUploads) {
      // Found previous uploads so we select the first one.
      if (previousUploads.length) {
        uploadTUS.resumeFromPreviousUpload(previousUploads[0]);
      }

      // Start the upload
      uploadTUS.start();
    });
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
    const date = new Date(new Date().getTime() + input.expireTime);

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

  export type UploadFileRequest = {
    file: File | Blob | Pick<ReadableStreamDefaultReader<any>, "read">;
    videoId: string;
    libraryId: number;
    expireTime?: number;
    retryDelays?: number[];
    metadata: {
      filetype: string;
      title: string;
      collection?: string;
      thumbnailTime?: number;
    };
    onError?: (error: any) => void;
    onProgress?: (bytesUploaded: number, bytesTotal: number) => void;
    onSuccess?: () => void;
  };

  export type Methods = "GET" | "POST" | "PUT" | "DELETE";

  export type CreateSignatureParams = {
    libraryId: number;
    videoId: string;
    expireTime: number;
  };
}
