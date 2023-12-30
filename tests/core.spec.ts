const readEnv = (envName: string): string | undefined => {
  return undefined;
};

describe("CoreTests", () => {
  describe("readEnv", () => {
    it("should return undefined if no ENV was found", () => {
      const envName = "NODE_ENV";

      const sut = readEnv(envName);

      expect(sut).toBeUndefined();
    });
  });
});
