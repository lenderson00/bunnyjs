import { readEnv } from "@bunnyjs/core";
import axios from "axios";

jest.mock("axios");

class RequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, RequestError.prototype);
  }
}

class APIClient {
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

  async get(endpoint: string, input?: APIClient.Request): Promise<any> {
    return this.makeRequest(endpoint, "GET", input);
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
}

namespace APIClient {
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
}

describe("CoreTests", () => {
  describe("readEnv", () => {
    const originalProcess = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = {};
    });

    afterEach(() => {
      process.env = originalProcess;
    });
    it("should return undefined if no ENV was found", () => {
      const envName = "FAKE_ENV";

      const sut = readEnv(envName);

      expect(sut).toBeUndefined();
    });

    it("should return undefined if no process was found", () => {
      const originalProcess = global.process;

      Object.defineProperty(global, "process", {
        value: undefined,
        writable: true,
      });

      const envName = "NODE_ENV";

      jest.mock("process", () => {
        env: undefined;
      });

      const sut = readEnv(envName);

      expect(sut).toBeUndefined();

      Object.defineProperty(global, "process", { value: originalProcess });
    });

    it("should return the ENV value if it was found", () => {
      const envName = "NODE_ENV";
      const envValue = "development";

      process.env[envName] = envValue;

      const sut = readEnv(envName);

      expect(sut).toBe(envValue);
    });
  });

  describe("APIClient", () => {
    const axiosResponse = {
      status: 200,
      data: {
        any_data: "any_data",
      },
    };

    beforeEach(() => {
      jest.clearAllMocks();

      jest.spyOn(axios, "request").mockResolvedValue(axiosResponse);
    });

    it("should return a error if no BASE_URL was provided", async () => {
      const apiParams: APIClient.Params = {
        baseUrl: "",
        accessKey: "any_key",
      };

      const createSut = () => {
        return new APIClient(apiParams);
      };

      expect(createSut).toThrow();
    });

    it("should return a error if no ACCESS_KEY was provided", async () => {
      const apiParams: APIClient.Params = {
        baseUrl: "any_url",
        accessKey: "",
      };

      const createSut = () => {
        return new APIClient(apiParams);
      };

      expect(createSut).toThrow();
    });

    it("should call makeRequest with correct params", async () => {
      const sut = makeSut();

      const makeRequestSpy = jest.spyOn(sut as any, "makeRequest");

      await sut.get("/any_endpoint");

      expect(makeRequestSpy).toHaveBeenCalledWith(
        "/any_endpoint",
        "GET",
        undefined
      );
    });

    it("should call makeRequest only once per method", async () => {
      const sut = makeSut();

      const makeRequestSpy = jest.spyOn(sut as any, "makeRequest");

      await sut.get("/any_endpoint");

      expect(makeRequestSpy).toHaveBeenCalledTimes(1);
    });

    it("should call buildUrl with correct params", async () => {
      const sut = makeSut();

      const buildURLSpy = jest.spyOn(sut as any, "buildURL");

      await sut.get("/any_endpoint");

      expect(buildURLSpy).toHaveBeenCalledWith("/any_endpoint");
    });

    it("should buildUrl correct", async () => {
      const sut = makeSut();

      const buildURLSpy = jest.spyOn(sut as any, "buildURL");

      await sut.get("/any_endpoint");

      const urlBuiled = buildURLSpy.mock.results[0].value;

      expect(urlBuiled).toBe("any_url/any_endpoint");
    });

    it("should buildOptions create a header with accessKey", async () => {
      const sut = makeSut();

      const buildOptionsSpy = jest.spyOn(sut as any, "buildOptions");

      await sut.get("/any_endpoint");

      const headers = buildOptionsSpy.mock.results[0].value;

      const expectedHeaders = {
        headers: {
          AccessKey: "any_key",
        },
      };

      expect(headers).toEqual(expectedHeaders);
    });

    it("should call axios once per request", async () => {
      const sut = makeSut();

      const axiosSpy = jest.spyOn(axios, "request");

      await sut.get("/any_endpoint");

      expect(axiosSpy).toHaveBeenCalledTimes(1);
    });

    it("should call axios with correct params", async () => {
      const sut = makeSut();

      const axiosSpy = jest.spyOn(axios, "request");

      await sut.get("/any_endpoint");

      const axiosParams = axiosSpy.mock.calls[0][0];

      const expectedParams = {
        url: "any_url/any_endpoint",
        method: "GET",
        body: undefined,
        headers: {
          AccessKey: "any_key",
        },
      };

      expect(axiosParams).toEqual(expectedParams);
    });

    it("should return a error if axios throws", async () => {
      const sut = makeSut();

      jest
        .spyOn(axios, "request")
        .mockRejectedValueOnce(new Error("any_error"));

      const promise = sut.get("/any_endpoint");

      await expect(promise).resolves.toEqual({
        status: "failure",
        statusCode: 400,
        data: {
          error: "any_error",
        },
      });
    });

    it("should return a Response if axios returns", async () => {
      const sut = makeSut();

      const result = await sut.get("/any_endpoint");

      expect(result).toEqual({
        status: "success",
        statusCode: 200,
        data: {
          any_data: "any_data",
        },
      });
    });

    it("should return a Response with status failure if axios returns a status >= 400", async () => {
      const sut = makeSut();

      jest.spyOn(axios, "request").mockResolvedValueOnce({
        status: 403,
        data: {
          any_data: "any_data",
        },
      });

      const result = await sut.get("/any_endpoint");

      expect(result.status).toEqual("failure");
      expect(result.statusCode).toEqual(403);
    });
  });
});

const makeSut = (): APIClient => {
  const apiParams: APIClient.Params = {
    baseUrl: "any_url",
    accessKey: "any_key",
  };

  return new APIClient(apiParams);
};
