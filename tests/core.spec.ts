const readEnv = (envName: string): string | undefined => {
  if (typeof process === "undefined" || typeof process.env === "undefined") {
    return undefined;
  }

  return undefined;
};

describe("CoreTests", () => {
  describe("readEnv", () => {
    it("should return undefined if no ENV was found", () => {
      const envName = "NODE_ENV";

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
  });
});
