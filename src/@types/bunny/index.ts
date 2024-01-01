export * from "./collection";
export * from "./video";

export type DefaultResponse = {
  success: boolean;
  message: string;
  statusCode: number;
};

export type  BunnyValidationErrorResponse = {
    type: string;
    title: string;
    status: number;
    traceId: string;
    errors: Record<string, string[]>; // Um objeto com chaves de string e valores que são arrays de strings
  };