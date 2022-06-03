export type SgiResponse<T = any> = {
  statusCode: number;
  message: string;
  data?: T | T[];
  errorMessage?: string;
  errorDetail?: Error;
}