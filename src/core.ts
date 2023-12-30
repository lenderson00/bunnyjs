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