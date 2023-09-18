export type ErrorResponse = {
  status: number;
  message: string;
  method: string;
  path: string;
  details?: unknown;
  user?: {
    id: string;
    email: string;
  };
  stack?: string;
};
