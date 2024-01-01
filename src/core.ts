import { createHash } from "crypto";
import axios from "axios";
import { Upload } from "tus-js-client";

import { BunnyValidationErrorResponse, DefaultResponse } from "./@types/bunny";

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

export interface GetClient {
  get: <T>(
    endpoint: string,
    input?: APIClient.Request
  ) => Promise<APIClient.Response<T>>;
}

export interface DeleteClient {
  delete: <T>(
    endpoint: string,
    input?: APIClient.Request
  ) => Promise<APIClient.Response<T>>;
}

export interface PostClient {
  post: <T>(
    endpoint: string,
    input?: APIClient.Request
  ) => Promise<APIClient.Response<T>>;
}

export interface PutClient {
  put: <T>(
    endpoint: string,
    input?: APIClient.Request
  ) => Promise<APIClient.Response<T>>;
}

export interface UploadClient {
  upload: (params: APIClient.UploadFileRequest) => Promise<void>;
}

export type APIClientCompose = GetClient &
  DeleteClient &
  PostClient &
  PutClient &
  UploadClient;

export abstract class APIClient {
  private baseUrl?: string;
  private accessKey?: string;

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

  protected async get<T = any>(
    endpoint: string,
    input?: APIClient.Request
  ): Promise<APIClient.Response<T>> {
    return await this.makeRequest(endpoint, "GET", input);
  }

  protected async post<T = any>(
    endpoint: string,
    input?: APIClient.Request
  ): Promise<APIClient.Response<T>> {
    return await this.makeRequest(endpoint, "POST", input);
  }

  protected async put<T = any>(
    endpoint: string,
    input?: APIClient.Request
  ): Promise<APIClient.Response<T>> {
    return await this.makeRequest(endpoint, "PUT", input);
  }

  protected async delete<T = any>(
    endpoint: string,
    input?: APIClient.Request
  ): Promise<APIClient.Response<T>> {
    return await this.makeRequest(endpoint, "DELETE", input);
  }

  protected async upload(params: APIClient.UploadFileRequest) {
    const expireTimeNormal = params.expireTime ?? 60 * 60 * 24 * 1000;

    const expireTimeUnix = new Date(new Date().getTime() + expireTimeNormal);

    const signature = this.createSignature({
      libraryId: params.libraryId,
      videoId: params.videoId,
      expireTime: expireTimeUnix,
    });

    const uploadTUS = new Upload(params.file, {
      endpoint: "https://video.bunnycdn.com/tusupload",
      retryDelays: params.retryDelays ?? [
        0, 3000, 5000, 10000, 20000, 60000, 60000,
      ],
      headers: {
        AuthorizationSignature: signature,
        AuthorizationExpire: `${expireTimeUnix.getTime()}`,
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

    await uploadTUS.findPreviousUploads().then(function (previousUploads) {
      // Found previous uploads so we select the first one.
      if (previousUploads.length) {
        uploadTUS.resumeFromPreviousUpload(previousUploads[0]);
      }

      // Start the upload
      uploadTUS.start();
    });
  }

  protected async makeRequest(
    endpoint: string,
    method: APIClient.Methods,
    input?: APIClient.Request
  ): Promise<APIClient.Response<any>> {
    const url = this.buildURL(endpoint);

    const commonOptions = {
      headers: {
        ...input?.headers,
        AccessKey: this.accessKey,
      },
    };

    let axiosConfig = {};

    // Configurações específicas para GET e DELETE (query parameters)
    if (method === "GET" || method === "DELETE") {
      axiosConfig = {
        ...commonOptions,
        params: input?.data,
      };
    }

    // Configurações específicas para POST e PUT (body)
    if (method === "POST" || method === "PUT") {
      axiosConfig = {
        ...commonOptions,
        data: input?.data,
      };
    }

    try {
      const response = await axios.request({
        url,
        method,
        ...axiosConfig,
      });

      if (response.status >= 400) {
        const errorMessage =
          response.data.title ?? response.data.Message ?? "Request failed";
        return {
          status: "failure",
          statusCode: response.status,
          data: {
            origin: "bunny.net",
            error: errorMessage,
          },
        };
      }

      return {
        status: "success",
        statusCode: response.status,
        data: response.data,
      };
    } catch (error: any) {
      if (error.response !== undefined) {
        return {
          status: "failure",
          statusCode: error.response.status ?? 500,
          data: {
            origin: "bunny.net",
            ...error.response.data,
          },
        };
      }
      return {
        status: "failure",
        statusCode: error.response.status ?? 500,
        data: {
          origin: "bunnyjs sdk",
          error: error.response.data.message ?? "Request failed",
        },
      };
    }
  }
  protected buildURL(endpoint: string) {
    return `${this.baseUrl}${endpoint}`;
  }

  protected createSignature(input: APIClient.CreateSignatureParams): string {
    const stringToSign = `${input.libraryId}${
      this.accessKey
    }${input.expireTime.getTime()}${input.videoId}`;

    const signature = createHash("sha256").update(stringToSign).digest("hex");

    return signature;
  }
}

export namespace APIClient {
  export type Params = {
    baseUrl?: string;
    accessKey?: string;
  };

  export type Request = {
    data?: any;
    headers?: any;
  };

  type successResponse<T> = {
    status: "success";
    statusCode: number;
    data: T;
  };

  type failureResponse = {
    status: "failure";
    statusCode: number;
    data:
      | BunnyValidationErrorResponse
      | DefaultResponse
      | {
          origin: string;
          error: string;
        };
  };

  export type Response<T> = successResponse<T> | failureResponse;

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
    expireTime: Date;
  };
}
