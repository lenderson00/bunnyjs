import { readEnv } from "@bunnyjs/core";

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

  get(endpoint: string, input?: APIClient.Request) {
    return this.makeRequest(endpoint, "GET", input);
  }

  private makeRequest(
    endpoint: string,
    method: APIClient.Methods,
    input?: APIClient.Request
  ) {
    const url = this.buildURL(endpoint);
    
  }

  private buildURL(endpoint: string) {
    return `${this.baseUrl}${endpoint}`;
  }

  buildHeaders(input?: APIClient.Request) {
  
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
    it("should return a error if no BASE_URL was provided", () => {
      const apiParams: APIClient.Params = {
        baseUrl: "",
        accessKey: "any_key",
      };

      const createSut = () => {
        return new APIClient(apiParams);
      };

      expect(createSut).toThrow();
    });

    it("should return a error if no ACCESS_KEY was provided", () => {
      const apiParams: APIClient.Params = {
        baseUrl: "any_url",
        accessKey: "",
      };

      const createSut = () => {
        return new APIClient(apiParams);
      };

      expect(createSut).toThrow();
    });

    it("should call makeRequest with correct params", () => {
      const sut = makeSut();

      const makeRequestSpy = jest.spyOn(sut as any, "makeRequest");

      sut.get("/any_endpoint");

      expect(makeRequestSpy).toHaveBeenCalledWith(
        "/any_endpoint",
        "GET",
        undefined
      );
    });

    it("should call makeRequest only once per method", () => {
      const sut = makeSut();

      const makeRequestSpy = jest.spyOn(sut as any, "makeRequest");

      sut.get("/any_endpoint");

      expect(makeRequestSpy).toHaveBeenCalledTimes(1);
    });

    it("should call buildUrl with correct params", () => {
      const sut = makeSut();

      const buildURLSpy = jest.spyOn(sut as any, "buildURL");

      sut.get("/any_endpoint");

      expect(buildURLSpy).toHaveBeenCalledWith("/any_endpoint");
    });

    it("should buildUrl correct", () => {
      const sut = makeSut();

      const buildURLSpy = jest.spyOn(sut as any, "buildURL");

      sut.get("/any_endpoint");

      const urlBuiled = buildURLSpy.mock.results[0].value;

      expect(urlBuiled).toBe("any_url/any_endpoint");
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
